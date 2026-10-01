import React, { useState, useRef } from 'react';
import {
  AppSettings,
  DailyReflection,
  DigitalDisciplineState,
  ReadingLog,
  ScheduleItem,
  SkillLog,
  SpiritualState,
  Task,
} from '../types/dashboard';
import { IDENTITY_GOALS, SPEAKING_CHALLENGES } from '../data/defaultData';
import { Storage } from '../utils/storage';
import {
  Mic,
  Square,
  Volume2,
  BookOpen,
  Shield,
  Cross,
  Heart,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  HelpCircle,
  Film,
} from 'lucide-react';

interface MoreViewProps {
  tasks: Task[];
  schedule: ScheduleItem[];
  readingLogs: ReadingLog[];
  skillLogs: SkillLog[];
  reflections: DailyReflection[];
  digitalDiscipline: DigitalDisciplineState;
  spiritual: SpiritualState;
  settings: AppSettings;
  effectiveDate: Date;
  onUpdateSchedule: (schedule: ScheduleItem[]) => void;
  onUpdateReadingLogs: (logs: ReadingLog[]) => void;
  onUpdateSkillLogs: (logs: SkillLog[]) => void;
  onUpdateReflections: (reflections: DailyReflection[]) => void;
  onUpdateDigitalDiscipline: (state: DigitalDisciplineState) => void;
  onUpdateSpiritual: (state: SpiritualState) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  tasks,
  schedule,
  readingLogs,
  skillLogs,
  reflections,
  digitalDiscipline,
  spiritual,
  settings,
  effectiveDate,
  onUpdateSchedule,
  onUpdateReadingLogs,
  onUpdateSkillLogs,
  onUpdateReflections,
  onUpdateDigitalDiscipline,
  onUpdateSpiritual,
  onUpdateSettings,
}) => {
  const [activeSection, setActiveSection] = useState<
    | 'menu'
    | 'communication'
    | 'reading'
    | 'skills'
    | 'digital'
    | 'spiritual'
    | 'reflection'
    | 'schedule'
    | 'identity'
    | 'backup'
  >('menu');

  // Speaking Challenge Generator
  const [currentChallenge, setCurrentChallenge] = useState<string>(SPEAKING_CHALLENGES[0]);

  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Reading Form State
  const [readingBook, setReadingBook] = useState('');
  const [readingCategory, setReadingCategory] = useState<'Academic' | 'Self-development' | 'Catholic / Spiritual'>('Academic');
  const [readingPages, setReadingPages] = useState(10);
  const [readingMinutes, setReadingMinutes] = useState(20);
  const [readingNotes, setReadingNotes] = useState('');

  // Skill Form State
  const [skillType, setSkillType] = useState<'Video Editing' | 'AI Web Design'>('Video Editing');
  const [skillMinutes, setSkillMinutes] = useState(30);
  const [skillLearned, setSkillLearned] = useState('');
  const [skillProject, setSkillProject] = useState('');

  // Intentional YouTube query state
  const [ytPurpose, setYtPurpose] = useState('');

  // Daily Reflection Form
  const [reflectionForm, setReflectionForm] = useState({
    accomplished: '',
    distracted: '',
    learned: '',
    improveTomorrow: '',
    selfCare: '',
  });

  // In-UI Status Notifications & Confirmation Modals (avoids window.alert/window.confirm)
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const pendingAcademicTasks = tasks.filter((t) => t.category === 'academic' && !t.completed).length;

  const startRecording = async () => {
    try {
      setMicNotice(null);
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setMicNotice('Microphone access is required for articulation recordings. Please allow microphone permissions in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const getRandomChallenge = () => {
    const nextIndex = Math.floor(Math.random() * SPEAKING_CHALLENGES.length);
    setCurrentChallenge(SPEAKING_CHALLENGES[nextIndex]);
  };

  const handleAddReadingLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readingBook.trim()) return;
    const newLog: ReadingLog = {
      id: `rl-${Date.now()}`,
      bookName: readingBook.trim(),
      category: readingCategory,
      pages: Number(readingPages) || 1,
      minutes: Number(readingMinutes) || 15,
      date: effectiveDate.toISOString().split('T')[0],
      notes: readingNotes.trim(),
    };
    onUpdateReadingLogs([newLog, ...readingLogs]);
    setReadingBook('');
    setReadingNotes('');
  };

  const handleAddSkillLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillLearned.trim()) return;
    const newLog: SkillLog = {
      id: `sl-${Date.now()}`,
      skill: skillType,
      minutes: Number(skillMinutes) || 20,
      whatILearned: skillLearned.trim(),
      project: skillProject.trim() || 'Exam maintenance',
      date: effectiveDate.toISOString().split('T')[0],
    };
    onUpdateSkillLogs([newLog, ...skillLogs]);
    setSkillLearned('');
    setSkillProject('');
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef: DailyReflection = {
      id: `ref-${Date.now()}`,
      date: effectiveDate.toISOString().split('T')[0],
      accomplished: reflectionForm.accomplished.trim(),
      distracted: reflectionForm.distracted.trim(),
      learned: reflectionForm.learned.trim(),
      improveTomorrow: reflectionForm.improveTomorrow.trim(),
      selfCare: reflectionForm.selfCare.trim(),
      timestamp: Date.now(),
    };
    onUpdateReflections([newRef, ...reflections]);
    setActiveSection('menu');
  };

  const handleAddYtQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytPurpose.trim()) return;
    const nextQueries = [
      ...(digitalDiscipline.intentionalQueries || []),
      {
        id: `yt-${Date.now()}`,
        time: effectiveDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        purpose: ytPurpose.trim(),
      },
    ];
    onUpdateDigitalDiscipline({
      ...digitalDiscipline,
      intentionalQueries: nextQueries,
    });
    setYtPurpose('');
  };

  const handleExportData = () => {
    const jsonStr = Storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = Storage.importAllData(content);
      if (ok) {
        setStatusNotice({
          type: 'success',
          message: 'Data imported successfully! Reloading application...',
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setStatusNotice({
          type: 'error',
          message: 'Invalid backup JSON format. Please verify the uploaded file.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    Storage.resetAllData();
    window.location.reload();
  };

  const menuItems = [
    { id: 'schedule', title: 'Daily Study Schedule', subtitle: '3:00 AM wake up & exam-period routine', icon: Clock },
    { id: 'identity', title: 'Who I’m Becoming', subtitle: '8 core long-term identity standards', icon: Sparkles },
    { id: 'communication', title: 'Articulation Practice', subtitle: 'Speaking challenges & voice recording drills', icon: Mic },
    { id: 'reading', title: 'Reading Tracker', subtitle: 'Academic, self-dev & Catholic reading', icon: BookOpen },
    { id: 'skills', title: 'Skills Tracker', subtitle: 'Video Editing & AI Web Design maintenance', icon: Film },
    { id: 'digital', title: 'Digital Discipline', subtitle: 'Intentional YouTube & anti-scroll habits', icon: Shield },
    { id: 'spiritual', title: 'Spiritual Life', subtitle: 'Catholic prayers & daily gratitude', icon: Cross },
    { id: 'reflection', title: 'Nightly Reflection', subtitle: '5 questions for end-of-day clarity', icon: Heart },
    { id: 'backup', title: 'Backup, Import & Settings', subtitle: 'Export JSON, simulated date, and controls', icon: Download },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Back button if in sub-section */}
      {activeSection !== 'menu' && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection('menu')}
            className="text-xs font-bold text-[#D32F2F] dark:text-[#EF4444] hover:underline flex items-center gap-1.5 transition-colors"
          >
            ← Back to More Hub
          </button>
        </div>
      )}

      {/* SECTION MENU HUB */}
      {activeSection === 'menu' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#171717] dark:text-white">
                SYSTEMS & DISCIPLINE HUB
              </h2>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Supporting routines designed to uphold peak cognitive performance without distracting from exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-800 hover:border-[#D32F2F] dark:hover:border-[#EF4444] transition-all text-left flex items-start gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md group active:scale-[0.99]"
                >
                  <div className="p-2.5 rounded-xl bg-[#FFF1F1] dark:bg-[#251515] text-[#D32F2F] dark:text-[#EF4444] group-hover:scale-105 transition shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#171717] dark:text-white group-hover:text-[#D32F2F] dark:group-hover:text-[#EF4444] transition truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 line-clamp-1 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. DAILY STUDY SCHEDULE */}
      {activeSection === 'schedule' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>DAILY STUDY SCHEDULE</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Targeted for 3:00 AM wake up during high-intensity examination periods
            </p>
          </div>

          <div className="space-y-2">
            {schedule.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs transition ${
                  item.isAcademic
                    ? 'bg-white dark:bg-[#1A1A1A] border-[#D32F2F]/30 dark:border-[#EF4444]/30 shadow-xs'
                    : 'bg-[#F8F8F8] dark:bg-[#1F1F1F] border-[#E5E7EB] dark:border-neutral-800'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#171717] dark:text-white">
                      {item.timeRange}
                    </span>
                    {item.isAcademic && (
                      <span className="text-[10px] font-black uppercase text-[#D32F2F] dark:text-[#EF4444] bg-[#FFF1F1] dark:bg-[#EF4444]/15 px-1.5 py-0.5 rounded">
                        Academic Priority
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-[#171717] dark:text-white mt-1">
                    {item.title}
                  </div>
                  <p className="text-[#6B7280] dark:text-neutral-400 text-[11px] mt-0.5 font-medium">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const next = schedule.map((s) =>
                      s.id === item.id ? { ...s, completed: !s.completed } : s
                    );
                    onUpdateSchedule(next);
                  }}
                  className={`min-w-[22px] min-h-[22px] rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    item.completed
                      ? 'bg-[#D32F2F] dark:bg-[#EF4444] border-[#D32F2F] dark:border-[#EF4444] text-white'
                      : 'border-2 border-[#D32F2F]/60 dark:border-[#EF4444]/60 bg-white dark:bg-[#181818]'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WHO I'M BECOMING */}
      {activeSection === 'identity' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>WHO I'M BECOMING</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              The internal standards guiding every study session, prayer, and habit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {IDENTITY_GOALS.map((goal, index) => (
              <div
                key={goal}
                className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-800 flex items-start gap-3 text-xs"
              >
                <span className="font-mono text-[#D32F2F] dark:text-[#EF4444] font-black text-sm shrink-0">
                  0{index + 1}.
                </span>
                <span className="font-semibold text-[#171717] dark:text-neutral-200 leading-relaxed">
                  {goal}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ARTICULATION PRACTICE (Communication) */}
      {activeSection === 'communication' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>ARTICULATION PRACTICE</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              5-minute daily verbal drills to sharpen engineering explanation & speech
            </p>
          </div>

          {/* Random Speaking Challenge Card in Red & White */}
          <div className="p-4 bg-[#FFF1F1] dark:bg-[#EF4444]/10 border border-[#D32F2F]/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#D32F2F] dark:text-[#EF4444]">
              <span>Today's Random Speaking Drill</span>
              <button
                onClick={getRandomChallenge}
                className="text-xs underline hover:opacity-80 font-bold"
              >
                New Prompt
              </button>
            </div>
            <p className="text-sm font-bold text-[#171717] dark:text-white italic">
              "{currentChallenge}"
            </p>
          </div>

          {/* Audio Recorder Module */}
          <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-750 text-xs space-y-3">
            <div className="font-bold text-[#171717] dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
              <span>Built-in Voice Drill Recorder</span>
            </div>

            <p className="text-[#6B7280] dark:text-neutral-400 font-medium">
              Record yourself for 5 minutes explaining a concept without notes, then listen to verify clarity.
            </p>

            {micNotice && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{micNotice}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold rounded-xl flex items-center gap-2 transition active:scale-[0.98]"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start 5-Min Record</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-[#171717] text-white font-bold rounded-xl flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 text-[#D32F2F] fill-[#D32F2F]" />
                  <span>Stop Recording</span>
                </button>
              )}

              {recordedAudioUrl && (
                <audio controls src={recordedAudioUrl} className="h-10 max-w-[200px]" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. READING TRACKER */}
      {activeSection === 'reading' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>READING TRACKER</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Keep reading sessions concise (15–20 mins) during exam period so they never compete with study
            </p>
          </div>

          <form onSubmit={handleAddReadingLog} className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-750 text-xs space-y-3">
            <div className="font-bold text-[#171717] dark:text-white">Log Reading Session</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Book / Material Title</label>
                <input
                  type="text"
                  placeholder="e.g. Atomic Habits, Mere Christianity, EE Circuits"
                  value={readingBook}
                  onChange={(e) => setReadingBook(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Category</label>
                <select
                  value={readingCategory}
                  onChange={(e) => setReadingCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                >
                  <option value="Academic">Academic</option>
                  <option value="Self-development">Self-development</option>
                  <option value="Catholic / Spiritual">Catholic / Spiritual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Pages Read</label>
                <input
                  type="number"
                  value={readingPages}
                  onChange={(e) => setReadingPages(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Minutes Spent</label>
                <input
                  type="number"
                  value={readingMinutes}
                  onChange={(e) => setReadingMinutes(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] text-white font-bold rounded-xl transition active:scale-[0.98]"
              >
                Log Reading
              </button>
            </div>
          </form>

          {/* Reading logs */}
          <div className="space-y-2">
            {readingLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-800 flex justify-between items-center text-xs shadow-xs"
              >
                <div>
                  <span className="font-bold text-[#171717] dark:text-white">
                    {log.bookName}
                  </span>{' '}
                  <span className="text-[#D32F2F] dark:text-[#EF4444] font-semibold">({log.category})</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">
                    {log.pages} pages · {log.minutes} mins {log.notes && `· "${log.notes}"`}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SKILLS TRACKER */}
      {activeSection === 'skills' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>SKILLS MAINTENANCE (SECONDARY)</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Focused specifically on Video Editing & AI Web Design
            </p>
          </div>

          {/* Gentle Academic Notice in Light Red */}
          {pendingAcademicTasks > 0 && (
            <div className="p-3.5 bg-[#FFF1F1] dark:bg-[#EF4444]/10 border border-[#D32F2F]/30 rounded-xl text-xs text-[#171717] dark:text-neutral-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444] shrink-0" />
              <span>
                <strong className="text-[#D32F2F] dark:text-[#EF4444]">Reminder:</strong> Academics first. Skills can wait. You still have {pendingAcademicTasks} academic mission{pendingAcademicTasks > 1 ? 's' : ''} queued for today.
              </span>
            </div>
          )}

          <form onSubmit={handleAddSkillLog} className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-750 text-xs space-y-3">
            <div className="font-bold text-[#171717] dark:text-white">Log Skill Practice</div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Skill</label>
                <select
                  value={skillType}
                  onChange={(e) => setSkillType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                >
                  <option value="Video Editing">Video Editing</option>
                  <option value="AI Web Design">AI Web Design</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">Minutes (max 30m)</label>
                <input
                  type="number"
                  value={skillMinutes}
                  onChange={(e) => setSkillMinutes(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">What I Learned / Practiced</label>
              <input
                type="text"
                placeholder="e.g. Cut timing, sound design curve, or flexbox container layout"
                value={skillLearned}
                onChange={(e) => setSkillLearned(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                required
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] text-white font-bold rounded-xl transition active:scale-[0.98]"
              >
                Log Practice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. DIGITAL DISCIPLINE */}
      {activeSection === 'digital' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>DIGITAL DISCIPLINE & INTENTIONAL CONSUMPTION</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Eliminate mindless scrolling while preserving high-leverage intentional learning
            </p>
          </div>

          {/* Intentional YouTube Question Prompt */}
          <div className="p-4 bg-[#F8F8F8] dark:bg-[#1F1F1F] rounded-xl border border-[#E5E7EB] dark:border-neutral-750 text-xs space-y-2">
            <div className="font-bold text-[#171717] dark:text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
              <span>Before Opening YouTube: "What exactly am I here to watch?"</span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400 font-medium">
              Only consume intentional content: educational podcasts, biographies, Catholic talks, or lecture explanations.
            </p>
            <form onSubmit={handleAddYtQuery} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="e.g. Professor Leonard derivation on complex numbers"
                value={ytPurpose}
                onChange={(e) => setYtPurpose(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] text-white font-bold rounded-lg shrink-0 transition active:scale-[0.98]"
              >
                Log Intent
              </button>
            </form>
          </div>

          {/* Daily Discipline Checklist */}
          <div className="space-y-2">
            {[
              {
                key: 'noPurposelessShorts',
                label: 'No purposeless YouTube Shorts / algorithmic scrolling',
                val: digitalDiscipline.noPurposelessShorts,
              },
              {
                key: 'youtubeUsedIntentionally',
                label: 'YouTube used only with an intentional objective stated beforehand',
                val: digitalDiscipline.youtubeUsedIntentionally,
              },
              {
                key: 'noUnnecessaryScrolling',
                label: 'No unnecessary social media or timeline feeds',
                val: digitalDiscipline.noUnnecessaryScrolling,
              },
              {
                key: 'phoneAwayDuringStudy',
                label: 'Phone kept out of sight during deep study blocks',
                val: digitalDiscipline.phoneAwayDuringStudy,
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() =>
                  onUpdateDigitalDiscipline({
                    ...digitalDiscipline,
                    [item.key]: !item.val,
                  })
                }
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition ${
                  item.val
                    ? 'bg-[#FFF1F1] dark:bg-[#EF4444]/10 border-[#D32F2F]/30 text-[#171717] dark:text-white'
                    : 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-800 text-[#171717] dark:text-neutral-300'
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    item.val
                      ? 'bg-[#D32F2F] dark:bg-[#EF4444] border-[#D32F2F] dark:border-[#EF4444] text-white'
                      : 'border-2 border-[#D32F2F]/60 dark:border-[#EF4444]/60 bg-white dark:bg-[#181818]'
                  }`}
                >
                  {item.val && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SPIRITUAL SECTION */}
      {activeSection === 'spiritual' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Cross className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>SPIRITUAL GROUNDING (CATHOLIC)</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Reverent, quiet daily connection with God to anchor composure and purpose
            </p>
          </div>

          <div className="space-y-2">
            {[
              {
                key: 'morningPrayer',
                label: 'Morning prayer / surrender of study efforts to God (3:00 AM)',
                val: spiritual.morningPrayer,
              },
              {
                key: 'eveningPrayer',
                label: 'Evening prayer / Compline before rest',
                val: spiritual.eveningPrayer,
              },
              {
                key: 'spiritualReading',
                label: 'Short spiritual reading (Scripture, Imitation of Christ, Catechism)',
                val: spiritual.spiritualReading,
              },
              {
                key: 'gratitudeReflection',
                label: 'Gratitude & humble reflection for strength provided today',
                val: spiritual.gratitudeReflection,
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() =>
                  onUpdateSpiritual({
                    ...spiritual,
                    [item.key]: !item.val,
                  })
                }
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition ${
                  item.val
                    ? 'bg-[#FFF1F1] dark:bg-[#EF4444]/10 border-[#D32F2F]/30 text-[#171717] dark:text-white'
                    : 'bg-white dark:bg-[#181818] border-[#E5E7EB] dark:border-neutral-800 text-[#171717] dark:text-neutral-300'
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    item.val
                      ? 'bg-[#D32F2F] dark:bg-[#EF4444] border-[#D32F2F] dark:border-[#EF4444] text-white'
                      : 'border-2 border-[#D32F2F]/60 dark:border-[#EF4444]/60 bg-white dark:bg-[#181818]'
                  }`}
                >
                  {item.val && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#171717] dark:text-white mb-1">
              Gratitude / Prayer Note
            </label>
            <input
              type="text"
              placeholder="e.g. Thankful for clarity on 3-phase circuits and energy to wake at 3:00 AM."
              value={spiritual.gratitudeNote || ''}
              onChange={(e) =>
                onUpdateSpiritual({
                  ...spiritual,
                  gratitudeNote: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-[#171717] dark:text-white"
            />
          </div>
        </div>
      )}

      {/* 8. NIGHTLY REFLECTION */}
      {activeSection === 'reflection' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>NIGHTLY REFLECTION (9:00 PM)</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Review your day with radical honesty before sleeping for tomorrow’s 3:00 AM wake up
            </p>
          </div>

          <form onSubmit={handleSaveReflection} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#171717] dark:text-neutral-300 mb-1">
                1. What did I accomplish today?
              </label>
              <textarea
                rows={2}
                value={reflectionForm.accomplished}
                onChange={(e) => setReflectionForm({ ...reflectionForm, accomplished: e.target.value })}
                placeholder="e.g. Solved 15 past questions in EEE 356, revised differential amplifiers."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#171717] dark:text-neutral-300 mb-1">
                2. What distracted me today?
              </label>
              <textarea
                rows={2}
                value={reflectionForm.distracted}
                onChange={(e) => setReflectionForm({ ...reflectionForm, distracted: e.target.value })}
                placeholder="e.g. Spent 15 mins checking group chat in the afternoon."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#171717] dark:text-neutral-300 mb-1">
                3. What did I learn?
              </label>
              <textarea
                rows={2}
                value={reflectionForm.learned}
                onChange={(e) => setReflectionForm({ ...reflectionForm, learned: e.target.value })}
                placeholder="e.g. Feedback stability depends directly on phase margin > 45 degrees."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#171717] dark:text-neutral-300 mb-1">
                4. What should I improve tomorrow?
              </label>
              <textarea
                rows={2}
                value={reflectionForm.improveTomorrow}
                onChange={(e) => setReflectionForm({ ...reflectionForm, improveTomorrow: e.target.value })}
                placeholder="e.g. Do not check phone during the 4:15 AM short break."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#171717] dark:text-neutral-300 mb-1">
                5. How did I take care of myself today?
              </label>
              <textarea
                rows={2}
                value={reflectionForm.selfCare}
                onChange={(e) => setReflectionForm({ ...reflectionForm, selfCare: e.target.value })}
                placeholder="e.g. Drank 3L water, slept 6 hours, took proper eye rests."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#181818]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] text-white font-bold transition active:scale-[0.98]"
              >
                Save Reflection & Close Day
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 9. BACKUP & SETTINGS */}
      {activeSection === 'backup' && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
              <h3 className="text-lg font-black text-[#171717] dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>DATA BACKUP & SETTINGS</span>
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
              Full offline privacy. Export your timetable progress, sessions, and notes as JSON anytime.
            </p>
          </div>

          {/* Export / Import */}
          <div className="p-4 bg-[#F8F8F8] dark:bg-[#1F1F1F] rounded-xl border border-[#E5E7EB] dark:border-neutral-750 space-y-3 text-xs">
            <div className="font-bold text-[#171717] dark:text-white">Export & Restore</div>

            {statusNotice && (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs font-semibold ${
                  statusNotice.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {statusNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{statusNotice.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusNotice(null)}
                  className="p-1 hover:opacity-75"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold rounded-xl flex items-center gap-1.5 transition active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Export My Data (JSON)</span>
              </button>

              <label className="px-4 py-2 border border-[#E5E7EB] dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 hover:border-[#D32F2F] transition">
                <Upload className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Exam Period Date Simulation / Preview */}
          <div className="p-4 bg-[#F8F8F8] dark:bg-[#1F1F1F] rounded-xl border border-[#E5E7EB] dark:border-neutral-750 space-y-3 text-xs">
            <div className="font-bold text-[#171717] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D32F2F] dark:text-[#EF4444]" />
              <span>Date Simulation & Preview</span>
            </div>
            <p className="text-[#6B7280] dark:text-neutral-400 text-[11px] font-medium">
              Preview how the dashboard calculates remaining exams and countdowns on specific examination days.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    simulatedDate: null,
                  })
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                  settings.simulatedDate === null
                    ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
                    : 'bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-300'
                }`}
              >
                Live Device Clock
              </button>

              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    simulatedDate: '2026-10-01T08:30:00',
                  })
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                  settings.simulatedDate?.startsWith('2026-10-01')
                    ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
                    : 'bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-300'
                }`}
              >
                Oct 1, 2026 (EEE 356 Eve)
              </button>

              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    simulatedDate: '2026-10-02T13:00:00',
                  })
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                  settings.simulatedDate?.startsWith('2026-10-02')
                    ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
                    : 'bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-300'
                }`}
              >
                Oct 2, 2026 (Exam Day)
              </button>

              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    simulatedDate: '2026-10-06T09:00:00',
                  })
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                  settings.simulatedDate?.startsWith('2026-10-06')
                    ? 'bg-[#D32F2F] dark:bg-[#EF4444] text-white shadow-xs'
                    : 'bg-white dark:bg-[#181818] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-neutral-300'
                }`}
              >
                Oct 6, 2026 (EEE 362 Prep)
              </button>
            </div>
          </div>

          {/* Reset App */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-neutral-400">Need to start fresh?</span>
            <button
              onClick={handleResetData}
              className="text-[#D32F2F] dark:text-[#EF4444] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Data to Defaults</span>
            </button>
          </div>

          {/* Inline Confirmation Card for Reset */}
          {isResetConfirmOpen && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#D32F2F] dark:text-[#EF4444] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-red-900 dark:text-red-200">
                    Reset all timetable & study data?
                  </h4>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    This will restore your 300L exam timetable, past questions, and settings back to default. You can export a backup first if needed.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-700 bg-white dark:bg-[#1E1E1E] text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yes, Reset to Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
