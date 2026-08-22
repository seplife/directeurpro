import { describe, it, expect } from 'vitest';
import { AutomationEngine } from './automationEngine';
import { Student, SchoolBudget, ClassLevel } from '../../types';

const SAMPLE_STUDENTS: Student[] = [
  {
    id: 's1',
    schoolId: 'sch_1',
    classId: 'c_3a',
    className: '3ème 1',
    matricule: 'MAT001',
    firstName: 'Amadou',
    lastName: 'Koné',
    gender: 'M',
    birthDate: '2010-01-01',
    guardianName: 'M. Koné',
    guardianPhone: '+225 01020304',
    status: 'active',
    overallAverage: 15.5,
    previousAverage: 14.0,
    averageTrend: 'up',
    rank: 1,
    totalClassStudents: 2,
    attendanceRate: 98,
    unjustifiedAbsencesCount: 0,
    disciplinaryPoints: 20,
    riskScore: 0,
    riskCategory: 'faible',
    riskFactors: []
  },
  {
    id: 's2',
    schoolId: 'sch_1',
    classId: 'c_3a',
    className: '3ème 1',
    matricule: 'MAT002',
    firstName: 'Sita',
    lastName: 'Bamba',
    gender: 'F',
    birthDate: '2010-02-02',
    guardianName: 'Mme Bamba',
    guardianPhone: '+225 05060708',
    status: 'active',
    overallAverage: 7.2,
    previousAverage: 9.0,
    averageTrend: 'down',
    rank: 2,
    totalClassStudents: 2,
    attendanceRate: 75,
    unjustifiedAbsencesCount: 14,
    disciplinaryPoints: 12,
    riskScore: 85,
    riskCategory: 'critique',
    riskFactors: ['Moyenne faible']
  }
];

const SAMPLE_BUDGET: SchoolBudget = {
  id: 'b1',
  schoolId: 'sch_1',
  academicYearId: 'ay_2025_2026',
  totalExpectedRevenue: 100000000,
  totalCollectedRevenue: 75000000,
  totalOutstandingDebt: 25000000,
  totalExpenses: 40000000,
  recoveryRate: 75,
  financialHealthScore: 85
};

const SAMPLE_CLASSES: ClassLevel[] = [
  {
    id: 'c_3a',
    schoolId: 'sch_1',
    name: '3ème 1',
    cycle: 'college',
    mainTeacherId: 't1',
    room: 'B12',
    studentCount: 2
  }
];

describe('AutomationEngine - Dynamic Calculations', () => {
  it('computes live School Health Score correctly', () => {
    const health = AutomationEngine.computeLiveHealthScore(SAMPLE_STUDENTS, SAMPLE_BUDGET, [], []);

    expect(health.overall).toBeGreaterThanOrEqual(0);
    expect(health.overall).toBeLessThanOrEqual(100);
    expect(health.dimensions.pedagogy.score).toBeDefined();
    expect(health.dimensions.finance.score).toBeDefined();
    expect(health.dimensions.attendance.score).toBeDefined();
    expect(health.status).toBeDefined();
  });

  it('recalculates ranks and risk levels dynamically after grades change', () => {
    const modifiedStudents: Student[] = [
      { ...SAMPLE_STUDENTS[0], overallAverage: 8.0 },
      { ...SAMPLE_STUDENTS[1], overallAverage: 16.0 }
    ];

    const recomputed = AutomationEngine.recalculateStudentsRankAndMetrics(modifiedStudents);

    const sita = recomputed.find(s => s.id === 's2');
    const amadou = recomputed.find(s => s.id === 's1');

    expect(sita?.rank).toBe(1);
    expect(amadou?.rank).toBe(2);
    expect(amadou?.riskCategory).toBe('eleve');
  });

  it('recalculates class metrics', () => {
    const updatedClasses = AutomationEngine.recalculateClassMetrics(SAMPLE_CLASSES, SAMPLE_STUDENTS);
    expect(updatedClasses[0].studentCount).toBe(2);
  });

  it('recalculates budget metrics after payment', () => {
    const payment = AutomationEngine.createSimulatedMobileMoneyPayment(SAMPLE_STUDENTS[0], SAMPLE_CLASSES);
    const updatedBudget = AutomationEngine.recalculateBudget(SAMPLE_BUDGET, [payment]);

    expect(updatedBudget.totalCollectedRevenue).toBe(payment.amount);
    expect(updatedBudget.recoveryRate).toBeGreaterThan(0);
  });

  it('generates simulated teacher absence with alert and decision', () => {
    const { absence, alert, decision } = AutomationEngine.createSimulatedTeacherAbsence('sch_1', []);

    expect(absence.teacherName).toBeDefined();
    expect(alert.severity).toBe('important');
    expect(decision.status).toBe('pending_director');
    expect(decision.options.length).toBe(2);
  });
});
