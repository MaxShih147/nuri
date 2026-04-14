export type HangulItem = {
  id: string;
  symbol: string;
  romanization: string;
  ipa: string;
  type: "consonant" | "vowel";
  category?: "basic" | "double" | "compound";
  tensionType?: "lax" | "aspirated" | "tense" | "sonorant";
  pronunciationTip: string;
  mandarinCompare?: string;
  exampleSound?: string;
  exampleWord?: string;
  exampleWordMeaning?: string;
};
