import { db } from '@repo/database/client';
import { type Issue, activityLogs, issues, teams } from '@repo/database/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import type { CreateIssueInput, IssueFilterInput } from '../schemas/issue.schema';
import { logActivity } from './activity.service';
import { createNotification } from './notification.service';

/**
 * Issue Service
 * Handles all issue-related business logic
 * Following clean architecture: business logic separated from HTTP layer
 */

/**
 * Generate unique issue identifier for a team (e.g., "ENG-123")
 * @param teamId - Team ID
 * @returns Issue identifier string
 */
async function generateIssueIdentifier(teamId: string): Promise<string> {
  try {
    // Get team identifier (e.g., "ENG")
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
      columns: { identifier: true },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    // Get the highest issue number for this team
    const lastIssue = await db.query.issues.findFirst({
      where: eq(issues.teamId, teamId),
      orderBy: [desc(issues.createdAt)],
      columns: { identifier: true },
    });

    let nextNumber = 1;
    if (lastIssue?.identifier) {
      // Extract number from identifier (e.g., "ENG-123" -> 123)
      const match = lastIssue.identifier.match(/-(\d+)$/);
      if (match?.[1]) {
        nextNumber = Number.parseInt(match[1], 10) + 1;
      }
    }

    return `${team.identifier}-${nextNumber}`;
  } catch (error) {
    console.error('Generate issue identifier error:', error);
    throw error;
  }
}

/**
 * Create a new issue
 * @param teamId - Team ID
 * @param data - Issue data
 * @param userId - User ID creating the issue
 * @returns Created issue
 */
export async function createIssue(
  teamId: string,
  data: CreateIssueInput,
  userId: string
): Promise<Issue> {
  try {
    // Generate unique identifier
    const identifier = await generateIssueIdentifier(teamId);

    // Create issue
    const [issue] = await db
      .insert(issues)
      .values({
        ...data,
        teamId,
        identifier,
        creatorId: userId,
        sortOrder: Date.now(), // Use timestamp as default sort order
      })
      .returning();

    if (!issue) {
      throw new Error('Failed to create issue');
    }

    // Log activity
    await logActivity({
      workspaceId: issue.teamId, // Note: In production, get workspace from team
      userId,
      entityType: 'issue',
      entityId: issue.id,
      action: 'created',
      metadata: {
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
      },
    });

    // Send notification to assignee if assigned
    if (issue.assigneeId && issue.assigneeId !== userId) {
      await createNotification({
        userId: issue.assigneeId,
        type: 'assignment',
        entityType: 'issue',
        entityId: issue.id,
      });
    }

    return issue;
  } catch (error) {
    console.error('Create issue error:', error);
    throw error;
  }
}

/**
 * Update an issue
 * @param issueId - Issue ID
 * @param data - Updated issue data
 * @param userId - User ID performing the update
 * @returns Updated issue
 */
export async function updateIssue(
  issueId: string,
  data: Partial<Omit<Issue, 'id' | 'teamId' | 'identifier' | 'creatorId' | 'createdAt'>>,
  userId: string
): Promise<Issue> {
  try {
    // Get existing issue for comparison
    const existingIssue = await db.query.issues.findFirst({
      where: eq(issues.id, issueId),
    });

    if (!existingIssue) {
      throw new Error('Issue not found');
    }

    // Update issue
    const [updatedIssue] = await db
      .update(issues)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, issueId))
      .returning();

    if (!updatedIssue) {
      throw new Error('Failed to update issue');
    }

    // Prepare metadata for activity log
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    const changedFields = Object.keys(data) as Array<keyof typeof data>;

    for (const field of changedFields) {
      if (field === 'updatedAt') continue;
      const oldValue = existingIssue[field];
      const newValue = data[field];
      if (oldValue !== newValue) {
        changes[field] = { from: oldValue, to: newValue };
      }
    }

    // Log activity for changes
    if (Object.keys(changes).length > 0) {
      await logActivity({
        workspaceId: updatedIssue.teamId,
        userId,
        entityType: 'issue',
        entityId: updatedIssue.id,
        action: 'updated',
        metadata: {
          title: updatedIssue.title,
          changes,
        },
      });
    }

    // Send notification if assignee changed
    if (
      data.assigneeId !== undefined &&
      data.assigneeId !== existingIssue.assigneeId &&
      data.assigneeId !== userId
    ) {
      if (data.assigneeId) {
        await createNotification({
          userId: data.assigneeId,
          type: 'assignment',
          entityType: 'issue',
          entityId: updatedIssue.id,
        });
      }
    }

    return updatedIssue;
  } catch (error) {
    console.error('Update issue error:', error);
    throw error;
  }
}

/**
 * Filter issues with complex criteria
 * @param teamId - Team ID
 * @param filters - Filter criteria
 * @returns Filtered issues with pagination
 */
