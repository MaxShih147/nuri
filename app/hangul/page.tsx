"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hangulConsonants, hangulVowels } from "@/data/hangul";
import { HangulItem } from "@/types/hangul";
import { X, Volume2 } from "lucide-react";
import { speakKorean } from "@/lib/speech";

// Basic 14 consonants for combination grid (exclude double consonants)
const basicConsonants = hangulConsonants.filter((c) =>
  ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"].includes(c.symbol)
);

// Basic 10 vowels for combination grid
const basicVowels = hangulVowels.filter((v) =>
  ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"].includes(v.symbol)
);

// Combine consonant + vowel into a Korean syllable
function combineSyllable(consonant: string, vowel: string): string {
  const cCode = consonant.charCodeAt(0) - 0x3131;
  const vCode = vowel.charCodeAt(0) - 0x314f;

  // Map jamo to lead/vowel index
  const leadMap: Record<number, number> = {
    0: 0,   // ㄱ
    1: 1,   // ㄲ
    3: 2,   // ㄴ
    6: 3,   // ㄷ
    7: 4,   // ㄸ
    8: 5,   // ㄹ
    16: 6,  // ㅁ
    17: 7,  // ㅂ
    18: 8,  // ㅃ
    20: 9,  // ㅅ
    21: 10, // ㅆ
    22: 11, // ㅇ
    23: 12, // ㅈ
    24: 13, // ㅉ
    25: 14, // ㅊ
    26: 15, // ㅋ
    27: 16, // ㅌ
    28: 17, // ㅍ
    29: 18, // ㅎ
  };

  const leadIndex = leadMap[cCode];
  if (leadIndex === undefined || vCode < 0 || vCode > 20) return "";

  const syllableCode = 0xac00 + leadIndex * 21 * 28 + vCode * 28;
  return String.fromCharCode(syllableCode);
}

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

function CombinationDetail({
  consonant,
  vowel,
  syllable,
  onClose,
  onSelectConsonant,
  onSelectVowel,
}: {
  consonant: HangulItem;
  vowel: HangulItem;
  syllable: string;
  onClose: () => void;
  onSelectConsonant: () => void;
  onSelectVowel: () => void;
}) {
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

          <p className="text-5xl font-medium mb-2">{syllable}</p>

          <button
            onClick={() => speakKorean(syllable, 0.7)}
            className="mt-1 mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors text-sm"
          >
            <Volume2 size={14} />
            聽發音
          </button>

          {/* Composition breakdown */}
          <div className="flex items-center justify-center gap-3 mt-2 mb-3">
            <button
              onClick={onSelectConsonant}
              className="px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <p className="text-2xl font-medium text-blue-600">{consonant.symbol}</p>
              <p className="text-xs text-blue-400 mt-0.5">{consonant.romanization}</p>
            </button>
            <span className="text-neutral-300 text-lg">+</span>
            <button
              onClick={onSelectVowel}
              className="px-4 py-3 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <p className="text-2xl font-medium text-rose-600">{vowel.symbol}</p>
              <p className="text-xs text-rose-400 mt-0.5">{vowel.romanization}</p>
            </button>
          </div>

          <p className="text-sm text-neutral-500">
            {consonant.romanization.split(" ")[0]} + {vowel.romanization}
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            點擊子音或母音查看詳細發音
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HangulPage() {
  const [selected, setSelected] = useState<HangulItem | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<{
    consonant: HangulItem;
    vowel: HangulItem;
    syllable: string;
  } | null>(null);

  const handleComboClick = (consonant: HangulItem, vowel: HangulItem) => {
    const syllable = combineSyllable(consonant.symbol, vowel.symbol);
    if (syllable) {
      setSelectedCombo({ consonant, vowel, syllable });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">韓文字母</h1>
        <p className="text-neutral-500 mt-1">點擊字母查看發音提示</p>
      </div>

      <Tabs defaultValue="consonants">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="consonants">子音 ({hangulConsonants.length})</TabsTrigger>
          <TabsTrigger value="vowels">母音 ({hangulVowels.length})</TabsTrigger>
          <TabsTrigger value="combinations">組合表</TabsTrigger>
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

        <TabsContent value="combinations" className="mt-4">
          <p className="text-sm text-neutral-500 mb-4">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-100 mr-1 align-middle" /> 子音
            <span className="inline-block w-3 h-3 rounded-sm bg-rose-100 ml-3 mr-1 align-middle" /> 母音
            — 點擊組合聽發音，再點子音或母音查看詳細
          </p>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-12 h-12" />
                  {basicVowels.map((v) => (
                    <th key={v.id} className="w-12 h-12 text-center">
                      <button
                        onClick={() => setSelected(v)}
                        className="text-lg font-medium text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        {v.symbol}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {basicConsonants.map((c) => (
                  <tr key={c.id}>
                    <td className="w-12 h-12 text-center">
                      <button
                        onClick={() => setSelected(c)}
                        className="text-lg font-medium text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        {c.symbol}
                      </button>
                    </td>
                    {basicVowels.map((v) => {
                      const syllable = combineSyllable(c.symbol, v.symbol);
                      return (
                        <td key={v.id} className="w-12 h-12 text-center">
                          <button
                            onClick={() => handleComboClick(c, v)}
                            className="w-11 h-11 rounded-lg text-lg font-medium hover:bg-neutral-100 hover:shadow-sm transition-all active:scale-95"
                          >
                            {syllable}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {selected && <HangulDetail item={selected} onClose={() => setSelected(null)} />}

      {selectedCombo && (
        <CombinationDetail
          consonant={selectedCombo.consonant}
          vowel={selectedCombo.vowel}
          syllable={selectedCombo.syllable}
          onClose={() => setSelectedCombo(null)}
          onSelectConsonant={() => {
            setSelected(selectedCombo.consonant);
            setSelectedCombo(null);
          }}
          onSelectVowel={() => {
            setSelected(selectedCombo.vowel);
            setSelectedCombo(null);
          }}
        />
      )}
    </div>
  );
}
