"use client";

import { Library, CheckCircle2, Heart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useQuizResults } from "@/hooks/useQuizResults";

export default function ProgressPage() {
  const { items, loaded } = useVocabulary();
  const { results } = useQuizResults();

  const totalCount = items.length;
  const learnedCount = items.filter((i) => i.learned).length;
  const favoriteCount = items.filter((i) => i.favorite).length;
  const avgFamiliarity =
    totalCount > 0
      ? (items.reduce((sum, i) => sum + i.familiarity, 0) / totalCount).toFixed(1)
      : "0";

  const recentResults = results.slice(0, 10);

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">學習進度</h1>
        <p className="text-neutral-500 mt-1">追蹤你的韓語學習成果</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Library size={20} className="mx-auto text-violet-400 mb-2" />
            <p className="text-2xl font-semibold">{totalCount}</p>
            <p className="text-xs text-neutral-500 mt-1">總單字數</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 size={20} className="mx-auto text-violet-400 mb-2" />
            <p className="text-2xl font-semibold">{learnedCount}</p>
            <p className="text-xs text-neutral-500 mt-1">已學會</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart size={20} className="mx-auto text-violet-400 mb-2" />
            <p className="text-2xl font-semibold">{favoriteCount}</p>
            <p className="text-xs text-neutral-500 mt-1">收藏</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 size={20} className="mx-auto text-violet-400 mb-2" />
            <p className="text-2xl font-semibold">{avgFamiliarity}</p>
            <p className="text-xs text-neutral-500 mt-1">平均熟悉度</p>
          </CardContent>
        </Card>
      </div>

      {/* Familiarity distribution */}
      {totalCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">熟悉度分佈</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5].map((level) => {
                const count = items.filter((i) => i.familiarity === level).length;
                const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                  <div key={level} className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500 w-6 text-right">{level}</span>
                    <div className="flex-1 h-5 bg-violet-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-300 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-neutral-400 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">測驗紀錄</CardTitle>
        </CardHeader>
        <CardContent>
          {recentResults.length === 0 ? (
            <p className="text-sm text-neutral-400">還沒有測驗紀錄</p>
          ) : (
            <div className="space-y-2">
              {recentResults.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {r.score}/{r.total}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {Math.round((r.score / r.total) * 100)}%
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(r.createdAt).toLocaleDateString("zh-TW")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
