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
  AIAuditLog
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
  INITIAL_WHAT_IF_SCENARIOS
} from '../services/db/mockData';
import { SchoolHealthService } from '../services/ai/schoolHealthService';
import { StudentRiskAgent } from '../services/ai/agents/studentRiskAgent';

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
}

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
        logAIOperation
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
