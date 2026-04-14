"use client";

import { useState, useCallback, useMemo } from "react";
import { RotateCcw, Heart, ThumbsUp, HelpCircle, Volume2, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVocabulary } from "@/hooks/useVocabulary";
import { speakKorean } from "@/lib/speech";
import { units } from "@/data/vocabulary";

export default function FlashcardsPage() {
  const { items, loaded, toggleFavorite, updateFamiliarity } = useVocabulary();
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const studyItems = useMemo(() => {
    const pool = selectedUnit === "all"
      ? items
      : items.filter((i) => i.subUnit === selectedUnit);
    return pool.filter((i) => !i.learned);
  }, [items, selectedUnit]);

  const currentItem = studyItems[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex + 1 >= studyItems.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }, [currentIndex, studyItems.length]);

  const handleKnow = () => {
    if (currentItem) updateFamiliarity(currentItem.id, 1);
    goNext();
  };

  const handleNotSure = () => {
    if (currentItem) updateFamiliarity(currentItem.id, -1);
    goNext();
  };

  const startPractice = (unitKey: string) => {
    setSelectedUnit(unitKey);
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
    setStarted(true);
    setShowUnitPicker(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  const backToSelect = () => {
    setStarted(false);
    setFinished(false);
    setCurrentIndex(0);
  };

  if (!loaded) return null;

  // Unit selection screen
  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">閃卡練習</h1>
          <p className="text-neutral-500 mt-1">選擇要練習的單元</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => startPractice("all")}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">全部單元</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {items.filter((i) => !i.learned).length} 個待學習
                  </p>
                </div>
                <span className="text-sm text-neutral-400">{items.length} 字</span>
              </div>
            </CardContent>
          </Card>
          {units.map((unit) => {
            const unitKey = `${unit.name}：${unit.description}`;
            const unitItems = items.filter((i) => i.subUnit === unitKey);
            const unlearnedCount = unitItems.filter((i) => !i.learned).length;
            return (
              <Card
                key={unit.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${unlearnedCount === 0 ? "opacity-50" : ""}`}
                onClick={() => unlearnedCount > 0 && startPractice(unitKey)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{unit.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{unit.description}</p>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {unlearnedCount > 0 ? `${unlearnedCount} 待學` : "已完成"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (studyItems.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">閃卡練習</h1>
          <p className="text-neutral-500 mt-1">翻牌記憶韓語單字</p>
        </div>
        <div className="text-center py-16 space-y-4 text-neutral-400">
          <p>這個單元的單字都學會了！</p>
          <Button variant="outline" onClick={backToSelect}>選擇其他單元</Button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">閃卡練習</h1>
        </div>
        <div className="text-center py-16 space-y-4">
          <p className="text-lg font-medium">練習完成！</p>
          <p className="text-neutral-500">你已經複習了 {studyItems.length} 個單字</p>
          <div className="flex justify-center gap-3">
            <Button onClick={restart} variant="outline">
              <RotateCcw size={16} className="mr-1" />
              重新開始
            </Button>
            <Button onClick={backToSelect} variant="outline">
              選擇其他單元
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">閃卡練習</h1>
          <p className="text-neutral-500 mt-1">
            {currentIndex + 1} / {studyItems.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={backToSelect}>
            換單元
          </Button>
          <Button variant="outline" size="sm" onClick={restart}>
            <RotateCcw size={14} className="mr-1" />
            重來
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / studyItems.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="flex justify-center pt-4">
        <div
          className="w-full max-w-md cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <Card className="min-h-[260px] sm:min-h-[280px] flex items-center justify-center transition-all duration-300 hover:shadow-lg">
            <CardContent className="text-center py-10 sm:py-12 px-6 sm:px-8 w-full">
              {!flipped ? (
                <div className="space-y-3">
                  <p className="text-3xl sm:text-4xl font-medium">{currentItem.word}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakKorean(currentItem.word);
                    }}
                    className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <Volume2 size={14} />
                    聽發音
                  </button>
                  <p className="text-sm text-neutral-400">點擊翻牌</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xl sm:text-2xl font-medium">{currentItem.meaning}</p>
                  <p className="text-neutral-500">{currentItem.romanization}</p>
                  {currentItem.partOfSpeech && (
                    <p className="text-xs text-neutral-400">{currentItem.partOfSpeech}</p>
                  )}
                  {currentItem.example && (
                    <div className="mt-4 border-t pt-3 space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-sm text-neutral-400">{currentItem.example}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakKorean(currentItem.example!);
                          }}
                          className="text-neutral-300 hover:text-neutral-500 transition-colors"
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>
                      {currentItem.exampleMeaning && (
                        <p className="text-xs text-neutral-300">{currentItem.exampleMeaning}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2 sm:gap-3 pt-2">
        <Button variant="outline" onClick={handleNotSure} className="gap-1.5" size="sm">
          <HelpCircle size={16} />
          <span className="hidden sm:inline">不確定</span>
        </Button>
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            if (currentItem) toggleFavorite(currentItem.id);
          }}
          className="gap-1.5"
          size="sm"
        >
          <Heart
            size={16}
            className={currentItem?.favorite ? "fill-red-400 text-red-400" : ""}
          />
          <span className="hidden sm:inline">收藏</span>
        </Button>
        <Button onClick={handleKnow} className="gap-1.5" size="sm">
          <ThumbsUp size={16} />
          <span className="hidden sm:inline">認識</span>
        </Button>
      </div>
    </div>
  );
}
