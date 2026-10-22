/* 阅读题证据链：题眼句 + 同义替换
   每道题对应一条，para 为可定位的段落编号；主旨/全文态度题为 null。
   内容均为原创仿真材料的逐题拆解，用于训练“先定位、再选答案”。 */

window.READING_EVIDENCE = {
  "1": [
    {
      para: 1,
      evidence: "Remote work did not simply move those workers home; it removed the reason many of them had for entering the city at all.",
      paraphrase: "removed the reason ... entering the city = removing a daily reason for workers to enter the city（抽掉日常进城的理由，不只是把人留在家里）"
    },
    {
      para: 2,
      evidence: "Transit systems, built on the assumption of a five-day commute, found themselves with empty seats and fixed costs.",
      paraphrase: "empty seats and fixed costs = costs paid regardless of how many people use the service（座位空着，固定成本照付）"
    },
    {
      para: 3,
      evidence: "Conversion is technically possible, but rarely cheap: floor plates are deep, plumbing is limited, and the buildings were designed for a single purpose.",
      paraphrase: "floor plates are deep ... designed for a single purpose = constrained by the design of the buildings（建筑结构本身限制改造）"
    },
    {
      para: 5,
      evidence: "Cities that treat downtown as a collection of desks will struggle. Those that treat it as a place where people exchange things, including ideas and attention, may find a second life.",
      paraphrase: "may find a second life, but only if ... = optimistic but conditional（有条件地乐观，不是无条件看好）"
    },
    {
      para: null,
      evidence: "The deeper issue is what cities are for.",
      paraphrase: "what cities are for = why cities need to rethink downtown（全文落点是重新定义中心区用途）"
    }
  ],
  "2": [
    {
      para: 2,
      evidence: "Such models are good at spotting missing citations, inconsistent numbers and inflated claims.",
      paraphrase: "spotting missing citations, inconsistent numbers = detect mechanical problems such as inconsistent data（机械性核查，不涉及意义判断）"
    },
    {
      para: 2,
      evidence: "A reviewer who disagrees with a novel argument may be overruled by a model that has learned to prefer the conventional.",
      paraphrase: "prefer the conventional = put unconventional work at a disadvantage（偏好常规，就会挤压非常规研究）"
    },
    {
      para: 3,
      evidence: "If an error is traced to an algorithm, responsibility diffuses among the publisher, the developer and the editor who chose to use it.",
      paraphrase: "diffuses among several parties = is spread among several parties and therefore weakened（责任扩散，等于无人明确负责）"
    },
    {
      para: 4,
      evidence: "Some journals now require authors to consent; others have banned the tools outright.",
      paraphrase: "Neither response addresses the underlying incentive = critical of both bans and consent requirements as incomplete（两种做法都没触及根源）"
    },
    {
      para: null,
      evidence: "The most plausible future is not replacement but division of labour.",
      paraphrase: "division of labour = the promise and limits of using models in peer review（既看到能力，也划出边界）"
    }
  ],
  "3": [
    {
      para: 1,
      evidence: "The pandemic, which made it difficult to sit for exams, gave hundreds of universities a natural experiment: they went test-optional, and many have stayed that way.",
      paraphrase: "went test-optional ... natural experiment = universities were pushed to reconsider admissions requirements（疫情迫使高校重新审视招生要求）"
    },
    {
      para: 2,
      evidence: "But grades vary enormously between schools, and a B in a demanding school may mean more than an A in a lenient one.",
      paraphrase: "grades vary enormously between schools = mean different things depending on the school（同样的分数，在不同学校含义不同）"
    },
    {
      para: 2,
      evidence: "Tests offer a common yardstick, however imperfect.",
      paraphrase: "a common yardstick = a standard for comparison（共同的比较尺度）"
    },
    {
      para: 4,
      evidence: "The reason is structural: the students who benefit most from dropping tests are often those who already have the resources to present a strong application in other ways.",
      paraphrase: "already have the resources ... in other ways = students with other resources benefit most（受益者往往是本来就有资源的人）"
    },
    {
      para: 5,
      evidence: "The question is not whether to use a number, but what else a school knows about an applicant, and whether it has the capacity to weigh that knowledge fairly.",
      paraphrase: "what else a school knows ... weigh fairly = focus on how schools evaluate applicants, not just on tests（争论应转向“还会看什么、能否公平权衡”）"
    }
  ],
  "4": [
    {
      para: 2,
      evidence: "A footprint is usually expressed in grams of carbon dioxide equivalent, a unit that means little to most shoppers.",
      paraphrase: "a unit that means little to most shoppers = the unit used is hard for most people to understand（单位本身难以理解）"
    },
    {
      para: 2,
      evidence: "Worse, a low number may create a false sense of virtue: a product can be carbon-light and still be produced under poor labour conditions, or shipped thousands of miles.",
      paraphrase: "carbon-light and still ... poor labour conditions = a single metric can hide other important harms（单一指标掩盖其他伤害）"
    },
    {
      para: 3,
      evidence: "They may count production and transport but ignore land use, waste, or the emissions caused by changing consumption patterns. A label that stops at the factory gate can make the supply chain look cleaner than it is.",
      paraphrase: "count production and transport but ignore ... = excludes stages that occur after production（止于厂门，排除生产之后的环节）"
    },
    {
      para: 5,
      evidence: "But they are a tool, not a policy. If governments want lower emissions, they need prices, standards and investment, not just a small number on a package.",
      paraphrase: "a tool, not a policy = labels can support but cannot replace regulation（标签是工具，不能替代政策）"
    },
    {
      para: null,
      evidence: "A label can start a conversation; it cannot finish one.",
      paraphrase: "start a conversation; cannot finish one = a useful but limited tool（有用，但作用有限）"
    }
  ],
  "5": [
    {
      para: 1,
      evidence: "Cases were sealed, screws were proprietary, and software refused to recognise parts from anyone but the manufacturer.",
      paraphrase: "sealed cases, proprietary screws, software refused ... = products were designed in ways that made repair difficult（设计层面让维修变难）"
    },
    {
      para: 2,
      evidence: "If you cannot repair what you buy, they say, you have bought a licence to use it for as long as the seller finds convenient.",
      paraphrase: "bought a licence to use it = repair restrictions raise a question about who really owns a product（不能修，就只是买到使用许可）"
    },
    {
      para: 3,
      evidence: "These concerns are real, but they are often used to justify restrictions that have little to do with safety.",
      paraphrase: "concerns are real ... little to do with safety = the concerns are real but sometimes used to defend unrelated restrictions（真问题被拿来为无关限制背书）"
    },
    {
      para: 4,
      evidence: "Yet repair is still often more expensive than replacement, partly because the price of a new device does not include the cost of its disposal.",
      paraphrase: "price ... does not include the cost of its disposal = the disposal cost is not included in the price（新机价格没有承担废弃成本）"
    },
    {
      para: null,
      evidence: "It is an argument for making the choice to repair a real one, rather than a hobby for people with time and tools.",
      paraphrase: "making the choice ... a real one = sympathetic but aware of its limits（支持维修权，但承认现实门槛）"
    }
  ],
  "6": [
    {
      para: 1,
      evidence: "The list is appealing because it is concrete and easy to copy.",
      paraphrase: "concrete and easy to copy = concrete and easy to imitate（具体、易复制正是吸引力）"
    },
    {
      para: 2,
      evidence: "A weekly meeting that works in a small company may fail in a large one where information already travels through five layers of management.",
      paraphrase: "works ... may fail / motivates ... may demoralise = the same practice can have different effects in different settings（同一做法换环境会失效）"
    },
    {
      para: 3,
      evidence: "The failures are invisible, and the successes are credited to whatever was most visible at the time.",
      paraphrase: "failures are invisible ... survivorship bias = how failures disappear from the evidence（失败案例消失，成功被错误归因）"
    },
    {
      para: 4,
      evidence: "Ideas travel best when they are treated as questions rather than instructions.",
      paraphrase: "questions rather than instructions = questions to examine and adapt（当问题来检验，而不是当指令照搬）"
    },
    {
      para: null,
      evidence: "It is a more demanding form of learning: observing carefully, testing small changes, and being honest about what does not transfer.",
      paraphrase: "testing small changes ... what does not transfer = copying without context is a poor substitute for learning（脱离语境的复制不是学习）"
    }
  ]
};

