import { describe, it, expect } from 'vitest';
import { EducatorChronogramService } from './educatorChronogramService';
import { EducatorTaskService } from './educatorTaskService';
import { EducatorAlertService } from './educatorAlertService';
import { EducatorDailySummaryService } from './educatorDailySummaryService';
import { EducatorWeeklyReportService } from './educatorWeeklyReportService';
import { EducatorDailyTask, Student, EducatorSanction, DisciplinaryEvent } from '../../types';

const SETTINGS = EducatorChronogramService.DEFAULT_SETTINGS;

const SAMPLE_STUDENTS: Student[] = [
  {
    id: 'std_test_01',
    schoolId: 'school_01',
    classId: 'c_3a',
    className: '3ème 1',
    matricule: 'MAT-001',
    firstName: 'Kouassi',
    lastName: 'Yao',
    gender: 'M',
    birthDate: '2010-01-01',
    guardianName: 'M. Yao',
    guardianPhone: '+225 01020304',
    status: 'active',
    overallAverage: 8.5,
    previousAverage: 11.0,
    averageTrend: 'down',
    rank: 35,
    totalClassStudents: 40,
    attendanceRate: 72,
    unjustifiedAbsencesCount: 16,
    disciplinaryPoints: 12,
    riskScore: 85,
    riskCategory: 'critique',
    riskFactors: ['16 absences non justifiées', 'Retards répétitifs']
  },
  {
    id: 'std_test_02',
    schoolId: 'school_01',
    classId: 'c_3a',
    className: '3ème 1',
    matricule: 'MAT-002',
    firstName: 'Awa',
    lastName: 'Koné',
    gender: 'F',
    birthDate: '2010-05-12',
    guardianName: 'Mme Koné',
    guardianPhone: '+225 05060708',
    status: 'active',
    overallAverage: 15.2,
    previousAverage: 14.8,
    averageTrend: 'up',
    rank: 2,
    totalClassStudents: 40,
    attendanceRate: 98,
    unjustifiedAbsencesCount: 0,
    disciplinaryPoints: 20,
    riskScore: 5,
    riskCategory: 'faible',
    riskFactors: []
  }
];

const SAMPLE_SANCTIONS: EducatorSanction[] = [
  {
    id: 'sanc_test_01',
    schoolId: 'school_01',
    studentId: 'std_test_01',
    studentName: 'Kouassi Yao',
    className: '3ème 1',
    type: 'retenue',
    reason: 'Absences répétées sans motif',
    date: '2026-08-24',
    status: 'en_attente',
    decidedBy: 'Ibrahim Soro'
  }
];

const SAMPLE_INCIDENTS: DisciplinaryEvent[] = [
  {
    id: 'evt_test_01',
    schoolId: 'school_01',
    studentId: 'std_test_01',
    studentName: 'Kouassi Yao',
    className: '3ème 1',
    date: '2026-08-24',
    type: 'bagarre',
    severity: 'grave',
    description: 'Bagarre dans la cour de récréation',
    reportedBy: 'Surveillant',
    status: 'ouvert'
  }
];

describe('EducatorChronogramService', () => {
  it('generates the 19 standard tasks on an active school day (Monday)', () => {
    const monday = new Date('2026-08-24T08:00:00');
    const tasks = EducatorChronogramService.generateTasksForDate(monday, 'u_educ', 'school_01', SETTINGS);

    expect(tasks.length).toBe(19);
    expect(tasks[0].title).toBe('Prise de service et préparation');
    expect(tasks[0].startTime).toBe('06:30');
    expect(tasks[tasks.length - 1].title).toBe('Préparation du lendemain');
    expect(tasks.every(t => t.status === 'pending')).toBe(true);
  });

  it('generates 0 tasks on a non-active day (Sunday)', () => {
    const sunday = new Date('2026-08-23T08:00:00');
    const tasks = EducatorChronogramService.generateTasksForDate(sunday, 'u_educ', 'school_01', SETTINGS);
    expect(tasks.length).toBe(0);
  });

  it('respects exception calendar dates (vacations / holidays)', () => {
    const monday = new Date('2026-08-24T08:00:00');
    const dateKey = EducatorChronogramService.toDateKey(monday);
    const tasks = EducatorChronogramService.generateTasksForDate(monday, 'u_educ', 'school_01', SETTINGS, [dateKey]);
    expect(tasks.length).toBe(0);
  });
});

