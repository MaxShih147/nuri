export type VocabularyItem = {
  id: string;
  word: string;
  romanization: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  exampleMeaning?: string;
  difficulty?: "easy" | "medium" | "hard";
  unit?: string;
  subUnit?: string;
  favorite: boolean;
  learned: boolean;
  familiarity: number; // 0–5
  createdAt: string;
  updatedAt: string;
};

export type UnitInfo = {
  id: string;
  name: string;
  description: string;
  order: number;
};
