"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw, Trash2 } from "lucide-react";
import { seedVocabulary } from "@/data/seedVocabulary";
import { saveVocabulary } from "@/lib/storage/vocabulary";
import { saveQuizResults } from "@/lib/storage/quiz";

export default function SettingsPage() {
  const [confirmReset, setConfirmReset] = useState<"vocab" | "quiz" | "all" | null>(null);

  const handleResetVocabulary = () => {
    saveVocabulary(seedVocabulary);
    setConfirmReset(null);
    window.location.reload();
  };

  const handleResetQuiz = () => {
    saveQuizResults([]);
    setConfirmReset(null);
    window.location.reload();
  };

  const handleResetAll = () => {
    saveVocabulary(seedVocabulary);
    saveQuizResults([]);
    setConfirmReset(null);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">設定</h1>
        <p className="text-neutral-500 mt-1">應用程式偏好設定</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RotateCcw size={18} />
            資料管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">重置單字本</p>
              <p className="text-xs text-neutral-500">清除所有單字，恢復為預設範例資料</p>
            </div>
            {confirmReset === "vocab" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setConfirmReset(null)}>
                  取消
                </Button>
                <Button size="sm" variant="destructive" onClick={handleResetVocabulary}>
                  確認重置
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setConfirmReset("vocab")}>
                重置
              </Button>
            )}
          </div>

          <div className="border-t" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">清除測驗紀錄</p>
              <p className="text-xs text-neutral-500">刪除所有測驗成績紀錄</p>
            </div>
            {confirmReset === "quiz" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setConfirmReset(null)}>
                  取消
                </Button>
                <Button size="sm" variant="destructive" onClick={handleResetQuiz}>
                  確認清除
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setConfirmReset("quiz")}>
                清除
              </Button>
            )}
          </div>

          <div className="border-t" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">重置所有資料</p>
              <p className="text-xs text-neutral-500">單字本恢復預設，測驗紀錄全部清除</p>
            </div>
            {confirmReset === "all" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setConfirmReset(null)}>
                  取消
                </Button>
                <Button size="sm" variant="destructive" onClick={handleResetAll}>
                  <Trash2 size={14} className="mr-1" />
                  確認全部重置
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setConfirmReset("all")}>
                全部重置
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
