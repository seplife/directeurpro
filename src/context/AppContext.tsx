import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  School,
  AcademicYear,
  ClassLevel,
  Subject,
  Student,
  Payment,
  SchoolBudget,
  AIAlert,
  AIDecision,
  SchoolHealthScore,
  DailyIntelligenceBrief,
  WhatIfScenario,
  User,
  UserRole,
  AIAuditLog,
  DirectorTask,
  DirectorAssistantSettings,
  TeacherAbsence,
  DirectorAssistantLogEntry,
  DirectorDailySummary,
  EducatorDailyTask,
  EducatorAssistantSettings,
  EducatorAssistantLogEntry,
  EducatorSanction,
  EducatorDailySummary,
  EducatorWeeklyReport,
  ParentContactRecord,
  DisciplinaryEvent,
  AuthUser,
  SchoolRegistrationData
} from '../types';
import {
  INITIAL_SCHOOL,
  INITIAL_ACADEMIC_YEAR,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_DAILY_BRIEF,
  INITIAL_ALERTS,
  INITIAL_DECISIONS,
  INITIAL_BUDGET,
  INITIAL_PAYMENTS,
  INITIAL_WHAT_IF_SCENARIOS,
  INITIAL_ASSISTANT_SETTINGS,
  INITIAL_TEACHER_ABSENCES,
  INITIAL_EDUCATOR_SETTINGS,
  INITIAL_EDUCATOR_SANCTIONS,
  INITIAL_DISCIPLINARY_EVENTS,
  INITIAL_PARENT_CONTACTS
} from '../services/db/mockData';
import { SchoolHealthService } from '../services/ai/schoolHealthService';
import { StudentRiskAgent } from '../services/ai/agents/studentRiskAgent';
import { ChronogramService } from '../services/directorAssistant/chronogramService';
import { SummaryService } from '../services/directorAssistant/summaryService';
import { EducatorChronogramService } from '../services/educatorAssistant/educatorChronogramService';
import { EducatorDailySummaryService } from '../services/educatorAssistant/educatorDailySummaryService';
import { EducatorWeeklyReportService } from '../services/educatorAssistant/educatorWeeklyReportService';
import { AutomationEngine } from '../services/automation/automationEngine';

interface AppContextType {
  school: School;
  academicYear: AcademicYear;
  classes: ClassLevel[];
  subjects: Subject[];
  students: Student[];
  payments: Payment[];
  budget: SchoolBudget;
  alerts: AIAlert[];
  decisions: AIDecision[];
  schoolHealth: SchoolHealthScore;
  dailyBrief: DailyIntelligenceBrief;
  whatIfScenarios: WhatIfScenario[];
  currentUser: User;
  allUsers: User[];
  auditLogs: AIAuditLog[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  switchUserRole: (role: UserRole) => void;
  updateStudentGrade: (studentId: string, newAverage: number) => void;
  resolveAlert: (alertId: string) => void;
  acceptDecision: (decisionId: string, chosenOptionId: string, notes?: string) => void;
  rejectDecision: (decisionId: string, notes?: string) => void;
  recordPayment: (payment: Omit<Payment, 'id' | 'receiptNumber' | 'paymentDate' | 'status'>) => void;
  addWhatIfScenario: (scenario: WhatIfScenario) => void;
  logAIOperation: (agentName: string, queryOrAction: string, dataEntities: string[], confidence: number) => void;

  // --- Real-time Automation & Simulation Engine ---
  simulatedTime: string | null;
  setSimulatedTime: (time: string | null) => void;
  triggerSimulatedPayment: (studentId?: string, amount?: number) => void;
  triggerSimulatedStudentAbsence: (studentId?: string) => void;
  triggerSimulatedTeacherAbsence: () => void;
  triggerFullSchoolDayAutomation: () => void;
  resetToDefaultData: () => void;

  // --- Director Assistant (Agent de Pilotage Pédagogique) ---
  directorTasks: DirectorTask[];
  assistantSettings: DirectorAssistantSettings;
  teacherAbsences: TeacherAbsence[];
  assistantLogs: DirectorAssistantLogEntry[];
  canAccessDirectorAssistant: boolean;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string, note?: string) => void;
  postponeTask: (taskId: string, newStartTime: string, newEndTime: string) => void;
  skipTask: (taskId: string) => void;
  addTaskNote: (taskId: string, note: string) => void;
  addCustomTask: (task: Pick<DirectorTask, 'title' | 'description' | 'startTime' | 'endTime' | 'priority' | 'category'>) => void;
  updateAssistantSettings: (settings: Partial<DirectorAssistantSettings>) => void;
  getDailySummary: (date?: Date) => DirectorDailySummary;

