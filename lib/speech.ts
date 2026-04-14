let cachedVoice: SpeechSynthesisVoice | null = null;

function getKoreanVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = speechSynthesis.getVoices();
  const korean = voices.filter((v) => v.lang.startsWith("ko"));

  // Prefer Yuna (Apple's high-quality Korean voice)
  cachedVoice =
    korean.find((v) => v.name.includes("Yuna")) ??
    korean.find((v) => v.localService) ??
    korean[0] ??
    null;

  return cachedVoice;
}

export function speakKorean(text: string, rate: number = 0.9) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = rate;
  utterance.pitch = 1;

  const voice = getKoreanVoice();
  if (voice) utterance.voice = voice;

  speechSynthesis.speak(utterance);
}

// Ensure voices are loaded (some browsers load async)
if (typeof window !== "undefined" && window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
  };
}
