"use client";

import Link from "next/link";
import { BookOpen, Library, Layers, HelpCircle, BarChart3, Heart, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVocabulary } from "@/hooks/useVocabulary";

const quickLinks = [
  { href: "/hangul", label: "韓文字母", icon: BookOpen, description: "學習子音與母音" },
  { href: "/vocabulary", label: "單字本", icon: Library, description: "管理你的單字庫" },
  { href: "/flashcards", label: "閃卡練習", icon: Layers, description: "翻牌記憶練習" },
  { href: "/quiz", label: "測驗", icon: HelpCircle, description: "檢驗學習成果" },
  { href: "/progress", label: "學習進度", icon: BarChart3, description: "查看統計數據" },
];

export default function DashboardPage() {
  const { items, loaded } = useVocabulary();

  const totalCount = items.length;
  const learnedCount = items.filter((i) => i.learned).length;
  const favoriteCount = items.filter((i) => i.favorite).length;
  const recentItems = items.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">歡迎回來</h1>
        <p className="text-neutral-500 mt-1">繼續你的韓語學習之旅</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lavender-100">
                <Library size={20} className="text-lavender-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{loaded ? totalCount : "—"}</p>
                <p className="text-sm text-neutral-500">總單字數</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lavender-100">
                <CheckCircle2 size={20} className="text-lavender-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{loaded ? learnedCount : "—"}</p>
                <p className="text-sm text-neutral-500">已學會</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lavender-100">
                <Heart size={20} className="text-lavender-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{loaded ? favoriteCount : "—"}</p>
                <p className="text-sm text-neutral-500">收藏</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent vocabulary */}
      {loaded && recentItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近新增的單字</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium">{item.word}</span>
                    <span className="text-sm text-neutral-400">{item.romanization}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{item.meaning}</span>
                </div>
              ))}
            </div>
            <Link
              href="/vocabulary"
              className="inline-block mt-3 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              查看全部 &rarr;
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map(({ href, label, icon: Icon, description }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-lavender-100">
                    <Icon size={20} className="text-lavender-500" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
