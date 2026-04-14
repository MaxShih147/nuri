"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hangulConsonants, hangulVowels } from "@/data/hangul";
import { HangulItem } from "@/types/hangul";
import { X, Volume2 } from "lucide-react";
import { speakKorean } from "@/lib/speech";

// Separate basic vs double consonants for display
const basicConsonants = hangulConsonants.filter((c) =>
  ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"].includes(c.symbol)
);
const doubleConsonants = hangulConsonants.filter((c) =>
  ["ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"].includes(c.symbol)
);

// Separate basic vs compound vowels for display
const basicVowels = hangulVowels.filter((v) =>
  ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"].includes(v.symbol)
);
const compoundVowels = hangulVowels.filter((v) =>
  ["ㅐ", "ㅒ", "ㅔ", "ㅖ", "ㅘ", "ㅙ", "ㅚ", "ㅝ", "ㅞ", "ㅟ", "ㅢ"].includes(v.symbol)
);

// 받침 (final consonant) data
const batchimData = [
  { symbol: "ㄱ", romanization: "k", tip: "嘴巴做出 ㄱ 的位置但不送氣，舌根抵住軟顎", example: "국 (guk) 湯" },
  { symbol: "ㄴ", romanization: "n", tip: "舌尖抵住上齒齦，氣流從鼻腔出", example: "산 (san) 山" },
  { symbol: "ㄷ", romanization: "t", tip: "舌尖抵住上齒齦但不送氣", example: "옷 (ot) 衣服" },
  { symbol: "ㄹ", romanization: "l", tip: "舌尖輕碰上齒齦，發 l 的音", example: "달 (dal) 月亮" },
  { symbol: "ㅁ", romanization: "m", tip: "雙唇閉合，氣流從鼻腔出", example: "밤 (bam) 夜晚" },
  { symbol: "ㅂ", romanization: "p", tip: "雙唇閉合但不送氣", example: "밥 (bap) 飯" },
  { symbol: "ㅇ", romanization: "ng", tip: "舌根抵住軟顎，氣流從鼻腔出，像英文 sing 的 ng", example: "강 (gang) 江" },
  { symbol: "ㄲ", romanization: "k", tip: "與 ㄱ 받침發音相同", example: "밖 (bak) 外面" },
  { symbol: "ㅅ", romanization: "t", tip: "與 ㄷ 받침發音相同", example: "옷 (ot) 衣服" },
  { symbol: "ㅆ", romanization: "t", tip: "與 ㄷ 받침發音相同", example: "있다 (it-da) 有" },
  { symbol: "ㅈ", romanization: "t", tip: "與 ㄷ 받침發音相同", example: "낮 (nat) 白天" },
  { symbol: "ㅊ", romanization: "t", tip: "與 ㄷ 받침發音相同", example: "꽃 (kkot) 花" },
  { symbol: "ㅌ", romanization: "t", tip: "與 ㄷ 받침發音相同", example: "끝 (kkeut) 盡頭" },
  { symbol: "ㅎ", romanization: "t", tip: "與 ㄷ 받침發音相同", example: "좋다 (jot-da) 好" },
  { symbol: "ㅋ", romanization: "k", tip: "與 ㄱ 받침發音相同", example: "부엌 (bu-eok) 廚房" },
  { symbol: "ㅍ", romanization: "p", tip: "與 ㅂ 받침發音相同", example: "앞 (ap) 前面" },
];

