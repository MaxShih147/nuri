import { VocabularyItem } from "@/types/vocabulary";
import { seedVocabulary } from "@/data/seedVocabulary";

const STORAGE_KEY = "nuri_vocabulary";

export function getVocabulary(): VocabularyItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveVocabulary(seedVocabulary);
    return seedVocabulary;
  }
  return JSON.parse(raw);
}

export function saveVocabulary(items: VocabularyItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
