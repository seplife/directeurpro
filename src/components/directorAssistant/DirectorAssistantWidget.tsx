import React from 'react';
import { useDirectorAssistant } from '../../hooks/useDirectorAssistant';
import { Bot, CheckCircle2, Clock, ChevronRight, AlertTriangle, PlayCircle } from 'lucide-react';

export const DirectorAssistantWidget: React.FC = () => {
  const { activeTask, nextTask, overdueTasks, progress, completedCount, totalCount, minutesRemaining, isSchoolDay, completeTask, startTask, setActiveTab, assistantSettings } =
    useDirectorAssistant();

  if (!isSchoolDay) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">{assistantSettings.assistantName}</h3>
        </div>
        <p className="text-xs text-slate-400">Aucun chronogramme aujourd’hui (jour non ouvrable ou hors calendrier scolaire).</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Assistant DE — Aujourd’hui</h3>
        </div>
        <button
          onClick={() => setActiveTab('assistant')}
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center"
        >
          Ouvrir <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Active task */}
      {activeTask ? (
        <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-500 text-white flex items-center space-x-1">
              <PlayCircle className="w-3 h-3" />
              <span>En cours</span>
            </span>
            <span className="text-[11px] text-slate-400">{activeTask.startTime} → {activeTask.endTime}</span>
          </div>
          <h4 className="text-xs font-bold text-white">{activeTask.title}</h4>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Temps restant : <strong className="text-slate-200">{minutesRemaining} min</strong></span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => completeTask(activeTask.id)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terminé</span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
            >
              Détails
            </button>
          </div>
        </div>
      ) : nextTask ? (
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Prochaine tâche</span>
            </span>
            <span className="text-[11px] text-slate-400">{nextTask.startTime} → {nextTask.endTime}</span>
          </div>
          <h4 className="text-xs font-bold text-white">{nextTask.title}</h4>
          <button
            onClick={() => startTask(nextTask.id)}
            className="w-full py-1.5 px-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px]"
          >
            Démarrer maintenant
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Chronogramme du jour terminé. Bon travail !</span>
        </div>
      )}

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <button
          onClick={() => setActiveTab('assistant')}
          className="w-full p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/60 text-rose-300 text-[11px] font-semibold flex items-center justify-between"
        >
          <span className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{overdueTasks.length} tâche(s) en retard</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Progression de la journée</span>
          <span className="font-bold text-slate-200">{completedCount}/{totalCount} tâches ({progress}%)</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${progress >= 70 ? 'bg-emerald-500' : progress >= 40 ? 'bg-amber-500' : 'bg-brand-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
