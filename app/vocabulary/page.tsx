"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Heart, Trash2, Pencil, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpeakButton } from "@/components/ui/speak-button";
import { useVocabulary } from "@/hooks/useVocabulary";
import { VocabularyForm } from "@/components/vocabulary/VocabularyForm";
import { VocabularyItem } from "@/types/vocabulary";

export default function VocabularyPage() {
  const { items, loaded, addItem, updateItem, deleteItem, toggleFavorite, toggleLearned } =
    useVocabulary();
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  const filtered = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.word.includes(q) ||
          i.romanization.toLowerCase().includes(q) ||
          i.meaning.includes(q)
      );
    }
    if (filterDifficulty !== "all") {
      result = result.filter((i) => i.difficulty === filterDifficulty);
    }
    return result;
  }, [items, search, filterDifficulty]);

  const handleSubmit = (data: {
    word: string;
    romanization: string;
    meaning: string;
    partOfSpeech?: string;
    example?: string;
    exampleMeaning?: string;
    difficulty?: "easy" | "medium" | "hard";
  }) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
      setEditingItem(null);
    } else {
      addItem(data);
    }
    setShowForm(false);
  };

  const handleEdit = (item: VocabularyItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">單字本</h1>
          <p className="text-neutral-500 mt-1">{items.length} 個單字</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus size={16} className="mr-1" />
          新增單字
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="搜尋單字、羅馬拼音或意思..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filterDifficulty === d
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {d === "all" ? "全部" : d === "easy" ? "簡單" : d === "medium" ? "中等" : "困難"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          {search ? "找不到符合的單字" : "還沒有單字，開始新增吧！"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <Card key={item.id} className="group">
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <button
                    onClick={() => toggleLearned(item.id)}
                    className="text-neutral-300 hover:text-neutral-600 transition-colors shrink-0"
                  >
                    {item.learned ? (
                      <CheckCircle2 size={20} className="text-neutral-600" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-medium">{item.word}</span>
                      <SpeakButton text={item.word} size={14} />
                      <span className="text-sm text-neutral-400">{item.romanization}</span>
                      {item.difficulty && (
                        <Badge variant="secondary" className="text-xs">
                          {item.difficulty === "easy"
                            ? "簡單"
                            : item.difficulty === "medium"
                            ? "中等"
                            : "困難"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mt-0.5">{item.meaning}</p>
                    {item.example && (
                      <div className="mt-1 flex items-start gap-1">
                        <p className="text-xs text-neutral-400">
                          {item.example}
                          {item.exampleMeaning && (
                            <span className="text-neutral-300"> — {item.exampleMeaning}</span>
                          )}
                        </p>
                        <SpeakButton text={item.example} size={12} className="shrink-0 p-0.5" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={item.favorite ? "fill-red-400 text-red-400" : "text-neutral-400"}
                    />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    <Pencil size={16} className="text-neutral-400" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="text-neutral-400 hover:text-red-500" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      {showForm && (
        <VocabularyForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
