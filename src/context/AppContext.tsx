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
  DisciplinaryEvent
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

  const updateStudentGrade = (studentId: string, newAverage: number) => {
    setStudents(prev =>
      prev.map(s => {
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
      })
    );
  };

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

    setPayments(prev => [newPayment, ...prev]);

    // Update budget totals
    setBudget(prev => {
      const newCollected = prev.totalCollectedRevenue + newPayment.amount;
      const newDebt = Math.max(0, prev.totalExpectedRevenue - newCollected);
      const newRecoveryRate = Number(((newCollected / prev.totalExpectedRevenue) * 100).toFixed(1));
      return {
        ...prev,
        totalCollectedRevenue: newCollected,
        totalOutstandingDebt: newDebt,
        recoveryRate: newRecoveryRate
      };
    });
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
        allUsers: INITIAL_USERS,
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
        getEducatorWeeklyReport
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

