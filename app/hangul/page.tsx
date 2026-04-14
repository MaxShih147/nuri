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

const tensionLabels: Record<string, { label: string; color: string }> = {
  lax: { label: "平音", color: "bg-sky-50 text-sky-600" },
  aspirated: { label: "送氣音", color: "bg-orange-50 text-orange-600" },
  tense: { label: "緊音", color: "bg-purple-50 text-purple-600" },
  sonorant: { label: "鼻音/流音", color: "bg-emerald-50 text-emerald-600" },
};

function HangulCard({ item, onClick }: { item: HangulItem; onClick: () => void }) {
  const tension = item.tensionType ? tensionLabels[item.tensionType] : null;
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardContent className="pt-5 pb-4 text-center">
        <p className="text-3xl font-medium mb-1">{item.symbol}</p>
        <p className="text-sm text-neutral-500">{item.romanization}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{item.ipa}</p>
        {tension && (
          <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${tension.color}`}>
            {tension.label}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

function HangulDetail({ item, onClose }: { item: HangulItem; onClose: () => void }) {
  const tension = item.tensionType ? tensionLabels[item.tensionType] : null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <Card className="w-full max-w-sm my-4" onClick={(e) => e.stopPropagation()}>
        <CardContent className="pt-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
          <p className="text-5xl font-medium mb-2">{item.symbol}</p>
          <p className="text-lg text-neutral-600">{item.romanization}</p>
          <p className="text-sm text-neutral-400">{item.ipa}</p>
          {tension && (
            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${tension.color}`}>
              {tension.label}
            </span>
          )}
          {item.exampleSound && (
            <button
              onClick={() => speakKorean(item.exampleSound!, 0.7)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors text-sm"
            >
              <Volume2 size={14} />
              聽發音 ({item.exampleSound})
            </button>
          )}
          <div className="text-left mt-4 px-2 space-y-3">
            <div>
              <p className="text-xs font-medium text-neutral-600 mb-1">發音說明</p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {item.pronunciationTip}
              </p>
            </div>
            {item.mandarinCompare && (
              <div className="bg-amber-50/50 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-amber-700 mb-0.5">中文對照</p>
                <p className="text-sm text-amber-600 leading-relaxed">
                  {item.mandarinCompare}
                </p>
              </div>
            )}
            {item.exampleWord && (
              <div className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2">
                <div>
                  <p className="text-xs text-neutral-400">例字</p>
                  <p className="text-sm font-medium">{item.exampleWord} <span className="text-neutral-400 font-normal">({item.exampleWordMeaning})</span></p>
                </div>
                <button
                  onClick={() => speakKorean(item.exampleWord!, 0.8)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <Volume2 size={14} />
                </button>
              </div>
            )}
          </div>
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
          <TabsTrigger value="rules">音變規則</TabsTrigger>
        </TabsList>

        {/* 子音 Tab */}
        <TabsContent value="consonants" className="mt-4 space-y-6">
          {/* Three-way contrast explanation */}
          <Card>
            <CardContent className="py-4">
              <p className="text-sm font-medium mb-2">韓語子音的三組對比</p>
              <p className="text-xs text-neutral-500 mb-3">
                韓語最重要的發音特徵：同一個發音部位有三種不同的子音。中文只有送氣/不送氣兩種區別，韓語多了「緊音」。
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-neutral-400">
                      <th className="text-left py-1 pr-2">部位</th>
                      <th className="py-1 px-2"><span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-600">平音</span></th>
                      <th className="py-1 px-2"><span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600">送氣音</span></th>
                      <th className="py-1 px-2"><span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">緊音</span></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {[
                      { pos: "牙音 (k)", lax: "ㄱ", asp: "ㅋ", tense: "ㄲ" },
                      { pos: "舌音 (t)", lax: "ㄷ", asp: "ㅌ", tense: "ㄸ" },
                      { pos: "唇音 (p)", lax: "ㅂ", asp: "ㅍ", tense: "ㅃ" },
                      { pos: "齒音 (s)", lax: "ㅅ", asp: "—", tense: "ㅆ" },
                      { pos: "塞擦 (j)", lax: "ㅈ", asp: "ㅊ", tense: "ㅉ" },
                    ].map((row) => (
                      <tr key={row.pos} className="border-t border-neutral-100">
                        <td className="text-left py-2 pr-2 text-xs text-neutral-500">{row.pos}</td>
                        <td className="py-2 px-2 text-lg">{row.lax}</td>
                        <td className="py-2 px-2 text-lg">{row.asp}</td>
                        <td className="py-2 px-2 text-lg">{row.tense}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">
              <span className="inline-block px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 text-xs mr-1">平音</span>
              基本子音（5 個）
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {hangulConsonants.filter((c) => c.tensionType === "lax").map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">
              <span className="inline-block px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 text-xs mr-1">送氣音</span>
              （5 個）
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {hangulConsonants.filter((c) => c.tensionType === "aspirated").map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">
              <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs mr-1">鼻音/流音</span>
              （4 個）
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {hangulConsonants.filter((c) => c.tensionType === "sonorant").map((item) => (
                <HangulCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-3">
              <span className="inline-block px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-xs mr-1">緊音</span>
              雙子音（5 個）
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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

        {/* 音變規則 Tab */}
        <TabsContent value="rules" className="mt-4 space-y-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm font-medium mb-1">為什麼要學音變規則？</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                韓語的字跟字連在一起時，發音會改變。這是韓語最大的特色也是最難的部分。學會這些規則，聽力和口說都會大幅進步。
              </p>
            </CardContent>
          </Card>

          {/* 連音 */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">連音（연음）</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                當有받침的字後面接母音開頭的字時，받침會移到下一個字的初聲位置發音。
              </p>
              <div className="space-y-2">
                {[
                  { written: "한국어", actual: "[한구거]", meaning: "韓語" },
                  { written: "음악", actual: "[으막]", meaning: "音樂" },
                  { written: "먹어요", actual: "[머거요]", meaning: "吃" },
                  { written: "읽어요", actual: "[일거요]", meaning: "讀" },
                ].map((ex) => (
                  <div key={ex.written} className="flex items-center gap-2 text-sm bg-neutral-50 rounded-lg px-3 py-2">
                    <span className="font-medium">{ex.written}</span>
                    <span className="text-neutral-300">→</span>
                    <span className="text-blue-600">{ex.actual}</span>
                    <span className="text-neutral-400 text-xs ml-auto">{ex.meaning}</span>
                    <button onClick={() => speakKorean(ex.written, 0.8)} className="text-neutral-300 hover:text-neutral-500">
                      <Volume2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 鼻音化 */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs font-medium">鼻音化（비음화）</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                받침 ㄱ、ㄷ、ㅂ 遇到 ㄴ 或 ㅁ 開頭的字時，會變成對應的鼻音：ㄱ→ㅇ、ㄷ→ㄴ、ㅂ→ㅁ。
              </p>
              <div className="space-y-2">
                {[
                  { written: "박물관", actual: "[방물관]", meaning: "博物館", rule: "ㄱ→ㅇ" },
                  { written: "한국말", actual: "[한궁말]", meaning: "韓語", rule: "ㄱ→ㅇ" },
                  { written: "받는다", actual: "[반는다]", meaning: "接受", rule: "ㄷ→ㄴ" },
                  { written: "십만", actual: "[심만]", meaning: "十萬", rule: "ㅂ→ㅁ" },
                ].map((ex) => (
                  <div key={ex.written} className="flex items-center gap-2 text-sm bg-neutral-50 rounded-lg px-3 py-2">
                    <span className="font-medium">{ex.written}</span>
                    <span className="text-neutral-300">→</span>
                    <span className="text-emerald-600">{ex.actual}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-500 text-[10px]">{ex.rule}</span>
                    <span className="text-neutral-400 text-xs ml-auto">{ex.meaning}</span>
                    <button onClick={() => speakKorean(ex.written, 0.8)} className="text-neutral-300 hover:text-neutral-500">
                      <Volume2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 硬音化 */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-xs font-medium">硬音化（경음화）</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                받침 ㄱ、ㄷ、ㅂ 後面接平音 ㄱ、ㄷ、ㅂ、ㅅ、ㅈ 時，平音會變成對應的緊音。
              </p>
              <div className="space-y-2">
                {[
                  { written: "먹다", actual: "[먹따]", meaning: "吃", rule: "ㄷ→ㄸ" },
                  { written: "학교", actual: "[학꾜]", meaning: "學校", rule: "ㄱ→ㄲ" },
                  { written: "읽다", actual: "[익따]", meaning: "讀", rule: "ㄷ→ㄸ" },
                  { written: "없다", actual: "[업따]", meaning: "沒有", rule: "ㄷ→ㄸ" },
                ].map((ex) => (
                  <div key={ex.written} className="flex items-center gap-2 text-sm bg-neutral-50 rounded-lg px-3 py-2">
                    <span className="font-medium">{ex.written}</span>
                    <span className="text-neutral-300">→</span>
                    <span className="text-purple-600">{ex.actual}</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-500 text-[10px]">{ex.rule}</span>
                    <span className="text-neutral-400 text-xs ml-auto">{ex.meaning}</span>
                    <button onClick={() => speakKorean(ex.written, 0.8)} className="text-neutral-300 hover:text-neutral-500">
                      <Volume2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 顎音化 */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-xs font-medium">顎音化（구개음화）</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                받침 ㄷ、ㅌ 遇到 이 或 히 時，會變成 ㅈ 或 ㅊ 的發音。
              </p>
              <div className="space-y-2">
                {[
                  { written: "같이", actual: "[가치]", meaning: "一起", rule: "ㅌ+이→ㅊ" },
                  { written: "굳이", actual: "[구지]", meaning: "硬要", rule: "ㄷ+이→ㅈ" },
                  { written: "해돋이", actual: "[해도지]", meaning: "日出", rule: "ㄷ+이→ㅈ" },
                ].map((ex) => (
                  <div key={ex.written} className="flex items-center gap-2 text-sm bg-neutral-50 rounded-lg px-3 py-2">
                    <span className="font-medium">{ex.written}</span>
                    <span className="text-neutral-300">→</span>
                    <span className="text-rose-600">{ex.actual}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-500 text-[10px]">{ex.rule}</span>
                    <span className="text-neutral-400 text-xs ml-auto">{ex.meaning}</span>
                    <button onClick={() => speakKorean(ex.written, 0.8)} className="text-neutral-300 hover:text-neutral-500">
                      <Volume2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 激音化 */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-medium">激音化（격음화）</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                ㅎ 遇到平音 ㄱ、ㄷ、ㅂ、ㅈ 時，平音會變成對應的送氣音 ㅋ、ㅌ、ㅍ、ㅊ。
              </p>
              <div className="space-y-2">
                {[
                  { written: "좋다", actual: "[조타]", meaning: "好", rule: "ㅎ+ㄷ→ㅌ" },
                  { written: "놓고", actual: "[노코]", meaning: "放著", rule: "ㅎ+ㄱ→ㅋ" },
                  { written: "급하다", actual: "[그파다]", meaning: "急", rule: "ㅂ+ㅎ→ㅍ" },
                  { written: "입학", actual: "[이팍]", meaning: "入學", rule: "ㅂ+ㅎ→ㅍ" },
                ].map((ex) => (
                  <div key={ex.written} className="flex items-center gap-2 text-sm bg-neutral-50 rounded-lg px-3 py-2">
                    <span className="font-medium">{ex.written}</span>
                    <span className="text-neutral-300">→</span>
                    <span className="text-orange-600">{ex.actual}</span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-500 text-[10px]">{ex.rule}</span>
                    <span className="text-neutral-400 text-xs ml-auto">{ex.meaning}</span>
                    <button onClick={() => speakKorean(ex.written, 0.8)} className="text-neutral-300 hover:text-neutral-500">
                      <Volume2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
