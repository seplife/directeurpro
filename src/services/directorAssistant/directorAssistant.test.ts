import { describe, it, expect } from 'vitest';
import { ChronogramService } from './chronogramService';
import { TaskEngine } from './taskEngine';
import { SummaryService } from './summaryService';
import { DirectorTask } from '../../types';

const SETTINGS = ChronogramService.DEFAULT_SETTINGS;

describe('ChronogramService', () => {
  it('generates the 16 default tasks on a school day (Monday)', () => {
    const monday = new Date('2026-08-24T08:00:00'); // a Monday
    const tasks = ChronogramService.generateTasksForDate(monday, 'u_cde', 'school_abidjan_01', SETTINGS);
    expect(tasks.length).toBe(16);
    expect(tasks[0].title).toBe('Préparation de la journée');
    expect(tasks.every(t => t.status === 'pending')).toBe(true);
  });

  it('generates no tasks on a non-active day (Sunday)', () => {
    const sunday = new Date('2026-08-23T08:00:00'); // a Sunday
    const tasks = ChronogramService.generateTasksForDate(sunday, 'u_cde', 'school_abidjan_01', SETTINGS);
    expect(tasks.length).toBe(0);
  });

  it('respects calendar exceptions (e.g. journée pédagogique)', () => {
    const monday = new Date('2026-08-24T08:00:00');
    const dateKey = ChronogramService.toDateKey(monday);
    const tasks = ChronogramService.generateTasksForDate(monday, 'u_cde', 'school_abidjan_01', SETTINGS, [dateKey]);
    expect(tasks.length).toBe(0);
  });
});

describe('TaskEngine', () => {
  const baseTasks: DirectorTask[] = ChronogramService.generateTasksForDate(
    new Date('2026-08-24T08:00:00'),
    'u_cde',
    'school_abidjan_01',
    SETTINGS
  );

  it('marks the task whose time range contains "now" as active', () => {
    const now = new Date('2026-08-24T09:30:00'); // within "Suivi pédagogique" 09:00-10:00
    const active = TaskEngine.getActiveTask(baseTasks, now);
    expect(active?.title).toBe('Suivi pédagogique');
  });

  it('marks tasks whose end time has passed (and not completed) as overdue', () => {
    const now = new Date('2026-08-24T09:30:00');
    const derived = TaskEngine.deriveStatuses(baseTasks, now);
    const morningPrep = derived.find(t => t.title === 'Préparation de la journée');
    expect(morningPrep?.status).toBe('overdue');
  });

  it('never overrides a terminal status (completed/postponed/skipped) based on time', () => {
    const completedTask: DirectorTask = { ...baseTasks[0], status: 'completed' };
    const now = new Date('2026-08-24T20:00:00'); // long after the task's slot
    const [derived] = TaskEngine.deriveStatuses([completedTask], now);
    expect(derived.status).toBe('completed');
  });

  it('computes progress as completed / total tasks', () => {
    const withOneDone = baseTasks.map((t, idx) => (idx === 0 ? { ...t, status: 'completed' as const } : t));
    const progress = TaskEngine.computeProgress(withOneDone);
    expect(progress).toBe(Math.round((1 / baseTasks.length) * 100));
  });
});

describe('SummaryService', () => {
  it('generates a daily summary with a non-empty priorities list', () => {
    const tasks = ChronogramService.generateTasksForDate(
      new Date('2026-08-24T08:00:00'),
      'u_cde',
      'school_abidjan_01',
      SETTINGS
    ).map((t, idx) => (idx < 3 ? { ...t, status: 'postponed' as const } : t));

    const summary = SummaryService.generateDailySummary(tasks, [], [], new Date('2026-08-24T18:00:00'));
    expect(summary.tasksPostponed).toBe(3);
    expect(summary.tomorrowPriorities.length).toBeGreaterThan(0);
  });
});