describe('EducatorTaskService', () => {
  const baseTasks: EducatorDailyTask[] = EducatorChronogramService.generateTasksForDate(
    new Date('2026-08-24T08:00:00'),
    'u_educ',
    'school_01',
    SETTINGS
  );

  it('identifies the active task matching the current time window', () => {
    // 07:18 is in "Gestion des retards" (07:15 - 07:30)
    const now = new Date('2026-08-24T07:18:00');
    const active = EducatorTaskService.getActiveTask(baseTasks, now);

    expect(active).not.toBeNull();
    expect(active?.title).toBe('Gestion des retards');
    expect(EducatorTaskService.minutesRemaining(active!, now)).toBe(12);
  });

  it('marks tasks whose end time has passed as overdue', () => {
    const now = new Date('2026-08-24T08:05:00');
    const overdue = EducatorTaskService.getOverdueTasks(baseTasks, now);

    expect(overdue.length).toBeGreaterThan(0);
    const accueil = overdue.find(t => t.title === 'Accueil des élèves');
    expect(accueil).toBeDefined();
  });

  it('preserves terminal statuses (completed, postponed, skipped)', () => {
    const completedTask: EducatorDailyTask = { ...baseTasks[0], status: 'completed' };
    const now = new Date('2026-08-24T20:00:00');
    const [derived] = EducatorTaskService.deriveStatuses([completedTask], now);

    expect(derived.status).toBe('completed');
  });

  it('detects schedule conflicts when postponing a task', () => {
    const check = EducatorTaskService.checkConflict(baseTasks, baseTasks[0].id, '07:05', '07:20');
    expect(check.hasConflict).toBe(true);
    expect(check.conflictingTask?.title).toBe('Contrôle du démarrage des cours');
  });
});

describe('EducatorAlertService', () => {
  it('detects repeated absences and generates contextual alerts', () => {
    const alerts = EducatorAlertService.generateContextAlerts(
      SAMPLE_STUDENTS,
      [],
      SAMPLE_INCIDENTS,
      SAMPLE_SANCTIONS
    );

    expect(alerts.length).toBeGreaterThan(0);
    const absenceAlert = alerts.find(a => a.type === 'repeated_absence');
    expect(absenceAlert).toBeDefined();
    expect(absenceAlert?.targetEntityName).toContain('Kouassi Yao');
  });

  it('ranks students at risk with urgency levels', () => {
    const atRisk = EducatorAlertService.computeAtRiskStudents(SAMPLE_STUDENTS, SAMPLE_SANCTIONS);

    expect(atRisk.length).toBe(1);
    expect(atRisk[0].student.firstName).toBe('Kouassi');
    expect(atRisk[0].urgencyLevel).toBe('critique');
    expect(atRisk[0].parentContactNeeded).toBe(true);
  });
});

describe('EducatorDailySummaryService & EducatorWeeklyReportService', () => {
  const baseTasks: EducatorDailyTask[] = EducatorChronogramService.generateTasksForDate(
    new Date('2026-08-24T08:00:00'),
    'u_educ',
    'school_01',
    SETTINGS
  ).map((t, idx) => (idx < 5 ? { ...t, status: 'completed' as const } : t));

  it('generates a daily summary with 3-5 AI priorities for tomorrow', () => {
    const summary = EducatorDailySummaryService.generateDailySummary(
      baseTasks,
      SAMPLE_STUDENTS,
      SAMPLE_INCIDENTS,
      SAMPLE_SANCTIONS,
      [],
      'u_educ',
      new Date('2026-08-24T17:00:00')
    );

    expect(summary.tasksPlanned).toBe(19);
    expect(summary.tasksCompleted).toBe(5);
    expect(summary.tomorrowPriorities.length).toBeGreaterThanOrEqual(3);
  });

  it('generates a weekly report with trends and AI recommendations', () => {
    const summary = EducatorDailySummaryService.generateDailySummary(
      baseTasks,
      SAMPLE_STUDENTS,
      SAMPLE_INCIDENTS,
      SAMPLE_SANCTIONS,
      [],
      'u_educ',
      new Date('2026-08-24T17:00:00')
    );

    const weekly = EducatorWeeklyReportService.generateWeeklyReport(
      [summary],
      baseTasks,
      SAMPLE_STUDENTS,
      SAMPLE_INCIDENTS,
      SAMPLE_SANCTIONS,
      [],
      'u_educ'
    );

    expect(weekly.trendAnalysis).toContain('3ème');
    expect(weekly.aiRecommendations.length).toBeGreaterThan(0);
  });
});
