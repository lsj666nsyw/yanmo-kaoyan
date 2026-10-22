/* 长难句精析 · 20 句
   均为按真题句式原创的仿真句，不冒充真题原句 */
window.SENTENCES = [
  {
    id: 1, level: "进阶",
    en: "The assumption that economic growth will automatically translate into better jobs, which has guided policy for decades, is now being questioned by economists who study the labor market.",
    tags: ["同位语从句", "定语从句", "插入语"],
    trunk: "The assumption ... is now being questioned by economists.",
    parts: [
      ["that economic growth will automatically translate into better jobs", "that 引导同位语从句，解释 assumption 的具体内容"],
      ["which has guided policy for decades", "非限制性定语从句，仍修饰 assumption，而非 jobs"],
      ["who study the labor market", "定语从句修饰 economists"]
    ],
    point: "主语 The assumption 后连续插入两个从句，谓语 is being questioned 被推到最后。读这类句子先抓“谁—被怎样—被谁”。",
    cn: "经济增长会自动转化为更好的工作——这一假设指导了数十年的政策，如今正受到研究劳动力市场的经济学家的质疑。"
  },
  {
    id: 2, level: "难点",
    en: "Not until researchers began comparing identical twins raised apart did they realize how much of personality is shaped by environment rather than inheritance.",
    tags: ["倒装", "时间状语", "宾语从句"],
    trunk: "They did not realize ... until researchers began comparing ...",
    parts: [
      ["Not until researchers began comparing identical twins raised apart", "否定时间状语置于句首，主句用部分倒装 did they realize"],
      ["raised apart", "过去分词短语后置修饰 twins"],
      ["how much of personality is shaped by environment rather than inheritance", "realize 的宾语从句；rather than 表选择"]
    ],
    point: "Not until 位于句首时，主句必须倒装；until 引导的是时间状语，不是宾语。",
    cn: "直到研究者开始比较分开抚养的同卵双胞胎，他们才意识到人格有多少是由环境而非遗传塑造的。"
  },
  {
    id: 3, level: "基础",
    en: "Viewed in isolation, the figures suggest a steady decline; placed alongside those from other industries, however, they reveal a pattern that is far from unusual.",
    tags: ["非谓语", "分号并列", "定语从句"],
    trunk: "The figures suggest a steady decline; they reveal a pattern.",
    parts: [
      ["Viewed in isolation", "过去分词作状语，逻辑主语是 the figures"],
      ["placed alongside those from other industries", "过去分词作状语；those 指代 figures"],
      ["that is far from unusual", "定语从句修饰 pattern；far from 意为“远非”"]
    ],
    point: "两个过去分词短语分别修饰两个分句；however 是插入副词，不连接句子，分号才是连接手段。",
    cn: "单独看，这些数字显示稳步下降；但与其他行业的数据并列，它们揭示的却是一种远非罕见的模式。"
  },
  {
    id: 4, level: "进阶",
    en: "What makes the debate so difficult is not that the evidence is scarce, but that reasonable people interpret the same evidence in radically different ways.",
    tags: ["主语从句", "表语从句", "not ... but ..."],
    trunk: "What makes the debate so difficult is not that ..., but that ...",
    parts: [
      ["What makes the debate so difficult", "what 引导主语从句，整个从句作主语"],
      ["not that the evidence is scarce", "第一个 that 引导表语从句"],
      ["but that reasonable people interpret ...", "第二个 that 从句与前者并列，构成 not ... but ..."]
    ],
    point: "what 引导主语从句时，谓语用单数；not that ... but that ... 是常见的表语并列结构。",
    cn: "这场争论之所以难，不是因为证据稀缺，而是因为通情达理的人会对同样的证据作出截然不同的解读。"
  },
  {
    id: 5, level: "难点",
    en: "Were it not for the willingness of local volunteers, the survey, which took three years to complete, would never have reached the families it was designed to study.",
    tags: ["虚拟语气", "倒装", "定语从句"],
    trunk: "The survey would never have reached the families.",
    parts: [
      ["Were it not for the willingness of local volunteers", "省略 if 的虚拟条件倒装，等于 If it were not for ..."],
      ["which took three years to complete", "非限制性定语从句，补充说明 survey"],
      ["it was designed to study", "省略关系词的定语从句，修饰 families"]
    ],
    point: "与过去事实相反的虚拟：条件句用 were，主句用 would have done。Were it not for 是固定倒装句式。",
    cn: "若不是当地志愿者愿意帮忙，这项耗时三年才完成的调查，永远无法接触到它原本要研究的那些家庭。"
  },
  {
    id: 6, level: "进阶",
    en: "Faced with evidence that their products were being used in ways they had never anticipated, the engineers began to question the assumption on which the entire design had been based.",
    tags: ["非谓语", "同位语从句", "介词 + which"],
    trunk: "The engineers began to question the assumption.",
    parts: [
      ["Faced with evidence", "过去分词短语作状语，逻辑主语是 the engineers"],
      ["that their products were being used in ways they had never anticipated", "evidence 的同位语从句；ways 后省略 in which/that"],
      ["on which the entire design had been based", "介词 + which 引导定语从句，还原为 the design had been based on the assumption"]
    ],
    point: "介词 + which 的介词由从句中的动词搭配决定；be based on 决定用 on which。",
    cn: "面对证据表明其产品正以他们从未预料的方式被使用，工程师们开始质疑整个设计所依据的假设。"
  },
  {
    id: 7, level: "难点",
    en: "So deeply embedded is the belief that talent is innate that many schools ignore the role of sustained practice.",
    tags: ["倒装", "结果状语从句", "同位语从句"],
    trunk: "The belief is so deeply embedded that many schools ignore the role of sustained practice.",
    parts: [
      ["So deeply embedded is the belief", "表语前置引起的完全倒装"],
      ["that talent is innate", "同位语从句，说明 belief 的内容"],
      ["that many schools ignore ...", "与 so 呼应的结果状语从句"]
    ],
    point: "句中出现两个 that，功能完全不同：第一个引导同位语从句，第二个与 so 构成 so ... that ...。",
    cn: "天赋与生俱来这一信念如此根深蒂固，以至于许多学校忽视了持续练习的作用。"
  },
  {
    id: 8, level: "进阶",
    en: "Although the report stops short of recommending a ban, it argues, in language that is unusually direct for a government document, that the industry has failed to regulate itself.",
    tags: ["让步状语从句", "插入语", "宾语从句"],
    trunk: "It argues that the industry has failed to regulate itself.",
    parts: [
      ["Although the report stops short of recommending a ban", "让步状语从句；stop short of 意为“差一点没做”"],
      ["in language that is unusually direct for a government document", "方式状语插入，that 从句修饰 language"],
      ["that the industry has failed to regulate itself", "argues 的宾语从句，被插入语隔开"]
    ],
    point: "argue 的宾语从句被方式状语隔开，容易误把 in language 当成 argue 的宾语。",
    cn: "尽管报告没有直接建议禁令，但它以政府文件中少见的直白语言指出，该行业未能自我监管。"
  },
  {
    id: 9, level: "基础",
    en: "The idea of a universal basic income, once dismissed as a fringe proposal, has gained traction among policymakers who are struggling with the effects of automation.",
    tags: ["插入语", "定语从句"],
    trunk: "The idea of a universal basic income has gained traction.",
    parts: [
      ["once dismissed as a fringe proposal", "过去分词插入语，修饰 The idea"],
      ["who are struggling with the effects of automation", "定语从句修饰 policymakers"],
      ["gain traction", "固定搭配：获得支持、逐渐流行"]
    ],
    point: "主语和谓语之间插入过去分词短语，是真题阅读中最常见的“主谓分离”干扰。",
    cn: "全民基本收入这一想法曾被斥为边缘主张，如今却在苦于自动化影响的政策制定者中获得了支持。"
  },
  {
    id: 10, level: "难点",
    en: "Far more important than the speed at which new technologies are adopted is the question of who controls them and to what ends.",
    tags: ["倒装", "比较结构", "宾语从句"],
    trunk: "The question ... is far more important than the speed ...",
    parts: [
      ["Far more important than the speed", "表语前置，构成完全倒装"],
      ["at which new technologies are adopted", "介词 + which 定语从句修饰 speed"],
      ["who controls them and to what ends", "of 后的并列宾语从句；to what ends 意为“为了什么目的”"]
    ],
    point: "真正的主语是 the question，谓语 is 被提前；还原后为 The question is far more important than the speed ...。",
    cn: "比新技术被采用的速度重要得多的问题，是谁控制它们，以及为了什么目的。"
  },
  {
    id: 11, level: "基础",
    en: "Some argue that remote work liberates employees from long commutes; others, that it quietly erases the boundary between work and life.",
    tags: ["分号并列", "省略", "宾语从句"],
    trunk: "Some argue that ...; others argue that ...",
    parts: [
      ["Some argue that remote work liberates employees from long commutes", "第一个分句"],
      ["others, that it quietly erases ...", "others 后省略 argue，that 从句作宾语"],
      ["erases the boundary between work and life", "抹去工作与生活的界限"]
    ],
    point: "分号连接两个独立分句；第二个分句用逗号 + that 避免重复 argue，是书面语中的常见省略。",
    cn: "有人认为远程办公让员工摆脱长途通勤；也有人认为，它悄悄抹去了工作与生活的界限。"
  },
  {
    id: 12, level: "进阶",
    en: "It is not simply that cities create more opportunities; it is that they allow people to find one another.",
    tags: ["主语从句", "强调", "对比"],
    trunk: "It is not simply that ...; it is that ...",
    parts: [
      ["It is not simply that cities create more opportunities", "It 为形式主语，that 引导主语从句"],
      ["it is that they allow people to find one another", "第二个 that 从句与前者形成对比，不能省略"],
      ["find one another", "彼此找到；指城市的人际匹配效应"]
    ],
    point: "两个 it is that 并非强调句，而是“形式主语 + 主语从句”；判断方法是去掉 it is 后句子不完整。",
    cn: "并不只是城市创造了更多机会；而是城市让人们能够彼此找到。"
  },
  {
    id: 13, level: "难点",
    en: "The data having been collected over two decades, the researchers were able to distinguish long-term trends from short-term fluctuations.",
    tags: ["独立主格", "非谓语"],
    trunk: "The researchers were able to distinguish long-term trends from short-term fluctuations.",
    parts: [
      ["The data having been collected over two decades", "独立主格结构，逻辑主语是 The data，与主句主语不同"],
      ["having been collected", "完成被动分词，表示动作先于主句发生"],
      ["distinguish A from B", "把 A 与 B 区分开"]
    ],
    point: "独立主格没有连词，也不是完整句子；它自带逻辑主语，常用“名词 + 分词”结构。",
    cn: "由于数据是在二十多年间收集的，研究者得以把长期趋势与短期波动区分开来。"
  },
  {
    id: 14, level: "进阶",
    en: "The claim, often repeated in policy circles, that automation will destroy more jobs than it creates, rests on evidence that is far from conclusive.",
    tags: ["同位语从句", "插入语", "定语从句"],
    trunk: "The claim ... rests on evidence.",
    parts: [
      ["often repeated in policy circles", "过去分词插入语，修饰 The claim"],
      ["that automation will destroy more jobs than it creates", "同位语从句，说明 claim 的内容"],
      ["that is far from conclusive", "定语从句修饰 evidence"]
    ],
    point: "claim 后的同位语从句被插入语隔开；rest on 意为“依赖于”，不是“休息”。",
    cn: "政策圈常重复的一个说法是，自动化摧毁的工作会多于它创造的；这一说法所依据的证据远非确凿。"
  },
  {
    id: 15, level: "基础",
    en: "However convincing the argument may sound in theory, it collapses once the costs of implementation are taken into account.",
    tags: ["让步状语从句", "倒装", "被动"],
    trunk: "It collapses once the costs are taken into account.",
    parts: [
      ["However convincing the argument may sound in theory", "however + 形容词置于句首的让步状语从句，相当于 no matter how convincing"],
      ["once the costs of implementation are taken into account", "once 引导条件状语从句"],
      ["are taken into account", "被动结构：被考虑在内"]
    ],
    point: "however 引导让步从句时，形容词必须紧跟 however；不要与“然而”的副词用法混淆。",
    cn: "无论这个论证在理论上多么有说服力，一旦把实施成本考虑进去，它就站不住脚了。"
  },
  {
    id: 16, level: "难点",
    en: "Whether the reform succeeds depends less on how much money is spent than on whether those who design it understand the people it is meant to help.",
    tags: ["主语从句", "比较结构", "定语从句"],
    trunk: "Whether the reform succeeds depends less on A than on B.",
    parts: [
      ["Whether the reform succeeds", "whether 引导主语从句"],
      ["how much money is spent", "介词 on 的宾语从句"],
      ["whether those who design it understand the people it is meant to help", "第二个介词宾语从句；who design it 修饰 those，it is meant to help 修饰 people"]
    ],
    point: "depend less on A than on B 是比较结构；两个 whether 一个作主语，一个作介词宾语，功能不同。",
    cn: "改革能否成功，与其说取决于花了多少钱，不如说取决于设计者是否理解它本要帮助的人。"
  },
  {
    id: 17, level: "基础",
    en: "Encouraged by early results, the team expanded the trial to include patients whose conditions had previously been considered untreatable.",
    tags: ["非谓语", "定语从句", "被动"],
    trunk: "The team expanded the trial.",
    parts: [
      ["Encouraged by early results", "过去分词作状语，逻辑主语是 the team"],
      ["to include patients", "不定式作目的状语"],
      ["whose conditions had previously been considered untreatable", "whose 引导定语从句修饰 patients"]
    ],
    point: "过去分词作状语时，逻辑主语必须与主句主语一致；否则会形成悬垂修饰。",
    cn: "受早期结果鼓舞，团队扩大了试验范围，纳入了一些此前被认为无法治疗的病人。"
  },
  {
    id: 18, level: "进阶",
    en: "It was not the technology itself but the way it was presented to users that determined whether they trusted it.",
    tags: ["强调句", "定语从句", "宾语从句"],
    trunk: "It was ... that determined ...",
    parts: [
      ["not the technology itself but the way it was presented to users", "被强调部分，not A but B 结构"],
      ["the way it was presented to users", "the way 后省略 in which/that 的定语从句"],
      ["whether they trusted it", "determined 的宾语从句"]
    ],
    point: "强调句 It was ... that ... 去掉后句子仍完整；the way 后的定语从句常省略关系词。",
    cn: "决定用户是否信任它的，不是技术本身，而是技术呈现给用户的方式。"
  },
  {
    id: 19, level: "进阶",
    en: "Nothing in the history of medicine suggests that progress is inevitable; on the contrary, it is often the product of stubborn resistance to accepted wisdom.",
    tags: ["宾语从句", "分号并列", "否定"],
    trunk: "Nothing ... suggests that ...; it is the product of ...",
    parts: [
      ["Nothing in the history of medicine", "nothing 作主语，谓语用单数 suggests"],
      ["that progress is inevitable", "suggests 的宾语从句"],
      ["the product of stubborn resistance to accepted wisdom", "表语；accepted wisdom 意为“公认的看法”"]
    ],
    point: "nothing 作主语时为单数；on the contrary 表示转折，前后观点相反。",
    cn: "医学史没有任何证据表明进步是必然的；恰恰相反，进步往往是顽强抵抗公认智慧的结果。"
  },
  {
    id: 20, level: "难点",
    en: "A society that rewards speed over reflection, that measures success by output rather than understanding, and that treats every pause as a failure, will eventually lose the capacity for the very work it values.",
    tags: ["定语从句", "并列", "省略"],
    trunk: "A society ... will eventually lose the capacity for the very work it values.",
    parts: [
      ["that rewards speed over reflection", "第一个定语从句修饰 society"],
      ["that measures success by output rather than understanding", "第二个定语从句，与前一个并列"],
      ["that treats every pause as a failure", "第三个定语从句，三个 that 并列"],
      ["it values", "省略关系词的定语从句修饰 work；the very 意为“正是”"]
    ],
    point: "三个 that 从句并列修饰同一先行词，谓语 will lose 被推到很远；遇到长主语先找最后一个逗号后的谓语。",
    cn: "一个奖励速度甚于思考、以产出而非理解衡量成功、把每一次停顿都视为失败的社会，最终会失去它自己所看重的那种工作的能力。"
  }
];
