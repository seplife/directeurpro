import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Sliders,
  ShieldCheck,
  CreditCard,
  Check,
  Sparkles,
  Lock,
  FileCheck,
  Bot
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const {
    school,
    subjects,
    auditLogs,
    canAccessDirectorAssistant,
    assistantSettings,
    updateAssistantSettings,
    canAccessEducatorAssistant,
    educatorSettings,
    updateEducatorSettings
  } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'etablissement' | 'coefficients' | 'saas' | 'audit' | 'assistant' | 'educator_assistant'>('etablissement');

  const saasPlans = [
    {
      name: 'Starter',
      price: '45 000 FCFA / mois',
      desc: 'Gestion scolaire essentielle, notes et présences.',
      features: ['Jusqu’à 300 élèves', 'Notes & Bulletins PDF', 'Gestion des absences', 'Support standard'],
      current: false
    },
    {
      name: 'Professional',
      price: '95 000 FCFA / mois',
      desc: 'Gestion scolaire + Analytics avancés et Trésorerie Mobile Money.',
      features: ['Élèves illimités', 'Paiements Mobile Money', 'Tableaux de bord BI', 'Emploi du temps'],
      current: false
    },
    {
      name: 'Intelligent (Plan Actuel)',
      price: '190 000 FCFA / mois',
      desc: 'Gestion + Analytics + Intelligence Décisionnelle & Directeur IA Copilot.',
      features: [
        'School Health Score en direct',
        '12 Agents IA spécialisés',
        'Centre de Vigilance & Alertes 🔴',
        'Centre de Décision & Suivi d’impact',
        'Directeur IA Copilot conversationnel'
      ],
      current: true
    },
    {
      name: 'Enterprise',
      price: 'Sur devis',
      desc: 'IA avancée + Simulateur What-If illimité, API & Multi-campus.',
      features: ['Multi-établissements consolidé', 'API ouverte & Webhooks', 'Modèles IA dédiés', 'Account manager dédié'],
      current: false
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
            <Settings className="w-3.5 h-3.5" />
            <span>CONFIGURATION & GOUVERNANCE</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Paramètres & Abonnements SaaS
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Configuration des référentiels pédagogiques, abonnements SaaS et traçabilité complète des opérations d'intelligence artificielle.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('etablissement')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'etablissement' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Établissement & Coordonnées
        </button>

        <button
          onClick={() => setActiveSubTab('coefficients')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'coefficients' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Coefficients & Référentiels
        </button>

        <button
          onClick={() => setActiveSubTab('saas')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'saas' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Abonnement SaaS
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'audit' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Journal d'Audit IA ({auditLogs.length})
        </button>

        {canAccessDirectorAssistant && (
          <button
            onClick={() => setActiveSubTab('assistant')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'assistant' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Assistant DE</span>
          </button>
        )}

        {canAccessEducatorAssistant && (
          <button
            onClick={() => setActiveSubTab('educator_assistant')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'educator_assistant' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Assistant Éducateur+</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeSubTab === 'etablissement' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white">Identité de l'Établissement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nom de l'établissement :</label>
              <input
                type="text"
                readOnly
                value={school.name}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Code Établissement :</label>
              <input
                type="text"
                readOnly
                value={school.code}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-brand-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Ville & Pays :</label>
              <input
                type="text"
                readOnly
                value={`${school.city}, ${school.country}`}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Devise de gestion :</label>
              <input
                type="text"
                readOnly
                value={school.currency}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'coefficients' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Coefficients par Matière (Référentiel National Côte d'Ivoire)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {subjects.map(sub => (
              <div key={sub.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-brand-400 font-mono font-bold">{sub.code}</span>
                <h4 className="text-xs font-bold text-white">{sub.name}</h4>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Coefficient :</span>
                  <span className="font-black text-brand-300 bg-brand-950 px-2 py-0.5 rounded border border-brand-800">
                    Coef {sub.defaultCoefficient}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'saas' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {saasPlans.map((plan, pIdx) => (
            <div
              key={pIdx}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                plan.current
                  ? 'border-brand-500 bg-brand-950/40 ring-2 ring-brand-500/30'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-white">{plan.name}</h4>
                  {plan.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-500 text-white uppercase">
                      Actif
                    </span>
                  )}
                </div>

                <div className="text-sm font-black text-brand-300">{plan.price}</div>
                <p className="text-xs text-slate-400">{plan.desc}</p>

                <div className="space-y-1.5 pt-2">
                  {plan.features.map((f, fIdx) => (
                    <div key={fIdx} className="text-[11px] text-slate-300 flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={plan.current}
                className={`mt-6 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  plan.current
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20'
                }`}
              >
                {plan.current ? 'Plan en cours' : 'Choisir ce plan'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'audit' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-brand-400" />
            <span>Journal d'Audit IA & Traçabilité des Raisonnements</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Horodatage</th>
                  <th className="px-4 py-3">Agent IA</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Opération / Requête</th>
                  <th className="px-4 py-3">Données Consultées</th>
                  <th className="px-4 py-3">Confiance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-300">{log.agentName}</td>
                    <td className="px-4 py-3 text-slate-300">{log.userName}</td>
                    <td className="px-4 py-3 text-white max-w-xs truncate">{log.queryOrAction}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                        {log.dataEntitiesAccessed.join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{log.confidenceScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeSubTab === 'assistant' && canAccessDirectorAssistant && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Bot className="w-4 h-4 text-brand-400" />
              <span>Réglages de l'Assistant DE</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Personnalisez le comportement des rappels et alertes de l'agent de pilotage pédagogique.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nom de l'assistant :</label>
              <input
                type="text"
                value={assistantSettings.assistantName}
                onChange={(e) => updateAssistantSettings({ assistantName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Début de journée :</label>
                <input
                  type="time"
                  value={assistantSettings.dayStartTime}
                  onChange={(e) => updateAssistantSettings({ dayStartTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fin de journée :</label>
                <input
                  type="time"
                  value={assistantSettings.dayEndTime}
                  onChange={(e) => updateAssistantSettings({ dayEndTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rappel avant tâche (min) :</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={assistantSettings.remindBeforeTaskMinutes}
                  onChange={(e) => updateAssistantSettings({ remindBeforeTaskMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rappel intermédiaire (min) :</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={assistantSettings.intermediateReminderDelayMinutes}
                  onChange={(e) => updateAssistantSettings({ intermediateReminderDelayMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alerte urgente après (min) :</label>
                <input
                  type="number"
                  min={0}
                  max={180}
                  value={assistantSettings.overdueAlertDelayMinutes}
                  onChange={(e) => updateAssistantSettings({ overdueAlertDelayMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Jours ouvrables du chronogramme :</label>
              <div className="flex items-center space-x-2">
                {[
                  { day: 1, label: 'Lun' },
                  { day: 2, label: 'Mar' },
                  { day: 3, label: 'Mer' },
                  { day: 4, label: 'Jeu' },
                  { day: 5, label: 'Ven' },
                  { day: 6, label: 'Sam' },
                  { day: 7, label: 'Dim' }
                ].map(({ day, label }) => {
                  const isActive = assistantSettings.activeDaysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const next = isActive
                          ? assistantSettings.activeDaysOfWeek.filter(d => d !== day)
                          : [...assistantSettings.activeDaysOfWeek, day].sort();
                        updateAssistantSettings({ activeDaysOfWeek: next });
                      }}
                      className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all ${
                        isActive ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Notifications de l'assistant</span>
                <span className="text-[11px] text-slate-500">Activer les rappels normaux, intermédiaires et alertes.</span>
              </div>
              <button
                type="button"
                onClick={() => updateAssistantSettings({ notificationsEnabled: !assistantSettings.notificationsEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  assistantSettings.notificationsEnabled ? 'bg-brand-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    assistantSettings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Éducateur+ Settings */}
      {activeSubTab === 'educator_assistant' && canAccessEducatorAssistant && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-800/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 space-y-6 max-w-2xl">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase">Paramètres : {educatorSettings.assistantName}</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nom personnalisé de l'assistant :</label>
              <input
                type="text"
                value={educatorSettings.assistantName}
                onChange={(e) => updateEducatorSettings({ assistantName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prise de service (Début) :</label>
                <input
                  type="time"
                  value={educatorSettings.dayStartTime}
                  onChange={(e) => updateEducatorSettings({ dayStartTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fin de journée :</label>
                <input
                  type="time"
                  value={educatorSettings.dayEndTime}
                  onChange={(e) => updateEducatorSettings({ dayEndTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rappel avant tâche (min) :</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={educatorSettings.remindBeforeTaskMinutes}
                  onChange={(e) => updateEducatorSettings({ remindBeforeTaskMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rappel fin de créneau (min) :</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={educatorSettings.intermediateReminderDelayMinutes}
                  onChange={(e) => updateEducatorSettings({ intermediateReminderDelayMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alerte retard après (min) :</label>
                <input
                  type="number"
                  min={0}
                  max={180}
                  value={educatorSettings.overdueAlertDelayMinutes}
                  onChange={(e) => updateEducatorSettings({ overdueAlertDelayMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Jours actifs de la vie scolaire :</label>
              <div className="flex items-center space-x-2">
                {[
                  { day: 1, label: 'Lun' },
                  { day: 2, label: 'Mar' },
                  { day: 3, label: 'Mer' },
                  { day: 4, label: 'Jeu' },
                  { day: 5, label: 'Ven' },
                  { day: 6, label: 'Sam' },
                  { day: 7, label: 'Dim' }
                ].map(({ day, label }) => {
                  const isActive = educatorSettings.activeDaysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const next = isActive
                          ? educatorSettings.activeDaysOfWeek.filter(d => d !== day)
                          : [...educatorSettings.activeDaysOfWeek, day].sort();
                        updateEducatorSettings({ activeDaysOfWeek: next });
                      }}
                      className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all ${
                        isActive ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Notifications intelligentes & Anti-spam</span>
                <span className="text-[11px] text-slate-500">Rappels de début, fin de créneau et alertes sans répétition excessive.</span>
              </div>
              <button
                type="button"
                onClick={() => updateEducatorSettings({ notificationsEnabled: !educatorSettings.notificationsEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  educatorSettings.notificationsEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    educatorSettings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
