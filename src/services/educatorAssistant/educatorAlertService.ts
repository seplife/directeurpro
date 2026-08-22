import {
  AttendanceRecord,
  DisciplinaryEvent,
  EducatorContextAlert,
  EducatorSanction,
  EducatorStudentAtRisk,
  ParentContactRecord,
  Student
} from '../../types';

export class EducatorAlertService {
  /**
   * Generates contextual alerts for the educator by analyzing live school data:
   * attendance records, student profiles, disciplinary events, and pending sanctions.
   */
  static generateContextAlerts(
    students: Student[],
    attendanceRecords: AttendanceRecord[] = [],
    disciplinaryEvents: DisciplinaryEvent[] = [],
    sanctions: EducatorSanction[] = [],
    assignedClassIds?: string[]
  ): EducatorContextAlert[] {
    const alerts: EducatorContextAlert[] = [];
    const now = new Date().toISOString();

    // Filter students by educator's assigned classes if specified
    const targetStudents = assignedClassIds && assignedClassIds.length > 0
      ? students.filter(s => assignedClassIds.includes(s.classId))
      : students;

    // 1. Group attendance by class to detect class-level mass absence spikes
    const classAbsencesMap = new Map<string, { className: string; count: number; studentNames: string[] }>();
    
    // Check both attendance records and students marked with high unexcused absences
    targetStudents.forEach(st => {
      if (st.unjustifiedAbsencesCount >= 10 || st.attendanceRate < 80) {
        const entry = classAbsencesMap.get(st.classId) || {
          className: st.className,
          count: 0,
          studentNames: []
        };
        entry.count += 1;
        entry.studentNames.push(`${st.firstName} ${st.lastName}`);
        classAbsencesMap.set(st.classId, entry);
      }
    });

    classAbsencesMap.forEach((entry, classId) => {
      if (entry.count >= 2) {
        alerts.push({
          id: `alt_cls_abs_${classId}`,
          type: 'class_absence',
          severity: entry.count >= 3 ? 'critique' : 'haute',
          title: `Pic d'assiduité : ${entry.className} compte ${entry.count} cas critiques`,
          description: `Plusieurs élèves de ${entry.className} (${entry.studentNames.slice(0, 3).join(', ')}${entry.studentNames.length > 3 ? '...' : ''}) présentent une accumulation anormale d'absences.`,
          targetEntityName: entry.className,
          targetClass: entry.className,
          count: entry.count,
          recommendation: 'Contrôler les fiches d’appel, vérifier les justificatifs médicaux et contacter les délégués.',
          actionLabel: 'Vérifier la classe',
          status: 'active',
          detectedAt: now
        });
      }
    });

    // 2. Individual Repeated Absences Detection
    targetStudents.forEach(st => {
      if (st.unjustifiedAbsencesCount >= 12) {
        alerts.push({
          id: `alt_std_abs_${st.id}`,
          type: 'repeated_absence',
          severity: st.unjustifiedAbsencesCount >= 18 ? 'critique' : 'haute',
          title: `Absences répétées : ${st.firstName} ${st.lastName} (${st.className})`,
          description: `${st.matricule} totalise ${st.unjustifiedAbsencesCount} demi-journées d’absence (Taux d'assiduité : ${st.attendanceRate}%).`,
          targetEntityName: `${st.firstName} ${st.lastName}`,
          targetClass: st.className,
          targetStudentId: st.id,
          count: st.unjustifiedAbsencesCount,
          recommendation: 'Organiser un entretien de cadrage avec l’élève et convoquer le responsable légal.',
          actionLabel: 'Voir le dossier',
          status: 'active',
          detectedAt: now
        });
      }
    });

    // 3. Repeated Lateness Detection
    targetStudents.forEach(st => {
      if (st.disciplinaryPoints <= 15 && st.riskFactors.some(rf => rf.toLowerCase().includes('retard'))) {
        alerts.push({
          id: `alt_std_lat_${st.id}`,
          type: 'repeated_lateness',
          severity: 'haute',
          title: `Retards récurrents : ${st.firstName} ${st.lastName}`,
          description: `Cet élève accumule des retards répétés aux cours de 1ère heure en ${st.className}.`,
          targetEntityName: `${st.firstName} ${st.lastName}`,
          targetClass: st.className,
          targetStudentId: st.id,
          recommendation: 'Établir une fiche de ponctualité renforcée et notifier les parents via SMS / appel.',
          actionLabel: 'Programmer un entretien',
          status: 'active',
          detectedAt: now
        });
      }
    });

    // 4. Open Disciplinary Incidents
    disciplinaryEvents.filter(e => e.status === 'ouvert' || e.status === 'en_cours').forEach(evt => {
      alerts.push({
        id: `alt_disc_evt_${evt.id}`,
        type: 'incident',
        severity: evt.severity === 'grave' || evt.severity === 'critique' ? 'critique' : 'haute',
        title: `Incident disciplinaire : ${evt.type.replace('_', ' ').toUpperCase()} en ${evt.className}`,
        description: `Signalé par ${evt.reportedBy} : "${evt.description}". Élève concerné : ${evt.studentName}.`,
        targetEntityName: evt.studentName,
        targetClass: evt.className,
        targetStudentId: evt.studentId,
        recommendation: 'Recevoir l’élève immédiatement à la vie scolaire et enregistrer le compte rendu.',
        actionLabel: 'Traiter l’incident',
        status: 'active',
        detectedAt: evt.date
      });
    });

    // 5. Sanctions Pending Execution
    const pendingSanctions = sanctions.filter(s => s.status === 'en_attente');
    if (pendingSanctions.length > 0) {
      alerts.push({
        id: `alt_sanc_pending_summary`,
        type: 'sanction_pending',
        severity: 'moyenne',
        title: `${pendingSanctions.length} sanction(s) en attente de traitement`,
        description: `Des mesures disciplinaires (${pendingSanctions.map(s => s.type).join(', ')}) doivent être validées ou supervisées aujourd’hui.`,
        targetEntityName: 'Vie Scolaire',
        count: pendingSanctions.length,
        recommendation: 'Vérifier la salle de retenue et notifier les professeurs concernés.',
        actionLabel: 'Gérer les sanctions',
        status: 'active',
        detectedAt: now
      });
    }

    return alerts;
  }

