/* 翻译扩展：16 个长句，全部为自编仿真材料，不冒充真题。 */
(function () {
  const T = window.TRANSLATIONS;
  if (!T || !Array.isArray(T.sentences)) return;

  T.sentences.push(
    {
      id: 37,
      en: "The assumption that longer hours necessarily produce better work rests on a simple confusion between effort and effectiveness.",
      tags: ["同位语从句", "rest on", "between ... and ..."],
      chunks: [
        ["The assumption that longer hours necessarily produce better work", "that 引导同位语从句，说明 assumption 的内容"],
        ["rests on a simple confusion", "rest on 意为“建立在……之上”，confusion 此处指“混淆”"],
        ["between effort and effectiveness", "between ... and ... 说明混淆的两个对象"]
      ],
      ref: "“工作时间越长，工作质量必然越高”这一假设，建立在一种简单的混淆之上：把努力程度与实际效果混为一谈。",
      points: [
        "The assumption that ... 译为“……这一假设”，不要译成“假设那个……”。",
        "rests on 不是“休息”，而是“建立在……之上/依据”。",
        "confusion between A and B 译为“把 A 与 B 混淆”，比“A 与 B 之间的困惑”准确。"
      ],
      words: [["assumption", "假设"], ["necessarily", "必然地"], ["effectiveness", "有效性"]]
    },
    {
      id: 38,
      en: "What makes the problem difficult is not a lack of information but a lack of agreement about what the information means.",
      tags: ["主语从句", "not ... but ...", "what 从句"],
      chunks: [
        ["What makes the problem difficult", "what 引导主语从句，译为“使问题变得困难的（因素）”"],
        ["is not a lack of information", "not ... but ... 结构的前半部分"],
        ["but a lack of agreement about what the information means", "about 后接 what 从句作宾语"]
      ],
      ref: "使这个问题变得困难的，不是信息不足，而是人们对这些信息意味着什么缺乏共识。",
      points: [
        "What 从句作主语时，中文常译为“……的（因素/地方）”，不必强求主语形式。",
        "not ... but ... 连接两个表语，翻译时保持并列。",
        "agreement about 译为“关于……的共识”，不是“同意”。"
      ],
      words: [["lack", "缺乏"], ["agreement", "共识"], ["mean", "意味着"]]
    },
    {
      id: 39,
      en: "Although the report acknowledges that progress has been made, it argues that the gains are unevenly distributed and may not survive the next downturn.",
      tags: ["让步状语从句", "宾语从句", "并列谓语"],
      chunks: [
        ["Although the report acknowledges that progress has been made", "although 引导让步状语从句，that 从句作 acknowledges 的宾语"],
        ["it argues that the gains are unevenly distributed", "主句；that 从句作 argues 的宾语"],
        ["and may not survive the next downturn", "与 are unevenly distributed 并列，共用 the gains 作主语"]
      ],
      ref: "尽管报告承认已经取得进展，但它认为这些成果分配不均，且可能无法经受下一次经济衰退。",
      points: [
        "Although 译为“尽管”，主句不再加“但是”，避免中文关联词重复。",
        "the gains 指前文的 progress，译为“这些成果/进展”，不要直译“收益”。",
        "survive 在此不是“幸存”，而是“经受住/挺过”。"
      ],
      words: [["acknowledge", "承认"], ["unevenly", "不均地"], ["downturn", "衰退"]]
    },
    {
      id: 40,
      en: "It is not enough to make a technology available; the question is whether people have the time, skills and incentives to use it well.",
      tags: ["形式主语", "whether 从句", "并列"],
      chunks: [
        ["It is not enough to make a technology available", "it 作形式主语，真正主语是 to make ..."],
        ["the question is whether people have the time, skills and incentives", "whether 引导表语从句"],
        ["to use it well", "不定式作后置定语，修饰 time, skills and incentives"]
      ],
      ref: "仅仅让一项技术变得可用是不够的；问题在于，人们是否有时间、技能和动力把它用好。",
      points: [
        "It is not enough to ... 译为“仅仅……是不够的”，比“做……不足够”自然。",
        "the question is whether ... 译为“问题在于是否……”。",
        "incentives 在此译为“动力/激励”，不是“奖励”。"
      ],
      words: [["available", "可用的"], ["incentive", "激励；动力"], ["skill", "技能"]]
    },
    {
      id: 41,
      en: "The more a city depends on a single industry, the more vulnerable it becomes to changes in that industry's fortunes.",
      tags: ["the more ... the more ...", "depend on", "becomes to"],
      chunks: [
        ["The more a city depends on a single industry", "the more 引导比较状语从句"],
        ["the more vulnerable it becomes", "主句，the more 修饰 vulnerable"],
        ["to changes in that industry's fortunes", "to 与 vulnerable 搭配，表示“易受……影响”"]
      ],
      ref: "一个城市越依赖单一产业，就越容易受到该产业兴衰变化的影响。",
      points: [
        "the more ... the more ... 译为“越……越……”，两个分句的主谓顺序按中文调整。",
        "fortunes 在此指“兴衰、命运”，不是“财富”。",
        "be vulnerable to 译为“易受……影响/伤害”。"
      ],
      words: [["depend on", "依赖"], ["vulnerable", "脆弱的"], ["fortune", "兴衰；命运"]]
    },
    {
      id: 42,
      en: "A policy that looks efficient on paper may fail in practice because it ignores the people who have to carry it out.",
      tags: ["定语从句", "原因状语从句", "who 从句"],
      chunks: [
        ["A policy that looks efficient on paper", "that 引导定语从句，修饰 policy"],
        ["may fail in practice", "主句；in practice 意为“在实践中”"],
        ["because it ignores the people who have to carry it out", "because 引导原因状语从句；who 从句修饰 people"]
      ],
      ref: "一项在纸面上看起来高效的政策，可能会在实践中失败，因为它忽视了那些必须执行政策的人。",
      points: [
        "on paper 译为“在纸面上/理论上”，与 in practice 形成对比。",
        "carry out 是“执行、落实”，不是“搬运”。",
        "who 从句较长，可顺译为“那些必须执行政策的人”。"
      ],
      words: [["efficient", "高效的"], ["in practice", "在实践中"], ["carry out", "执行"]]
    },
    {
      id: 43,
      en: "Rather than asking how to make people work harder, we should ask why so much of their effort produces so little.",
      tags: ["rather than", "how 从句", "why 从句"],
      chunks: [
        ["Rather than asking how to make people work harder", "rather than 置于句首，表示“与其……”"],
        ["we should ask", "主句"],
        ["why so much of their effort produces so little", "why 引导宾语从句，so little 后省略了结果"]
      ],
      ref: "与其问如何让人更努力，我们不如问：为什么他们付出了这么多努力，却收效甚微。",
      points: [
        "Rather than 译为“与其……不如……”，前后动作保持对称。",
        "how to make people work harder 是“疑问词 + 不定式”结构。",
        "produces so little 补全为“产生的结果如此之少”，中文可意译为“收效甚微”。"
      ],
      words: [["rather than", "而不是"], ["effort", "努力"], ["produce", "产生"]]
    },
    {
      id: 44,
      en: "The evidence suggests that early intervention saves money, but it does not tell us which forms of intervention work best.",
      tags: ["宾语从句", "并列", "which 从句"],
      chunks: [
        ["The evidence suggests that early intervention saves money", "that 从句作 suggests 的宾语"],
        ["but it does not tell us", "but 连接并列分句"],
        ["which forms of intervention work best", "which 引导宾语从句，作 tell 的直接宾语"]
      ],
      ref: "证据表明，早期干预能节省开支，但它并没有告诉我们哪种干预方式最有效。",
      points: [
        "suggests 在此是“表明”，不是“建议”。",
        "tell us which ... 译为“告诉我们哪种……”，注意 which 的限定范围。",
        "work best 译为“最有效/效果最好”，不是“工作最好”。"
      ],
      words: [["evidence", "证据"], ["intervention", "干预"], ["form", "形式"]]
    },
    {
      id: 45,
      en: "Those who benefit most from a system are often the least willing to explain why it works.",
      tags: ["who 定语从句", "the least willing", "why 从句"],
      chunks: [
        ["Those who benefit most from a system", "who 引导定语从句，修饰 those"],
        ["are often the least willing", "the + 形容词最高级，表示“最不……的（人）”"],
        ["to explain why it works", "不定式作 willing 的补足语；why 从句作 explain 的宾语"]
      ],
      ref: "从某一制度中获益最多的人，往往最不愿意解释它为何有效。",
      points: [
        "Those who ... 译为“……的人”，不要直译“那些谁……”。",
        "the least willing 是“最不愿意的”，不是“最少意愿”。",
        "why it works 译为“它为何有效/为何行得通”。"
      ],
      words: [["benefit", "获益"], ["willing", "愿意的"], ["explain", "解释"]]
    },
    {
      id: 46,
      en: "Not until the costs of inaction became visible did governments begin to treat the problem as urgent.",
      tags: ["not until 倒装", "as", "urgency"],
      chunks: [
        ["Not until the costs of inaction became visible", "not until 置于句首，主句用部分倒装"],
        ["did governments begin", "助动词 did 提前，构成倒装"],
        ["to treat the problem as urgent", "treat ... as ... 意为“把……视为……”"]
      ],
      ref: "直到不作为的代价变得显而易见，各国政府才开始把这个问题视为紧迫问题。",
      points: [
        "Not until ... did ... 译为“直到……才……”，中文不需要保留倒装。",
        "inaction 是“不作为”，不是“没有行动能力”。",
        "treat ... as urgent 译为“把……视为紧迫的”，不要译成“对待……很紧急”。"
      ],
      words: [["inaction", "不作为"], ["visible", "可见的"], ["urgent", "紧迫的"]]
    },
    {
      id: 47,
      en: "Had it not been for a few persistent researchers, the risks of the practice might have gone unnoticed for decades.",
      tags: ["虚拟语气", "倒装", "go unnoticed"],
      chunks: [
        ["Had it not been for a few persistent researchers", "省略 if 的虚拟条件句，等于 If it had not been for ..."],
        ["the risks of the practice might have gone unnoticed", "主句用 might have done，表示对过去的推测"],
        ["for decades", "时间状语，修饰整个主句"]
      ],
      ref: "若不是几位坚持不懈的研究者，这种做法的风险可能几十年都无人注意。",
      points: [
        "Had it not been for ... 译为“若不是……”，是虚拟条件句的倒装形式。",
        "might have gone unnoticed 译为“可能一直未被注意到”，要体现“过去未发生”的语气。",
        "practice 在此指“做法/实践”，不是“练习”。"
      ],
      words: [["persistent", "坚持不懈的"], ["risk", "风险"], ["unnoticed", "未被注意的"]]
    },
    {
      id: 48,
      en: "The extent to which a country can adapt depends on how quickly its institutions can learn from failure.",
      tags: ["the extent to which", "depend on", "how 从句"],
      chunks: [
        ["The extent to which a country can adapt", "to which 引导定语从句，修饰 extent"],
        ["depends on", "谓语，意为“取决于”"],
        ["how quickly its institutions can learn from failure", "how 引导宾语从句，作 depend on 的宾语"]
      ],
      ref: "一个国家适应的程度，取决于其制度能多快从失败中学习。",
      points: [
        "the extent to which ... 译为“……的程度”，不要逐字译“到何种程度”。",
        "institutions 在此指“制度/机构”，根据语境选择；与 learn 搭配时偏“制度”。",
        "learn from failure 译为“从失败中学习”，不是“学习失败”。"
      ],
      words: [["extent", "程度"], ["adapt", "适应"], ["institution", "制度；机构"]]
    },
    {
      id: 49,
      en: "While competition can improve quality, it may also reward those who are best at attracting attention rather than those who are best at the work itself.",
      tags: ["while 让步", "who 从句", "rather than"],
      chunks: [
        ["While competition can improve quality", "while 引导让步状语从句，译为“虽然”"],
        ["it may also reward those who are best at attracting attention", "who 从句修饰 those"],
        ["rather than those who are best at the work itself", "rather than 连接两个 those 短语，表示对比"]
      ],
      ref: "竞争固然能提升质量，但它也可能奖励那些最善于吸引注意力的人，而不是那些最擅长工作本身的人。",
      points: [
        "While 在此不是“当……时”，而是“虽然/尽管”。",
        "reward 是“奖励、回报”，不是“重新 ward”。",
        "rather than 连接两个并列名词短语，翻译时保持对比。"
      ],
      words: [["competition", "竞争"], ["reward", "奖励"], ["attention", "注意力"]]
    },
    {
      id: 50,
      en: "It would be a mistake to treat the absence of evidence as evidence of absence.",
      tags: ["形式主语", "treat ... as ...", "of 短语"],
      chunks: [
        ["It would be a mistake", "it 作形式主语，真正主语是后面的不定式"],
        ["to treat the absence of evidence", "treat 的宾语是 the absence of evidence"],
        ["as evidence of absence", "as 引出宾语补足语，与 treat 搭配"]
      ],
      ref: "把“没有证据”当作“证据不存在”，将是一个错误。",
      points: [
        "the absence of evidence 是“缺乏证据”，不是“证据的缺席”。",
        "evidence of absence 是“不存在的证据”，与前一短语形成对照，翻译时要保留这种对照。",
        "treat A as B 译为“把 A 当作 B”。"
      ],
      words: [["absence", "缺乏"], ["evidence", "证据"], ["treat", "对待"]]
    },
    {
      id: 51,
      en: "The very fact that the question keeps returning suggests that the answer has not been found, however often it is announced.",
      tags: ["同位语从句", "suggests that", "however 让步"],
      chunks: [
        ["The very fact that the question keeps returning", "that 引导同位语从句，说明 fact 的内容；very 起强调作用"],
        ["suggests that the answer has not been found", "that 从句作 suggests 的宾语"],
        ["however often it is announced", "however 引导让步状语从句，译为“无论它被宣布多少次”"]
      ],
      ref: "这个问题一再出现，这一事实本身就说明：答案尚未找到，无论它被宣布过多少次。",
      points: [
        "The very fact that ... 译为“……这一事实本身”，very 要译出强调。",
        "keeps returning 译为“一再出现/反复出现”。",
        "however often ... 译为“无论……多少次”，不要译成“然而经常”。"
      ],
      words: [["return", "反复出现"], ["suggest", "表明"], ["announce", "宣布"]]
    },
    {
      id: 52,
      en: "If the measure is judged only by its average effect, it may hide the fact that it helps some people and harms others.",
      tags: ["条件状语从句", "被动", "that 从句"],
      chunks: [
        ["If the measure is judged only by its average effect", "if 引导条件状语从句；is judged 为被动"],
        ["it may hide the fact", "主句"],
        ["that it helps some people and harms others", "that 从句作 fact 的同位语"]
      ],
      ref: "如果只用平均效果来评判这项措施，它可能会掩盖一个事实：它帮助了一些人，也损害了另一些人。",
      points: [
        "is judged by 译为“以……来评判”，中文可用主动式。",
        "average effect 译为“平均效果”，不是“普通效果”。",
        "hide the fact that ... 译为“掩盖……这一事实”，同位语从句顺译即可。"
      ],
      words: [["measure", "措施"], ["average", "平均的"], ["harm", "损害"]]
    }
  );
})();