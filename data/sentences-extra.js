/* 长难句精析扩充 · 21—30
   均为按真题句式原创的仿真句，不冒充真题原句 */

(function () {
  const extra = [
    {
      id: 21,
      level: "难点",
      en: "What makes the proposal politically attractive—its promise of immediate savings—is precisely what makes it fiscally risky, since the costs it postpones will return with interest.",
      tags: ["主语从句", "插入语", "表语从句", "原因状语从句"],
      trunk: "What makes the proposal attractive ... is ... what makes it risky.",
      parts: [
        ["What makes the proposal politically attractive", "what 引导主语从句，作整句主语"],
        ["its promise of immediate savings", "破折号插入语，解释前文 attractive 的具体表现"],
        ["is precisely what makes it fiscally risky", "系表结构；what 引导表语从句"],
        ["since the costs it postpones will return with interest", "since 引导原因状语从句；it postpones 是省略关系词的定语从句，修饰 costs"]
      ],
      point: "主语从句与表语从句形成对称：什么使它有吸引力，也正是什么使它有风险。破折号插入语可先跳过，翻译时再补回。",
      cn: "这项提案在政治上吸引人之处——即承诺立即节省开支——恰恰也是它在财政上危险之处，因为它推迟的成本会带着利息回来。"
    },
    {
      id: 22,
      level: "难点",
      en: "Had the researchers relied only on the data that were easiest to collect, they would have concluded that the policy had failed, when in fact its effects were merely slow to appear.",
      tags: ["虚拟倒装", "定语从句", "宾语从句", "时间状语从句"],
      trunk: "They would have concluded that the policy had failed.",
      parts: [
        ["Had the researchers relied only on the data", "省略 if 的虚拟条件倒装，等于 If the researchers had relied only on the data"],
        ["that were easiest to collect", "定语从句修饰 data"],
        ["they would have concluded that the policy had failed", "主句 + 宾语从句，表示与过去事实相反"],
        ["when in fact its effects were merely slow to appear", "when 引导对比，in fact 表示转折"]
      ],
      point: "看到 Had + 主语 + 过去分词开头，先补出 if；主句 would have done 说明是与过去事实相反的虚拟。when in fact 常译“而事实上”。",
      cn: "如果研究人员只依赖最容易收集的数据，他们本会断定该政策已经失败，而事实上其效果只是显现得较慢。"
    },
    {
      id: 23,
      level: "进阶",
      en: "The assumption that readers will pay for quality journalism, however often it is repeated, has not been supported by the behaviour of audiences who have grown accustomed to free content.",
      tags: ["同位语从句", "插入语", "定语从句", "被动"],
      trunk: "The assumption ... has not been supported by the behaviour of audiences.",
      parts: [
        ["that readers will pay for quality journalism", "同位语从句，说明 assumption 的内容"],
        ["however often it is repeated", "让步状语插入语；it 指 the assumption"],
        ["has not been supported by the behaviour of audiences", "主句，被动语态"],
        ["who have grown accustomed to free content", "定语从句修饰 audiences"]
      ],
      point: "主语后插入让步状语，谓语被推到最后。先跳过 however 插入语抓主干；however + 副词表示“无论多么……”。",
      cn: "读者会为高质量新闻付费——这一假设无论被重复多少次，都未得到那些已习惯免费内容的受众行为的支持。"
    },
    {
      id: 24,
      level: "进阶",
      en: "It is not the number of hours spent in the office that determines productivity, but the extent to which employees can control how and when they work.",
      tags: ["强调句", "not ... but ...", "定语从句", "宾语从句"],
      trunk: "It is not the number of hours ... but the extent ... that determines productivity.",
      parts: [
        ["It is not the number of hours spent in the office that determines productivity", "强调句，强调 not the number of hours；spent in the office 为过去分词短语修饰 hours"],
        ["but the extent to which employees can control", "not ... but ... 的并列强调成分；to which 定语从句修饰 extent"],
        ["how and when they work", "宾语从句，作 control 的宾语"]
      ],
      point: "强调句中的 not ... but ... 常被 that 隔开，翻译时还原为“不是……而是……”。control 的宾语是 how and when 从句。",
      cn: "决定生产率的不是待在办公室里的时长，而是员工能在多大程度上控制自己如何工作、何时工作。"
    },
    {
      id: 25,
      level: "进阶",
      en: "While the technology may eventually replace some tasks, the more immediate challenge is not mass unemployment but the uneven distribution of the gains it creates.",
      tags: ["让步状语从句", "表语从句", "定语从句"],
      trunk: "The more immediate challenge is not mass unemployment but the uneven distribution of the gains.",
      parts: [
        ["While the technology may eventually replace some tasks", "while 引导让步状语从句，译为“尽管”"],
        ["the more immediate challenge is not mass unemployment", "主句，系表结构"],
        ["but the uneven distribution of the gains it creates", "not ... but ... 连接两个表语；it creates 是省略关系词的定语从句，修饰 gains"]
      ],
      point: "句首 while 常表让步，不是“当……时”。it creates 的 it 指 technology；翻译时把“它创造的收益”放在“分配”前更顺。",
      cn: "尽管这项技术最终可能取代一些任务，但更紧迫的挑战不是大规模失业，而是它所带来的收益分配不均。"
    },
    {
      id: 26,
      level: "进阶",
      en: "A policy that is effective in one city may fail in another, not because its design is flawed, but because the conditions that made it work are absent.",
      tags: ["定语从句", "not ... but ...", "原因状语从句"],
      trunk: "A policy ... may fail in another.",
      parts: [
        ["that is effective in one city", "定语从句修饰 policy"],
        ["not because its design is flawed", "not because 引导原因状语，否定这一原因"],
        ["but because the conditions that made it work are absent", "but because 引导并列原因；that made it work 是定语从句修饰 conditions"]
      ],
      point: "not because ... but because ... 译为“不是因为……而是因为……”。注意 not 只否定第一个 because，不要把“条件缺失”也否定掉。",
      cn: "一项在一个城市有效的政策，在另一个城市可能失败；这不是因为其设计有缺陷，而是因为使它奏效的条件并不存在。"
    },
    {
      id: 27,
      level: "难点",
      en: "Only when the costs of inaction are written into the budget, argue the economists, will governments treat prevention as seriously as they treat emergencies.",
      tags: ["倒装", "插入语", "时间状语从句", "比较结构"],
      trunk: "Governments will treat prevention as seriously as they treat emergencies.",
      parts: [
        ["Only when the costs of inaction are written into the budget", "only + 时间状语从句置于句首，主句需部分倒装"],
        ["argue the economists", "插入语，本身也是倒装，等于 the economists argue"],
        ["will governments treat prevention as seriously as they treat emergencies", "倒装主句；as ... as 比较结构"]
      ],
      point: "only + 状语从句放句首，主句把助动词 will 提到主语前。argue the economists 是插入语，恢复为 the economists argue。",
      cn: "经济学家认为，只有当不作为的成本被写入预算，政府才会像对待紧急事件那样认真对待预防。"
    },
    {
      id: 28,
      level: "难点",
      en: "The question is not whether machines can produce plausible sentences, but whether readers can tell, and care, when they do not.",
      tags: ["表语从句", "并列", "时间状语从句"],
      trunk: "The question is not whether ... but whether ...",
      parts: [
        ["The question is not whether machines can produce plausible sentences", "主句 + whether 表语从句，否定部分"],
        ["but whether readers can tell, and care", "not ... but ... 并列表语从句；tell 后省略宾语"],
        ["when they do not", "时间状语从句；they 指 machines，do not 后省略 produce plausible sentences"]
      ],
      point: "两个 whether 从句都作表语。tell 在此是“分辨”，不是“告诉”。when they do not 省略了 produce plausible sentences，翻译时要补出“机器写得不合理时”。",
      cn: "问题不在于机器能否写出看似合理的句子，而在于当机器写得不合理时，读者能否分辨，并且是否在意。"
    },
    {
      id: 29,
      level: "难点",
      en: "Given how much of modern life depends on undersea cables, the vulnerability of these systems receives far less attention than the occasional outage that briefly makes headlines.",
      tags: ["过去分词状语", "宾语从句", "比较结构", "定语从句"],
      trunk: "The vulnerability ... receives far less attention than the occasional outage.",
      parts: [
        ["Given how much of modern life depends on undersea cables", "Given 引导原因状语；how much 从句作 depends on 的宾语"],
        ["the vulnerability of these systems receives far less attention", "主句"],
        ["than the occasional outage that briefly makes headlines", "比较结构；that 定语从句修饰 outage"]
      ],
      point: "Given 在此是介词“鉴于”。far less ... than 比较的是 attention；occasional outage 指“偶尔发生的故障”，不是“偶尔停电”。",
      cn: "鉴于现代生活如此依赖海底电缆，这些系统的脆弱性所受到的关注，远少于偶尔登上头条的故障。"
    },
    {
      id: 30,
      level: "进阶",
      en: "What the museum chooses to display, and what it leaves in storage, tells visitors as much about the institution's values as any label on the wall.",
      tags: ["主语从句", "并列", "比较结构"],
      trunk: "What the museum chooses to display, and what it leaves in storage, tells visitors ...",
      parts: [
        ["What the museum chooses to display", "what 引导主语从句"],
        ["and what it leaves in storage", "并列主语从句；it 指 the museum"],
        ["tells visitors as much about the institution's values as any label on the wall", "主句；as much ... as 比较结构"]
      ],
      point: "两个 what 从句并列作主语，谓语仍用单数 tells。as much ... as 译为“和……一样多/同样”，比较的是“揭示价值观”的程度。",
      cn: "博物馆选择展出什么、又把什么留在库房，向参观者揭示的机构价值观，与墙上的任何标签一样多。"
    }
  ];
  extra.forEach(function (s) { window.SENTENCES.push(s); });
})();
