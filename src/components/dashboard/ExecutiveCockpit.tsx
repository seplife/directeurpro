import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  GraduationCap,
  CalendarCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronRight,
  Zap,
  Activity,
  Flame
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { DirectorAssistantWidget } from '../directorAssistant/DirectorAssistantWidget';
import { EducatorAssistantWidget } from '../educatorAssistant/EducatorAssistantWidget';

export const ExecutiveCockpit: React.FC = () => {
  const {
    school,
    schoolHealth,
    dailyBrief,
    alerts,
    decisions,
    budget,
    students,
    classes,
    setActiveTab,
    acceptDecision,
    canAccessDirectorAssistant,
    canAccessEducatorAssistant,
    currentUser
  } = useApp();

  const criticalAlerts = alerts.filter(a => a.severity === 'critique' && a.status === 'active');
  const pendingDecisions = decisions.filter(d => d.status === 'pending_director');

  // Chart data for academic & recovery trends
  const trendData = [
    { month: 'Oct', Moyenne: 11.8, Assiduité: 94.2, Recouvrement: 45 },
    { month: 'Nov', Moyenne: 12.1, Assiduité: 95.0, Recouvrement: 60 },
    { month: 'Déc', Moyenne: 11.9, Assiduité: 93.8, Recouvrement: 68 },
    { month: 'Jan', Moyenne: 12.4, Assiduité: 96.1, Recouvrement: 72 },
    { month: 'Fév (Actuel)', Moyenne: 12.6, Assiduité: 95.8, Recouvrement: 75.4 },
    { month: 'Mar (Prévision IA)', Moyenne: 13.1, Assiduité: 96.5, Recouvrement: 86.0, isPrediction: true },
  ];

  const classPerformanceData = [
    { name: '6e 1', moy: 12.8, seuil: 10 },
    { name: '3e 1', moy: 11.4, seuil: 10 },
    { name: '3e 2', moy: 9.12, seuil: 10 },
    { name: '2nde A', moy: 12.2, seuil: 10 },
    { name: '2nde C', moy: 13.5, seuil: 10 },
    { name: '1ère D', moy: 11.9, seuil: 10 },
    { name: 'Tle D', moy: 10.8, seuil: 10 },
    { name: 'Tle C', moy: 14.8, seuil: 10 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER COCKPIT & DAILY INTELLIGENCE BRIEF */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950/70 to-slate-900 border border-brand-800/40 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>DAILY INTELLIGENCE BRIEF</span>
              </span>
              <span className="text-xs text-slate-400">{dailyBrief.date}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {dailyBrief.greeting}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Votre établissement fonctionne avec une régularité de <strong className="text-emerald-400">95.8% d’assiduité</strong> et <strong className="text-brand-300">93.4% de saisie des notes</strong>. Voici vos 3 priorités stratégiques aujourd’hui :
            </p>
          </div>

          {/* School Health Score Big Badge */}
          <div className="flex items-center space-x-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">School Health Score</span>
              <span className="text-2xl font-black text-white">{schoolHealth.overall}<span className="text-sm font-normal text-slate-400">/100</span></span>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-sm border shadow-lg ${
              schoolHealth.overall >= 80
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-emerald-500/20'
                : 'bg-amber-950/80 border-amber-500 text-amber-400 shadow-amber-500/20'
            }`}>
              {schoolHealth.status}
            </div>
          </div>
        </div>

        {/* 3 Top Priorities Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {dailyBrief.topPriorities.map((prio) => (
            <div
              key={prio.id}
              onClick={() => setActiveTab(prio.routeLink.replace('/', ''))}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                prio.urgency === 'critique'
                  ? 'bg-rose-950/30 border-rose-900/60 hover:border-rose-700'
                  : 'bg-slate-900/60 border-slate-800 hover:border-brand-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    prio.urgency === 'critique' ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Priorité #{prio.priorityNumber} • {prio.urgency.toUpperCase()}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-2">{prio.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{prio.suggestedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SCHOOL HEALTH SCORE 6-DIMENSION BREAKDOWN */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {Object.entries(schoolHealth.dimensions).map(([key, dim]) => (
          <div key={key} className="glass-card p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block truncate">{dim.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-white">{dim.score}<span className="text-xs font-normal text-slate-400">/100</span></span>
              <span className={`text-[11px] font-bold flex items-center ${
                dim.trend === 'up' ? 'text-emerald-400' : dim.trend === 'down' ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {dim.trend === 'up' ? '↗' : dim.trend === 'down' ? '↘' : '→'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  dim.score >= 85 ? 'bg-emerald-500' : dim.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${dim.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. STRATEGIC EXECUTIVE KPIS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Effectif Scolaire</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{students.length * 80 + 35}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">+4.8% <ArrowUpRight className="w-3 h-3 ml-0.5" /></span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{classes.length} classes actives de 6e à Tle</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Moyenne Générale</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">12.60<span className="text-xs text-slate-400">/20</span></span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">+0.20 <ArrowUpRight className="w-3 h-3 ml-0.5" /></span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Taux d’admission estimé : 82.4%</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Assiduité Globale</span>
            <CalendarCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">95.8%</span>
            <span className="text-xs text-emerald-400 font-bold">Stable</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">49 absences régularisées cette semaine</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Recouvrement Frais</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{budget.recoveryRate}%</span>
            <span className="text-xs text-rose-400 font-bold flex items-center">-2.1% <ArrowDownRight className="w-3 h-3 ml-0.5" /></span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Reste à recouvrer : {budget.totalOutstandingDebt.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      {/* 4. MAIN DECISIONAL GRID: DECISION PIPELINE & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Predictive Charts & Class Comparison */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart: Real vs AI Forecast */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-brand-400" />
                  <span>Trajectoire Pédagogique & Recouvrement (Observé vs Prévision IA)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Modèle prédictif croisant les évaluations de mi-trimestre et les échéances de scolarité
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-950 text-purple-300 border border-purple-800">
                Prévision IA +1 Mois
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorMoy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0e8ee9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0e8ee9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="Moyenne" stroke="#0e8ee9" strokeWidth={2} fillOpacity={1} fill="url(#colorMoy)" name="Moyenne (/20 × 5)" />
                  <Area type="monotone" dataKey="Recouvrement" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" name="Recouvrement (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Class Diagnostic Comparison */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Performance Comparée par Classe (Seuil d’admission : 10/20)</span>
              </h3>
              <button
                onClick={() => setActiveTab('pedagogy')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center"
              >
                Voir détails classes <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 20]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="moy" fill="#38aaf7" name="Moyenne de classe" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Urgent Decisions & Live Alerts */}
        <div className="space-y-6">
          {currentUser.role === 'counselor' ? (
            <EducatorAssistantWidget />
          ) : (
            <>
              {canAccessDirectorAssistant && <DirectorAssistantWidget />}
              {canAccessEducatorAssistant && currentUser.role !== 'director' && currentUser.role !== 'academic_director' && (
                <EducatorAssistantWidget />
              )}
            </>
          )}

          {/* Urgent AI Decisions Awaiting Director Validation */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <h3 className="text-sm font-bold text-white">Décisions en Attente</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {pendingDecisions.length} à valider
              </span>
            </div>

            {pendingDecisions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Toutes les décisions prioritaires ont été validées.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDecisions.map((dec) => (
                  <div key={dec.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{dec.problemTitle}</h4>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
                        {dec.confidenceScore}% conf.
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">{dec.rootCauseAnalysis}</p>

                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-brand-300 font-medium">
                      💡 <strong>Recommandation IA :</strong> {dec.options.find(o => o.id === dec.recommendedOptionId)?.title}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => acceptDecision(dec.id, dec.recommendedOptionId)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-md shadow-emerald-900/30"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valider l’Option</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('decisions')}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                        title="Examiner les options A, B, C"
                      >
                        Comparer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active AI Alerts Quick Glance */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Centre de Vigilance</span>
              </h3>
              <button
                onClick={() => setActiveTab('vigilance')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center"
              >
                Tout voir <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="space-y-2">
              {alerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => setActiveTab('vigilance')}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      alt.severity === 'critique' ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{alt.category}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{alt.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
