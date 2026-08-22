import {
  School,
  AcademicYear,
  ClassLevel,
  Subject,
  ClassSubject,
  Student,
  Assessment,
  Grade,
  AttendanceRecord,
  DisciplinaryEvent,
  Payment,
  SchoolBudget,
  TimetableSlot,
  AIAlert,
  AIDecision,
  SchoolHealthScore,
  DailyIntelligenceBrief,
  WhatIfScenario,
  User,
  DirectorAssistantSettings,
  TeacherAbsence,
  EducatorAssistantSettings,
  EducatorSanction,
  ParentContactRecord
} from '../../types';

export const INITIAL_SCHOOL: School = {
  id: 'school_abidjan_01',
  name: "Lycée d'Excellence Félix Houphouët-Boigny",
  type: 'complexe_scolaire',
  code: 'LEFHB-ABJ',
  address: 'Boulevard Lagunaire, Cocody',
  city: 'Abidjan',
  country: "Côte d'Ivoire",
  currency: 'FCFA',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
  directorName: 'M. Kouamé N’Guessan',
  phone: '+225 07 08 12 34 56',
  email: 'direction@lycee-excellence.ci',
  currentAcademicYearId: 'ay_2025_2026',
  settings: {
    systemType: 'ivoirien',
    periodType: 'trimestre',
    enableMobileMoney: true,
    aiDecisionEngineActive: true
  }
};

export const INITIAL_ACADEMIC_YEAR: AcademicYear = {
  id: 'ay_2025_2026',
  schoolId: 'school_abidjan_01',
  name: 'Année Scolaire 2025-2026',
  startDate: '2025-09-08',
  endDate: '2026-06-30',
  isCurrent: true,
  periods: [
    { id: 'p1', number: 1, name: '1er Trimestre', startDate: '2025-09-08', endDate: '2025-12-05', isLocked: true },
    { id: 'p2', number: 2, name: '2ème Trimestre', startDate: '2025-12-08', endDate: '2026-03-13', isLocked: false },
    { id: 'p3', number: 3, name: '3ème Trimestre', startDate: '2026-03-16', endDate: '2026-06-19', isLocked: false }
  ]
};

