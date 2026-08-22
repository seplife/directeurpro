import { DirectorDailySummary, DirectorTask, Student, TeacherAbsence, DisciplinaryEvent } from '../../types';
import { ChronogramService } from './chronogramService';

export class SummaryService {
  /**
   * Builds the end-of-day bilan (spec §14): counts of realized / postponed /
   * not-done tasks, plus a cross-cutting operational snapshot (teachers,
   * students, incidents) pulled from the app's real, live data — not
   * separately-tracked "fake" numbers.
   */
  static generateDailySummary(
    tasks: DirectorTask[],
    teacherAbsences: TeacherAbsence[],
    students: Student[],
    date: Date
  ): DirectorDailySummary {
    const dateKey = ChronogramService.toDateKey(date);
    const todayTasks = tasks.filter(t => t.taskDate === dateKey);

    const tasksCompleted = todayTasks.filter(t => t.status === 'completed').length;
    const tasksPostponed = todayTasks.filter(t => t.status === 'postponed').length;
    const tasksNotDone = todayTasks.filter(t => t.status === 'skipped' || t.status === 'overdue').length;
    const tasksPlanned = todayTasks.length;
    const executionRate = tasksPlanned > 0 ? Math.round((tasksCompleted / tasksPlanned) * 100) : 0;

    const todayAbsences = teacherAbsences.filter(a => a.date === dateKey);
    const coursesNotCovered = todayAbsences.filter(a => a.status === 'non_traitee').length;

    const studentsNeedingAttention = students.filter(
      s => s.riskCategory === 'eleve' || s.riskCategory === 'critique'
    ).length;

    // Build tomorrow's priorities from what's outstanding today
    const tomorrowPriorities: string[] = [];

    const postponedTitles = todayTasks.filter(t => t.status === 'postponed').map(t => t.title);
    if (postponedTitles.length > 0) {
      tomorrowPriorities.push(`Finaliser les tâches reportées : ${postponedTitles.slice(0, 2).join(', ')}${postponedTitles.length > 2 ? '…' : ''}`);
    }

    if (coursesNotCovered > 0) {
      tomorrowPriorities.push(`Organiser le remplacement pour ${coursesNotCovered} cours non couverts hier.`);
    }

    if (studentsNeedingAttention > 0) {
      tomorrowPriorities.push(`Poursuivre le suivi individualisé des ${studentsNeedingAttention} élèves à risque élevé/critique.`);
    }

    const skippedTitles = todayTasks.filter(t => t.status === 'skipped').map(t => t.title);
    if (skippedTitles.length > 0) {
      tomorrowPriorities.push(`Traiter en priorité : ${skippedTitles[0]} (ignorée aujourd’hui).`);
    }

    if (tomorrowPriorities.length === 0) {
      tomorrowPriorities.push('Journée maîtrisée : maintenir la vigilance sur la supervision et le suivi pédagogique courant.');
    }

    return {
      date: dateKey,
      tasksPlanned,
      tasksCompleted,
      tasksPostponed,
      tasksNotDone,
      executionRate,
      teachersAbsent: todayAbsences.length,
      coursesNotCovered,
      studentsNeedingAttention,
      incidentsCount: 0, // wired below when disciplinary events are passed in
      tomorrowPriorities: tomorrowPriorities.slice(0, 5)
    };
  }

  /** Same as above but also folds in today's disciplinary incidents. */
  static generateDailySummaryWithIncidents(
    tasks: DirectorTask[],
    teacherAbsences: TeacherAbsence[],
    students: Student[],
    disciplinaryEvents: DisciplinaryEvent[],
    date: Date
  ): DirectorDailySummary {
    const base = this.generateDailySummary(tasks, teacherAbsences, students, date);
    const dateKey = base.date;
    const incidentsCount = disciplinaryEvents.filter(e => e.date === dateKey).length;
    return { ...base, incidentsCount };
  }

  /**
   * Lightweight weekly rollup (spec §26). Aggregates the daily summaries
   * collected during the current session — this app has no backend
   * persistence yet, so the weekly report only covers days seen since the
   * page was loaded (documented limitation, see delivery notes).
   */
  static generateWeeklySummary(dailySummaries: DirectorDailySummary[]) {
    const totalPlanned = dailySummaries.reduce((acc, d) => acc + d.tasksPlanned, 0);
    const totalCompleted = dailySummaries.reduce((acc, d) => acc + d.tasksCompleted, 0);
    const executionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

    return {
      daysCovered: dailySummaries.length,
      totalTasksPlanned: totalPlanned,
      totalTasksCompleted: totalCompleted,
      executionRate,
      totalTeachersAbsent: dailySummaries.reduce((acc, d) => acc + d.teachersAbsent, 0),
      totalCoursesNotCovered: dailySummaries.reduce((acc, d) => acc + d.coursesNotCovered, 0),
      totalIncidents: dailySummaries.reduce((acc, d) => acc + d.incidentsCount, 0)
    };
  }
}
