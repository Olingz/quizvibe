export interface QuizResult {
  id?: string;
  playerName: string;
  quizName: string;
  correctAnswers: number;
  totalQuestions: number;
  date: Date;
  quizUrl?: string;
} 