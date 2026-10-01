export type Priority = 'high' | 'medium' | 'low';
export type TaskCategory = 'academic' | 'spiritual' | 'reading' | 'communication' | 'skills' | 'digital_discipline';
export type Difficulty = 'High' | 'Medium' | 'Low';
export type WeakAreaStatus = 'Needs Review' | 'In Progress' | 'Mastered';
export type ReadingCategory = 'Academic' | 'Self-development' | 'Catholic / Spiritual';
export type SkillType = 'Video Editing' | 'AI Web Design';

export interface TopicItem {
  id: string;
  name: string;
  understood: boolean;
  isWeak?: boolean;
}

export interface PastQuestionStats {
  attempted: number;
  completed: number;
  correct: number;
  wrong: number;
  revisit: number;
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  date: string; // e.g. "2026-10-02"
  displayDate: string; // e.g. "October 2, 2026"
  startTime: string; // e.g. "12:00 PM"
  endTime: string; // e.g. "3:00 PM"
  venue: string;
  startDateTime: string; // ISO format string
  endDateTime: string; // ISO format string
  topics: TopicItem[];
  pastQuestions: PastQuestionStats;
  notes?: string;
}

export type ExamStatus = 'COMPLETED' | 'IN_PROGRESS' | 'TODAY' | 'NEXT' | 'UPCOMING';

export interface Task {
  id: string;
  name: string;
  subject: string;
  category: TaskCategory;
  priority: Priority;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  isDailyMission?: boolean;
}

export interface StudySession {
  id: string;
  subject: string;
  task: string;
  durationMinutes: number;
  timestamp: number;
  date: string;
  notes: string;
}

export interface WeakArea {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  notes: string;
  status: WeakAreaStatus;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  timeRange: string;
  title: string;
  description: string;
  isAcademic: boolean;
  completed: boolean;
  isConfigurable?: boolean;
}

export interface ReadingLog {
  id: string;
  bookName: string;
  category: ReadingCategory;
  pages: number;
  minutes: number;
  date: string;
  notes?: string;
}

export interface SkillLog {
  id: string;
  skill: SkillType;
  minutes: number;
  whatILearned: string;
  project: string;
  date: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  accomplished: string;
  distracted: string;
  learned: string;
  improveTomorrow: string;
  selfCare: string;
  timestamp: number;
}

export interface DigitalDisciplineState {
  date: string;
  noPurposelessShorts: boolean;
  youtubeUsedIntentionally: boolean;
  noUnnecessaryScrolling: boolean;
  phoneAwayDuringStudy: boolean;
  intentionalQueries: Array<{ id: string; time: string; purpose: string }>;
}

export interface SpiritualState {
  date: string;
  morningPrayer: boolean;
  eveningPrayer: boolean;
  spiritualReading: boolean;
  gratitudeReflection: boolean;
  gratitudeNote: string;
}

export interface CommunicationSession {
  id: string;
  date: string;
  exercise: string;
  durationMinutes: number;
  reflection: string;
}

export interface WeightSettings {
  academics: number;
  spiritual: number;
  reading: number;
  communication: number;
  skills: number;
  digitalDiscipline: number;
}

export interface QuoteItem {
  id: number;
  quote: string;
  author: string;
  source?: string;
  bgType: 'image' | 'gradient';
  bgUrl?: string;
  bgAtmosphere?: string;
}

export interface AppSettings {
  userName: string;
  darkMode: boolean;
  soundEnabled: boolean;
  simulatedDate: string | null; // e.g. "2026-10-01T08:00:00" or null for live clock
  weights: WeightSettings;
}

export interface OverallStreakStats {
  currentStreak: number;
  bestStreak: number;
  totalStudyDays: number;
  examsCompleted: number;
  tasksCompleted: number;
  totalStudyMinutes: number;
  lastStudyDate?: string;
}
