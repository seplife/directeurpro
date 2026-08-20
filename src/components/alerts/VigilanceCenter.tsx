import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertSeverity } from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  UserCheck,
  Sparkles,
  ArrowRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { ParentCommunicationAgent } from '../../services/ai/agents/parentCommunicationAgent';

export const VigilanceCenter: React.FC = () => {
  const { alerts, students, resolveAlert, logAIOperation, setActiveTab } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalMessage, setActiveModalMessage] = useState<{ title: string; content: string } | null>(null);

  const filteredAlerts = alerts.filter(a => {
    const matchSev = selectedSeverity === 'all' || a.severity === selectedSeverity;
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    return matchSev && matchCat;
  });

  const handleGenerateSMS = (alertId: string) => {
    const targetStudent = students[0]; // demo student
    const draft = ParentCommunicationAgent.generateMessageForStudent(targetStudent, 'baisse_notes');
    setActiveModalMessage({
      title: `Brouillon de message diplomatique (${draft.channel.toUpperCase()})`,
      content: draft.content
    });
    logAIOperation('ParentCommunicationAgent', `Génération de communication diplomatique pour ${targetStudent.firstName}`, ['Student', 'Grades'], draft.diplomaticToneScore);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SURVEILLANCE CONTINUE</span>
            </span>
            <span className="text-xs text-slate-400">Détection d'anomalies en temps réel</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Centre de Vigilance IA
          </h2>
          <p className="text-xs text-slate-300">
            Chaque signalement est vérifié par nos algorithmes explicables avec identification des causes racines et propositions d’actions directes.
          </p>
        </div>

        {/* Severity counts pill */}
        <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2 rounded-xl">
          <button
            onClick={() => setSelectedSeverity('critique')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              selectedSeverity === 'critique' ? 'bg-rose-600 text-white shadow-lg' : 'text-rose-400 hover:bg-slate-900'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>🔴 {alerts.filter(a => a.severity === 'critique').length} Critiques</span>
          </button>

          <button
            onClick={() => setSelectedSeverity('important')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              selectedSeverity === 'important' ? 'bg-amber-600 text-white shadow-lg' : 'text-amber-400 hover:bg-slate-900'
            }`}
          >
            <span>🟠 {alerts.filter(a => a.severity === 'important').length} Importantes</span>
          </button>

          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSeverity === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            Toutes ({alerts.length})
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-panel p-6 rounded-2xl border transition-all ${
              alert.severity === 'critique'
                ? 'border-rose-900/60 bg-rose-950/10 hover:border-rose-700'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Main Content */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                    alert.severity === 'critique'
                      ? 'bg-rose-500 text-white'
                      : alert.severity === 'important'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {alert.severity}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 uppercase">
                    {alert.category}
                  </span>

                  <span className="text-xs text-slate-400">
                    Détecté le {new Date(alert.detectedAt).toLocaleDateString('fr-FR')} à {new Date(alert.detectedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <span className="text-xs font-bold text-brand-400 ml-auto flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Confiance IA : {alert.confidenceLevel}%</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{alert.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                </div>

                {/* Explainable AI Data Metric Context */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                    <span>Données observées & Causes racines identifiées :</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Indicateur :</span>
                      <strong className="text-brand-300">{alert.dataContext.metric}</strong> = <span className="text-white font-bold">{alert.dataContext.currentValue}</span>
                    </div>

                    {alert.dataContext.affectedEntities && (
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Élèves / Entités concernées :</span>
                        <span className="text-amber-300 font-semibold">{alert.dataContext.affectedEntities.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-1 pt-1">
                    {alert.rootCauses.map((cause, cIdx) => (
                      <li key={cIdx} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Sidebar on Card */}
              <div className="lg:w-64 flex flex-col space-y-2 pt-2 lg:pt-0 lg:border-l lg:border-slate-800 lg:pl-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions Recommandées</span>

                <button
                  onClick={() => setActiveTab('decisions')}
                  className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-brand-600/20"
                >
                  <span>Ouvrir la Décision IA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleGenerateSMS(alert.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5 text-brand-400" />
                  <span>Rédiger SMS diplomatique</span>
                </button>

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marquer comme traité</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diplomatic Message Preview Modal */}
      {activeModalMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>{activeModalMessage.title}</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {activeModalMessage.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Charte éthique : Validation humaine requise avant envoi</span>
              <span className="text-emerald-400 font-bold">Diplomatie : 96%</span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setActiveModalMessage(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  alert('Message validé et programmé pour envoi sécurisé !');
                  setActiveModalMessage(null);
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30"
              >
                Valider & Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
