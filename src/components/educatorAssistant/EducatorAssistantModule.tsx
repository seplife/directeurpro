import React, { useState } from 'react';
import { useEducatorAssistant } from '../../hooks/useEducatorAssistant';
import { EducatorDailyTask, EducatorSanction, DisciplinaryEvent, ParentContactRecord } from '../../types';
import { EducatorTaskService } from '../../services/educatorAssistant/educatorTaskService';
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
  ChevronRight,
  PhoneCall,
  MessageSquare,
  FileText,
  CalendarCheck,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Send,
  Eye,
  Check
} from 'lucide-react';

const STATUS_DOT: Record<EducatorDailyTask['status'], string> = {
  completed: 'bg-emerald-500 shadow-emerald-500/50',
  active: 'bg-blue-500 animate-pulse shadow-blue-500/50',
  overdue: 'bg-rose-500 shadow-rose-500/50',
  postponed: 'bg-amber-500 shadow-amber-500/50',
  skipped: 'bg-slate-600',
  pending: 'bg-slate-700'
};

const STATUS_LABEL: Record<EducatorDailyTask['status'], string> = {
  completed: 'Terminé',
  active: 'En cours',
  overdue: 'En retard',
  postponed: 'Reporté',
  skipped: 'Ignoré',
  pending: 'À venir'
};

const PRIORITY_BADGE: Record<EducatorDailyTask['priority'], string> = {
  critique: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  haute: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  moyenne: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
  faible: 'bg-slate-700/40 text-slate-400 border-slate-600'
};

const CATEGORY_LABEL: Record<EducatorDailyTask['category'], string> = {
  organisation: 'Organisation',
  accueil: 'Accueil',
  surveillance: 'Surveillance',
  assiduite: 'Assiduité',
  discipline: 'Discipline',
  eleves: 'Élèves',
  parents: 'Parents',
  administration: 'Administration',
  reporting: 'Reporting'
};

type ViewTab = 'now' | 'timeline' | 'context' | 'students' | 'summary' | 'supervision';

