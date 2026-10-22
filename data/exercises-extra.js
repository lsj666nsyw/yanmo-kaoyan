/* 完形填空 + 七选五 · 扩充题库
   全部为原创仿真材料；每套均按考试题型设置，不与真题原文混同 */

(function () {
  window.CLOZES = [window.CLOZE];
  window.SEVENS = [window.SEVEN];

  window.CLOZES.push({
    title: "The Cost of Free Returns",
    intro: "10 题 · 建议 12 分钟。先通读，再逐空。",
    paragraphs: [
      "Online shopping has made returning a purchase almost as easy as buying one. A customer who dislikes the colour, the fit or the feel can send it back with a click, often without paying postage. Retailers present this as a service, and customers have come to treat it as a right. The convenience, {{1}}, is not free.",
      "Every return involves transport, packaging and inspection. Many returned items cannot be resold at full price; some are destroyed. The costs are {{2}} across all customers, including those who never return anything. In effect, careful shoppers {{3}} the habits of careless ones. The price tag does not show this transfer, which is why the system feels costless to the individual.",
      "Retailers have tried to {{4}} the problem with stricter rules: charging for returns, shortening deadlines or asking customers to explain why they are sending something back. These measures reduce the number of returns, but they can also {{5}} genuine mistakes. A customer who receives a damaged item should not be treated as a nuisance.",
      "A better approach may be to {{6}} information. If customers can see accurate measurements, detailed photographs and honest reviews before they buy, they are less likely to order three sizes knowing they will keep one. {{7}}, retailers have an incentive to hide such information, because a difficult return process may {{8}} a sale.",
      "None of this means returns should be made difficult. A generous return policy builds trust and allows people to shop with confidence. The goal is not to {{9}} returns but to design a system in which fewer are necessary. That requires better information, not {{10}} rules."
    ],
    items: [
      { options: ["therefore", "however", "otherwise", "besides"], answer: 1, explain: "前句说便利被当成权利，本句转折：这种便利并非免费。however 表转折，therefore 表结果，otherwise 表否则，besides 表递进。" },
      { options: ["reduced", "compared", "spread", "divided"], answer: 2, explain: "be spread across all customers 意为“分摊到所有顾客身上”。后文 careful shoppers 补贴 careless ones 也说明成本被分摊。" },
      { options: ["imitate", "subsidise", "punish", "ignore"], answer: 1, explain: "仔细购物的顾客通过商品价格，实际上补贴了随意退货者的成本。subsidise 意为“补贴”，与 transfer 呼应。" },
      { options: ["escape", "advertise", "repeat", "tackle"], answer: 3, explain: "tackle the problem 是“处理问题”的固定搭配。后文列举收费、缩短期限等措施，都是在试图解决退货成本问题。" },
      { options: ["correct", "prevent", "penalise", "explain"], answer: 2, explain: "严格规则可能惩罚真正的失误：顾客收到损坏商品，却被当成麻烦制造者。penalise 与 genuine mistakes 搭配最合逻辑。" },
      { options: ["improve", "withhold", "delete", "repeat"], answer: 0, explain: "后文说准确尺寸、详细照片和真实评价能让顾客少买错，说明应改善信息。withhold 是“隐瞒”，方向相反。" },
      { options: ["Similarly", "Yet", "For example", "Moreover"], answer: 1, explain: "前句说改善信息可减少退货，本句说商家却有动机隐瞒信息，形成转折。Yet 最合适。" },
      { options: ["reduce", "delay", "reveal", "boost"], answer: 3, explain: "退货麻烦可能“促进”销售，因为顾客怕麻烦而不敢退。boost a sale 意为促进销售；reduce 与语境相反。" },
      { options: ["encourage", "measure", "eliminate", "advertise"], answer: 2, explain: "目标不是消灭退货，而是让更少退货成为必要。eliminate 与后文“更少”形成对比；encourage 方向相反。" },
      { options: ["stricter", "simpler", "fewer", "clearer"], answer: 0, explain: "末句与上文 stricter rules 呼应：需要更好的信息，而不是更严的规则。simpler/fewer 与“规则”搭配不如 stricter 准确。" }
    ],
    tips: [
      ["先判断文章态度", "这篇不是反对退货，而是讨论退货成本由谁承担。抓住“便利不等于免费”这一基调，避免把作者读成反对消费者。"],
      ["注意成本转移", "spread、subsidise、transfer 构成一条语义链：退货成本被分摊，仔细购物者为随意退货者买单。"],
      ["区分手段与目的", "收费、缩短期限是手段，减少不必要退货才是目的。第 9、10 空都在纠正“越严越好”的误读。"],
      ["利用转折词", "however、yet 提示作者真正的立场。看到零售商有动机隐瞒信息，要意识到这是对市场激励的批评。"],
      ["代回检查搭配", "重点查 spread across、tackle the problem、boost a sale、eliminate returns 等动介、动名搭配。"]
    ]
  });

  window.CLOZES.push({
    title: "Why Cities Need Trees",
    intro: "10 题 · 建议 12 分钟。先通读，再逐空。",
    paragraphs: [
      "Trees are often treated as decoration in a city: pleasant to look at, but optional when budgets are tight. A growing body of evidence suggests that this view is {{1}}. Trees are infrastructure, and their benefits are measured in temperature, health and energy.",
      "The most obvious benefit is shade. On a hot day, the surface of a street can be far hotter than the air above it. Trees {{2}} that heat through shade and through water vapour released from their leaves. A mature tree can cool the air around it as effectively as a small air conditioner, {{3}} without using electricity.",
      "Trees also {{4}} air and water. Their leaves capture dust, and their roots help rain soak into the ground instead of rushing into drains. In cities with ageing sewers, this can {{5}} the risk of flooding. The benefits are not evenly distributed: wealthier neighbourhoods often have more trees, while poorer ones have fewer.",
      "Planting is the easy part. Keeping trees alive is {{6}}. Young trees need water, space and protection from vehicles and construction. A city that plants a thousand trees but {{7}} to maintain them may end up with a few hundred. The cost of maintenance is visible; the cost of losing the canopy is {{8}}.",
      "The lesson is that urban trees should be treated as long-term {{9}}, not seasonal projects. That means budgets for care, not only for planting, and plans that {{10}} the places where trees are most needed. A city's canopy is not a luxury. It is part of how the city works."
    ],
    items: [
      { options: ["correct", "mistaken", "popular", "recent"], answer: 1, explain: "后句说树木是基础设施，说明“装饰品、可有可无”的看法是错的。mistaken 与 view 搭配，表示“错误的观点”。" },
      { options: ["produce", "trap", "reduce", "reflect"], answer: 2, explain: "树木通过树荫和叶面释放的水汽降低热量。reduce that heat 与后文 cooling 一致；produce/trap 方向不符。" },
      { options: ["so", "because", "unless", "but"], answer: 3, explain: "树能像小空调一样降温，但不耗电，前后是对比关系。but 连接两个并列分句，最合逻辑。" },
      { options: ["pollute", "clean", "warm", "dry"], answer: 1, explain: "树叶吸附灰尘、树根帮助雨水下渗，说明树木清洁空气和水。clean 与后文 capture dust 呼应。" },
      { options: ["increase", "ignore", "measure", "reduce"], answer: 3, explain: "雨水下渗而不是冲进下水道，能降低洪水风险。reduce the risk 是固定搭配；increase 与语境相反。" },
      { options: ["cheaper", "optional", "harder", "popular"], answer: 2, explain: "前句说种植容易，本句转折：让树活下来更难。harder 与 Planting is the easy part 形成对比。" },
      { options: ["fails", "decides", "refuses", "promises"], answer: 0, explain: "种下千棵树却不维护，最终可能只剩几百棵。fail to maintain 表示“未能维护”，与 may end up with a few hundred 呼应。" },
      { options: ["small", "invisible", "temporary", "obvious"], answer: 1, explain: "维护成本看得见，失去树冠的成本却看不见。invisible 与 visible 形成对照，也呼应全文“基础设施价值常被低估”。" },
      { options: ["decoration", "problem", "experiment", "investment"], answer: 3, explain: "树木应被视为长期投资，而不是季节性项目。investment 与 budgets for care、long-term 呼应；decoration 是作者反对的看法。" },
      { options: ["ignore", "reduce", "prioritize", "delay"], answer: 2, explain: "规划应优先考虑最需要树木的地方。prioritize 与 the places where trees are most needed 搭配；ignore/delay 与主旨相反。" }
    ],
    tips: [
      ["抓“基础设施”这一核心", "文章把树从装饰品重新定义为基础设施。每段都在补一个功能：降温、净水、防洪、健康公平。"],
      ["注意可见与不可见", "维护成本可见，失去树冠的成本不可见。第 8 空和末段都围绕这一组对立展开。"],
      ["看对比关系", "decorative vs infrastructure、easy vs harder、visible vs invisible。完形的转折处往往就是答案。"],
      ["区分种植与养护", "第 4 段开始转向维护，第 9、10 空落在长期预算与规划优先序上，不要把全文读成“多植树”的口号。"],
      ["检查动词搭配", "reduce heat/risk、clean air、fail to maintain、prioritize places 都是常见搭配，代回原文逐一验证。"]
    ]
  });

  window.SEVENS.push({
    title: "How to Read a Scientific Claim",
    intro: "七选五 · 5 空 6 选项 · 建议 15 分钟。选项中有且只有一项多余。",
    paragraphs: [
      "News stories about science often begin with a striking claim: a food prevents memory loss, a habit shortens life, a supplement boosts performance. {{1}}",
      "The first question to ask is what kind of study produced the claim. A randomised trial, in which participants are assigned by chance to different groups, provides stronger evidence than an observational study, where researchers simply compare people who already differ in many ways. {{2}}",
      "The second question is whether the result is statistically significant, and what that actually means. A significant result is unlikely to have occurred by chance alone, but it is not necessarily large or important. {{3}}",
      "It also helps to look at who was studied. A trial of twenty healthy young adults may say little about older people with chronic illness. {{4}}",
      "None of this means that scientific claims should be dismissed. It means that they should be read with attention to method, size and context. {{5}}"
    ],
    options: [
      "A small effect in a large study can matter more than a large effect in a tiny one.",
      "The answer is usually more complicated than the headline suggests.",
      "Observational studies can still be valuable when a trial would be unethical or impossible.",
      "A single study is rarely the last word, and later research may change the picture.",
      "Readers should therefore treat every finding as equally reliable.",
      "The same caution applies to the population and the setting in which the research was done."
    ],
    answers: [1, 2, 0, 5, 3],
    explain: [
      "首段列举耸动标题，空白处应总起：答案通常比标题复杂。B 项 The answer ... more complicated than the headline 直接承接。",
      "前句比较随机试验与观察性研究，C 项补充观察性研究的价值，形成“更强证据/仍有价值”的平衡，且 Observational studies 复现前文。",
      "前句说显著不等于重要，A 项用 small effect / large effect 继续解释效应大小，衔接自然。",
      "前句说研究人群有限，F 项 The same caution applies to population and setting 用 same 指代前文的 caution，并补充研究环境。",
      "末段说不要否定科学，而要关注方法、规模与语境；D 项说单一研究很少是最终结论，正是“如何阅读”的收束。"
    ],
    extra: 4,
    tips: [
      ["先圈选项里的指代词", "The answer、The same caution、A single study 等短语都要求前文有明确指代对象。先找指代，再判断位置。"],
      ["注意段落功能", "首段引出问题，第二段讲研究类型，第三段讲统计显著，第四段讲研究人群，末段收束。选项必须服务所在段的功能。"],
      ["区分“补充”与“转折”", "C 项是对观察性研究的补充，不是否定随机试验；E 项“所有发现同样可靠”与全文谨慎态度冲突，是多余项。"],
      ["看复现词", "observational studies、effect、population、single study 等词在选项与原文之间复现，是定位线索。"],
      ["最后通读检查逻辑", "把选项代回，确认每段从主张到限定再到结论的链条完整，尤其注意末段不能突然变成“否定科学”。"]
    ]
  });

  window.SEVENS.push({
    title: "The Value of a Second Draft",
    intro: "七选五 · 5 空 6 选项 · 建议 15 分钟。选项中有且只有一项多余。",
    paragraphs: [
      "Writing is often taught as if it were a single act: think, write, submit. Professional writers rarely work that way. They produce a rough draft quickly, then revise it slowly, often with the help of a reader. {{1}}",
      "The first draft is for discovery. It is where the writer finds out what they actually think, rather than merely recording a thought that was already complete. {{2}} Perfectionism at this stage is often a way of avoiding the harder work of revision.",
      "Revision is not just correcting grammar. It means asking whether the argument holds together, whether the evidence is sufficient, and whether the reader can follow the path from one point to the next. {{3}}",
      "A good reader is invaluable. They notice gaps that the writer cannot see, because the writer knows what they meant. {{4}} The writer does not have to accept every suggestion, but they should understand why it was made.",
      "The lesson applies beyond writing. Any complex task benefits from a stage in which the work is examined rather than merely produced. {{5}}"
    ],
    options: [
      "That is why feedback is most useful when it is specific.",
      "The goal is to get something on the page, not to get it right immediately.",
      "It also means cutting passages that are elegant but irrelevant.",
      "The first version is therefore usually better than the final one.",
      "The separation between making and judging is a powerful habit.",
      "A second draft is not a sign of failure but a normal part of the process."
    ],
    answers: [5, 1, 2, 0, 4],
    explain: [
      "前句说专业写作者先快速写初稿、再慢慢修改，F 项把“第二稿”正常化，承接 rough draft 与 revise，且引出后文对初稿的讨论。",
      "前句说初稿是发现想法的过程，B 项 The goal is to get something on the page 正是对“先写出来”的说明，并与后文 perfectionism 形成对照。",
      "前句列举修改要检查论证、证据与读者路径，C 项 It also means cutting ... 继续补充修改的删减工作，elegant but irrelevant 与“论证是否成立”呼应。",
      "前句说读者能看见作者看不见的缺口，A 项 That is why feedback ... specific 承接“读者反馈”，并解释后文“不必接受每个建议，但要理解原因”。",
      "前句说任何复杂任务都需要“审视”阶段，E 项 The separation between making and judging 概括这一阶段，收束全文。"
    ],
    extra: 3,
    tips: [
      ["抓文章结构", "全文按“初稿—修改—读者反馈—迁移到其他任务”推进。选项必须落在对应阶段，不能提前或重复。"],
      ["注意代词指代", "That is why 指前句“读者能发现缺口”；It also means 指前句“修改不只是改语法”。指代不清的选项优先排除。"],
      ["区分相似表达", "D 项“初稿通常比终稿好”与全文“修改提升质量”相反，是典型的多余项。"],
      ["看段末与段首的咬合", "第 1 空要引出“第二稿正常”，第 5 空要收束到“制作与判断分离”，位置决定选项功能。"],
      ["代入后通读", "检查每段是否围绕一个中心：初稿、修改、反馈、迁移。话题跳脱的选项即使单句正确也不能选。"]
    ]
  });
})();
