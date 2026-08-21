import { describe, it, expect } from 'vitest';
import { StudentRiskAgent } from './agents/studentRiskAgent';
import { SchoolHealthService } from './schoolHealthService';
import { INITIAL_STUDENTS, INITIAL_ALERTS, INITIAL_BUDGET } from '../db/mockData';

describe('DirecteurPro - Decision Intelligence Tests', () => {
  it('StudentRiskAgent should detect critical dropout risk for severe academic and attendance issues', () => {
    const student = {
      overallAverage: 7.5,
      averageTrend: 'down' as const,
      attendanceRate: 70,
      unjustifiedAbsencesCount: 18,
      disciplinaryPoints: 12,
      className: 'Terminale D (BAC)'
    };

    const evaluation = StudentRiskAgent.evaluateStudent(student);
    expect(evaluation.riskScore).toBeGreaterThanOrEqual(80);
    expect(evaluation.riskCategory).toBe('critique');
    expect(evaluation.riskFactors.length).toBeGreaterThan(0);
  });

  it('StudentRiskAgent should produce low risk score for excellent student', () => {
    const student = {
      overallAverage: 17.5,
      averageTrend: 'up' as const,
      attendanceRate: 100,
      unjustifiedAbsencesCount: 0,
      disciplinaryPoints: 20,
      className: 'Terminale C (BAC)'
    };

    const evaluation = StudentRiskAgent.evaluateStudent(student);
    expect(evaluation.riskScore).toBeLessThan(15);
    expect(evaluation.riskCategory).toBe('faible');
  });

  it('SchoolHealthService should aggregate 6 dimensions into a valid 0-100 overall score', () => {
    const health = SchoolHealthService.calculateHealthScore(
      INITIAL_STUDENTS,
      INITIAL_ALERTS,
      INITIAL_BUDGET
    );

    expect(health.overall).toBeGreaterThanOrEqual(0);
    expect(health.overall).toBeLessThanOrEqual(100);
    expect(health.dimensions.pedagogy.score).toBeDefined();
    expect(health.dimensions.attendance.score).toBeDefined();
    expect(health.dimensions.finance.score).toBeDefined();
    // INITIAL_STUDENTS is a deliberately at-risk-heavy vigilance watchlist
    // (3 of 5 students are 'critique'/'eleve'), so the honest aggregate
    // status for this sample is VIGILANCE, not BON — matching what the
    // Executive Cockpit actually displays on load.
    expect(health.status).toBe('VIGILANCE');
  });
});
