"use client";

import { Volume2 } from "lucide-react";
import { speakKorean } from "@/lib/speech";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  size?: number;
  rate?: number;
  className?: string;
};

export function SpeakButton({ text, size = 16, rate, className }: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speakKorean(text, rate);
      }}
      className={cn(
        "p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors",
        className
      )}
      title="播放發音"
    >
      <Volume2 size={size} />
    </button>
  );
}
