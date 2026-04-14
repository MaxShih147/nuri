import { QuizResult } from "@/types/quiz";

const STORAGE_KEY = "nuri_quiz_results";

export function getQuizResults(): QuizResult[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function saveQuizResults(results: QuizResult[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}
