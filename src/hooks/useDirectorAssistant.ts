import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskEngine } from '../services/directorAssistant/taskEngine';
import { ChronogramService } from '../services/directorAssistant/chronogramService';

/**
 * useDirectorAssistant
 * ----------------------
 * Ticks a local clock (every 30s — no need for per-second re-renders) and
 * combines it with the raw task list from AppContext to produce the live,
 * self-correcting view the "Assistant DE" UI needs: active task, next task,
 * overdue tasks and today's progress.
 *
 * Keeping the ticking `now` state local to this hook (rather than in
 * AppContext) means only the components that actually render the assistant
 * re-render every 30s — not the entire app.
 */
export function useDirectorAssistant() {
  const app = useApp();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const todayKey = ChronogramService.toDateKey(now);
  const todayTasks = app.directorTasks.filter(t => t.taskDate === todayKey);
  const derivedTasks = TaskEngine.deriveStatuses(todayTasks, now);

  const activeTask = TaskEngine.getActiveTask(derivedTasks, now);
  const nextTask = TaskEngine.getNextTask(derivedTasks, now);
  const overdueTasks = TaskEngine.getOverdueTasks(derivedTasks, now);
  const progress = TaskEngine.computeProgress(derivedTasks);
  const completedCount = derivedTasks.filter(t => t.status === 'completed').length;

  return {
    now,
    tasks: derivedTasks,
    activeTask,
    nextTask,
    overdueTasks,
    progress,
    completedCount,
    totalCount: derivedTasks.length,
    minutesRemaining: activeTask ? TaskEngine.minutesRemaining(activeTask, now) : 0,
    isSchoolDay: derivedTasks.length > 0 || ChronogramService.isSchoolDay(now, app.assistantSettings),
    ...app
  };
}
