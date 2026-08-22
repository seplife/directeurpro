// ==========================================
// DIRECTEURPRO - CORE DOMAIN MODEL & TYPES
// ==========================================

export type UserRole =
  | 'super_admin'
  | 'director'
  | 'academic_director'
  | 'counselor' // Éducateur / Surveillant général
  | 'teacher'
  | 'accountant'
  | 'secretary'
  | 'parent'
  | 'student';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  schoolId: string;
  phone?: string;
  permissions?: string[];
}

export interface School {
  id: string;
  name: string;
  type: 'college' | 'lycee' | 'complexe_scolaire';
  code: string;
  address: string;
  city: string;
  country: string;
  currency: string; // e.g. "FCFA"
  logoUrl: string;
  directorName: string;
  phone: string;
  email: string;
  currentAcademicYearId: string;
  settings: {
    systemType: 'ivoirien' | 'francais' | 'personnalise';
    periodType: 'trimestre' | 'semestre';
    enableMobileMoney: boolean;
    aiDecisionEngineActive: boolean;
  };
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string; // e.g. "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  periods: {
    id: string;
    number: number;
    name: string; // "1er Trimestre", "2ème Trimestre", "3ème Trimestre"
    startDate: string;
    endDate: string;
    isLocked: boolean;
  }[];
}

export interface ClassLevel {
  id: string;
  schoolId: string;
  name: string; // "6ème", "5ème", "3ème", "2nde C", "1ère D", "Tle C", "Tle D", "Tle A2"
  cycle: 'college' | 'lycee';
  series?: string; // "A1", "A2", "C", "D", "G2"
  room: string;
  mainTeacherId: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string; // "Mathématiques", "Physique-Chimie", "Français", "SVT", "Anglais", "Histoire-Géo", "Philosophie", "EPS"
  code: string;
  category: 'scientifique' | 'litteraire' | 'langue' | 'artistique_sport';
  defaultCoefficient: number;
}

export interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  coefficient: number;
  weeklyHours: number;
}

export interface Student {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  photoUrl?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  status: 'active' | 'transferred' | 'graduated' | 'dropped_out';
  // Calculated indicators
  overallAverage: number;
  previousAverage: number;
  averageTrend: 'up' | 'down' | 'stable';
  rank: number;
  totalClassStudents: number;
  attendanceRate: number; // 0 to 100%
  unjustifiedAbsencesCount: number;
  disciplinaryPoints: number; // Starting from 20
  riskScore: number; // 0 to 100
  riskCategory: 'faible' | 'modere' | 'important' | 'eleve' | 'critique';
  riskFactors: string[];
}

export interface Assessment {
  id: string;
  schoolId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  periodId: string;
  title: string; // "Interrogation N°1", "Devoir Surveillé 2", "Composition de passage", "Examen Blanc"
  type: 'interrogation' | 'devoir_surveille' | 'composition' | 'examen_blanc';
  coefficient: number;
  maxScore: number; // usually 20
  date: string;
  isPublished: boolean;
}

export interface Grade {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number; // 0 to 20
  comment?: string;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  timeSlot: string;
  subjectId?: string;
  type: 'absence' | 'retard' | 'present' | 'dispense';
  status: 'justifiee' | 'non_justifiee' | 'en_attente';
  justificationReason?: string;
}

export interface DisciplinaryEvent {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  type: 'retard_repete' | 'bavardage' | 'insolence' | 'bagarre' | 'fraude' | 'felicitations' | 'encouragements';
  severity: 'mineure' | 'moyenne' | 'grave' | 'critique';
  description: string;
  sanction?: string; // "Avertissement écrit", "Heure de colle", "Exclusion temporaire 3 jours"
  reportedBy: string;
  status: 'ouvert' | 'en_cours' | 'traite';
}

export interface Payment {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  className: string;
  receiptNumber: string;
  amount: number; // in FCFA
  paymentDate: string;
  paymentMethod: 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money' | 'especes' | 'virement' | 'cheque';
  transactionReference?: string;
  feeType: 'scolarite' | 'inscription' | 'cantine' | 'transport' | 'uniforme' | 'examen';
  status: 'valide' | 'en_attente' | 'rejete';
  collectedBy: string;
}

