import React, { useState } from 'react';
import { useDirectorAssistant } from '../../hooks/useDirectorAssistant';
import { DirectorTask } from '../../types';
import { SummaryService } from '../../services/directorAssistant/summaryService';
import {
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  SkipForward,
  StickyNote,
  Plus,
  X,
  Users,
  UserX,
  ListChecks,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const STATUS_DOT: Record<DirectorTask['status'], string> = {
  completed: 'bg-emerald-500',
  active: 'bg-brand-500 animate-pulse',
  overdue: 'bg-rose-500',
  postponed: 'bg-purple-500',
  skipped: 'bg-slate-600',
  pending: 'bg-slate-700'
};

const STATUS_LABEL: Record<DirectorTask['status'], string> = {
  completed: 'Terminée',
  active: 'En cours',
  overdue: 'En retard',
  postponed: 'Reportée',
  skipped: 'Ignorée',
  pending: 'À venir'
};

const PRIORITY_BADGE: Record<DirectorTask['priority'], string> = {
  critique: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  haute: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  moyenne: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
  faible: 'bg-slate-700/40 text-slate-400 border-slate-600'
};

type ViewTab = 'now' | 'planning' | 'summary';

export const AssistantModule: React.FC = () => {
  const {
    tasks,
    activeTask,
    nextTask,
    overdueTasks,
    progress,
    completedCount,
    totalCount,
    minutesRemaining,
    isSchoolDay,
    now,
    startTask,
    completeTask,
    postponeTask,
    skipTask,
    addTaskNote,
    addCustomTask,
    students,
    teacherAbsences,
    assistantSettings,
    assistantLogs
  } = useDirectorAssistant();

  const [view, setView] = useState<ViewTab>('now');
  const [noteDraft, setNoteDraft] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customStart, setCustomStart] = useState('12:00');
  const [customEnd, setCustomEnd] = useState('12:30');

  const todayAbsences = teacherAbsences.filter(a => a.status === 'non_traitee');
  const atRiskStudents = students.filter(s => s.riskCategory === 'eleve' || s.riskCategory === 'critique');

  const handlePostpone = (task: DirectorTask, minutes: number) => {
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const duration = toMin(task.endTime) - toMin(task.startTime);
    const newStart = toMin(task.startTime) + minutes;
    postponeTask(task.id, toTime(newStart), toTime(newStart + duration));
    setExpandedTaskId(null);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    addCustomTask({
      title: customTitle.trim(),
      description: 'Tâche ajoutée manuellement par le Directeur des Études.',
      startTime: customStart,
      endTime: customEnd,
      priority: 'moyenne',
      category: 'administration'
    });
    setCustomTitle('');
    setIsCustomFormOpen(false);
  };

  const summary = SummaryService.generateDailySummary(tasks, teacherAbsences, students, now);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1">
            <Bot className="w-3.5 h-3.5" />
            <span>AGENT DE PILOTAGE PÉDAGOGIQUE</span>
          </span>
          <span className="text-xs text-slate-400">
            {now.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })} • {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">{assistantSettings.assistantName}</h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Chronogramme, rappels et bilan de la journée du Directeur des Études — connecté aux données réelles de l'établissement (absences enseignants, élèves à risque).
        </p>
      </div>

      {!isSchoolDay ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">Aucun chronogramme aujourd’hui</h3>
          <p className="text-xs text-slate-400">Jour non ouvrable ou hors calendrier scolaire (weekend, vacances, journée pédagogique).</p>
        </div>
      ) : (
        <>
          {/* Internal tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-px">
            {([
              { id: 'now', label: 'Maintenant' },
              { id: 'planning', label: 'Planning du jour' },
              { id: 'summary', label: 'Bilan du jour' }
            ] as { id: ViewTab; label: string }[]).map(t => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${
                  view === t.id ? 'bg-slate-900 text-white border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contextual agent alerts (spec §11-13) */}
          {(todayAbsences.length > 0 || atRiskStudents.length > 0) && view !== 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {todayAbsences.map(abs => (
                <div key={abs.id} className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold">
                    <UserX className="w-4 h-4" />
                    <span>🚨 Intervention requise</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong>{abs.teacherName}</strong> est absent pour le cours de <strong>{abs.className}</strong> ({abs.subjectName}, {abs.timeSlot}). {abs.reason}
                  </p>
                  <p className="text-[11px] text-rose-300">La classe risque de rester sans enseignant.</p>
                </div>
              ))}

              {atRiskStudents.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                    <Users className="w-4 h-4" />
                    <span>⚠️ Élèves nécessitant votre attention</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    <strong>{atRiskStudents.length} élève(s)</strong> présentent un niveau de risque élevé ou critique (académique, assiduité ou discipline).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== VIEW: MAINTENANT ===== */}
          {view === 'now' && (
            <div className="space-y-4">
              <div className="text-center space-y-1 py-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Que dois-je faire maintenant ?</span>
                <div className="text-3xl font-black text-white">{now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              {activeTask ? (
                <div className="glass-panel p-6 rounded-2xl border border-brand-700/60 bg-brand-950/20 space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${PRIORITY_BADGE[activeTask.priority]}`}>
                      Priorité {activeTask.priority}
                    </span>
                    <span className="text-xs text-slate-400">{activeTask.startTime} – {activeTask.endTime}</span>
                  </div>

                  <h3 className="text-lg font-black text-white text-center">{activeTask.title}</h3>
                  <p className="text-xs text-slate-300 text-center">{activeTask.description}</p>

                  {activeTask.checklist.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center space-x-1.5">
                        <ListChecks className="w-3.5 h-3.5" />
                        <span>À vérifier :</span>
                      </span>
                      {activeTask.checklist.map(item => (
                        <div key={item.id} className="text-xs text-slate-300 flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center text-xs text-slate-400">
                    Temps restant : <strong className="text-white">{minutesRemaining} min</strong>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => completeTask(activeTask.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Terminé</span>
                    </button>
                    <button
                      onClick={() => handlePostpone(activeTask, 15)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                    >
                      Reporter +15min
                    </button>
                    <button
                      onClick={() => skipTask(activeTask.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold text-xs flex items-center space-x-1"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      <span>Ignorer</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                    <StickyNote className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Ajouter une note à cette tâche..."
                      value={noteDraft}
                      onChange={e => setNoteDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && noteDraft.trim()) {
                          addTaskNote(activeTask.id, noteDraft.trim());
                          setNoteDraft('');
                        }
                      }}
                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  {activeTask.notes && (
                    <p className="text-[11px] text-slate-400 italic">Notes : {activeTask.notes}</p>
                  )}
                </div>
              ) : nextTask ? (
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 max-w-2xl mx-auto text-center">
                  <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Aucune tâche en cours. Votre prochaine mission :</p>
                  <h3 className="text-base font-bold text-white">{nextTask.title}</h3>
                  <p className="text-xs text-slate-400">{nextTask.startTime} – {nextTask.endTime}</p>
                  <button
                    onClick={() => startTask(nextTask.id)}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs inline-flex items-center space-x-1.5"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Démarrer maintenant</span>
                  </button>
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl border border-emerald-800/60 bg-emerald-950/20 text-center space-y-2 max-w-2xl mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Chronogramme du jour terminé !</h3>
                  <p className="text-xs text-slate-400">Consultez le bilan du jour pour préparer demain.</p>
                </div>
              )}

              {overdueTasks.length > 0 && (
                <div className="max-w-2xl mx-auto p-3 rounded-xl bg-rose-950/30 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{overdueTasks.length} tâche(s) en retard non traitées : {overdueTasks.map(t => t.title).join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* ===== VIEW: PLANNING DU JOUR ===== */}
          {view === 'planning' && (
            <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">Progression : {completedCount}/{totalCount} tâches ({progress}%)</span>
                <button
                  onClick={() => setIsCustomFormOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tâche personnalisée</span>
                </button>
              </div>

              {tasks.map(task => (
                <div key={task.id} className="border-b border-slate-800/60 last:border-0">
                  <button
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    className="w-full flex items-center space-x-3 py-2.5 text-left hover:bg-slate-900/40 rounded-lg px-2 transition-colors"
                  >
                    <span className="text-[11px] text-slate-500 font-mono w-11 shrink-0">{task.startTime}</span>
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_DOT[task.status]}`} />
                    <span className={`text-xs flex-1 ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200 font-medium'}`}>
                      {task.title}
                      {task.isCustom && <span className="ml-1.5 text-[10px] text-brand-400">(perso)</span>}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{STATUS_LABEL[task.status]}</span>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform ${expandedTaskId === task.id ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedTaskId === task.id && (
                    <div className="px-4 pb-4 pl-16 space-y-3">
                      <p className="text-[11px] text-slate-400">{task.description}</p>
                      {task.notes && <p className="text-[11px] text-brand-300 italic">Notes : {task.notes}</p>}

                      {task.status !== 'completed' && task.status !== 'skipped' && (
                        <div className="flex flex-wrap items-center gap-2">
                          {task.status === 'pending' && (
                            <button onClick={() => startTask(task.id)} className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold">
                              Démarrer
                            </button>
                          )}
                          <button onClick={() => completeTask(task.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold">
                            Terminé
                          </button>
                          <button onClick={() => handlePostpone(task, 15)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold">
                            +15 min
                          </button>
                          <button onClick={() => handlePostpone(task, 30)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold">
                            +30 min
                          </button>
                          <button onClick={() => handlePostpone(task, 60)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold">
                            +1h
                          </button>
                          <button onClick={() => skipTask(task.id)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-semibold">
                            Ignorer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ===== VIEW: BILAN DU JOUR ===== */}
          {view === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Taux d'exécution</span>
                  <span className="text-xl font-black text-white">{summary.executionRate}%</span>
                </div>
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Tâches réalisées</span>
                  <span className="text-xl font-black text-emerald-400">{summary.tasksCompleted}/{summary.tasksPlanned}</span>
                </div>
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Reportées / Non faites</span>
                  <span className="text-xl font-black text-amber-400">{summary.tasksPostponed} / {summary.tasksNotDone}</span>
                </div>
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Élèves à suivre</span>
                  <span className="text-xl font-black text-rose-400">{summary.studentsNeedingAttention}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>Priorités générées pour demain</span>
                </h3>
                <ul className="space-y-1.5">
                  {summary.tomorrowPriorities.map((p, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-brand-400 font-bold">{idx + 1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white">Journal d'activité de l'agent (session en cours)</h3>
                {assistantLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">Aucune action enregistrée pour l’instant.</p>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {assistantLogs.slice(0, 20).map(log => (
                      <div key={log.id} className="text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                        <span>{log.detail}</span>
                        <span className="text-slate-600 shrink-0 ml-2">{new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Custom Task Modal */}
      {isCustomFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomTask} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Ajouter une tâche personnalisée</h3>
              <button type="button" onClick={() => setIsCustomFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre :</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Début :</label>
                  <input type="time" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fin :</label>
                  <input type="time" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={() => setIsCustomFormOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                Annuler
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