export const INITIAL_CLASSES: ClassLevel[] = [
  { id: 'c_6a', schoolId: 'school_abidjan_01', name: '6ème 1', cycle: 'college', room: 'Salle 101', mainTeacherId: 't_koffi', studentCount: 42 },
  { id: 'c_6b', schoolId: 'school_abidjan_01', name: '6ème 2', cycle: 'college', room: 'Salle 102', mainTeacherId: 't_bamba', studentCount: 40 },
  { id: 'c_3a', schoolId: 'school_abidjan_01', name: '3ème 1 (BEPC)', cycle: 'college', room: 'Salle 201', mainTeacherId: 't_ouattara', studentCount: 45 },
  { id: 'c_3b', schoolId: 'school_abidjan_01', name: '3ème 2 (BEPC)', cycle: 'college', room: 'Salle 202', mainTeacherId: 't_kone', studentCount: 44 },
  { id: 'c_2a', schoolId: 'school_abidjan_01', name: '2nde A', cycle: 'lycee', series: 'A', room: 'Salle 301', mainTeacherId: 't_traore', studentCount: 38 },
  { id: 'c_2c', schoolId: 'school_abidjan_01', name: '2nde C', cycle: 'lycee', series: 'C', room: 'Salle 302', mainTeacherId: 't_diabate', studentCount: 36 },
  { id: 'c_1d', schoolId: 'school_abidjan_01', name: '1ère D', cycle: 'lycee', series: 'D', room: 'Salle 401', mainTeacherId: 't_yapi', studentCount: 35 },
  { id: 'c_td', schoolId: 'school_abidjan_01', name: 'Terminale D (BAC)', cycle: 'lycee', series: 'D', room: 'Salle 501', mainTeacherId: 't_yao', studentCount: 39 },
  { id: 'c_tc', schoolId: 'school_abidjan_01', name: 'Terminale C (BAC)', cycle: 'lycee', series: 'C', room: 'Salle 502', mainTeacherId: 't_koffi', studentCount: 28 },
  { id: 'c_ta2', schoolId: 'school_abidjan_01', name: 'Terminale A2 (BAC)', cycle: 'lycee', series: 'A2', room: 'Salle 503', mainTeacherId: 't_brou', studentCount: 41 }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 's_math', schoolId: 'school_abidjan_01', name: 'Mathématiques', code: 'MATH', category: 'scientifique', defaultCoefficient: 4 },
  { id: 's_pc', schoolId: 'school_abidjan_01', name: 'Physique-Chimie', code: 'PC', category: 'scientifique', defaultCoefficient: 4 },
  { id: 's_svt', schoolId: 'school_abidjan_01', name: 'SVT (Sciences de la Vie et de la Terre)', code: 'SVT', category: 'scientifique', defaultCoefficient: 3 },
  { id: 's_fr', schoolId: 'school_abidjan_01', name: 'Français & Littérature', code: 'FR', category: 'litteraire', defaultCoefficient: 4 },
  { id: 's_ang', schoolId: 'school_abidjan_01', name: 'Anglais', code: 'ANG', category: 'langue', defaultCoefficient: 3 },
  { id: 's_hg', schoolId: 'school_abidjan_01', name: 'Histoire-Géographie', code: 'HG', category: 'litteraire', defaultCoefficient: 3 },
  { id: 's_philo', schoolId: 'school_abidjan_01', name: 'Philosophie', code: 'PHILO', category: 'litteraire', defaultCoefficient: 4 },
  { id: 's_eps', schoolId: 'school_abidjan_01', name: 'Éducation Physique & Sportive (EPS)', code: 'EPS', category: 'artistique_sport', defaultCoefficient: 1 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u_dir',
    email: 'directeur@directeurpro.ci',
    firstName: 'Kouamé',
    lastName: 'N’Guessan',
    role: 'director',
    schoolId: 'school_abidjan_01',
    phone: '+225 07 08 12 34 56'
  },
  {
    id: 'u_cde',
    email: 'cde@directeurpro.ci',
    firstName: 'Awa',
    lastName: 'Bakayoko',
    role: 'academic_director',
    schoolId: 'school_abidjan_01',
    phone: '+225 05 44 22 11 00'
  },
  {
    id: 'u_educ',
    email: 'educateur.college@directeurpro.ci',
    firstName: 'Ibrahim',
    lastName: 'Soro',
    role: 'counselor',
    schoolId: 'school_abidjan_01',
    phone: '+225 01 23 45 67 89'
  },
  {
    id: 'u_educ2',
    email: 'educatrice.lycee@directeurpro.ci',
    firstName: 'Marie-Ange',
    lastName: 'Kouamé',
    role: 'counselor',
    schoolId: 'school_abidjan_01',
    phone: '+225 07 45 67 89 01'
  },
  {
    id: 'u_prof',
    email: 'enseignant@directeurpro.ci',
    firstName: 'Jean-Yves',
    lastName: 'Koffi',
    role: 'teacher',
    schoolId: 'school_abidjan_01',
    phone: '+225 07 89 54 12 30'
  },
  {
    id: 'u_cpt',
    email: 'comptable@directeurpro.ci',
    firstName: 'Esther',
    lastName: 'Tanoh',
    role: 'accountant',
    schoolId: 'school_abidjan_01',
    phone: '+225 05 66 77 88 99'
  },
  {
    id: 'u_par',
    email: 'parent@directeurpro.ci',
    firstName: 'Mireille',
    lastName: 'Aka',
    role: 'parent',
    schoolId: 'school_abidjan_01',
    phone: '+225 07 11 22 33 44'
  },
  {
    id: 'u_elv',
    email: 'eleve@directeurpro.ci',
    firstName: 'Emmanuel',
    lastName: 'Aka',
    role: 'student',
    schoolId: 'school_abidjan_01',
    phone: '+225 07 99 88 77 66'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_01',
    schoolId: 'school_abidjan_01',
    classId: 'c_td',
    className: 'Terminale D (BAC)',
    matricule: 'MAT-2025-0142',
    firstName: 'Emmanuel',
    lastName: 'Aka',
    gender: 'M',
    birthDate: '2008-04-14',
    guardianName: 'Mme Mireille Aka',
    guardianPhone: '+225 07 11 22 33 44',
    guardianEmail: 'm.aka@gmail.com',
    status: 'active',
    overallAverage: 8.75,
    previousAverage: 12.10,
    averageTrend: 'down',
    rank: 34,
    totalClassStudents: 39,
    attendanceRate: 74,
    unjustifiedAbsencesCount: 16,
    disciplinaryPoints: 14,
    riskScore: 84,
    riskCategory: 'critique',
    riskFactors: [
      'Chute brutale de moyenne (-3.35 pts)',
      '16 demi-journées d’absences non justifiées',
      'Décrochage marqué en Mathématiques (06.5/20) et PC (07/20)',
      'Échéance BAC dans 4 mois'
    ]
  },
  {
    id: 'std_02',
    schoolId: 'school_abidjan_01',
    classId: 'c_3a',
    className: '3ème 1 (BEPC)',
    matricule: 'MAT-2025-0089',
    firstName: 'Fatoumata',
    lastName: 'Koné',
    gender: 'F',
    birthDate: '2010-09-22',
    guardianName: 'M. Moussa Koné',
    guardianPhone: '+225 05 88 99 10 20',
    status: 'active',
    overallAverage: 9.15,
    previousAverage: 11.40,
    averageTrend: 'down',
    rank: 38,
    totalClassStudents: 45,
    attendanceRate: 82,
    unjustifiedAbsencesCount: 11,
    disciplinaryPoints: 17,
    riskScore: 72,
    riskCategory: 'eleve',
    riskFactors: [
      'Fragilité en sciences au BEPC',
      'Absences récurrentes le lundi matin',
      'Non-remise de 3 devoirs maison'
    ]
  },
  {
    id: 'std_03',
    schoolId: 'school_abidjan_01',
    classId: 'c_2a',
    className: '2nde A',
    matricule: 'MAT-2025-0311',
    firstName: 'Junior',
    lastName: 'Kouassi',
    gender: 'M',
    birthDate: '2009-11-05',
    guardianName: 'M. Pascal Kouassi',
    guardianPhone: '+225 01 44 55 66 77',
    status: 'active',
    overallAverage: 14.85,
    previousAverage: 14.20,
    averageTrend: 'up',
    rank: 3,
    totalClassStudents: 38,
    attendanceRate: 98,
    unjustifiedAbsencesCount: 0,
    disciplinaryPoints: 20,
    riskScore: 8,
    riskCategory: 'faible',
    riskFactors: []
  },
  {
    id: 'std_04',
    schoolId: 'school_abidjan_01',
    classId: 'c_tc',
    className: 'Terminale C (BAC)',
    matricule: 'MAT-2025-0004',
    firstName: 'Grâce Emmanuelle',
    lastName: 'N’Dri',
    gender: 'F',
    birthDate: '2008-01-19',
    guardianName: 'Dr. N’Dri Albert',
    guardianPhone: '+225 07 55 44 33 22',
    status: 'active',
    overallAverage: 17.65,
    previousAverage: 17.10,
    averageTrend: 'up',
    rank: 1,
    totalClassStudents: 28,
    attendanceRate: 100,
    unjustifiedAbsencesCount: 0,
    disciplinaryPoints: 20,
    riskScore: 2,
    riskCategory: 'faible',
    riskFactors: []
  },
  {
    id: 'std_05',
    schoolId: 'school_abidjan_01',
    classId: 'c_3b',
    className: '3ème 2 (BEPC)',
    matricule: 'MAT-2025-0199',
    firstName: 'Cedric',
    lastName: 'Bamba',
    gender: 'M',
    birthDate: '2010-06-12',
    guardianName: 'Mme Bamba Salimata',
    guardianPhone: '+225 05 12 34 98 76',
    status: 'active',
    overallAverage: 8.20,
    previousAverage: 8.90,
    averageTrend: 'down',
    rank: 42,
    totalClassStudents: 44,
    attendanceRate: 68,
    unjustifiedAbsencesCount: 22,
    disciplinaryPoints: 11,
    riskScore: 88,
    riskCategory: 'critique',
    riskFactors: [
      'Risque imminent de décrochage scolaire',
      '22 demi-journées d’absence',
      '3 avertissements disciplinaires pour bavardage et insubordination',
      'Moyenne générale inférieure au seuil de passage (8.20/20)'
    ]
  }
];

