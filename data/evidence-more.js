/* 阅读 17—20 的证据链与参考句
   与 reading-more.js 逐题对应，quote 均取自原文，不另行改写 */

(function () {
  const evidence = {
    "17": [
      {
        para: 1,
        evidence: "They are storing observations that matter for survival, and passing them on in a form that can be used.",
        paraphrase: "storing observations = keeping practical knowledge（保存观察）｜in a form that can be used = usable, not decorative（以可用的形式传递，而非装饰）"
      },
      {
        para: 2,
        evidence: "A dictionary may preserve the words, but a dictionary does not know when to use them.",
        paraphrase: "preserve the words = keep the form（保存词形）｜does not know when to use them = lacks the practice of application（缺少使用场景中的实践知识）"
      },
      {
        para: 3,
        evidence: "Speakers abandon a language when the institutions around them make it costly to keep",
        paraphrase: "institutions make it costly = schools, jobs and stigma raise the cost（制度让保留语言代价高昂）｜speakers abandon = the choice is a response, not a natural death（放弃是对压力的回应，不是自然死亡）"
      },
      {
        para: 4,
        evidence: "this work is genuinely valuable. But a record is not a living use.",
        paraphrase: "genuinely valuable = documentation matters（记录确有价值）｜a record is not a living use = preservation is not maintenance（保存不等于维持使用）"
      },
      {
        para: null,
        evidence: "when a language disappears under pressure, what vanishes is not just a way of speaking but a body of knowledge that took generations to accumulate.",
        paraphrase: "not just a way of speaking = more than culture in the narrow sense（不只是说话方式）｜a body of knowledge = accumulated practical knowledge（世代积累的知识体系）"
      }
    ],
    "18": [
      {
        para: 1,
        evidence: "Plea bargaining is not a loophole; it is the ordinary machinery of criminal justice",
        paraphrase: "not a loophole = not an exception（不是例外）｜ordinary machinery = the routine procedure（日常运转机制）"
      },
      {
        para: 3,
        evidence: "even an innocent person may decide that the gamble is not worth taking.",
        paraphrase: "the gamble = the risk of a much longer sentence after trial（受审可能换来更重刑罚）｜not worth taking = accepting a certain smaller penalty（宁可接受确定的较轻处罚）"
      },
      {
        para: 3,
        evidence: "A plea produced under that kind of pressure is voluntary in a narrow legal sense and questionable in any other.",
        paraphrase: "voluntary in a narrow legal sense = formally free（形式上自愿）｜questionable in any other = substantively constrained（实质上受迫）"
      },
      {
        para: 4,
        evidence: "None of these would remove the bargain, but each would make the exchange more informed.",
        paraphrase: "would not remove the bargain = reform, not abolition（改革而非废除）｜more informed = better access to evidence and advice（让交易建立在知情之上）"
      },
      {
        para: null,
        evidence: "It is what makes an agreement legitimate.",
        paraphrase: "legitimate = fair and informed, not merely legal（正当，而不只是合法）｜the standard is the quality of the exchange（判断标准是交易本身是否公平）"
      }
    ],
    "19": [
      {
        para: 1,
        evidence: "It also means that a field is, in genetic terms, one large target.",
        paraphrase: "one large target = a single genetic profile exposed to the same threat（整片作物基因相同，成为同一个目标）｜in genetic terms = viewed by genetic variation（从遗传多样性角度看）"
      },
      {
        para: 2,
        evidence: "Diversity is a form of insurance, and insurance is easiest to dismiss when nothing has gone wrong.",
        paraphrase: "a form of insurance = protection against uncertain disease outbreaks（对病害风险的保障）｜easiest to dismiss = neglected in good times（平安时最容易被忽视）"
      },
      {
        para: 3,
        evidence: "Storage without characterisation is a library with no catalogue.",
        paraphrase: "characterisation = knowledge of traits and genes（对性状与基因的了解）｜a library with no catalogue = material that cannot be found or used（有材料却无法检索使用）"
      },
      {
        para: 4,
        evidence: "A conservation strategy that collects their seeds but ignores their livelihoods treats them as sources of material rather than partners in adaptation.",
        paraphrase: "collects seeds but ignores livelihoods = extraction without support（只取种子不顾生计）｜partners in adaptation = co-producers of resilience（共同适应气候的合作者）"
      },
      {
        para: null,
        evidence: "Seed banks buy time; they do not create resilience on their own.",
        paraphrase: "buy time = preserve options for the future（为未来争取时间）｜do not create resilience on their own = storage must be combined with breeding and use（储存必须配合育种与使用）"
      }
    ],
    "20": [
      {
        para: 1,
        evidence: "the kinds of housing that once filled the space between—are often illegal to build, even where they already stand.",
        paraphrase: "filled the space between = mid-density housing between houses and towers（介于独栋与高塔之间的住宅）｜illegal to build = zoning forbids new ones（规划禁止新建）"
      },
      {
        para: 2,
        evidence: "demand is pushed to the edges of the city or into older neighbourhoods, where prices rise and the people who work nearby are slowly displaced.",
        paraphrase: "pushed to the edges = demand relocated（需求被挤到城市边缘）｜workers are displaced = those who serve the area can no longer afford it（附近劳动者被迫迁离）"
      },
      {
        para: 3,
        evidence: "New supply does help over time—today's expensive flat becomes tomorrow's ordinary one—but the process is slow, and it does not house the family that needs a place this year.",
        paraphrase: "becomes tomorrow's ordinary one = filtering over time（随时间向下过滤）｜does not house ... this year = too slow for immediate need（对当下需求太慢）"
      },
      {
        para: 3,
        evidence: "Removing height limits can produce luxury towers, because land values and construction costs push new homes toward the top of the market.",
        paraphrase: "produce luxury towers = supply concentrated at the high end（供给集中在高端）｜push toward the top of the market = cost structure shapes what gets built（成本结构决定建什么）"
      },
      {
        para: 5,
        evidence: "The real question is who is allowed to live where, and under what conditions.",
        paraphrase: "who is allowed to live where = distribution of access（谁有权住在哪里）｜under what conditions = the rules behind that distribution（以什么条件获得居住权）"
      }
    ]
  };

  const cn = {
    "17-0": "它们保存的是关乎生存的观察，并以可用的形式传递下去。",
    "17-1": "词典可以保存词语，却不知道何时使用它们。",
    "17-2": "当周围制度让保留语言代价高昂时，说话者便会放弃它。",
    "17-3": "这项工作确有价值。但记录不等于活的使用。",
    "17-4": "当一种语言在压力下消失，失去的不只是说话方式，还有世代积累起来的知识体系。",
    "18-0": "认罪协商不是漏洞，而是刑事司法的日常运转机制。",
    "18-1": "即便是无辜者，也可能认为这场赌博不值得冒。",
    "18-2": "在这种压力下产生的认罪，只在狭义法律意义上算自愿，在其他意义上都值得怀疑。",
    "18-3": "这些措施都不会取消认罪协商，但每一项都能让交易更有知情基础。",
    "18-4": "问题在于什么使协议具有正当性。这不是程序细节，而是定罪与屈从之间的区别。",
    "19-0": "这也意味着，从遗传角度看，一整片田地就是同一个大目标。",
    "19-1": "多样性是一种保险，而保险在平安无事时最容易被忽视。",
    "19-2": "没有性状鉴定的储存，就像一座没有目录的图书馆。",
    "19-3": "只收集种子却无视生计的保护策略，是把农民当作材料来源，而不是适应气候的伙伴。",
    "19-4": "种子库买来的是时间，它们本身并不创造韧性。",
    "20-0": "这些曾填补空白的住宅类型，如今常常被禁止新建，即使它们早已存在。",
    "20-1": "需求被挤到城市边缘或更老的街区，那里价格上涨，附近工作的人逐渐被迫迁离。",
    "20-2": "新增供给长期确实有用——今天昂贵的公寓会成为明天普通的住处——但过程缓慢，解决不了今年就需要住房的家庭。",
    "20-3": "取消限高可能带来豪华高塔，因为地价和建造成本会把新房推向市场顶端。",
    "20-4": "真正的问题是：谁被允许住在哪里，以什么条件。"
  };

  Object.keys(evidence).forEach(function (key) {
    window.READING_EVIDENCE[key] = evidence[key];
  });
  Object.keys(cn).forEach(function (key) {
    window.READING_EVIDENCE_CN[key] = cn[key];
  });
})();
