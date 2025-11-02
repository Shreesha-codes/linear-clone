import { db } from '@repo/database/client';
import { cycles, issues } from '@repo/database/schema';
import { and, count, eq, gte, lte } from 'drizzle-orm';

/**
 * Cycle Service
 * Handles cycle/sprint-related business logic
 */

/**
 * Get active cycles (currently running)
 * @param teamId - Team ID
 * @returns Active cycles
 */
export async function getActiveCycles(teamId: string) {
  try {
    const now = new Date();
    const today: string = now.toISOString().split('T')[0] as string; // Format as YYYY-MM-DD

    const activeCycles = await db.query.cycles.findMany({
      where: and(
        eq(cycles.teamId, teamId),
        lte(cycles.startDate, today),
        gte(cycles.endDate, today)
      ),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            identifier: true,
          },
        },
      },
    });

    return activeCycles;
  } catch (error) {
    console.error('Get active cycles error:', error);
    throw error;
  }
}

/**
 * Calculate cycle completion percentage
 * @param cycleId - Cycle ID
 * @returns Completion percentage (0-100)
 */
export async function calculateCycleProgress(cycleId: string): Promise<number> {
  try {
    // Get total issues in cycle
    const [totalResult] = await db
      .select({ count: count() })
      .from(issues)
      .where(and(eq(issues.cycleId, cycleId), eq(issues.archived, false)));

    const totalIssues = totalResult?.count ?? 0;

    if (totalIssues === 0) {
      return 0;
    }

    // Get completed issues (status = 'done')
    const [completedResult] = await db
      .select({ count: count() })
      .from(issues)
      .where(
        and(eq(issues.cycleId, cycleId), eq(issues.status, 'done'), eq(issues.archived, false))
      );

    const completedIssues = completedResult?.count ?? 0;

    // Calculate percentage
    const percentage = Math.round((completedIssues / totalIssues) * 100);
    return percentage;
  } catch (error) {
    console.error('Calculate cycle progress error:', error);
    throw error;
  }
}

/**
 * Get cycle statistics (issue counts by status)
 * @param cycleId - Cycle ID
 * @returns Issue counts by status
 */
export async function getCycleStats(cycleId: string): Promise<{
  total: number;
  backlog: number;
  todo: number;
  inProgress: number;
  done: number;
  cancelled: number;
}> {
  try {
    // Get all non-archived issues for the cycle
    const cycleIssues = await db.query.issues.findMany({
      where: and(eq(issues.cycleId, cycleId), eq(issues.archived, false)),
      columns: {
        status: true,
      },
    });

    const stats = {
      total: cycleIssues.length,
      backlog: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      cancelled: 0,
    };

    for (const issue of cycleIssues) {
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
    console.error('Get cycle stats error:', error);
    throw error;
  }
}

/**
 * Get cycles by team
 * @param teamId - Team ID
 * @param includeCompleted - Include past cycles
 * @returns Cycles
 */
export async function getCyclesByTeam(teamId: string, includeCompleted = false) {
  try {
    type CycleWithTeam = Awaited<ReturnType<typeof db.query.cycles.findMany>>;
    let teamCycles: CycleWithTeam;

    if (includeCompleted) {
      // Get all cycles
      teamCycles = await db.query.cycles.findMany({
        where: eq(cycles.teamId, teamId),
        with: {
          team: {
            columns: {
              id: true,
              name: true,
              identifier: true,
            },
          },
        },
      });
    } else {
      // Get only current and future cycles
      const now = new Date();
      const today: string = now.toISOString().split('T')[0] as string;

      teamCycles = await db.query.cycles.findMany({
        where: and(eq(cycles.teamId, teamId), gte(cycles.endDate, today)),
        with: {
          team: {
            columns: {
              id: true,
              name: true,
              identifier: true,
            },
          },
        },
      });
    }

    return teamCycles;
  } catch (error) {
    console.error('Get cycles by team error:', error);
    throw error;
  }
}

/**
 * Get cycle by ID with full details
 * @param cycleId - Cycle ID
 * @returns Cycle with relations
 */
export async function getCycleById(cycleId: string) {
  try {
    const cycle = await db.query.cycles.findFirst({
      where: eq(cycles.id, cycleId),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            identifier: true,
          },
        },
      },
    });

    return cycle;
  } catch (error) {
    console.error('Get cycle by ID error:', error);
    throw error;
  }
}

/**
 * Get issues for a cycle
 * @param cycleId - Cycle ID
 * @param includeArchived - Include archived issues
 * @returns Issues
 */
export async function getCycleIssues(cycleId: string, includeArchived = false) {
  try {
    const conditions = [eq(issues.cycleId, cycleId)];

    if (!includeArchived) {
      conditions.push(eq(issues.archived, false));
    }

    const cycleIssues = await db.query.issues.findMany({
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

    return cycleIssues;
  } catch (error) {
    console.error('Get cycle issues error:', error);
    throw error;
  }
}

/**
 * Get cycle progress over time (for burndown chart)
 * @param cycleId - Cycle ID
 * @returns Daily progress data
 */
export async function getCycleBurndown(cycleId: string): Promise<
  Array<{
    date: string;
    completed: number;
    remaining: number;
  }>
> {
  try {
    const cycle = await getCycleById(cycleId);
    if (!cycle) {
      throw new Error('Cycle not found');
    }

    // Get total issues
    const [totalResult] = await db
      .select({ count: count() })
      .from(issues)
      .where(and(eq(issues.cycleId, cycleId), eq(issues.archived, false)));

    const totalIssues = totalResult?.count ?? 0;

    // Get completed issues
    const [completedResult] = await db
      .select({ count: count() })
      .from(issues)
      .where(
        and(eq(issues.cycleId, cycleId), eq(issues.status, 'done'), eq(issues.archived, false))
      );

    const completedIssues = completedResult?.count ?? 0;
    const remainingIssues = totalIssues - completedIssues;

    // For MVP, return current state
    // In production, you'd track daily snapshots in a separate table
    return [
      {
        date: new Date().toISOString().split('T')[0] ?? '',
        completed: completedIssues,
        remaining: remainingIssues,
      },
    ];
  } catch (error) {
    console.error('Get cycle burndown error:', error);
    throw error;
  }
}
