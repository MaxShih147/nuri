import { VocabularyItem } from "@/types/vocabulary";
import { QuizQuestion } from "@/types/quiz";

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuiz(
  vocabulary: VocabularyItem[],
  count: number = 10
): QuizQuestion[] {
  if (vocabulary.length < 4) return [];

  const selected = shuffle(vocabulary).slice(0, Math.min(count, vocabulary.length));

  return selected.map((item) => {
    const wrongPool = vocabulary.filter((v) => v.id !== item.id);
    const wrongAnswers = shuffle(wrongPool)
      .slice(0, 3)
      .map((v) => v.meaning);

    const options = shuffle([item.meaning, ...wrongAnswers]);

    return {
      id: item.id,
      word: item.word,
      correctAnswer: item.meaning,
      options,
    };
  });
}
