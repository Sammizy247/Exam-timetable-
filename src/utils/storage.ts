import {
  AppSettings,
  DailyReflection,
  DigitalDisciplineState,
  Exam,
  OverallStreakStats,
  ReadingLog,
  ScheduleItem,
  SkillLog,
  SpiritualState,
  StudySession,
  Task,
  WeakArea,
} from '../types/dashboard';
import {
  DEFAULT_EXAMS,
  DEFAULT_SCHEDULE,
  DEFAULT_WEIGHTS,
} from '../data/defaultData';

const STORAGE_KEYS = {
  EXAMS: 'ecc_exams_v1',
  TASKS: 'ecc_tasks_v1',
  STUDY_SESSIONS: 'ecc_sessions_v1',
  WEAK_AREAS: 'ecc_weak_areas_v1',
  SCHEDULE: 'ecc_schedule_v1',
  READING_LOGS: 'ecc_reading_v1',
  SKILL_LOGS: 'ecc_skills_v1',
  REFLECTIONS: 'ecc_reflections_v1',
  DIGITAL_DISCIPLINE: 'ecc_digital_v1',
  SPIRITUAL: 'ecc_spiritual_v1',
  SETTINGS: 'ecc_settings_v2',
  STREAK_STATS: 'ecc_streak_v1',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-mission-1',
    name: 'Deep Study — Feedback Topologies & Stability',
    subject: 'EEE 356',
    category: 'academic',
    priority: 'high',
    estimatedMinutes: 60,
    completed: false,
    createdAt: new Date().toISOString(),
    isDailyMission: true,
  },
  {
    id: 't-mission-2',
    name: 'Past Questions — 2023/2024 Exam Paper (Q1 to Q3)',
    subject: 'EEE 356',
    category: 'academic',
    priority: 'high',
    estimatedMinutes: 60,
    completed: false,
    createdAt: new Date().toISOString(),
    isDailyMission: true,
  },
  {
    id: 't-mission-3',
    name: 'Active Recall — Op-Amp & Active Filter Formulas',
    subject: 'EEE 356',
    category: 'academic',
    priority: 'medium',
    estimatedMinutes: 30,
    completed: false,
    createdAt: new Date().toISOString(),
    isDailyMission: true,
  },
  {
    id: 't-mission-4',
    name: 'Review Weak Areas — Differential Amplifier CMRR',
    subject: 'EEE 356',
    category: 'academic',
    priority: 'high',
    estimatedMinutes: 45,
    completed: false,
    createdAt: new Date().toISOString(),
    isDailyMission: true,
  },
];

