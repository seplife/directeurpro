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
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';

interface TimelineEntry {
  date: string;
  type: 'retard' | 'absence' | 'observation' | 'entretien' | 'amelioration' | 'felicitations';
  title: string;
  detail: string;
  author: string;
}

const BASE_TIMELINE: TimelineEntry[] = [
  { date: '18 Fév 2026', type: 'retard', title: 'Retard de 20 min (Cours de Maths)', detail: 'Arrivé à 07h50 sans billet d’entrée vie scolaire.', author: 'M. Soro (Éducateur)' },
  { date: '12 Fév 2026', type: 'absence', title: 'Absence 4h non justifiée', detail: 'Absent lors des 2 séances de Physique-Chimie du matin.', author: 'Vie Scolaire' },
  { date: '28 Jan 2026', type: 'entretien', title: 'Entretien de cadrage avec la Direction', detail: 'Signature d’un contrat moral d’engagement en présence du tuteur légal.', author: 'M. Kouamé (Directeur)' },
  { date: '15 Jan 2026', type: 'observation', title: 'Bavardages répétés et oubli de matériel', detail: 'Rappel à l’ordre en cours de Français.', author: 'M. Koffi (Professeur)' },
  { date: '10 Déc 2025', type: 'amelioration', title: 'Amélioration de la ponctualité', detail: 'Deux semaines complètes sans retard constaté.', author: 'Vie Scolaire' }
];

const ENTRY_TYPE_LABELS: Record<TimelineEntry['type'], string> = {
  retard: 'Retard',
  absence: 'Absence',
  observation: 'Observation',
  entretien: 'Entretien',
  amelioration: 'Amélioration',
  felicitations: 'Félicitations'
};

export const AttendanceModule: React.FC = () => {
  const { students, currentUser } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std_01');

  // Per-student timeline entries added live during this session, keyed by student id
  const [addedEntriesByStudent, setAddedEntriesByStudent] = useState<Record<string, TimelineEntry[]>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEntryType, setNewEntryType] = useState<TimelineEntry['type']>('observation');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryDetail, setNewEntryDetail] = useState('');
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Base sample timeline for student, combined with any entries added live in this session
  const studentTimeline: TimelineEntry[] = [
    ...(addedEntriesByStudent[selectedStudent.id] || []),
    ...BASE_TIMELINE
  ];

  const handleOpenForm = () => {
    setNewEntryType('observation');
    setNewEntryTitle('');
    setNewEntryDetail('');
    setIsFormOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryTitle.trim()) return;

    const entry: TimelineEntry = {
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: newEntryType,
      title: newEntryTitle.trim(),
      detail: newEntryDetail.trim() || 'Aucun détail complémentaire renseigné.',
      author: `${currentUser.firstName} ${currentUser.lastName}`
    };

    setAddedEntriesByStudent(prev => ({
      ...prev,
      [selectedStudent.id]: [entry, ...(prev[selectedStudent.id] || [])]
    }));

    setIsFormOpen(false);
    setConfirmation(`Fait marquant enregistré pour ${selectedStudent.firstName} ${selectedStudent.lastName}.`);
    setTimeout(() => setConfirmation(null), 3500);
  };

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
              onClick={handleOpenForm}
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

      {/* Confirmation Toast */}
      {confirmation && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4" />
          <span>{confirmation}</span>
        </div>
      )}

      {/* Add Timeline Entry Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEntry} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-brand-400" />
                <span>Ajouter un fait marquant</span>
              </h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Pour <strong className="text-slate-200">{selectedStudent.firstName} {selectedStudent.lastName}</strong> ({selectedStudent.className})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Type d'événement :</label>
                <select
                  value={newEntryType}
                  onChange={(e) => setNewEntryType(e.target.value as TimelineEntry['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {Object.entries(ENTRY_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Retard de 15 min sans justificatif"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Détail (facultatif) :</label>
                <textarea
                  rows={3}
                  placeholder="Précisions, contexte, personnes impliquées..."
                  value={newEntryDetail}
                  onChange={(e) => setNewEntryDetail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
