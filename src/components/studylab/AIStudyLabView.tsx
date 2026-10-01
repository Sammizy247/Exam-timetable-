import React, { useState } from 'react';
import {
  FileText,
  Upload,
  BookOpen,
  HelpCircle,
  Layers,
  FileCheck,
  Trash2,
  Sparkles,
  Plus,
  AlertTriangle,
  ArrowRight,
  Search,
  CheckCircle2,
  Zap,
  X,
} from 'lucide-react';
import { StudyLabMaterial } from '../../types/studyLab';
import { UploadMaterialModal } from './UploadMaterialModal';
import { StudyNotesViewer } from './StudyNotesViewer';
import { InteractiveQuizViewer } from './InteractiveQuizViewer';
import { FlashcardsViewer } from './FlashcardsViewer';
import { MockExamViewer } from './MockExamViewer';
import { TopicExplorerViewer } from './TopicExplorerViewer';
import { PastQuestionsViewer } from './PastQuestionsViewer';
import { QuickRevisionViewer } from './QuickRevisionViewer';
import { AIChatViewer } from './AIChatViewer';
import {
  getStudyMaterials,
  addStudyMaterial,
  deleteStudyMaterial,
  updateStudyMaterial,
} from '../../utils/studyLabStorage';
import { Exam } from '../../types/dashboard';

interface AIStudyLabViewProps {
  exams: Exam[];
  onAddWeakAreaToDashboard?: (subject: string, topic: string, difficulty: 'High' | 'Medium' | 'Low', notes: string) => void;
  initialCourseFilter?: string;
}

type ActiveViewMode =
  | 'list'
  | 'topics'
  | 'notes'
  | 'quiz'
  | 'flashcards'
  | 'mock-exam'
  | 'past-questions'
  | 'quick-revision'
  | 'chat';

