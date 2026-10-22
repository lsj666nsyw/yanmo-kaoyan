/* 翻译 · 英语一句子翻译 + 英语二段落翻译 */
window.TRANSLATIONS = {
  methods: [
    ["断句", "先找连词、关系词、介词短语和分词结构，把长句切成若干意群。每个意群先能独立说通，再考虑如何拼接。"],
    ["抓主干", "先译主谓宾，把主干落地。定语、状语、插入语都先放一边，避免一开始就陷进修饰成分。"],
    ["处理从句", "定语从句短，前置为“的”；长，拆成独立分句。状语从句按中文习惯调整顺序，条件、让步常前置。"],
    ["调整语序", "英文先主句后背景，中文常先背景后结论。被动句能转主动就转，不能转就保留“被、由、受到”。"],
    ["润色", "检查搭配、指代、单复数与否定范围。宁可不逐词对应，也要保证中文通顺、意思不走样。"]
  ],
  pitfalls: [
    "逐词硬译，中文不成句。翻译考的是“意思对、中文顺”，不是词对词。",
    "漏译插入语、同位语和括号内容。这些部分常是采分点。",
    "代词指代不清。it / they / this 必须回到原文找到具体所指。",
    "定语过长，一路“的”到底。超过十几个字的定语，果断拆句。",
    "否定范围判断错误。not ... because ... 常是“并非因为”，不是“因为不”。",
    "时态、虚拟语气丢失。would have done、were it not for 必须译出“本来、若不是”。"
  ],
  sentences: [
    {
      id: 1,
      en: "It is not the amount of information a person can recall that matters most, but the ability to judge which parts of it are worth trusting.",
      tags: ["强调句", "not ... but ...", "定语从句"],
      chunks: [
        ["It is not the amount of information ... that matters most", "强调句，强调 not the amount of information"],
        ["a person can recall", "省略关系词的定语从句，修饰 information"],
        ["but the ability to judge which parts of it are worth trusting", "not ... but ... 的并列成分；which 从句作 judge 的宾语"]
      ],
      ref: "最重要的不是一个人能回忆起多少信息，而是判断其中哪些部分值得信任的能力。",
      points: [
        "It is ... that ... 是强调句，翻译时用“正是/是……的”或直接调整语序，不必译出“它”。",
        "not ... but ... 译为“不是……而是……”，注意否定范围只覆盖前者。",
        "which parts of it are worth trusting 作 judge 的宾语，译为“其中哪些部分值得信任”。"
      ],
      words: [["recall", "回忆起"], ["judge", "判断"], ["worth trusting", "值得信任"]]
    },
    {
      id: 2,
      en: "Although the report acknowledges that progress has been made, it argues that the gains are unevenly distributed and may not survive the next economic downturn.",
      tags: ["让步状语从句", "宾语从句", "并列"],
      chunks: [
        ["Although the report acknowledges that progress has been made", "让步状语从句；that 从句作 acknowledges 的宾语"],
        ["it argues that the gains are unevenly distributed", "主句；that 从句作 argues 的宾语"],
        ["and may not survive the next economic downturn", "与 are unevenly distributed 并列，共用 the gains 作主语"]
      ],
      ref: "尽管报告承认已经取得进展，但它认为这些成果分配不均，且可能无法经受下一次经济衰退。",
      points: [
        "Although 译为“尽管”，主句不再加“但是”，避免中文关联词重复。",
        "the gains 指前文的 progress，译为“这些成果/进展”，不要直译“收益”。",
        "may not survive 译为“可能无法经受/挺过”，survive 在此不是“幸存”。"
      ],
      words: [["acknowledge", "承认"], ["unevenly", "不均地"], ["downturn", "衰退"]]
    },
    {
      id: 3,
      en: "The assumption that longer working hours necessarily produce better results has been challenged by studies showing that fatigue reduces both the quality and the speed of work.",
      tags: ["同位语从句", "非谓语", "被动"],
      chunks: [
        ["The assumption ... has been challenged by studies", "主干，被动语态"],
        ["that longer working hours necessarily produce better results", "同位语从句，说明 assumption 的内容"],
        ["showing that fatigue reduces both the quality and the speed of work", "现在分词短语修饰 studies；that 从句作 showing 的宾语"]
      ],
      ref: "工作时间越长，成果必然越好——这一假设已受到研究的挑战；这些研究表明，疲劳会同时降低工作的质量和速度。",
      points: [
        "同位语从句较长，可先译为“这一假设”，再用破折号或冒号引出内容。",
        "被动 has been challenged by 可保留“受到……的挑战”，比“被研究挑战”自然。",
        "both ... and ... 译为“既……又……”或“同时……和……”，不要漏掉后者。"
      ],
      words: [["assumption", "假设"], ["necessarily", "必然地"], ["fatigue", "疲劳"]]
    },
    {
      id: 4,
      en: "What makes the proposal attractive is not its originality, but the fact that it can be implemented without raising taxes.",
      tags: ["主语从句", "not ... but ...", "同位语从句"],
      chunks: [
        ["What makes the proposal attractive", "what 引导主语从句"],
        ["is not its originality", "系表结构，否定部分"],
        ["but the fact that it can be implemented without raising taxes", "but 后的并列表语；the fact that 引出同位语从句"]
      ],
      ref: "这项提案吸引人之处，不在于其原创性，而在于它可以在不增税的情况下实施。",
      points: [
        "What 主语从句译为“……之处/……的地方”，比“什么使……”更符合中文。",
        "the fact that 常可省略“事实”二字，直接译从句内容。",
        "without raising taxes 译为“在不增税的情况下”，介词短语转条件。"
      ],
      words: [["originality", "原创性"], ["implement", "实施"], ["raise taxes", "增税"]]
    },
    {
      id: 5,
      en: "Given the speed at which technology changes, any regulation written today is likely to be outdated before it is fully enforced.",
      tags: ["过去分词状语", "定语从句", "时间状语从句"],
      chunks: [
        ["Given the speed at which technology changes", "Given 引导原因状语；at which 定语从句修饰 speed"],
        ["any regulation written today", "过去分词 written today 后置修饰 regulation"],
        ["is likely to be outdated before it is fully enforced", "主句；before 引导时间状语从句，被动"]
      ],
      ref: "鉴于技术变化之快，今天制定的任何监管措施都可能在全面实施之前就已过时。",
      points: [
        "Given 在此是介词，意为“考虑到、鉴于”，不是“被给予”。",
        "at which technology changes 修饰 speed，译为“技术变化的速度”。",
        "before it is fully enforced 译为“在全面实施之前”，被动转主动更自然。"
      ],
      words: [["given", "考虑到"], ["regulation", "监管规定"], ["enforce", "实施；执行"]]
    },
    {
      id: 6,
      en: "The researchers conclude that while social media does not cause depression, it can intensify feelings of isolation among those who already feel excluded.",
      tags: ["宾语从句", "让步状语从句", "定语从句"],
      chunks: [
        ["The researchers conclude that ...", "主句 + 宾语从句"],
        ["while social media does not cause depression", "while 引导让步状语，意为“虽然”"],
        ["it can intensify feelings of isolation among those who already feel excluded", "让步从句对应的主句；who 从句修饰 those"]
      ],
      ref: "研究者得出结论：社交媒体虽然不会导致抑郁，但会加剧那些本就感到被排斥的人的孤立感。",
      points: [
        "while 在此不是“当……时”，而是“虽然”，与主句形成让步关系。",
        "those who ... 译为“那些……的人”，定语前置。",
        "feel excluded 是被动含义，译为“感到被排斥”，不要译成“感到排除”。"
      ],
      words: [["intensify", "加剧"], ["isolation", "孤立"], ["excluded", "被排斥的"]]
    },
    {
      id: 7,
      en: "Rather than asking whether machines will replace teachers, we should ask what kind of teaching machines cannot provide.",
      tags: ["rather than", "宾语从句", "对比"],
      chunks: [
        ["Rather than asking whether machines will replace teachers", "rather than 引导对比，后接动名词；whether 从句作 asking 的宾语"],
        ["we should ask", "主句"],
        ["what kind of teaching machines cannot provide", "what 引导宾语从句"]
      ],
      ref: "与其问机器是否会取代教师，不如问机器无法提供什么样的教学。",
      points: [
        "Rather than 译为“与其……不如……”，前后动作形成对比。",
        "whether 从句译为“是否……”，作 ask 的宾语。",
        "what kind of teaching 是 provide 的宾语，中文调整为“提供什么样的教学”。"
      ],
      words: [["rather than", "而不是；与其"], ["replace", "取代"], ["provide", "提供"]]
    },
    {
      id: 8,
      en: "A city that invests in public space is not merely improving the quality of daily life; it is also creating the conditions for encounters that would otherwise never take place.",
      tags: ["定语从句", "not merely ... but also", "虚拟"],
      chunks: [
        ["A city that invests in public space", "that 定语从句修饰 city"],
        ["is not merely improving the quality of daily life", "第一个分句"],
        ["it is also creating the conditions for encounters", "第二个分句，与 not merely 呼应"],
        ["that would otherwise never take place", "定语从句修饰 encounters；otherwise 含虚拟意味"]
      ],
      ref: "投资公共空间的城市不仅仅是在改善日常生活质量；它也在为那些否则永远不会发生的相遇创造条件。",
      points: [
        "not merely ... but also ... 译为“不仅……而且……”，两个分句用分号保留并列关系。",
        "would otherwise never take place 译为“否则永远不会发生”，otherwise 的虚拟含义要译出。",
        "encounters 在此指“相遇、邂逅”，不是“遭遇”。"
      ],
      words: [["invest in", "投资于"], ["encounter", "相遇"], ["otherwise", "否则"]]
    }
  ],
  passage: {
    en: "The idea of the sharing economy rests on a simple observation: many people own things they rarely use. Platforms that allow strangers to rent out a spare room or a car promise to turn idle assets into income. For consumers, the appeal is obvious: access without ownership, and often at a lower price. But the model also raises questions. Who is responsible when something goes wrong? Are the people providing the service workers or independent partners? And what happens to the neighbourhoods that become dependent on visitors? These are not merely technical questions. They concern the boundary between a market and a community, and that boundary is exactly what the sharing economy has made difficult to draw.",
    ref: "共享经济的理念源于一个简单的观察：许多人拥有一些自己很少使用的东西。允许陌生人出租空房或汽车的平台承诺把闲置资产变成收入。对消费者而言，吸引力显而易见：无需拥有即可使用，而且价格往往更低。但这种模式也带来了问题：出了事由谁负责？提供服务的人是劳动者，还是独立合作伙伴？那些变得依赖游客的社区又会怎样？这些不只是技术性问题。它们涉及市场与共同体之间的边界，而共享经济恰恰使这条边界变得难以划定。",
    points: [
      "rests on 译为“建立在……之上/源于”，不要译成“休息”。",
      "access without ownership 译为“无需拥有即可使用”，名词短语转动词结构。",
      "independent partners 指平台将服务者定义为“独立合作伙伴”，翻译时保留引号意味即可。",
      "the boundary between a market and a community 译为“市场与共同体之间的边界”，community 在此不是“社区”而是“共同体”。",
      "made difficult to draw 译为“使这条边界难以划定”，draw a boundary 是固定搭配。"
    ],
    words: [["sharing economy", "共享经济"], ["idle assets", "闲置资产"], ["access", "使用权"], ["boundary", "边界"]]
  }
};
