/* 完形填空 + 新题型（七选五）· 仿真精练 */
window.CLOZE = {
  title: "The Uses of Boredom",
  intro: "10 题精简版 · 建议 12 分钟。先通读，再逐空。",
  paragraphs: [
    "Most of us treat boredom as a problem to be solved. The moment a queue stops moving, we reach for a phone. The behaviour is understandable, but it may carry a cost. A growing body of research suggests that allowing the mind to wander is not a waste of time; it is one of the ways the brain {{1}} new connections.",
    "Psychologists have found that people who are asked to perform a dull task often become more creative afterwards. The effect is strongest when the task requires little attention, {{2}} the mind has room to drift. In one experiment, participants who read a tedious phone book before a creativity test produced more original ideas than those who went straight to the test.",
    "None of this means that boredom is pleasant, {{3}} that schools should deliberately make lessons dull. The point is that constant stimulation may {{4}} the mental space in which ideas form. When every spare moment is filled, the mind has fewer opportunities to {{5}} what it has recently learned.",
    "Some researchers {{6}} that the effect has been exaggerated. They note that boredom can also lead to {{7}} behaviour, and that not everyone responds in the same way. The evidence is indeed {{8}}, based largely on small experiments. But the direction of the findings is {{9}} with what many writers have long claimed: that empty time is not empty at all.",
    "Perhaps the practical lesson is modest. We do not need to abandon our phones or schedule hours of nothing. We might simply leave a little space {{10}} the day, and see what the mind does with it."
  ],
  items: [
    { options: ["forms", "breaks", "copies", "ignores"], answer: 0, explain: "form connections 是固定搭配，意为“建立连接”。首句定调：发呆不是浪费时间，而是大脑建立新连接的方式。" },
    { options: ["unless", "so", "whereas", "provided"], answer: 1, explain: "前因后果：任务只需很少注意力，因此（so）心智有余力游走。unless/provided 表条件，whereas 表对比，均不合逻辑。" },
    { options: ["or", "nor", "but", "for"], answer: 1, explain: "前句有 None，后接 nor 构成“既不…也不…”的否定并列。or 虽可搭配否定，但 nor 与前面的 None 呼应更紧，且后接 that 从句结构完整。" },
    { options: ["expand", "shrink", "share", "divide"], answer: 1, explain: "第 3 段主旨：持续刺激挤压心智空间。shrink 与后文 fewer opportunities 一致；expand 方向相反。" },
    { options: ["process", "escape", "repeat", "reject"], answer: 0, explain: "process what it has learned 意为“处理所学内容”。与上段 sorting and storing、consolidation 语义一致。" },
    { options: ["deny", "concede", "argue", "doubt"], answer: 2, explain: "argue that ... 引出研究者的不同意见。deny 后接 that 表示“否认”，与“效应被夸大”搭配不当；concede 表让步，语气不符。" },
    { options: ["compulsive", "generous", "cautious", "deliberate"], answer: 0, explain: "boredom can also lead to compulsive behaviour 指无聊可能导致强迫性行为（如不停刷手机）。cautious/deliberate 均为褒义或中性，与“负面后果”不匹配。" },
    { options: ["limited", "decisive", "consistent", "public"], answer: 0, explain: "后文 based largely on small experiments 说明证据有限（limited）。decisive 与 small experiments 矛盾；consistent 与 But 转折不符。" },
    { options: ["consistent", "familiar", "crowded", "satisfied"], answer: 0, explain: "be consistent with 意为“与…一致”。But 之后转向：证据虽有限，但方向与作家们长期主张的一致。" },
    { options: ["in", "on", "at", "by"], answer: 0, explain: "leave a little space in the day 指在一天中留一点空白。in the day 在此表“在一天的时间里”，符合语境。" }
  ],
  tips: [
    ["先读首句，定主题与语气", "完形首句通常不设空，是全文的锚。先判断文章是说明、议论还是叙事，再决定选词的褒贬方向。"],
    ["先易后难，跳过生词", "搭配题、逻辑题往往比词义辨析题更容易。先把确定的空填上，再用已建立的整体语义反推难题。"],
    ["盯住逻辑连接词", "but / however / rather than 提示转折，so / therefore 提示因果，nor / neither 提示否定并列。逻辑方向错了，词义再顺也白搭。"],
    ["寻找原词复现与同义替换", "正确选项常与上下文形成复现：同词根、同义表达或上下义关系。本题中 process 与 consolidation、shrink 与 fewer 都是呼应。"],
    ["最后通读，检查搭配", "把所选词代回原文，专查动词与名词、介词与名词的搭配是否成立，以及单复数、时态是否一致。"]
  ]
};

