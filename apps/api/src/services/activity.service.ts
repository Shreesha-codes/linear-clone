import { db } from '@repo/database/client';
import { type InsertActivityLog, activityLogs } from '@repo/database/schema';
import { and, desc, eq } from 'drizzle-orm';

/**
 * Activity Service
 * Handles activity logging for audit trail
 */

/**
 * Log an activity
 * @param data - Activity log data
 */
export async function logActivity(
  data: Omit<InsertActivityLog, 'id' | 'createdAt'>
): Promise<void> {
  try {
    await db.insert(activityLogs).values({
      workspaceId: data.workspaceId,
      userId: data.userId,
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      metadata: data.metadata,
    });
  } catch (error) {
    // Log activity errors shouldn't break the main flow
    console.error('Log activity error:', error);
  }
}

/**
 * Get activity feed for a user
 * @param userId - User ID
 * @param limit - Number of activities to fetch
 * @param offset - Offset for pagination
 * @returns Activity logs
 */
export async function getActivityFeed(userId: string, limit = 50, offset = 0) {
  try {
    const activities = await db.query.activityLogs.findMany({
      where: eq(activityLogs.userId, userId),
      orderBy: [desc(activityLogs.createdAt)],
      limit,
      offset,
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
    console.error('Get activity feed error:', error);
    throw error;
  }
}

/**
 * Get activity feed for a workspace
 * @param workspaceId - Workspace ID
 * @param limit - Number of activities to fetch
 * @param offset - Offset for pagination
 * @returns Activity logs
 */
export async function getWorkspaceActivity(workspaceId: string, limit = 50, offset = 0) {
  try {
    const activities = await db.query.activityLogs.findMany({
      where: eq(activityLogs.workspaceId, workspaceId),
      orderBy: [desc(activityLogs.createdAt)],
      limit,
      offset,
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
    console.error('Get workspace activity error:', error);
    throw error;
  }
}

/**
 * Get activity for a specific entity
 * @param entityType - Entity type (issue, project, etc.)
 * @param entityId - Entity ID
 * @param limit - Number of activities to fetch
 * @returns Activity logs
 */
export async function getEntityActivity(
  entityType: 'issue' | 'project' | 'cycle' | 'comment' | 'team' | 'workspace',
  entityId: string,
  limit = 50
) {
  try {
    const activities = await db.query.activityLogs.findMany({
      where: and(eq(activityLogs.entityType, entityType), eq(activityLogs.entityId, entityId)),
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
    console.error('Get entity activity error:', error);
    throw error;
  }
}
