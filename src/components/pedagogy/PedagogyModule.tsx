import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, ClassLevel } from '../../types';
import {
  GraduationCap,
  Award,
  AlertTriangle,
  FileText,
  Download,
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const PedagogyModule: React.FC = () => {
  const { students, classes, subjects, updateStudentGrade, school } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(10);
  const [activeBulletinStudent, setActiveBulletinStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => {
    const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;
    const matchSearch =
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  const handleSaveGrade = (studentId: string) => {
    updateStudentGrade(studentId, editScore);
    setEditingStudentId(null);
  };

  const generatePDFBulletin = (student: Student) => {
    const doc = new jsPDF();
    
    // Header School
    doc.setFontSize(16);
    doc.setTextColor(14, 142, 233);
    doc.text(school.name.toUpperCase(), 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${school.address} - ${school.city}, ${school.country} | Tél : ${school.phone}`, 14, 26);
    doc.text("BULLETIN DE NOTES OFFICIEL - 2ÈME TRIMESTRE 2025-2026", 14, 32);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);

    // Student Info
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`Nom & Prénom : ${student.firstName} ${student.lastName}`, 14, 44);
    doc.text(`Matricule : ${student.matricule}`, 14, 50);
    doc.text(`Classe : ${student.className}`, 130, 44);
    doc.text(`Rang : ${student.rank}e sur ${student.totalClassStudents}`, 130, 50);

    // Grades Table
    const tableBody = subjects.map(sub => {
      const coef = sub.defaultCoefficient;
      const baseGrade = (student.overallAverage + (sub.category === 'scientifique' ? -0.5 : 0.5));
      const grade = Math.max(4, Math.min(20, Number(baseGrade.toFixed(2))));
      const totalPoints = (grade * coef).toFixed(2);
      const apprec = grade >= 16 ? 'Très Bien' : grade >= 14 ? 'Bien' : grade >= 10 ? 'Passable' : 'Insuffisant';

      return [sub.name, coef.toString(), grade.toFixed(2), totalPoints, apprec];
    });

    autoTable(doc, {
      startY: 56,
      head: [['Matières', 'Coef', 'Moyenne /20', 'Total Points', 'Appréciation']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [14, 142, 233] },
      styles: { fontSize: 9 }
    });

    // Summary Box
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(14, 142, 233);
    doc.text(`Moyenne Générale : ${student.overallAverage.toFixed(2)} / 20`, 14, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Assiduité : ${student.attendanceRate}% (${student.unjustifiedAbsencesCount} abs.)`, 14, finalY + 7);
    doc.text(`Décision du Conseil : ${student.overallAverage >= 10 ? 'Tableau d’honneur & Encouragements' : 'Avertissement de travail & Soutien requis'}`, 14, finalY + 14);

    doc.text("Le Chef d'Établissement", 140, finalY + 20);

    doc.save(`Bulletin_${student.lastName}_${student.firstName}.pdf`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>GESTION ACADÉMIQUE & BULLETINS</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Module Pédagogique
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Suivi des évaluations par classe, calcul automatique des moyennes pondérées selon les coefficients officiels (Côte d'Ivoire), scoring de risque élève et génération en 1 clic des bulletins PDF.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher élève ou matricule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">Toutes les classes ({classes.length})</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400">
          <strong className="text-white">{filteredStudents.length}</strong> élèves affichés
        </div>
      </div>

      {/* Student Academic Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Élève & Matricule</th>
                <th className="px-4 py-3">Classe</th>
                <th className="px-4 py-3">Moyenne Générale</th>
                <th className="px-4 py-3">Rang</th>
                <th className="px-4 py-3">Assiduité</th>
                <th className="px-4 py-3">Score de Risque IA</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{student.firstName} {student.lastName}</div>
                    <div className="text-[10px] text-slate-500">{student.matricule}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-300">{student.className}</td>
                  <td className="px-4 py-3">
                    {editingStudentId === student.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={editScore}
                          onChange={(e) => setEditScore(Number(e.target.value))}
                          className="w-16 bg-slate-950 border border-brand-500 rounded px-2 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleSaveGrade(student.id)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingStudentId(student.id);
                          setEditScore(student.overallAverage);
                        }}
                        className="cursor-pointer group flex items-center space-x-1.5"
                        title="Cliquer pour ajuster la note"
                      >
                        <span className={`font-black text-sm ${
                          student.overallAverage >= 14
                            ? 'text-emerald-400'
                            : student.overallAverage >= 10
                            ? 'text-brand-300'
                            : 'text-rose-400'
                        }`}>
                          {student.overallAverage.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500">/20</span>
                        {student.averageTrend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                        {student.averageTrend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-300">
                    {student.rank}<span className="text-[10px] text-slate-500">/{student.totalClassStudents}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${student.attendanceRate < 80 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {student.attendanceRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      student.riskCategory === 'critique'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : student.riskCategory === 'eleve'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : student.riskCategory === 'important'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {student.riskScore}/100 • {student.riskCategory}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => generatePDFBulletin(student)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-700/50 text-xs font-semibold inline-flex items-center space-x-1.5 transition-all"
                      title="Télécharger le bulletin PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Bulletin PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
