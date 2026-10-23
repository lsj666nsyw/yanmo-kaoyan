/* 新题型扩容：七选五 +1、排序 +1、小标题匹配 +1
   均为原创仿真材料，非真题原文。 */

(function () {
  /* ---------------- 七选五 ---------------- */
  window.SEVENS = (window.SEVENS || (window.SEVEN ? [window.SEVEN] : []));
  window.SEVENS.push({
    title: "The Value of Boredom",
    intro: "七选五 · 5 空 6 选项 · 建议 15 分钟。先通读首尾段，再盯住每空前的指代与逻辑词。",
    paragraphs: [
      "Boredom has a bad reputation. We treat it as a problem to be solved, something to be removed with a phone before it has a chance to settle. Yet a growing body of research suggests that the restless, uncomfortable state we call boredom is not simply empty time. {{1}}",
      "In one series of studies, participants who were asked to sit quietly with their thoughts later performed better on a test of creative thinking. The explanation is not that boredom itself generates ideas. {{2}}",
      "The mechanism seems to be attention. When the environment offers nothing to hold the mind, attention begins to wander, and that wandering is surprisingly productive. {{3}}",
      "None of this is an argument for removing every source of stimulation. The point is proportion. A child who is never bored may never learn to entertain herself; an adult who fills every waiting moment with a screen never gives his mind the chance to make an unexpected connection. {{4}}",
      "There is also a social cost. If we reach for a device the moment a conversation pauses, we teach ourselves that silence is a failure. {{5}}",
      "The practical suggestion is modest. Leave a few gaps in the day unfilled. Wait without a screen. Let the mind be uncomfortable for a few minutes and see what it does.",
      "Boredom, in other words, is not the absence of something. It may be the beginning of something else."
    ],
    options: [
      "Without that empty space, the mind keeps circling the same few thoughts.",
      "It is, rather, what the mind does with the empty space that follows.",
      "In that sense, the most creative moments often begin with nothing to do.",
      "In other words, the mind is never really idle; it is exploring.",
      "And we lose the small, unplanned conversations that make relationships durable.",
      "That is why schools should schedule more unstructured time between lessons."
    ],
    answers: [3, 1, 2, 0, 4],
    extra: 5,
    explain: [
      "前句说 boredom is not simply empty time（不是空白时间），D 用 In other words 重述：never really idle, it is exploring，与 not empty 对立统一。F 谈学校排课，话题跳得太远。",
      "前句 The explanation is not that... 先否定，B 的 It is, rather, ... 正是 not ... but ... 的对应结构，what the mind does with the empty space 承接 boredom 之后的空档。",
      "前句说注意力游走且 surprisingly productive，C 的 In that sense 作总结：最有创造力的时刻往往从无事可做开始，与 productive 呼应。F 的学校建议在此处无逻辑依据。",
      "前句用孩子与成年人对照，强调“没有空白”的代价，A 的 Without that empty space 直接承接，circling the same few thoughts 说明后果。",
      "前句说把沉默当失败，E 的 And we lose... conversations... durable 进一步说明社价代价，“攀谈消失、关系受损”与 silence is a failure 一致。"
    ],
    tips: [
      ["先定首尾", "首段提出“无聊不是空白时间”，尾段说“可能是另一件事的开始”。全文基调是替无聊正名，凡反对这一基调的选项都要先怀疑。"],
      ["抓 not ... but / rather", "第 2 空前一句是否定式，答案大概率是 it is rather / what... 这类转折承接，而不是并列或举例。"],
      ["指代必须落地", "that empty space、these connections 这类指代，前文必须能找到具体的先行词；找不到就换项。"],
      ["排除“正确但无关”", "多余项往往观点本身没错（学校该多留白），但和该空前后的论证链断开——正确不等于该放这里。"]
    ]
  });

  /* ---------------- 排序 ---------------- */
  window.ORDER_SETS = (window.ORDER_SETS || []);
  window.ORDER_SETS.push({
    title: "How a Habit Forms",
    intro: "排序题 · 7 段 · 首段 A、末段 G 已定 · 建议 18 分钟。先抓段首的逻辑信号词，再验证指代是否闭合。",
    paragraphs: [
      {
        label: "A",
        text: "A habit is a solution the brain has found to a recurring problem. Rather than deciding every morning whether to brush your teeth, you let a learned sequence run on its own. This saves attention, and attention is the scarcest resource the mind has. But the same machinery that makes habits useful also makes them hard to notice, and therefore hard to change."
      },
      {
        label: "B",
        text: "Once the cue is established, the behaviour follows with little conscious input. This is the routine — the part we usually call the habit, though it is only one link in the chain."
      },
      {
        label: "C",
        text: "The loop begins with a cue: a time, a place, a feeling, or the end of another action. The brain learns that this particular context predicts a particular reward, and it starts to pay attention to the context rather than to the decision."
      },
      {
        label: "D",
        text: "Context matters more than intention. People who move house often find that old habits weaken without effort, because the cues that triggered them are gone. Likewise, a habit formed in one room rarely survives a move to another."
      },
      {
        label: "E",
        text: "What keeps the loop running is the reward: the taste of the toothpaste, the relief of a clean desk, the brief pause after a notification. The reward must be immediate, because the brain repeats what feels good now far more readily than what is good in the long run."
      },
      {
        label: "F",
        text: "This is why the most reliable way to change a habit is to change the environment rather than to promise yourself that you will try harder. Make the desired behaviour easy to start and the undesired one difficult to reach, and the loop begins to work for you."
      },
      {
        label: "G",
        text: "None of this makes habits good or bad in themselves. They are simply the mind's way of saving effort. The question worth asking is not whether you have habits, but whether you have chosen the ones that run your day."
      }
    ],
    first: "A",
    last: "G",
    answers: ["C", "B", "E", "D", "F"],
    explain: [
      "A 末句提出“习惯很难被注意、因此很难改”，C 用 The loop begins with a cue 开启机制说明，从“是什么”转入“怎么形成”。",
      "C 定义 cue 并说大脑学会预测奖励，B 用 Once the cue is established 承接，转入 routine（行为本身）。",
      "B 说 routine 只是链条中的一环，E 用 What keeps the loop running is the reward 补上奖励环节，形成完整回路。",
      "E 讲奖励即时性，D 转向 Context matters more than intention；两段都在解释“为什么习惯不靠意志”，且 D 的 move house 是新的证据而非重复。",
      "D 强调环境/情境决定习惯，F 的 This is why... change the environment 正是对 D 的应用，未句 make... easy... difficult 收束到方法。"
    ],
    tips: [
      ["看段首信号词", "Once、What keeps、This is why 这类开头几乎注定承接上一段：先把它们的“因”排好，再放它们。"],
      ["两条线索一起用", "内容上 A 提出机制、C 讲 cue、B 讲 routine、E 讲 reward，逻辑上首尾固定；先排出大骨架再抠细节。"],
      ["验证指代闭合", "排完后检查每个 this / that / these 是否都能在上一段找到落点，找不到就说明顺序错了。"],
      ["别被“翻译通顺”骗", "每段单独读都通顺；排序题考的是段间关系，不是句子语法。"]
    ]
  });

  /* ---------------- 小标题匹配 ---------------- */
  window.HEADING_SETS = (window.HEADING_SETS || []);
  window.HEADING_SETS.push({
    title: "Why Organizations Forget",
    intro: "小标题匹配 · 5 段 6 选项 · 建议 12 分钟。先给六个标题各画一个核心词，再逐段找“主旨句”。",
    sections: [
      "When an experienced employee leaves, the organization loses more than a position. It loses the memory of why certain decisions were made, which suppliers caused trouble, and which shortcuts are safe. Exit interviews capture a fraction of this. The rest leaves quietly, and the next person learns it again at the organization's expense.",
      "Documents preserve conclusions but rarely the reasoning behind them. A policy states what to do; it seldom explains what was tried and rejected first. Years later, a team reads the conclusion, cannot reconstruct the argument, and either follows a rule it does not understand or repeats a mistake the record was meant to prevent.",
      "Incentives make the problem worse. Promotions and budgets reward launching projects, not maintaining the knowledge that older projects produced. A manager who spends a quarter documenting a system looks, in the language of performance reviews, less productive than one who starts something new.",
      "Tools change, and with them the past becomes harder to read. Files saved in a format nobody supports, dashboards built on a retired database, handover notes in a system that was replaced — each is a small act of forgetting, invisible at the moment it happens.",
      "Finally, forgetting is difficult to measure because it shows up as an absence. Nobody reports the decision that took three weeks to remake. The cost appears as delay, duplication and quiet frustration, none of which has an owner or a line in the budget."
    ],
    options: [
      "Records are not memory",
      "The pull of the new",
      "Knowledge that walks out of the door",
      "The invisibility of what is missing",
      "Hiring for memory",
      "When the tools change"
    ],
    answers: [2, 0, 1, 5, 3],
    extra: 4,
    explain: [
      "首句 When an experienced employee leaves 直接对应“知识随人离开”，整段讲离职带走的判断与经验，C 的 walks out of the door 是最贴切的概括。",
      "首句 Documents preserve conclusions but rarely the reasoning 就是主旨：文档存结论不存推理，A 的 Records are not memory 一句话点破。",
      "首句 Incentives make the problem worse，后文讲奖励“上新项目”而非维护旧知识，B 的 pull of the new 正是这一机制。",
      "首句 Tools change... the past becomes harder to read，讲格式、数据库、系统更替造成遗忘，F 直接对应。",
      "首句 forgetting is difficult to measure because it shows up as an absence，D 的 invisibility of what is missing 是精确改写；E 说“招聘有记忆的人”，文中未涉及。"
    ],
    tips: [
      ["先做主题地图", "六个选项的核心词：records、new、walks out（人走）、missing（看不见）、hiring、tools。尚未读段，先心里有数。"],
      ["标题是主旨不是细节", "某段出现 tools 一词不等于选“When the tools change”；要看整段是不是都在讲工具更替导致的遗忘。"],
      ["警惕“说得对但没提”", "多余项常是常识正确的观点（如招聘时考察记忆力），但段落根本没讨论，必须排除。"],
      ["选项只用一次", "5 段 6 项，做完回头数一遍：是否有一项完全没用到，且确实与任何段都不匹配。"]
    ]
  });
})();