window.SEVEN = {
  title: "Sleep and the Learning Brain",
  intro: "七选五 · 5 空 6 选项 · 建议 15 分钟。选项中有且只有一项多余。",
  paragraphs: [
    "Sleep is not simply a period of rest. While the body is still, the brain remains active, sorting and storing the experiences of the day. {{1}}",
    "During deep sleep, the brain replays patterns of activity that were recorded while we were awake. This replay appears to strengthen the connections between neurons, a process known as consolidation. {{2}}",
    "REM sleep, which is associated with vivid dreams, seems to play a different role. It may help the brain combine new information with existing knowledge, making unexpected connections. {{3}}",
    "Yet sleep is often the first thing we sacrifice when work piles up. Students stay up late to revise; office workers answer emails long after dinner. {{4}} The result is a population that is chronically short of sleep and largely unaware of what it is losing.",
    "None of this means that a single good night will repair weeks of poor sleep. {{5}} But the evidence is clear enough to justify treating sleep as part of the work, rather than a break from it."
  ],
  options: [
    "Adults need between seven and nine hours, though individual needs vary.",
    "The cost is not only fatigue but also a weaker ability to learn.",
    "In other words, the sleeping brain is not switched off; it is reorganizing.",
    "The good news is that the effect is cumulative: regular sleep pays off over time.",
    "The stronger these connections become, the more durable the memory.",
    "This may explain why a problem often looks different after a night's sleep."
  ],
  answers: [2, 4, 5, 1, 3],
  explain: [
    "前句说 brain remains active, sorting and storing；C 项用 In other words 重述，not switched off 对应 remains active，reorganizing 对应 sorting and storing。",
    "前句讲 strengthen the connections between neurons 与 consolidation；E 项用 these connections 直接指代，durable memory 是 consolidation 的结果。",
    "前句讲 combine new information with existing knowledge, making unexpected connections；F 项的 This 指代这一过程，问题睡一觉后看起来不同正是“ unexpected connections”的例证。",
    "前句列举学生熬夜、上班族深夜回邮件；后句说 The result is ...；B 项 The cost 承接上文，fatigue 与 weaker ability to learn 引出后文的 losing。",
    "前句说一晚好觉补不回数周亏空；后句用 But 转折；D 项 The good news 与前面的否定形成对照，cumulative 与 a single good night 对比。"
  ],
  extra: 0,
  tips: [
    ["先读选项，圈出线索词", "代词（this / these / it）、连接词（however / therefore）、重复名词，是判断位置的三类硬线索。"],
    ["空前后各读一句", "七选五考的是衔接，不是单句理解。至少读空白前一句和后一句，确认主语、指代和逻辑方向。"],
    ["代词必须能回指", "选项开头若是 This / These / It，前文必须有一个明确的单数或复数概念可供指代，否则排除。"],
    ["段落主题要一致", "每个选项都要服务于所在段的主旨。内容正确但话题跳脱的选项，通常是干扰项。"],
    ["最后代入通读", "把选定的句子放回原文，检查语法是否完整、逻辑是否顺畅，并确认多余项确实无处可放。"]
  ]
};