export const EducatorAssistantModule: React.FC = () => {
  const {
    now,
    tasks,
    activeTask,
    nextTask,
    overdueTasks,
    progress,
    completedCount,
    totalCount,
    minutesRemaining,
    contextAlerts,
    atRiskStudents,
    supervisionTable,
    isSchoolDay,
    isEducatorSupervisor,
    activeEducatorId,
    setActiveEducatorId,
    startEducatorTask,
    completeEducatorTask,
    postponeEducatorTask,
    skipEducatorTask,
    addEducatorTaskNote,
    toggleEducatorTaskChecklistItem,
    addCustomEducatorTask,
    educatorSettings,
    educatorSanctions,
    disciplinaryEvents,
    parentContacts,
    updateEducatorSanctionStatus,
    addEducatorSanction,
    recordParentContact,
    handleDisciplinaryEvent,
    getEducatorDailySummary,
    getEducatorWeeklyReport,
    currentUser,
    allUsers,
    students,
    classes
  } = useEducatorAssistant();

  const [activeTab, setActiveSubTab] = useState<ViewTab>('now');
  const [selectedTaskForPostpone, setSelectedTaskForPostpone] = useState<EducatorDailyTask | null>(null);
  const [customPostponeMinutes, setCustomPostponeMinutes] = useState<number>(30);
  const [noteTaskId, setNoteTaskId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [isCustomTaskModalOpen, setIsCustomTaskModalOpen] = useState<boolean>(false);
  const [customTaskTitle, setCustomTaskTitle] = useState<string>('');
  const [customTaskDesc, setCustomTaskDesc] = useState<string>('');
  const [customTaskStart, setCustomTaskStart] = useState<string>('08:00');
  const [customTaskEnd, setCustomTaskEnd] = useState<string>('08:30');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New sanction modal state
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState<boolean>(false);
  const [sanctionStudentId, setSanctionStudentId] = useState<string>(students[0]?.id || '');
  const [sanctionType, setSanctionType] = useState<EducatorSanction['type']>('retenue');
  const [sanctionReason, setSanctionReason] = useState<string>('');
  const [sanctionSchedule, setSanctionSchedule] = useState<string>('Samedi matin 08h-10h');

  // Contact modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [contactStudent, setContactStudent] = useState<typeof students[0] | null>(null);
  const [contactChannel, setContactChannel] = useState<'appel' | 'sms' | 'whatsapp'>('appel');
  const [contactReason, setContactReason] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePostponeAction = (task: EducatorDailyTask, minutes: number) => {
    const startMin = EducatorTaskService.timeToMinutes(task.startTime);
    const endMin = EducatorTaskService.timeToMinutes(task.endTime);
    const duration = endMin - startMin;
    const newStart = EducatorTaskService.minutesToTime(startMin + minutes);
    const newEnd = EducatorTaskService.minutesToTime(startMin + minutes + duration);

    postponeEducatorTask(task.id, newStart, newEnd);
    setSelectedTaskForPostpone(null);
    showToast(`Tâche « ${task.title} » reportée à ${newStart}.`);
  };

  const handleSaveNote = () => {
    if (noteTaskId && noteContent.trim()) {
      addEducatorTaskNote(noteTaskId, noteContent.trim());
      setNoteTaskId(null);
      setNoteContent('');
      showToast('Note enregistrée avec succès.');
    }
  };

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle.trim()) return;

    addCustomEducatorTask({
      title: customTaskTitle.trim(),
      description: customTaskDesc.trim() || 'Tâche personnalisée ajoutée par l’éducateur.',
      startTime: customTaskStart,
      endTime: customTaskEnd,
      priority: 'haute',
      category: 'organisation'
    });

    setIsCustomTaskModalOpen(false);
    setCustomTaskTitle('');
    setCustomTaskDesc('');
    showToast(`Tâche « ${customTaskTitle} » ajoutée au planning.`);
  };

  const handleCreateSanction = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === sanctionStudentId);
    if (!st || !sanctionReason.trim()) return;

    addEducatorSanction({
      schoolId: st.schoolId,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      className: st.className,
      type: sanctionType,
      reason: sanctionReason.trim(),
      date: new Date().toISOString().split('T')[0],
      durationOrSchedule: sanctionSchedule,
      status: 'en_attente',
      decidedBy: `${currentUser.firstName} ${currentUser.lastName}`
    });

    setIsSanctionModalOpen(false);
    setSanctionReason('');
    showToast(`Sanction enregistrée pour ${st.firstName} ${st.lastName}.`);
  };

  const handleCreateParentContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactStudent || !contactReason.trim()) return;

    recordParentContact({
      schoolId: contactStudent.schoolId,
      studentId: contactStudent.id,
      studentName: `${contactStudent.firstName} ${contactStudent.lastName}`,
      guardianName: contactStudent.guardianName,
      guardianPhone: contactStudent.guardianPhone,
      reason: contactReason.trim(),
      channel: contactChannel,
      status: 'effectue',
      notes: 'Contact initié par la vie scolaire.',
      educatorId: currentUser.id
    });

    setIsContactModalOpen(false);
    setContactReason('');
    setContactStudent(null);
    showToast(`Communication enregistrée avec le tuteur de ${contactStudent.firstName} ${contactStudent.lastName}.`);
  };

  const dailySummary = getEducatorDailySummary();
  const weeklyReport = getEducatorWeeklyReport();

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-800/40 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1.5">
                <Bot className="w-3.5 h-3.5" />
                <span>ASSISTANT DE VIE SCOLAIRE</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>{educatorSettings.assistantName}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                19 Créneaux Actifs
              </span>
            </h2>

            <p className="text-xs text-slate-300 max-w-3xl">
              Pilotage quotidien heure par heure, gestion continue de l'assiduité, suivi des élèves à risque, sanctions et rapports IA automatiques.
            </p>
          </div>

          {/* Right Header Status / Supervisor Switcher */}
          <div className="flex items-center space-x-3">
            {isEducatorSupervisor && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Éducateur supervisé :</span>
                <select
                  value={activeEducatorId}
                  onChange={(e) => setActiveEducatorId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {allUsers.filter(u => u.role === 'counselor').map(ed => (
                    <option key={ed.id} value={ed.id}>
                      {ed.firstName} {ed.lastName} ({ed.id === 'u_educ' ? 'Collège' : 'Lycée'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Progression Jour</span>
              <div className="flex items-baseline space-x-1 justify-end">
                <span className="text-xl font-black text-amber-400">{completedCount}</span>
                <span className="text-xs text-slate-400">/{totalCount} ({progress}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'now', label: '🔴 Que faire maintenant ?', count: activeTask ? 1 : 0 },
          { id: 'timeline', label: '⏱ Timeline du jour (19)', count: overdueTasks.length > 0 ? overdueTasks.length : undefined, countColor: 'bg-rose-500 text-white' },
          { id: 'context', label: '🚨 Assiduité & Climat', count: contextAlerts.length, countColor: 'bg-amber-500 text-slate-950' },
          { id: 'students', label: '👥 Élèves à Suivre & Familles', count: atRiskStudents.length, countColor: 'bg-rose-500 text-white' },
          { id: 'summary', label: '📊 Bilan & Rapport IA' },
          ...(isEducatorSupervisor ? [{ id: 'supervision', label: '👑 Supervision Éducateurs', badge: 'Direction' }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as ViewTab)}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${tab.countColor || 'bg-slate-800 text-white'}`}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-purple-900 text-purple-200 border border-purple-700">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: QUE DOIS-JE FAIRE MAINTENANT ?                                     */}
      {/* ========================================================================= */}
      {activeTab === 'now' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Main Active Task Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {activeTask ? (
              <div className="glass-panel p-6 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-900 via-slate-900/90 to-amber-950/20 space-y-6 shadow-2xl">
                {/* Active Task Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-blue-500 text-white flex items-center space-x-1.5 shadow-md shadow-blue-500/30">
                        <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                        <span>TÂCHE EN COURS</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${PRIORITY_BADGE[activeTask.priority]}`}>
                        Priorité {activeTask.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {CATEGORY_LABEL[activeTask.category]}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white">{activeTask.title}</h3>
                    <p className="text-xs text-slate-300">{activeTask.description}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Temps Restant</span>
                    <span className="text-2xl font-black text-amber-400 font-mono flex items-center justify-center sm:justify-end space-x-1">
                      <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                      <span>{minutesRemaining} min</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block">Créneau : {activeTask.startTime} → {activeTask.endTime}</span>
                  </div>
                </div>

                {/* Specific Action Instructions */}
                {activeTask.instructions && activeTask.instructions.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Vous devez effectuer les actions suivantes :</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {activeTask.instructions.map((inst, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Checklist */}
                {activeTask.checklist && activeTask.checklist.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                      <ListChecks className="w-4 h-4 text-emerald-400" />
                      <span>Contrôles à Réaliser :</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeTask.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleEducatorTaskChecklistItem(activeTask.id, item.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                            item.checked
                              ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className={`h-5 w-5 rounded-lg flex items-center justify-center border transition-all ${
                            item.checked
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                              : 'border-slate-600 bg-slate-950'
                          }`}>
                            {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-medium ${item.checked ? 'line-through text-slate-400' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => completeEducatorTask(activeTask.id)}
                    className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARQUER COMME TERMINÉ</span>
                  </button>

                  <button
                    onClick={() => setSelectedTaskForPostpone(activeTask)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reporter</span>
                  </button>

                  <button
                    onClick={() => {
                      setNoteTaskId(activeTask.id);
                      setNoteContent(activeTask.notes || '');
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
                  >
                    <StickyNote className="w-4 h-4" />
                    <span>Ajouter Note</span>
                  </button>

                  <button
                    onClick={() => skipEducatorTask(activeTask.id)}
                    className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 font-semibold text-xs border border-slate-800"
                  >
                    Ignorer
                  </button>
                </div>
              </div>
            ) : (
              /* No active task right now */
              <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Aucun créneau actif en ce moment</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Vous êtes entre deux créneaux du chronogramme ou hors des heures de service.
                  </p>
                </div>
                {nextTask && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 inline-block text-left text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Prochaine tâche planifiée :</span>
                    <div className="font-bold text-white flex items-center space-x-2">
                      <span className="text-amber-400">{nextTask.startTime}</span>
                      <span>—</span>
                      <span>{nextTask.title}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Task Full Preview Card */}
            {nextTask && (
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-amber-400 border border-slate-700 flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>PROCHAINE TÂCHE</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Début à {nextTask.startTime}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${PRIORITY_BADGE[nextTask.priority]}`}>
                    {nextTask.priority}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{nextTask.title}</h4>
                <p className="text-xs text-slate-300">{nextTask.description}</p>
              </div>
            )}
          </div>

          {/* Right Column: Context Alerts & Rapid Action Feed */}
          <div className="space-y-6">
            {/* Live Contextual Alerts */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Alertes & Contextes Scolaires</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {contextAlerts.length}
                </span>
              </div>

              {contextAlerts.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Aucune alerte active sur votre secteur.
                </div>
              ) : (
                <div className="space-y-3">
                  {contextAlerts.slice(0, 4).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                        alert.severity === 'critique'
                          ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                          : 'bg-amber-950/30 border-amber-800/70 text-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                          alert.severity === 'critique' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{alert.targetEntityName}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                      <p className="text-[11px] text-slate-300">{alert.recommendation}</p>

                      <div className="pt-1 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setActiveSubTab('context')}
                          className="text-[11px] font-bold text-amber-300 hover:text-white underline"
                        >
                          {alert.actionLabel || 'Traiter'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Overdue Tasks Box */}
            {overdueTasks.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-rose-900/60 bg-rose-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>TÂCHES EN RETARD ({overdueTasks.length})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {overdueTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-slate-900/90 border border-rose-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-rose-400 font-mono font-bold block">{t.startTime} - {t.endTime}</span>
                        <h5 className="text-xs font-bold text-white line-clamp-1">{t.title}</h5>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => completeEducatorTask(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => setSelectedTaskForPostpone(t)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-semibold"
                        >
                          Reporter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TIMELINE VERTICALE DE LA JOURNÉE (19 TÂCHES)                       */}
      {/* ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Légende des statuts :</span>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span>🟢 Terminé</span></span>
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" /><span>🔵 En cours</span></span>
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /><span>🟠 Reporté</span></span>
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /><span>🔴 En retard</span></span>
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-700" /><span>⚪ À venir</span></span>
              </div>
            </div>

            <button
              onClick={() => setIsCustomTaskModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une tâche personnalisée</span>
            </button>
          </div>

          {/* Timeline Vertical Layout */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {tasks.map((task, idx) => {
              const isActive = task.status === 'active';
              const isDone = task.status === 'completed';
              const isOverdue = task.status === 'overdue';

              return (
                <div key={task.id} className="relative group">
                  {/* Status Dot on line */}
                  <div
                    className={`absolute -left-6 top-4 h-4 w-4 rounded-full border-2 border-slate-950 transition-all ${
                      STATUS_DOT[task.status]
                    } ${isActive ? 'ring-4 ring-blue-500/30 scale-125' : ''}`}
                  />

                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-950/50'
                        : isDone
                        ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                        : isOverdue
                        ? 'bg-rose-950/20 border-rose-900/60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                          {task.startTime} – {task.endTime}
                        </span>
                        <h4 className="text-sm font-black text-white">{task.title}</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${PRIORITY_BADGE[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {CATEGORY_LABEL[task.category]}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isDone ? 'bg-emerald-950 text-emerald-300' : isActive ? 'bg-blue-950 text-blue-300' : isOverdue ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {STATUS_LABEL[task.status]}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2">{task.description}</p>

                    {/* Task checklist */}
                    {task.checklist && task.checklist.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.checklist.map(item => (
                          <button
                            key={item.id}
                            onClick={() => toggleEducatorTaskChecklistItem(task.id, item.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 transition-all ${
                              item.checked
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 line-through'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{item.checked ? '✓' : '○'}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Notes if any */}
                    {task.notes && (
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-950 text-[11px] text-amber-300 border border-slate-800 flex items-center space-x-1.5">
                        <StickyNote className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Note :</strong> {task.notes}</span>
                      </div>
                    )}

                    {/* Action buttons on timeline item */}
                    <div className="mt-3.5 flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/60">
                      {!isDone && (
                        <button
                          onClick={() => completeEducatorTask(task.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terminé</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedTaskForPostpone(task)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium"
                      >
                        Reporter
                      </button>

                      <button
                        onClick={() => {
                          setNoteTaskId(task.id);
                          setNoteContent(task.notes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                      >
                        Note
                      </button>

                      {!isDone && (
                        <button
                          onClick={() => skipEducatorTask(task.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs"
                        >
                          Ignorer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ASSIDUITÉ, INCIDENTS & SANCTIONS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'context' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block">Absences du Jour</span>
              <div className="text-2xl font-black text-white mt-1">18 élèves</div>
              <span className="text-[11px] text-rose-400 font-semibold">6 non justifiées</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block">Retards de 1ère Heure</span>
              <div className="text-2xl font-black text-amber-400 mt-1">12 retards</div>
              <span className="text-[11px] text-amber-300 font-semibold">3 récidivistes identifiés</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold block">Sanctions & Incidents</span>
              <div className="text-2xl font-black text-purple-400 mt-1">{educatorSanctions.length} mesures</div>
              <span className="text-[11px] text-slate-400">{educatorSanctions.filter(s => s.status === 'en_attente').length} en attente de traitement</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incidents Disciplinaires */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-black text-white uppercase">Incidents Disciplinaires Signalés</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">{disciplinaryEvents.length} dossiers</span>
              </div>

              <div className="space-y-3">
                {disciplinaryEvents.map(evt => (
                  <div key={evt.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {evt.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">{evt.date} • {evt.className}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{evt.studentName}</h4>
                    <p className="text-xs text-slate-300">{evt.description}</p>
                    {evt.sanction && (
                      <div className="text-[11px] text-amber-300 bg-slate-950 p-2 rounded border border-slate-800">
                        ⚖️ <strong>Mesure préconisée :</strong> {evt.sanction}
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-2">
                      {evt.status !== 'traite' ? (
                        <button
                          onClick={() => handleDisciplinaryEvent(evt.id, 'traite')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Marquer comme traité
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400">✓ Dossier clôturé</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registre des Sanctions de Vie Scolaire */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white uppercase">Suivi des Sanctions & Mesures</h3>
                </div>
                <button
                  onClick={() => setIsSanctionModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle sanction</span>
                </button>
              </div>

              <div className="space-y-3">
                {educatorSanctions.map(sanc => (
                  <div key={sanc.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sanc.studentName} ({sanc.className})</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        sanc.status === 'executee' ? 'bg-emerald-950 text-emerald-300' : sanc.status === 'en_attente' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sanc.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-amber-300 font-semibold">{sanc.type.toUpperCase()} : {sanc.reason}</div>
                    {sanc.durationOrSchedule && (
                      <div className="text-[11px] text-slate-400">Créneau : {sanc.durationOrSchedule}</div>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      {sanc.status === 'en_attente' && (
                        <button
                          onClick={() => updateEducatorSanctionStatus(sanc.id, 'executee')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Valider exécution
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ÉLÈVES À SUIVRE & RELATIONS FAMILLES                                */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Élèves Nécessitant une Attention Particulière</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Détection automatique croisant l'assiduité, les retards, les sanctions et les alertes de décrochage.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">Élève & Classe</th>
                    <th className="py-3 px-3">Motif Principal</th>
                    <th className="py-3 px-3">Absences / Retards</th>
                    <th className="py-3 px-3 text-center">Niveau d'Urgence</th>
                    <th className="py-3 px-3">Action Recommandée IA</th>
                    <th className="py-3 px-3 text-right">Actions Rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {atRiskStudents.map(item => (
                    <tr key={item.student.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div>{item.student.firstName} {item.student.lastName}</div>
                        <div className="text-[10px] text-slate-400">{item.student.className} • {item.student.matricule}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-200">{item.primaryReason}</td>
                      <td className="py-3 px-3">
                        <span className="text-rose-400 font-bold">{item.recentAbsencesCount} abs.</span>
                        <span className="text-slate-400 text-[10px] block">{item.recentLatenessCount} retards</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          item.urgencyLevel === 'critique'
                            ? 'bg-rose-500 text-white'
                            : item.urgencyLevel === 'haute'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {item.urgencyLevel === 'critique' ? '🔴 Critique' : item.urgencyLevel === 'haute' ? '🟠 Haute' : '🟡 Modérée'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-xs">{item.recommendation}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setContactStudent(item.student);
                              setContactReason(`Point de situation sur l'assiduité (${item.recentAbsencesCount} abs.)`);
                              setIsContactModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1"
                            title="Contacter le responsable légal"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Contacter</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historique des Communications Parents */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Historique des Communications Récentes avec les Parents</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {parentContacts.map(pcon => (
                <div key={pcon.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{pcon.studentName}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                      {pcon.channel}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Tuteur : {pcon.guardianName} ({pcon.guardianPhone})</div>
                  <div className="text-slate-200">{pcon.reason}</div>
                  {pcon.notes && <div className="text-[10px] text-slate-500 pt-1 italic">{pcon.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BILAN & RAPPORT HEBDOMADAIRE IA                                    */}
      {/* ========================================================================= */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Daily Bilan Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg">
                  📊
                </div>
                <div>
                  <h3 className="text-base font-black text-white">BILAN QUOTIDIEN DE L’ÉDUCATEUR</h3>
                  <p className="text-xs text-slate-400">{dailySummary.date} • Activité consolidée</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Taux de réalisation</span>
                <span className="text-2xl font-black text-emerald-400">{dailySummary.executionRate}%</span>
              </div>
            </div>

            {/* 4 KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Activité</span>
                <div className="text-sm font-bold text-white">
                  {dailySummary.tasksCompleted} / {dailySummary.tasksPlanned} faites
                </div>
                <div className="text-[10px] text-amber-400">{dailySummary.tasksPostponed} reportées • {dailySummary.tasksNotDone} en retard</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Assiduité</span>
                <div className="text-sm font-bold text-white">{dailySummary.studentsAbsent} absents</div>
                <div className="text-[10px] text-rose-400">{dailySummary.unjustifiedAbsences} non justifiées • {dailySummary.latenesses} retards</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Discipline</span>
                <div className="text-sm font-bold text-white">{dailySummary.incidentsCount} incidents</div>
                <div className="text-[10px] text-emerald-400">{dailySummary.incidentsHandled} traités • {dailySummary.incidentsToFollow} à suivre</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Suivi & Familles</span>
                <div className="text-sm font-bold text-white">{dailySummary.studentsReceived} élèves reçus</div>
                <div className="text-[10px] text-cyan-400">{dailySummary.parentsContacted} parents contactés</div>
              </div>
            </div>

            {/* Tomorrow Priorities AI Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Priorités Recommandées pour Demain par l'IA :
                </h4>
              </div>

              <div className="space-y-2">
                {dailySummary.tomorrowPriorities.map((prio, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] flex items-center justify-center shrink-0 border border-amber-500/40">
                      {pIdx + 1}
                    </span>
                    <span>{prio}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Report & Trend Analysis Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white">RAPPORT HEBDOMADAIRE & ANALYSE DE TENDANCES</h3>
                <p className="text-xs text-slate-400">{weeklyReport.weekRange}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-950 text-purple-300 border border-purple-800">
                Analyse IA Hebdomadaire
              </span>
            </div>

            {/* Trend Alert Box */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
                <TrendingUp className="w-4 h-4" />
                <span>Tendance Détectée :</span>
              </div>
              <p className="text-xs text-slate-200">{weeklyReport.trendAnalysis}</p>
            </div>

            {/* AI Operational Recommendations */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Recommandations d'Action pour la Semaine Suivante :
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weeklyReport.aiRecommendations.map((rec, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-400 font-black">✓</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SUPERVISION DES ÉDUCATEURS (DIRECTION / CDE)                       */}
      {/* ========================================================================= */}
      {activeTab === 'supervision' && isEducatorSupervisor && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Supervision Opérationnelle des Éducateurs</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Vue d'ensemble en temps réel de tous les éducateurs : tâches prévues, réalisées, retards et alertes actives.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">Éducateur</th>
                    <th className="py-3 px-3">Secteur / Classes</th>
                    <th className="py-3 px-3 text-center">Tâches Prévues</th>
                    <th className="py-3 px-3 text-center">Réalisées</th>
                    <th className="py-3 px-3 text-center">En Retard</th>
                    <th className="py-3 px-3">Tâche en Cours</th>
                    <th className="py-3 px-3 text-center">Taux</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {supervisionTable.map(item => (
                    <tr key={item.educator.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">
                        <div>{item.educator.firstName} {item.educator.lastName}</div>
                        <div className="text-[10px] text-slate-400">{item.educator.email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {item.educator.id === 'u_educ' ? 'Collège (6e, 3e)' : 'Lycée (2nde, 1ère, Tle)'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-white">{item.totalTasks}</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">{item.completedTasks}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold ${item.overdueTasks > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {item.overdueTasks}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        <span className="font-semibold text-blue-300 block">{item.activeTaskTitle}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-black text-white">{item.executionRate}%</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setActiveEducatorId(item.educator.id);
                            setActiveSubTab('now');
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px]"
                        >
                          Examiner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: POSTPONE, NOTE, CUSTOM TASK, SANCTION, CONTACT                     */}
      {/* ========================================================================= */}

      {/* Postpone Modal */}
      {selectedTaskForPostpone && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Reporter la tâche</span>
              </h3>
              <button onClick={() => setSelectedTaskForPostpone(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Reporter <strong>« {selectedTaskForPostpone.title} »</strong> (actuellement prévue à {selectedTaskForPostpone.startTime}).
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: '+ 15 minutes', min: 15 },
                { label: '+ 30 minutes', min: 30 },
                { label: '+ 1 heure', min: 60 },
                { label: 'À demain', min: 1440 }
              ].map(opt => (
                <button
                  key={opt.min}
                  onClick={() => handlePostponeAction(selectedTaskForPostpone, opt.min)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs font-bold text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">Délai personnalisé (minutes) :</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={customPostponeMinutes}
                  onChange={(e) => setCustomPostponeMinutes(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={() => handlePostponeAction(selectedTaskForPostpone, customPostponeMinutes)}
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteTaskId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <StickyNote className="w-4 h-4 text-amber-400" />
                <span>Ajouter / Modifier une note</span>
              </h3>
              <button onClick={() => setNoteTaskId(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Précisions, constatations de surveillance, élèves observés..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setNoteTaskId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Task Modal */}
      {isCustomTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomTask} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Ajouter une tâche personnalisée</span>
              </h3>
              <button type="button" onClick={() => setIsCustomTaskModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de la tâche :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Accueil des parents de 3ème"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Consignes :</label>
                <textarea
                  rows={2}
                  value={customTaskDesc}
                  onChange={(e) => setCustomTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heure début :</label>
                  <input
                    type="time"
                    required
                    value={customTaskStart}
                    onChange={(e) => setCustomTaskStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heure fin :</label>
                  <input
                    type="time"
                    required
                    value={customTaskEnd}
                    onChange={(e) => setCustomTaskEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCustomTaskModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
              >
                Ajouter au planning
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sanction Modal */}
      {isSanctionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSanction} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Enregistrer une Mesure Disciplinaire</span>
              </h3>
              <button type="button" onClick={() => setIsSanctionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Élève concerné :</label>
                <select
                  value={sanctionStudentId}
                  onChange={(e) => setSanctionStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nature de la mesure :</label>
                <select
                  value={sanctionType}
                  onChange={(e) => setSanctionType(e.target.value as EducatorSanction['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="retenue">Heure de retenue</option>
                  <option value="avertissement">Avertissement écrit</option>
                  <option value="convocation">Convocation parentale</option>
                  <option value="exclusion_temporaire">Exclusion temporaire</option>
                  <option value="mesure_educative">Mesure éducative</option>
                  <option value="engagement">Contrat d’engagement moral</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motif précis :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Retards répétés sans justificatif"
                  value={sanctionReason}
                  onChange={(e) => setSanctionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Créneau ou modalité :</label>
                <input
                  type="text"
                  value={sanctionSchedule}
                  onChange={(e) => setSanctionSchedule(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSanctionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
              >
                Enregistrer la sanction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parent Contact Modal */}
      {isContactModalOpen && contactStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateParentContact} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Contacter le Responsable Légal</span>
              </h3>
              <button type="button" onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-white">{contactStudent.firstName} {contactStudent.lastName} ({contactStudent.className})</div>
              <div className="text-slate-300">Tuteur : <strong>{contactStudent.guardianName}</strong> ({contactStudent.guardianPhone})</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Canal de communication :</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['appel', 'sms', 'whatsapp'] as const).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setContactChannel(ch)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        contactChannel === ch ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Objet de la communication :</label>
                <textarea
                  rows={3}
                  required
                  value={contactReason}
                  onChange={(e) => setContactReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black"
              >
                Confirmer l'appel / message
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
