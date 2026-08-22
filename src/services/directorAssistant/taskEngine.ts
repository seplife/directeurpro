import { DirectorAssistantSettings, DirectorTask } from '../../types';

/**
 * TaskEngine
 * -----------
 * Implements the reminder cycle described in the spec:
 *
 *   HEURE ACTUELLE → RÉCUPÉRER LES TÂCHES DU JOUR → IDENTIFIER LA TÂCHE ACTIVE
 *   → VÉRIFIER SON STATUT → (terminée | en cours | en attente | reportée | dépassée)
 *
 * Terminal states (completed / postponed / skipped) are explicit user
 * actions persisted in AppContext. Everything else (pending / active /
 * overdue) is *derived* live from the wall-clock time on every render —
 * this is deliberate: without a real backend cron/job scheduler, deriving
 * status from time comparison is self-correcting and never goes stale,
 * which is safer than trying to mutate state on a timer.
 */

const TERMINAL_STATUSES: DirectorTask['status'][] = ['completed', 'postponed', 'skipped'];

export class TaskEngine {
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
   * Returns a new array with each task's `status` recomputed against `now`
   * for non-terminal tasks. Terminal tasks (completed/postponed/skipped)
   * are left untouched — they represent a real decision already made.
   */
  static deriveStatuses(tasks: DirectorTask[], now: Date): DirectorTask[] {
    const nowMin = this.nowMinutes(now);

    return tasks.map(task => {
      if (TERMINAL_STATUSES.includes(task.status)) return task;

      const start = this.timeToMinutes(task.startTime);
      const end = this.timeToMinutes(task.endTime);

      let status: DirectorTask['status'];
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

  /** The single task the Director of Studies should be doing right now. */
  static getActiveTask(tasks: DirectorTask[], now: Date): DirectorTask | null {
    const derived = this.deriveStatuses(tasks, now);
    return derived.find(t => t.status === 'active') || null;
  }

  /** The next upcoming (pending) task, chronologically. */
  static getNextTask(tasks: DirectorTask[], now: Date): DirectorTask | null {
    const derived = this.deriveStatuses(tasks, now);
    const upcoming = derived
      .filter(t => t.status === 'pending')
      .sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
    return upcoming[0] || null;
  }

  static getOverdueTasks(tasks: DirectorTask[], now: Date): DirectorTask[] {
    return this.deriveStatuses(tasks, now).filter(t => t.status === 'overdue');
  }

  /** Minutes remaining until the end of the currently active task (0 if none active). */
  static minutesRemaining(task: DirectorTask, now: Date): number {
    const end = this.timeToMinutes(task.endTime);
    return Math.max(0, end - this.nowMinutes(now));
  }

  /** Percentage progress of the day: tasks completed / total scheduled tasks. */
  static computeProgress(tasks: DirectorTask[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }

  /**
   * Whether a reminder should currently be shown for a pending task about
   * to start, based on the configured lead time (spec §6, "rappel intelligent").
   */
  static isUpcomingReminderDue(task: DirectorTask, now: Date, settings: DirectorAssistantSettings): boolean {
    if (task.status !== 'pending') return false;
    const start = this.timeToMinutes(task.startTime);
    const nowMin = this.nowMinutes(now);
    return start - nowMin <= settings.remindBeforeTaskMinutes && start - nowMin >= 0;
  }

  /**
   * Whether an "en retard" alert should fire for a task still active/overdue
   * beyond the configured overdue delay (spec §6, "alerte").
   */
  static isOverdueAlertDue(task: DirectorTask, now: Date, settings: DirectorAssistantSettings): boolean {
    if (task.status !== 'overdue') return false;
    const end = this.timeToMinutes(task.endTime);
    const nowMin = this.nowMinutes(now);
    return nowMin - end >= settings.overdueAlertDelayMinutes;
  }
}
