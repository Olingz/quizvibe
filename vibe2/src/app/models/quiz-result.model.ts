export interface QuizResult {
  id?: string;
  playerName: string;
  quizName: string;
  category: string;
  weekNumber: number;
  correctAnswers: number;
  totalQuestions: number;
  answerSequence: boolean[]; // true for correct, false for incorrect
  date: Date;
  quizUrl?: string;
} 