export const INITIAL_SCHOOL_HEALTH: SchoolHealthScore = {
  overall: 84,
  status: 'BON',
  dimensions: {
    pedagogy: { score: 81, trend: 'stable', label: 'Pédagogie & Résultats' },
    attendance: { score: 91, trend: 'up', label: 'Assiduité Globale' },
    discipline: { score: 88, trend: 'up', label: 'Climat & Vie Scolaire' },
    finance: { score: 76, trend: 'down', label: 'Santé Financière & Recouvrement' },
    resources: { score: 85, trend: 'stable', label: 'RH & Taux d’Encadrement' },
    communication: { score: 89, trend: 'up', label: 'Engagement Parents' }
  },
  calculatedAt: new Date().toISOString()
};

export const INITIAL_DAILY_BRIEF: DailyIntelligenceBrief = {
  date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  greeting: 'Bonjour M. le Directeur Kouamé N’Guessan.',
  schoolHealthScore: 84,
  keyStats: {
    attendanceToday: 95.8,
    gradesEnteredPercent: 93.4,
    criticalAlertsCount: 2,
    importantAlertsCount: 3,
    pendingPaymentsCount: 37
  },
  topPriorities: [
    {
      id: 'prio_1',
      priorityNumber: 1,
      title: '3 élèves en risque critique d’échec et de décrochage en Terminale D & 3ème 2',
      urgency: 'critique',
      suggestedAction: 'Déclencher la commission éducative et planifier un entretien parental avec contrat d’objectifs.',
      routeLink: '/vigilance'
    },
    {
      id: 'prio_2',
      priorityNumber: 2,
      title: 'Baisse significative en Mathématiques pour la classe de 3ème 2 (Moyenne 9.12/20)',
      urgency: 'important',
      suggestedAction: 'Valider la décision IA : Mise en place de 2 séances hebdomadaires de tutorat ciblé.',
      routeLink: '/decisions'
    },
    {
      id: 'prio_3',
      priorityNumber: 3,
      title: '14 250 000 FCFA d’arriérés de scolarité à relancer avant les examens blancs',
      urgency: 'important',
      suggestedAction: 'Générer et envoyer la campagne SMS diplomatique ciblée avec lien de paiement Wave/Orange Money.',
      routeLink: '/finance'
    }
  ]
};

