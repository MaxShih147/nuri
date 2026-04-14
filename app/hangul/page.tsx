"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hangulConsonants, hangulVowels } from "@/data/hangul";
import { HangulItem } from "@/types/hangul";
import { X, Volume2 } from "lucide-react";
import { speakKorean } from "@/lib/speech";

function HangulCard({ item, onClick }: { item: HangulItem; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardContent className="pt-6 text-center">
        <p className="text-3xl font-medium mb-1">{item.symbol}</p>
        <p className="text-sm text-neutral-500">{item.romanization}</p>
      </CardContent>
    </Card>
  );
}

function HangulDetail({ item, onClose }: { item: HangulItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardContent className="pt-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
          <p className="text-5xl font-medium mb-3">{item.symbol}</p>
          <p className="text-lg text-neutral-600 mb-1">{item.romanization}</p>
          {item.exampleSound && (
            <button
              onClick={() => speakKorean(item.exampleSound!, 0.7)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors text-sm"
            >
              <Volume2 size={14} />
              聽發音 ({item.exampleSound})
            </button>
          )}
          <p className="text-sm text-neutral-500 mt-4 px-4 leading-relaxed">
            {item.pronunciationTip}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HangulPage() {
  const [selected, setSelected] = useState<HangulItem | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">韓文字母</h1>
        <p className="text-neutral-500 mt-1">點擊字母查看發音提示</p>
      </div>

      <Tabs defaultValue="consonants">
        <TabsList>
          <TabsTrigger value="consonants">子音 ({hangulConsonants.length})</TabsTrigger>
          <TabsTrigger value="vowels">母音 ({hangulVowels.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="consonants" className="mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
            {hangulConsonants.map((item) => (
              <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vowels" className="mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
            {hangulVowels.map((item) => (
              <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selected && <HangulDetail item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