export const INITIAL_WEAK_AREAS: WeakArea[] = [
  {
    id: 'wa-1',
    subject: 'EEE 356',
    topic: 'Feedback Topologies & Barkhausen Stability',
    difficulty: 'High',
    notes: 'Keep mixing up voltage-series with voltage-shunt feedback loading effects.',
    status: 'Needs Review',
    createdAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'wa-2',
    subject: 'EEE 356',
    topic: 'Active Filter Sallen-Key Low Pass Derivations',
    difficulty: 'Medium',
    notes: 'Remember Q factor cutoff formula and pole sensitivity.',
    status: 'In Progress',
    createdAt: '2026-09-30T14:00:00Z',
  },
  {
    id: 'wa-3',
    subject: 'EEE 354',
    topic: 'Depletion Layer Width vs Reverse Bias',
    difficulty: 'High',
    notes: 'Derive from Poissons equation step-by-step.',
    status: 'Needs Review',
    createdAt: '2026-09-30T16:00:00Z',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  userName: 'Tobechukwu',
  darkMode: false, // Default to clean, bright light mode
  soundEnabled: true,
  simulatedDate: null, // default to live system time
  weights: DEFAULT_WEIGHTS,
};

export const INITIAL_STREAKS: OverallStreakStats = {
  currentStreak: 6,
  bestStreak: 14,
  totalStudyDays: 18,
  examsCompleted: 2,
  tasksCompleted: 42,
  totalStudyMinutes: 2840,
};

export function loadItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving key ${key} to localStorage:`, e);
  }
}

export const Storage = {
  getExams: (): Exam[] => loadItem<Exam[]>(STORAGE_KEYS.EXAMS, DEFAULT_EXAMS),
  saveExams: (exams: Exam[]) => saveItem(STORAGE_KEYS.EXAMS, exams),

  getTasks: (): Task[] => loadItem<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: Task[]) => saveItem(STORAGE_KEYS.TASKS, tasks),

  getSessions: (): StudySession[] => loadItem<StudySession[]>(STORAGE_KEYS.STUDY_SESSIONS, [
    {
      id: 'sess-prev-1',
      subject: 'EEE 356',
      task: 'Past Questions 2022',
      durationMinutes: 60,
      timestamp: Date.now() - 86400000,
      date: '2026-09-30',
      notes: 'Solved Q1 to Q4 on multistage amplifier gain.',
    },
  ]),
  saveSessions: (sessions: StudySession[]) => saveItem(STORAGE_KEYS.STUDY_SESSIONS, sessions),

  getWeakAreas: (): WeakArea[] => loadItem<WeakArea[]>(STORAGE_KEYS.WEAK_AREAS, INITIAL_WEAK_AREAS),
  saveWeakAreas: (weakAreas: WeakArea[]) => saveItem(STORAGE_KEYS.WEAK_AREAS, weakAreas),

  getSchedule: (): ScheduleItem[] => loadItem<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, DEFAULT_SCHEDULE),
  saveSchedule: (schedule: ScheduleItem[]) => saveItem(STORAGE_KEYS.SCHEDULE, schedule),

  getReadingLogs: (): ReadingLog[] => loadItem<ReadingLog[]>(STORAGE_KEYS.READING_LOGS, [
    {
      id: 'rl-1',
      bookName: 'Atomic Habits',
      category: 'Self-development',
      pages: 12,
      minutes: 20,
      date: '2026-09-30',
      notes: 'Focus on identity-based habits during high-pressure weeks.',
    },
  ]),
  saveReadingLogs: (logs: ReadingLog[]) => saveItem(STORAGE_KEYS.READING_LOGS, logs),

  getSkillLogs: (): SkillLog[] => loadItem<SkillLog[]>(STORAGE_KEYS.SKILL_LOGS, [
    {
      id: 'sl-1',
      skill: 'AI Web Design',
      minutes: 25,
      whatILearned: 'Component props restructuring and Tailwind grid systems',
      project: 'Exam Dashboard',
      date: '2026-09-29',
    },
  ]),
  saveSkillLogs: (logs: SkillLog[]) => saveItem(STORAGE_KEYS.SKILL_LOGS, logs),

  getReflections: (): DailyReflection[] => loadItem<DailyReflection[]>(STORAGE_KEYS.REFLECTIONS, []),
  saveReflections: (reflections: DailyReflection[]) => saveItem(STORAGE_KEYS.REFLECTIONS, reflections),

  getDigitalDiscipline: (todayDateStr: string): DigitalDisciplineState => {
    const all = loadItem<Record<string, DigitalDisciplineState>>(STORAGE_KEYS.DIGITAL_DISCIPLINE, {});
    return all[todayDateStr] || {
      date: todayDateStr,
      noPurposelessShorts: true,
      youtubeUsedIntentionally: true,
      noUnnecessaryScrolling: true,
      phoneAwayDuringStudy: true,
      intentionalQueries: [],
    };
  },
  saveDigitalDiscipline: (todayDateStr: string, state: DigitalDisciplineState) => {
    const all = loadItem<Record<string, DigitalDisciplineState>>(STORAGE_KEYS.DIGITAL_DISCIPLINE, {});
    all[todayDateStr] = state;
    saveItem(STORAGE_KEYS.DIGITAL_DISCIPLINE, all);
  },

  getSpiritual: (todayDateStr: string): SpiritualState => {
    const all = loadItem<Record<string, SpiritualState>>(STORAGE_KEYS.SPIRITUAL, {});
    return all[todayDateStr] || {
      date: todayDateStr,
      morningPrayer: true,
      eveningPrayer: false,
      spiritualReading: false,
      gratitudeReflection: false,
      gratitudeNote: '',
    };
  },
  saveSpiritual: (todayDateStr: string, state: SpiritualState) => {
    const all = loadItem<Record<string, SpiritualState>>(STORAGE_KEYS.SPIRITUAL, {});
    all[todayDateStr] = state;
    saveItem(STORAGE_KEYS.SPIRITUAL, all);
  },

  getSettings: (): AppSettings => loadItem<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
  saveSettings: (settings: AppSettings) => saveItem(STORAGE_KEYS.SETTINGS, settings),

  getStreaks: (): OverallStreakStats => loadItem<OverallStreakStats>(STORAGE_KEYS.STREAK_STATS, INITIAL_STREAKS),
  saveStreaks: (streaks: OverallStreakStats) => saveItem(STORAGE_KEYS.STREAK_STATS, streaks),

  // Export full snapshot
  exportAllData: (): string => {
    const snapshot = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exams: Storage.getExams(),
      tasks: Storage.getTasks(),
      sessions: Storage.getSessions(),
      weakAreas: Storage.getWeakAreas(),
      schedule: Storage.getSchedule(),
      readingLogs: Storage.getReadingLogs(),
      skillLogs: Storage.getSkillLogs(),
      reflections: Storage.getReflections(),
      digitalDiscipline: loadItem(STORAGE_KEYS.DIGITAL_DISCIPLINE, {}),
      spiritual: loadItem(STORAGE_KEYS.SPIRITUAL, {}),
      settings: Storage.getSettings(),
      streaks: Storage.getStreaks(),
    };
    return JSON.stringify(snapshot, null, 2);
  },

  // Import snapshot
  importAllData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.exams && Array.isArray(data.exams)) Storage.saveExams(data.exams);
      if (data.tasks && Array.isArray(data.tasks)) Storage.saveTasks(data.tasks);
      if (data.sessions && Array.isArray(data.sessions)) Storage.saveSessions(data.sessions);
      if (data.weakAreas && Array.isArray(data.weakAreas)) Storage.saveWeakAreas(data.weakAreas);
      if (data.schedule && Array.isArray(data.schedule)) Storage.saveSchedule(data.schedule);
      if (data.readingLogs && Array.isArray(data.readingLogs)) Storage.saveReadingLogs(data.readingLogs);
      if (data.skillLogs && Array.isArray(data.skillLogs)) Storage.saveSkillLogs(data.skillLogs);
      if (data.reflections && Array.isArray(data.reflections)) Storage.saveReflections(data.reflections);
      if (data.digitalDiscipline) saveItem(STORAGE_KEYS.DIGITAL_DISCIPLINE, data.digitalDiscipline);
      if (data.spiritual) saveItem(STORAGE_KEYS.SPIRITUAL, data.spiritual);
      if (data.settings) Storage.saveSettings(data.settings);
      if (data.streaks) Storage.saveStreaks(data.streaks);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  resetAllData: () => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem('exam_command_study_lab_materials_v1');
    localStorage.removeItem('ExamCommandCenter_DB');
  },
};