  // --- Educator Assistant (Éducateur+ — Vie Scolaire) ---
  educatorTasks: EducatorDailyTask[];
  educatorSettings: EducatorAssistantSettings;
  educatorLogs: EducatorAssistantLogEntry[];
  educatorSanctions: EducatorSanction[];
  disciplinaryEvents: DisciplinaryEvent[];
  parentContacts: ParentContactRecord[];
  activeEducatorId: string;
  setActiveEducatorId: (id: string) => void;
  canAccessEducatorAssistant: boolean;
  isEducatorSupervisor: boolean;
  startEducatorTask: (taskId: string) => void;
  completeEducatorTask: (taskId: string, note?: string) => void;
  postponeEducatorTask: (taskId: string, newStartTime: string, newEndTime: string) => void;
  skipEducatorTask: (taskId: string) => void;
  addEducatorTaskNote: (taskId: string, note: string) => void;
  toggleEducatorTaskChecklistItem: (taskId: string, itemId: string) => void;
  addCustomEducatorTask: (task: Pick<EducatorDailyTask, 'title' | 'description' | 'startTime' | 'endTime' | 'priority' | 'category'>) => void;
  updateEducatorSettings: (settings: Partial<EducatorAssistantSettings>) => void;
  updateEducatorSanctionStatus: (sanctionId: string, status: EducatorSanction['status'], notes?: string) => void;
  addEducatorSanction: (sanction: Omit<EducatorSanction, 'id'>) => void;
  recordParentContact: (contact: Omit<ParentContactRecord, 'id'>) => void;
  handleDisciplinaryEvent: (eventId: string, status: DisciplinaryEvent['status'], sanctionNotes?: string) => void;
  getEducatorDailySummary: (educatorId?: string, date?: Date) => EducatorDailySummary;
  getEducatorWeeklyReport: (educatorId?: string) => EducatorWeeklyReport;
  // --- Authentication & School Onboarding ---
  isAuthenticated: boolean;
  registeredSchools: School[];
  login: (email: string, password?: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
  registerSchoolWithStaff: (data: SchoolRegistrationData) => { success: boolean; message: string; user?: User };
}

const ASSISTANT_ALLOWED_ROLES: UserRole[] = ['academic_director', 'director', 'super_admin'];
const EDUCATOR_ALLOWED_ROLES: UserRole[] = ['counselor', 'academic_director', 'director', 'super_admin'];
const EDUCATOR_SUPERVISOR_ROLES: UserRole[] = ['academic_director', 'director', 'super_admin'];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [school, setSchool] = useState<School>(INITIAL_SCHOOL);
  const [academicYear, setAcademicYear] = useState<AcademicYear>(INITIAL_ACADEMIC_YEAR);
  const [classes, setClasses] = useState<ClassLevel[]>(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [budget, setBudget] = useState<SchoolBudget>(INITIAL_BUDGET);
  const [alerts, setAlerts] = useState<AIAlert[]>(INITIAL_ALERTS);
  const [decisions, setDecisions] = useState<AIDecision[]>(INITIAL_DECISIONS);
  const [schoolHealth, setSchoolHealth] = useState<SchoolHealthScore>(() =>
    SchoolHealthService.calculateHealthScore(INITIAL_STUDENTS, INITIAL_ALERTS, INITIAL_BUDGET)
  );
  const [dailyBrief, setDailyBrief] = useState<DailyIntelligenceBrief>(INITIAL_DAILY_BRIEF);
  const [whatIfScenarios, setWhatIfScenarios] = useState<WhatIfScenario[]>(INITIAL_WHAT_IF_SCENARIOS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Director by default
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [auditLogs, setAuditLogs] = useState<AIAuditLog[]>([
    {
      id: 'log_01',
      schoolId: 'school_abidjan_01',
      userId: 'u_dir',
      userName: 'M. Kouamé N’Guessan',
      agentName: 'StudentRiskAgent',
      queryOrAction: 'Évaluation automatique des facteurs de décrochage (Tle D / 3ème)',
      dataEntitiesAccessed: ['Students', 'Grades', 'Attendance'],
      confidenceScore: 94,
      timestamp: '2026-08-20T06:30:00Z'
    }
  ]);

  // --- Director Assistant state ---
  const [assistantSettings, setAssistantSettings] = useState<DirectorAssistantSettings>(INITIAL_ASSISTANT_SETTINGS);
  const [teacherAbsences] = useState<TeacherAbsence[]>(INITIAL_TEACHER_ABSENCES);
  const [assistantLogs, setAssistantLogs] = useState<DirectorAssistantLogEntry[]>([]);
  const academicDirectorUser = INITIAL_USERS.find(u => u.role === 'academic_director') || INITIAL_USERS[0];
  const [directorTasks, setDirectorTasks] = useState<DirectorTask[]>(() =>
    ChronogramService.generateTasksForDate(new Date(), academicDirectorUser.id, INITIAL_SCHOOL.id, INITIAL_ASSISTANT_SETTINGS)
  );

  // Recalculate School Health Score when students, alerts or budget change
  useEffect(() => {
    const updatedHealth = SchoolHealthService.calculateHealthScore(students, alerts, budget);
    setSchoolHealth(updatedHealth);
  }, [students, alerts, budget]);

  const switchUserRole = (role: UserRole) => {
    const found = INITIAL_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `u_${role}`,
        email: `${role}@directeurpro.ci`,
        firstName: role.charAt(0).toUpperCase() + role.slice(1),
        lastName: 'Utilisateur',
        role,
        schoolId: school.id
      });
    }
  };

  // --- Virtual Clock / Time Simulation state ---
  const [simulatedTime, setSimulatedTime] = useState<string | null>(null);

  // Live dynamic recalculation of ranks, risk scores and class metrics
  const updateStudentGrade = (studentId: string, newAverage: number) => {
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          const trend = newAverage > s.overallAverage ? 'up' : newAverage < s.overallAverage ? 'down' : 'stable';
          const evaluation = StudentRiskAgent.evaluateStudent({
            ...s,
            overallAverage: newAverage,
            averageTrend: trend
          });

          return {
            ...s,
            previousAverage: s.overallAverage,
            overallAverage: newAverage,
            averageTrend: trend,
            riskScore: evaluation.riskScore,
            riskCategory: evaluation.riskCategory,
            riskFactors: evaluation.riskFactors
          };
        }
        return s;
      });

      const recomputed = AutomationEngine.recalculateStudentsRankAndMetrics(updated);
      setClasses(currClasses => AutomationEngine.recalculateClassMetrics(currClasses, recomputed));
      return recomputed;
    });

    logAIOperation('PedagogyEngine', `Modification de moyenne pour élève ${studentId} : ${newAverage}/20 (Reclassement dynamique)`, ['Students', 'Classes'], 95);
  };

  // Recalculate School Health Score dynamically whenever core entities change
  useEffect(() => {
    const liveScore = AutomationEngine.computeLiveHealthScore(students, budget, alerts, disciplinaryEvents);
    setSchoolHealth(liveScore);
  }, [students, budget, alerts, disciplinaryEvents]);

  const resolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  };

  const acceptDecision = (decisionId: string, chosenOptionId: string, notes?: string) => {
    setDecisions(prev =>
      prev.map(d => {
        if (d.id === decisionId) {
          return {
            ...d,
            status: 'accepted',
            chosenOptionId,
            directorNotes: notes || 'Décision validée par le Directeur.',
            decidedAt: new Date().toISOString()
          };
        }
        return d;
      })
    );

    // If decision had a linked alert, mark it as in_progress
    const dec = decisions.find(d => d.id === decisionId);
    if (dec && dec.alertId) {
      setAlerts(prev =>
        prev.map(a => (a.id === dec.alertId ? { ...a, status: 'in_progress' } : a))
      );
    }

    logAIOperation(
      'DirectorCopilot',
      `Validation de la décision : ${dec?.problemTitle || decisionId}`,
      ['AIDecisions', 'AIAlerts'],
      dec?.confidenceScore ?? 90
    );
  };

  const rejectDecision = (decisionId: string, notes?: string) => {
    setDecisions(prev =>
      prev.map(d => (d.id === decisionId ? { ...d, status: 'rejected', directorNotes: notes, decidedAt: new Date().toISOString() } : d))
    );
  };

  const recordPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'paymentDate' | 'status'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentDate: new Date().toISOString(),
      status: 'valide'
    };

    setPayments(prev => {
      const updated = [newPayment, ...prev];
      setBudget(currBudget => AutomationEngine.recalculateBudget(currBudget, updated));
      return updated;
    });

    logAIOperation('FinanceEngine', `Paiement enregistré : ${newPayment.amount.toLocaleString()} FCFA pour ${newPayment.studentName} (${newPayment.paymentMethod})`, ['Payments', 'Budget'], 100);
  };

  // --- Automation Simulation Triggers ---
  const triggerSimulatedPayment = (studentId?: string, amount?: number) => {
    const targetStudent = studentId
      ? students.find(s => s.id === studentId) || students[0]
      : students[Math.floor(Math.random() * students.length)];

    if (!targetStudent) return;

    const simPayment = AutomationEngine.createSimulatedMobileMoneyPayment(targetStudent, classes);
    if (amount) {
      simPayment.amount = amount;
    }

    setPayments(prev => {
      const updated = [simPayment, ...prev];
      setBudget(currBudget => AutomationEngine.recalculateBudget(currBudget, updated));
      return updated;
    });

    logAIOperation('MobileMoneyGateway', `Encaissement instantané automatisé : ${simPayment.amount.toLocaleString()} FCFA de ${simPayment.studentName}`, ['Payments', 'Budget'], 100);
  };

  const triggerSimulatedStudentAbsence = (studentId?: string) => {
    const targetStudent = studentId
      ? students.find(s => s.id === studentId) || students[0]
      : students[Math.floor(Math.random() * students.length)];

    if (!targetStudent) return;

    setStudents(prev =>
      prev.map(s => {
        if (s.id === targetStudent.id) {
          const newAbs = s.unjustifiedAbsencesCount + 1;
          const newAtt = Math.max(50, s.attendanceRate - 3.5);
          return {
            ...s,
            unjustifiedAbsencesCount: newAbs,
            attendanceRate: Math.round(newAtt * 10) / 10,
            riskScore: Math.min(100, s.riskScore + 10),
            riskCategory: (s.riskScore + 10 >= 70 ? 'critique' : s.riskScore + 10 >= 45 ? 'eleve' : 'modere') as Student['riskCategory'],
            riskFactors: [...s.riskFactors, `Absence signalée à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`]
          };
        }
        return s;
      })
    );

    // Create an immediate context alert for Educator
    const newAlert: AIAlert = {
      id: `alt_abs_${Date.now()}`,
      schoolId: school.id,
      type: 'retard_eleve',
      severity: 'moyenne',
      status: 'active',
      title: `Absence non justifiée : ${targetStudent.firstName} ${targetStudent.lastName} (${targetStudent.className})`,
      description: `L'élève est signalé absent ce jour. Total des absences injustifiées : ${targetStudent.unjustifiedAbsencesCount + 1}.`,
      impactScore: 65,
      recommendedAction: 'Contacter le responsable légal via SMS / Appel et délivrer un billet de rentrée.',
      sourceModule: 'attendance',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAlerts(prev => [newAlert, ...prev]);
    logAIOperation('AttendanceScanner', `Absence enregistrée pour ${targetStudent.firstName} ${targetStudent.lastName} (${targetStudent.className})`, ['Students', 'Alerts'], 95);
  };

  const triggerSimulatedTeacherAbsence = () => {
    const { absence, alert, decision } = AutomationEngine.createSimulatedTeacherAbsence(school.id, subjects);
    setTeacherAbsences(prev => [absence, ...prev]);
    setAlerts(prev => [alert, ...prev]);
    setDecisions(prev => [decision, ...prev]);

    logAIOperation('TimetableEngine', `Alerte absence enseignant générée : ${absence.teacherName} (${absence.subjectName}) — Substitution proposée`, ['TeacherAbsence', 'AIDecisions'], 90);
  };

  const triggerFullSchoolDayAutomation = () => {
    // 1. Trigger 2 mobile money payments
    triggerSimulatedPayment();
    triggerSimulatedPayment();
    // 2. Trigger 1 student absence
    triggerSimulatedStudentAbsence();
    // 3. Trigger 1 teacher absence & substitution
    triggerSimulatedTeacherAbsence();

    logAIOperation('AutomationOrchestrator', 'Exécution du cycle d’automatisation complet (Paiements, Assiduité, Remplacements et Indicateurs)', ['AllModules'], 100);
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setClasses(INITIAL_CLASSES);
    setPayments(INITIAL_PAYMENTS);
    setBudget(INITIAL_BUDGET);
    setAlerts(INITIAL_ALERTS);
    setDecisions(INITIAL_DECISIONS);
    setTeacherAbsences(INITIAL_TEACHER_ABSENCES);
    setDisciplinaryEvents(INITIAL_DISCIPLINARY_EVENTS);
    setEducatorSanctions(INITIAL_EDUCATOR_SANCTIONS);
    setParentContacts(INITIAL_PARENT_CONTACTS);
    setSimulatedTime(null);
    localStorage.removeItem('directeurpro_session');
    localStorage.removeItem('directeurpro_current_user');

    logAIOperation('SystemAdmin', 'Réinitialisation des données de démonstration', ['Database'], 100);
  };

  const addWhatIfScenario = (scenario: WhatIfScenario) => {
    setWhatIfScenarios(prev => [scenario, ...prev]);
  };

  const logAIOperation = (agentName: string, queryOrAction: string, dataEntities: string[], confidence: number) => {
    const newLog: AIAuditLog = {
      id: `log_${Date.now()}`,
      schoolId: school.id,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      agentName,
      queryOrAction,
      dataEntitiesAccessed: dataEntities,
      confidenceScore: confidence,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- Director Assistant actions ---

  const canAccessDirectorAssistant = ASSISTANT_ALLOWED_ROLES.includes(currentUser.role);

  const logAssistant = (action: DirectorAssistantLogEntry['action'], detail: string, taskId?: string) => {
    const entry: DirectorAssistantLogEntry = {
      id: `dalog_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      schoolId: school.id,
      userId: currentUser.id,
      taskId,
      action,
      detail,
      timestamp: new Date().toISOString()
    };
    setAssistantLogs(prev => [entry, ...prev]);
  };

  const startTask = (taskId: string) => {
    setDirectorTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'active', updatedAt: new Date().toISOString() } : t))
    );
    const task = directorTasks.find(t => t.id === taskId);
    logAssistant('task_started', `Tâche démarrée : ${task?.title || taskId}`, taskId);
  };

  const completeTask = (taskId: string, note?: string) => {
    setDirectorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date().toISOString(),
              notes: note ? `${t.notes ? t.notes + ' | ' : ''}${note}` : t.notes,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
    const task = directorTasks.find(t => t.id === taskId);
    logAssistant('task_completed', `Tâche terminée : ${task?.title || taskId}`, taskId);
  };

  const postponeTask = (taskId: string, newStartTime: string, newEndTime: string) => {
    setDirectorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'postponed',
              startTime: newStartTime,
              endTime: newEndTime,
              postponedUntil: newStartTime,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
    const task = directorTasks.find(t => t.id === taskId);
    logAssistant('task_postponed', `Tâche « ${task?.title || taskId} » reportée à ${newStartTime}.`, taskId);
  };

  const skipTask = (taskId: string) => {
    setDirectorTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'skipped', updatedAt: new Date().toISOString() } : t))
    );
    const task = directorTasks.find(t => t.id === taskId);
    logAssistant('task_skipped', `Tâche ignorée : ${task?.title || taskId}`, taskId);
  };

  const addTaskNote = (taskId: string, note: string) => {
    setDirectorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, notes: t.notes ? `${t.notes} | ${note}` : note, updatedAt: new Date().toISOString() }
          : t
      )
    );
    logAssistant('note_added', `Note ajoutée : ${note}`, taskId);
  };

  const addCustomTask = (task: Pick<DirectorTask, 'title' | 'description' | 'startTime' | 'endTime' | 'priority' | 'category'>) => {
    const dateKey = ChronogramService.toDateKey(new Date());
    const now = new Date().toISOString();
    const newTask: DirectorTask = {
      id: `dtask_custom_${Date.now()}`,
      schoolId: school.id,
      userId: academicDirectorUser.id,
      taskDate: dateKey,
      title: task.title,
      description: task.description,
      checklist: [],
      startTime: task.startTime,
      endTime: task.endTime,
      originalStartTime: task.startTime,
      priority: task.priority,
      status: 'pending',
      category: task.category,
      isCustom: true,
      createdAt: now,
      updatedAt: now
    };
    setDirectorTasks(prev => [...prev, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    logAssistant('task_created', `Tâche personnalisée créée : ${task.title}`);
  };

  const updateAssistantSettings = (settings: Partial<DirectorAssistantSettings>) => {
    setAssistantSettings(prev => ({ ...prev, ...settings }));
  };

  const getDailySummary = (date: Date = new Date()) => {
    return SummaryService.generateDailySummary(directorTasks, teacherAbsences, students, date);
  };

  // --- Educator Assistant (Éducateur+ — Vie Scolaire) state ---
  const [educatorSettings, setEducatorSettings] = useState<EducatorAssistantSettings>(INITIAL_EDUCATOR_SETTINGS);
  const [educatorLogs, setEducatorLogs] = useState<EducatorAssistantLogEntry[]>([]);
  const [educatorSanctions, setEducatorSanctions] = useState<EducatorSanction[]>(INITIAL_EDUCATOR_SANCTIONS);
  const [disciplinaryEvents, setDisciplinaryEvents] = useState<DisciplinaryEvent[]>(INITIAL_DISCIPLINARY_EVENTS);
  const [parentContacts, setParentContacts] = useState<ParentContactRecord[]>(INITIAL_PARENT_CONTACTS);
  const [activeEducatorId, setActiveEducatorId] = useState<string>('u_educ');

  const [educatorTasks, setEducatorTasks] = useState<EducatorDailyTask[]>(() => {
    const today = new Date();
    const tasks1 = EducatorChronogramService.generateTasksForDate(today, 'u_educ', INITIAL_SCHOOL.id, INITIAL_EDUCATOR_SETTINGS);
    const tasks2 = EducatorChronogramService.generateTasksForDate(today, 'u_educ2', INITIAL_SCHOOL.id, {
      ...INITIAL_EDUCATOR_SETTINGS,
      assignedClassIds: ['c_2a', 'c_2c', 'c_1d', 'c_td', 'c_tc', 'c_ta2']
    });
    return [...tasks1, ...tasks2];
  });

  const canAccessEducatorAssistant = EDUCATOR_ALLOWED_ROLES.includes(currentUser.role);
  const isEducatorSupervisor = EDUCATOR_SUPERVISOR_ROLES.includes(currentUser.role);

  const logEducatorAction = (
    action: EducatorAssistantLogEntry['action'],
    detail: string,
    taskId?: string,
    metadata?: Record<string, any>
  ) => {
    const entry: EducatorAssistantLogEntry = {
      id: `elog_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      schoolId: school.id,
      educatorId: currentUser.id,
      taskId,
      action,
      detail,
      timestamp: new Date().toISOString(),
      metadata
    };
    setEducatorLogs(prev => [entry, ...prev]);
  };

  const startEducatorTask = (taskId: string) => {
    setEducatorTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'active', updatedAt: new Date().toISOString() } : t))
    );
    const task = educatorTasks.find(t => t.id === taskId);
    logEducatorAction('task_started', `Tâche démarrée : ${task?.title || taskId}`, taskId);
  };

  const completeEducatorTask = (taskId: string, note?: string) => {
    setEducatorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date().toISOString(),
              notes: note ? `${t.notes ? t.notes + ' | ' : ''}${note}` : t.notes,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
    const task = educatorTasks.find(t => t.id === taskId);
    logEducatorAction('task_completed', `Tâche terminée : ${task?.title || taskId}`, taskId, { note });
  };

  const postponeEducatorTask = (taskId: string, newStartTime: string, newEndTime: string) => {
    setEducatorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'postponed',
              startTime: newStartTime,
              endTime: newEndTime,
              postponedUntil: newStartTime,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
    const task = educatorTasks.find(t => t.id === taskId);
    logEducatorAction('task_postponed', `Tâche « ${task?.title || taskId} » reportée à ${newStartTime}.`, taskId, {
      newStartTime,
      newEndTime
    });
  };

  const skipEducatorTask = (taskId: string) => {
    setEducatorTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'skipped', updatedAt: new Date().toISOString() } : t))
    );
    const task = educatorTasks.find(t => t.id === taskId);
    logEducatorAction('task_skipped', `Tâche ignorée : ${task?.title || taskId}`, taskId);
  };

  const addEducatorTaskNote = (taskId: string, note: string) => {
    setEducatorTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, notes: t.notes ? `${t.notes} | ${note}` : note, updatedAt: new Date().toISOString() }
          : t
      )
    );
    logEducatorAction('note_added', `Note ajoutée : ${note}`, taskId);
  };

  const toggleEducatorTaskChecklistItem = (taskId: string, itemId: string) => {
    setEducatorTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          checklist: t.checklist.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const addCustomEducatorTask = (
    task: Pick<EducatorDailyTask, 'title' | 'description' | 'startTime' | 'endTime' | 'priority' | 'category'>
  ) => {
    const dateKey = EducatorChronogramService.toDateKey(new Date());
    const now = new Date().toISOString();
    const effectiveEducatorId = currentUser.role === 'counselor' ? currentUser.id : activeEducatorId || 'u_educ';

    const newTask: EducatorDailyTask = {
      id: `etask_custom_${Date.now()}`,
      schoolId: school.id,
      educatorId: effectiveEducatorId,
      taskDate: dateKey,
      title: task.title,
      description: task.description,
      instructions: [task.description],
      checklist: [],
      startTime: task.startTime,
      endTime: task.endTime,
      originalStartTime: task.startTime,
      priority: task.priority,
      status: 'pending',
      category: task.category,
      isCustom: true,
      createdAt: now,
      updatedAt: now
    };

    setEducatorTasks(prev => [...prev, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    logEducatorAction('task_created', `Tâche personnalisée créée : ${task.title}`);
  };

  const updateEducatorSettings = (settings: Partial<EducatorAssistantSettings>) => {
    setEducatorSettings(prev => ({ ...prev, ...settings }));
  };

  const updateEducatorSanctionStatus = (sanctionId: string, status: EducatorSanction['status'], notes?: string) => {
    setEducatorSanctions(prev =>
      prev.map(s => (s.id === sanctionId ? { ...s, status, notes: notes || s.notes } : s))
    );
    logEducatorAction('sanction_recorded', `Sanction ${sanctionId} mise à jour : statut -> ${status}`);
  };

  const addEducatorSanction = (sanctionData: Omit<EducatorSanction, 'id'>) => {
    const newSanction: EducatorSanction = {
      ...sanctionData,
      id: `sanc_${Date.now()}`
    };
    setEducatorSanctions(prev => [newSanction, ...prev]);
    logEducatorAction('sanction_recorded', `Nouvelle sanction enregistrée pour ${sanctionData.studentName} : ${sanctionData.type}`);
  };

  const recordParentContact = (contactData: Omit<ParentContactRecord, 'id'>) => {
    const newRecord: ParentContactRecord = {
      ...contactData,
      id: `pcon_${Date.now()}`,
      contactedAt: new Date().toISOString()
    };
    setParentContacts(prev => [newRecord, ...prev]);
    logEducatorAction('parent_contacted', `Communication enregistrée avec le responsable de ${contactData.studentName} (${contactData.channel})`);
  };

  const handleDisciplinaryEvent = (eventId: string, status: DisciplinaryEvent['status'], sanctionNotes?: string) => {
    setDisciplinaryEvents(prev =>
      prev.map(evt =>
        evt.id === eventId
          ? {
              ...evt,
              status,
              sanction: sanctionNotes ? sanctionNotes : evt.sanction
            }
          : evt
      )
    );
    logEducatorAction('incident_handled', `Incident disciplinaire ${eventId} traité (statut: ${status})`);
  };

  const getEducatorDailySummary = (educatorId?: string, date: Date = new Date()) => {
    const targetId = educatorId || (currentUser.role === 'counselor' ? currentUser.id : activeEducatorId || 'u_educ');
    return EducatorDailySummaryService.generateDailySummary(
      educatorTasks,
      students,
      disciplinaryEvents,
      educatorSanctions,
      parentContacts,
      targetId,
      date
    );
  };

  const getEducatorWeeklyReport = (educatorId?: string) => {
    const targetId = educatorId || (currentUser.role === 'counselor' ? currentUser.id : activeEducatorId || 'u_educ');
    const summary = getEducatorDailySummary(targetId);
    return EducatorWeeklyReportService.generateWeeklyReport(
      [summary],
      educatorTasks,
      students,
      disciplinaryEvents,
      educatorSanctions,
      parentContacts,
      targetId
    );
  };

  // --- Authentication & School Registration state ---
  const [registeredSchools, setRegisteredSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('directeurpro_schools');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [INITIAL_SCHOOL];
  });

  const [registeredUsers, setRegisteredUsers] = useState<(User & { password?: string })[]>(() => {
    const saved = localStorage.getItem('directeurpro_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS.map(u => ({ ...u, password: 'password123' }));
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = localStorage.getItem('directeurpro_session');
    return session === 'active';
  });

  // Save schools and users to localStorage on change
  useEffect(() => {
    localStorage.setItem('directeurpro_schools', JSON.stringify(registeredSchools));
  }, [registeredSchools]);

  useEffect(() => {
    localStorage.setItem('directeurpro_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, message: `Aucun compte associé à l'adresse ${email}.` };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Mot de passe incorrect. Veuillez vérifier vos identifiants.' };
    }

    const userSchool = registeredSchools.find(s => s.id === foundUser.schoolId) || INITIAL_SCHOOL;

    setCurrentUser(foundUser);
    setSchool(userSchool);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    localStorage.setItem('directeurpro_session', 'active');
    localStorage.setItem('directeurpro_current_user', JSON.stringify(foundUser));

    logAIOperation('AuthEngine', `Connexion réussie : ${foundUser.firstName} ${foundUser.lastName} (${foundUser.role})`, ['Users', 'Schools'], 100);

    return {
      success: true,
      message: `Bienvenue, ${foundUser.firstName} ${foundUser.lastName} !`,
      user: foundUser
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('directeurpro_session');
    localStorage.removeItem('directeurpro_current_user');
  };

  const registerSchoolWithStaff = (data: SchoolRegistrationData) => {
    const schoolId = `school_${Date.now()}`;
    const dateNow = new Date().toISOString();

    const newSchool: School = {
      id: schoolId,
      name: data.school.name,
      type: data.school.type,
      code: data.school.code || `SCH-${Math.floor(1000 + Math.random() * 9000)}`,
      address: data.school.address || 'Abidjan',
      city: data.school.city || 'Abidjan',
      country: data.school.country || "Côte d'Ivoire",
      currency: data.school.currency || 'FCFA',
      logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
      directorName: `${data.director.firstName} ${data.director.lastName}`,
      phone: data.school.phone || data.director.phone,
      email: data.school.email || data.director.email,
      currentAcademicYearId: 'ay_2025_2026',
      settings: {
        systemType: 'ivoirien',
        periodType: 'trimestre',
        enableMobileMoney: true,
        aiDecisionEngineActive: true
      }
    };

    // 1. Director User
    const directorUser: User & { password?: string } = {
      id: `u_dir_${Date.now()}`,
      email: data.director.email.trim().toLowerCase(),
      firstName: data.director.firstName.trim(),
      lastName: data.director.lastName.trim(),
      role: 'director',
      schoolId: schoolId,
      phone: data.director.phone,
      password: data.director.password || 'password123'
    };

    // 2. Academic Director User (DE)
    const academicDirectorUserCreated: User & { password?: string } = {
      id: `u_cde_${Date.now()}`,
      email: data.academicDirector.email.trim().toLowerCase(),
      firstName: data.academicDirector.firstName.trim(),
      lastName: data.academicDirector.lastName.trim(),
      role: 'academic_director',
      schoolId: schoolId,
      phone: data.academicDirector.phone,
      password: data.academicDirector.password || 'password123'
    };

    // 3. Educator User
    const educatorUser: User & { password?: string } = {
      id: `u_educ_${Date.now()}`,
      email: data.educator.email.trim().toLowerCase(),
      firstName: data.educator.firstName.trim(),
      lastName: data.educator.lastName.trim(),
      role: 'counselor',
      schoolId: schoolId,
      phone: data.educator.phone,
      password: data.educator.password || 'password123'
    };

    // Generate DE tasks
    const newDeTasks = ChronogramService.generateTasksForDate(
      new Date(),
      academicDirectorUserCreated.id,
      schoolId,
      INITIAL_ASSISTANT_SETTINGS
    );

    // Generate Educator tasks
    const newEducatorTasks = EducatorChronogramService.generateTasksForDate(
      new Date(),
      educatorUser.id,
      schoolId,
      {
        ...INITIAL_EDUCATOR_SETTINGS,
        assignedClassIds: data.educator.assignedClassIds || ['c_6a', 'c_3a']
      }
    );

    setRegisteredSchools(prev => [newSchool, ...prev]);
    setRegisteredUsers(prev => [directorUser, academicDirectorUserCreated, educatorUser, ...prev]);
    setDirectorTasks(prev => [...prev, ...newDeTasks]);
    setEducatorTasks(prev => [...prev, ...newEducatorTasks]);

    // Connect as the Director of the newly registered school
    setSchool(newSchool);
    setCurrentUser(directorUser);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    localStorage.setItem('directeurpro_session', 'active');
    localStorage.setItem('directeurpro_current_user', JSON.stringify(directorUser));

    logAIOperation(
      'OnboardingOrchestrator',
      `Inscription complète : ${newSchool.name} avec Directeur (${directorUser.firstName} ${directorUser.lastName}), DE (${academicDirectorUserCreated.firstName} ${academicDirectorUserCreated.lastName}) et Éducateur (${educatorUser.firstName} ${educatorUser.lastName})`,
      ['Schools', 'Users', 'Chronograms'],
      100
    );

    return {
      success: true,
      message: `Établissement « ${newSchool.name} » inscrit avec succès ! Bienvenue ${directorUser.firstName}.`,
      user: directorUser
    };
  };

  return (
    <AppContext.Provider
      value={{
        school,
        academicYear,
        classes,
        subjects,
        students,
        payments,
        budget,
        alerts,
        decisions,
        schoolHealth,
        dailyBrief,
        whatIfScenarios,
        currentUser,
        allUsers: registeredUsers,
        auditLogs,
        activeTab,
        setActiveTab,
        switchUserRole,
        updateStudentGrade,
        resolveAlert,
        acceptDecision,
        rejectDecision,
        recordPayment,
        addWhatIfScenario,
        logAIOperation,
        directorTasks,
        assistantSettings,
        teacherAbsences,
        assistantLogs,
        canAccessDirectorAssistant,
        startTask,
        completeTask,
        postponeTask,
        skipTask,
        addTaskNote,
        addCustomTask,
        updateAssistantSettings,
        getDailySummary,
        educatorTasks,
        educatorSettings,
        educatorLogs,
        educatorSanctions,
        disciplinaryEvents,
        parentContacts,
        activeEducatorId,
        setActiveEducatorId,
        canAccessEducatorAssistant,
        isEducatorSupervisor,
        startEducatorTask,
        completeEducatorTask,
        postponeEducatorTask,
        skipEducatorTask,
        addEducatorTaskNote,
        toggleEducatorTaskChecklistItem,
        addCustomEducatorTask,
        updateEducatorSettings,
        updateEducatorSanctionStatus,
        addEducatorSanction,
        recordParentContact,
        handleDisciplinaryEvent,
        getEducatorDailySummary,
        getEducatorWeeklyReport,
        isAuthenticated,
        registeredSchools,
        login,
        logout,
        registerSchoolWithStaff,
        simulatedTime,
        setSimulatedTime,
        triggerSimulatedPayment,
        triggerSimulatedStudentAbsence,
        triggerSimulatedTeacherAbsence,
        triggerFullSchoolDayAutomation,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


