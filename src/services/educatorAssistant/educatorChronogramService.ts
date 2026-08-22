import {
  EducatorAssistantSettings,
  EducatorDailyTask,
  EducatorTaskCategory,
  EducatorTaskChecklistItem,
  EducatorTaskPriority
} from '../../types';

export interface EducatorTaskTemplate {
  title: string;
  description: string;
  instructions: string[];
  startTime: string;
  endTime: string;
  priority: EducatorTaskPriority;
  category: EducatorTaskCategory;
  checklist: string[];
}

export const DEFAULT_EDUCATOR_TEMPLATE: EducatorTaskTemplate[] = [
  {
    title: 'Prise de service et préparation',
    description: 'Arrivée à la vie scolaire, vérification des consignes, du registre et préparation des documents du jour.',
    instructions: [
      'Ouvrir le bureau de la vie scolaire et vérifier les clés des salles.',
      'Prendre connaissance des consignes spéciales de la direction ou du CDE.',
      'Vérifier les billets d’entrée et d’autorisation d’absence en attente.'
    ],
    startTime: '06:30',
    endTime: '06:45',
    priority: 'haute',
    category: 'organisation',
    checklist: [
      'Ouverture de la vie scolaire',
      'Lecture du cahier de consignes',
      'Vérification du registre des billets d’entrée',
      'Contrôle du matériel de contrôle'
    ]
  },
  {
    title: 'Accueil des élèves',
    description: 'Accueil au portail principal, contrôle des tenues réglementaires, badges et orientation des élèves.',
    instructions: [
      'Se positionner à l’entrée principale avec l’équipe de surveillance.',
      'Vérifier le port correct de l’uniforme scolaire et du macaron/badge.',
      'Accueillir les élèves et fluidifier l’accès vers les rangs et cours de récréation.',
      'Repérer d’éventuels comportements inhabituels dès l’entrée.'
    ],
    startTime: '06:45',
    endTime: '07:00',
    priority: 'haute',
    category: 'accueil',
    checklist: [
      'Présence active au portail d’entrée',
      'Contrôle de l’uniforme et de la présentation',
      'Vérification des cartes d’élèves / macarons',
      'Orientation vers les rangs / préaux'
    ]
  },
  {
    title: 'Contrôle du démarrage des cours',
    description: 'Vérifier la montée des élèves en classe, la présence des enseignants et le démarrage effectif à 07h00.',
    instructions: [
      'Superviser la montée des rangs dans le calme.',
      'Vérifier que chaque classe est prise en charge par son professeur.',
      'Signaler immédiatement tout retard ou absence d’enseignant à la direction.'
    ],
    startTime: '07:00',
    endTime: '07:15',
    priority: 'critique',
    category: 'surveillance',
    checklist: [
      'Montée ordonnée des rangs',
      'Prise en charge de toutes les classes',
      'Vérification des enseignants présents',
      'Fermeture du portail principal'
    ]
  },
  {
    title: 'Gestion des retards',
    description: 'Accueil des retardataires au bureau de la vie scolaire, enregistrement des motifs et délivrance des billets.',
    instructions: [
      'Enregistrer les élèves retardataires dans le registre numérique.',
      'Noter l’heure exacte d’arrivée et recueillir le motif du retard.',
      'Identifier les élèves en situation de retards répétés.',
      'Délivrer le billet d’entrée ou orienter selon la procédure de l’établissement.'
    ],
    startTime: '07:15',
    endTime: '07:30',
    priority: 'haute',
    category: 'assiduite',
    checklist: [
      'Enregistrement de tous les élèves retardataires',
      'Saisie de l’heure d’arrivée et du motif',
      'Identification des récidives (> 3 retards)',
      'Émission des billets d’admission en classe'
    ]
  },
  {
    title: 'Contrôle des absences',
    description: 'Collecte des fiches d’appel de 1ère heure, rapprochement et identification des absences non justifiées.',
    instructions: [
      'Collecter les registres et fiches d’appel auprès des délégués ou enseignants.',
      'Saisir les absences de 1ère heure dans le module d’assiduité.',
      'Détecter les classes à fort taux d’absence (> 5 élèves absents).',
      'Vérifier les justificatifs médicaux ou parentaux déposés.'
    ],
    startTime: '07:30',
    endTime: '08:00',
    priority: 'critique',
    category: 'assiduite',
    checklist: [
      'Récupération des fiches d’appel de 1ère heure',
      'Saisie et validation des absences du jour',
      'Identification des absences non justifiées',
      'Pointage des justificatifs en attente'
    ]
  },
  {
    title: 'Première tournée de surveillance',
    description: 'Tournée dans les couloirs, blocs sanitaires, abords et cours pour s’assurer du calme et de l’absence de flâneurs.',
    instructions: [
      'Parcourir l’ensemble des étages et couloirs de votre secteur.',
      'Vérifier qu’aucun élève n’erre sans autorisation.',
      'Inspecter les blocs sanitaires et zones isolées.',
      'S’assurer de la tranquillité des cours dispensés.'
    ],
    startTime: '08:00',
    endTime: '09:00',
    priority: 'haute',
    category: 'surveillance',
    checklist: [
      'Tournée des couloirs et bâtiments de cours',
      'Contrôle des sanitaires et zones périmétriques',
      'Rappel à l’ordre des élèves hors classe avec billet',
      'Vérification de l’acoustique et du climat'
    ]
  },
  {
    title: 'Suivi individuel des élèves',
    description: 'Entretiens individuels d’écoute, de cadrage et de remédiation avec les élèves signalés.',
    instructions: [
      'Recevoir les élèves convoqués pour absentéisme ou écart disciplinaire.',
      'Écouter les explications de l’élève et formaliser un engagement écrit si nécessaire.',
      'Mettre à jour le dossier de vie scolaire de l’élève.',
      'Préparer les éléments à communiquer aux professeurs principaux.'
    ],
    startTime: '09:00',
    endTime: '10:00',
    priority: 'haute',
    category: 'eleves',
    checklist: [
      'Entretiens de cadrage réalisés',
      'Signature des contrats d’engagement moral',
      'Mise à jour des fiches individuelles',
      'Compte rendu succinct consigné'
    ]
  },
  {
    title: 'Surveillance de la récréation',
    description: 'Présence active dans la cour de récréation, prévention des bagarres, jeux dangereux et respect des espaces.',
    instructions: [
      'Prendre position dans la zone de surveillance assignée.',
      'Prévenir les bousculades, jeux brutaux et conflits naissants.',
      'Surveiller les abords de la cantine / kiosques.',
      'Siffler la fin de la récréation et superviser la mise en rang rapide.'
    ],
    startTime: '10:00',
    endTime: '10:15',
    priority: 'critique',
    category: 'discipline',
    checklist: [
      'Positionnement sur le secteur de cour désigné',
      'Vigilance sur les groupes et points aveugles',
      'Prévention des jeux à risque',
      'Sonnerie et supervision du rassemblement'
    ]
  },
  {
    title: 'Contrôle de la reprise des cours',
    description: 'Vérification de la réintégration ponctuelle de toutes les classes après la récréation.',
    instructions: [
      'S’assurer que tous les élèves ont regagné leurs salles respectives.',
      'Contrôler la reprise effective des cours avec les enseignants de 10h15.',
      'Traiter les éventuels retardataires de récréation.'
    ],
    startTime: '10:15',
    endTime: '11:00',
    priority: 'haute',
    category: 'surveillance',
    checklist: [
      'Évacuation complète de la cour',
      'Vérification des salles de classe',
      'Traitement des retards post-récréation'
    ]
  },
  {
    title: 'Suivi administratif',
    description: 'Traitement des dossiers, classement des justificatifs d’absence, rédaction des rapports d’incidents.',
    instructions: [
      'Classer les certificats médicaux et lettres d’excuse reçus.',
      'Rédiger les fiches d’incident disciplinaire du matin.',
      'Mettre à jour les registres et préparer les courriers de convocation.'
    ],
    startTime: '11:00',
    endTime: '12:00',
    priority: 'moyenne',
    category: 'administration',
    checklist: [
      'Traitement et validation des justificatifs reçus',
      'Rédaction des fiches d’incident',
      'Préparation des notifications administratives'
    ]
  },
  {
    title: 'Bilan de la matinée',
    description: 'Point d’étape avec le Responsable de Vie Scolaire : retards, absences, incidents et urgences de l’après-midi.',
    instructions: [
      'Consolider les chiffres d’assiduité de la matinée.',
      'Faire le point sur les incidents traités ou à suivre.',
      'Ajuster le planning et les priorités de surveillance de l’après-midi.'
    ],
    startTime: '12:00',
    endTime: '12:30',
    priority: 'haute',
    category: 'reporting',
    checklist: [
      'Statistiques d’assiduité du matin consolidées',
      'Point sur les incidents et sanctions en attente',
      'Transmission des alertes au Directeur des Études'
    ]
  },
  {
    title: 'Surveillance / pause',
    description: 'Surveillance de la pause méridienne, cantine scolaire, réfectoire et pause décalée par roulement.',
    instructions: [
      'Superviser l’accès ordonné au réfectoire / cantine.',
      'Surveiller les cours et préaux pendant la pause déjeuner.',
      'Assurer le roulement de pause avec les collègues éducateurs.'
    ],
    startTime: '12:30',
    endTime: '13:30',
    priority: 'haute',
    category: 'surveillance',
    checklist: [
      'Surveillance du réfectoire / cantine',
      'Contrôle des flux d’élèves externes et demi-pensionnaires',
      'Maintien de la sécurité sur le campus'
    ]
  },
  {
    title: 'Contrôle de la reprise',
    description: 'Accueil de l’après-midi, contrôle des entrées à 13h30 et démarrage des cours de 14h00.',
    instructions: [
      'Contrôler les entrées des élèves externes au portail.',
      'Superviser la montée en classe pour les cours de l’après-midi.',
      'Traiter les retards de 13h30 - 14h00.'
    ],
    startTime: '13:30',
    endTime: '14:00',
    priority: 'haute',
    category: 'assiduite',
    checklist: [
      'Contrôle des entrées de l’après-midi',
      'Montée des élèves en classe',
      'Enregistrement des retards de 13h30'
    ]
  },
  {
    title: 'Surveillance et suivi disciplinaire',
    description: 'Tournée générale, contrôle des heures de retenue et traitement des signalements des professeurs.',
    instructions: [
      'Superviser la salle d’études ou la salle de retenue si programmée.',
      'Répondre aux sollicitations disciplinaires des professeurs.',
      'Prendre en charge les élèves exclus temporairement de cours.'
    ],
    startTime: '14:00',
    endTime: '15:00',
    priority: 'haute',
    category: 'discipline',
    checklist: [
      'Surveillance de la salle de retenue / étude',
      'Prise en charge des exclusions de cours',
      'Entretiens d’apaisement immédiat'
    ]
  },
  {
    title: 'Accompagnement individuel',
    description: 'Entretiens d’écoute, soutien moral et suivi pédagogique pour élèves en situation de vulnérabilité.',
    instructions: [
      'Recevoir les élèves en baisse de résultats ou manifestant un mal-être.',
      'Échanger sur les difficultés rencontrées à l’école ou à la maison.',
      'Coordonner avec les professeurs principaux et le conseiller d’orientation.'
    ],
    startTime: '15:00',
    endTime: '15:30',
    priority: 'haute',
    category: 'eleves',
    checklist: [
      'Entretiens de soutien réalisés',
      'Fiches de suivi éducatif renseignées',
      'Points de liaison avec les professeurs principaux'
    ]
  },
  {
    title: 'Communication avec les familles',
    description: 'Appels téléphoniques, envoi de SMS / WhatsApp et relances auprès des parents d’élèves ciblés.',
    instructions: [
      'Contacter les parents des élèves absents sans motif depuis plusieurs jours.',
      'Informer les familles des incidents disciplinaires majeurs du jour.',
      'Confirmer les rendez-vous de conciliation du lendemain.',
      'Enregistrer un compte rendu d’appel dans le dossier élève.'
    ],
    startTime: '15:30',
    endTime: '16:00',
    priority: 'haute',
    category: 'parents',
    checklist: [
      'Appels passés aux parents prioritaires',
      'Messages de notification envoyés',
      'Comptes rendus d’appels saisis',
      'Convocations officielles programmées'
    ]
  },
  {
    title: 'Contrôle de fin de journée',
    description: 'Supervision de la sortie des cours à 16h30, évacuation sécurisée des locaux et du portail.',
    instructions: [
      'Prendre position au portail de sortie et sur le parvis.',
      'Veiller à la dispersion rapide et sécurisée des élèves.',
      'Prévenir tout attroupement hostile ou incident aux abords du lycée.',
      'S’assurer qu’aucun élève ne reste isolé sans moyen de transport.'
    ],
    startTime: '16:00',
    endTime: '16:30',
    priority: 'critique',
    category: 'surveillance',
    checklist: [
      'Présence au portail principal de sortie',
      'Sécurisation du parvis et abords immédiats',
      'Évacuation fluide des bus / taxis scolaires',
      'Fermeture sécurisée des accès'
    ]
  },
  {
    title: 'Bilan quotidien',
    description: 'Consolidation finale des données de vie scolaire : assiduité, discipline, tâches accomplies et rapport journalier.',
    instructions: [
      'Vérifier que toutes les absences et retards du jour sont saisis.',
      'Clôturer les fiches d’incident traitées.',
      'Générer le Bilan Quotidien de Vie Scolaire avec l’IA.',
      'Transmettre les points d’attention au Directeur et CDE.'
    ],
    startTime: '16:30',
    endTime: '17:00',
    priority: 'haute',
    category: 'reporting',
    checklist: [
      'Validation de la clôture d’assiduité du jour',
      'Revue du registre des sanctions',
      'Génération du bilan d’activité de l’éducateur',
      'Identification des 3 à 5 priorités de demain'
    ]
  },
  {
    title: 'Préparation du lendemain',
    description: 'Anticipation des convocations, préparation du registre d’accueil et vérification du chronogramme.',
    instructions: [
      'Préparer les dossiers des élèves convoqués pour demain matin.',
      'Vérifier les plannings de surveillance et les événements spéciaux du lendemain.',
      'Ranger et verrouiller les bureaux de la vie scolaire.'
    ],
    startTime: '17:00',
    endTime: '17:15',
    priority: 'haute',
    category: 'organisation',
    checklist: [
      'Liste des élèves convoqués demain prête',
      'Vérification des consignes du lendemain',
      'Extinction et fermeture sécurisée du bureau'
    ]
  }
];

