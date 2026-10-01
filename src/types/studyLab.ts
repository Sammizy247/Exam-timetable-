export interface StudyLabTopic {
  id: string;
  title: string;
  subtopics: string[];
  keyConcepts: string[];
  examSignificance: 'Very High' | 'High' | 'Medium';
}

export interface StudyLabFormula {
  id: string;
  name: string;
  equation: string;
  description: string;
  parameters: string[];
  examTip: string;
}

export interface StudyLabDefinition {
  id: string;
  term: string;
  definition: string;
  examContext: string;
}

export interface StudyLabPrinciple {
  id: string;
  name: string;
  explanation: string;
  engineeringApplication: string;
}

export interface StudyLabWorkedExample {
  title: string;
  problem: string;
  stepByStepSolution: string[];
  finalAnswer: string;
  keyTrick: string;
}

export interface StudyLabNotes {
  summary: string;
  keyTakeaways: string[];
  topics: StudyLabTopic[];
  definitions: StudyLabDefinition[];
  formulas: StudyLabFormula[];
  principles: StudyLabPrinciple[];
  examPitfalls: Array<{ pitfall: string; advice: string }>;
  workedExamples: StudyLabWorkedExample[];
}

export interface StudyLabFlashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
  category: 'formula' | 'definition' | 'concept' | 'theorem';
  mastered?: boolean;
}

export interface StudyLabQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  wrongOptionExplanations: Record<number, string>;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface StudyLabMockExamQuestion {
  id: string;
  number: number;
  section: 'Section A (Objective)' | 'Section B (Theory & Calculations)';
  questionText: string;
  type: 'multiple_choice' | 'structured_theory';
  options?: string[];
  correctAnswer: string | number;
  marks: number;
  topic: string;
  modelSolution: string;
  markingScheme: string[];
}

export interface StudyLabMockExam {
  id: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
  questions: StudyLabMockExamQuestion[];
}

export interface StudyLabMaterial {
  id: string;
  courseCode: string;
  courseTitle: string;
  fileName: string;
  fileSizeFormatted: string;
  pageCount?: number;
  uploadedAt: string;
  status: 'processing' | 'processed' | 'error';
  processingStep?: string;
  notesData: StudyLabNotes;
  quizData: StudyLabQuizQuestion[];
  flashcards: StudyLabFlashcard[];
  mockExam: StudyLabMockExam;
  weakAreasIdentified: string[];
}
