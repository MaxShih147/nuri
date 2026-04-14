export type HangulItem = {
  id: string;
  symbol: string;
  romanization: string;
  type: "consonant" | "vowel";
  pronunciationTip: string;
  exampleSound?: string;
};
