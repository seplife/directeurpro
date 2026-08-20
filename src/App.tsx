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

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/80">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
