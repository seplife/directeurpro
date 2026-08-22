import { DirectorAssistantSettings, DirectorTask, DirectorTaskCategory, DirectorTaskChecklistItem, DirectorTaskPriority } from '../../types';

/**
 * ChronogramService
 * -------------------
 * Owns the *template* of the Director of Studies' typical school day and
 * turns it into concrete, dated DirectorTask records for a given day.
 *
 * This is intentionally a pure, stateless service: given a date + settings,
 * it deterministically produces the same chronogram. Persistence and status
 * transitions (start / complete / postpone) live in AppContext, not here.
 */

interface TaskTemplateItem {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  priority: DirectorTaskPriority;
  category: DirectorTaskCategory;
  checklist: string[];
}

const DEFAULT_TEMPLATE: TaskTemplateItem[] = [
  {
    title: 'Préparation de la journée',
    description: "Prendre connaissance des événements du jour, des absences déclarées et des priorités laissées la veille.",
    startTime: '06:45',
    endTime: '07:00',
    priority: 'haute',
    category: 'preparation',
    checklist: ['Consulter les priorités de la veille', 'Vérifier les absences enseignants déclarées', 'Vérifier le calendrier du jour']
  },
  {
    title: 'Contrôle du démarrage des cours',
    description: 'Vérifier que tous les enseignants et toutes les classes ont bien démarré à l’heure.',
    startTime: '07:00',
    endTime: '07:15',
    priority: 'critique',
    category: 'attendance',
    checklist: ['Enseignants présents', 'Classes effectivement prises en charge', 'Retards signalés', 'Salles indisponibles', 'Démarrage effectif des cours']
  },
  {
    title: 'Gestion des absences et retards des enseignants',
    description: 'Traiter les absences déclarées ou constatées et organiser les remplacements nécessaires.',
    startTime: '07:15',
    endTime: '07:30',
    priority: 'critique',
    category: 'attendance',
    checklist: ['Identifier les cours non couverts', 'Trouver un remplaçant si possible', 'Notifier la vie scolaire']
  },
  {
    title: 'Première tournée de supervision',
    description: 'Passage dans les classes et couloirs pour observer le climat scolaire général.',
    startTime: '07:30',
    endTime: '08:30',
    priority: 'haute',
    category: 'supervision',
    checklist: ['Climat de classe', 'Discipline générale', 'Respect des horaires']
  },
  {
    title: 'Traitement des urgences',
    description: 'Créneau réservé au traitement des urgences remontées depuis le début de matinée.',
    startTime: '08:30',
    endTime: '09:00',
    priority: 'critique',
    category: 'administration',
    checklist: ['Urgences pédagogiques', 'Urgences disciplinaires', 'Urgences familiales / parents']
  },
  {
    title: 'Suivi pédagogique',
    description: 'Contrôle des cahiers de textes, des progressions et des cours effectivement dispensés.',
    startTime: '09:00',
    endTime: '10:00',
    priority: 'haute',
    category: 'pedagogy',
    checklist: ['Cahiers de textes', 'Progression des enseignants', 'Cours effectivement dispensés', 'Difficultés pédagogiques remontées']
  },
  {
    title: 'Point rapide / actualisation',
    description: 'Courte pause de recentrage : messages, notifications, ajustement du planning restant.',
    startTime: '10:00',
    endTime: '10:15',
    priority: 'moyenne',
    category: 'administration',
    checklist: ['Messages en attente', 'Réajustement du planning du jour']
  },
  {
    title: 'Observation pédagogique',
    description: 'Observation en classe d’un ou plusieurs enseignants dans le cadre du suivi qualité.',
    startTime: '10:15',
    endTime: '11:30',
    priority: 'haute',
    category: 'pedagogy',
    checklist: ['Grille d’observation remplie', 'Retour prévu avec l’enseignant']
  },
  {
    title: 'Suivi des élèves en difficulté',
    description: 'Traitement individualisé des élèves signalés à risque académique ou disciplinaire.',
    startTime: '11:30',
    endTime: '12:15',
    priority: 'haute',
    category: 'students',
    checklist: ['Consulter la liste des élèves à risque', 'Contacter les familles si nécessaire', 'Planifier un entretien']
  },
  {
    title: 'Bilan de la matinée',
    description: 'Synthèse rapide de la matinée avant la pause : ce qui a été fait, ce qui reste à traiter.',
    startTime: '12:15',
    endTime: '13:00',
    priority: 'haute',
    category: 'reporting',
    checklist: ['Tâches réalisées', 'Points en attente pour l’après-midi']
  },
  {
    title: 'Pause / organisation',
    description: 'Pause déjeuner et organisation personnelle.',
    startTime: '13:00',
    endTime: '14:00',
    priority: 'faible',
    category: 'administration',
    checklist: []
  },
  {
    title: 'Supervision de l’après-midi',
    description: 'Nouvelle tournée de supervision pour la reprise des cours de l’après-midi.',
    startTime: '14:00',
    endTime: '15:00',
    priority: 'haute',
    category: 'supervision',
    checklist: ['Reprise effective des cours', 'Climat de classe', 'Absences de l’après-midi']
  },
  {
    title: 'Travail administratif et pédagogique',
    description: 'Traitement des dossiers administratifs et pédagogiques en cours.',
    startTime: '15:00',
    endTime: '16:00',
    priority: 'haute',
    category: 'administration',
    checklist: ['Dossiers en attente', 'Validation de documents pédagogiques']
  },
  {
    title: 'Contrôle final',
    description: 'Dernière vérification avant la fin des cours : présence, discipline, sécurité.',
    startTime: '16:00',
    endTime: '16:30',
    priority: 'haute',
    category: 'supervision',
    checklist: ['Fin des cours vérifiée', 'Aucun incident en cours', 'Sécurité des locaux']
  },
  {
    title: 'Bilan quotidien',
    description: 'Rédaction du bilan de la journée : tâches réalisées, incidents, points de vigilance.',
    startTime: '16:30',
    endTime: '17:00',
    priority: 'haute',
    category: 'reporting',
    checklist: ['Bilan des tâches', 'Bilan des incidents', 'Points de vigilance à transmettre']
  },
  {
    title: 'Préparation du lendemain',
    description: 'Anticipation des priorités et du chronogramme du jour suivant.',
    startTime: '17:00',
    endTime: '17:15',
    priority: 'haute',
    category: 'preparation',
    checklist: ['Priorités du lendemain identifiées', 'Chronogramme du lendemain vérifié']
  }
];

