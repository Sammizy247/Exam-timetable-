import React, { useState } from 'react';
import { useExamDashboard } from './hooks/useExamDashboard';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { NextExamCard } from './components/NextExamCard';
import { HourlyQuoteCard } from './components/HourlyQuoteCard';
import { TodaysMission } from './components/TodaysMission';
import { DailyProgressBar } from './components/DailyProgressBar';
import { StreakStatsCard } from './components/StreakStatsCard';
import { ExamsView } from './components/ExamsView';
import { StudyView } from './components/StudyView';
import { ProgressView } from './components/ProgressView';
import { MoreView } from './components/MoreView';
import { DateSimulatorBanner } from './components/DateSimulatorBanner';
import { AIStudyLabView } from './components/studylab/AIStudyLabView';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeStudySubject, setActiveStudySubject] = useState<string | undefined>(undefined);

  const {
    effectiveDate,
    greeting,
    exams,
    completedExams,
    remainingCount,
    nextExam,
    inProgressExam,
    countdownDisplay,
    hoursRemaining,
    operationalMode,
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
    updateSchedule,
    updateReadingLogs,
    updateSkillLogs,
    updateReflections,
    updateSettings,
    updateDigitalDiscipline,
    updateSpiritual,
  } = useExamDashboard();

  // Handle starting study for a specific course from NextExamCard
  const handleStartStudyForSubject = (subjectCode: string) => {
    setActiveStudySubject(subjectCode);
    setCurrentTab('study');
  };

  const handleViewSubjectDetails = (examId: string) => {
    setCurrentTab('exams');
  };

  const availableSubjects = exams.map((e) => e.code);

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0F0F0F] text-[#171717] dark:text-[#FFFFFF] flex flex-col font-sans transition-colors">
      {/* Date Simulation Banner (if active) */}
      <DateSimulatorBanner
        isSimulated={!!settings.simulatedDate}
        dateDisplay={effectiveDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
        onResetToLive={() =>
          updateSettings({
            ...settings,
            simulatedDate: null,
          })
        }
        onSelectDate={(iso) =>
          updateSettings({
            ...settings,
            simulatedDate: iso,
          })
        }
      />

      {/* Main Top Header */}
      <Header
        settings={settings}
        effectiveDate={effectiveDate}
        greeting={greeting}
        operationalMode={operationalMode}
        onUpdateSettings={updateSettings}
        onOpenDateSimulation={() => {
          setCurrentTab('more');
        }}
      />

      {/* Main Container - Optimized for Mobile (360px–430px) & Desktop */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 space-y-4 sm:space-y-6">
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* 1. Hero Next Exam Card */}
            <NextExamCard
              nextExam={nextExam}
              inProgressExam={inProgressExam}
              countdownDisplay={countdownDisplay}
              hoursRemaining={hoursRemaining}
              remainingCount={remainingCount}
              operationalMode={operationalMode}
              onStartStudyForSubject={handleStartStudyForSubject}
              onViewSubjectDetails={handleViewSubjectDetails}
              onStudyWithAi={(code) => {
                setActiveStudySubject(code);
                setCurrentTab('ai-study');
              }}
            />

            {/* Quick AI Study Lab Portal Card */}
            <div className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1F1] dark:bg-[#2B1616] text-[#D32F2F] dark:text-[#EF4444] flex items-center justify-center font-bold shrink-0 border border-[#D32F2F]/20 mt-0.5 sm:mt-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#D32F2F] dark:text-[#EF4444] tracking-wide">
                      AI STUDY LAB
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#D32F2F] text-white">
                      NEW
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#171717] dark:text-white mt-0.5">
                    Upload Exam PDFs, Generate Study Notes & Interactive Quizzes
                  </h3>
                  <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">
                    Includes ready revision packs for {nextExam?.code || 'EEE 356'} with formula sheets, flashcards & mock exams.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveStudySubject(nextExam?.code || 'EEE 356');
                  setCurrentTab('ai-study');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Open Study Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Today's Mission (Core Academic Tasks) */}
            <TodaysMission
              tasks={tasks}
              availableSubjects={availableSubjects}
              onToggleTask={toggleTask}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
            />

            {/* 3. Daily Progress with Weighted Categories */}
            <DailyProgressBar
              progress={dailyProgress}
              weights={settings.weights}
              onUpdateWeights={(newWeights) =>
                updateSettings({
                  ...settings,
                  weights: newWeights,
                })
              }
            />

            {/* 4. Hourly Motivational Nature Quote */}
            <HourlyQuoteCard
              quote={hourlyQuote}
              currentHour={effectiveDate.getHours()}
            />

            {/* 5. Streak & Consistency Summary */}
            <StreakStatsCard
              streaks={streaks}
              examsCompletedCount={completedExams.length}
            />
          </div>
        )}

        {/* TAB 2: EXAMS */}
        {currentTab === 'exams' && (
          <div className="animate-in fade-in duration-200">
            <ExamsView
              exams={exams}
              onToggleTopicUnderstood={toggleTopicUnderstood}
              onAddTopic={addTopicToExam}
              onUpdatePastQuestions={updatePastQuestions}
            />
          </div>
        )}

        {/* TAB: AI STUDY LAB */}
        {currentTab === 'ai-study' && (
          <div className="animate-in fade-in duration-200">
            <AIStudyLabView
              exams={exams}
              initialCourseFilter={activeStudySubject}
              onAddWeakAreaToDashboard={(subject, topic, difficulty, notes) =>
                addWeakArea({
                  subject,
                  topic,
                  difficulty,
                  notes,
                  status: 'Needs Review',
                })
              }
            />
          </div>
        )}

        {/* TAB 3: STUDY */}
        {currentTab === 'study' && (
          <div className="animate-in fade-in duration-200">
            <StudyView
              exams={exams}
              sessions={sessions}
              weakAreas={weakAreas}
              defaultSubject={activeStudySubject}
              onLogSession={logStudySession}
              onAddWeakArea={addWeakArea}
              onUpdateWeakAreaStatus={updateWeakAreaStatus}
              onDeleteWeakArea={deleteWeakArea}
              onUpdatePastQuestions={updatePastQuestions}
              onOpenAiStudyLab={(code) => {
                if (code) setActiveStudySubject(code);
                setCurrentTab('ai-study');
              }}
            />
          </div>
        )}

        {/* TAB 4: PROGRESS */}
        {currentTab === 'progress' && (
          <div className="animate-in fade-in duration-200">
            <ProgressView
              streaks={streaks}
              exams={exams}
              sessions={sessions}
              reflections={reflections}
            />
          </div>
        )}

        {/* TAB 5: MORE */}
        {currentTab === 'more' && (
          <div className="animate-in fade-in duration-200">
            <MoreView
              tasks={tasks}
              schedule={schedule}
              readingLogs={readingLogs}
              skillLogs={skillLogs}
              reflections={reflections}
              digitalDiscipline={digitalDiscipline}
              spiritual={spiritual}
              settings={settings}
              effectiveDate={effectiveDate}
              onUpdateSchedule={updateSchedule}
              onUpdateReadingLogs={updateReadingLogs}
              onUpdateSkillLogs={updateSkillLogs}
              onUpdateReflections={updateReflections}
              onUpdateDigitalDiscipline={updateDigitalDiscipline}
              onUpdateSpiritual={updateSpiritual}
              onUpdateSettings={updateSettings}
            />
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        examsRemaining={remainingCount}
      />
    </div>
  );
}
