"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizResult } from "@/types/quiz";
import { getQuizResults, saveQuizResults } from "@/lib/storage/quiz";

export function useQuizResults() {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    setResults(getQuizResults());
  }, []);

  const addResult = useCallback(
    (score: number, total: number) => {
      const newResult: QuizResult = {
        id: crypto.randomUUID(),
        score,
        total,
        createdAt: new Date().toISOString(),
      };
      const next = [newResult, ...results];
      setResults(next);
      saveQuizResults(next);
    },
    [results]
  );

  return { results, addResult };
}
