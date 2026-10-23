/* 长难句扩容：第 41—60 句。原创仿真例句，覆盖定从、名从、非谓语、倒装、虚拟、强调、省略、分隔结构。 */
(function () {
  window.SENTENCES = (window.SENTENCES || []).concat([
    {
      id: 41,
      level: "基础",
      en: "In the decades after the Second World War, universities in many countries expanded faster than the number of qualified teachers could support.",
      tags: ["简单句", "介词短语", "比较结构"],
      trunk: "universities ... expanded faster than the number of qualified teachers could support.",
      parts: [
        ["In the decades after the Second World War", "介词短语作时间状语，置于句首"],
        ["faster than the number of qualified teachers could support", "比较状语从句，比较扩张速度与师资供给"]
      ],
      point: "句首一长串介词短语只交代时间，主干要到 universities 才出现。先跳过状语，找主语和谓语。",
      cn: "二战后的几十年里，许多国家的大学扩张速度超过了合格教师数量所能支撑的程度。"
    },
    {
      id: 42,
      level: "基础",
      en: "The report recommends shorter meetings and clearer agendas, but it also admits that most of the wasted time comes from decisions nobody is willing to make.",
      tags: ["并列句", "宾语从句", "定语从句"],
      trunk: "The report recommends ..., but it also admits that ...",
      parts: [
        ["recommends shorter meetings and clearer agendas", "第一个分句：提出建议"],
        ["but it also admits that ...", "but 转折，引出第二个分句"],
        ["decisions nobody is willing to make", "省略关系词的定语从句，修饰 decisions"]
      ],
      point: "but 把句子切成两半；第二个分句里 that 引导宾语从句，从句内部又套一个省略 that 的定语从句。",
      cn: "报告建议缩短会议、明确议程，但也承认大部分被浪费的时间来自没人愿意做的决定。"
    },
    {
      id: 43,
      level: "基础",
      en: "A teacher who can explain the same idea in three different ways is more valuable to a struggling student than one who knows the subject best.",
      tags: ["定语从句", "比较结构"],
      trunk: "A teacher ... is more valuable ... than one ...",
      parts: [
        ["who can explain the same idea in three different ways", "定语从句修饰 A teacher"],
        ["than one who knows the subject best", "比较对象是 one（另一位老师），who 从句修饰 one"]
      ],
      point: "两个 who 从句分别修饰 teacher 和 one；more valuable than 中间夹着定语从句，容易读丢主干。",
      cn: "能把同一个概念用三种不同方式讲清楚的老师，对学困生的价值高于最懂这门学科的老师。"
    },
    {
      id: 44,
      level: "基础",
      en: "Although the app is free, the data it collects are valuable enough that several companies have offered to buy the company behind it.",
      tags: ["让步状语从句", "定语从句", "结果状语从句"],
      trunk: "the data ... are valuable enough that several companies have offered to buy the company.",
      parts: [
        ["Although the app is free", "although 引导让步状语从句"],
        ["it collects", "省略关系词的定语从句修饰 the data"],
        ["enough that ...", "enough ... that 引导结果状语从句"]
      ],
      point: "让步从句只是背景；主干是 the data are valuable enough that...。data 后紧跟的 it collects 是定语从句，不是主句谓语。",
      cn: "尽管这款应用免费，但它收集的数据足够有价值，已有几家公司提出要收购它背后的公司。"
    },
    {
      id: 45,
      level: "基础",
      en: "Learning to write clearly is not as easy as reading good writing, and it takes far longer than most students expect.",
      tags: ["比较结构", "动名词作主语", "并列句"],
      trunk: "Learning to write clearly is not as easy as reading good writing, and it takes far longer than most students expect.",
      parts: [
        ["not as easy as reading good writing", "as ... as 的否定形式"],
        ["it takes far longer than most students expect", "it 回指动名词短语；than 引导比较从句，后面省略 it takes"]
      ],
      point: "动名词短语作主语视为单数；it 回指前面的动名词短语。than most students expect 后省略了 it takes。",
      cn: "学会清楚地写作并不像读好文章那么容易，而且花费的时间远超大多数学生的预期。"
    },
    {
      id: 46,
      level: "进阶",
      en: "What makes the shortage of nurses so difficult to solve is not a lack of interest among young people but the cost of training them.",
      tags: ["主语从句", "not ... but ...", "表语"],
      trunk: "What makes the shortage ... difficult to solve is not a lack of interest ... but the cost of training them.",
      parts: [
        ["What makes the shortage of nurses so difficult to solve", "what 引导主语从句，整个从句作主语"],
        ["is not a lack of interest among young people but the cost of training them", "not ... but ... 连接两个表语"]
      ],
      point: "what 从句一直到 solve 才结束；主句谓语是 is，后面 not ... but ... 说明真正原因。",
      cn: "护士短缺之所以难以解决，并不是因为年轻人缺乏兴趣，而是因为培养他们的成本。"
    },
    {
      id: 47,
      level: "进阶",
      en: "The belief that longer hours produce better work has survived despite evidence that productivity falls sharply after about fifty hours a week.",
      tags: ["同位语从句", "despite 介词短语"],
      trunk: "The belief ... has survived despite evidence ...",
      parts: [
        ["that longer hours produce better work", "同位语从句，说明 belief 的内容"],
        ["despite evidence", "介词短语作让步状语"],
        ["that productivity falls sharply after about fifty hours a week", "同位语从句，说明 evidence 的内容"]
      ],
      point: "两个 that 从句都不是定语从句：分别解释 belief 和 evidence 的具体内容，不能译成“……的信念”。",
      cn: "“工时越长、产出越好”这一信念一直存在，尽管有证据表明每周工作约五十小时后生产率会急剧下降。"
    },
    {
      id: 48,
      level: "进阶",
      en: "Most of the volunteers had never taught before, which may explain why their first lessons were enthusiastic but poorly organized.",
      tags: ["非限制性定语从句", "宾语从句"],
      trunk: "Most of the volunteers had never taught before, which may explain why ...",
      parts: [
        ["which may explain why ...", "which 指代前面整个分句，而非某个名词"],
        ["why their first lessons were enthusiastic but poorly organized", "why 引导宾语从句"]
      ],
      point: "逗号 + which 常指代整个前句；译为“这或许解释了……”。",
      cn: "大多数志愿者此前从未教过书，这或许能解释为什么他们的第一堂课热情有余而组织不足。"
    },
    {
      id: 49,
      level: "进阶",
      en: "Having spent two years collecting data in the same village, the researchers were surprised to find how quickly their own presence had changed it.",
      tags: ["非谓语(完成式)", "宾语从句"],
      trunk: "the researchers were surprised to find ...",
      parts: [
        ["Having spent two years collecting data in the same village", "现在分词完成式作状语，动作发生在主句谓语之前"],
        ["how quickly their own presence had changed it", "how 引导宾语从句"]
      ],
      point: "Having done 表示“先……然后……”，逻辑主语必须与主句主语一致（the researchers）。",
      cn: "在同一个村庄花了两年时间收集数据之后，研究者惊讶地发现，他们自己的存在竟如此迅速地改变了这个村庄。"
    },
    {
      id: 50,
      level: "进阶",
      en: "The questions to be answered in the next round of talks are far more political than the technical ones discussed last year.",
      tags: ["不定式作定语", "比较结构", "过去分词作定语"],
      trunk: "The questions ... are far more political than the technical ones ...",
      parts: [
        ["to be answered in the next round of talks", "不定式被动式作后置定语，表将来"],
        ["than the technical ones discussed last year", "ones 替代 questions；discussed last year 为过去分词短语作定语"]
      ],
      point: "to be done 表“尚待……”，与 done 表“已经……”形成时间对比。",
      cn: "下一轮会谈要回答的问题，比去年讨论的技术性问题政治性更强。"
    },
    {
      id: 51,
      level: "进阶",
      en: "The proposal - supported by most economists but opposed by almost every affected industry - would raise the price of carbon gradually rather than suddenly.",
      tags: ["插入语", "过去分词作定语", "rather than"],
      trunk: "The proposal ... would raise the price of carbon gradually rather than suddenly.",
      parts: [
        ["- supported by most economists but opposed by almost every affected industry -", "破折号插入语，补充说明 proposal 的处境"],
        ["rather than suddenly", "rather than 连接两个副词，表“而不是”"]
      ],
      point: "破折号之间整段可先跳过；主语 The proposal 的谓语在第二个破折号后才出现。",
      cn: "这项提案——得到多数经济学家支持，却遭到几乎所有受影响行业反对——将逐步而非突然提高碳价。"
    },
    {
      id: 52,
      level: "进阶",
      en: "It is not the length of the meeting but the absence of a clear decision that makes people feel their time has been wasted.",
      tags: ["强调句", "not ... but ...", "宾语从句"],
      trunk: "It is not ... but ... that makes people feel ...",
      parts: [
        ["It is not the length of the meeting but the absence of a clear decision", "强调句结构，被强调的是 not ... but ... 两个名词短语"],
        ["that makes people feel ...", "强调句的 that，不是定语从句"],
        ["their time has been wasted", "省略 that 的宾语从句"]
      ],
      point: "去掉 It is ... that ... 后句子仍成立（Not the length ... but the absence ... makes people feel ...），说明是强调句。",
      cn: "让人们觉得时间被浪费的，不是会议的长度，而是没有作出明确决定。"
    },
    {
      id: 53,
      level: "进阶",
      en: "Not until the costs of pollution were counted as part of the price did companies begin to treat efficiency as a competitive advantage.",
      tags: ["倒装", "时间状语从句", "not until"],
      trunk: "companies began to treat efficiency as a competitive advantage.",
      parts: [
        ["Not until the costs of pollution were counted as part of the price", "not until 引导时间状语从句，置于句首引起部分倒装"],
        ["did companies begin to treat ...", "助动词 did 提前，构成倒装"]
      ],
      point: "句首否定词 Not until 触发倒装：did + 主语 + 动词原形。翻译时还原为“直到……才……”。",
      cn: "直到污染成本被计入价格，企业才开始把效率视为竞争优势。"
    },
    {
      id: 54,
      level: "进阶",
      en: "If every household were required to sort its waste, the amount sent to landfills would fall, but the cost would be paid in time and inconvenience.",
      tags: ["虚拟语气", "被动语态", "并列句"],
      trunk: "the amount ... would fall, but the cost would be paid in time and inconvenience.",
      parts: [
        ["If every household were required to sort its waste", "与现在事实相反的虚拟条件句，were 用于所有人称"],
        ["the amount sent to landfills would fall", "主句用 would + 动词原形"],
        ["but the cost would be paid in time and inconvenience", "并列分句，指出代价的形式"]
      ],
      point: "虚拟条件句里 were 不随人称变化，主句用 would。后半句 but 转折，说明“好处与代价并存”。",
      cn: "如果要求每个家庭都对垃圾进行分类，填埋量会下降，但代价将以时间和不便的形式付出。"
    },
    {
      id: 55,
      level: "进阶",
      en: "The decision was welcomed by those who had campaigned for years, and criticized by those who feared the loss of local jobs.",
      tags: ["被动语态", "定语从句", "并列句"],
      trunk: "The decision was welcomed by ... and criticized by ...",
      parts: [
        ["was welcomed by those who had campaigned for years", "被动语态 + by 引出施动者；who 从句修饰 those"],
        ["criticized by those who feared the loss of local jobs", "并列谓语，省略了 was；who 从句修饰第二个 those"]
      ],
      point: "两个 by 短语是判断态度的关键；过去完成式 had campaigned 表示“在此之前已奔走多年”。",
      cn: "这项决定受到多年奔走呼吁者的欢迎，也受到担心本地就业流失者的批评。"
    },
    {
      id: 56,
      level: "难点",
      en: "What the report fails to explain is why a policy that has worked in cities where housing is scarce should be expected to produce the same results in towns that are losing population.",
      tags: ["主语从句", "表语从句", "定语从句(多层)", "被动语态"],
      trunk: "What the report fails to explain is why a policy ... should be expected to produce ...",
      parts: [
        ["What the report fails to explain", "what 引导主语从句"],
        ["why a policy ... should be expected to produce the same results", "why 引导表语从句"],
        ["that has worked in cities where housing is scarce", "定语从句修饰 policy；其中 where 从句修饰 cities"],
        ["that are losing population", "定语从句修饰 towns"]
      ],
      point: "先摘主干（What ... is why ...），再把定语从句按修饰对象挂回去；policy 与 towns 各带一个从句。",
      cn: "报告没有解释清楚的是：一项在住房紧张的城市行之有效的政策，为什么会被指望在人口流失的城镇产生同样的效果。"
    },
    {
      id: 57,
      level: "难点",
      en: "The second experiment produced stronger effects than the first, though with a sample half the size and a follow-up period far shorter than expected.",
      tags: ["比较结构", "省略"],
      trunk: "The second experiment produced stronger effects than the first ...",
      parts: [
        ["than the first", "比较从句省略了 did / produced"],
        ["though with a sample half the size", "though + 介词短语，省略 it was"],
        ["far shorter than expected", "than expected 省略了 it was expected to be"]
      ],
      point: "三处省略不补全也能读：than the first (did)、though (it was) with、than (it was) expected。翻译时补出“样本量只有一半、随访期短得多”。",
      cn: "第二个实验产生的效应比第一个更强，尽管样本量只有一半，随访期也比预期短得多。"
    },
    {
      id: 58,
      level: "难点",
      en: "The gradual replacement of experienced staff by younger, cheaper workers has made it harder for customers to get the kind of advice that only years of practice can provide.",
      tags: ["名词化主语", "形式宾语", "定语从句"],
      trunk: "The gradual replacement ... has made it harder ...",
      parts: [
        ["The gradual replacement of experienced staff by younger, cheaper workers", "名词化主语，中心词是 replacement"],
        ["has made it harder for customers to get ...", "it 为形式宾语，真正宾语是 to get ..."],
        ["that only years of practice can provide", "定语从句修饰 advice"]
      ],
      point: "主语长达十个词，谓语 has made 在 replacement 之后；of ... by ... 都是修饰 replacement。",
      cn: "用更年轻、更廉价的员工逐步取代有经验的员工，使顾客更难得到那种只有多年实践才能提供的建议。"
    },
    {
      id: 59,
      level: "难点",
      en: "The more precisely a question is defined, the more likely it is that the answer will be useful, and the less time researchers will waste on problems that do not matter.",
      tags: ["比较结构", "形式主语", "定语从句", "并列句"],
      trunk: "The more precisely a question is defined, the more likely it is that ..., and the less time researchers will waste ...",
      parts: [
        ["The more precisely a question is defined", "the more ... 引导程度/条件从句"],
        ["the more likely it is that the answer will be useful", "the more ... 主句；it 为形式主语，that 从句为真正主语"],
        ["the less time researchers will waste on problems that do not matter", "并列的第二个主句；that 从句修饰 problems"]
      ],
      point: "the more ..., the more ... 结构可以并列第三个 the less；先找两个 the 后面的比较成分。",
      cn: "问题界定得越精确，答案就越可能有用，研究者浪费在无关问题上的时间也越少。"
    },
    {
      id: 60,
      level: "难点",
      en: "The assumption, common among policymakers in the 1990s and still repeated in many reports today, that growth would solve every social problem has turned out to be wrong.",
      tags: ["同位语从句", "插入语", "分隔结构"],
      trunk: "The assumption ... has turned out to be wrong.",
      parts: [
        ["common among policymakers in the 1990s and still repeated in many reports today", "形容词短语作插入语，补充说明 assumption"],
        ["that growth would solve every social problem", "同位语从句，说明 assumption 的内容（被插入语隔开）"],
        ["has turned out to be wrong", "主句谓语，位于句末"]
      ],
      point: "主语 assumption 与谓语 has turned out 之间隔了一个插入语和一个同位语从句；先跨过插入语找谓语。",
      cn: "那种认为增长会解决一切社会问题的假设——在 20 世纪 90 年代的政策制定者中很常见，如今仍在许多报告中被重复——已被证明是错误的。"
    }
  ]);
})();