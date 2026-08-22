import { EducatorAssistantSettings, EducatorDailyTask } from '../../types';

const TERMINAL_STATUSES: EducatorDailyTask['status'][] = ['completed', 'postponed', 'skipped'];

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingTask?: EducatorDailyTask;
  suggestedSlot?: { start: string; end: string };
}

export class EducatorTaskService {
  static timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  static minutesToTime(totalMinutes: number): string {
    const clamped = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
    const h = Math.floor(clamped / 60);
    const m = clamped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  private static nowMinutes(now: Date): number {
    return now.getHours() * 60 + now.getMinutes();
  }

  /**
   * Recomputes task status dynamically based on the current wall-clock time.
   * Terminal statuses (completed/postponed/skipped) are preserved.
   */
  static deriveStatuses(tasks: EducatorDailyTask[], now: Date): EducatorDailyTask[] {
    const nowMin = this.nowMinutes(now);

    return tasks.map(task => {
      if (TERMINAL_STATUSES.includes(task.status)) return task;

      const start = this.timeToMinutes(task.startTime);
      const end = this.timeToMinutes(task.endTime);

      let status: EducatorDailyTask['status'];
      if (nowMin < start) {
        status = 'pending';
      } else if (nowMin >= start && nowMin <= end) {
        status = 'active';
      } else {
        status = 'overdue';
      }

      return status === task.status ? task : { ...task, status };
    });
  }

  /** Gets the single task currently in its active time window. */
  static getActiveTask(tasks: EducatorDailyTask[], now: Date): EducatorDailyTask | null {
    const derived = this.deriveStatuses(tasks, now);
    return derived.find(t => t.status === 'active') || null;
  }

  /** Gets the next upcoming (pending) task in chronological order. */
  static getNextTask(tasks: EducatorDailyTask[], now: Date): EducatorDailyTask | null {
    const derived = this.deriveStatuses(tasks, now);
    const upcoming = derived
      .filter(t => t.status === 'pending')
      .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
    return upcoming[0] || null;
  }

  /** Gets all tasks whose time has elapsed without being completed or postponed. */
  static getOverdueTasks(tasks: EducatorDailyTask[], now: Date): EducatorDailyTask[] {
    return this.deriveStatuses(tasks, now).filter(t => t.status === 'overdue');
  }

  /** Minutes remaining until the end of the specified task. */
  static minutesRemaining(task: EducatorDailyTask, now: Date): number {
    const end = this.timeToMinutes(task.endTime);
    return Math.max(0, end - this.nowMinutes(now));
  }

  /** Computes day completion progress (0-100%). */
  static computeProgress(tasks: EducatorDailyTask[]): { completed: number; total: number; percent: number } {
    if (tasks.length === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = tasks.filter(t => t.status === 'completed').length;
    const percent = Math.round((completed / tasks.length) * 100);
    return { completed, total: tasks.length, percent };
  }

  /**
   * Checks whether postponing a task to [newStartTime, newEndTime] collides with
   * another non-completed task on the schedule.
   */
  static checkConflict(
    tasks: EducatorDailyTask[],
    taskId: string,
    newStartTime: string,
    newEndTime: string
  ): ConflictCheckResult {
    const newStart = this.timeToMinutes(newStartTime);
    const newEnd = this.timeToMinutes(newEndTime);

    const conflicting = tasks.find(t => {
      if (t.id === taskId || t.status === 'completed' || t.status === 'skipped') return false;
      const tStart = this.timeToMinutes(t.startTime);
      const tEnd = this.timeToMinutes(t.endTime);
      // Overlap condition: start < otherEnd && end > otherStart
      return newStart < tEnd && newEnd > tStart;
    });

    if (conflicting) {
      // Suggest slot immediately after conflicting task
      const confEnd = this.timeToMinutes(conflicting.endTime);
      const duration = newEnd - newStart;
      return {
        hasConflict: true,
        conflictingTask: conflicting,
        suggestedSlot: {
          start: this.minutesToTime(confEnd),
          end: this.minutesToTime(confEnd + duration)
        }
      };
    }

    return { hasConflict: false };
  }

  /** Checks if a reminder notification should fire before task start. */
  static isUpcomingReminderDue(task: EducatorDailyTask, now: Date, settings: EducatorAssistantSettings): boolean {
    if (task.status !== 'pending') return false;
    const start = this.timeToMinutes(task.startTime);
    const nowMin = this.nowMinutes(now);
    return start - nowMin <= settings.remindBeforeTaskMinutes && start - nowMin >= 0;
  }

  /** Checks if an overdue alert notification should fire. */
  static isOverdueAlertDue(task: EducatorDailyTask, now: Date, settings: EducatorAssistantSettings): boolean {
    if (task.status !== 'overdue') return false;
    const end = this.timeToMinutes(task.endTime);
    const nowMin = this.nowMinutes(now);
    return nowMin - end >= settings.overdueAlertDelayMinutes;
  }
}
