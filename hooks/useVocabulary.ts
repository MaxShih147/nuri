"use client";

import { useState, useEffect, useCallback } from "react";
import { VocabularyItem } from "@/types/vocabulary";
import { getVocabulary, saveVocabulary } from "@/lib/storage/vocabulary";

export function useVocabulary() {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getVocabulary());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: VocabularyItem[]) => {
    setItems(next);
    saveVocabulary(next);
  }, []);

  const addItem = useCallback(
    (item: Omit<VocabularyItem, "id" | "createdAt" | "updatedAt" | "favorite" | "learned" | "familiarity">) => {
      const now = new Date().toISOString();
      const newItem: VocabularyItem = {
        ...item,
        id: crypto.randomUUID(),
        favorite: false,
        learned: false,
        familiarity: 0,
        createdAt: now,
        updatedAt: now,
      };
      persist([newItem, ...items]);
    },
    [items, persist]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<VocabularyItem>) => {
      const next = items.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
      persist(next);
    },
    [items, persist]
  );

  const deleteItem = useCallback(
    (id: string) => {
      persist(items.filter((item) => item.id !== id));
    },
    [items, persist]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      updateItem(id, { favorite: !items.find((i) => i.id === id)?.favorite });
    },
    [items, updateItem]
  );

  const toggleLearned = useCallback(
    (id: string) => {
      updateItem(id, { learned: !items.find((i) => i.id === id)?.learned });
    },
    [items, updateItem]
  );

  const updateFamiliarity = useCallback(
    (id: string, delta: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const next = Math.max(0, Math.min(5, item.familiarity + delta));
      updateItem(id, { familiarity: next });
    },
    [items, updateItem]
  );

  return {
    items,
    loaded,
    addItem,
    updateItem,
    deleteItem,
    toggleFavorite,
    toggleLearned,
    updateFamiliarity,
  };
}