export const INITIAL_ALERTS: AIAlert[] = [
  {
    id: 'alt_01',
    schoolId: 'school_abidjan_01',
    severity: 'critique',
    category: 'pedagogie',
    title: '3 élèves présentent un risque élevé d’échec au BAC / BEPC',
    description: 'Chute de moyenne de plus de 2.5 points conjuguée à un cumul d’absences non justifiées supérieur à 15 heures.',
    detectedAt: '2026-08-20T06:30:00Z',
    rootCauses: [
      'Lacunes accumulées dans les matières scientifiques à fort coefficient (Maths, PC)',
      'Absentéisme non régularisé le matin',
      'Manque de communication avec les tuteurs légaux'
    ],
    dataContext: {
      metric: 'Nombre d’élèves avec RiskScore > 80',
      currentValue: 3,
      threshold: 0,
      affectedEntities: ['Emmanuel Aka (Tle D)', 'Cedric Bamba (3ème 2)', 'Fatoumata Koné (3ème 1)']
    },
    confidenceLevel: 94,
    status: 'active',
    assignedToRole: 'academic_director'
  },
  {
    id: 'alt_02',
    schoolId: 'school_abidjan_01',
    severity: 'important',
    category: 'pedagogie',
    title: 'Anomalie de performance en Mathématiques — Classe de 3ème 2',
    description: '18 élèves sur 44 ont une moyenne inférieure à 10/20 sur le 2ème trimestre, soit un écart de -2.4 pts par rapport à la 3ème 1.',
    detectedAt: '2026-08-19T14:15:00Z',
    rootCauses: [
      'Rythme d’évaluation trop espacé au début du trimestre',
      'Concepts d’algèbre et géométrie dans l’espace mal assimilés'
    ],
    dataContext: {
      metric: 'Moyenne de classe en Mathématiques',
      currentValue: '9.12 / 20',
      threshold: '11.50 / 20'
    },
    confidenceLevel: 89,
    status: 'active',
    assignedToRole: 'director'
  },
  {
    id: 'alt_03',
    schoolId: 'school_abidjan_01',
    severity: 'important',
    category: 'finance',
    title: 'Ralentissement du recouvrement des frais de scolarité (Tranche 2)',
    description: 'Taux de recouvrement actuel de 74.2% contre 86.0% attendu à cette période. 37 familles en retard de paiement.',
    detectedAt: '2026-08-19T08:00:00Z',
    rootCauses: [
      'Absence de relance automatique par SMS Mobile Money',
      'Échéancier non réajusté pour les familles en difficulté'
    ],
    dataContext: {
      metric: 'Montant total des impayés Tranche 2',
      currentValue: '14 250 000 FCFA',
      threshold: '5 000 000 FCFA'
    },
    confidenceLevel: 98,
    status: 'active',
    assignedToRole: 'accountant'
  },
  {
    id: 'alt_04',
    schoolId: 'school_abidjan_01',
    severity: 'a_surveiller',
    category: 'assiduite',
    title: 'Hausse des retards de 1ère heure en 2nde A (Vendredi)',
    description: '12 élèves en retard répété de plus de 15 minutes sur le créneau de 07h30 le vendredi.',
    detectedAt: '2026-08-18T11:00:00Z',
    rootCauses: [
      'Embouteillages signalés sur l’axe Riviera 2 - Palmeraie',
      'Manque de sensibilisation à l’appel de 07h30'
    ],
    dataContext: {
      metric: 'Taux de ponctualité 2nde A vendredi',
      currentValue: '68.4%',
      threshold: '90.0%'
    },
    confidenceLevel: 85,
    status: 'in_progress',
    assignedToRole: 'counselor'
  }
];

