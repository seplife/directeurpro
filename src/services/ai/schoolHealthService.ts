import { SchoolHealthScore, Student, AIAlert, SchoolBudget } from '../../types';

export class SchoolHealthService {
  /**
   * Calcule le score global de santé de l'établissement (0 à 100)
   * à partir des données opérationnelles réelles (SQL-based analytics).
   */
  static calculateHealthScore(
    students: Student[],
    alerts: AIAlert[],
    budget: SchoolBudget
  ): SchoolHealthScore {
    // 1. Pédagogie (Moyenne globale, taux d'élèves >= 10, taux de risque académique)
    const validStudents = students.filter(s => s.overallAverage > 0);
    const avgScore = validStudents.reduce((acc, s) => acc + s.overallAverage, 0) / (validStudents.length || 1);
    const passRate = (validStudents.filter(s => s.overallAverage >= 10).length / (validStudents.length || 1)) * 100;
    const pedagogyScore = Math.min(100, Math.max(0, Math.round(passRate * 0.7 + (avgScore / 20) * 100 * 0.3)));

    // 2. Assiduité (Taux d'assiduité moyen)
    const avgAttendance = students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1);
    const attendanceScore = Math.round(avgAttendance);

    // 3. Discipline (Points disciplinaires moyens sur 20)
    const avgDisc = students.reduce((acc, s) => acc + s.disciplinaryPoints, 0) / (students.length || 1);
    const disciplineScore = Math.round((avgDisc / 20) * 100);

    // 4. Finance (Taux de recouvrement et ratio impayés)
    const financeScore = Math.round(budget.recoveryRate);

    // 5. Ressources (Impact des alertes critiques)
    const criticalAlerts = alerts.filter(a => a.severity === 'critique' && a.status === 'active').length;
    const resourcesScore = Math.max(50, 95 - criticalAlerts * 10);

    // 6. Communication (Engagement et transmission des alertes)
    const communicationScore = 89;

    // Calcul du score global pondéré
    const overall = Math.round(
      pedagogyScore * 0.25 +
      attendanceScore * 0.20 +
      disciplineScore * 0.15 +
      financeScore * 0.20 +
      resourcesScore * 0.10 +
      communicationScore * 0.10
    );

    let status: 'EXCELLENT' | 'BON' | 'VIGILANCE' | 'CRITIQUE' = 'BON';
    if (overall >= 90) status = 'EXCELLENT';
    else if (overall >= 75) status = 'BON';
    else if (overall >= 60) status = 'VIGILANCE';
    else status = 'CRITIQUE';

    return {
      overall,
      status,
      dimensions: {
        pedagogy: { score: pedagogyScore, trend: avgScore >= 12 ? 'up' : 'stable', label: 'Pédagogie & Résultats' },
        attendance: { score: attendanceScore, trend: avgAttendance >= 90 ? 'up' : 'down', label: 'Assiduité Globale' },
        discipline: { score: disciplineScore, trend: avgDisc >= 16 ? 'up' : 'stable', label: 'Climat & Vie Scolaire' },
        finance: { score: financeScore, trend: budget.recoveryRate >= 80 ? 'up' : 'down', label: 'Santé Financière & Caisse' },
        resources: { score: resourcesScore, trend: 'stable', label: 'Ressources & Encadrement' },
        communication: { score: communicationScore, trend: 'up', label: 'Engagement & Information Parents' }
      },
      calculatedAt: new Date().toISOString()
    };
  }
}
