export type QuizResult = {
  id: string;
  score: number;
  total: number;
  createdAt: string;
};

export type QuizQuestion = {
  id: string;
  word: string;
  correctAnswer: string;
  options: string[];
};