export const INITIAL_DECISIONS: AIDecision[] = [
  {
    id: 'dec_01',
    schoolId: 'school_abidjan_01',
    alertId: 'alt_02',
    problemTitle: '18 élèves de 3ème 2 en difficulté majeure en Mathématiques (Moyenne < 10)',
    problemSummary: 'La classe de 3ème 2 accuse un retard méthodologique critique à 3 mois des épreuves du BEPC.',
    domain: 'pedagogie',
    dataPointsUsed: [
      'Notes des 3 derniers devoirs surveillés de Mathématiques',
      'Historique comparatif 3ème 1 vs 3ème 2',
      'Assiduité aux cours de sciences (94%)'
    ],
    rootCauseAnalysis: 'La difficulté est purement pédagogique (assimilation des théorèmes et factorisation) et non comportementale.',
    confidenceScore: 91,
    urgencyScore: 8,
    options: [
      {
        id: 'opt_1a',
        title: 'Option A : Heure de cours magistral supplémentaire le mercredi après-midi',
        description: 'Ajouter 1h30 collective pour l’ensemble de la classe de 3ème 2.',
        pros: ['Facile à planifier dans l’emploi du temps', 'Coût forfaitaire modéré'],
        cons: ['Peu différencié pour les élèves déjà performants', 'Risque de fatigue'],
        estimatedCostFcfa: 45000,
        expectedImpactScore: 6,
        implementationTime: '1 semaine',
        isRecommended: false
      },
      {
        id: 'opt_1b',
        title: 'Option B : Tutorat ciblé par petits groupes de 6 élèves + fiches de remédiation (Recommandé)',
        description: 'Séparer les 18 élèves fragiles en 3 groupes de 6 avec un enseignant tuteur et des exercices gradués.',
        pros: [
          'Impact pédagogique maximal (+2.5 à +3 pts attendus)',
          'Diagnostic personnalisé des blocages',
          'Motivation renforcée'
        ],
        cons: ['Mobilisation de 2 créneaux d’enseignants assistants'],
        estimatedCostFcfa: 80000,
        expectedImpactScore: 9,
        implementationTime: '3 jours',
        isRecommended: true
      },
      {
        id: 'opt_1c',
        title: 'Option C : Réaménagement des coefficients et devoirs maison intensifs',
        description: 'Donner des devoirs maisons hebdomadaires corrigés en classe.',
        pros: ['Coût financier nul', 'Pas de modification de planning'],
        cons: ['Risque de copie entre élèves', 'Impact très limité sur la compréhension réelle'],
        estimatedCostFcfa: 0,
        expectedImpactScore: 4,
        implementationTime: 'Immédiat',
        isRecommended: false
      }
    ],
    recommendedOptionId: 'opt_1b',
    status: 'pending_director',
    impactMetricName: 'Moyenne générale en Mathématiques 3ème 2',
    beforeMetricValue: 9.12
  },
  {
    id: 'dec_02',
    schoolId: 'school_abidjan_01',
    problemTitle: 'Plan d’action de remédiation en Français pour la 6ème 1 (Terminé & Mesuré)',
    problemSummary: 'Difficultés en orthographe et expression écrite au 1er trimestre.',
    domain: 'pedagogie',
    dataPointsUsed: ['Devoirs du 1er trimestre', 'Évaluation diagnostique d’entrée'],
    rootCauseAnalysis: 'Transition difficile du CM2 au collège sur l’analyse grammaticale.',
    confidenceScore: 95,
    urgencyScore: 7,
    options: [
      {
        id: 'opt_2a',
        title: 'Atelier de dictée flash et lecture guidée 30 min / semaine',
        description: 'Atelier quotidien court de 15 minutes en début de cours.',
        pros: ['Ancrage régulier', 'Succès éprouvé'],
        cons: ['Nécessite rigueur de l’enseignant'],
        expectedImpactScore: 8,
        implementationTime: 'Immédiat',
        isRecommended: true
      }
    ],
    recommendedOptionId: 'opt_2a',
    status: 'accepted',
    chosenOptionId: 'opt_2a',
    directorNotes: 'Validé en conseil d’enseignement. Déployé sur 6 semaines.',
    decidedAt: '2025-10-15T09:00:00Z',
    impactMetricName: 'Moyenne de classe en Français 6ème 1',
    beforeMetricValue: 10.20,
    afterMetricValue: 12.85,
    impactMeasuredAt: '2025-12-05T15:00:00Z',
    impactResultSummary: 'Gain net de +2.65 points sur la moyenne de classe. 89% des élèves ont validé le palier d’orthographe.'
  }
];

