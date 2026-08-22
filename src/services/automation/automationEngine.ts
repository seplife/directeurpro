import {
  Student,
  Payment,
  SchoolBudget,
  SchoolHealthScore,
  ClassLevel,
  TeacherAbsence,
  DisciplinaryEvent,
  AIAlert,
  AIDecision
} from '../../types';

export class AutomationEngine {
  /**
   * Recalculate School Health Score dynamically based on actual live data
   */
  static computeLiveHealthScore(
    students: Student[],
    budget: SchoolBudget,
    alerts: AIAlert[],
    disciplinaryEvents: DisciplinaryEvent[]
  ): SchoolHealthScore {
    // 1. Attendance Metric (Target > 95%)
    const avgAttendance = students.length > 0
      ? students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length
      : 90;
    const attendanceScore = Math.min(100, Math.round((avgAttendance / 95) * 100));

    // 2. Recovery Metric (Target > 80%)
    const recoveryRate = budget.totalExpectedRevenue > 0
      ? (budget.totalCollectedRevenue / budget.totalExpectedRevenue) * 100
      : 70;
    const financeScore = Math.min(100, Math.round((recoveryRate / 80) * 100));

    // 3. Academic Performance Metric (Target > 12/20)
    const avgAcademic = students.length > 0
      ? students.reduce((acc, s) => acc + s.overallAverage, 0) / students.length
      : 11.5;
    const academicScore = Math.min(100, Math.round((avgAcademic / 14) * 100));

    // 4. Climate & Discipline Metric (Penalize active critical alerts and open severe incidents)
    const criticalAlertsCount = alerts.filter(a => a.severity === 'critique' && a.status === 'active').length;
    const openSevereIncidents = disciplinaryEvents.filter(e => e.status === 'ouvert' && (e.severity === 'grave' || e.severity === 'critique')).length;
    const disciplineScore = Math.max(20, Math.min(100, 100 - (criticalAlertsCount * 12 + openSevereIncidents * 8)));

    // 5. Resources & Communication
    const resourcesScore = 88;
    const communicationScore = 92;

    // Overall Weighted Score: 25% Academic + 25% Attendance + 20% Finance + 15% Discipline + 15% Other
    const overall = Math.round(
      academicScore * 0.25 +
      attendanceScore * 0.25 +
      financeScore * 0.20 +
      disciplineScore * 0.15 +
      resourcesScore * 0.08 +
      communicationScore * 0.07
    );

    let status: 'EXCELLENT' | 'BON' | 'VIGILANCE' | 'CRITIQUE' = 'BON';
    if (overall >= 80) status = 'EXCELLENT';
    else if (overall >= 65) status = 'BON';
    else if (overall >= 50) status = 'VIGILANCE';
    else status = 'CRITIQUE';

    return {
      overall,
      status,
      dimensions: {
        pedagogy: {
          score: academicScore,
          trend: academicScore >= 70 ? 'up' : 'stable',
          label: 'Performance Pédagogique'
        },
        attendance: {
          score: attendanceScore,
          trend: attendanceScore >= 85 ? 'up' : 'down',
          label: 'Assiduité & Ponctualité'
        },
        discipline: {
          score: disciplineScore,
          trend: disciplineScore >= 80 ? 'stable' : 'down',
          label: 'Climat & Discipline'
        },
        finance: {
          score: financeScore,
          trend: financeScore >= 75 ? 'up' : 'down',
          label: 'Recouvrement & Trésorerie'
        },
        resources: {
          score: resourcesScore,
          trend: 'stable',
          label: 'Ressources & Équipements'
        },
        communication: {
          score: communicationScore,
          trend: 'up',
          label: 'Relations Familles & Partenaires'
        }
      },
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Recalculate student averages, ranks, and risk levels upon grade modifications
   */
  static recalculateStudentsRankAndMetrics(students: Student[]): Student[] {
    // Group students by class
    const classGroups: Record<string, Student[]> = {};
    students.forEach(std => {
      if (!classGroups[std.classId]) classGroups[std.classId] = [];
      classGroups[std.classId].push(std);
    });

    const updatedStudents: Student[] = [];

    Object.values(classGroups).forEach(group => {
      // Sort descending by overallAverage
      const sorted = [...group].sort((a, b) => b.overallAverage - a.overallAverage);
      const totalClass = sorted.length;

      sorted.forEach((std, index) => {
        const rank = index + 1;
        const averageTrend: 'up' | 'down' | 'stable' =
          std.overallAverage > (std.previousAverage || 10)
            ? 'up'
            : std.overallAverage < (std.previousAverage || 10)
            ? 'down'
            : 'stable';

        // Calculate dynamic risk score (0 to 100)
        let riskScore = 0;
        const riskFactors: string[] = [];

        if (std.overallAverage < 8.5) {
          riskScore += 45;
          riskFactors.push('Moyenne académique critique (< 8.5/20)');
        } else if (std.overallAverage < 10) {
          riskScore += 25;
          riskFactors.push('Moyenne inférieure à 10/20');
        }

        if (std.attendanceRate < 80) {
          riskScore += 35;
          riskFactors.push(`Assiduité très faible (${std.attendanceRate}%)`);
        } else if (std.attendanceRate < 90) {
          riskScore += 15;
          riskFactors.push(`Assiduité en baisse (${std.attendanceRate}%)`);
        }

        if (std.unjustifiedAbsencesCount > 10) {
          riskScore += 20;
          riskFactors.push(`${std.unjustifiedAbsencesCount} absences non justifiées`);
        }

        let riskCategory: 'faible' | 'modere' | 'important' | 'eleve' | 'critique' = 'faible';
        if (riskScore >= 70) riskCategory = 'critique';
        else if (riskScore >= 45) riskCategory = 'eleve';
        else if (riskScore >= 25) riskCategory = 'modere';

        updatedStudents.push({
          ...std,
          rank,
          totalClassStudents: totalClass,
          averageTrend,
          riskScore: Math.min(100, riskScore),
          riskCategory,
          riskFactors
        });
      });
    });

    return updatedStudents;
  }

  /**
   * Recalculate ClassLevel metrics from live student data
   */
  static recalculateClassMetrics(classes: ClassLevel[], students: Student[]): ClassLevel[] {
    return classes.map(cls => {
      const classStudents = students.filter(s => s.classId === cls.id);
      return {
        ...cls,
        studentCount: classStudents.length || cls.studentCount
      };
    });
  }

  /**
   * Recalculate School Budget after payments
   */
  static recalculateBudget(budget: SchoolBudget, payments: Payment[]): SchoolBudget {
    const validPayments = payments.filter(p => p.status === 'valide');
    const totalCollected = validPayments.reduce((acc, p) => acc + p.amount, 0);
    const recoveryRate = budget.totalExpectedRevenue > 0
      ? Math.round((totalCollected / budget.totalExpectedRevenue) * 1000) / 10
      : 0;

    const totalOutstandingDebt = Math.max(0, budget.totalExpectedRevenue - totalCollected);
    const financialHealthScore = Math.min(100, Math.round(recoveryRate * 1.15));

    return {
      ...budget,
      totalCollectedRevenue: totalCollected,
      totalOutstandingDebt,
      recoveryRate,
      financialHealthScore
    };
  }

  /**
   * Generate an automated simulated Mobile Money payment
   */
  static createSimulatedMobileMoneyPayment(
    student: Student,
    classes: ClassLevel[]
  ): Payment {
    const paymentAmount = 100000; // 100 000 FCFA

    const operators = ['wave', 'orange_money', 'mtn_momo', 'moov_money'] as const;
    const chosenOperator = operators[Math.floor(Math.random() * operators.length)];

    const paymentId = `pay_sim_${Date.now()}`;
    const receiptNumber = `REC-MM-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      id: paymentId,
      schoolId: student.schoolId,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      className: student.className,
      amount: paymentAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: chosenOperator,
      receiptNumber,
      feeType: 'scolarite',
      status: 'valide',
      transactionReference: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      collectedBy: 'DirecteurPro AI Gateway'
    };
  }

  /**
   * Generate an automated teacher absence & substitution event
   */
  static createSimulatedTeacherAbsence(
    schoolId: string,
    subjects: { id: string; name: string }[]
  ): { absence: TeacherAbsence; alert: AIAlert; decision: AIDecision } {
    const teachers = [
      { id: 't_math_01', name: 'M. Brou Kouamé', subjectName: 'Mathématiques', classId: 'c_3a', className: '3ème 1' },
      { id: 't_phys_01', name: 'M. Koffi Sylvain', subjectName: 'Physique-Chimie', classId: 'c_1d', className: '1ère D' },
      { id: 't_fr_01', name: 'Mme Touré Aminata', subjectName: 'Français', classId: 'c_6a', className: '6ème 1' },
      { id: 't_ang_01', name: 'M. Diabaté Lamine', subjectName: 'Anglais', classId: 'c_ta2', className: 'Terminale A2' }
    ];

    const chosen = teachers[Math.floor(Math.random() * teachers.length)];
    const todayStr = new Date().toISOString().split('T')[0];
    const absenceId = `tab_sim_${Date.now()}`;

    const absence: TeacherAbsence = {
      id: absenceId,
      schoolId,
      teacherId: chosen.id,
      teacherName: chosen.name,
      classId: chosen.classId,
      className: chosen.className,
      subjectName: chosen.subjectName,
      date: todayStr,
      timeSlot: '08:00 - 10:00',
      reason: 'Urgence médicale / Déplacement imprévu',
      status: 'remplacement_organise'
    };

    const alert: AIAlert = {
      id: `alt_tab_${Date.now()}`,
      schoolId,
      type: 'absence_prof' as any,
      severity: 'important',
      category: 'ressources',
      title: `Absence non planifiée : ${chosen.name} (${chosen.subjectName})`,
      description: `L'enseignant est indisponible ce jour. 2h de cours impactées pour la classe : ${chosen.className}.`,
      detectedAt: new Date().toISOString(),
      rootCauses: ['Indisponibilité signalée le matin à 06h50'],
      dataContext: {
        metric: 'Heures de cours non assurées',
        currentValue: '2 heures',
        threshold: '0 heure',
        affectedEntities: [chosen.className]
      },
      confidenceLevel: 95,
      status: 'active'
    };

    const decision: AIDecision = {
      id: `dec_tab_${Date.now()}`,
      schoolId,
      alertId: alert.id,
      problemTitle: `Remplacement d'urgence : ${chosen.name} (${chosen.subjectName})`,
      problemSummary: `Remplacement de 2 heures de cours pour la classe ${chosen.className} afin de préserver la progression pédagogique.`,
      domain: 'pedagogie',
      dataPointsUsed: ['Progression pédagogique 82%', 'Examen blanc dans 15 jours'],
      rootCauseAnalysis: 'Absence médicale de dernière minute',
      confidenceScore: 92,
      urgencyScore: 8,
      status: 'pending_director',
      recommendedOptionId: 'opt_sub_01',
      options: [
        {
          id: 'opt_sub_01',
          title: 'Valider le remplacement par M. Yao Fabrice (Recommandé)',
          description: 'Mobiliser l’enseignant vacataire disponible pour assurer la séance.',
          pros: ['Continuité pédagogique garantie', 'Respect de l’emploi du temps'],
          cons: ['Coût de vacation : 12 000 FCFA'],
          estimatedCostFcfa: 12000,
          expectedImpactScore: 9,
          implementationTime: 'Immédiat',
          isRecommended: true
        },
        {
          id: 'opt_sub_02',
          title: 'Reporter la séance au mercredi après-midi',
          description: 'Reprogrammer le créneau sans surcoût.',
          pros: ['Aucun surcoût financier'],
          cons: ['Surcharge des élèves le mercredi', 'Risque d’absentéisme'],
          estimatedCostFcfa: 0,
          expectedImpactScore: 6,
          implementationTime: '3 jours',
          isRecommended: false
        }
      ]
    };

    return { absence, alert, decision };
  }
}