export interface SchoolBudget {
  id: string;
  schoolId: string;
  academicYearId: string;
  totalExpectedRevenue: number;
  totalCollectedRevenue: number;
  totalOutstandingDebt: number; // Impayés
  totalExpenses: number;
  recoveryRate: number; // Taux de recouvrement %
  financialHealthScore: number; // 0 to 100
}

export interface TimetableSlot {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6; // 1 = Lundi ... 6 = Samedi
  startTime: string; // "07:30"
  endTime: string; // "09:30"
  hasConflict?: boolean;
  conflictReason?: string;
}

// ==========================================
// DECISION INTELLIGENCE & AI TYPES
// ==========================================

export type AlertSeverity = 'critique' | 'important' | 'a_surveiller' | 'information';

export interface AIAlert {
  id: string;
  schoolId: string;
  severity: AlertSeverity;
  category: 'pedagogie' | 'assiduite' | 'discipline' | 'finance' | 'ressources';
  title: string;
  description: string;
  detectedAt: string;
  rootCauses: string[];
  dataContext: {
    metric: string;
    currentValue: string | number;
    threshold: string | number;
    sampleSize?: string;
    affectedEntities?: string[];
  };
  confidenceLevel: number; // 0 to 100%
  recommendedActionId?: string;
  status: 'active' | 'in_progress' | 'resolved' | 'dismissed';
  assignedToRole?: UserRole;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  estimatedCostFcfa?: number;
  expectedImpactScore: number; // 1 to 10
  implementationTime: string; // e.g. "Immédiat", "3 jours", "2 semaines"
  isRecommended: boolean;
}

export interface AIDecision {
  id: string;
  schoolId: string;
  alertId?: string;
  problemTitle: string;
  problemSummary: string;
  domain: 'pedagogie' | 'vie_scolaire' | 'finance' | 'organisation' | 'strategie';
  dataPointsUsed: string[];
  rootCauseAnalysis: string;
  confidenceScore: number; // 0 to 100%
  urgencyScore: number; // 1 to 10
  options: DecisionOption[];
  recommendedOptionId: string;
  status: 'pending_director' | 'accepted' | 'modified' | 'rejected';
  chosenOptionId?: string;
  directorNotes?: string;
  decidedAt?: string;
  // Impact Tracker
  impactMetricName?: string;
  beforeMetricValue?: number | string;
  afterMetricValue?: number | string;
  impactMeasuredAt?: string;
  impactResultSummary?: string;
}

export interface SchoolHealthScore {
  overall: number; // 0 to 100
  status: 'EXCELLENT' | 'BON' | 'VIGILANCE' | 'CRITIQUE';
  dimensions: {
    pedagogy: { score: number; trend: 'up' | 'down' | 'stable'; label: string };
    attendance: { score: number; trend: 'up' | 'down' | 'stable'; label: string };
    discipline: { score: number; trend: 'up' | 'down' | 'stable'; label: string };
    finance: { score: number; trend: 'up' | 'down' | 'stable'; label: string };
    resources: { score: number; trend: 'up' | 'down' | 'stable'; label: string };
    communication: { score: number; trend: 'up' | 'down' | 'stable'; label: string };
  };
  calculatedAt: string;
}

export interface DailyIntelligenceBrief {
  date: string;
  greeting: string;
  schoolHealthScore: number;
  keyStats: {
    attendanceToday: number;
    gradesEnteredPercent: number;
    criticalAlertsCount: number;
    importantAlertsCount: number;
    pendingPaymentsCount: number;
  };
  topPriorities: {
    id: string;
    priorityNumber: number;
    title: string;
    urgency: 'critique' | 'important' | 'a_surveiller';
    suggestedAction: string;
    routeLink: string;
  }[];
}

export interface WhatIfScenario {
  id: string;
  title: string;
  category: 'recrutement' | 'soutien_pedagogique' | 'effectifs' | 'frais_scolaires';
  parameters: Record<string, any>;
  projectedOutcomes: {
    metric: string;
    currentValue: string | number;
    projectedValue: string | number;
    delta: string;
    trend: 'positive' | 'negative' | 'neutral';
  }[];
  assumptions: string[];
  aiAnalysis: string;
}

export interface AIAuditLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  agentName: string;
  queryOrAction: string;
  dataEntitiesAccessed: string[];
  confidenceScore: number;
  timestamp: string;
}

// ==========================================
// DIRECTOR ASSISTANT (AGENT DE PILOTAGE PÉDAGOGIQUE)
// ==========================================