export const AIStudyLabView: React.FC<AIStudyLabViewProps> = ({
  exams,
  onAddWeakAreaToDashboard,
  initialCourseFilter,
}) => {
  const [materials, setMaterials] = useState<StudyLabMaterial[]>(() => getStudyMaterials());
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>(initialCourseFilter || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<{ id: string; fileName: string } | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<StudyLabMaterial | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<ActiveViewMode>('list');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Show a temporary success message
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleUploadSuccess = (newMaterial: StudyLabMaterial) => {
    const updated = addStudyMaterial(newMaterial);
    setMaterials(updated);
    setIsUploadModalOpen(false);
    triggerToast(`"${newMaterial.fileName}" analyzed and ready for study!`);
  };

  const handleDeleteMaterial = (id: string, fileName: string) => {
    setMaterialToDelete({ id, fileName });
  };

  const handleConfirmDelete = () => {
    if (!materialToDelete) return;
    const { id, fileName } = materialToDelete;
    const updated = deleteStudyMaterial(id);
    setMaterials(updated);
    if (activeMaterial?.id === id) {
      setActiveMaterial(null);
      setActiveViewMode('list');
    }
    triggerToast(`Removed "${fileName}"`);
    setMaterialToDelete(null);
  };

  const handleOpenStudyTool = (material: StudyLabMaterial, mode: ActiveViewMode) => {
    setActiveMaterial(material);
    setActiveViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateMaterialData = (updated: StudyLabMaterial) => {
    const newList = updateStudyMaterial(updated);
    setMaterials(newList);
    setActiveMaterial(updated);
  };

  // Sync identified weak areas to the main dashboard
  const handleSyncWeakArea = (subject: string, topic: string) => {
    if (onAddWeakAreaToDashboard) {
      onAddWeakAreaToDashboard(
        subject,
        topic,
        'High',
        'Identified from AI Study Lab quiz & mock exam diagnostic.'
      );
      triggerToast(`Added "${topic}" to your Focus Weak Areas!`);
    }
  };

  // Filter materials
  const courseList = Array.from(new Set(materials.map((m) => m.courseCode)));
  const filteredMaterials = materials.filter((m) => {
    const matchesCourse = selectedCourseFilter === 'ALL' || m.courseCode === selectedCourseFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#171717] dark:bg-white text-white dark:text-[#171717] px-4 py-3 rounded-xl shadow-lg border border-[#D32F2F] text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#D32F2F]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* SUBVIEW NAVIGATION (WHEN INSIDE A STUDY TOOL) */}
      {activeViewMode !== 'list' && activeMaterial && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-4 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setActiveViewMode('list')}
            className="flex items-center gap-2 text-xs font-bold text-[#6B7280] dark:text-neutral-400 hover:text-[#D32F2F] transition-colors"
          >
            ← Back to Study Lab Materials
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveViewMode('topics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'topics'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Topics Found
            </button>
            <button
              onClick={() => setActiveViewMode('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'notes'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Study Notes
            </button>
            <button
              onClick={() => setActiveViewMode('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'quiz'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Interactive Quiz ({activeMaterial.quizData?.length || 0})
            </button>
            <button
              onClick={() => setActiveViewMode('past-questions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'past-questions'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Past Questions
            </button>
            <button
              onClick={() => setActiveViewMode('mock-exam')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'mock-exam'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Exam Simulation
            </button>
            <button
              onClick={() => setActiveViewMode('flashcards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'flashcards'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Flashcards ({activeMaterial.flashcards?.length || 0})
            </button>
            <button
              onClick={() => setActiveViewMode('quick-revision')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'quick-revision'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Quick Revision
            </button>
            <button
              onClick={() => setActiveViewMode('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeViewMode === 'chat'
                  ? 'bg-[#D32F2F] text-white shadow-xs'
                  : 'bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-white hover:border-[#D32F2F]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Chat
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE SUBVIEWS */}
      {activeViewMode === 'topics' && activeMaterial && (
        <TopicExplorerViewer
          material={activeMaterial}
          onSyncWeakArea={handleSyncWeakArea}
        />
      )}

      {activeViewMode === 'notes' && activeMaterial && (
        <StudyNotesViewer
          material={activeMaterial}
          onStartQuiz={() => setActiveViewMode('quiz')}
          onStartMockExam={() => setActiveViewMode('mock-exam')}
          onSyncWeakArea={handleSyncWeakArea}
        />
      )}

      {activeViewMode === 'quiz' && activeMaterial && (
        <InteractiveQuizViewer
          material={activeMaterial}
          onSyncWeakArea={handleSyncWeakArea}
          onRetake={() => {}}
        />
      )}

      {activeViewMode === 'past-questions' && activeMaterial && (
        <PastQuestionsViewer
          material={activeMaterial}
          onSyncWeakArea={handleSyncWeakArea}
        />
      )}

      {activeViewMode === 'flashcards' && activeMaterial && (
        <FlashcardsViewer
          material={activeMaterial}
          onUpdateMaterial={handleUpdateMaterialData}
        />
      )}

      {activeViewMode === 'mock-exam' && activeMaterial && (
        <MockExamViewer
          material={activeMaterial}
          onSyncWeakArea={handleSyncWeakArea}
        />
      )}

      {activeViewMode === 'quick-revision' && activeMaterial && (
        <QuickRevisionViewer
          material={activeMaterial}
          onSyncWeakArea={handleSyncWeakArea}
        />
      )}

      {activeViewMode === 'chat' && activeMaterial && (
        <AIChatViewer material={activeMaterial} />
      )}

      {/* DEFAULT VIEW: STUDY LAB HOME */}
      {activeViewMode === 'list' && (
        <>
          {/* Hero Banner in Red + White visual identity */}
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden">
            {/* Top red accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#D32F2F]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1F1] dark:bg-[#2A1515] text-[#D32F2F] dark:text-[#EF4444] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] dark:text-white">
                    AI STUDY LAB
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D32F2F] text-white">
                    300L EE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B7280] dark:text-neutral-400 font-medium">
                  Upload your materials. Study smarter. Test yourself.
                </p>
                <p className="text-[11px] text-[#6B7280] dark:text-neutral-400 mt-1">
                  Turns academic lecture PDFs, past question papers, and handouts into high-yield exam notes, flashcards, interactive quizzes, and timed mock papers.
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                + UPLOAD PDF
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-[#181818] rounded-2xl p-3 sm:p-4 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Course selection pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCourseFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    selectedCourseFilter === 'ALL'
                      ? 'bg-[#D32F2F] text-white shadow-xs'
                      : 'bg-[#F8F8F8] dark:bg-[#202020] text-[#6B7280] dark:text-neutral-300 hover:text-[#171717]'
                  }`}
                >
                  ALL COURSES ({materials.length})
                </button>
                {courseList.map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedCourseFilter(code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      selectedCourseFilter === code
                        ? 'bg-[#D32F2F] text-white shadow-xs'
                        : 'bg-[#F8F8F8] dark:bg-[#202020] text-[#6B7280] dark:text-neutral-300 hover:text-[#171717]'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search materials or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F8F8F8] dark:bg-[#202020] border border-[#E5E7EB] dark:border-neutral-700 text-[#171717] dark:text-white focus:outline-none focus:border-[#D32F2F]"
                />
              </div>
            </div>
          </div>

          {/* List of Materials */}
          <div className="space-y-3">
            {filteredMaterials.length === 0 ? (
              <div className="bg-white dark:bg-[#181818] rounded-2xl p-8 border border-[#E5E7EB] dark:border-neutral-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FFF1F1] text-[#D32F2F] mx-auto flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#171717] dark:text-white">
                  No materials found for this course
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  Upload your lecture slides, past question PDF, or course handout to generate instant study tools.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#D32F2F] text-white text-xs font-bold shadow-xs hover:bg-[#B71C1C] transition-colors"
                >
                  + Upload Course PDF
                </button>
              </div>
            ) : (
              filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-white dark:bg-[#181818] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all space-y-3 relative group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF1F1] dark:bg-[#2B1717] text-[#D32F2F] dark:text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5 border border-[#D32F2F]/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-[#D32F2F] dark:text-[#EF4444]">
                            {mat.courseCode}
                          </span>
                          <span className="text-xs font-bold text-[#171717] dark:text-white">
                            {mat.courseTitle}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Processed ✓
                          </span>
                        </div>
                        <h4 className="text-xs text-[#171717] dark:text-neutral-200 font-semibold mt-0.5 line-clamp-1">
                          {mat.fileName}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-[#6B7280] dark:text-neutral-400 mt-1">
                          <span>Size: {mat.fileSizeFormatted}</span>
                          <span>•</span>
                          <span>Pages: {mat.pageCount || '~24'}</span>
                          <span>•</span>
                          <span>
                            Uploaded:{' '}
                            {new Date(mat.uploadedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMaterial(mat.id, mat.fileName)}
                      className="text-[#6B7280] hover:text-[#D32F2F] p-1.5 rounded-lg hover:bg-[#FFF1F1] dark:hover:bg-[#291717] transition-colors"
                      title="Delete material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Identified Weak / High-Yield Areas badge row */}
                  {mat.weakAreasIdentified && mat.weakAreasIdentified.length > 0 && (
                    <div className="pt-2 border-t border-[#E5E7EB] dark:border-neutral-800 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#6B7280] dark:text-neutral-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#D32F2F]" />
                        Key Exam Focus:
                      </span>
                      {mat.weakAreasIdentified.map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => handleSyncWeakArea(mat.courseCode, topic)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF1F1] dark:bg-[#251515] text-[#D32F2F] dark:text-[#EF4444] font-medium border border-[#D32F2F]/20 hover:bg-[#D32F2F] hover:text-white transition-colors cursor-pointer"
                          title="Click to track in your main Exam Focus list"
                        >
                          {topic} +
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons: [Study] [View Notes] [Quiz Me] [Past Questions] [Revision] [AI Chat] */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleOpenStudyTool(mat, 'topics')}
                      className="py-2 px-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Study
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'notes')}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-[#202020] text-[#171717] dark:text-white border border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Notes
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'quiz')}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-[#202020] text-[#D32F2F] dark:text-[#EF4444] border border-[#D32F2F] hover:bg-[#FFF1F1] dark:hover:bg-[#251515] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Quiz Me ({mat.quizData?.length || 0})
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'past-questions')}
                      className="py-2 px-3 rounded-xl bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-neutral-200 border border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Past Questions
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'quick-revision')}
                      className="py-2 px-3 rounded-xl bg-[#F8F8F8] dark:bg-[#222] text-[#171717] dark:text-neutral-200 border border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Quick Revision
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'chat')}
                      className="py-2 px-3 rounded-xl bg-[#FFF1F1] dark:bg-[#2A1515] text-[#D32F2F] dark:text-[#EF4444] border border-[#D32F2F]/30 hover:border-[#D32F2F] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Chat
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'flashcards')}
                      className="py-2 px-3 rounded-xl bg-[#F8F8F8] dark:bg-[#222] text-[#6B7280] dark:text-neutral-400 border border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Cards ({mat.flashcards?.length || 0})
                    </button>

                    <button
                      onClick={() => handleOpenStudyTool(mat, 'mock-exam')}
                      className="py-2 px-3 rounded-xl bg-[#F8F8F8] dark:bg-[#222] text-[#6B7280] dark:text-neutral-400 border border-[#E5E7EB] dark:border-neutral-700 hover:border-[#D32F2F] text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      Mock Exam
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <UploadMaterialModal
          exams={exams}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* DELETE MATERIAL CONFIRMATION MODAL */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#181818] rounded-2xl max-w-sm w-full p-5 border border-[#E5E7EB] dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-[#D32F2F] dark:text-[#EF4444] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#171717] dark:text-white">
                  Remove Study Material?
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-neutral-400 mt-1">
                  Are you sure you want to remove <strong className="text-[#171717] dark:text-white">"{materialToDelete.fileName}"</strong>? This will clear its generated notes and questions from this device.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#171717] dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Material</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
