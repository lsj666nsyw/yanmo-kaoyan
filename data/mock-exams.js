/* 全真模考卷配置
   只登记题目编号，不复制题干，保证与题库始终一致。
   cloze：两篇各 10 空，共 20 题；
   readings：4 篇 × 5 题；
   newtype：七选五 / 排序 / 小标题；
   translation：英语二为段落，英语一为 5 个句子；
   writing：小作文 + 大作文。 */

window.MOCK_TYPES = {
  en1: {
    key: "en1",
    label: "英语一",
    short: "英一",
    translation: 10,
    writingA: 10,
    writingB: 20,
    summary: "完形 10 + 阅读 40 + 新题型 10 + 翻译 10 + 写作 30",
    writingWords: "160–200"
  },
  en2: {
    key: "en2",
    label: "英语二",
    short: "英二",
    translation: 15,
    writingA: 10,
    writingB: 15,
    summary: "完形 10 + 阅读 40 + 新题型 10 + 翻译 15 + 写作 25",
    writingWords: "150 以上"
  }
};

window.MOCK_PAPERS = [
  {
    id: "en2-1",
    type: "en2",
    label: "模考一",
    name: "基础卷",
    note: "话题偏日常与社会，适合第一次完整走完 180 分钟。",
    cloze: [0, 1],
    readings: [1, 2, 3, 4],
    newtype: { kind: "seven", index: 0 },
    translation: { kind: "passage", id: 2 },
    writing: { small: 0, big: 0 }
  },
  {
    id: "en2-2",
    type: "en2",
    label: "模考二",
    name: "进阶卷",
    note: "经济、管理、医疗与劳动话题，新题型为排序。",
    cloze: [2, 3],
    readings: [5, 6, 7, 8],
    newtype: { kind: "order", index: 0 },
    translation: { kind: "passage", id: 3 },
    writing: { small: 1, big: 1 }
  },
  {
    id: "en1-1",
    type: "en1",
    label: "模考三",
    name: "提高卷",
    note: "城市、媒体、文化与政策话题，新题型为小标题。",
    cloze: [4, 5],
    readings: [9, 10, 11, 12],
    newtype: { kind: "heading", index: 0 },
    translation: { kind: "sentences", ids: [1, 8, 17, 25, 38] },
    writing: { small: 2, big: 2 }
  },
  {
    id: "en1-2",
    type: "en1",
    label: "模考四",
    name: "冲刺卷",
    note: "教育、生态、语言与法律话题，新题型为七选五。",
    cloze: [6, 7],
    readings: [13, 14, 15, 16],
    newtype: { kind: "seven", index: 1 },
    translation: { kind: "sentences", ids: [3, 14, 23, 33, 46] },
    writing: { small: 3, big: 3 }
  }
];
