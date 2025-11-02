import { db } from '@repo/database/client';
import { issues, projects } from '@repo/database/schema';
import { and, count, eq } from 'drizzle-orm';

/**
 * Project Service
 * Handles project-related business logic
 */

/**
 * Calculate project completion percentage
 * @param projectId - Project ID
 * @returns Completion percentage (0-100)
 */
export async function calculateProjectProgress(projectId: string): Promise<number> {
  try {
    // Get total issues in project
    const [totalResult] = await db
      .select({ count: count() })
      .from(issues)
      .where(and(eq(issues.projectId, projectId), eq(issues.archived, false)));

    const totalIssues = totalResult?.count ?? 0;

    if (totalIssues === 0) {
      return 0;
    }

    // Get completed issues (status = 'done')
    const [completedResult] = await db
      .select({ count: count() })
      .from(issues)
      .where(
        and(eq(issues.projectId, projectId), eq(issues.status, 'done'), eq(issues.archived, false))
      );

    const completedIssues = completedResult?.count ?? 0;

    // Calculate percentage
    const percentage = Math.round((completedIssues / totalIssues) * 100);
    return percentage;
  } catch (error) {
    console.error('Calculate project progress error:', error);
    throw error;
  }
}

/**
 * Get project statistics (issue counts by status)
 * @param projectId - Project ID
 * @returns Issue counts by status
 */
export async function getProjectStats(projectId: string): Promise<{
  total: number;
  backlog: number;
  todo: number;
  inProgress: number;
  done: number;
  cancelled: number;
}> {
  try {
    // Get all non-archived issues for the project
    const projectIssues = await db.query.issues.findMany({
      where: and(eq(issues.projectId, projectId), eq(issues.archived, false)),
      columns: {
        status: true,
      },
    });

    const stats = {
      total: projectIssues.length,
      backlog: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      cancelled: 0,
    };

    for (const issue of projectIssues) {
      switch (issue.status) {
        case 'backlog':
          stats.backlog++;
          break;
        case 'todo':
          stats.todo++;
          break;
        case 'in_progress':
          stats.inProgress++;
          break;
        case 'done':
          stats.done++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }
    }

    return stats;
  } catch (error) {
    console.error('Get project stats error:', error);
    throw error;
  }
}

/**
 * Get projects by team
 * @param teamId - Team ID
 * @param includeArchived - Include archived projects
 * @returns Projects
 */
export async function getProjectsByTeam(teamId: string, includeArchived = false) {
  try {
    const conditions = [eq(projects.teamId, teamId)];

    if (!includeArchived) {
      conditions.push(eq(projects.archived, false));
    }

    const teamProjects = await db.query.projects.findMany({
      where: and(...conditions),
      with: {
        lead: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return teamProjects;
  } catch (error) {
    console.error('Get projects by team error:', error);
    throw error;
  }
}

/**
 * Get project by ID with full details
 * @param projectId - Project ID
 * @returns Project with relations
 */
export async function getProjectById(projectId: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            identifier: true,
          },
        },
        lead: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return project;
  } catch (error) {
    console.error('Get project by ID error:', error);
    throw error;
  }
}

/**
 * Get issues for a project
 * @param projectId - Project ID
 * @param includeArchived - Include archived issues
 * @returns Issues
 */
export async function getProjectIssues(projectId: string, includeArchived = false) {
  try {
    const conditions = [eq(issues.projectId, projectId)];

    if (!includeArchived) {
      conditions.push(eq(issues.archived, false));
    }

    const projectIssues = await db.query.issues.findMany({
      where: and(...conditions),
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

    return projectIssues;
  } catch (error) {
    console.error('Get project issues error:', error);
    throw error;
  }
}
