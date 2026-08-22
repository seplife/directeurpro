import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Smartphone,
  UserX,
  GraduationCap,
  Check,
  ChevronDown,
  Activity,
  Calendar
} from 'lucide-react';

export const AutomationControlBar: React.FC = () => {
  const {
    simulatedTime,
    setSimulatedTime,
    triggerSimulatedPayment,
    triggerSimulatedStudentAbsence,
    triggerSimulatedTeacherAbsence,
    triggerFullSchoolDayAutomation,
    resetToDefaultData,
    schoolHealth
  } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const presetTimes = [
    { label: '06h45 • Accueil', value: '06:45' },
    { label: '07h15 • Retards', value: '07:15' },
    { label: '07h35 • Absences', value: '07:35' },
    { label: '10h05 • Récréation', value: '10:05' },
    { label: '14h05 • Reprise', value: '14:05' },
    { label: '16h45 • Bilan Quotidien', value: '16:45' }
  ];

  return (
    <div className="mb-6 relative z-30">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-amber-500/60 shadow-2xl text-xs font-bold text-white flex items-center space-x-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Automation Hub Title & Virtual Time Indicator */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Zap className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  MOTEUR D'AUTOMATISATION & SIMULATION IA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Temps Réel Actif
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Horloge active :{' '}
                  <strong className="text-amber-300 font-mono">
                    {simulatedTime || 'Heure Système Réelle (' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ')'}
                  </strong>
                </span>
                {simulatedTime && (
                  <button
                    onClick={() => {
                      setSimulatedTime(null);
                      showNotification('Horloge réinitialisée sur l’heure système.');
                    }}
                    className="text-[10px] text-rose-400 underline font-semibold hover:text-rose-300 ml-1"
                  >
                    (Réinitialiser)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Center / Right: Quick Trigger Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Quick Time Shift Dropdown / Buttons */}
            <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500 px-2 hidden lg:inline">
                Saut Temporel :
              </span>
              {presetTimes.map((pt) => {
                const isActive = simulatedTime === pt.value;
                return (
                  <button
                    key={pt.value}
                    onClick={() => {
                      setSimulatedTime(pt.value);
                      showNotification(`Horloge positionnée à ${pt.label}`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {pt.value}
                  </button>
                );
              })}
            </div>

            {/* Simulated Event Triggers */}
            <button
              onClick={() => {
                triggerSimulatedPayment();
                showNotification('⚡ Paiement Mobile Money Wave/Orange Money encaissé (+100 000 FCFA)');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Simuler un paiement Mobile Money instantané"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+Paiement MM</span>
            </button>

            <button
              onClick={() => {
                triggerSimulatedStudentAbsence();
                showNotification('⚡ Absence élève signalée + Alerte contextuelle générée');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-700/60 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Signaler une absence et générer une alerte Éducateur"
            >
              <UserX className="w-3.5 h-3.5 text-rose-400" />
              <span>+Absence Élève</span>
            </button>

            <button
              onClick={() => {
                triggerSimulatedTeacherAbsence();
                showNotification('⚡ Absence enseignant détectée + Remplacement proposé');
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Simuler l'absence d'un professeur et une substitution automatique"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>+Absence Prof</span>
            </button>

            <button
              onClick={() => {
                triggerFullSchoolDayAutomation();
                showNotification('🤖 Cycle IA complet exécuté avec succès !');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-brand-500/20 transition-all"
              title="Exécuter un cycle complet d'automatisation"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cycle IA Complet</span>
            </button>

            <button
              onClick={() => {
                resetToDefaultData();
                showNotification('Données et état réinitialisés.');
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
              title="Réinitialiser les données"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
