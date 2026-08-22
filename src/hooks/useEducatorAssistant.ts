import { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EducatorChronogramService } from '../services/educatorAssistant/educatorChronogramService';
import { EducatorTaskService } from '../services/educatorAssistant/educatorTaskService';
import { EducatorAlertService } from '../services/educatorAssistant/educatorAlertService';

export function useEducatorAssistant() {
  const app = useApp();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const effectiveEducatorId =
    app.currentUser.role === 'counselor'
      ? app.currentUser.id
      : app.activeEducatorId || 'u_educ';

  const todayKey = EducatorChronogramService.toDateKey(now);

  // Filter tasks for the active educator
  const educatorTodayTasks = useMemo(() => {
    return app.educatorTasks.filter(
      t => t.taskDate === todayKey && (t.educatorId === effectiveEducatorId || t.educatorId === 'all')
    );
  }, [app.educatorTasks, todayKey, effectiveEducatorId]);

  const derivedTasks = useMemo(() => {
    return EducatorTaskService.deriveStatuses(educatorTodayTasks, now);
  }, [educatorTodayTasks, now]);

  const activeTask = useMemo(() => EducatorTaskService.getActiveTask(derivedTasks, now), [derivedTasks, now]);
  const nextTask = useMemo(() => EducatorTaskService.getNextTask(derivedTasks, now), [derivedTasks, now]);
  const overdueTasks = useMemo(() => EducatorTaskService.getOverdueTasks(derivedTasks, now), [derivedTasks, now]);
  const progressStats = useMemo(() => EducatorTaskService.computeProgress(derivedTasks), [derivedTasks]);

  // Contextual alerts
  const contextAlerts = useMemo(() => {
    return EducatorAlertService.generateContextAlerts(
      app.students,
      [],
      app.disciplinaryEvents,
      app.educatorSanctions,
      app.educatorSettings.assignedClassIds
    );
  }, [app.students, app.disciplinaryEvents, app.educatorSanctions, app.educatorSettings.assignedClassIds]);

  // At-risk students
  const atRiskStudents = useMemo(() => {
    return EducatorAlertService.computeAtRiskStudents(
      app.students,
      app.educatorSanctions,
      app.educatorSettings.assignedClassIds
    );
  }, [app.students, app.educatorSanctions, app.educatorSettings.assignedClassIds]);

  // Supervision stats for all educators (for Director / CDE)
  const supervisionTable = useMemo(() => {
    const educators = app.allUsers.filter(u => u.role === 'counselor');
    return educators.map(educator => {
      const tasks = app.educatorTasks.filter(t => t.taskDate === todayKey && t.educatorId === educator.id);
      const derived = EducatorTaskService.deriveStatuses(tasks, now);
      const done = derived.filter(t => t.status === 'completed').length;
      const overdue = derived.filter(t => t.status === 'overdue').length;
      const active = derived.find(t => t.status === 'active');
      const alertsCount = contextAlerts.filter(a => a.status === 'active').length;

      return {
        educator,
        totalTasks: tasks.length,
        completedTasks: done,
        overdueTasks: overdue,
        activeTaskTitle: active?.title || 'Aucune tâche active',
        executionRate: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
        alertsCount
      };
    });
  }, [app.allUsers, app.educatorTasks, todayKey, now, contextAlerts]);

  const isSchoolDay = derivedTasks.length > 0 || EducatorChronogramService.isSchoolDay(now, app.educatorSettings);

  return {
    now,
    effectiveEducatorId,
    tasks: derivedTasks,
    allEducatorTasks: app.educatorTasks,
    activeTask,
    nextTask,
    overdueTasks,
    progress: progressStats.percent,
    completedCount: progressStats.completed,
    totalCount: progressStats.total,
    minutesRemaining: activeTask ? EducatorTaskService.minutesRemaining(activeTask, now) : 0,
    contextAlerts,
    atRiskStudents,
    supervisionTable,
    isSchoolDay,
    ...app
  };
}
