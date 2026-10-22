/* 翻译练习扩充 · 25—36
   英语一单句翻译与英语二段落翻译共用方法，句子为原创仿真材料 */

(function () {
  const extra = [
    {
      id: 25,
      en: "Were it not for the willingness of local volunteers to record what officials did not, much of the history of the district would have disappeared without ever being written down.",
      tags: ["虚拟语气", "倒装", "宾语从句"],
      chunks: [
        ["Were it not for the willingness of local volunteers", "省略 if 的虚拟倒装，相当于 If it were not for"],
        ["to record what officials did not", "不定式作定语；what 引导宾语从句，did not 后省略 record"],
        ["much of the history of the district would have disappeared", "主句虚拟"],
        ["without ever being written down", "介词短语作状语，被动含义"]
      ],
      ref: "要不是当地志愿者愿意记录官方没有记录的事情，这个街区的许多历史早就在从未被写下之前消失了。",
      points: [
        "Were it not for 是书面语中的倒装虚拟，译成“要不是”，不要按陈述句语序理解。",
        "what officials did not 后省略了 record，翻译时要补出“没有记录的事情”。",
        "without ever being written down 是“从未被写下”，不是“没有写下来”的主动动作。"
      ],
      words: [["volunteer", "志愿者"], ["district", "街区；地区"], ["disappear", "消失"]]
    },
    {
      id: 26,
      en: "The report does not argue that remote work is less productive, but that its benefits are distributed far more unevenly than its advocates tend to admit.",
      tags: ["宾语从句", "比较结构", "否定"],
      chunks: [
        ["The report does not argue that remote work is less productive", "not ... but ... 结构的否定部分"],
        ["but that its benefits are distributed far more unevenly", "but that 引导并列宾语从句"],
        ["than its advocates tend to admit", "比较状语从句"]
      ],
      ref: "报告并非认为远程办公效率更低，而是认为其收益的分配远比支持者通常承认的更不均衡。",
      points: [
        "not ... but that ... 译“不是……而是……”，两个 that 从句都是 argue 的宾语。",
        "less productive 是“效率更低”，不是“生产力更少”。",
        "far more unevenly than 中的 far 表示程度，不能漏译。"
      ],
      words: [["distribute", "分配"], ["unevenly", "不均衡地"], ["advocate", "支持者"]]
    },
    {
      id: 27,
      en: "Although the technology has been available for more than a decade—and is now cheap enough to be installed in ordinary homes—the number of households that actually use it remains surprisingly small.",
      tags: ["让步状语从句", "插入语", "定语从句"],
      chunks: [
        ["Although the technology has been available for more than a decade", "让步状语从句"],
        ["and is now cheap enough to be installed in ordinary homes", "破折号插入的并列谓语"],
        ["the number of households ... remains surprisingly small", "主句"],
        ["that actually use it", "定语从句修饰 households"]
      ],
      ref: "尽管这项技术问世已十多年——如今便宜到可以装进普通家庭——真正使用它的家庭数量仍然少得惊人。",
      points: [
        "破折号中的插入成分补充“便宜”，翻译时可保留破折号或拆成短句。",
        "available for more than a decade 译“问世已十多年”，比“可用十多年”自然。",
        "actually 在这里是“真正、实际”，不是“实际上”这种填充词。"
      ],
      words: [["available", "可获得的"], ["install", "安装"], ["household", "家庭"]]
    },
    {
      id: 28,
      en: "The belief that economic growth will automatically produce good jobs, an assumption that guided policy for decades, has survived evidence that it often does not.",
      tags: ["同位语从句", "定语从句", "省略"],
      chunks: [
        ["The belief that economic growth will automatically produce good jobs", "that 引导同位语从句，说明 belief 的内容"],
        ["an assumption that guided policy for decades", "同位语，指代前面的 belief；that 引导定语从句"],
        ["has survived evidence", "主句谓语"],
        ["that it often does not", "evidence 的同位语从句，does not 后省略 produce good jobs"]
      ],
      ref: "经济增长会自动带来好工作——这一指导了数十年政策的假设——并未因大量证据表明事实常常并非如此而消失。",
      points: [
        "主句被长同位语隔开，先抓住 The belief ... has survived evidence。",
        "an assumption 是 belief 的同位语，翻译时可用破折号或“这一假设”。",
        "does not 后省略了 produce good jobs，需要补全后再译。"
      ],
      words: [["assumption", "假设"], ["survive", "幸存；经受住"], ["evidence", "证据"]]
    },
    {
      id: 29,
      en: "It is not the amount of time spent studying that predicts success, but whether the learner tests his or her understanding at regular intervals.",
      tags: ["强调句", "主语从句", "并列结构"],
      chunks: [
        ["It is not the amount of time spent studying that predicts success", "It is ... that 强调句，强调 not the amount of time"],
        ["but whether the learner tests his or her understanding", "but 连接的并列成分；whether 从句"],
        ["at regular intervals", "时间状语，“定期”"]
      ],
      ref: "决定成败的不是学习时间的长短，而是学习者是否定期检验自己的理解。",
      points: [
        "It is ... that 是强调结构，不是形式主语，翻译时用“正是/不是……而是……”体现。",
        "spent studying 是过去分词短语后置修饰 time。",
        "whether 从句在 but 后作并列成分，译成“是否”。"
      ],
      words: [["predict", "预测；决定"], ["interval", "间隔"], ["understanding", "理解"]]
    },
    {
      id: 30,
      en: "With the cost of solar panels falling faster than anyone had expected, utilities that once dismissed renewable energy are now revising their plans, their forecasts, and sometimes their public positions.",
      tags: ["独立主格", "分词", "定语从句"],
      chunks: [
        ["With the cost of solar panels falling faster than anyone had expected", "with + 名词 + 现在分词，独立主格结构"],
        ["utilities ... are now revising their plans", "主句"],
        ["that once dismissed renewable energy", "定语从句修饰 utilities"],
        ["their plans, their forecasts, and sometimes their public positions", "revising 的三个并列宾语"]
      ],
      ref: "随着太阳能板成本下降得比任何人预想的都快，曾对可再生能源不屑一顾的公用事业公司如今正在修改计划、预测，有时还有公开立场。",
      points: [
        "With ... falling 是独立主格，表伴随原因，译“随着……”。",
        "faster than anyone had expected 中的过去完成时表示“此前预料”，不必逐字译出时态。",
        "dismiss 在此是“不予考虑、轻视”，不是“解散”。"
      ],
      words: [["utility", "公用事业公司"], ["dismiss", "轻视；不予考虑"], ["forecast", "预测"]]
    },
    {
      id: 31,
      en: "Only when the data are made available to independent researchers can the public judge whether the claims in the advertisement are as solid as they sound.",
      tags: ["部分倒装", "宾语从句", "比较结构"],
      chunks: [
        ["Only when the data are made available to independent researchers", "Only + 状语从句置于句首"],
        ["can the public judge", "主句部分倒装"],
        ["whether the claims in the advertisement are as solid as they sound", "whether 宾语从句；as ... as 比较"]
      ],
      ref: "只有当数据向独立研究者开放，公众才能判断广告中的说法是否像听起来那样可靠。",
      points: [
        "Only when 置于句首，主句必须部分倒装：can the public judge。",
        "are made available to 是被动结构，译“向……开放/提供”。",
        "as solid as they sound 是“像听起来那样可靠”，sound 后省略了 solid。"
      ],
      words: [["independent", "独立的"], ["claim", "说法；主张"], ["solid", "可靠的；坚实的"]]
    },
    {
      id: 32,
      en: "A system that punishes people for reporting errors, however politely it is described, will eventually teach them to hide the errors that matter most.",
      tags: ["定语从句", "让步状语", "插入语"],
      chunks: [
        ["A system that punishes people for reporting errors", "that 定语从句修饰 system"],
        ["however politely it is described", "however 引导让步状语从句，“无论被描述得多么客气”"],
        ["will eventually teach them to hide the errors", "主句"],
        ["that matter most", "定语从句修饰 errors"]
      ],
      ref: "一个因报告错误而惩罚人的制度，无论措辞多么客气，最终都会教会人们隐瞒最要紧的错误。",
      points: [
        "however politely 中的 however 是“无论多么”，不是“然而”。",
        "punish sb for doing sth 译“因做某事而惩罚某人”。",
        "matter 在此是动词“要紧、重要”，that matter most 译“最要紧的”。"
      ],
      words: [["punish", "惩罚"], ["eventually", "最终"], ["hide", "隐瞒"]]
    },
    {
      id: 33,
      en: "It is easy to forget that the maps we use are arguments about what matters, not neutral records of a place.",
      tags: ["形式主语", "宾语从句", "定语从句"],
      chunks: [
        ["It is easy to forget", "It 作形式主语，真正主语是不定式"],
        ["that the maps we use are arguments about what matters", "that 宾语从句；we use 是省略关系词的定语从句"],
        ["not neutral records of a place", "与 arguments 并列的表语"]
      ],
      ref: "人们很容易忘记，我们使用的地图是关于“什么重要”的论证，而不是对某个地点的中性记录。",
      points: [
        "It is easy to forget that ... 译“人们很容易忘记……”，不必译出形式主语。",
        "the maps we use 中省略了 that/which，翻译时按定语处理。",
        "what matters 是“重要的事情”，matter 作动词。"
      ],
      words: [["neutral", "中立的"], ["record", "记录"], ["argument", "论证；主张"]]
    },
    {
      id: 34,
      en: "The novel, which its author insists is not autobiographical, nevertheless draws on a childhood that its readers—and perhaps its author—cannot fully reconstruct.",
      tags: ["非限制性定语从句", "插入语", "否定"],
      chunks: [
        ["The novel ... nevertheless draws on a childhood", "主句"],
        ["which its author insists is not autobiographical", "非限制性定语从句，its author insists 是插入成分"],
        ["that its readers—and perhaps its author—cannot fully reconstruct", "定语从句修饰 childhood"]
      ],
      ref: "这部小说——作者坚称并非自传——却取材于一段读者（也许还有作者本人）无法完整重建的童年。",
      points: [
        "which ... is not autobiographical 中插入了 its author insists，翻译时把“作者坚称”单独提出。",
        "nevertheless 表转折，说明“虽非自传，却仍取材于童年”。",
        "draw on 是“取材于、利用”，不是“画在……上”。"
      ],
      words: [["autobiographical", "自传的"], ["draw on", "取材于"], ["reconstruct", "重建；还原"]]
    },
    {
      id: 35,
      en: "Compared with a generation ago, young workers are less likely to stay with one employer, more likely to change careers, and increasingly expected to fund their own retraining.",
      tags: ["比较结构", "分词", "被动"],
      chunks: [
        ["Compared with a generation ago", "过去分词短语作状语"],
        ["young workers are less likely to stay with one employer", "第一个比较"],
        ["more likely to change careers", "第二个比较，与前面并列"],
        ["and increasingly expected to fund their own retraining", "被动结构，与前两项并列"]
      ],
      ref: "与上一代人相比，年轻劳动者更不可能长期留在同一雇主处，更可能转换职业，也越来越被要求自费接受再培训。",
      points: [
        "Compared with 是“与……相比”，逻辑主语是 young workers。",
        "less likely / more likely / expected 三个表语并列，翻译时保持结构对称。",
        "fund 在此是动词“为……出资”，不是名词“基金”。"
      ],
      words: [["employer", "雇主"], ["retraining", "再培训"], ["likely", "可能的"]]
    },
    {
      id: 36,
      en: "Had the city built the housing it promised a decade ago, the families now waiting for a place would not be living in temporary accommodation on the edge of town.",
      tags: ["虚拟倒装", "定语从句", "分词"],
      chunks: [
        ["Had the city built the housing", "省略 if 的虚拟倒装，相当于 If the city had built"],
        ["it promised a decade ago", "省略关系词的定语从句修饰 housing"],
        ["the families now waiting for a place", "now waiting 是现在分词短语后置修饰 families"],
        ["would not be living in temporary accommodation", "主句虚拟"]
      ],
      ref: "如果这座城市十年前就建成了它承诺的住房，如今等待住房的家庭就不会住在城市边缘的临时住所里。",
      points: [
        "Had the city built ... 是倒装虚拟，主句用 would not be living，形成过去假设对现在的影响。",
        "it promised a decade ago 中 it 指 the city，promise 后省略了关系代词 that/which。",
        "now waiting for a place 是后置定语，不是谓语，翻译时放在“家庭”前。"
      ],
      words: [["accommodation", "住所"], ["temporary", "临时的"], ["promise", "承诺"]]
    }
  ];

  extra.forEach(function (s) { window.TRANSLATIONS.sentences.push(s); });
})();
