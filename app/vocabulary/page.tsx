"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Heart, Trash2, Pencil, CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpeakButton } from "@/components/ui/speak-button";
import { useVocabulary } from "@/hooks/useVocabulary";
import { VocabularyForm } from "@/components/vocabulary/VocabularyForm";
import { VocabularyItem } from "@/types/vocabulary";
import { units } from "@/data/vocabulary";

export default function VocabularyPage() {
  const { items, loaded, addItem, updateItem, deleteItem, toggleFavorite, toggleLearned } =
    useVocabulary();
  const [search, setSearch] = useState("");
  const [filterUnit, setFilterUnit] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

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
    if (filterUnit !== "all") {
      result = result.filter((i) => i.subUnit === filterUnit);
    }
    if (filterDifficulty !== "all") {
      result = result.filter((i) => i.difficulty === filterDifficulty);
    }
    return result;
  }, [items, search, filterUnit, filterDifficulty]);

  const currentUnitLabel = filterUnit === "all"
    ? "全部單元"
    : units.find((u) => `${u.name}：${u.description}` === filterUnit)?.name ?? filterUnit;

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
          <p className="text-neutral-500 mt-1">
            {filtered.length === items.length
              ? `${items.length} 個單字`
              : `顯示 ${filtered.length} / ${items.length} 個單字`}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus size={16} className="mr-1" />
          新增單字
        </Button>
      </div>

      {/* Unit selector */}
      <div className="relative">
        <button
          onClick={() => setShowUnitPicker(!showUnitPicker)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm font-medium hover:bg-neutral-50 transition-colors w-full sm:w-auto"
        >
          <span>{currentUnitLabel}</span>
          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${showUnitPicker ? "rotate-180" : ""}`} />
        </button>
        {showUnitPicker && (
          <div className="absolute z-40 mt-1 w-full sm:w-80 bg-white border rounded-lg shadow-lg py-1 max-h-96 overflow-y-auto">
            <button
              onClick={() => { setFilterUnit("all"); setShowUnitPicker(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${filterUnit === "all" ? "bg-violet-100 font-medium" : ""}`}
            >
              全部單元（{items.length} 字）
            </button>
            {units.map((unit) => {
              const unitKey = `${unit.name}：${unit.description}`;
              const count = items.filter((i) => i.subUnit === unitKey).length;
              const learnedCount = items.filter((i) => i.subUnit === unitKey && i.learned).length;
              return (
                <button
                  key={unit.id}
                  onClick={() => { setFilterUnit(unitKey); setShowUnitPicker(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${filterUnit === unitKey ? "bg-violet-100 font-medium" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{unit.name}：{unit.description}</span>
                    <span className="text-xs text-neutral-400">{learnedCount}/{count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search + Difficulty filter */}
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
        <div className="flex gap-1.5 shrink-0 overflow-x-auto">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                filterDifficulty === d
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-600 hover:bg-violet-100"
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
              <CardContent className="py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
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
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-medium">{item.word}</span>
                      <SpeakButton text={item.word} size={14} />
                      <span className="text-xs sm:text-sm text-neutral-400">{item.romanization}</span>
                      {item.difficulty && (
                        <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
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
                        <p className="text-xs text-neutral-400 line-clamp-2">
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
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1 sm:p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={item.favorite ? "fill-red-400 text-red-400" : "text-neutral-400"}
                    />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 sm:p-1.5 rounded-md hover:bg-neutral-100 transition-colors hidden sm:block"
                  >
                    <Pencil size={16} className="text-neutral-400" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1 sm:p-1.5 rounded-md hover:bg-red-50 transition-colors hidden sm:block"
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
