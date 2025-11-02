import { db } from '@repo/database/client';
import { type InsertNotification, notifications } from '@repo/database/schema';
import { and, desc, eq } from 'drizzle-orm';

/**
 * Notification Service
 * Handles notification creation and delivery
 */

/**
 * Create a notification
 * @param data - Notification data
 */
export async function createNotification(
  data: Omit<InsertNotification, 'id' | 'createdAt' | 'read' | 'archived'>
): Promise<void> {
  try {
    await db.insert(notifications).values({
      userId: data.userId,
      type: data.type,
      entityType: data.entityType,
      entityId: data.entityId,
    });
  } catch (error) {
    // Notification errors shouldn't break the main flow
    console.error('Create notification error:', error);
  }
}

/**
 * Send notification for assignment changes
 * @param assigneeId - User ID being assigned
 * @param entityType - Entity type (issue, project, etc.)
 * @param entityId - Entity ID
 */
export async function sendAssignmentNotification(
  assigneeId: string,
  entityType: string,
  entityId: string
): Promise<void> {
  try {
    await createNotification({
      userId: assigneeId,
      type: 'assignment',
      entityType,
      entityId,
    });
  } catch (error) {
    console.error('Send assignment notification error:', error);
  }
}

/**
 * Parse markdown content for @mentions and send notifications
 * @param content - Markdown content to parse
 * @param entityType - Entity type (comment, issue, etc.)
 * @param entityId - Entity ID
 * @param authorId - User ID of the author (to exclude from mentions)
 * @param userMap - Map of username to user ID
 */
export async function sendMentionNotifications(
  content: string,
  entityType: string,
  entityId: string,
  authorId: string,
  userMap: Map<string, string> = new Map()
): Promise<void> {
  try {
    // Extract mentions from markdown content (e.g., @username or @user-name)
    const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
    const mentions = [...content.matchAll(mentionRegex)];

    const uniqueMentions = new Set<string>();

    for (const match of mentions) {
      const username = match[1];
      if (username) {
        const userId = userMap.get(username.toLowerCase());
        if (userId && userId !== authorId) {
          uniqueMentions.add(userId);
        }
      }
    }

    // Send notifications to mentioned users
    for (const userId of uniqueMentions) {
      await createNotification({
        userId,
        type: 'mention',
        entityType,
        entityId,
      });
    }
  } catch (error) {
    console.error('Send mention notifications error:', error);
  }
}

/**
 * Get notifications for a user
 * @param userId - User ID
 * @param unreadOnly - Filter to unread only
 * @param limit - Number of notifications to fetch
 * @param offset - Offset for pagination
 * @returns Notifications
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly = false,
  limit = 50,
  offset = 0
) {
  try {
    const conditions = [eq(notifications.userId, userId), eq(notifications.archived, false)];

    if (unreadOnly) {
      conditions.push(eq(notifications.read, false));
    }

    const userNotifications = await db.query.notifications.findMany({
      where: and(...conditions),
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    });

    return userNotifications;
  } catch (error) {
    console.error('Get user notifications error:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 * @param notificationId - Notification ID
 * @param userId - User ID (for authorization)
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<void> {
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 * @param userId - User ID
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
}

/**
 * Archive a notification
 * @param notificationId - Notification ID
 * @param userId - User ID (for authorization)
 */
export async function archiveNotification(notificationId: string, userId: string): Promise<void> {
  try {
    await db
      .update(notifications)
      .set({ archived: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  } catch (error) {
    console.error('Archive notification error:', error);
    throw error;
  }
}
