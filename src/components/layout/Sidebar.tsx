import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  AlertTriangle,
  GitPullRequest,
  MessageSquareCode,
  Sliders,
  GraduationCap,
  CalendarCheck,
  Wallet,
  Clock,
  FileSpreadsheet,
  Settings,
  Sparkles,
  ShieldCheck,
  Users
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, decisions, currentUser } = useApp();

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const pendingDecisionsCount = decisions.filter(d => d.status === 'pending_director').length;

  const navItems = [
    {
      group: 'INTELLIGENCE DÉCISIONNELLE',
      items: [
        { id: 'dashboard', label: 'Cockpit Directeur', icon: LayoutDashboard, badge: 'IA' },
        { id: 'vigilance', label: 'Centre de Vigilance', icon: AlertTriangle, count: activeAlertsCount, countColor: 'bg-rose-500 text-white' },
        { id: 'decisions', label: 'Décisions IA', icon: GitPullRequest, count: pendingDecisionsCount, countColor: 'bg-amber-500 text-slate-950 font-bold' },
        { id: 'copilot', label: 'Directeur IA Copilot', icon: MessageSquareCode, badge: 'Live' },
        { id: 'simulator', label: 'Simulateur What-If', icon: Sliders, badge: 'Prévision' },
      ]
    },
    {
      group: 'GESTION OPÉRATIONNELLE',
      items: [
        { id: 'pedagogy', label: 'Pédagogie & Bulletins', icon: GraduationCap },
        { id: 'attendance', label: 'Assiduité & Vie Scolaire', icon: CalendarCheck },
        { id: 'finance', label: 'Finances & Recouvrement', icon: Wallet },
        { id: 'timetable', label: 'Emploi du Temps', icon: Clock },
        { id: 'reports', label: 'Rapports & Exports', icon: FileSpreadsheet },
      ]
    },
    {
      group: 'SYSTÈME & GOUVERNANCE',
      items: [
        { id: 'settings', label: 'Paramètres & SaaS', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between py-4 select-none min-h-[calc(100vh-4rem)]">
      <div className="space-y-6 px-3">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.group}
            </div>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          isActive ? 'bg-white/20 text-white' : 'bg-brand-950 text-brand-400 border border-brand-800/50'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.countColor || 'bg-slate-700 text-white'}`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Tenant isolation badge */}
      <div className="px-4 pt-4 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="truncate">
            <span className="font-semibold text-slate-300 block truncate">RLS Multi-Tenant Actif</span>
            <span className="text-[10px] text-slate-400">Tenant : school_abidjan_01</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
