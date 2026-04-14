import { VocabularyItem } from "@/types/vocabulary";
import { allVocabulary } from "@/data/vocabulary";

const STORAGE_KEY = "nuri_vocabulary";
const VERSION_KEY = "nuri_vocabulary_version";
const CURRENT_VERSION = "2";

export function getVocabulary(): VocabularyItem[] {
  if (typeof window === "undefined") return [];
  const version = localStorage.getItem(VERSION_KEY);
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw || version !== CURRENT_VERSION) {
    saveVocabulary(allVocabulary);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    return allVocabulary;
  }
  return JSON.parse(raw);
}

export function saveVocabulary(items: VocabularyItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