export const INITIAL_BUDGET: SchoolBudget = {
  id: 'bgt_2025_2026',
  schoolId: 'school_abidjan_01',
  academicYearId: 'ay_2025_2026',
  totalExpectedRevenue: 185000000, // 185M FCFA
  totalCollectedRevenue: 139500000, // 139.5M FCFA
  totalOutstandingDebt: 45500000, // 45.5M FCFA
  totalExpenses: 98200000, // 98.2M FCFA
  recoveryRate: 75.4, // %
  financialHealthScore: 78
};

export const INITIAL_ASSISTANT_SETTINGS: DirectorAssistantSettings = {
  assistantName: 'Assistant DE — Agent de Pilotage Pédagogique',
  dayStartTime: '06:45',
  dayEndTime: '17:15',
  remindBeforeTaskMinutes: 5,
  intermediateReminderDelayMinutes: 10,
  overdueAlertDelayMinutes: 20,
  notificationsEnabled: true,
  browserNotificationsEnabled: false,
  activeDaysOfWeek: [1, 2, 3, 4, 5, 6]
};

// Local date key generator (mirrors ChronogramService.toDateKey) — avoids
// UTC/local mismatches that toISOString() would introduce near midnight.
const todayLocalDateKey = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Seed data so the assistant's contextual detection (§11-13) has a real
// case to react to on first load, instead of an empty state.
export const INITIAL_TEACHER_ABSENCES: TeacherAbsence[] = [
  {
    id: 'tabs_01',
    schoolId: 'school_abidjan_01',
    teacherId: 't_yao',
    teacherName: 'M. Serge Yao',
    classId: 'c_td',
    className: 'Terminale D (BAC)',
    subjectName: 'Physique-Chimie',
    date: todayLocalDateKey(),
    timeSlot: '07:00 - 09:00',
    reason: 'Absence non justifiée (aucun message reçu)',
    status: 'non_traitee'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_001',
    schoolId: 'school_abidjan_01',
    studentId: 'std_04',
    studentName: 'Grâce Emmanuelle N’Dri',
    className: 'Terminale C (BAC)',
    receiptNumber: 'REC-2026-0891',
    amount: 350000,
    paymentDate: '2026-08-19T10:30:00Z',
    paymentMethod: 'wave',
    transactionReference: 'WAVE-CI-9988231',
    feeType: 'scolarite',
    status: 'valide',
    collectedBy: 'Mme Esther Tanoh'
  },
  {
    id: 'pay_002',
    schoolId: 'school_abidjan_01',
    studentId: 'std_03',
    studentName: 'Junior Kouassi',
    className: '2nde A',
    receiptNumber: 'REC-2026-0890',
    amount: 150000,
    paymentDate: '2026-08-18T16:15:00Z',
    paymentMethod: 'orange_money',
    transactionReference: 'OM-CI-4411902',
    feeType: 'scolarite',
    status: 'valide',
    collectedBy: 'Mme Esther Tanoh'
  },
  {
    id: 'pay_003',
    schoolId: 'school_abidjan_01',
    studentId: 'std_02',
    studentName: 'Fatoumata Koné',
    className: '3ème 1 (BEPC)',
    receiptNumber: 'REC-2026-0889',
    amount: 85000,
    paymentDate: '2026-08-17T11:45:00Z',
    paymentMethod: 'mtn_momo',
    transactionReference: 'MTN-CI-7733190',
    feeType: 'cantine',
    status: 'valide',
    collectedBy: 'Mme Esther Tanoh'
  }
];