export class ChronogramService {
  /** Formats a JS Date as "YYYY-MM-DD" using local time (not UTC). */
  static toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /** ISO day-of-week convention used across the app: 1 = Lundi ... 7 = Dimanche. */
  static getIsoDayOfWeek(date: Date): number {
    const jsDay = date.getDay(); // 0 = Sunday ... 6 = Saturday
    return jsDay === 0 ? 7 : jsDay;
  }

  /**
   * A school day is one where the ISO day-of-week is in the settings'
   * activeDaysOfWeek list (defaults to Lundi-Samedi, 1-6) AND not flagged
   * as an exception (holiday, journée pédagogique, etc.) by the caller.
   */
  static isSchoolDay(date: Date, settings: DirectorAssistantSettings, exceptionDateKeys: string[] = []): boolean {
    const isoDay = this.getIsoDayOfWeek(date);
    if (!settings.activeDaysOfWeek.includes(isoDay)) return false;
    if (exceptionDateKeys.includes(this.toDateKey(date))) return false;
    return true;
  }

  /**
   * Generates the full chronogram for a given date from the default
   * template. Returns an empty array on non-school days (vacations,
   * jours fériés, journées pédagogiques...) — the assistant simply stays
   * silent that day, per spec §17.
   */
  static generateTasksForDate(
    date: Date,
    userId: string,
    schoolId: string,
    settings: DirectorAssistantSettings,
    exceptionDateKeys: string[] = []
  ): DirectorTask[] {
    if (!this.isSchoolDay(date, settings, exceptionDateKeys)) return [];

    const dateKey = this.toDateKey(date);
    const now = new Date().toISOString();

    return DEFAULT_TEMPLATE.map((item, idx) => {
      const checklist: DirectorTaskChecklistItem[] = item.checklist.map((label, cIdx) => ({
        id: `chk_${dateKey}_${idx}_${cIdx}`,
        label
      }));

      const task: DirectorTask = {
        id: `dtask_${dateKey}_${idx}`,
        schoolId,
        userId,
        taskDate: dateKey,
        title: item.title,
        description: item.description,
        checklist,
        startTime: item.startTime,
        endTime: item.endTime,
        originalStartTime: item.startTime,
        priority: item.priority,
        status: 'pending',
        category: item.category,
        isCustom: false,
        createdAt: now,
        updatedAt: now
      };
      return task;
    });
  }

  static readonly DEFAULT_SETTINGS: DirectorAssistantSettings = {
    assistantName: 'Assistant DE — Agent de Pilotage Pédagogique',
    dayStartTime: '06:45',
    dayEndTime: '17:15',
    remindBeforeTaskMinutes: 5,
    intermediateReminderDelayMinutes: 10,
    overdueAlertDelayMinutes: 20,
    notificationsEnabled: true,
    browserNotificationsEnabled: false,
    activeDaysOfWeek: [1, 2, 3, 4, 5, 6]
  };
}
