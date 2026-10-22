/* 写作扩充 · 小作文 11—12、大作文 11—12、替换表达 +10
   范文为原创，语气克制，避免模板腔 */

(function () {
  window.WRITING.small.push({
    type: "倡议信",
    scene: "以学生会名义向全校同学发出倡议：在图书馆设立“无手机自习区”，说明理由与具体做法。",
    structure: [
      ["第一段", "称呼 + 直接提出倡议：设立无手机自习区，一句话说清地点与范围。"],
      ["第二段", "给出理由：不是否定手机，而是注意力易被打断；说明对需要安静者的实际帮助。"],
      ["第三段", "提出可执行的试点方案（两周、标识、入口存放），并发出呼吁。"]
    ],
    patterns: [
      "We are writing to propose a small change: a phone-free study zone on the fourth floor of the library.",
      "The point is not that phones are harmful in themselves. It is that attention is fragile.",
      "We suggest a two-week trial, with clear signs and a shelf at the entrance for phones.",
      "We hope you will support the trial."
    ],
    sample: `Dear fellow students,

We are writing to propose a small change: a phone-free study zone on the fourth floor of the library.

The point is not that phones are harmful in themselves. It is that attention is fragile. A single notification can interrupt several minutes of reading, and the cost is highest when the text is difficult. A designated zone would give those who need silence a place to work, while leaving the rest of the library as it is.

We suggest a two-week trial, with clear signs and a shelf at the entrance for phones. If it proves useful, it can be extended.

We hope you will support the trial.

Students' Union`,
    notes: [
      "倡议信要有具体主张，不要只写“希望大家放下手机”。地点、时长、执行方式越具体，越像真实倡议。",
      "第二段先退一步（不是否定手机），再落到注意力成本，避免把倡议写成道德指责。",
      "结尾用 trial、extended 留出余地，比“必须立即执行”更容易被接受。"
    ]
  });

  window.WRITING.small.push({
    type: "回复信",
    scene: "收到外教 Smith 教授邀请你参加下周五的学术沙龙，写信回复：接受邀请，并询问是否需要提前准备材料。",
    structure: [
      ["第一段", "感谢邀请 + 明确接受，点出时间与活动名称。"],
      ["第二段", "提出一两个具体问题：是否需要提交短评、材料是否都能在线获取。"],
      ["第三段", "表示愿意协助安排，礼貌收尾。"]
    ],
    patterns: [
      "Thank you for your invitation to the seminar on Friday, 12 May.",
      "I am glad to accept, and I look forward to the discussion of the reading list you mentioned.",
      "Could you tell me whether we are expected to submit a short response in advance?",
      "Please let me know if I can help with the arrangements."
    ],
    sample: `Dear Professor Smith,

Thank you for your invitation to the seminar on Friday, 12 May. I am glad to accept, and I look forward to the discussion of the reading list you mentioned.

To prepare properly, could you tell me whether we are expected to submit a short response in advance, or whether a careful reading of the two articles will be enough? I would also be grateful to know if any of the materials are not available online.

Please let me know if I can help with the arrangements.

Yours sincerely,
Li Ming`,
    notes: [
      "回复信的第一句就要完成“感谢 + 接受/拒绝”，不要让收信人读到第三行还不知道你的决定。",
      "问题要具体到“短评”“在线材料”，比“还有什么要求吗”更有效。",
      "结尾的 offer 要轻，不要写成客套长句；一句 Please let me know if I can help 即可。"
    ]
  });

  window.WRITING.big.push({
    kind: "图表作文",
    topic: "城市绿地与高温日数",
    prompt: "图表：2019—2025 年某城市人均公园绿地面积由 9.2 平方米升至 12.8 平方米；夏季 35℃ 以上高温日数由 31 天降至 24 天，但 2022 年曾回升至 29 天。",
    structure: [
      ["第一段", "描述两条曲线的总体方向，并点出中间波动，避免把趋势写成直线。"],
      ["第二段", "分析关联与限度：树木确实能降温，但气候背景、绿地可达性、树木存活率都会影响结果。"],
      ["第三段", "落到政策：把绿地当基础设施，种在最热的地方、管护到位，用温度与健康而非面积考核。"]
    ],
    sample: `The chart tracks two changes in the same city between 2019 and 2025. Parkland per resident rose from 9.2 to 12.8 square metres, while the number of summer days above 35°C fell from 31 to 24. The second line is not smooth: hot days increased in 2022 before declining again.

It is tempting to read the two trends as cause and effect. Trees do provide shade and release water vapour, and a mature canopy can lower street temperatures by several degrees. But a city's summer heat also depends on larger climate patterns, on how much of the green space is actually accessible, and on whether the trees survive long enough to mature. A single chart cannot separate these factors.

The policy lesson is nonetheless useful. Green space should be treated as infrastructure rather than decoration: planted where the heat is worst, maintained after the opening ceremony, and measured by temperature and health, not only by square metres.`,
    notes: [
      "图表作文不要只报数字。第一段点出“总体方向 + 一次波动”，比平铺直叙更像分析。",
      "第二段必须处理相关与因果的距离：树能降温，但一张图不能证明全部因果。这是拉开档次的地方。",
      "第三段的建议要能执行：种在哪里、如何维护、用什么指标考核，避免“政府应重视”式空话。"
    ]
  });

  window.WRITING.big.push({
    kind: "图画作文",
    topic: "打卡式阅读",
    prompt: "图画：地铁里，一位年轻人一手举书一手自拍，书页全新，手机屏幕显示“本月读完 12 本”。文字说明：“读过，还是拍过？”",
    structure: [
      ["第一段", "描述画面：人物、动作、书的细节、屏幕数字与文字说明。"],
      ["第二段", "揭示寓意：阅读变成可展示的分数，指标替代了理解本身。"],
      ["第三段", "给出克制的主张：不必停止分享，但要保留私下的慢读与笔记。"]
    ],
    sample: `The drawing shows a young man on the subway, holding a book in one hand and a phone in the other. He is taking a photograph of himself with the book; the pages are still crisp, and the screen already reads: twelve books finished this month. The caption asks a short question: read, or photographed?

The scene is funny because it is familiar. Reading has acquired a public scoreboard. Finishing becomes a number to display, and the display can replace the thing it was meant to measure. When the metric becomes the goal, a person can spend an evening managing appearances and never sit with a difficult paragraph.

The remedy is not to stop sharing what we read. It is to keep a private practice behind the public one: a page of notes, a question we cannot answer yet, a book we read slowly enough to disagree with. A number can record that reading happened. It cannot do the reading for us.`,
    notes: [
      "描述画面时抓住“书页全新”和“屏幕数字”这组反差，它们是讽刺的支点。",
      "第二段不要骂“年轻人虚荣”，而要分析机制：可展示的指标如何取代阅读本身。",
      "第三段给出可行的替代做法（笔记、慢读、允许不同意），比单纯呼吁“多读书”更有说服力。"
    ]
  });

  window.WRITING.upgrades.push(
    ["a lot of", "a considerable number of", "书面语中更具体，也避免口语化"],
    ["in my opinion", "the evidence points to", "把“个人看法”换成“证据指向”，议论文更有分量"],
    ["more and more", "an increasing share of", "描述比例变化，而非模糊的“越来越多”"],
    ["at the same time", "alongside this", "衔接更紧，适合句首推进论证"],
    ["for example", "a case in point is", "举例时避免每段都用 for example"],
    ["as we all know", "it is worth stating plainly", "删掉“众所周知”的套话，直接进入判断"],
    ["play a role", "shape", "把笼统的“起作用”换成具体的影响方式"],
    ["make ... better", "strengthen / refine", "根据语境选“加强”或“改进”，避免万能动词"],
    ["in modern society", "in the current arrangement", "避开空泛的时代背景，指向具体制度安排"],
    ["the reason is that", "the mechanism is", "从“原因”推进到“机制”，解释更深入"]
  );
})();