export async function filterIssues(
  teamId: string,
  filters: IssueFilterInput
): Promise<{
  issues: Issue[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}> {
  try {
    const {
      status,
      priority,
      assigneeId,
      projectId,
      cycleId,
      archived = false,
      page = 1,
      limit = 50,
    } = filters;

    // Build where conditions
    const conditions = [eq(issues.teamId, teamId), eq(issues.archived, archived)];

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      conditions.push(inArray(issues.status, statusArray));
    }

    if (priority) {
      const priorityArray = Array.isArray(priority) ? priority : [priority];
      conditions.push(inArray(issues.priority, priorityArray));
    }

    if (assigneeId) {
      conditions.push(eq(issues.assigneeId, assigneeId));
    }

    if (projectId) {
      conditions.push(eq(issues.projectId, projectId));
    }

    if (cycleId) {
      conditions.push(eq(issues.cycleId, cycleId));
    }

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .where(and(...conditions));

    const totalCount = Number(countResult?.count ?? 0);
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated results
    const filteredIssues = await db.query.issues.findMany({
      where: and(...conditions),
      orderBy: [desc(issues.sortOrder), desc(issues.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: {
        assignee: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        creator: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      issues: filteredIssues,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Filter issues error:', error);
    throw error;
  }
}

/**
 * Reorder issues for drag-and-drop
 * @param issueId - Issue ID to reorder
 * @param newSortOrder - New sort order value
 * @param userId - User ID performing the reorder
 */
export async function reorderIssues(
  issueId: string,
  newSortOrder: number,
  userId: string
): Promise<Issue> {
  try {
    const [updatedIssue] = await db
      .update(issues)
      .set({
        sortOrder: newSortOrder,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, issueId))
      .returning();

    if (!updatedIssue) {
      throw new Error('Issue not found');
    }

    // Log activity
    await logActivity({
      workspaceId: updatedIssue.teamId,
      userId,
      entityType: 'issue',
      entityId: updatedIssue.id,
      action: 'updated',
      metadata: {
        title: updatedIssue.title,
        changes: {
          sortOrder: { from: null, to: newSortOrder },
        },
      },
    });

    return updatedIssue;
  } catch (error) {
    console.error('Reorder issues error:', error);
    throw error;
  }
}

/**
 * Get activity logs for an issue
 * @param issueId - Issue ID
 * @param limit - Number of activities to fetch
 * @returns Activity logs
 */
export async function getIssueActivity(issueId: string, limit = 50) {
  try {
    const activities = await db.query.activityLogs.findMany({
      where: and(eq(activityLogs.entityType, 'issue'), eq(activityLogs.entityId, issueId)),
      orderBy: [desc(activityLogs.createdAt)],
      limit,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return activities;
  } catch (error) {
    console.error('Get issue activity error:', error);
    throw error;
  }
}

/**
 * Archive an issue
 * @param issueId - Issue ID
 * @param userId - User ID performing the action
 */
export async function archiveIssue(issueId: string, userId: string): Promise<Issue> {
  try {
    const [archivedIssue] = await db
      .update(issues)
      .set({
        archived: true,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, issueId))
      .returning();

    if (!archivedIssue) {
      throw new Error('Issue not found');
    }

    // Log activity
    await logActivity({
      workspaceId: archivedIssue.teamId,
      userId,
      entityType: 'issue',
      entityId: archivedIssue.id,
      action: 'archived',
      metadata: {
        title: archivedIssue.title,
      },
    });

    return archivedIssue;
  } catch (error) {
    console.error('Archive issue error:', error);
    throw error;
  }
}

/**
 * Get a single issue by ID
 * @param issueId - Issue ID
 * @returns Issue with relations
 */
export async function getIssueById(issueId: string): Promise<Issue | undefined> {
  try {
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, issueId),
      with: {
        assignee: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        creator: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        team: {
          columns: {
            id: true,
            name: true,
            identifier: true,
          },
        },
        project: {
          columns: {
            id: true,
            name: true,
            color: true,
          },
        },
        cycle: {
          columns: {
            id: true,
            name: true,
            number: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return issue;
  } catch (error) {
    console.error('Get issue by ID error:', error);
    throw error;
  }
}

/**
 * Delete an issue (soft delete via archive in production)
 * @param issueId - Issue ID
 * @param userId - User ID performing the deletion
 */
export async function deleteIssue(issueId: string, userId: string): Promise<void> {
  try {
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, issueId),
      columns: { id: true, teamId: true, title: true },
    });

    if (!issue) {
      throw new Error('Issue not found');
    }

    // In production, prefer soft delete (archive)
    // For now, hard delete as per requirements
    await db.delete(issues).where(eq(issues.id, issueId));

    // Log activity
    await logActivity({
      workspaceId: issue.teamId,
      userId,
      entityType: 'issue',
      entityId: issue.id,
      action: 'deleted',
      metadata: {
        title: issue.title,
      },
    });
  } catch (error) {
    console.error('Delete issue error:', error);
    throw error;
  }
}
