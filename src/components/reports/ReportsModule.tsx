import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  Printer,
  FileText,
  CheckCircle2,
  Calendar
} from 'lucide-react';
export const ReportsModule: React.FC = () => {
  const { school, academicYear, schoolHealth, students, budget, alerts } = useApp();
  const [selectedReportType, setSelectedReportType] = useState<string>('direction');
  const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);

  const reportTypes = [
    { id: 'direction', title: 'Bilan de Direction Trimestriel', desc: 'Synthèse 360° du School Health Score, priorités stratégiques et arbitrages.' },
    { id: 'pedagogique', title: 'Rapport Pédagogique & Réussite aux Examens', desc: 'Moyennes par niveau, prévisions BEPC/BAC et suivi des élèves à risque.' },
    { id: 'financier', title: 'Rapport de Trésorerie & Recouvrement Mobile Money', desc: 'Détail des encaissements, arriérés de scolarité et budget prévisionnel.' },
    { id: 'viescolaire', title: 'Rapport d’Assiduité & Climat Scolaire', desc: 'Statistiques d’absentéisme, retards récurrents et sanctions disciplinaires.' },
  ];

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(14, 142, 233);
    doc.text(`${school.name.toUpperCase()}`, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${school.city}, ${school.country} | ${academicYear.name}`, 14, 26);
    doc.text(`RAPPORT STRATÉGIQUE DE DIRECTION — GÉNÉRÉ PAR DIRECTEURPRO IA`, 14, 32);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`1. Indicateurs Majeurs (School Health Score : ${schoolHealth.overall}/100 - ${schoolHealth.status})`, 14, 44);

    const summaryData = [
      ['Dimension', 'Score /100', 'Tendance', 'Statut'],
      ['Pédagogie & Résultats', schoolHealth.dimensions.pedagogy.score.toString(), schoolHealth.dimensions.pedagogy.trend, 'Stable'],
      ['Assiduité Globale', schoolHealth.dimensions.attendance.score.toString(), schoolHealth.dimensions.attendance.trend, 'Excellent'],
      ['Discipline & Vie Scolaire', schoolHealth.dimensions.discipline.score.toString(), schoolHealth.dimensions.discipline.trend, 'Bon'],
      ['Finances & Recouvrement', `${budget.recoveryRate}%`, 'Suivi Mobile Money', 'En cours'],
      ['Ressources & Encadrement', schoolHealth.dimensions.resources.score.toString(), 'Stable', 'Conforme'],
      ['Communication Parents', schoolHealth.dimensions.communication.score.toString(), 'Active', 'Fluide']
    ];

    autoTable(doc, {
      startY: 50,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [14, 142, 233] },
      styles: { fontSize: 9 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("2. Recommandations Prioritaires de la Direction IA :", 14, finalY);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("• Maintenir le dispositif de tutorat hebdomadaire en Mathématiques pour la 3ème 2.", 14, finalY + 8);
    doc.text("• Accélérer la campagne de relance Mobile Money pour les 14.2M FCFA d'arriérés.", 14, finalY + 15);
    doc.text("• Convoquer les tuteurs légaux des 3 élèves en risque critique d'échec.", 14, finalY + 22);

    doc.text(`Fait à ${school.city}, le ${new Date().toLocaleDateString('fr-FR')}`, 130, finalY + 36);
    doc.text("M. Kouamé N’Guessan (Directeur)", 130, finalY + 42);

    doc.save(`Rapport_Direction_${academicYear.name.replace(/\s+/g, '_')}.pdf`);
    setIsExporting(null);
  };

  const handleExportExcel = async () => {
    setIsExporting('excel');
    const XLSX = await import('xlsx');

    const data = students.map(s => ({
      Matricule: s.matricule,
      Nom: s.lastName,
      Prenom: s.firstName,
      Classe: s.className,
      Moyenne: s.overallAverage,
      Rang: s.rank,
      Assiduite: `${s.attendanceRate}%`,
      AbsencesNonJustifiees: s.unjustifiedAbsencesCount,
      ScoreRisqueIA: s.riskScore,
      CategorieRisque: s.riskCategory
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eleves_DirecteurPro");
    XLSX.writeFile(wb, `Export_Eleves_${school.code}.xlsx`);
    setIsExporting(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>GÉNÉRATEUR DE BILANS & EXPORTS STRATÉGIQUES</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Rapports & Exports Décisionnels
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Génération automatisée des bilans trimestriels, rapports pour le conseil d’administration et exports de données certifiées aux formats PDF et Excel.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((rep) => {
          const isSelected = selectedReportType === rep.id;
          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-500 bg-brand-950/30 ring-2 ring-brand-500/20'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{rep.title}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                </div>
                <p className="text-xs text-slate-400">{rep.desc}</p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Période : 2ème Trimestre</span>
                <span className="text-brand-400 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prêt en 1 clic</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Download Action Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Télécharger le rapport sélectionné</h4>
          <p className="text-xs text-slate-400">Tous les calculs et graphiques sont certifiés par le moteur décisionnel.</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            disabled={isExporting !== null}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isExporting === 'excel' ? 'Génération en cours...' : 'Exporter Excel (.xlsx)'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting !== null}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting === 'pdf' ? 'Génération en cours...' : 'Télécharger PDF (.pdf)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
