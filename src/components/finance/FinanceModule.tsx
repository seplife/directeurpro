import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';
import {
  Wallet,
  DollarSign,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Plus,
  Download,
  AlertCircle,
  CreditCard,
  Building
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const { budget, payments, students, recordPayment, school } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New payment form state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState(150000);
  const [paymentMethod, setPaymentMethod] = useState<Payment['paymentMethod']>('wave');
  const [feeType, setFeeType] = useState<Payment['feeType']>('scolarite');
  const [transactionRef, setTransactionRef] = useState('');

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    recordPayment({
      schoolId: school.id,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      className: st.className,
      amount: Number(amount),
      paymentMethod,
      feeType,
      transactionReference: transactionRef || `MM-CI-${Math.floor(100000 + Math.random() * 900000)}`,
      collectedBy: 'Mme Esther Tanoh (Comptable)'
    });

    setIsModalOpen(false);
    setTransactionRef('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>SANTÉ FINANCIÈRE & TRÉSORERIE</span>
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Finances & Recouvrement
          </h2>
          <p className="text-xs text-slate-300">
            Encaissements Mobile Money (Wave, Orange Money, MTN MoMo, Moov) et suivi de la trésorerie en FCFA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Paiement</span>
        </button>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Budget Prévu (2025-2026)</span>
          <div className="mt-2 text-xl font-black text-white">
            {budget.totalExpectedRevenue.toLocaleString('fr-FR')} <span className="text-xs text-slate-400">FCFA</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Objectif global de scolarité</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recouvrement Réalisé</span>
          <div className="mt-2 text-xl font-black text-emerald-400">
            {budget.totalCollectedRevenue.toLocaleString('fr-FR')} <span className="text-xs text-slate-400">FCFA</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Taux : {budget.recoveryRate}%</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Arriérés / Impayés</span>
          <div className="mt-2 text-xl font-black text-rose-400">
            {budget.totalOutstandingDebt.toLocaleString('fr-FR')} <span className="text-xs text-slate-400">FCFA</span>
          </div>
          <span className="text-[10px] text-rose-400 font-semibold mt-1 block">37 dossiers à relancer</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Health Score Financier</span>
          <div className="mt-2 text-xl font-black text-brand-300">
            {budget.financialHealthScore} <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] text-brand-400 font-medium mt-1 block">Trésorerie équilibrée</span>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-3 p-5">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-brand-400" />
          <span>Derniers Encaissements & Règlements Sécurisés</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">N° Reçu</th>
                <th className="px-4 py-3">Élève & Classe</th>
                <th className="px-4 py-3">Moyen de Paiement</th>
                <th className="px-4 py-3">Motif</th>
                <th className="px-4 py-3">Montant (FCFA)</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {payments.map((p) => {
                const methodBadges: Record<string, { label: string; bg: string }> = {
                  wave: { label: 'Wave Money', bg: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
                  orange_money: { label: 'Orange Money', bg: 'bg-orange-950 text-orange-300 border-orange-800' },
                  mtn_momo: { label: 'MTN MoMo', bg: 'bg-yellow-950 text-yellow-300 border-yellow-800' },
                  moov_money: { label: 'Moov Money', bg: 'bg-blue-950 text-blue-300 border-blue-800' },
                  especes: { label: 'Espèces', bg: 'bg-slate-800 text-slate-300 border-slate-700' },
                  virement: { label: 'Virement', bg: 'bg-purple-950 text-purple-300 border-purple-800' }
                };

                const method = methodBadges[p.paymentMethod] || { label: p.paymentMethod, bg: 'bg-slate-800' };

                return (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-400">{p.receiptNumber}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.studentName}</div>
                      <div className="text-[10px] text-slate-500">{p.className}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${method.bg}`}>
                        {method.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-300">{p.feeType}</td>
                    <td className="px-4 py-3 font-black text-emerald-400">{p.amount.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(p.paymentDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Validé
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSavePayment} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Enregistrer un Règlement</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Élève bénéficiaire :</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.className})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Montant à encaisser (FCFA) :</label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Moyen de paiement :</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="wave">Wave Mobile Money</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="mtn_momo">MTN Mobile Money</option>
                  <option value="moov_money">Moov Money</option>
                  <option value="especes">Paiement Espèces (Caisse)</option>
                  <option value="virement">Virement Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Type de frais :</label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="scolarite">Frais de Scolarité / Tranche</option>
                  <option value="inscription">Droit d'Inscription</option>
                  <option value="cantine">Cantine & Restauration</option>
                  <option value="transport">Transport Scolaire</option>
                  <option value="examen">Frais d'examen (BEPC / BAC)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Référence Transaction (facultatif) :</label>
                <input
                  type="text"
                  placeholder="Ex : WAVE-CI-4899120"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                Valider l'Encaissement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
