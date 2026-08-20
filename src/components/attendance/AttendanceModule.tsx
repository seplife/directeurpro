import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  Sparkles,
  Plus
} from 'lucide-react';

interface TimelineEntry {
  date: string;
  type: 'retard' | 'absence' | 'observation' | 'entretien' | 'amelioration' | 'felicitations';
  title: string;
  detail: string;
  author: string;
}

export const AttendanceModule: React.FC = () => {
  const { students } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std_01');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Realistic sample timeline for student
  const studentTimeline: TimelineEntry[] = [
    { date: '18 Fév 2026', type: 'retard', title: 'Retard de 20 min (Cours de Maths)', detail: 'Arrivé à 07h50 sans billet d’entrée vie scolaire.', author: 'M. Soro (Éducateur)' },
    { date: '12 Fév 2026', type: 'absence', title: 'Absence 4h non justifiée', detail: 'Absent lors des 2 séances de Physique-Chimie du matin.', author: 'Vie Scolaire' },
    { date: '28 Jan 2026', type: 'entretien', title: 'Entretien de cadrage avec la Direction', detail: 'Signature d’un contrat moral d’engagement en présence du tuteur légal.', author: 'M. Kouamé (Directeur)' },
    { date: '15 Jan 2026', type: 'observation', title: 'Bavardages répétés et oubli de matériel', detail: 'Rappel à l’ordre en cours de Français.', author: 'M. Koffi (Professeur)' },
    { date: '10 Déc 2025', type: 'amelioration', title: 'Amélioration de la ponctualité', detail: 'Deux semaines complètes sans retard constaté.', author: 'Vie Scolaire' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>ASSIDUITÉ & CLIMAT SCOLAIRE</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Assiduité & Vie Scolaire
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Registre d’appel en temps réel, indicateur d’assiduité continu (Séances présentes / Séances prévues) et historique éducatif complet par élève sous forme de Timeline interactive.
        </p>
      </div>

      {/* Main Grid: Student Selector & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student List with Attendance indicator */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Sélection de l’Élève :
          </h3>

          <div className="space-y-2">
            {students.map((st) => {
              const isSelected = selectedStudent.id === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-950/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{st.firstName} {st.lastName}</div>
                      <div className="text-[10px] text-slate-400">{st.className} • {st.matricule}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-extrabold ${st.attendanceRate < 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {st.attendanceRate}%
                      </span>
                      <span className="text-[10px] text-slate-500 block">{st.unjustifiedAbsencesCount} abs.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns (2/3): Student Life Timeline */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">
                  Timeline Éducative : {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                  {selectedStudent.className}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tuteur : <strong className="text-slate-200">{selectedStudent.guardianName}</strong> ({selectedStudent.guardianPhone})
              </p>
            </div>

            <button
              onClick={() => alert('Ouverture du formulaire d’enregistrement d’incident / entretien.')}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un fait marquant</span>
            </button>
          </div>

          {/* Timeline visualization */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {studentTimeline.map((item, idx) => {
              const badgeColors: Record<string, string> = {
                retard: 'bg-amber-500 text-slate-950',
                absence: 'bg-rose-500 text-white',
                observation: 'bg-blue-500 text-white',
                entretien: 'bg-purple-500 text-white',
                amelioration: 'bg-emerald-500 text-white',
                felicitations: 'bg-emerald-500 text-white'
              };

              return (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-brand-500" />

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${badgeColors[item.type] || 'bg-slate-700'}`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300">{item.detail}</p>
                    <div className="text-[10px] text-slate-500 pt-1">Rapporté par : {item.author}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
