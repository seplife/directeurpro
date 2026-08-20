import { Student } from '../../../types';

export class StudentRiskAgent {
  /**
   * Calcule le score de risque (0 à 100) d'un élève à partir de 4 piliers explicables :
   * 1. Risque Académique (écart par rapport à 10/20 et tendance)
   * 2. Risque d'Assiduité (heures d'absence non justifiées)
   * 3. Risque Disciplinaire (points de conduite)
   * 4. Risque de Décrochage (cumul multi-facteurs)
   */
  static evaluateStudent(student: Partial<Student>): {
    riskScore: number;
    riskCategory: 'faible' | 'modere' | 'important' | 'eleve' | 'critique';
    riskFactors: string[];
    recommendedIntervention: string;
  } {
    const factors: string[] = [];

    // 1. Risque Académique (Poids: 40%)
    let academicRisk = 0;
    const avg = student.overallAverage ?? 12;
    if (avg < 8) {
      academicRisk = 40;
      factors.push(`Moyenne critique (${avg.toFixed(2)}/20 < 8/20)`);
    } else if (avg < 10) {
      academicRisk = 28;
      factors.push(`Moyenne en dessous du seuil de passage (${avg.toFixed(2)}/20)`);
    } else if (avg < 12) {
      academicRisk = 12;
    }

    if (student.averageTrend === 'down') {
      academicRisk = Math.min(40, academicRisk + 10);
      factors.push(`Tendance de résultats en baisse par rapport au trimestre précédent`);
    }

    // 2. Risque d'Assiduité (Poids: 30%)
    let attendanceRisk = 0;
    const absences = student.unjustifiedAbsencesCount ?? 0;
    const attRate = student.attendanceRate ?? 95;
    if (attRate < 75 || absences >= 15) {
      attendanceRisk = 30;
      factors.push(`Rupture d'assiduité sévère (${absences} demi-journées non justifiées, assiduité ${attRate}%)`);
    } else if (attRate < 85 || absences >= 8) {
      attendanceRisk = 18;
      factors.push(`Absentéisme préoccupant (${absences} demi-journées non justifiées)`);
    } else if (absences >= 4) {
      attendanceRisk = 8;
    }

    // 3. Risque Disciplinaire (Poids: 20%)
    let disciplineRisk = 0;
    const discPts = student.disciplinaryPoints ?? 20;
    if (discPts <= 12) {
      disciplineRisk = 20;
      factors.push(`Comportement perturbateur récurrent (Note de conduite: ${discPts}/20)`);
    } else if (discPts <= 16) {
      disciplineRisk = 10;
      factors.push(`Incidents disciplinaires signalés`);
    }

    // 4. Risque de Décrochage & Échéance examen (Poids: 10%)
    let examRisk = 0;
    const isExamClass = student.className?.includes('3ème') || student.className?.includes('Terminale');
    if (isExamClass && (avg < 10 || absences > 10)) {
      examRisk = 10;
      factors.push(`Classe d’examen (BEPC / BAC) avec cumul de vulnérabilités`);
    }

    const totalRisk = Math.min(100, Math.round(academicRisk + attendanceRisk + disciplineRisk + examRisk));

    let riskCategory: 'faible' | 'modere' | 'important' | 'eleve' | 'critique' = 'faible';
    let recommendedIntervention = 'Suivi régulier classique.';

    if (totalRisk >= 80) {
      riskCategory = 'critique';
      recommendedIntervention = 'Convocations tuteurs immédiate + Contrat d’objectifs individualisé + Tutorat de remédiation obligatoire.';
    } else if (totalRisk >= 60) {
      riskCategory = 'eleve';
      recommendedIntervention = 'Entretien éducateur / professeur principal + Fiche de suivi hebdomadaire.';
    } else if (totalRisk >= 40) {
      riskCategory = 'important';
      recommendedIntervention = 'Alerte transmise au professeur principal et vérification des présences.';
    } else if (totalRisk >= 20) {
      riskCategory = 'modere';
      recommendedIntervention = 'Vigilance pédagogique en conseil de mi-trimestre.';
    }

    return {
      riskScore: totalRisk,
      riskCategory,
      riskFactors: factors,
      recommendedIntervention
    };
  }
}
