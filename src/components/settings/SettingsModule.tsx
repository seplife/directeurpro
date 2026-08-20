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
  FileCheck
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { school, subjects, auditLogs } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'etablissement' | 'coefficients' | 'saas' | 'audit'>('etablissement');

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
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs font-bold">
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
    </div>
  );
};