window.READING_EVIDENCE_CN = {
  "1-0": "远程办公并没有简单地把这些员工搬回家；它抽掉了许多人进城的理由。",
  "1-1": "建立在五天通勤假设上的公交系统，发现自己座位空着，固定成本却照付。",
  "1-2": "改造在技术上可行，但很少便宜：楼层进深大、管道条件有限，而且这些建筑原本就是为单一用途设计的。",
  "1-3": "把市中心当作一排办公桌的城市会陷入困境。把它当作人们交换东西——包括想法和注意力——的地方的城市，或许能找到第二次生命。",
  "1-4": "更深层的问题是：城市究竟是为什么而存在。",
  "2-0": "这类模型擅长发现缺失的引文、前后不一致的数据和夸大的说法。",
  "2-1": "一位不认同新颖论点的审稿人，可能会被一个学会了偏好常规的模型否决。",
  "2-2": "如果错误被追溯到算法，责任就会在出版商、开发者和决定使用它的编辑之间分散。",
  "2-3": "一些期刊现在要求作者同意；另一些则直接禁用这些工具。两种回应都没有触及背后的激励……",
  "2-4": "最可能的未来不是替代，而是分工。",
  "3-0": "疫情使考试难以进行，却给了数百所大学一次自然实验：它们改为可选提交考试成绩，许多学校一直沿用至今。",
  "3-1": "但不同学校之间的成绩差异极大，在要求严格的学校拿 B，可能比在宽松的学校拿 A 更有分量。",
  "3-2": "考试提供了一把共同的尺子，尽管并不完美。",
  "3-3": "原因是结构性的：从取消考试中受益最多的学生，往往本来就是那些有其他资源来呈现一份强申请材料的人。",
  "3-4": "问题不在于是否使用一个数字，而在于学校还了解申请者的哪些方面，以及它是否有能力公平地权衡这些信息。",
  "4-0": "碳足迹通常用二氧化碳当量克数表示，而这个单位对大多数购物者来说意义不大。",
  "4-1": "更糟的是，低数字可能制造一种虚假的美德感：一件产品可以碳排放很低，却仍在恶劣的劳动条件下生产，或被运输数千英里。",
  "4-2": "它们可能计算生产和运输，却忽略土地使用、废弃物，或消费模式改变带来的排放。一个止于工厂大门的标签，会让供应链看起来比实际更清洁。",
  "4-3": "但它们是一种工具，不是政策。如果政府想要降低排放，就需要价格、标准和投资，而不只是包装上的一个小数字。",
  "4-4": "标签可以开启一场对话，却无法结束它。",
  "5-0": "外壳是密封的，螺丝是专有的，软件拒绝识别制造商以外任何人生产的零件。",
  "5-1": "他们说，如果你不能修理自己买的东西，你买到的就只是一张使用许可，期限由卖家觉得方便而定。",
  "5-2": "这些担忧是真实的，但它们常被用来为与安全几乎无关的限制辩护。",
  "5-3": "然而维修仍然常常比更换更贵，部分原因是新设备的价格并不包含其废弃处置的成本。",
  "5-4": "它支持让“选择维修”成为真正的选择，而不是有时间、有工具的人的爱好。",
  "6-0": "这份清单之所以吸引人，是因为它具体且容易照搬。",
  "6-1": "在小公司有效的周会，在大公司可能失效……对销售人员有激励作用的奖金方案，可能让护士士气低落。",
  "6-2": "失败是不可见的，而成功则被归功于当时最显眼的东西。",
  "6-3": "思想在被称为问题时传播得最好，而不是被当作指令时。",
  "6-4": "这是一种要求更高的学习方式：仔细观察、小步试验，并诚实面对哪些东西无法迁移。"
};

window.READING_TYPE_ADVICE = {
  "细节题": "先圈题干定位词，回原文找同义替换；正确项一定有依据，不靠常识。",
  "推断题": "答案必须由原文推进一步，不能推两步；注意转折、限定和作者保留态度。",
  "词义题": "回到上下文找解释、并列或转折，不要直接套词典义。",
  "态度题": "抓评价性形容词和转折词，区分作者态度与他人观点。",
  "主旨题": "看首尾段和反复出现的主题词，排除只覆盖一段的选项。",
  "目的题": "问例子或引用为何出现，答案通常在例子前后的论点句。"
};