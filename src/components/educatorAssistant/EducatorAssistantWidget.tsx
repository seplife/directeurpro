import React from 'react';
import { useEducatorAssistant } from '../../hooks/useEducatorAssistant';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  AlertTriangle,
  Users,
  BellRing
} from 'lucide-react';

export const EducatorAssistantWidget: React.FC = () => {
  const {
    now,
    activeTask,
    nextTask,
    overdueTasks,
    progress,
    completedCount,
    totalCount,
    minutesRemaining,
    contextAlerts,
    startEducatorTask,
    completeEducatorTask,
    setActiveTab,
    educatorSettings
  } = useEducatorAssistant();

  const activeAlerts = contextAlerts.filter(a => a.status === 'active');
  const criticalAlert = activeAlerts.find(a => a.severity === 'critique') || activeAlerts[0];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-800/40 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            🛡️
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {educatorSettings.assistantName}
              </h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-[10px] text-slate-400">
              {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • Vie Scolaire en direct
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('educator_assistant')}
          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center transition-colors"
        >
          Ouvrir <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Progression du jour :</span>
          <span className="font-bold text-amber-300">
            {completedCount} / {totalCount} tâches ({progress}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Active Task Card */}
      {activeTask ? (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>MAINTENANT ({activeTask.startTime} → {activeTask.endTime})</span>
            </span>
            <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{minutesRemaining} min rest.</span>
            </span>
          </div>

          <h4 className="text-xs font-bold text-white">{activeTask.title}</h4>
          <p className="text-[11px] text-slate-300 line-clamp-2">{activeTask.description}</p>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => completeEducatorTask(activeTask.id)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md shadow-emerald-900/30 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terminer</span>
            </button>
            <button
              onClick={() => setActiveTab('educator_assistant')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Détails
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <Clock className="w-4 h-4 text-slate-500 mx-auto" />
          <span>Aucune tâche programmée sur ce créneau horaire.</span>
        </div>
      )}

      {/* Next Task Preview */}
      {nextTask && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Prochaine tâche :</span>
            <span className="font-bold text-slate-200 truncate max-w-[150px]">{nextTask.title}</span>
          </div>
          <span className="font-mono text-amber-400 font-bold">{nextTask.startTime}</span>
        </div>
      )}

      {/* Contextual Alert Banner */}
      {criticalAlert && (
        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <span className="font-bold text-rose-300 block">{criticalAlert.title}</span>
            <span className="text-slate-300 line-clamp-1">{criticalAlert.recommendation}</span>
          </div>
        </div>
      )}

      {/* Overdue alert indicator */}
      {overdueTasks.length > 0 && (
        <div className="flex items-center justify-between text-[11px] text-rose-400 font-bold bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-900/40">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{overdueTasks.length} tâche(s) en retard</span>
          </span>
          <button
            onClick={() => setActiveTab('educator_assistant')}
            className="text-xs text-rose-300 underline font-semibold"
          >
            Régulariser
          </button>
        </div>
      )}
    </div>
  );
};
