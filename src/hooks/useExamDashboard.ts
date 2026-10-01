import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppSettings,
  DailyReflection,
  DigitalDisciplineState,
  Exam,
  ExamStatus,
  OverallStreakStats,
  QuoteItem,
  ReadingLog,
  ScheduleItem,
  SkillLog,
  SpiritualState,
  StudySession,
  Task,
  WeakArea,
} from '../types/dashboard';
import {
  VERIFIED_QUOTES,
} from '../data/defaultData';
import {
  Storage,
} from '../utils/storage';
import { playTaskCheckSound } from '../utils/audio';

export function useExamDashboard() {
  // State
  const [exams, setExams] = useState<Exam[]>(() => Storage.getExams());
  const [tasks, setTasks] = useState<Task[]>(() => Storage.getTasks());
  const [sessions, setSessions] = useState<StudySession[]>(() => Storage.getSessions());
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>(() => Storage.getWeakAreas());
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => Storage.getSchedule());
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>(() => Storage.getReadingLogs());
  const [skillLogs, setSkillLogs] = useState<SkillLog[]>(() => Storage.getSkillLogs());
  const [reflections, setReflections] = useState<DailyReflection[]>(() => Storage.getReflections());
  const [settings, setSettings] = useState<AppSettings>(() => Storage.getSettings());
  const [streaks, setStreaks] = useState<OverallStreakStats>(() => Storage.getStreaks());

  // Current real-time clock tick (every second for countdown)
  const [currentRealTime, setCurrentRealTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effective time: either simulated date or real device clock
  const effectiveDate = useMemo(() => {
    if (settings.simulatedDate) {
      // Offset simulation smoothly with real seconds elapsed
      return new Date(settings.simulatedDate);
    }
    return currentRealTime;
  }, [settings.simulatedDate, currentRealTime]);

  const dateString = useMemo(() => {
    return effectiveDate.toISOString().split('T')[0];
  }, [effectiveDate]);

  const [digitalDiscipline, setDigitalDisciplineState] = useState<DigitalDisciplineState>(() =>
    Storage.getDigitalDiscipline(new Date().toISOString().split('T')[0])
  );
  const [spiritual, setSpiritualState] = useState<SpiritualState>(() =>
    Storage.getSpiritual(new Date().toISOString().split('T')[0])
  );

  // Sync date-based trackers when dateString changes
  useEffect(() => {
    setDigitalDisciplineState(Storage.getDigitalDiscipline(dateString));
    setSpiritualState(Storage.getSpiritual(dateString));
  }, [dateString]);

  // Save changes to storage
  const updateExams = useCallback((newExams: Exam[]) => {
    setExams(newExams);
    Storage.saveExams(newExams);
  }, []);

  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    Storage.saveTasks(newTasks);
  }, []);

  const updateSessions = useCallback((newSessions: StudySession[]) => {
    setSessions(newSessions);
    Storage.saveSessions(newSessions);
  }, []);

  const updateWeakAreas = useCallback((newAreas: WeakArea[]) => {
    setWeakAreas(newAreas);
    Storage.saveWeakAreas(newAreas);
  }, []);

  const updateSchedule = useCallback((newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    Storage.saveSchedule(newSchedule);
  }, []);

  const updateReadingLogs = useCallback((newLogs: ReadingLog[]) => {
    setReadingLogs(newLogs);
    Storage.saveReadingLogs(newLogs);
  }, []);

  const updateSkillLogs = useCallback((newLogs: SkillLog[]) => {
    setSkillLogs(newLogs);
    Storage.saveSkillLogs(newLogs);
  }, []);

  const updateReflections = useCallback((newReflections: DailyReflection[]) => {
    setReflections(newReflections);
    Storage.saveReflections(newReflections);
  }, []);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const updateStreaks = useCallback((newStreaks: OverallStreakStats) => {
    setStreaks(newStreaks);
    Storage.saveStreaks(newStreaks);
  }, []);

  const updateDigitalDiscipline = useCallback((newState: DigitalDisciplineState) => {
    setDigitalDisciplineState(newState);
    Storage.saveDigitalDiscipline(dateString, newState);
  }, [dateString]);

  const updateSpiritual = useCallback((newState: SpiritualState) => {
    setSpiritualState(newState);
    Storage.saveSpiritual(dateString, newState);
  }, [dateString]);

  // Hourly quote calculation (changes exactly when the hour changes)
  const hourlyQuote = useMemo<QuoteItem>(() => {
    const epochHours = Math.floor(effectiveDate.getTime() / (1000 * 60 * 60));
    const quoteIndex = Math.abs(epochHours) % VERIFIED_QUOTES.length;
    return VERIFIED_QUOTES[quoteIndex];
  }, [effectiveDate]);

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = effectiveDate.getHours();
    if (hour >= 3 && hour < 12) return 'GOOD MORNING';
    if (hour >= 12 && hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  }, [effectiveDate]);

  // Dynamic Exam Statuses & Chronological Analysis
  const examStatusAnalysis = useMemo(() => {
    const nowMs = effectiveDate.getTime();
    let nextExamFound = false;

    const listWithStatus = exams.map((exam) => {
      const startMs = new Date(exam.startDateTime).getTime();
      const endMs = new Date(exam.endDateTime).getTime();
      let status: ExamStatus = 'UPCOMING';

      if (nowMs > endMs) {
        status = 'COMPLETED';
      } else if (nowMs >= startMs && nowMs <= endMs) {
        status = 'IN_PROGRESS';
      } else {
        // Not completed yet
        const isSameDay =
          effectiveDate.getFullYear() === new Date(exam.startDateTime).getFullYear() &&
          effectiveDate.getMonth() === new Date(exam.startDateTime).getMonth() &&
          effectiveDate.getDate() === new Date(exam.startDateTime).getDate();

        if (!nextExamFound) {
          status = 'NEXT';
          nextExamFound = true;
        } else if (isSameDay) {
          status = 'TODAY';
        } else {
          status = 'UPCOMING';
        }
      }

      // Calculate subject preparation %
      const totalTopics = exam.topics.length;
      const understoodTopics = exam.topics.filter((t) => t.understood).length;
      const topicRatio = totalTopics > 0 ? (understoodTopics / totalTopics) * 0.6 : 0.6;

      // Past question ratio (target 25)
      const pqTarget = 25;
      const pqRatio = Math.min(1, (exam.pastQuestions.completed || 0) / pqTarget) * 0.4;
      const computedPrep = Math.round((topicRatio + pqRatio) * 100);

      return {
        ...exam,
        status,
        startMs,
        endMs,
        computedPrep,
      };
    });

    const completedExams = listWithStatus.filter((e) => e.status === 'COMPLETED');
    const inProgressExam = listWithStatus.find((e) => e.status === 'IN_PROGRESS');
    const nextExam = listWithStatus.find((e) => e.status === 'NEXT') || inProgressExam;
    const remainingExams = listWithStatus.filter((e) => e.status !== 'COMPLETED');

    // Countdown calculation for next exam
    let countdownDisplay = 'ALL EXAMS COMPLETED';
    let hoursRemaining = 0;
    let daysRemaining = 0;
    let targetExamMs = 0;

    if (inProgressExam) {
      const remainingMs = inProgressExam.endMs - nowMs;
      const mins = Math.max(0, Math.floor(remainingMs / (1000 * 60)));
      countdownDisplay = `EXAM IN PROGRESS (${mins}m remaining)`;
    } else if (nextExam) {
      targetExamMs = nextExam.startMs;
      const diffMs = Math.max(0, targetExamMs - nowMs);
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      hoursRemaining = totalHours;
      daysRemaining = days;

      if (days >= 2) {
        countdownDisplay = `${days} DAYS ${hours} HOURS`;
      } else if (days === 1) {
        countdownDisplay = `1 DAY ${hours} HOURS`;
      } else if (totalHours > 0) {
        countdownDisplay = `${totalHours} HOURS ${minutes} MINUTES`;
      } else {
        countdownDisplay = `${minutes} MINUTES ${seconds} SECONDS`;
      }
    }

    // Operational mode
    let operationalMode: 'NORMAL' | 'HIGH_PRIORITY' | 'EXAM_PRIORITY_MODE' | 'IN_PROGRESS' | 'COMPLETED' = 'NORMAL';
    if (inProgressExam) {
      operationalMode = 'IN_PROGRESS';
    } else if (!nextExam) {
      operationalMode = 'COMPLETED';
    } else if (hoursRemaining <= 24) {
      operationalMode = 'EXAM_PRIORITY_MODE';
    } else if (hoursRemaining <= 72) {
      operationalMode = 'HIGH_PRIORITY';
    } else {
      operationalMode = 'NORMAL';
    }

    return {
      exams: listWithStatus,
      completedExams,
      remainingCount: remainingExams.length,
      nextExam,
      inProgressExam,
      countdownDisplay,
      hoursRemaining,
      daysRemaining,
      operationalMode,
    };
  }, [exams, effectiveDate]);

  // Task Actions
  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted && settings.soundEnabled) {
            playTaskCheckSound();
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      Storage.saveTasks(updated);

      // Update streaks if completing
      const completedCount = updated.filter((t) => t.completed).length;
      setStreaks((s) => {
        const next = { ...s, tasksCompleted: s.tasksCompleted + 1 };
        Storage.saveStreaks(next);
        return next;
      });

      return updated;
    });
  }, [settings.soundEnabled]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      Storage.saveTasks(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      Storage.saveTasks(updated);
      return updated;
    });
  }, []);

  const editTask = useCallback((taskId: string, partial: Partial<Task>) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, ...partial } : t));
      Storage.saveTasks(updated);
      return updated;
    });
  }, []);

  // Study Session Actions
  const logStudySession = useCallback((session: Omit<StudySession, 'id' | 'timestamp'>) => {
    const newSession: StudySession = {
      ...session,
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      Storage.saveSessions(updated);
      return updated;
    });

    // Update streak statistics
    setStreaks((prev) => {
      const today = newSession.date;
      const last = prev.lastStudyDate;
      let newCurrentStreak = prev.currentStreak;

      if (!last || last !== today) {
        newCurrentStreak = prev.currentStreak + 1;
      }
      const updatedStreak: OverallStreakStats = {
        ...prev,
        currentStreak: newCurrentStreak,
        bestStreak: Math.max(prev.bestStreak, newCurrentStreak),
        totalStudyDays: prev.totalStudyDays + (last !== today ? 1 : 0),
        totalStudyMinutes: prev.totalStudyMinutes + newSession.durationMinutes,
        lastStudyDate: today,
      };
      Storage.saveStreaks(updatedStreak);
      return updatedStreak;
    });
  }, []);

  // Weak Area Actions
  const addWeakArea = useCallback((area: Omit<WeakArea, 'id' | 'createdAt'>) => {
    const newArea: WeakArea = {
      ...area,
      id: `wa-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWeakAreas((prev) => {
      const updated = [newArea, ...prev];
      Storage.saveWeakAreas(updated);
      return updated;
    });
  }, []);

  const updateWeakAreaStatus = useCallback((id: string, status: WeakArea['status']) => {
    setWeakAreas((prev) => {
      const updated = prev.map((w) => (w.id === id ? { ...w, status } : w));
      Storage.saveWeakAreas(updated);
      return updated;
    });
  }, []);

  const deleteWeakArea = useCallback((id: string) => {
    setWeakAreas((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      Storage.saveWeakAreas(updated);
      return updated;
    });
  }, []);

  // Past Questions Tracker Updates
  const updatePastQuestions = useCallback((examId: string, pq: Exam['pastQuestions']) => {
    setExams((prev) => {
      const updated = prev.map((e) => (e.id === examId ? { ...e, pastQuestions: pq } : e));
      Storage.saveExams(updated);
      return updated;
    });
  }, []);

  // Topic understood toggle
  const toggleTopicUnderstood = useCallback((examId: string, topicId: string) => {
    setExams((prev) => {
      const updated = prev.map((e) => {
        if (e.id !== examId) return e;
        const newTopics = e.topics.map((t) =>
          t.id === topicId ? { ...t, understood: !t.understood } : t
        );
        return { ...e, topics: newTopics };
      });
      Storage.saveExams(updated);
      return updated;
    });
  }, []);

  const addTopicToExam = useCallback((examId: string, topicName: string) => {
    setExams((prev) => {
      const updated = prev.map((e) => {
        if (e.id !== examId) return e;
        const newTopic = {
          id: `t-${Date.now()}`,
          name: topicName,
          understood: false,
        };
        return { ...e, topics: [...e.topics, newTopic] };
      });
      Storage.saveExams(updated);
      return updated;
    });
  }, []);

  // Weighted Daily Progress Calculation
  const dailyProgress = useMemo(() => {
    const { weights } = settings;

    // Academic task completion (academic tasks for today)
    const academicTasks = tasks.filter((t) => t.category === 'academic');
    const academicCompleted = academicTasks.filter((t) => t.completed).length;
    const academicScore = academicTasks.length > 0
      ? (academicCompleted / academicTasks.length) * 100
      : 0;

    // Spiritual
    const spCount = [
      spiritual.morningPrayer,
      spiritual.eveningPrayer,
      spiritual.spiritualReading,
      spiritual.gratitudeReflection,
    ].filter(Boolean).length;
    const spiritualScore = (spCount / 4) * 100;

    // Reading (any reading log recorded today or recent minutes)
    const todayReading = readingLogs.filter((r) => r.date === dateString);
    const readingMins = todayReading.reduce((acc, r) => acc + r.minutes, 0);
    const readingScore = Math.min(100, (readingMins / 20) * 100);

    // Communication
    const commSessions = tasks.filter((t) => t.category === 'communication');
    const commDone = commSessions.filter((t) => t.completed).length;
    const commScore = commSessions.length > 0 ? (commDone / commSessions.length) * 100 : (readingMins > 0 ? 50 : 0);

    // Skills
    const todaySkills = skillLogs.filter((s) => s.date === dateString);
    const skillMins = todaySkills.reduce((acc, s) => acc + s.minutes, 0);
    const skillsScore = Math.min(100, (skillMins / 30) * 100);

    // Digital Discipline (4 items)
    const ddCount = [
      digitalDiscipline.noPurposelessShorts,
      digitalDiscipline.youtubeUsedIntentionally,
      digitalDiscipline.noUnnecessaryScrolling,
      digitalDiscipline.phoneAwayDuringStudy,
    ].filter(Boolean).length;
    const ddScore = (ddCount / 4) * 100;

    // Weighted Overall
    const totalWeights =
      weights.academics +
      weights.spiritual +
      weights.reading +
      weights.communication +
      weights.skills +
      weights.digitalDiscipline;

    const weightedScore =
      (academicScore * weights.academics +
        spiritualScore * weights.spiritual +
        readingScore * weights.reading +
        commScore * weights.communication +
        skillsScore * weights.skills +
        ddScore * weights.digitalDiscipline) /
      (totalWeights || 100);

    return {
      overall: Math.round(weightedScore),
      academics: Math.round(academicScore),
      spiritual: Math.round(spiritualScore),
      reading: Math.round(readingScore),
      communication: Math.round(commScore),
      skills: Math.round(skillsScore),
      digitalDiscipline: Math.round(ddScore),
    };
  }, [tasks, spiritual, readingLogs, skillLogs, digitalDiscipline, settings, dateString]);

  return {
    effectiveDate,
    dateString,
    greeting,
    exams: examStatusAnalysis.exams,
    completedExams: examStatusAnalysis.completedExams,
    remainingCount: examStatusAnalysis.remainingCount,
    nextExam: examStatusAnalysis.nextExam,
    inProgressExam: examStatusAnalysis.inProgressExam,
    countdownDisplay: examStatusAnalysis.countdownDisplay,
    hoursRemaining: examStatusAnalysis.hoursRemaining,
    operationalMode: examStatusAnalysis.operationalMode,
    hourlyQuote,
    tasks,
    sessions,
    weakAreas,
    schedule,
    readingLogs,
    skillLogs,
    reflections,
    settings,
    streaks,
    digitalDiscipline,
    spiritual,
    dailyProgress,
    // Actions
    toggleTask,
    addTask,
    deleteTask,
    editTask,
    logStudySession,
    addWeakArea,
    updateWeakAreaStatus,
    deleteWeakArea,
    updatePastQuestions,
    toggleTopicUnderstood,
    addTopicToExam,
    updateExams,
    updateSchedule,
    updateReadingLogs,
    updateSkillLogs,
    updateReflections,
    updateSettings,
    updateDigitalDiscipline,
    updateSpiritual,
    updateStreaks,
  };
}
