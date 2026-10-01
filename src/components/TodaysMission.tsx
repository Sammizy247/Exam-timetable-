import React, { useState } from 'react';
import { Priority, Task, TaskCategory } from '../types/dashboard';
import { Plus, Check, Trash2, Clock, BookOpen, Edit2, X } from 'lucide-react';

interface TodaysMissionProps {
  tasks: Task[];
  availableSubjects: string[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, partial: Partial<Task>) => void;
}

export const TodaysMission: React.FC<TodaysMissionProps> = ({
  tasks,
  availableSubjects,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onEditTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // New task form state
  const [name, setName] = useState('');
  const [subject, setSubject] = useState(availableSubjects[0] || 'EEE 356');
  const [priority, setPriority] = useState<Priority>('high');
  const [duration, setDuration] = useState<number>(60);
  const [category, setCategory] = useState<TaskCategory>('academic');

  // Edit task state
  const [editName, setEditName] = useState('');
  const [editDuration, setEditDuration] = useState<number>(60);
  const [editPriority, setEditPriority] = useState<Priority>('high');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddTask({
      name: name.trim(),
      subject,
      category,
      priority,
      estimatedMinutes: Number(duration) || 30,
      completed: false,
      isDailyMission: true,
    });

    setName('');
    setShowAddForm(false);
  };

  const startEdit = (t: Task) => {
    setEditingTaskId(t.id);
    setEditName(t.name);
    setEditDuration(t.estimatedMinutes);
    setEditPriority(t.priority);
  };

  const saveEdit = (id: string) => {
    onEditTask(id, {
      name: editName.trim(),
      estimatedMinutes: Number(editDuration) || 30,
      priority: editPriority,
    });
    setEditingTaskId(null);
  };

  const academicTasks = tasks.filter((t) => t.category === 'academic');
  const secondaryTasks = tasks.filter((t) => t.category !== 'academic');

  const completedAcademicCount = academicTasks.filter((t) => t.completed).length;

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] dark:border-neutral-800 shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-colors">
      {/* Header with Red Accent */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#D32F2F] dark:bg-[#EF4444]" />
            <h2 className="text-base sm:text-lg font-black tracking-tight text-[#171717] dark:text-white">
              TODAY'S MISSION
            </h2>
            <span className="text-xs font-mono font-bold text-[#6B7280] dark:text-[#A3A3A3] ml-1">
              ({completedAcademicCount}/{academicTasks.length})
            </span>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 font-medium">
            Strict academic priorities for maximum retention
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="min-h-[38px] px-3 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-xs"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showAddForm ? 'Cancel' : '+ ADD TASK'}</span>
        </button>
      </div>

      {/* Quick Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="mb-4 p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#1F1F1F] border border-[#E5E7EB] dark:border-neutral-700 text-xs space-y-3"
        >
          <div className="font-bold text-[#171717] dark:text-white">
            Create High-Priority Mission
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-1">
              Task Description
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Past Questions — 2023 Q2 on Feedback Stability"
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white font-medium"
              >
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white font-medium"
              >
                <option value="academic">Academic (Primary)</option>
                <option value="reading">Reading</option>
                <option value="skills">Digital Skill</option>
                <option value="communication">Communication</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white font-medium"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-neutral-600 text-[#6B7280] dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold transition active:scale-[0.98]"
            >
              Add Mission
            </button>
          </div>
        </form>
      )}

      {/* Academic Priority Group */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#D32F2F] dark:text-[#EF4444] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Priority Tasks</span>
        </div>

        {academicTasks.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-400">
            No academic tasks queued for today. Tap "+ ADD TASK" above.
          </div>
        ) : (
          academicTasks.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-xl border transition-all ${
                t.completed
                  ? 'bg-neutral-50/70 dark:bg-[#151515] border-[#E5E7EB] dark:border-neutral-850 opacity-60'
                  : 'bg-white dark:bg-[#1C1C1C] border-[#E5E7EB] dark:border-neutral-800 hover:border-[#D32F2F]/40 shadow-xs'
              }`}
            >
              {editingTaskId === t.id ? (
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#181818] text-[#171717] dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editDuration}
                      onChange={(e) => setEditDuration(Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#181818]"
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as Priority)}
                      className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#181818]"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="px-3 py-1 bg-[#D32F2F] text-white font-bold rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="px-2 py-1 border border-neutral-400 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Red & White Checkbox */}
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className={`min-w-[22px] min-h-[22px] mt-0.5 rounded-md flex items-center justify-center transition-all active:scale-90 ${
                        t.completed
                          ? 'bg-[#D32F2F] dark:bg-[#EF4444] border-2 border-[#D32F2F] dark:border-[#EF4444] text-white shadow-xs'
                          : 'border-2 border-[#D32F2F] dark:border-[#EF4444] hover:bg-[#FFF1F1] dark:hover:bg-[#EF4444]/10 bg-white dark:bg-[#181818]'
                      }`}
                      aria-label={t.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {t.completed && <Check className="w-3.5 h-3.5 stroke-[3] text-white animate-in zoom-in-50 duration-150" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-xs sm:text-sm font-semibold leading-snug break-words transition-colors ${
                            t.completed
                              ? 'line-through text-neutral-400 dark:text-neutral-500'
                              : 'text-[#171717] dark:text-white'
                          }`}
                        >
                          {t.name}
                        </span>
                      </div>

                      {/* Metadata: Subject, Duration, Priority */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B7280] dark:text-[#A3A3A3] flex-wrap font-medium">
                        <span className="font-bold text-[#D32F2F] dark:text-[#EF4444] font-mono">
                          {t.subject}
                        </span>
                        <span className="text-neutral-300 dark:text-neutral-700">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {t.estimatedMinutes}m
                        </span>
                        <span className="text-neutral-300 dark:text-neutral-700">·</span>
                        <span
                          className={`font-semibold ${
                            t.priority === 'high'
                              ? 'text-[#D32F2F] dark:text-[#EF4444]'
                              : 'text-neutral-500'
                          }`}
                        >
                          {t.priority === 'high' ? 'High' : 'Normal'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(t)}
                      className="p-1 hover:text-[#D32F2F] text-neutral-400"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1 hover:text-rose-600 text-neutral-400"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Secondary Tasks (if any) */}
      {secondaryTasks.length > 0 && (
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#666666] dark:text-[#A3A3A3]">
            Secondary Habit Check (Non-competing)
          </div>
          {secondaryTasks.map((t) => (
            <div
              key={t.id}
              className="p-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#1E1E1E] border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => onToggleTask(t.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                    t.completed
                      ? 'bg-neutral-700 text-white border-neutral-700'
                      : 'border-neutral-400 bg-white dark:bg-[#181818]'
                  }`}
                >
                  {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span
                  className={`truncate font-medium ${
                    t.completed ? 'line-through text-neutral-400' : 'text-[#171717] dark:text-neutral-300'
                  }`}
                >
                  {t.name} ({t.subject})
                </span>
              </div>
              <button
                onClick={() => onDeleteTask(t.id)}
                className="text-neutral-400 hover:text-rose-500 p-1 shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