// Combine consonant + vowel into a Korean syllable
function combineSyllable(consonant: string, vowel: string): string {
  const cCode = consonant.charCodeAt(0) - 0x3131;
  const vCode = vowel.charCodeAt(0) - 0x314f;

  const leadMap: Record<number, number> = {
    0: 0, 1: 1, 3: 2, 6: 3, 7: 4, 8: 5, 16: 6, 17: 7, 18: 8,
    20: 9, 21: 10, 22: 11, 23: 12, 24: 13, 25: 14, 26: 15, 27: 16, 28: 17, 29: 18,
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

function CombinationTable({
  consonants,
  vowels,
  title,
  onComboClick,
  onConsonantClick,
  onVowelClick,
}: {
  consonants: HangulItem[];
  vowels: HangulItem[];
  title: string;
  onComboClick: (c: HangulItem, v: HangulItem) => void;
  onConsonantClick: (c: HangulItem) => void;
  onVowelClick: (v: HangulItem) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-700 mb-3">{title}</h3>
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-50 w-10 h-10" />
              {vowels.map((v) => (
                <th key={v.id} className="min-w-10 h-10 text-center px-1">
                  <button
                    onClick={() => onVowelClick(v)}
                    className="text-sm font-medium text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    {v.symbol}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {consonants.map((c) => (
              <tr key={c.id}>
                <td className="sticky left-0 z-10 bg-neutral-50 w-10 h-10 text-center">
                  <button
                    onClick={() => onConsonantClick(c)}
                    className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    {c.symbol}
                  </button>
                </td>
                {vowels.map((v) => {
                  const syllable = combineSyllable(c.symbol, v.symbol);
                  return (
                    <td key={v.id} className="min-w-10 h-10 text-center px-0.5">
                      <button
                        onClick={() => onComboClick(c, v)}
                        className="w-9 h-9 rounded-md text-sm hover:bg-neutral-100 hover:shadow-sm transition-all active:scale-95"
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
        <p className="text-neutral-500 mt-1">40 音：19 子音 + 21 母音</p>
      </div>

      <Tabs defaultValue="consonants">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="consonants">子音 (19)</TabsTrigger>
          <TabsTrigger value="vowels">母音 (21)</TabsTrigger>
          <TabsTrigger value="combinations">組合表</TabsTrigger>
          <TabsTrigger value="batchim">받침</TabsTrigger>
        </TabsList>

        {/* 子音 Tab */}
        <TabsContent value="consonants" className="mt-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">基本子音（14 個）</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
              {basicConsonants.map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">雙子音 / 緊音（5 個）</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
              {doubleConsonants.map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 母音 Tab */}
        <TabsContent value="vowels" className="mt-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">基本母音（10 個）</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
              {basicVowels.map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">複合母音（11 個）</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
              {compoundVowels.map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 組合表 Tab */}
        <TabsContent value="combinations" className="mt-4 space-y-8">
          <div className="text-sm text-neutral-500">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-100 mr-1 align-middle" /> 子音（初聲）
            <span className="inline-block w-3 h-3 rounded-sm bg-rose-100 ml-3 mr-1 align-middle" /> 母音（中聲）
            <span className="text-neutral-400 ml-2">— 點擊格子聽發音</span>
          </div>

          {/* Syllable structure explanation */}
          <Card>
            <CardContent className="py-4">
              <p className="text-sm font-medium mb-2">韓文音節結構</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">初聲（子音）</span>
                <span className="text-neutral-300">+</span>
                <span className="px-2 py-1 rounded bg-rose-50 text-rose-600 font-medium">中聲（母音）</span>
                <span className="text-neutral-300">+</span>
                <span className="px-2 py-1 rounded bg-amber-50 text-amber-600 font-medium">終聲（받침）</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                每個韓文字由初聲 + 中聲組成，部分會加上終聲（받침）。例如：한 = ㅎ + ㅏ + ㄴ
              </p>
            </CardContent>
          </Card>

          {/* Basic consonants × Basic vowels */}
          <CombinationTable
            consonants={basicConsonants}
            vowels={basicVowels}
            title="基本子音 × 基本母音（140 組）"
            onComboClick={handleComboClick}
            onConsonantClick={setSelected}
            onVowelClick={setSelected}
          />

          {/* Basic consonants × Compound vowels */}
          <CombinationTable
            consonants={basicConsonants}
            vowels={compoundVowels}
            title="基本子音 × 複合母音（154 組）"
            onComboClick={handleComboClick}
            onConsonantClick={setSelected}
            onVowelClick={setSelected}
          />

          {/* Double consonants × Basic vowels */}
          <CombinationTable
            consonants={doubleConsonants}
            vowels={basicVowels}
            title="雙子音 × 基本母音（50 組）"
            onComboClick={handleComboClick}
            onConsonantClick={setSelected}
            onVowelClick={setSelected}
          />

          {/* Double consonants × Compound vowels */}
          <CombinationTable
            consonants={doubleConsonants}
            vowels={compoundVowels}
            title="雙子音 × 複合母音（55 組）"
            onComboClick={handleComboClick}
            onConsonantClick={setSelected}
            onVowelClick={setSelected}
          />
        </TabsContent>

        {/* 받침 Tab */}
        <TabsContent value="batchim" className="mt-4 space-y-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm font-medium mb-2">什麼是 받침（終聲）？</p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                받침是韓文音節最下方的子音，也叫「終聲」或「收尾音」。
                不是所有音節都有받침，但它會影響整個字的發音。
                雖然可以當받침的子音很多，但實際上只有 <strong>7 種發音</strong>：
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["ㄱ [k]", "ㄴ [n]", "ㄷ [t]", "ㄹ [l]", "ㅁ [m]", "ㅂ [p]", "ㅇ [ng]"].map((b) => (
                  <span key={b} className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-sm font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {batchimData.map((b) => (
              <Card key={b.symbol + b.example}>
                <CardContent className="py-3 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <span className="text-xl font-medium text-amber-700">{b.symbol}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">받침 發音：[{b.romanization}]</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{b.tip}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-neutral-400">例：{b.example}</p>
                      <button
                        onClick={() => speakKorean(b.example.split(" ")[0], 0.7)}
                        className="p-0.5 text-neutral-300 hover:text-neutral-500 transition-colors"
                      >
                        <Volume2 size={11} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
