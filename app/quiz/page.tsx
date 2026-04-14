"use client";

import { useState } from "react";
import { RotateCcw, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useQuizResults } from "@/hooks/useQuizResults";
import { generateQuiz } from "@/lib/quiz/generate";
import { QuizQuestion } from "@/types/quiz";
import { speakKorean } from "@/lib/speech";

type QuizState = "setup" | "playing" | "result";

export default function QuizPage() {
  const { items, loaded } = useVocabulary();
  const { addResult } = useQuizResults();
  const [state, setState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(5);

  const currentQuestion = questions[currentIndex];

  const startQuiz = () => {
    const q = generateQuiz(items, questionCount);
    if (q.length === 0) return;
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setState("playing");
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = score + (selectedAnswer === currentQuestion.correctAnswer ? 0 : 0);
      addResult(score, questions.length);
      setState("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  };

  if (!loaded) return null;

  if (items.length < 4) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">測驗</h1>
          <p className="text-neutral-500 mt-1">檢驗你的韓語單字學習成果</p>
        </div>
        <div className="text-center py-16 text-neutral-400">
          至少需要 4 個單字才能開始測驗。目前有 {items.length} 個。
        </div>
      </div>
    );
  }

  if (state === "setup") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">測驗</h1>
          <p className="text-neutral-500 mt-1">從韓文選出正確的中文意思</p>
        </div>

        <Card className="max-w-sm mx-auto">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">題目數量</p>
              <div className="flex gap-2">
                {[5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      questionCount === n
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {n} 題
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={startQuiz} className="w-full">
              開始測驗
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "result") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">測驗結果</h1>
        </div>
        <Card className="max-w-sm mx-auto">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <p className="text-5xl font-semibold">{percentage}%</p>
            <p className="text-neutral-500">
              答對 {score} / {questions.length} 題
            </p>
            <div className="pt-2">
              <Button onClick={() => setState("setup")} variant="outline" className="gap-1.5">
                <RotateCcw size={16} />
                再試一次
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing state
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">測驗</h1>
          <p className="text-neutral-500 mt-1">
            第 {currentIndex + 1} / {questions.length} 題
          </p>
        </div>
        <p className="text-sm text-neutral-500">得分：{score}</p>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 pb-6 space-y-6">
          <div className="text-center">
            <p className="text-3xl font-medium">{currentQuestion.word}</p>
            <button
              onClick={() => speakKorean(currentQuestion.word)}
              className="mt-1 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <Volume2 size={14} />
              聽發音
            </button>
            <p className="text-sm text-neutral-400 mt-2">選出正確的中文意思</p>
          </div>

          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              let style = "bg-neutral-50 hover:bg-neutral-100 text-neutral-700";
              if (selectedAnswer) {
                if (option === currentQuestion.correctAnswer) {
                  style = "bg-green-50 border-green-200 text-green-700";
                } else if (option === selectedAnswer) {
                  style = "bg-red-50 border-red-200 text-red-700";
                } else {
                  style = "bg-neutral-50 text-neutral-400";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm ${style}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 size={16} className="text-green-600" />
                    )}
                    {selectedAnswer &&
                      option === selectedAnswer &&
                      option !== currentQuestion.correctAnswer && (
                        <XCircle size={16} className="text-red-500" />
                      )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className="text-center pt-2">
              <Button onClick={nextQuestion} size="sm">
                {currentIndex + 1 >= questions.length ? "查看結果" : "下一題"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
