import { VocabularyItem, UnitInfo } from "@/types/vocabulary";
import { unit01 } from "./unit01";
import { unit02 } from "./unit02";
import { unit03 } from "./unit03";
import { unit04 } from "./unit04";
import { unit05 } from "./unit05";
import { unit06 } from "./unit06";
import { unit07 } from "./unit07";
import { unit08 } from "./unit08";
import { unit09 } from "./unit09";
import { unit10 } from "./unit10";

export const units: UnitInfo[] = [
  { id: "unit01", name: "第一課", description: "基礎問候與禮貌", order: 1 },
  { id: "unit02", name: "第二課", description: "數字、時間與日期", order: 2 },
  { id: "unit03", name: "第三課", description: "交通與自駕", order: 3 },
  { id: "unit04", name: "第四課", description: "飲食與餐廳", order: 4 },
  { id: "unit05", name: "第五課", description: "住宿與設施", order: 5 },
  { id: "unit06", name: "第六課", description: "購物與消費", order: 6 },
  { id: "unit07", name: "第七課", description: "釜山景點與觀光", order: 7 },
  { id: "unit08", name: "第八課", description: "家庭與人際關係", order: 8 },
  { id: "unit09", name: "第九課", description: "緊急狀況與醫療", order: 9 },
  { id: "unit10", name: "第十課", description: "日常生活與實用表達", order: 10 },
];

export const allVocabulary: VocabularyItem[] = [
  ...unit01,
  ...unit02,
  ...unit03,
  ...unit04,
  ...unit05,
  ...unit06,
  ...unit07,
  ...unit08,
  ...unit09,
  ...unit10,
];

export function getVocabularyByUnit(subUnit: string): VocabularyItem[] {
  return allVocabulary.filter((item) => item.subUnit === subUnit);
}
