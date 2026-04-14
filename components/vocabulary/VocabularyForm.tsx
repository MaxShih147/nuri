"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VocabularyItem } from "@/types/vocabulary";

type FormData = {
  word: string;
  romanization: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  exampleMeaning?: string;
  difficulty?: "easy" | "medium" | "hard";
};

type Props = {
  initialData?: VocabularyItem | null;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
};

export function VocabularyForm({ initialData, onSubmit, onClose }: Props) {
  const [word, setWord] = useState(initialData?.word ?? "");
  const [romanization, setRomanization] = useState(initialData?.romanization ?? "");
  const [meaning, setMeaning] = useState(initialData?.meaning ?? "");
  const [partOfSpeech, setPartOfSpeech] = useState(initialData?.partOfSpeech ?? "");
  const [example, setExample] = useState(initialData?.example ?? "");
  const [exampleMeaning, setExampleMeaning] = useState(initialData?.exampleMeaning ?? "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">(
    initialData?.difficulty ?? ""
  );
  const [errors, setErrors] = useState<{ word?: string; meaning?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!word.trim()) newErrors.word = "請輸入韓文單字";
    if (!meaning.trim()) newErrors.meaning = "請輸入中文意思";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      word: word.trim(),
      romanization: romanization.trim(),
      meaning: meaning.trim(),
      partOfSpeech: partOfSpeech.trim() || undefined,
      example: example.trim() || undefined,
      exampleMeaning: exampleMeaning.trim() || undefined,
      difficulty: difficulty || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="relative">
          <CardTitle className="text-base">
            {initialData ? "編輯單字" : "新增單字"}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="word">韓文單字 *</Label>
              <Input
                id="word"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  setErrors((prev) => ({ ...prev, word: undefined }));
                }}
                placeholder="예: 안녕하세요"
              />
              {errors.word && <p className="text-xs text-red-500">{errors.word}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="romanization">羅馬拼音</Label>
              <Input
                id="romanization"
                value={romanization}
                onChange={(e) => setRomanization(e.target.value)}
                placeholder="예: an-nyeong-ha-se-yo"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meaning">中文意思 *</Label>
              <Input
                id="meaning"
                value={meaning}
                onChange={(e) => {
                  setMeaning(e.target.value);
                  setErrors((prev) => ({ ...prev, meaning: undefined }));
                }}
                placeholder="예: 你好"
              />
              {errors.meaning && <p className="text-xs text-red-500">{errors.meaning}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partOfSpeech">詞性</Label>
              <Input
                id="partOfSpeech"
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                placeholder="예: 名詞、動詞、形容詞"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="example">例句</Label>
              <Textarea
                id="example"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="예: 안녕하세요, 만나서 반갑습니다."
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exampleMeaning">例句翻譯</Label>
              <Input
                id="exampleMeaning"
                value={exampleMeaning}
                onChange={(e) => setExampleMeaning(e.target.value)}
                placeholder="예: 你好，很高興認識你。"
              />
            </div>

            <div className="space-y-1.5">
              <Label>難度</Label>
              <div className="flex gap-2">
                {([["easy", "簡單"], ["medium", "中等"], ["hard", "困難"]] as const).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDifficulty(difficulty === value ? "" : value)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        difficulty === value
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button type="submit">
                {initialData ? "儲存" : "新增"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
