import { Student } from '../../../types';

export class ParentCommunicationAgent {
  /**
   * Génère un modèle de message diplomatique pour les parents,
   * respectant la charte de bienveillance institutionnelle (soumis à validation humaine).
   */
  static generateMessageForStudent(
    student: Student,
    reason: 'baisse_notes' | 'absences' | 'felicitations' | 'retard_paiement'
  ): {
    channel: 'sms' | 'email' | 'convocation';
    subject?: string;
    content: string;
    diplomaticToneScore: number;
  } {
    if (reason === 'baisse_notes') {
      return {
        channel: 'email',
        subject: `Point d'étape pédagogique concernant ${student.firstName} - ${student.className}`,
        content: `Chers parents de ${student.firstName},\n\n` +
          `Dans le cadre du suivi personnalisé de nos élèves, l'équipe pédagogique du lycée a constaté un fléchissement récent des résultats de ${student.firstName} (Moyenne actuelle : ${student.overallAverage.toFixed(2)}/20).\n\n` +
          `Nous sommes convaincus de son potentiel et souhaitons agir ensemble rapidement pour l'accompagner vers la réussite. Un dispositif de soutien adapté peut lui être proposé dès cette semaine.\n\n` +
          `Nous vous invitons à consulter le détail de ses évaluations sur votre espace parent ou à contacter le professeur principal pour un échange constructif.\n\n` +
          `Bien cordialement,\nLa Direction Pédagogique`,
        diplomaticToneScore: 96
      };
    }

    if (reason === 'absences') {
      return {
        channel: 'sms',
        content: `[Lycée d'Excellence] Chers parents, nous constatons ${student.unjustifiedAbsencesCount} absences non justifiées pour ${student.firstName} (${student.className}). Merci de bien vouloir régulariser auprès de la vie scolaire au 0708123456.`,
        diplomaticToneScore: 92
      };
    }

    if (reason === 'retard_paiement') {
      return {
        channel: 'sms',
        content: `[Lycée d'Excellence] Rappel amical : l'échéance de scolarité pour ${student.firstName} est échue. Règlement sécurisé sans déplacement possible par Wave / Orange Money via votre espace parent. Merci.`,
        diplomaticToneScore: 90
      };
    }

    return {
      channel: 'email',
      subject: `Félicitations pour l'excellence des résultats de ${student.firstName}`,
      content: `Chers parents de ${student.firstName},\n\n` +
        `Nous avons le grand plaisir de vous adresser nos félicitations chaleureuses pour l'excellence du travail et du comportement de ${student.firstName}, qui se classe ${student.rank}e sur ${student.totalClassStudents} élèves avec une moyenne remarquable de ${student.overallAverage.toFixed(2)}/20.\n\n` +
        `Toute l'équipe éducative salue sa régularité et son investissement exemplaire.\n\n` +
        `Très cordialement,\nLe Chef d'Établissement`,
      diplomaticToneScore: 99
    };
  }
}