export const INITIAL_WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'scen_01',
    title: 'Recrutement de 2 Enseignants Assistants en Mathématiques & Sciences',
    category: 'recrutement',
    parameters: {
      newTeachersCount: 2,
      monthlySalaryPerTeacherFcfa: 400000,
      targetClasses: ['3ème 1', '3ème 2', 'Terminale D', 'Terminale C']
    },
    projectedOutcomes: [
      { metric: 'Taux de réussite estimé au BEPC', currentValue: '76.4%', projectedValue: '88.5%', delta: '+12.1%', trend: 'positive' },
      { metric: 'Taux de réussite estimé au BAC D', currentValue: '72.0%', projectedValue: '84.0%', delta: '+12.0%', trend: 'positive' },
      { metric: 'Coût annuel net additionnel', currentValue: '0 FCFA', projectedValue: '7 200 000 FCFA', delta: '+7.2M FCFA', trend: 'negative' },
      { metric: 'Attractivité & Nouvelles inscriptions estimées', currentValue: '420 élèves', projectedValue: '465 élèves (+45)', delta: '+10.7%', trend: 'positive' },
      { metric: 'Recettes supplémentaires potentielles', currentValue: '0 FCFA', projectedValue: '+15 750 000 FCFA', delta: '+15.75M FCFA', trend: 'positive' },
      { metric: 'Retour sur investissement financier (ROI)', currentValue: '-', projectedValue: '+218%', delta: 'Positif', trend: 'positive' }
    ],
    assumptions: [
      'Diminution du ratio élèves/enseignant lors des séances de TD',
      'Assiduité maintenue des élèves bénéficiaires',
      'Frais d’écolage moyen fixé à 350 000 FCFA / élève / an'
    ],
    aiAnalysis: 'L’investissement est hautement rentable tant sur le plan académique (hausse de ~12 pts de réussite) que financier (gain net estimé à 8.5M FCFA grâce aux nouvelles inscriptions portées par la réputation).'
  },
  {
    id: 'scen_02',
    title: 'Mise en place de 2 Heures de Soutien Obligatoire pour élèves à risque',
    category: 'soutien_pedagogique',
    parameters: {
      hoursPerWeek: 2,
      hourlyRateFcfa: 7500,
      studentsEnrolled: 60
    },
    projectedOutcomes: [
      { metric: 'Taux de passage en classe supérieure', currentValue: '78.2%', projectedValue: '89.0%', delta: '+10.8%', trend: 'positive' },
      { metric: 'Baisse du risque de décrochage', currentValue: '14 élèves critiques', projectedValue: '3 élèves critiques', delta: '-78.5%', trend: 'positive' },
      { metric: 'Coût trimestriel total', currentValue: '0 FCFA', projectedValue: '540 000 FCFA', delta: '+540k FCFA', trend: 'neutral' }
    ],
    assumptions: [
      'Groupes restreints de 10 élèves max',
      'Modules axés sur la méthodologie de révision'
    ],
    aiAnalysis: 'Action à impact immédiat, particulièrement recommandée pour les classes d’examen.'
  }
];