export type DirectorTaskStatus =
  | 'pending'    // à venir, hors créneau
  | 'active'     // dans son créneau horaire actuel
  | 'completed'  // marquée terminée par l'utilisateur
  | 'postponed'  // reportée à une nouvelle heure
  | 'skipped'    // ignorée volontairement
  | 'overdue';   // créneau dépassé sans action

export type DirectorTaskPriority = 'faible' | 'moyenne' | 'haute' | 'critique';

export type DirectorTaskCategory =
  | 'preparation'
  | 'attendance'
  | 'supervision'
  | 'pedagogy'
  | 'students'
  | 'administration'
  | 'reporting';

export interface DirectorTaskChecklistItem {
  id: string;
  label: string;
}

export interface DirectorTask {
  id: string;
  schoolId: string;
  userId: string;       // Directeur des Études (ou rôle autorisé) concerné
  taskDate: string;      // "2026-08-22"
  title: string;
  description: string;
  checklist: DirectorTaskChecklistItem[];
  startTime: string;     // "07:00"
  endTime: string;       // "07:15"
  originalStartTime: string; // conservée pour l'historique en cas de report
  priority: DirectorTaskPriority;
  status: DirectorTaskStatus;
  category: DirectorTaskCategory;
  isCustom: boolean;
  completedAt?: string;
  postponedUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorAssistantSettings {
  assistantName: string;
  dayStartTime: string; // "06:45"
  dayEndTime: string;   // "17:15"
  remindBeforeTaskMinutes: number; // ex: 5
  intermediateReminderDelayMinutes: number; // ex: 10
  overdueAlertDelayMinutes: number; // ex: 20
  notificationsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  activeDaysOfWeek: number[]; // 1=Lundi ... 6=Samedi
}

export interface TeacherAbsence {
  id: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subjectName: string;
  date: string;
  timeSlot: string;
  reason?: string;
  status: 'non_traitee' | 'remplacement_organise' | 'cours_suspendu';
}

export interface DirectorAssistantLogEntry {
  id: string;
  schoolId: string;
  userId: string;
  taskId?: string;
  action: 'task_created' | 'reminder_sent' | 'task_started' | 'task_completed' | 'task_postponed' | 'task_skipped' | 'note_added' | 'recommendation_generated' | 'daily_summary_generated';
  detail: string;
  timestamp: string;
}

export interface DirectorDailySummary {
  date: string;
  tasksPlanned: number;
  tasksCompleted: number;
  tasksPostponed: number;
  tasksNotDone: number;
  executionRate: number; // %
  teachersAbsent: number;
  coursesNotCovered: number;
  studentsNeedingAttention: number;
  incidentsCount: number;
  tomorrowPriorities: string[];
}

// ==========================================
// EDUCATOR ASSISTANT (ÉDUCATEUR+ — VIE SCOLAIRE)
// ==========================================

export type EducatorTaskStatus =
  | 'pending'    // à venir, hors créneau
  | 'active'     // dans son créneau horaire actuel
  | 'completed'  // marquée terminée par l'utilisateur
  | 'postponed'  // reportée à une nouvelle heure
  | 'skipped'    // ignorée volontairement
  | 'overdue';   // créneau dépassé sans action

export type EducatorTaskPriority = 'faible' | 'moyenne' | 'haute' | 'critique';

export type EducatorTaskCategory =
  | 'organisation'
  | 'accueil'
  | 'surveillance'
  | 'assiduite'
  | 'discipline'
  | 'eleves'
  | 'parents'
  | 'administration'
  | 'reporting';

export interface EducatorTaskChecklistItem {
  id: string;
  label: string;
  checked?: boolean;
}

export interface EducatorDailyTask {
  id: string;
  schoolId: string;
  educatorId: string;       // Éducateur assigné (ou 'all' pour tâches communes)
  taskDate: string;         // "YYYY-MM-DD"
  title: string;
  description: string;
  instructions: string[];   // Instructions d'action détaillées
  checklist: EducatorTaskChecklistItem[];
  startTime: string;        // "06:30"
  endTime: string;          // "06:45"
  originalStartTime: string;
  priority: EducatorTaskPriority;
  status: EducatorTaskStatus;
  category: EducatorTaskCategory;
  isCustom?: boolean;
  completedAt?: string;
  postponedUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducatorAssistantSettings {
  assistantName: string;
  dayStartTime: string; // "06:30"
  dayEndTime: string;   // "17:15"
  remindBeforeTaskMinutes: number; // ex: 5
  intermediateReminderDelayMinutes: number; // ex: 10
  overdueAlertDelayMinutes: number; // ex: 15
  notificationsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  activeDaysOfWeek: number[]; // 1=Lundi ... 6=Samedi
  assignedClassIds?: string[]; // Classes dont l'éducateur a la charge
}

export interface EducatorAssistantLogEntry {
  id: string;
  schoolId: string;
  educatorId: string;
  taskId?: string;
  action:
    | 'task_created'
    | 'task_started'
    | 'task_completed'
    | 'task_postponed'
    | 'task_skipped'
    | 'note_added'
    | 'alert_resolved'
    | 'sanction_recorded'
    | 'parent_contacted'
    | 'incident_handled'
    | 'daily_summary_generated';
  detail: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface EducatorContextAlert {
  id: string;
  type: 'class_absence' | 'repeated_absence' | 'repeated_lateness' | 'incident' | 'sanction_pending' | 'parent_contact';
  severity: 'critique' | 'haute' | 'moyenne';
  title: string;
  description: string;
  targetEntityName: string;
  targetClass?: string;
  targetStudentId?: string;
  count?: number;
  recommendation: string;
  actionLabel?: string;
  status: 'active' | 'in_progress' | 'resolved';
  detectedAt: string;
}

export interface EducatorSanction {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  className: string;
  type: 'avertissement' | 'retenue' | 'exclusion_temporaire' | 'convocation' | 'engagement' | 'mesure_educative';
  reason: string;
  date: string;
  durationOrSchedule?: string; // ex: "2 heures le Samedi 08h-10h", "3 jours"
  status: 'en_attente' | 'validee' | 'executee' | 'annulee';
  decidedBy: string;
  notes?: string;
}

export interface EducatorStudentAtRisk {
  student: Student;
  urgencyLevel: 'critique' | 'haute' | 'moderee'; // 🔴, 🟠, 🟡
  primaryReason: string;
  recentAbsencesCount: number;
  recentLatenessCount: number;
  sanctionsCount: number;
  recommendation: string;
  parentContactNeeded: boolean;
}

export interface ParentContactRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  guardianName: string;
  guardianPhone: string;
  reason: string;
  channel: 'appel' | 'sms' | 'whatsapp' | 'entretien';
  status: 'en_attente' | 'effectue' | 'non_abouti';
  contactedAt?: string;
  notes?: string;
  educatorId: string;
}

export interface EducatorDailySummary {
  date: string;
  educatorId: string;
  // Activité
  tasksPlanned: number;
  tasksCompleted: number;
  tasksPostponed: number;
  tasksNotDone: number;
  executionRate: number; // %
  // Assiduité
  studentsAbsent: number;
  unjustifiedAbsences: number;
  latenesses: number;
  repeatedLatenesses: number;
  // Discipline
  incidentsCount: number;
  incidentsHandled: number;
  incidentsToFollow: number;
  // Suivi
  studentsReceived: number;
  parentsContacted: number;
  pendingSanctions: number;
  // Priorités IA
  tomorrowPriorities: string[];
}

export interface EducatorWeeklyReport {
  weekRange: string;
  educatorId: string;
  executionRate: number;
  totalTasksCompleted: number;
  totalAbsences: number;
  totalLatenesses: number;
  frequentlyAbsentStudents: { studentName: string; className: string; count: number }[];
  frequentlyLateStudents: { studentName: string; className: string; count: number }[];
  incidentsCount: number;
  sanctionsCount: number;
  parentsContactedCount: number;
  unresolvedFilesCount: number;
  trendAnalysis: string;
  aiRecommendations: string[];
}

// ==========================================
// AUTHENTICATION & SCHOOL REGISTRATION
// ==========================================

export interface AuthUser extends User {
  password?: string;
}

export interface SchoolRegistrationData {
  school: {
    name: string;
    type: 'college' | 'lycee' | 'complexe_scolaire';
    code: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    currency: string;
    directorName: string;
  };
  director: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
  };
  academicDirector: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cycle: 'college' | 'lycee' | 'complexe';
    password?: string;
  };
  educator: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    assignedClassIds: string[];
    password?: string;
  };
}

