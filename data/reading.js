/* 阅读理解 · 六篇仿真练习
   文章与题目均为原创，参照英语一 Part A 的题型与难度编写 */
window.READINGS = [
  {
    id: 1,
    title: "The Empty Office Downtown",
    topic: "经济与社会",
    difficulty: "中等",
    minutes: 17,
    source: "仿真练习",
    paragraphs: [
      "For most of the twentieth century, the office shaped the modern city. Workers commuted to a central district, and the shops, restaurants and transport networks that grew around them depended on that daily flow. Remote work did not simply move those workers home; it removed the reason many of them had for entering the city at all. The result was a concentration of demand that no planner had to invent and no mayor knew how to replace.",
      "The first effects were easy to see. Foot traffic in business districts fell, and the small businesses that served lunchtime crowds lost customers. Transit systems, built on the assumption of a five-day commute, found themselves with empty seats and fixed costs. Some cities responded by cutting service, which made the remaining riders more dependent on cars. The losses were concentrated among workers who could least afford them.",
      "Yet the story is not simply one of decline. Downtowns have always changed function. Manufacturing left, offices arrived, and the districts that survived were those that offered something people could not get at home. The question now is whether empty office floors can become housing, culture, or public space. Conversion is technically possible, but rarely cheap: floor plates are deep, plumbing is limited, and the buildings were designed for a single purpose.",
      "Policy has been slow to catch up. Tax breaks for conversion tend to favour luxury apartments, which do little for workers priced out of the neighbourhood. Zoning rules, written for a world in which work and home were separate, can block mixed-use development. And the fiscal problem is circular: as office values fall, cities collect less tax just as they need more money to adapt.",
      "The deeper issue is what cities are for. The office was never only a place of work; it was a meeting place, a training ground, and a stage for the routines that make a city feel alive. Remote work can replace some tasks, but it cannot reproduce the accidental encounters that generate new ideas. Cities that treat downtown as a collection of desks will struggle. Those that treat it as a place where people exchange things, including ideas and attention, may find a second life."
    ],
    glossary: [
      ["commute", "通勤"],
      ["conversion", "改造；转换"],
      ["zoning", "分区规划"],
      ["fiscal", "财政的"]
    ],
    questions: [
      {
        stem: "According to Paragraph 1, remote work affected cities mainly by",
        options: [
          "reducing the number of new offices being built.",
          "removing a daily reason for workers to enter the city.",
          "increasing demand for public transport.",
          "forcing shops to close permanently."
        ],
        answer: 1,
        type: "细节题",
        loc: "第 1 段",
        explain: "定位第 1 段第三句：it removed the reason many of them had for entering the city at all。远程办公不只是把人留在家里，而是抽掉了他们进城的理由。A、D 均未提及；C 与第 2 段交通客流下降相反。"
      },
      {
        stem: "The phrase fixed costs in Paragraph 2 refers to costs that",
        options: [
          "rise with the number of passengers.",
          "must be paid regardless of how many people use the service.",
          "are shared between neighbouring cities.",
          "fall when service is cut."
        ],
        answer: 1,
        type: "词义题",
        loc: "第 2 段",
        explain: "fixed costs 与 empty seats 对照：座位空着，成本照付。固定成本不随乘客数量变化。C 无依据；D 曲解了“削减服务”的后果。"
      },
      {
        stem: "About converting offices into housing, the author suggests that",
        options: [
          "it is cheaper than building new homes.",
          "it is constrained by the design of the buildings.",
          "it has solved the housing shortage.",
          "it is opposed by most city residents."
        ],
        answer: 1,
        type: "推断题",
        loc: "第 3 段",
        explain: "第 3 段末尾指出 floor plates are deep, plumbing is limited, and the buildings were designed for a single purpose，说明建筑本身的结构限制了改造。A 与 rarely cheap 相反；C、D 文中无据。"
      },
      {
        stem: "The author's attitude toward the future of downtowns is best described as",
        options: [
          "optimistic but conditional.",
          "entirely pessimistic.",
          "indifferent.",
          "confident that offices will return."
        ],
        answer: 0,
        type: "态度题",
        loc: "第 5 段",
        explain: "末段说 cities that treat downtown as a collection of desks will struggle，又说 may find a second life，态度是有条件的乐观。B、D 过于绝对；C 与全文关注不符。"
      },
      {
        stem: "Which of the following would be the best title for the text?",
        options: [
          "The End of the Office",
          "Why Cities Need to Rethink Downtown",
          "The Cost of Public Transport",
          "How to Convert Offices into Homes"
        ],
        answer: 1,
        type: "主旨题",
        loc: "全文",
        explain: "文章从办公区空心化谈到改造障碍，最后落到“城市的功能是什么”，核心是城市需要重新思考中心区的用途。A 过窄且极端；C、D 只是局部细节。"
      }
    ]
  },
  {
    id: 2,
    title: "The Referee's New Assistant",
    topic: "科技与学术",
    difficulty: "较难",
    minutes: 18,
    source: "仿真练习",
    paragraphs: [
      "Peer review is often described as the worst system of quality control, except for all the others. It is slow, unpaid and inconsistent. The workload has grown faster than the number of qualified reviewers. So it is not surprising that publishers have begun experimenting with large language models to screen submissions, check statistics and even draft reports.",
      "The early results are mixed. Such models are good at spotting missing citations, inconsistent numbers and inflated claims. They can summarize a paper in seconds and flag passages that look plagiarized. But they are also confident when wrong, and they tend to reward writing that sounds familiar. A reviewer who disagrees with a novel argument may be overruled by a model that has learned to prefer the conventional.",
      "There is a deeper problem: accountability. A human reviewer can be asked to explain a judgment, defend it in public or be removed from a panel. A model cannot. If an error is traced to an algorithm, responsibility diffuses among the publisher, the developer and the editor who chose to use it. Readers, meanwhile, have no way of knowing which parts of a decision were made by a machine. This is not a reason to ban the tools, but it is a reason to be explicit about who answers for their output.",
      "Confidentiality is another concern. Papers under review are unpublished, and sending them to a commercial model may amount to disclosing them to a company whose terms were not designed for that purpose. Some journals now require authors to consent; others have banned the tools outright. Neither response addresses the underlying incentive: reviewing is unpaid, invisible work, and the people asked to do it are overwhelmed.",
      "The most plausible future is not replacement but division of labour. Models can handle the mechanical checks, leaving humans to judge significance, originality and whether a claim is worth the reader's time. That would be an improvement, provided the division is made explicit. The danger is not that machines will judge us. It is that we will stop asking who is judging, and on what grounds."
    ],
    glossary: [
      ["peer review", "同行评审"],
      ["plagiarized", "剽窃的"],
      ["accountability", "问责"],
      ["confidentiality", "保密"]
    ],
    questions: [
      {
        stem: "Large language models are particularly useful in peer review because they can",
        options: [
          "replace human judgment about originality.",
          "predict how often a paper will be cited.",
          "detect mechanical problems such as inconsistent data.",
          "write the final version of a submitted paper."
        ],
        answer: 2,
        type: "细节题",
        loc: "第 2 段",
        explain: "第 2 段列举 spotting missing citations, inconsistent numbers and inflated claims，属于机械性核查。A 与全文“人工判断意义与原创性”相反；B、D 文中未提。"
      },
      {
        stem: "The author mentions models' preference for writing that sounds familiar in order to show that",
        options: [
          "models are better stylists than human reviewers.",
          "most academic papers are poorly written.",
          "human reviewers dislike new ideas.",
          "models may put unconventional work at a disadvantage."
        ],
        answer: 3,
        type: "推断题",
        loc: "第 2 段",
        explain: "紧接着一句说新颖论点可能被偏好常规的模型否决，说明这种偏好会让非常规研究处于劣势。A 与文意相反；C 项中的 human reviewers 偷换主体；B 无依据。"
      },
      {
        stem: "The phrase responsibility diffuses in Paragraph 3 most nearly means responsibility",
        options: [
          "is spread among several parties and therefore weakened.",
          "becomes clearer.",
          "is transferred to the authors.",
          "is protected by law."
        ],
        answer: 0,
        type: "词义题",
        loc: "第 3 段",
        explain: "diffuse 意为扩散。责任在出版商、开发者、编辑之间扩散，结果是无人明确负责。B 与 diffuse 相反；C、D 均无依据。"
      },
      {
        stem: "Toward banning language models in peer review, the author's attitude is",
        options: [
          "fully supportive.",
          "completely indifferent.",
          "confident that bans will soon be lifted.",
          "critical of both bans and consent requirements as incomplete."
        ],
        answer: 3,
        type: "态度题",
        loc: "第 4 段",
        explain: "作者说 Neither response addresses the underlying incentive，即禁止与征得同意都没有触及评审工作无报酬、无人手这一根源，故两种做法都不完整。作者并未完全支持禁止。"
      },
      {
        stem: "Which of the following best states the main idea of the text?",
        options: [
          "How to write an effective peer review report.",
          "Why peer review should be abolished.",
          "The promise and limits of using language models in peer review.",
          "The commercial interests of academic publishers."
        ],
        answer: 2,
        type: "主旨题",
        loc: "全文",
        explain: "文章既承认模型在机械核查上的优势，也讨论问责、保密与激励问题，最后提出人机分工。C 概括最全面；A 过窄；B、D 均非主旨。"
      }
    ]
  },
  {
    id: 3,
    title: "Measuring What Matters",
    topic: "教育",
    difficulty: "中等",
    minutes: 17,
    source: "仿真练习",
    paragraphs: [
      "For decades, standardized tests have been the most visible measure of academic ability in American admissions. Critics have long argued that they reward test-taking skill and family resources more than potential. The pandemic, which made it difficult to sit for exams, gave hundreds of universities a natural experiment: they went test-optional, and many have stayed that way.",
      "The evidence is less dramatic than either side claims. Studies find that test scores predict first-year grades about as well as high-school grades do, and that combining the two improves prediction slightly. But grades vary enormously between schools, and a B in a demanding school may mean more than an A in a lenient one. Tests offer a common yardstick, however imperfect.",
      "The bigger question is what admissions are for. If the goal is to predict who will succeed in college, a narrow measure may be enough. If the goal is to build a class in which students learn from one another, the calculation changes. A test cannot tell an admissions office whether an applicant will challenge a professor, organize a community or bring an unusual perspective to a seminar. Those qualities matter, but they are expensive to assess and easy to fake.",
      "Test-optional policies have not produced the diversity gains their supporters hoped for. At many institutions, the share of underrepresented students rose only slightly, while applications increased and staff workloads grew. The reason is structural: the students who benefit most from dropping tests are often those who already have the resources to present a strong application in other ways. A policy that changes the weight of one signal does not change the resources behind the others.",
      "None of this means tests should be abandoned or restored wholesale. It means the debate has been framed too narrowly. The question is not whether to use a number, but what else a school knows about an applicant, and whether it has the capacity to weigh that knowledge fairly. Without such capacity, removing a test may simply replace one imperfect signal with a more opaque one."
    ],
    glossary: [
      ["test-optional", "可选提交考试成绩"],
      ["yardstick", "衡量标准"],
      ["underrepresented", "代表性不足的"],
      ["opaque", "不透明的"]
    ],
    questions: [
      {
        stem: "The pandemic is mentioned in Paragraph 1 to illustrate",
        options: [
          "that standardized tests became more accurate.",
          "that universities were pushed to reconsider admissions requirements.",
          "that applications to American universities declined.",
          "that high-school grades became unreliable."
        ],
        answer: 1,
        type: "细节题",
        loc: "第 1 段",
        explain: "疫情使考试难以进行，数百所大学因此 test-optional，并延续下来。这是被迫重新审视招生要求。A、C、D 均无依据。"
      },
      {
        stem: "The author suggests that high-school grades",
        options: [
          "are equally reliable across all schools.",
          "mean different things depending on the school.",
          "predict college success better than any test.",
          "should replace test scores entirely."
        ],
        answer: 1,
        type: "推断题",
        loc: "第 2 段",
        explain: "文中说 grades vary enormously between schools，且严格学校的 B 可能胜过宽松学校的 A，说明成绩的含义因校而异。A 与之相反；C、D 过度推断。"
      },
      {
        stem: "The word yardstick in Paragraph 2 is closest in meaning to",
        options: [
          "a standard for comparison.",
          "a barrier to entry.",
          "a source of inequality.",
          "a form of measurement error."
        ],
        answer: 0,
        type: "词义题",
        loc: "第 2 段",
        explain: "yardstick 原意为“码尺”，此处指衡量标准。前文讨论用考试与成绩预测大学表现，common yardstick 即共同比较尺度。"
      },
      {
        stem: "Test-optional policies produced limited diversity gains because",
        options: [
          "minority students performed poorly on standardized tests.",
          "students with other resources benefit most from dropping test scores.",
          "universities failed to publicize the new policy.",
          "test scores were still required for most applicants."
        ],
        answer: 1,
        type: "推断题",
        loc: "第 4 段",
        explain: "第 4 段指出，从取消考试中受益最多的，往往是已有资源以其他方式呈现强申请的学生；政策改变了一个信号的权重，却没有改变其他信号背后的资源。B 是原文的概括。"
      },
      {
        stem: "The author's main point is that",
        options: [
          "standardized tests should be restored.",
          "admissions should rely on grades alone.",
          "the debate should focus on how schools evaluate applicants, not just on tests.",
          "diversity gains are impossible to achieve."
        ],
        answer: 2,
        type: "主旨题",
        loc: "全文，尤其第 5 段",
        explain: "末段明确说争论框架过窄：问题不是要不要用一个数字，而是学校还了解申请者的什么、是否有能力公平权衡。C 最准确；A、B 与作者折中立场不符；D 过于绝对。"
      }
    ]
  },
  {
    id: 4,
    title: "The Label Doesn't Lie, But It Misleads",
    topic: "环境与消费",
    difficulty: "中等",
    minutes: 17,
    source: "仿真练习",
    paragraphs: [
      "Carbon labels are an attractive idea. Put a number on a product, let consumers compare, and the market will reward cleaner production. The appeal is obvious: information is cheaper than regulation. Several countries have introduced voluntary schemes; a few companies have printed footprints on packaging. Yet the evidence that labels change behaviour is thin, and the reasons are instructive.",
      "The first problem is comprehension. A footprint is usually expressed in grams of carbon dioxide equivalent, a unit that means little to most shoppers. Studies find that people can rank products correctly when the difference is large, but struggle when it is small. Worse, a low number may create a false sense of virtue: a product can be carbon-light and still be produced under poor labour conditions, or shipped thousands of miles.",
      "The second problem is coverage. Most labels measure only a fraction of a product's life cycle. They may count production and transport but ignore land use, waste, or the emissions caused by changing consumption patterns. A label that stops at the factory gate can make the supply chain look cleaner than it is.",
      "The third problem is distribution. Labels are most useful to consumers who already care, and those consumers are not representative. In practice, a label may reassure the worried while leaving the unconcerned untouched. It may also shift responsibility from producers and governments to individuals, who have less power to change systems of production.",
      "This does not make labels useless. They can create pressure on firms, especially when the methodology is public and comparable. But they are a tool, not a policy. If governments want lower emissions, they need prices, standards and investment, not just a small number on a package. A label can start a conversation; it cannot finish one."
    ],
    glossary: [
      ["carbon footprint", "碳足迹"],
      ["life cycle", "生命周期"],
      ["voluntary", "自愿的"],
      ["methodology", "计算方法"]
    ],
    questions: [
      {
        stem: "According to Paragraph 2, shoppers have difficulty with carbon labels because",
        options: [
          "they distrust the companies that print them.",
          "the unit used is hard for most people to understand.",
          "the labels are too expensive to produce.",
          "products cannot be compared with one another."
        ],
        answer: 1,
        type: "细节题",
        loc: "第 2 段",
        explain: "定位 a unit that means little to most shoppers。消费者难以理解克二氧化碳当量这一单位。A 未提；C 说的是标签成本，不是理解成本；D 与“差异大时能正确排序”矛盾。"
      },
      {
        stem: "The example of a carbon-light product made under poor labour conditions is used to show that",
        options: [
          "carbon labels are always inaccurate.",
          "a single metric can hide other important harms.",
          "labour conditions are improving worldwide.",
          "consumers prefer ethically produced goods."
        ],
        answer: 1,
        type: "推断题",
        loc: "第 2 段",
        explain: "低碳产品仍可能涉及恶劣劳动条件或长距离运输，说明单一指标会掩盖其他伤害。A 过于绝对“always”；C、D 无依据。"
      },
      {
        stem: "The phrase stops at the factory gate in Paragraph 3 means that the label",
        options: [
          "excludes stages that occur after production.",
          "is only printed on products made in factories.",
          "is required by factory owners.",
          "measures waste but not transport."
        ],
        answer: 0,
        type: "词义题",
        loc: "第 3 段",
        explain: "工厂大门之后指运输、使用、废弃等生命周期后段。标签只统计生产环节，故“止于厂门”。B、C、D 均曲解。"
      },
      {
        stem: "The author would most likely agree that",
        options: [
          "labels are sufficient if they are well designed.",
          "individual consumers should bear more responsibility.",
          "labels can support but cannot replace regulation.",
          "companies should stop printing carbon footprints."
        ],
        answer: 2,
        type: "推断题",
        loc: "第 5 段",
        explain: "末段说标签是 a tool, not a policy；政府还需要价格、标准与投资。C 正是这一关系。A 与 tool 而非 policy 冲突；B 是作者批评的责任转移；D 与“标签并非无用”相反。"
      },
      {
        stem: "Which of the following best summarizes the text?",
        options: [
          "Carbon labels are ineffective and should be abandoned.",
          "Carbon labels are a useful but limited tool for reducing emissions.",
          "Carbon labels are more effective than carbon taxes.",
          "Consumers are misled mainly by dishonest companies."
        ],
        answer: 1,
        type: "主旨题",
        loc: "全文",
        explain: "文章承认标签的吸引力与作用，同时从理解、覆盖、分布三方面指出局限，结论是工具而非政策。B 最完整；A、C、D 均偏。"
      }
    ]
  },
  {
    id: 5,
    title: "The Repair Shop Next Door",
    topic: "环境与消费",
    difficulty: "中等",
    minutes: 17,
    source: "仿真练习",
    paragraphs: [
      "For decades, the economics of consumer goods pointed in one direction: replace, do not repair. A new phone, kettle or washing machine was often cheaper than fixing the old one. Design reinforced the habit. Cases were sealed, screws were proprietary, and software refused to recognise parts from anyone but the manufacturer. The result was a mountain of electronic waste and a customer who owned a device without truly controlling it.",
      "The right-to-repair movement has tried to change that balance. Its demands are modest: manuals, spare parts and diagnostic tools should be available at fair prices, and devices should be designed so that a careful person can open them. Supporters argue that this is not only an environmental issue but a question of ownership. If you cannot repair what you buy, they say, you have bought a licence to use it for as long as the seller finds convenient.",
      "Manufacturers respond that restrictions protect safety and quality. A battery replaced with a cheap imitation can fail; a poorly sealed device can let in water. These concerns are real, but they are often used to justify restrictions that have little to do with safety. A screen that cannot be replaced without destroying the case is not safer than one that can. Nor is a software lock that prevents an independent shop from pairing a genuine part any safer.",
      "The economics are shifting. Repair creates local jobs that cannot be moved offshore, and it keeps money in the community. It also reduces demand for raw materials and the energy used in manufacturing. Yet repair is still often more expensive than replacement, partly because the price of a new device does not include the cost of its disposal. Governments are beginning to correct this with repair scores, longer warranties and rules on spare parts, but progress is uneven.",
      "The deeper change may be cultural. A generation raised on upgrades has learned to see objects as temporary. Repairing something requires a different relationship with it: attention, patience and a willingness to accept that a thing can be imperfect and still worth keeping. That is not an argument for refusing all new technology. It is an argument for making the choice to repair a real one, rather than a hobby for people with time and tools."
    ],
    glossary: [
      ["proprietary", "专有的"],
      ["diagnostic", "诊断的"],
      ["offshore", "转移到海外"],
      ["disposal", "丢弃；处理"],
      ["warranty", "保修"]
    ],
    questions: [
      {
        stem: "According to Paragraph 1, replacement became the norm partly because",
        options: [
          "repairs were prohibited by law.",
          "consumers preferred foreign brands.",
          "products were designed in ways that made repair difficult.",
          "manufacturers stopped producing spare parts."
        ],
        answer: 2,
        type: "细节题",
        loc: "第 1 段",
        explain: "第 1 段列举 sealed cases、proprietary screws 和软件不识别第三方零件，说明产品设计让维修变难。A、B 无依据；D 原文只说软件拒绝识别其他来源的零件，不等于停产。"
      },
      {
        stem: "The phrase \"a licence to use it\" in Paragraph 2 is used to suggest that",
        options: [
          "devices should be rented rather than bought.",
          "consumers rarely read the terms of sale.",
          "manufacturers charge too little for their products.",
          "repair restrictions raise a question about who really owns a product."
        ],
        answer: 3,
        type: "词义题",
        loc: "第 2 段",
        explain: "前句说 cannot repair what you buy，后句用 licence 作比：不能修，就等于只买到“使用许可”，而不是完整的所有权。A 是曲解；B、C 无依据。"
      },
      {
        stem: "The author's response to manufacturers' safety concerns is that",
        options: [
          "the concerns are real but sometimes used to defend unrelated restrictions.",
          "safety has nothing to do with repair.",
          "cheap batteries are always dangerous.",
          "independent repair shops should be more strictly regulated."
        ],
        answer: 0,
        type: "态度题",
        loc: "第 3 段",
        explain: "作者承认 concerns are real，但紧接着说 often used to justify restrictions that have little to do with safety，并举例说明。B 过于绝对；C、D 均非作者观点。"
      },
      {
        stem: "One reason repair remains expensive, according to Paragraph 4, is that",
        options: [
          "repair shops are taxed more heavily than factories.",
          "spare parts are always imported.",
          "governments refuse to support local business.",
          "the disposal cost of new products is not included in their price."
        ],
        answer: 3,
        type: "细节题",
        loc: "第 4 段",
        explain: "定位 partly because the price of a new device does not include the cost of its disposal。新机价格没有承担废弃成本，维修自然显得贵。A、B、C 均无依据。"
      },
      {
        stem: "The author's attitude toward the right-to-repair movement is best described as",
        options: [
          "hostile and dismissive.",
          "indifferent.",
          "sympathetic but aware of its limits.",
          "uncritically enthusiastic."
        ],
        answer: 2,
        type: "态度题",
        loc: "全文",
        explain: "作者支持维修权，也承认安全、价格与现实障碍，末段强调让“维修”成为真实选择而非少数人的爱好，属于有保留的支持。A、B、D 均过偏。"
      }
    ]
  },
  {
    id: 6,
    title: "The Trouble with Best Practices",
    topic: "管理与教育",
    difficulty: "较难",
    minutes: 18,
    source: "仿真练习",
    paragraphs: [
      "When a school, hospital or company improves its results, others want to know how. The answer often arrives as a list of best practices: the meetings that were held, the software that was bought, the incentives that were introduced. The list is appealing because it is concrete and easy to copy. It is also, in most cases, misleading.",
      "The problem is not that the practices are wrong. It is that they were developed in a particular place, with particular people, at a particular moment. A weekly meeting that works in a small company may fail in a large one where information already travels through five layers of management. A bonus scheme that motivates sales staff may demoralise nurses. What looks like a cause may only be a symptom of a culture that cannot be transplanted by writing it down.",
      "There is also a measurement problem. Successful organisations are often studied after they have succeeded, so researchers see the practices that survived, not the ones that were tried and abandoned. The failures are invisible, and the successes are credited to whatever was most visible at the time. This is a version of survivorship bias: we read the surviving ships and conclude that their design kept them afloat.",
      "None of this means that organisations should ignore others. Ideas travel best when they are treated as questions rather than instructions. Why did this work here? What conditions made it possible? Which parts depend on the people involved, and which can be separated from them? A practice that survives this questioning may still need to be adapted; a practice that does not should be left behind without embarrassment.",
      "The alternative to copying is not isolation. It is a more demanding form of learning: observing carefully, testing small changes, and being honest about what does not transfer. That takes longer than importing a checklist. But it has one advantage that checklists lack: it produces knowledge that belongs to the organisation, rather than a borrowed answer that no one fully understands."
    ],
    glossary: [
      ["incentive", "激励措施"],
      ["demoralise", "使士气低落"],
      ["transplant", "移植"],
      ["survivorship bias", "幸存者偏差"],
      ["checklist", "清单"]
    ],
    questions: [
      {
        stem: "The author says lists of best practices are appealing because they are",
        options: [
          "concrete and easy to imitate.",
          "supported by strong evidence.",
          "inexpensive to implement.",
          "designed by successful leaders."
        ],
        answer: 0,
        type: "细节题",
        loc: "第 1 段",
        explain: "定位 concrete and easy to copy。作者随即转折说 misleading，说明“具体、易复制”正是其吸引力，也是问题所在。B、C、D 均无依据。"
      },
      {
        stem: "The examples of the weekly meeting and the bonus scheme show that",
        options: [
          "meetings and bonuses are usually ineffective.",
          "large companies are less efficient than small ones.",
          "nurses are paid less than sales staff.",
          "the same practice can have different effects in different settings."
        ],
        answer: 3,
        type: "推断题",
        loc: "第 2 段",
        explain: "小公司有效的周会、对销售有效的奖金，换到另一环境可能失效甚至起反作用，说明实践依赖具体条件。A 过于绝对；B、C 均非例子要说明的重点。"
      },
      {
        stem: "The reference to surviving ships is used to explain",
        options: [
          "why successful organisations are studied.",
          "why design matters in organisations.",
          "how failures disappear from the evidence.",
          "how researchers choose their samples."
        ],
        answer: 2,
        type: "目的题",
        loc: "第 3 段",
        explain: "幸存者偏差：只看到活下来的船，就误以为其设计是原因；失败案例消失，成功被归因于当时最显眼的做法。C 最准确。A 是现象，不是引用的目的；B、D 偏离。"
      },
      {
        stem: "According to Paragraph 4, ideas from elsewhere should be treated as",
        options: [
          "instructions to follow exactly.",
          "evidence that cannot be trusted.",
          "replacements for local knowledge.",
          "questions to examine and adapt."
        ],
        answer: 3,
        type: "细节题",
        loc: "第 4 段",
        explain: "定位 Ideas travel best when they are treated as questions rather than instructions，后文连续追问条件与可迁移部分。D 是原文的同义概括。"
      },
      {
        stem: "The author's main point is that",
        options: [
          "organisations should stop learning from one another.",
          "best practices are rarely effective anywhere.",
          "copying practices without understanding context is a poor substitute for learning.",
          "measurement is the only reliable basis for reform."
        ],
        answer: 2,
        type: "主旨题",
        loc: "全文",
        explain: "文章并不否定借鉴，而是否定把做法从语境中抽离、直接复制；末段提出观察、试小步、诚实面对不可迁移之处。C 最完整。A、B、D 均过度或偏窄。"
      }
    ]
  }
];
