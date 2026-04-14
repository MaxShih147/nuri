import { HangulItem } from "@/types/hangul";

export const hangulConsonants: HangulItem[] = [
  { id: "c1", symbol: "ㄱ", romanization: "g / k", type: "consonant", pronunciationTip: "像中文「哥」的聲母，在字尾時發 k 音", exampleSound: "가" },
  { id: "c2", symbol: "ㄴ", romanization: "n", type: "consonant", pronunciationTip: "像中文「那」的聲母", exampleSound: "나" },
  { id: "c3", symbol: "ㄷ", romanization: "d / t", type: "consonant", pronunciationTip: "像中文「打」的聲母，在字尾時發 t 音", exampleSound: "다" },
  { id: "c4", symbol: "ㄹ", romanization: "r / l", type: "consonant", pronunciationTip: "在字首時接近 r 音，在字尾時接近 l 音", exampleSound: "라" },
  { id: "c5", symbol: "ㅁ", romanization: "m", type: "consonant", pronunciationTip: "像中文「媽」的聲母", exampleSound: "마" },
  { id: "c6", symbol: "ㅂ", romanization: "b / p", type: "consonant", pronunciationTip: "像中文「爸」的聲母，在字尾時發 p 音", exampleSound: "바" },
  { id: "c7", symbol: "ㅅ", romanization: "s", type: "consonant", pronunciationTip: "像中文「思」的聲母", exampleSound: "사" },
  { id: "c8", symbol: "ㅇ", romanization: "- / ng", type: "consonant", pronunciationTip: "在字首時不發音（靜音），在字尾時發 ng 音", exampleSound: "아" },
  { id: "c9", symbol: "ㅈ", romanization: "j", type: "consonant", pronunciationTip: "像中文「雞」的聲母", exampleSound: "자" },
  { id: "c10", symbol: "ㅊ", romanization: "ch", type: "consonant", pronunciationTip: "像中文「吃」的聲母，送氣音", exampleSound: "차" },
  { id: "c11", symbol: "ㅋ", romanization: "k", type: "consonant", pronunciationTip: "像中文「科」的聲母，送氣音（比 ㄱ 氣流更強）", exampleSound: "카" },
  { id: "c12", symbol: "ㅌ", romanization: "t", type: "consonant", pronunciationTip: "像中文「他」的聲母，送氣音（比 ㄷ 氣流更強）", exampleSound: "타" },
  { id: "c13", symbol: "ㅍ", romanization: "p", type: "consonant", pronunciationTip: "像中文「怕」的聲母，送氣音（比 ㅂ 氣流更強）", exampleSound: "파" },
  { id: "c14", symbol: "ㅎ", romanization: "h", type: "consonant", pronunciationTip: "像中文「哈」的聲母", exampleSound: "하" },
  { id: "c15", symbol: "ㄲ", romanization: "kk", type: "consonant", pronunciationTip: "緊音 — 喉嚨繃緊，不送氣的 k 音（類似中文「哥」但更短促有力）", exampleSound: "까" },
  { id: "c16", symbol: "ㄸ", romanization: "tt", type: "consonant", pronunciationTip: "緊音 — 喉嚨繃緊，不送氣的 t 音", exampleSound: "따" },
  { id: "c17", symbol: "ㅃ", romanization: "pp", type: "consonant", pronunciationTip: "緊音 — 喉嚨繃緊，不送氣的 p 音", exampleSound: "빠" },
  { id: "c18", symbol: "ㅆ", romanization: "ss", type: "consonant", pronunciationTip: "緊音 — 喉嚨繃緊，不送氣的 s 音", exampleSound: "싸" },
  { id: "c19", symbol: "ㅉ", romanization: "jj", type: "consonant", pronunciationTip: "緊音 — 喉嚨繃緊，不送氣的 j 音", exampleSound: "짜" },
];

export const hangulVowels: HangulItem[] = [
  { id: "v1", symbol: "ㅏ", romanization: "a", type: "vowel", pronunciationTip: "像中文「啊」", exampleSound: "아" },
  { id: "v2", symbol: "ㅑ", romanization: "ya", type: "vowel", pronunciationTip: "像中文「呀」", exampleSound: "야" },
  { id: "v3", symbol: "ㅓ", romanization: "eo", type: "vowel", pronunciationTip: "嘴巴張開，介於「啊」和「哦」之間", exampleSound: "어" },
  { id: "v4", symbol: "ㅕ", romanization: "yeo", type: "vowel", pronunciationTip: "在 ㅓ 前加 y 音", exampleSound: "여" },
  { id: "v5", symbol: "ㅗ", romanization: "o", type: "vowel", pronunciationTip: "嘴巴圓起來，像中文「哦」", exampleSound: "오" },
  { id: "v6", symbol: "ㅛ", romanization: "yo", type: "vowel", pronunciationTip: "在 ㅗ 前加 y 音", exampleSound: "요" },
  { id: "v7", symbol: "ㅜ", romanization: "u", type: "vowel", pronunciationTip: "嘴巴圓起來，像中文「烏」", exampleSound: "우" },
  { id: "v8", symbol: "ㅠ", romanization: "yu", type: "vowel", pronunciationTip: "在 ㅜ 前加 y 音", exampleSound: "유" },
  { id: "v9", symbol: "ㅡ", romanization: "eu", type: "vowel", pronunciationTip: "嘴巴扁平，像微笑時的嘴型發音", exampleSound: "으" },
  { id: "v10", symbol: "ㅣ", romanization: "i", type: "vowel", pronunciationTip: "像中文「一」", exampleSound: "이" },
  { id: "v11", symbol: "ㅐ", romanization: "ae", type: "vowel", pronunciationTip: "像英文 bed 的 e", exampleSound: "애" },
  { id: "v12", symbol: "ㅒ", romanization: "yae", type: "vowel", pronunciationTip: "在 ㅐ 前加 y 音", exampleSound: "얘" },
  { id: "v13", symbol: "ㅔ", romanization: "e", type: "vowel", pronunciationTip: "像英文 set 的 e，現代韓語中與 ㅐ 幾乎相同", exampleSound: "에" },
  { id: "v14", symbol: "ㅖ", romanization: "ye", type: "vowel", pronunciationTip: "在 ㅔ 前加 y 音", exampleSound: "예" },
  { id: "v15", symbol: "ㅘ", romanization: "wa", type: "vowel", pronunciationTip: "ㅗ + ㅏ 的組合，像中文「哇」", exampleSound: "와" },
  { id: "v16", symbol: "ㅙ", romanization: "wae", type: "vowel", pronunciationTip: "ㅗ + ㅐ 的組合", exampleSound: "왜" },
  { id: "v17", symbol: "ㅚ", romanization: "oe", type: "vowel", pronunciationTip: "ㅗ + ㅣ 的組合，現代發音接近 we", exampleSound: "외" },
  { id: "v18", symbol: "ㅝ", romanization: "wo", type: "vowel", pronunciationTip: "ㅜ + ㅓ 的組合", exampleSound: "워" },
  { id: "v19", symbol: "ㅞ", romanization: "we", type: "vowel", pronunciationTip: "ㅜ + ㅔ 的組合", exampleSound: "웨" },
  { id: "v20", symbol: "ㅟ", romanization: "wi", type: "vowel", pronunciationTip: "ㅜ + ㅣ 的組合，像中文「威」", exampleSound: "위" },
  { id: "v21", symbol: "ㅢ", romanization: "ui", type: "vowel", pronunciationTip: "ㅡ + ㅣ 的組合，快速連讀", exampleSound: "의" },
];

export const allHangul: HangulItem[] = [...hangulConsonants, ...hangulVowels];
