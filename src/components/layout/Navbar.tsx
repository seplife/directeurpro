import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  UserCheck,
  ChevronDown,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { school, academicYear, currentUser, switchUserRole, schoolHealth, alerts, setActiveTab, logout } = useApp();

  const criticalCount = alerts.filter(a => a.severity === 'critique' && a.status === 'active').length;

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    super_admin: { label: 'Super Admin SaaS', badge: 'bg-purple-900/50 text-purple-300 border-purple-700' },
    director: { label: 'Directeur Général', badge: 'bg-blue-900/50 text-blue-300 border-blue-700' },
    academic_director: { label: 'Directeur des Études', badge: 'bg-cyan-900/50 text-cyan-300 border-cyan-700' },
    counselor: { label: 'Éducateur / Surveillant', badge: 'bg-amber-900/50 text-amber-300 border-amber-700' },
    teacher: { label: 'Enseignant', badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700' },
    accountant: { label: 'Responsable Financier', badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700' },
    secretary: { label: 'Secrétariat', badge: 'bg-slate-800 text-slate-300 border-slate-700' },
    parent: { label: 'Parent d’élève', badge: 'bg-pink-900/50 text-pink-300 border-pink-700' },
    student: { label: 'Élève', badge: 'bg-indigo-900/50 text-indigo-300 border-indigo-700' }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: School Identity & Current Academic Year */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-lg">
            DP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight">{school.name}</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-brand-950/80 text-brand-400 border border-brand-800/60">
                {school.code}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{academicYear.name} • 2ème Trimestre</span>
              </span>
              <span>•</span>
              <span className="text-slate-400">{school.city}, {school.country}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: School Health Badge, Role Switcher, Alerts & Profile */}
      <div className="flex items-center space-x-4">
        {/* School Health Quick Indicator */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all ${
            schoolHealth.overall >= 80
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50'
              : schoolHealth.overall >= 60
              ? 'bg-amber-950/40 border-amber-800 text-amber-400 hover:bg-amber-900/50'
              : 'bg-rose-950/40 border-rose-800 text-rose-400 hover:bg-rose-900/50'
          }`}
          title="School Health Score global calculé par l'IA"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium">Health Score :</span>
          <span className="text-sm font-bold">{schoolHealth.overall}/100</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900/60">
            {schoolHealth.status}
          </span>
        </button>

        {/* Notifications & Active Alerts Button */}
        <button
          onClick={() => setActiveTab('vigilance')}
          className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Centre de Vigilance"
        >
          <Bell className="w-4 h-4" />
          {criticalCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {criticalCount}
            </span>
          )}
        </button>

        {/* Role Switcher (Interactive Demo & Security RBAC) */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-slate-200">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="text-[11px] text-slate-400">
              {roleLabels[currentUser.role]?.label || currentUser.role}
            </div>
          </div>

          <div className="relative">
            <select
              value={currentUser.role}
              onChange={(e) => switchUserRole(e.target.value as UserRole)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none font-medium hover:border-slate-600 transition-colors"
              title="Changer de rôle pour tester les vues et permissions"
            >
              <option value="director">👑 Directeur (Cockpit)</option>
              <option value="academic_director">📚 Directeur des Études</option>
              <option value="teacher">👨‍🏫 Enseignant</option>
              <option value="counselor">🛡️ Éducateur / Surveillant</option>
              <option value="accountant">💰 Responsable Financier</option>
              <option value="parent">👨‍👩‍👧 Parent d’élève</option>
              <option value="student">🎓 Élève</option>
              <option value="super_admin">⚡ Super Admin SaaS</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 transition-all"
            title="Se déconnecter / Changer d'établissement"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