export class EducatorChronogramService {
  static toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  static getIsoDayOfWeek(date: Date): number {
    const jsDay = date.getDay(); // 0 = Sunday ... 6 = Saturday
    return jsDay === 0 ? 7 : jsDay;
  }

  static isSchoolDay(date: Date, settings: EducatorAssistantSettings, exceptionDateKeys: string[] = []): boolean {
    const isoDay = this.getIsoDayOfWeek(date);
    if (!settings.activeDaysOfWeek.includes(isoDay)) return false;
    if (exceptionDateKeys.includes(this.toDateKey(date))) return false;
    return true;
  }

  static generateTasksForDate(
    date: Date,
    educatorId: string,
    schoolId: string,
    settings: EducatorAssistantSettings,
    exceptionDateKeys: string[] = []
  ): EducatorDailyTask[] {
    if (!this.isSchoolDay(date, settings, exceptionDateKeys)) return [];

    const dateKey = this.toDateKey(date);
    const now = new Date().toISOString();

    return DEFAULT_EDUCATOR_TEMPLATE.map((item, idx) => {
      const checklist: EducatorTaskChecklistItem[] = item.checklist.map((label, cIdx) => ({
        id: `echk_${dateKey}_${educatorId}_${idx}_${cIdx}`,
        label,
        checked: false
      }));

      const task: EducatorDailyTask = {
        id: `etask_${dateKey}_${educatorId}_${idx}`,
        schoolId,
        educatorId,
        taskDate: dateKey,
        title: item.title,
        description: item.description,
        instructions: item.instructions,
        checklist,
        startTime: item.startTime,
        endTime: item.endTime,
        originalStartTime: item.startTime,
        priority: item.priority,
        status: 'pending',
        category: item.category,
        isCustom: false,
        createdAt: now,
        updatedAt: now
      };
      return task;
    });
  }

  static readonly DEFAULT_SETTINGS: EducatorAssistantSettings = {
    assistantName: 'Éducateur+ — Assistant de Vie Scolaire',
    dayStartTime: '06:30',
    dayEndTime: '17:15',
    remindBeforeTaskMinutes: 5,
    intermediateReminderDelayMinutes: 10,
    overdueAlertDelayMinutes: 15,
    notificationsEnabled: true,
    browserNotificationsEnabled: false,
    activeDaysOfWeek: [1, 2, 3, 4, 5, 6],
    assignedClassIds: ['c_6a', 'c_6b', 'c_3a', 'c_3b']
  };
}
