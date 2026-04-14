"use client";

import { useState, useCallback } from "react";
import { RotateCcw, Heart, ThumbsUp, HelpCircle, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVocabulary } from "@/hooks/useVocabulary";
import { speakKorean } from "@/lib/speech";

export default function FlashcardsPage() {
  const { items, loaded, toggleFavorite, updateFamiliarity } = useVocabulary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const studyItems = items.filter((i) => !i.learned);
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

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  if (!loaded) return null;

  if (studyItems.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">閃卡練習</h1>
          <p className="text-neutral-500 mt-1">翻牌記憶韓語單字</p>
        </div>
        <div className="text-center py-16 text-neutral-400">
          沒有可練習的單字。請先到單字本新增單字。
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
          <Button onClick={restart} variant="outline">
            <RotateCcw size={16} className="mr-1" />
            重新開始
          </Button>
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
        <Button variant="outline" size="sm" onClick={restart}>
          <RotateCcw size={14} className="mr-1" />
          重新開始
        </Button>
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
          className="w-full max-w-md cursor-pointer perspective-1000"
          onClick={() => setFlipped(!flipped)}
        >
          <Card className="min-h-[280px] flex items-center justify-center transition-all duration-300 hover:shadow-lg">
            <CardContent className="text-center py-12 px-8 w-full">
              {!flipped ? (
                <div className="space-y-3">
                  <p className="text-4xl font-medium">{currentItem.word}</p>
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
                  <p className="text-2xl font-medium">{currentItem.meaning}</p>
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
      <div className="flex justify-center gap-3 pt-2">
        <Button variant="outline" onClick={handleNotSure} className="gap-1.5">
          <HelpCircle size={16} />
          不確定
        </Button>
        <Button
          variant="outline"
          onClick={() => currentItem && toggleFavorite(currentItem.id)}
          className="gap-1.5"
        >
          <Heart
            size={16}
            className={currentItem?.favorite ? "fill-red-400 text-red-400" : ""}
          />
          收藏
        </Button>
        <Button onClick={handleKnow} className="gap-1.5">
          <ThumbsUp size={16} />
          認識
        </Button>
      </div>
    </div>
  );
}
