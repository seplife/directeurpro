import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Award
} from 'lucide-react';

export const DecisionCenter: React.FC = () => {
  const { decisions, acceptDecision, rejectDecision } = useApp();
  const [selectedOptionByDecision, setSelectedOptionByDecision] = useState<Record<string, string>>({});
  const [notesByDecision, setNotesByDecision] = useState<Record<string, string>>({});

  const handleSelectOption = (decisionId: string, optionId: string) => {
    setSelectedOptionByDecision(prev => ({ ...prev, [decisionId]: optionId }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1">
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>ARBITRAGE STRATÉGIQUE & HUMAN-IN-THE-LOOP</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Centre de Décision IA
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          L’IA analyse les données, modélise plusieurs options avec coûts et impacts prévisionnels, et soumet la décision finale au Directeur. Les résultats après action sont mesurés pour enrichir l’apprentissage de l’établissement.
        </p>
      </div>

      {/* Decisions List */}
      <div className="space-y-6">
        {decisions.map((decision) => {
          const currentChosenOption = selectedOptionByDecision[decision.id] || decision.chosenOptionId || decision.recommendedOptionId;
          const isPending = decision.status === 'pending_director';
          const isAccepted = decision.status === 'accepted';

          return (
            <div
              key={decision.id}
              className={`glass-panel rounded-2xl border p-6 space-y-5 transition-all ${
                isPending
                  ? 'border-brand-500/40 bg-slate-900/90 shadow-xl'
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              {/* Header problem & status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      decision.status === 'pending_director'
                        ? 'bg-amber-500 text-slate-950'
                        : decision.status === 'accepted'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {decision.status === 'pending_director' ? 'En Attente de Validation' : decision.status.toUpperCase()}
                    </span>

                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Domaine : {decision.domain}
                    </span>

                    <span className="text-xs text-brand-400 font-semibold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Indice de confiance : {decision.confidenceScore}%</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white">{decision.problemTitle}</h3>
                  <p className="text-xs text-slate-300">{decision.problemSummary}</p>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-auto bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Urgence :</span>
                  <span className="text-sm font-black text-amber-400">{decision.urgencyScore}/10</span>
                </div>
              </div>

              {/* Data & Root Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    📊 Données Utilisées pour le Diagnostic
                  </span>
                  <ul className="space-y-0.5 text-slate-300">
                    {decision.dataPointsUsed.map((dp, idx) => (
                      <li key={idx}>• {dp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    🔍 Analyse des Facteurs Déterminants
                  </span>
                  <p className="text-slate-300">{decision.rootCauseAnalysis}</p>
                </div>
              </div>

              {/* Multi-Option Comparison Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Options Décisionnelles Comparées par l'IA :
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {decision.options.map((option) => {
                    const isSelected = currentChosenOption === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => isPending && handleSelectOption(decision.id, option.id)}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-500 bg-brand-950/30 ring-2 ring-brand-500/20'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {option.isRecommended && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                                <Award className="w-3 h-3" />
                                <span>Recommandé IA</span>
                              </span>
                            )}
                            <div className="text-[10px] font-bold text-slate-400 ml-auto">
                              Impact : <span className="text-brand-300 font-bold">{option.expectedImpactScore}/10</span>
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-white leading-tight">{option.title}</h4>
                          <p className="text-[11px] text-slate-400">{option.description}</p>

                          {/* Pros & Cons */}
                          <div className="space-y-1 text-[11px] pt-1">
                            <div className="text-emerald-400">
                              {option.pros.map((p, i) => (
                                <div key={i} className="flex items-start space-x-1">
                                  <span>+</span>
                                  <span>{p}</span>
                                </div>
                              ))}
                            </div>
                            {option.cons.length > 0 && (
                              <div className="text-rose-400">
                                {option.cons.map((c, i) => (
                                  <div key={i} className="flex items-start space-x-1">
                                    <span>-</span>
                                    <span>{c}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer cost & time */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Délai : <strong className="text-slate-200">{option.implementationTime}</strong></span>
                          {option.estimatedCostFcfa !== undefined && (
                            <span className="text-amber-400 font-bold">
                              {option.estimatedCostFcfa > 0 ? `${option.estimatedCostFcfa.toLocaleString('fr-FR')} FCFA` : 'Gratuit'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons for Pending Decisions */}
              {isPending && (
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Notes ou directives complémentaires du Directeur..."
                    value={notesByDecision[decision.id] || ''}
                    onChange={(e) => setNotesByDecision(prev => ({ ...prev, [decision.id]: e.target.value }))}
                    className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => rejectDecision(decision.id, notesByDecision[decision.id])}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Refuser</span>
                    </button>

                    <button
                      onClick={() => acceptDecision(decision.id, currentChosenOption, notesByDecision[decision.id])}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Valider l’Option Sélectionnée</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Post-Action Impact Measurement (When decision has been implemented) */}
              {decision.impactResultSummary && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Mesure d’Impact Réel Post-Action :</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Mesuré le {new Date(decision.impactMeasuredAt || '').toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Indicateur :</span>
                      <span className="font-semibold text-slate-200">{decision.impactMetricName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Avant intervention :</span>
                      <span className="font-bold text-rose-400">{decision.beforeMetricValue}/20</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Après 6 semaines :</span>
                      <span className="font-bold text-emerald-400">{decision.afterMetricValue}/20</span>
                    </div>

                    <div className="bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700 text-emerald-300 font-extrabold">
                      Gain : +{(Number(decision.afterMetricValue) - Number(decision.beforeMetricValue)).toFixed(2)} pts
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 pt-1">{decision.impactResultSummary}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