  /**
   * Computes at-risk students ranking for educator follow-up based on
   * absences, lateness, disciplinary history, and academic warnings.
   */
  static computeAtRiskStudents(
    students: Student[],
    sanctions: EducatorSanction[] = [],
    assignedClassIds?: string[]
  ): EducatorStudentAtRisk[] {
    const list: EducatorStudentAtRisk[] = [];

    const targetStudents = assignedClassIds && assignedClassIds.length > 0
      ? students.filter(s => assignedClassIds.includes(s.classId))
      : students;

    targetStudents.forEach(st => {
      const studentSanctions = sanctions.filter(s => s.studentId === st.id);
      const isHighAbsence = st.unjustifiedAbsencesCount >= 10 || st.attendanceRate < 80;
      const isLowPoints = st.disciplinaryPoints < 16;
      const isLowGrades = st.overallAverage < 10;
      const isCriticalRisk = st.riskCategory === 'critique' || st.riskCategory === 'eleve';

      if (isHighAbsence || isLowPoints || isCriticalRisk) {
        let urgency: EducatorStudentAtRisk['urgencyLevel'] = 'moderee';
        if (st.riskCategory === 'critique' || st.unjustifiedAbsencesCount >= 16 || st.disciplinaryPoints <= 12) {
          urgency = 'critique';
        } else if (st.riskCategory === 'eleve' || st.unjustifiedAbsencesCount >= 10 || st.disciplinaryPoints <= 15) {
          urgency = 'haute';
        }

        let primaryReason = 'Assiduité fragile';
        if (isHighAbsence && isLowPoints) {
          primaryReason = 'Absences & Comportement';
        } else if (isHighAbsence) {
          primaryReason = 'Absences répétées';
        } else if (isLowPoints) {
          primaryReason = 'Discipline & Retards';
        } else if (isLowGrades) {
          primaryReason = 'Décrochage scolaire';
        }

        list.push({
          student: st,
          urgencyLevel: urgency,
          primaryReason,
          recentAbsencesCount: st.unjustifiedAbsencesCount,
          recentLatenessCount: Math.max(1, Math.floor((20 - st.disciplinaryPoints) / 2)),
          sanctionsCount: studentSanctions.length,
          recommendation: urgency === 'critique'
            ? 'Entretien immédiat avec le CDE et convocation obligatoire des parents.'
            : 'Entretien de soutien vie scolaire et vérification des présences du matin.',
          parentContactNeeded: st.unjustifiedAbsencesCount >= 10 || urgency === 'critique'
        });
      }
    });

    // Sort by urgency: critique > haute > moderee
    const urgencyWeight: Record<EducatorStudentAtRisk['urgencyLevel'], number> = {
      critique: 3,
      haute: 2,
      moderee: 1
    };

    return list.sort((a, b) => urgencyWeight[b.urgencyLevel] - urgencyWeight[a.urgencyLevel]);
  }
}
