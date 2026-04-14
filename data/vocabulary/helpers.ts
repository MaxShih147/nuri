import { VocabularyItem } from "@/types/vocabulary";

const now = new Date().toISOString();
let globalId = 0;

export function createVocab(
  unit: string,
  subUnit: string,
  word: string,
  romanization: string,
  meaning: string,
  partOfSpeech: string,
  example: string,
  exampleMeaning: string,
  difficulty: "easy" | "medium" | "hard" = "easy"
): VocabularyItem {
  return {
    id: `v-${++globalId}`,
    word,
    romanization,
    meaning,
    partOfSpeech,
    example,
    exampleMeaning,
    difficulty,
    unit,
    subUnit,
    favorite: false,
    learned: false,
    familiarity: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function resetId() {
  globalId = 0;
}
