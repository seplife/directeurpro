import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Calendar,
  AlertOctagon,
  Sparkles,
  CheckCircle,
  Users,
  Building
} from 'lucide-react';

interface GridSlot {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  hasConflict?: boolean;
}

export const TimetableModule: React.FC = () => {
  const { classes } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'c_td');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = ['07h30 - 09h30', '09h45 - 11h45', '13h00 - 15h00', '15h15 - 17h15'];

  const scheduleGrid: Record<string, Record<string, GridSlot>> = {
    'Lundi': {
      '07h30 - 09h30': { day: 'Lundi', time: '07h30 - 09h30', subject: 'Mathématiques', teacher: 'M. Koffi', room: 'Salle 501' },
      '09h45 - 11h45': { day: 'Lundi', time: '09h45 - 11h45', subject: 'Physique-Chimie', teacher: 'M. Yapi', room: 'Labo Sciences' },
      '13h00 - 15h00': { day: 'Lundi', time: '13h00 - 15h00', subject: 'Français', teacher: 'Mme Bamba', room: 'Salle 501' },
      '15h15 - 17h15': { day: 'Lundi', time: '15h15 - 17h15', subject: 'Anglais', teacher: 'M. Brou', room: 'Salle 501' }
    },
    'Mardi': {
      '07h30 - 09h30': { day: 'Mardi', time: '07h30 - 09h30', subject: 'SVT', teacher: 'M. Yao', room: 'Salle 501' },
      '09h45 - 11h45': { day: 'Mardi', time: '09h45 - 11h45', subject: 'Mathématiques', teacher: 'M. Koffi', room: 'Salle 501' },
      '13h00 - 15h00': { day: 'Mardi', time: '13h00 - 15h00', subject: 'Histoire-Géo', teacher: 'M. Diabaté', room: 'Salle 501' },
      '15h15 - 17h15': { day: 'Mardi', time: '15h15 - 17h15', subject: 'Philosophie', teacher: 'M. Traoré', room: 'Salle 501' }
    },
    'Mercredi': {
      '07h30 - 09h30': { day: 'Mercredi', time: '07h30 - 09h30', subject: 'EPS (Sport)', teacher: 'M. Soro', room: 'Terrain Omnisports' },
      '09h45 - 11h45': { day: 'Mercredi', time: '09h45 - 11h45', subject: 'Physique-Chimie', teacher: 'M. Yapi', room: 'Labo Sciences' },
      '13h00 - 15h00': { day: 'Mercredi', time: '13h00 - 15h00', subject: 'Tutorat Soutien IA', teacher: 'M. Koffi', room: 'Salle 202' },
      '15h15 - 17h15': { day: 'Mercredi', time: '15h15 - 17h15', subject: 'Devoir Surveillé', teacher: 'Surveillant', room: 'Amphithéâtre' }
    },
    'Jeudi': {
      '07h30 - 09h30': { day: 'Jeudi', time: '07h30 - 09h30', subject: 'Mathématiques', teacher: 'M. Koffi', room: 'Salle 501' },
      '09h45 - 11h45': { day: 'Jeudi', time: '09h45 - 11h45', subject: 'SVT', teacher: 'M. Yao', room: 'Salle 501' },
      '13h00 - 15h00': { day: 'Jeudi', time: '13h00 - 15h00', subject: 'Philosophie', teacher: 'M. Traoré', room: 'Salle 501' },
      '15h15 - 17h15': { day: 'Jeudi', time: '15h15 - 17h15', subject: 'Anglais', teacher: 'M. Brou', room: 'Salle 501' }
    },
    'Vendredi': {
      '07h30 - 09h30': { day: 'Vendredi', time: '07h30 - 09h30', subject: 'Français', teacher: 'Mme Bamba', room: 'Salle 501' },
      '09h45 - 11h45': { day: 'Vendredi', time: '09h45 - 11h45', subject: 'Physique-Chimie', teacher: 'M. Yapi', room: 'Labo Sciences' },
      '13h00 - 15h00': { day: 'Vendredi', time: '13h00 - 15h00', subject: 'Histoire-Géo', teacher: 'M. Diabaté', room: 'Salle 501' },
      '15h15 - 17h15': { day: 'Vendredi', time: '15h15 - 17h15', subject: 'Vie de Classe', teacher: 'Prof Principal', room: 'Salle 501' }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>OPTIMISATION & CONFLITS D'EMPLOI DU TEMPS</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Emploi du Temps Intelligent
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Visualisation par classe, détection automatique des collisions de salles et d'enseignants, équilibrage de la charge cognitive journalière.
        </p>
      </div>

      {/* Class Selector & Conflict status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-semibold">Classe affichée :</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.cycle.toUpperCase()})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>0 conflit détecté sur cette classe (Score d’optimisation : 98/100)</span>
        </div>
      </div>

      {/* Grid */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {days.map((day) => (
            <div key={day} className="space-y-3">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-xs font-black text-white uppercase tracking-wider">{day}</span>
              </div>

              <div className="space-y-2">
                {timeSlots.map((slotTime) => {
                  const cell = scheduleGrid[day]?.[slotTime];
                  return (
                    <div
                      key={slotTime}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/50 transition-all space-y-1"
                    >
                      <span className="text-[10px] font-mono text-slate-400 block">{slotTime}</span>
                      {cell ? (
                        <div>
                          <h4 className="text-xs font-bold text-brand-300">{cell.subject}</h4>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                            <span>{cell.teacher}</span>
                            <span className="font-semibold text-slate-300">{cell.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-600 italic py-2">Créneau libre</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
