import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveCockpit } from './components/dashboard/ExecutiveCockpit';
import { VigilanceCenter } from './components/alerts/VigilanceCenter';
import { DecisionCenter } from './components/decisions/DecisionCenter';
import { CopilotChat } from './components/copilot/CopilotChat';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { PedagogyModule } from './components/pedagogy/PedagogyModule';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { TimetableModule } from './components/timetable/TimetableModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { AssistantModule } from './components/directorAssistant/AssistantModule';
import { EducatorAssistantModule } from './components/educatorAssistant/EducatorAssistantModule';
import { AuthModule } from './components/auth/AuthModule';
import { AutomationControlBar } from './components/common/AutomationControlBar';
import { ShieldAlert } from 'lucide-react';

const RestrictedAccess: React.FC<{ message?: string }> = ({ message }) => (
  <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-3 max-w-lg mx-auto mt-10">
    <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
    <h3 className="text-sm font-bold text-white">Accès restreint</h3>
    <p className="text-xs text-slate-400">
      {message || 'Ce module est réservé aux rôles autorisés de la plateforme.'}
    </p>
  </div>
);

const MainLayout: React.FC = () => {
  const { activeTab, canAccessDirectorAssistant, canAccessEducatorAssistant } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/80">
          <div className="max-w-7xl mx-auto">
            <AutomationControlBar />
            {activeTab === 'dashboard' && <ExecutiveCockpit />}
            {activeTab === 'vigilance' && <VigilanceCenter />}
            {activeTab === 'decisions' && <DecisionCenter />}
            {activeTab === 'copilot' && <CopilotChat />}
            {activeTab === 'simulator' && <WhatIfSimulator />}
            {activeTab === 'pedagogy' && <PedagogyModule />}
            {activeTab === 'attendance' && <AttendanceModule />}
            {activeTab === 'finance' && <FinanceModule />}
            {activeTab === 'timetable' && <TimetableModule />}
            {activeTab === 'reports' && <ReportsModule />}
            {activeTab === 'settings' && <SettingsModule />}
            {activeTab === 'assistant' && (
              canAccessDirectorAssistant ? (
                <AssistantModule />
              ) : (
                <RestrictedAccess message="L’Assistant du Directeur des Études est réservé au Directeur des Études, au Directeur et aux administrateurs." />
              )
            )}
            {activeTab === 'educator_assistant' && (
              canAccessEducatorAssistant ? (
                <EducatorAssistantModule />
              ) : (
                <RestrictedAccess message="L’Assistant Éducateur+ est réservé aux éducateurs, surveillants généraux et à la direction." />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthModule />;
  }

  return <MainLayout />;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