export const INITIAL_EDUCATOR_SETTINGS: EducatorAssistantSettings = {
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

export const INITIAL_DISCIPLINARY_EVENTS: DisciplinaryEvent[] = [
  {
    id: 'devt_01',
    schoolId: 'school_abidjan_01',
    studentId: 'std_05',
    studentName: 'Cedric Bamba',
    className: '3ème 2 (BEPC)',
    date: todayLocalDateKey(),
    type: 'bagarre',
    severity: 'grave',
    description: 'Altercation physique lors de la montée des rangs avec un camarade.',
    sanction: 'Heure de colle + Convocation parentale',
    reportedBy: 'M. Soro (Éducateur)',
    status: 'en_cours'
  },
  {
    id: 'devt_02',
    schoolId: 'school_abidjan_01',
    studentId: 'std_01',
    studentName: 'Emmanuel Aka',
    className: 'Terminale D (BAC)',
    date: todayLocalDateKey(),
    type: 'retard_repete',
    severity: 'moyenne',
    description: '3ème retard consécutif de plus de 20 min en 1ère heure sans justificatif.',
    sanction: 'Avertissement écrit de vie scolaire',
    reportedBy: 'Mme Kouamé (Éducatrice)',
    status: 'ouvert'
  },
  {
    id: 'devt_03',
    schoolId: 'school_abidjan_01',
    studentId: 'std_02',
    studentName: 'Fatoumata Koné',
    className: '3ème 1 (BEPC)',
    date: '2026-08-20',
    type: 'bavardage',
    severity: 'mineure',
    description: 'Perturbation répétée du cours de SVT.',
    sanction: 'Devoir supplémentaire surveillé',
    reportedBy: 'Professeur de SVT',
    status: 'traite'
  }
];

export const INITIAL_EDUCATOR_SANCTIONS: EducatorSanction[] = [
  {
    id: 'sanc_01',
    schoolId: 'school_abidjan_01',
    studentId: 'std_05',
    studentName: 'Cedric Bamba',
    className: '3ème 2 (BEPC)',
    type: 'retenue',
    reason: 'Comportement violent et perturbation de la récréation',
    date: todayLocalDateKey(),
    durationOrSchedule: 'Samedi matin 08h00 - 10h00',
    status: 'en_attente',
    decidedBy: 'Ibrahim Soro (Éducateur)',
    notes: 'Travail d’intérêt éducatif en bibliothèque'
  },
  {
    id: 'sanc_02',
    schoolId: 'school_abidjan_01',
    studentId: 'std_01',
    studentName: 'Emmanuel Aka',
    className: 'Terminale D (BAC)',
    type: 'convocation',
    reason: 'Cumul de 16 absences non justifiées et retards matinaux',
    date: todayLocalDateKey(),
    durationOrSchedule: 'Lundi prochain 09h00',
    status: 'en_attente',
    decidedBy: 'Marie-Ange Kouamé (Éducatrice)',
    notes: 'Entretien avec Mme Mireille Aka (Mère)'
  },
  {
    id: 'sanc_03',
    schoolId: 'school_abidjan_01',
    studentId: 'std_02',
    studentName: 'Fatoumata Koné',
    className: '3ème 1 (BEPC)',
    type: 'avertissement',
    reason: 'Absences non autorisées répétées le lundi',
    date: '2026-08-18',
    durationOrSchedule: 'Inscription au dossier scolaire',
    status: 'validee',
    decidedBy: 'Ibrahim Soro (Éducateur)'
  }
];

export const INITIAL_PARENT_CONTACTS: ParentContactRecord[] = [
  {
    id: 'pcon_01',
    schoolId: 'school_abidjan_01',
    studentId: 'std_01',
    studentName: 'Emmanuel Aka',
    guardianName: 'Mme Mireille Aka',
    guardianPhone: '+225 07 11 22 33 44',
    reason: 'Alerte absences répétées et chute de résultats',
    channel: 'appel',
    status: 'en_attente',
    educatorId: 'u_educ'
  },
  {
    id: 'pcon_02',
    schoolId: 'school_abidjan_01',
    studentId: 'std_05',
    studentName: 'Cedric Bamba',
    guardianName: 'Mme Bamba Salimata',
    guardianPhone: '+225 05 12 34 98 76',
    reason: 'Convocation suite à incident disciplinaire',
    channel: 'appel',
    status: 'en_attente',
    educatorId: 'u_educ'
  },
  {
    id: 'pcon_03',
    schoolId: 'school_abidjan_01',
    studentId: 'std_02',
    studentName: 'Fatoumata Koné',
    guardianName: 'M. Moussa Koné',
    guardianPhone: '+225 05 88 99 10 20',
    reason: 'Point de situation sur l’assiduité au BEPC',
    channel: 'sms',
    status: 'effectue',
    contactedAt: '2026-08-21T15:45:00Z',
    notes: 'Le parent a confirmé avoir pris connaissance du bilan.',
    educatorId: 'u_educ'
  }
];

