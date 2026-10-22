/* 翻译练习扩充 · 9—16
   英语一单句翻译与英语二段落翻译共用方法，句子为原创仿真材料 */

(function () {
  const extra = [
    {
      id: 9,
      en: "The fact that a policy works in one country does not mean it can be transplanted to another, where institutions, resources and public expectations may be entirely different.",
      tags: ["同位语从句", "宾语从句", "定语从句"],
      chunks: [
        ["The fact that a policy works in one country", "the fact that 引导同位语从句，说明 fact 的内容"],
        ["does not mean it can be transplanted to another", "主句 + 省略 that 的宾语从句；transplant 在此是“照搬”"],
        ["where institutions, resources and public expectations may be entirely different", "where 引导定语从句修饰 another"]
      ],
      ref: "一项政策在一个国家行之有效，并不意味着它可以照搬到另一个国家；后者的制度、资源和公众预期可能完全不同。",
      points: [
        "the fact that 常可省略“事实”二字，直接译从句内容，避免中文冗长。",
        "transplant 本义“移植”，此处译“照搬”更贴合政策语境。",
        "where 从句较长，拆成独立分句，用“后者”衔接。"
      ],
      words: [["transplant", "移植；照搬"], ["institution", "制度；机构"], ["expectation", "预期"]]
    },
    {
      id: 10,
      en: "Rather than treating the decline of local news as a business failure, we should ask what kind of public good is lost when no one is paid to attend the meeting.",
      tags: ["rather than", "宾语从句", "时间状语从句"],
      chunks: [
        ["Rather than treating the decline of local news as a business failure", "rather than 引导对比状语，后接动名词"],
        ["we should ask", "主句"],
        ["what kind of public good is lost", "what 引导宾语从句"],
        ["when no one is paid to attend the meeting", "时间状语从句"]
      ],
      ref: "与其把地方新闻的衰落当作商业失败，我们更应追问：当没有人因参加会议而获得报酬时，究竟失去了怎样的公共福祉。",
      points: [
        "rather than 在句首常译“与其……不如……”，不要译成“而不是”后接完整句。",
        "public good 是“公共善/公共福祉”，不是“公共商品”。",
        "when 从句是追问的背景，翻译时可提前，使中文因果更清楚。"
      ],
      words: [["decline", "衰落"], ["public good", "公共福祉"], ["attend", "参加"]]
    },
    {
      id: 11,
      en: "Although the report acknowledges that progress has been uneven, it argues that the direction of change matters more than the pace, provided that the change is real.",
      tags: ["让步状语从句", "宾语从句", "比较结构", "条件状语从句"],
      chunks: [
        ["Although the report acknowledges that progress has been uneven", "让步状语从句；that 从句作 acknowledges 的宾语"],
        ["it argues that the direction of change matters more than the pace", "主句 + 宾语从句；more than 比较结构"],
        ["provided that the change is real", "provided that 引导条件状语，意为“只要”"]
      ],
      ref: "尽管报告承认进展并不均衡，但它认为变化的方向比速度更重要——只要变化是真实的。",
      points: [
        "provided that 是“只要”，不是“提供”。",
        "matters more than 译为“比……更重要”，matter 在此是动词。",
        "uneven 指“不均衡”，不要译成“不公平”。"
      ],
      words: [["acknowledge", "承认"], ["uneven", "不均衡的"], ["provided that", "只要"]]
    },
    {
      id: 12,
      en: "What makes the proposal difficult to reject is not its ambition but its cost, which falls on taxpayers today, and its benefits, which may not appear for a decade.",
      tags: ["主语从句", "not ... but ...", "定语从句"],
      chunks: [
        ["What makes the proposal difficult to reject", "what 引导主语从句"],
        ["is not its ambition but its cost", "not ... but ... 连接表语"],
        ["which falls on taxpayers today", "定语从句修饰 cost"],
        ["and its benefits, which may not appear for a decade", "与 cost 并列；which 从句修饰 benefits"]
      ],
      ref: "这项提案难以拒绝，不是因为其雄心，而是因为其成本由今天的纳税人承担，而其收益可能十年后才显现。",
      points: [
        "not ... but ... 连接的是 its ambition 与 its cost，翻译时保持“不是……而是……”。",
        "两个 which 从句分别修饰 cost 与 benefits，不能合并成一个。",
        "difficult to reject 是“难以拒绝”，即“很有吸引力”，不要译成“难以反对”。"
      ],
      words: [["ambition", "雄心"], ["taxpayer", "纳税人"], ["benefit", "收益"]]
    },
    {
      id: 13,
      en: "The researchers warn that the apparent link between screen time and poor sleep may reflect a third factor, such as stress, rather than a direct causal effect.",
      tags: ["宾语从句", "rather than", "插入语"],
      chunks: [
        ["The researchers warn that ...", "主句 + 宾语从句"],
        ["the apparent link between screen time and poor sleep", "宾语从句的主语"],
        ["may reflect a third factor, such as stress", "谓语 + 插入举例"],
        ["rather than a direct causal effect", "rather than 引导对比，否定直接因果"]
      ],
      ref: "研究人员警告说，屏幕使用时间与睡眠不佳之间的表面关联，可能反映的是压力等第三因素，而非直接的因果关系。",
      points: [
        "apparent 是“表面的、看似如此”，暗示未必真实。",
        "a third factor 是“第三因素”，统计语境中常指混杂因素。",
        "rather than 连接 a third factor 与 a direct causal effect，译“而非”。"
      ],
      words: [["apparent", "表面的"], ["causal", "因果的"], ["stress", "压力"]]
    },
    {
      id: 14,
      en: "If the city had invested in maintenance when the bridge was first built, it would not now be facing a repair bill several times larger than the original saving.",
      tags: ["虚拟条件句", "时间状语从句", "比较结构"],
      chunks: [
        ["If the city had invested in maintenance", "与过去事实相反的虚拟条件"],
        ["when the bridge was first built", "时间状语从句"],
        ["it would not now be facing a repair bill", "主句，表示与现在结果相反的虚拟"],
        ["several times larger than the original saving", "比较结构，修饰 repair bill"]
      ],
      ref: "如果这座城市在桥刚建成时就投资维护，它现在就不会面对一张比当初节省的费用高出数倍的维修账单。",
      points: [
        "这是混合虚拟：条件指向过去（had invested），结果指向现在（would not now be facing）。",
        "several times larger than 译为“比……高出数倍”，不要译成“是……的数倍大”。",
        "original saving 指当初省下的维护费，不是“原始储蓄”。"
      ],
      words: [["maintenance", "维护"], ["repair bill", "维修账单"], ["saving", "节省下来的钱"]]
    },
    {
      id: 15,
      en: "Museums are increasingly asked to explain not only what they hold but how they acquired it, a question that many of them are ill prepared to answer.",
      tags: ["宾语从句", "not only ... but ...", "同位语"],
      chunks: [
        ["Museums are increasingly asked to explain", "主句，被动语态"],
        ["not only what they hold but how they acquired it", "not only ... but ... 连接两个宾语从句"],
        ["a question that many of them are ill prepared to answer", "同位语，概括前面的问题；that 定语从句修饰 question"]
      ],
      ref: "人们越来越多地要求博物馆不仅说明自己收藏了什么，还要说明这些藏品是如何获得的——而许多博物馆对此准备不足。",
      points: [
        "not only ... but ... 连接两个宾语从句，翻译时保留“不仅……还……”。",
        "a question 是同位语，可译为“而这个问题”或破折号引出。",
        "ill prepared 是“准备不足”，不是“生病了”。"
      ],
      words: [["acquire", "获得"], ["ill prepared", "准备不足的"], ["hold", "收藏；持有"]]
    },
    {
      id: 16,
      en: "The more confident a model appears, the more carefully its output must be checked, since fluency is not the same as accuracy and can conceal errors.",
      tags: ["比较结构", "原因状语从句", "并列"],
      chunks: [
        ["The more confident a model appears", "the more ... the more ... 比较结构的前半"],
        ["the more carefully its output must be checked", "比较结构的后半主句"],
        ["since fluency is not the same as accuracy", "since 引导原因状语从句"],
        ["and can conceal errors", "与 is not the same as accuracy 并列，主语仍是 fluency"]
      ],
      ref: "模型显得越自信，其输出就越需要仔细核查，因为流畅并不等于准确，而且流畅可能掩盖错误。",
      points: [
        "the more ... the more ... 译为“越……越……”，注意后半用倒装语序。",
        "since 在此是“因为”，不是“自从”。",
        "can conceal errors 的主语是 fluency，不是 output，翻译时补出“流畅”。"
      ],
      words: [["confident", "自信的"], ["fluency", "流畅"], ["conceal", "掩盖"]]
    },
    {
      id: 17,
      en: "Students who merely reread a chapter tend to overestimate how much they have learned, because the ease of reading is mistaken for the strength of memory.",
      tags: ["定语从句", "宾语从句", "原因状语从句"],
      chunks: [
        ["Students who merely reread a chapter", "who 定语从句修饰 students"],
        ["tend to overestimate how much they have learned", "how much 引导宾语从句，作 overestimate 的宾语"],
        ["because the ease of reading is mistaken for the strength of memory", "because 原因状语从句；be mistaken for 表示“被误当作”"]
      ],
      ref: "只是把一章重读一遍的学生，往往会高估自己掌握了多少，因为阅读时的轻松被误当成了记忆的牢固。",
      points: [
        "merely 译“仅仅、只是”，强调方法单一。",
        "be mistaken for 是被动结构，译“被误认为”，注意与 mistake 主动语态区分。",
        "overestimate 后接 how much 从句，译“高估自己掌握了多少”。"
      ],
      words: [["merely", "仅仅"], ["overestimate", "高估"], ["be mistaken for", "被误当作"]]
    },
    {
      id: 18,
      en: "Although spacing practice feels less productive than studying in one long session, it produces the kind of memory that survives a busy week.",
      tags: ["让步状语从句", "比较结构", "定语从句"],
      chunks: [
        ["Although spacing practice feels less productive than studying in one long session", "让步状语从句；less ... than 比较结构"],
        ["it produces the kind of memory", "主句；the kind of 后接定语从句"],
        ["that survives a busy week", "that 定语从句修饰 memory"]
      ],
      ref: "尽管间隔练习感觉不如一次性长时间学习高效，但它产生的记忆能经受住忙碌的一周。",
      points: [
        "feel 在此是系动词，译“感觉”，不要译成“触摸”。",
        "less productive than 是“不如……高效”，注意比较对象是两种学习方式。",
        "survives a busy week 是拟人说法，译“经受住忙碌一周的考验”。"
      ],
      words: [["spacing", "间隔"], ["productive", "高效的"], ["survive", "经受住"]]
    },
    {
      id: 19,
      en: "Streetlights do not destroy a habitat outright; they quietly change which species can live in it, often in ways that take years to notice.",
      tags: ["并列句", "宾语从句", "定语从句"],
      chunks: [
        ["Streetlights do not destroy a habitat outright", "分号前的否定句；outright 意为“彻底地”"],
        ["they quietly change which species can live in it", "which 引导宾语从句，作 change 的宾语"],
        ["often in ways that take years to notice", "that 定语从句修饰 ways"]
      ],
      ref: "路灯并不会一下子摧毁一个栖息地；它们悄悄改变着哪些物种能在其中生存，而这些变化往往要多年后才被察觉。",
      points: [
        "outright 在此是“彻底、一下子”，不是“公开地”。",
        "which species 从句整体作宾语，译“改变着哪些物种能生存”。",
        "that take years to notice 修饰 ways，可拆成独立分句译出。"
      ],
      words: [["outright", "彻底地"], ["species", "物种"], ["notice", "察觉"]]
    },
    {
      id: 20,
      en: "Unlike many pollutants, light disappears the moment it is switched off, which is why cities can undo much of the damage simply by choosing better lamps.",
      tags: ["时间状语从句", "非限制性定语从句", "方式状语"],
      chunks: [
        ["Unlike many pollutants", "对比状语，译“与许多污染物不同”"],
        ["light disappears the moment it is switched off", "the moment 引导时间状语从句，相当于 as soon as"],
        ["which is why cities can undo much of the damage", "which 指代整个前句，译“正因如此……”"],
        ["simply by choosing better lamps", "方式状语，修饰 undo"]
      ],
      ref: "与许多污染物不同，光在被关掉的那一刻就消失了；正因如此，城市只要换用更好的灯具，就能消除大部分损害。",
      points: [
        "the moment 在此是连词，译“一……就……”。",
        "which 指代前面的整句，不要误解为修饰 light。",
        "undo damage 译“消除损害”，不要译成“撤销”。"
      ],
      words: [["pollutant", "污染物"], ["undo", "消除"], ["simply", "只需"]]
    },
    {
      id: 21,
      en: "The firms most likely to volunteer for a shorter week are exactly those whose work is already measured by results rather than by hours spent at a desk.",
      tags: ["后置定语", "定语从句", "rather than"],
      chunks: [
        ["The firms most likely to volunteer for a shorter week", "主语 + 形容词短语后置定语"],
        ["are exactly those", "主句谓语与表语，exactly 强调“恰恰是”"],
        ["whose work is already measured by results rather than by hours spent at a desk", "whose 定语从句；rather than 连接对比成分"]
      ],
      ref: "最有可能自愿试行更短工作周的，恰恰是那些工作已按成果、而非按在办公桌前度过的小时数来衡量的公司。",
      points: [
        "most likely to volunteer 是后置定语，译“最有可能自愿参加的”。",
        "exactly those 把表语提前，中文也把“恰恰是”前置更自然。",
        "measured by results rather than by hours 译“以成果而非时长衡量”。"
      ],
      words: [["volunteer", "自愿参加"], ["measured", "衡量"], ["rather than", "而不是"]]
    },
    {
      id: 22,
      en: "Whether the model can survive an economic downturn, when companies cut whatever looks optional, remains an open question.",
      tags: ["主语从句", "时间状语从句", "宾语从句"],
      chunks: [
        ["Whether the model can survive an economic downturn", "whether 引导主语从句"],
        ["when companies cut whatever looks optional", "时间状语从句；whatever 引导宾语从句"],
        ["remains an open question", "主句谓语与表语"]
      ],
      ref: "这一模式能否在经济下行、公司削减一切看似可有可无的开支时存活下来，仍是一个未解的问题。",
      points: [
        "whether 主语从句较长，先译“能否……”，再说“仍是未解的问题”。",
        "whatever looks optional 译“一切看似可有可无的东西”。",
        "an open question 是“悬而未决的问题”，不要直译成“开放的问题”。"
      ],
      words: [["downturn", "经济下行"], ["optional", "可有可无的"], ["open question", "未解的问题"]]
    },
    {
      id: 23,
      en: "Systems that require users to remember long, unique and constantly changing passwords are asking human memory to do something it was never designed to do.",
      tags: ["定语从句", "宾语从句", "拟人表达"],
      chunks: [
        ["Systems that require users to remember long, unique and constantly changing passwords", "that 定语从句修饰 systems"],
        ["are asking human memory to do something", "ask sb to do sth 结构，此处含拟人意味"],
        ["it was never designed to do", "省略 that 的定语从句，修饰 something；it 指 human memory"]
      ],
      ref: "那些要求用户记住既长又唯一、还要不断更换的密码的系统，是在要求人类记忆去做它从来不适合做的事。",
      points: [
        "三个形容词并列修饰 passwords，译成中文顿号并列即可。",
        "asking human memory to do 是拟人说法，译“要求人类记忆去做”。",
        "最后 it 指 human memory，不是 systems，注意指代还原。"
      ],
      words: [["unique", "唯一的"], ["constantly", "不断地"], ["be designed to", "被设计用来"]]
    },
    {
      id: 24,
      en: "Making the safe choice the default is more effective than warning people about the risks, because most users, most of the time, will follow the path of least resistance.",
      tags: ["动名词作主语", "比较结构", "原因状语从句"],
      chunks: [
        ["Making the safe choice the default", "动名词短语作主语；the default 作宾语补足语"],
        ["is more effective than warning people about the risks", "more ... than 比较结构，前后均为动名词"],
        ["because most users, most of the time, will follow the path of least resistance", "原因状语从句；most of the time 是插入语"]
      ],
      ref: "让安全选项成为默认设置，比警告人们有风险更有效，因为大多数用户、大多数时候都会选择阻力最小的路径。",
      points: [
        "making ... the default 是“使……成为默认设置”，不要译成“制造默认”。",
        "比较结构前后都是动名词，保持“做 A 比做 B 更有效”的对称。",
        "the path of least resistance 是固定表达，译“阻力最小的路径”。"
      ],
      words: [["default", "默认设置"], ["effective", "有效的"], ["resistance", "阻力"]]
    }
  ];
  extra.forEach(function (s) { window.TRANSLATIONS.sentences.push(s); });
})();
