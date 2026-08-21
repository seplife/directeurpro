import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatIfScenario } from '../../types';
import {
  Sliders,
  TrendingUp,
  Sparkles,
  DollarSign,
  Users,
  GraduationCap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Save
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { whatIfScenarios, addWhatIfScenario } = useApp();

  // Dynamic interactive simulation state
  const [teachersCount, setTeachersCount] = useState<number>(2);
  const [supportHours, setSupportHours] = useState<number>(2);
  const [tuitionAdjustmentPercent, setTuitionAdjustmentPercent] = useState<number>(0);
  const [studentGrowthPercent, setStudentGrowthPercent] = useState<number>(8);

  // Dynamic calculated projections
  const currentBaseStudents = 420;
  const currentAvgTuitionFcfa = 350000;
  const teacherMonthlyCostFcfa = 400000;

  const simulatedStudents = Math.round(currentBaseStudents * (1 + studentGrowthPercent / 100));
  const addedStudents = simulatedStudents - currentBaseStudents;
  const newTuition = Math.round(currentAvgTuitionFcfa * (1 + tuitionAdjustmentPercent / 100));
  
  const additionalGrossRevenue = (simulatedStudents * newTuition) - (currentBaseStudents * currentAvgTuitionFcfa);
  const additionalTeacherCost = teachersCount * teacherMonthlyCostFcfa * 9; // 9 months academic year
  const supportSessionsCost = supportHours * 60 * 7500; // 60 sessions @ 7500 FCFA
  const totalAdditionalCost = additionalTeacherCost + supportSessionsCost;
  const netFinancialGain = additionalGrossRevenue - totalAdditionalCost;

  const basePassRate = 78.4;
  const projectedPassRate = Math.min(96.0, Number((basePassRate + teachersCount * 4.2 + supportHours * 2.8).toFixed(1)));
  const passRateDelta = (projectedPassRate - basePassRate).toFixed(1);

  const [savedConfirmation, setSavedConfirmation] = useState(false);

  const handleSaveScenario = () => {
    const scenario: WhatIfScenario = {
      id: `scen_${Date.now()}`,
      title: `Scénario : +${teachersCount} enseignant(s), +${supportHours}h soutien, ${studentGrowthPercent >= 0 ? '+' : ''}${studentGrowthPercent}% effectifs`,
      category: teachersCount > 0 ? 'recrutement' : supportHours > 0 ? 'soutien_pedagogique' : tuitionAdjustmentPercent !== 0 ? 'frais_scolaires' : 'effectifs',
      parameters: {
        teachersCount,
        supportHours,
        tuitionAdjustmentPercent,
        studentGrowthPercent
      },
      projectedOutcomes: [
        {
          metric: 'Taux de réussite',
          currentValue: `${basePassRate}%`,
          projectedValue: `${projectedPassRate}%`,
          delta: `+${passRateDelta}%`,
          trend: 'positive'
        },
        {
          metric: 'Résultat net',
          currentValue: '0 FCFA',
          projectedValue: `${netFinancialGain.toLocaleString('fr-FR')} FCFA`,
          delta: netFinancialGain >= 0 ? 'Positif' : 'Négatif',
          trend: netFinancialGain >= 0 ? 'positive' : 'negative'
        },
        {
          metric: 'Effectif projeté',
          currentValue: `${currentBaseStudents}`,
          projectedValue: `${simulatedStudents}`,
          delta: `+${addedStudents}`,
          trend: 'neutral'
        }
      ],
      assumptions: ['Effectifs stabilisés', 'Recouvrement standard', `Année académique de 9 mois`],
      aiAnalysis: netFinancialGain >= 0
        ? `Scénario viable : gain net de ${netFinancialGain.toLocaleString('fr-FR')} FCFA et +${passRateDelta} points de réussite.`
        : `Scénario en déficit de ${Math.abs(netFinancialGain).toLocaleString('fr-FR')} FCFA : à ajuster avant validation.`
    };

    addWhatIfScenario(scenario);
    setSavedConfirmation(true);
    setTimeout(() => setSavedConfirmation(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>MOTEUR PROSPECTIF & SIMULATION STRATÉGIQUE</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Simulateur « What-If »
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Modélisez en temps réel l'impact organisationnel, pédagogique et financier de vos décisions avant de les engager (recrutements, soutien, ajustements tarifaires, croissance des effectifs).
        </p>
      </div>

      {/* Interactive Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders & Variables */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-brand-400" />
              <span>Paramètres du Scénario</span>
            </h3>
            <button
              onClick={() => {
                setTeachersCount(2);
                setSupportHours(2);
                setTuitionAdjustmentPercent(0);
                setStudentGrowthPercent(8);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              title="Réinitialiser"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Enseignants assistants */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Recrutement enseignants</span>
              <span className="font-extrabold text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-800">
                +{teachersCount} enseignant(s)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={teachersCount}
              onChange={(e) => setTeachersCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <span className="text-[10px] text-slate-400 block">400 000 FCFA / mois / enseignant</span>
          </div>

          {/* Slider 2: Heures de soutien hebdomadaires */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Heures de soutien / semaine</span>
              <span className="font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {supportHours} h / semaine
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={supportHours}
              onChange={(e) => setSupportHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] text-slate-400 block">Groupes de remédiation en Mathématiques & Sciences</span>
          </div>

          {/* Slider 3: Croissance des effectifs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Projection de nouveaux élèves</span>
              <span className="font-extrabold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                +{studentGrowthPercent}% ({addedStudents} élèves)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={studentGrowthPercent}
              onChange={(e) => setStudentGrowthPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-[10px] text-slate-400 block">Effectif projeté : {simulatedStudents} élèves</span>
          </div>

          {/* Slider 4: Ajustement des frais */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Ajustement écolage (%)</span>
              <span className="font-extrabold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                {tuitionAdjustmentPercent > 0 ? `+${tuitionAdjustmentPercent}%` : `${tuitionAdjustmentPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={tuitionAdjustmentPercent}
              onChange={(e) => setTuitionAdjustmentPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] text-slate-400 block">Nouveau tarif annuel : {newTuition.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        {/* Right Columns (2/3): Projected Results & Decision Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Projections Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Taux de Réussite Projeté</span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white">{projectedPassRate}%</span>
                <span className="text-xs text-emerald-400 font-bold">+{passRateDelta}%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Taux de base : {basePassRate}%</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Coût Annuel Additionnel</span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-rose-400">{totalAdditionalCost.toLocaleString('fr-FR')}</span>
                <span className="text-xs text-slate-400">FCFA</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Salaires + vacations</span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Résultat Net Projeté</span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className={`text-2xl font-black ${netFinancialGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netFinancialGain >= 0 ? `+${netFinancialGain.toLocaleString('fr-FR')}` : netFinancialGain.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs text-slate-400">FCFA</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {netFinancialGain >= 0 ? 'Rentabilité positive (ROI assuré)' : 'Investissement en déficit'}
              </span>
            </div>
          </div>

          {/* AI Synthesis Box */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-800/50 bg-brand-950/20 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Analyse & Recommandation Stratégique IA
              </h4>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {netFinancialGain >= 0
                ? `Ce scénario combine une hausse substantielle du taux de réussite académique (+${passRateDelta} points) avec un gain financier net de ${netFinancialGain.toLocaleString('fr-FR')} FCFA. L'accroissement des effectifs de ${addedStudents} élèves amortit intégralement le coût des ${teachersCount} nouveaux enseignants et du programme de soutien.`
                : `Attention : ce scénario engendre un déficit opérationnel net de ${Math.abs(netFinancialGain).toLocaleString('fr-FR')} FCFA. Pour le viabiliser, envisagez un léger ajustement des frais d'écolage (+3 à +5%) ou un ciblage du soutien sur les seuls élèves en difficulté critique.`}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-brand-900/60 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 block">Confiance du modèle : <strong className="text-white">92%</strong></span>
                <span className="text-slate-400 block">Hypothèses : <strong className="text-slate-300">Effectifs stabilisés & recouvrement standard</strong></span>
              </div>

              <button
                onClick={handleSaveScenario}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-brand-600/30 transition-all self-start sm:self-auto"
              >
                {savedConfirmation ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedConfirmation ? 'Scénario enregistré !' : 'Enregistrer ce scénario'}</span>
              </button>
            </div>
          </div>

          {/* Preconfigured Scenarios Reference List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Scénarios Stratégiques Archivés :
            </h4>

            {whatIfScenarios.map((scen) => (
              <div key={scen.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white">{scen.title}</h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {scen.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-xs">
                  {scen.projectedOutcomes.slice(0, 3).map((out, i) => (
                    <div key={i} className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block truncate">{out.metric}</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-bold text-white">{out.projectedValue}</span>
                        <span className={`text-[10px] font-bold ${out.trend === 'positive' ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {out.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
