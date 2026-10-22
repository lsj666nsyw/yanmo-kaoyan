/* 阅读理解扩充篇目 · Reading 07—12
   文章与题目均为原创仿真材料，参照英语一 Part A 的题型与难度编写 */
(function () {
  const extra = [
    {
      id: 7,
      title: "The Screening Paradox",
      topic: "医疗与公共卫生",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "Screening looks like a straightforward good. A test finds a disease before it causes symptoms, treatment begins earlier, and lives are saved. The logic is so intuitive that questions about screening can sound like doubts about medicine itself. Yet finding a disease earlier is not the same as changing its course. A test can detect something that would never have harmed the person, or detect a real cancer at a point when treatment cannot alter the outcome.",
        "One reason is lead-time bias. If a patient is diagnosed five years earlier but dies at the same age, survival after diagnosis appears five years longer, even though the date of death has not moved. A second problem is length bias: slow-growing tumours spend more time in the detectable stage, so screening is more likely to catch them. Neither bias requires anyone to act dishonestly. The statistics simply answer a narrower question than the one patients think they are asking.",
        "Overdiagnosis is the most uncomfortable problem. Some abnormalities found by screening would never have grown enough to cause symptoms, yet they are labelled cancer and treated. Thyroid screening in some countries produced a sharp rise in diagnoses without a corresponding fall in deaths. Patients underwent surgery and lifelong medication for conditions that might have remained harmless. The harm is not imaginary: it includes complications, anxiety and cost, as well as the opportunity lost when medical resources are directed elsewhere.",
        "None of this means screening is worthless. Some tests, such as those for cervical and colorectal cancer, have been shown in trials to reduce deaths. The difference is evidence. A screening programme should be judged by whether it improves outcomes that matter, not by how many abnormalities it finds. That standard is often missing from advertising, which celebrates detection as if it were a cure.",
        "The goal is not less screening, but better screening: tests that have been shown to help, communication that explains the trade-offs, and the honesty to admit when the evidence is uncertain. Patients deserve to know not only what a test can find, but what finding it is likely to change. That is a harder conversation than a slogan, and a more useful one."
      ],
      glossary: [
        ["screening", "筛查"],
        ["lead-time bias", "领先时间偏倚"],
        ["overdiagnosis", "过度诊断"],
        ["cervical", "宫颈的"],
        ["colorectal", "结直肠的"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, the author's concern about screening is that",
          options: [
            "it detects diseases too late to treat them.",
            "early detection may not change the course of a disease.",
            "it is too expensive for most patients.",
            "doctors are unwilling to treat early disease."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 Yet finding a disease earlier is not the same as changing its course。更早发现不等于改变疾病进程。A 与 early 相反；C、D 均无依据。"
        },
        {
          stem: "The phrase \"lead-time bias\" in Paragraph 2 refers to",
          options: [
            "the tendency to diagnose slow-growing tumours.",
            "an apparent survival gain created by earlier diagnosis.",
            "the influence of patient age on screening.",
            "a statistical error caused by small samples."
          ],
          answer: 1,
          type: "词义题",
          loc: "第 2 段",
          explain: "提前五年诊断、死亡年龄不变，诊断后的生存期看起来延长了五年，这正是领先时间偏倚。A 是 length bias；C、D 无依据。"
        },
        {
          stem: "The rise in thyroid diagnoses without a fall in deaths suggests that",
          options: [
            "thyroid cancer is becoming more aggressive.",
            "some detected cases would never have caused harm.",
            "surgery is ineffective for all thyroid cancer.",
            "screening should be banned for every disease."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "诊断数量上升、死亡人数未相应下降，说明检出者中包含不会致病的病例，即过度诊断。A、C、D 均过度推断。"
        },
        {
          stem: "According to Paragraph 4, a screening programme should be judged by",
          options: [
            "how many abnormalities it finds.",
            "whether it reduces deaths in trials.",
            "how much advertising it attracts.",
            "whether it is available in every country."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 improves outcomes that matter, not by how many abnormalities it finds；宫颈癌与结直肠癌筛查因试验显示降低死亡而被肯定。A 是作者反对的标准；C、D 无依据。"
        },
        {
          stem: "Which of the following best states the main idea of the text?",
          options: [
            "Screening is a waste of medical resources.",
            "Screening should be evaluated by outcomes and explained honestly.",
            "Earlier diagnosis always extends life.",
            "Only wealthy countries can afford screening."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "文章既承认有效筛查，也指出过度诊断与统计错觉，末段主张更好的筛查、解释利弊并承认不确定性。B 最完整；A、C、D 均偏。"
        }
      ]
    },
    {
      id: 8,
      title: "The Algorithmic Boss",
      topic: "科技与劳动",
      difficulty: "较难",
      minutes: 18,
      source: "仿真练习",
      paragraphs: [
        "Algorithmic management is often described in the language of neutrality. A platform assigns jobs, sets deadlines and scores performance according to rules that are applied to everyone. There is no favouritism, no bad mood, no manager who promotes a friend. The appeal is easy to understand, especially for companies that operate across cities and time zones. But a rule is not neutral simply because a machine applies it. Someone chose what to measure, how to weight it and what counts as failure.",
        "Consider the metrics themselves. A delivery company may reward speed, punctuality and customer ratings. Each is a real part of the job, but together they push workers to skip breaks, accept unsafe routes or plead with customers for a five-star score. The measure becomes the job. Workers learn to optimise the number rather than the service it was meant to represent, a pattern familiar from schools that teach to the test.",
        "Opacity is a second problem. A worker who is suspended or demoted may be told that an automated system made the decision, without being shown the evidence or the rule that was applied. Appeals exist, but they are often slow and handled by people with little power to reverse the outcome. The asymmetry is stark: the platform can observe every stop and keystroke, while the worker cannot see the model that judges them.",
        "Some platforms have responded with clearer rules and human review. These reforms matter, but they face a structural limit. Any rule detailed enough to be fair can be gamed; any rule vague enough to be flexible can hide bias. The answer is not a perfect algorithm but a system of accountability: published criteria, independent appeal, and a human who can override the score. Workers also need a voice in setting the measures, because those who are measured rarely choose what counts.",
        "The promise of algorithmic management is that it can make work fairer and more predictable. That promise is worth taking seriously. But it will not be realised by pretending that numbers are neutral. It will be realised by asking who chose the numbers, who can challenge them, and who bears the cost when they are wrong."
      ],
      glossary: [
        ["algorithmic management", "算法管理"],
        ["metric", "衡量指标"],
        ["opacity", "不透明"],
        ["override", "推翻；覆盖"],
        ["accountability", "问责"]
      ],
      questions: [
        {
          stem: "Paragraph 1 suggests that algorithmic management may appear neutral because",
          options: [
            "it is designed by workers themselves.",
            "the same rules are applied to everyone.",
            "it avoids measuring individual performance.",
            "it is used only by small companies."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 rules that are applied to everyone，以及 no favouritism、no bad mood。作者随即反驳：有人选择了衡量什么、如何加权。A、C、D 与文意不符。"
        },
        {
          stem: "The delivery example in Paragraph 2 shows that performance metrics can",
          options: [
            "make customers more polite.",
            "encourage workers to optimise the number rather than the service.",
            "reduce the need for safety rules.",
            "make delivery work more predictable."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "速度、准时率和评分共同把工人推向跳过休息、走危险路线、向顾客索要五星；定位 The measure becomes the job... optimise the number rather than the service。A、C、D 均无依据。"
        },
        {
          stem: "The word \"opacity\" in Paragraph 3 most nearly means",
          options: [
            "lack of transparency.",
            "speed of decision-making.",
            "fairness of a rule.",
            "use of human reviewers."
          ],
          answer: 0,
          type: "词义题",
          loc: "第 3 段",
          explain: "后文说工人看不到证据或规则，平台却能看到工人的每一次停留和敲击；这种信息不对等就是不透明。B、C、D 与语境不符。"
        },
        {
          stem: "According to Paragraph 4, reforms to algorithmic management should include",
          options: [
            "a more detailed algorithm that cannot be gamed.",
            "published criteria, independent appeal and human override.",
            "the removal of all performance metrics.",
            "decisions made only by workers."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 4 段",
          explain: "定位 published criteria, independent appeal, and a human who can override the score。作者明确说没有完美算法，任何规则都可能被规避或藏偏见。A 与文意矛盾；C、D 过度。"
        },
        {
          stem: "The author's main point is that algorithmic management",
          options: [
            "is always fairer than human managers.",
            "needs accountability and worker voice, not just efficiency.",
            "should be abolished in delivery work.",
            "cannot measure anything useful."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "文章承认算法管理可能带来公平与可预测性，但强调指标是人为选择，必须公开标准、允许申诉、保留人工推翻，并让工人参与设定指标。B 最完整；A、C、D 均偏。"
        }
      ]
    },
    {
      id: 9,
      title: "The Road That Fills Itself",
      topic: "城市与交通",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "When a city is congested, the obvious solution is to build more road. The image is intuitive: traffic is water, the road is a pipe, and a wider pipe should carry more water. For decades, transport planners followed this logic. They widened motorways, added lanes and built bypasses, expecting journey times to fall. Sometimes they did, for a while.",
        "The improvement often disappears. New capacity lowers the cost of driving, in time and fuel, and encourages people to make trips they had previously avoided, move farther from work, or abandon public transport. Within a few years, traffic can return to its previous level. Transport economists call this induced demand. The road did not create new drivers out of nothing; it changed the choices that existing drivers faced.",
        "Induced demand is not a curiosity. Studies of motorway expansions in several countries have found that vehicle miles rise roughly in proportion to new lane miles, especially in growing regions. The result is a planning trap: each expansion looks justified by the congestion that the last one helped create. The costs, meanwhile, are paid in land, public money and emissions, and they are rarely counted in the same ledger.",
        "Alternatives exist, but they are politically harder. Charging drivers for road space at busy times can reduce congestion, but the word tax provokes resistance. Investment in buses, trains and safe cycling can give people real choices, but only if services are frequent and housing is planned around them. Land-use rules matter too: a city that requires every new development to include parking is quietly deciding that driving will remain the default.",
        "None of this means roads should never be built. A new bridge can connect a severed neighbourhood; a rural road can reach a hospital. The question is what a road is for, and whether it is the cheapest way to achieve that purpose. Measuring lane miles is easy. Measuring access, safety and the health of a city is harder, but it is the only measurement that tells us whether the road actually helped."
      ],
      glossary: [
        ["congested", "拥堵的"],
        ["bypass", "绕行道路"],
        ["induced demand", "诱发需求"],
        ["lane mile", "车道英里"],
        ["default", "默认选项"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, transport planners widened roads because they expected",
          options: [
            "journey times to fall.",
            "public transport to disappear.",
            "emissions to rise.",
            "housing to become cheaper."
          ],
          answer: 0,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 expecting journey times to fall。后文说有时确实下降，但只维持一段时间。B、C、D 均无依据。"
        },
        {
          stem: "The term \"induced demand\" in Paragraph 2 refers to",
          options: [
            "traffic created by new road capacity.",
            "demand for public transport.",
            "a shortage of parking spaces.",
            "a decline in fuel prices."
          ],
          answer: 0,
          type: "词义题",
          loc: "第 2 段",
          explain: "新容量降低驾驶成本，鼓励更多出行、住得更远或放弃公交，交通回到原水平。这种由扩容诱发的交通需求即 induced demand。B、C、D 均非定义。"
        },
        {
          stem: "The \"planning trap\" in Paragraph 3 refers to the fact that",
          options: [
            "road expansions are always cheap.",
            "each expansion can be justified by congestion the previous one helped create.",
            "drivers refuse to use new lanes.",
            "public transport is always faster."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "定位 each expansion looks justified by the congestion that the last one helped create。扩建制造拥堵，拥堵又成为下一次扩建的理由。A、C、D 无依据。"
        },
        {
          stem: "According to Paragraph 4, requiring new developments to include parking",
          options: [
            "reduces the number of cars.",
            "makes driving the default choice.",
            "improves bus frequency.",
            "lowers housing costs."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 quietly deciding that driving will remain the default。配建停车位把开车设为默认选项。A 相反；C、D 无依据。"
        },
        {
          stem: "The author's main point is that cities should",
          options: [
            "stop building any new roads.",
            "measure access and safety rather than lane miles.",
            "ban cars from all city centres.",
            "rely only on congestion charging."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "文章不否定道路本身，而是否定以车道里程为目标；末段主张衡量可达性、安全与城市健康。A、C、D 均过度。"
        }
      ]
    },
    {
      id: 10,
      title: "The News Desert",
      topic: "媒体与社会",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "Local newspapers are closing at a rate that rarely makes national headlines. The loss is easy to miss because national and international news has never been more available. But a city without a local newsroom is not simply a city with less news. It is a city where fewer people attend council meetings, fewer contracts are scrutinised, and fewer officials are asked to explain a decision that affects daily life.",
        "Researchers call such places news deserts. The term suggests a natural shortage, but the causes are economic. Local papers depended on classified advertising, which moved online; their fixed costs remained; and their audiences, though loyal, were too small to support the reporting that accountability requires. A market can produce plenty of national opinion and very little information about the zoning meeting down the street.",
        "The consequences are measurable. Studies in several countries have linked the closure of local papers to lower voter turnout, less competitive local elections, higher borrowing costs for municipalities and more waste in public spending. The mechanisms are ordinary: someone has to read the budget, attend the meeting and ask why the contract went to that company. When no one does, the cost is not always visible, but it is real.",
        "Philanthropy and public funding are now keeping some newsrooms alive. Both bring risks. Donors may have causes; governments may dislike scrutiny. The design of the funding matters as much as its size: endowments, small-donor memberships and rules that protect editorial independence can help, while a single powerful backer can turn a newspaper into a newsletter.",
        "It is tempting to treat local news as a business that failed. But a market failure is not the same as a service that no one values. Local news produces something that is hard to sell and easy to take for granted: the daily record of how a place is governed. A democracy can survive without a newspaper, but it cannot easily survive without anyone watching."
      ],
      glossary: [
        ["news desert", "新闻荒漠"],
        ["scrutinise", "仔细审查"],
        ["classified advertising", "分类广告"],
        ["endowment", "捐赠基金"],
        ["editorial independence", "编辑独立性"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, the loss of local newspapers is easy to miss because",
          options: [
            "national and international news remains abundant.",
            "local papers never covered politics.",
            "few people read newspapers anywhere.",
            "closures are always reported nationally."
          ],
          answer: 0,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 national and international news has never been more available。全国与国际新闻充足，掩盖了地方新闻室的消失。B、C、D 均无依据。"
        },
        {
          stem: "The term \"news deserts\" in Paragraph 2 suggests",
          options: [
            "areas with an abundance of local reporting.",
            "places lacking reliable local news.",
            "regions where newspapers are banned.",
            "markets with too many reporters."
          ],
          answer: 1,
          type: "词义题",
          loc: "第 2 段",
          explain: "desert 在此是比喻，指地方新闻的匮乏；后文说市场能产出全国观点，却几乎没有关于街区规划会议的信息。A、C、D 均相反或无据。"
        },
        {
          stem: "Paragraph 3 suggests that local news supports accountability by",
          options: [
            "increasing advertising revenue.",
            "having someone read budgets and attend meetings.",
            "endorsing candidates in local elections.",
            "replacing local government."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "定位 someone has to read the budget, attend the meeting and ask why the contract went to that company。地方新闻的作用是持续监督，而不是直接治理。A、C、D 均偏。"
        },
        {
          stem: "According to Paragraph 4, the design of funding for local news matters because",
          options: [
            "it determines whether newsrooms can be profitable.",
            "a single powerful backer can undermine independence.",
            "donors always support government policy.",
            "public funding is illegal in most countries."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 a single powerful backer can turn a newspaper into a newsletter；因此基金设计要保护编辑独立。A 不是重点；C、D 无依据。"
        },
        {
          stem: "The author's main point is that local news",
          options: [
            "is a failed business that should be abandoned.",
            "is civic infrastructure whose funding must protect independence.",
            "should be owned entirely by government.",
            "is less important than national news."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "文章把地方新闻称为“地方如何被治理的日常记录”，强调市场失灵不等于无人需要，并讨论资助方式与独立性。B 最完整；A、C、D 均偏。"
        }
      ]
    },
    {
      id: 11,
      title: "The Museum of Everything",
      topic: "文化与历史",
      difficulty: "较难",
      minutes: 18,
      source: "仿真练习",
      paragraphs: [
        "The universal museum is built on a noble idea: that objects from every culture should be visible to everyone. A visitor in London or Berlin can compare a Greek vase, a Benin bronze and a Chinese scroll without leaving the building. Defenders argue that this juxtaposition produces a kind of understanding that no single national collection can offer. Critics reply that the collection itself was made possible by conquest, and that the story of how an object arrived is part of what it means.",
        "The debate is often framed as a choice between keeping objects and returning them. That framing is misleading. Repatriation does not always mean a gallery emptied; it can mean a loan, a shared catalogue, a joint exhibition or a transfer to a museum with better conditions. What matters is who has the power to decide, and whether the source community is treated as a partner rather than an audience.",
        "Ownership is also legally messy. Some objects were taken in war; others were bought, donated or exported under laws that would not be accepted today. A blanket rule would be unjust in one direction or the other. Case-by-case judgment is slower and less satisfying, but it is more honest than pretending that every acquisition has the same history.",
        "Museums have legitimate fears: that a returned object will be sold, damaged or hidden from public view. These fears are not imaginary, but they are often used to avoid any transfer of control. Partnerships can address them through agreements on display, care and long-term loans. What they cannot do is preserve the fiction that the museum is the only responsible owner.",
        "The deeper question is what a museum is for. If it is a warehouse of treasures, possession is the goal. If it is a place where cultures explain themselves to one another, then the goal is a relationship, and relationships require negotiation. The museum of the future may hold fewer objects and tell more complicated stories. That would not be a loss of authority. It would be a more honest form of it."
      ],
      glossary: [
        ["universal museum", "综合性博物馆"],
        ["juxtaposition", "并置"],
        ["repatriation", "文物归还"],
        ["acquisition", "获取；藏品"],
        ["stewardship", "管理责任"]
      ],
      questions: [
        {
          stem: "Defenders of universal museums argue that such collections",
          options: [
            "allow visitors to compare objects from different cultures.",
            "return objects to their source communities.",
            "are always acquired legally.",
            "are smaller than national collections."
          ],
          answer: 0,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 this juxtaposition produces a kind of understanding；并置不同文化的藏品能产生独特理解。B 是批评者诉求；C、D 无依据。"
        },
        {
          stem: "Paragraph 2 suggests that repatriation",
          options: [
            "always empties a museum.",
            "can take forms such as loans and shared exhibitions.",
            "is opposed by all source communities.",
            "is only a question of money."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "定位 can mean a loan, a shared catalogue, a joint exhibition or a transfer。作者说“保留还是归还”的二分法具有误导性。A 与 not always 矛盾；C、D 无据。"
        },
        {
          stem: "The author's attitude toward blanket rules on repatriation is",
          options: [
            "supportive.",
            "critical, because acquisitions have different histories.",
            "indifferent.",
            "confident that all objects should stay."
          ],
          answer: 1,
          type: "态度题",
          loc: "第 3 段",
          explain: "定位 A blanket rule would be unjust in one direction or the other；文物来源不同，应逐案判断。A 相反；C、D 无据。"
        },
        {
          stem: "According to Paragraph 4, partnerships can address museums' fears by",
          options: [
            "preventing any object from being returned.",
            "agreeing on display, care and long-term loans.",
            "transferring all authority to donors.",
            "removing source communities from decisions."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 agreements on display, care and long-term loans。合作可以回应展示、保管与出借的担忧，但不能维持“博物馆是唯一负责所有者”的虚构。A、C、D 相反。"
        },
        {
          stem: "The author's main point is that museums should",
          options: [
            "keep all objects to preserve universal access.",
            "share stewardship and negotiate with source communities.",
            "sell their collections to fund new buildings.",
            "stop displaying objects from other cultures."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "文章主张博物馆的目标是文化之间的关系，关系需要协商；未来可能藏品更少、故事更复杂。B 最完整；A、C、D 均偏。"
        }
      ]
    },
    {
      id: 12,
      title: "The Cost of Doing Nothing",
      topic: "经济与公共政策",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "Governments are good at paying for emergencies. When a bridge collapses or a hospital runs out of beds, money appears, often within days. Prevention is harder to sell. A programme that repairs bridges before they fail produces no dramatic photograph, and its success is measured by something that did not happen. In budget negotiations, the invisible is easy to cut.",
        "Economists have a name for the other side of the ledger: the cost of doing nothing. Deferred maintenance on roads, water systems and public buildings accumulates, but it does not appear as a single line in the budget. It appears later as emergencies, higher repair bills and lost services. A school that postpones roof repairs may save money this year and spend far more in five.",
        "Political incentives reinforce the pattern. A new building can be opened with a ribbon; a maintenance programme cannot. Election cycles reward visible spending and punish taxes, even when the tax would prevent a larger cost later. The result is a bias toward the urgent over the important, which is not a failure of individual intelligence but a feature of the system.",
        "Some governments are trying to change the calculation. They publish long-term infrastructure accounts, require maintenance budgets to be separated from new construction, and report the avoided costs of preventive health programmes. These tools do not remove the political difficulty, but they make the invisible visible. A number in a public account can be argued about; a cost that no one counts cannot.",
        "The lesson is not that governments should stop responding to emergencies. It is that a society's competence is revealed less by how it handles a crisis than by how many crises it prevents. That requires a different kind of accounting, and a different kind of politics: one that gives credit for the disaster that did not happen."
      ],
      glossary: [
        ["deferred maintenance", "延期维护"],
        ["ledger", "账本"],
        ["infrastructure", "基础设施"],
        ["avoided cost", "避免的成本"],
        ["competence", "能力；胜任"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, prevention is hard to sell because",
          options: [
            "it produces no dramatic crisis or photograph.",
            "it is always more expensive than emergencies.",
            "governments do not know how to repair bridges.",
            "voters oppose all public spending."
          ],
          answer: 0,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 success is measured by something that did not happen，且预防没有戏剧性的照片。B 与预防可省钱相反；C、D 过度。"
        },
        {
          stem: "The word \"deferred\" in Paragraph 2 most nearly means",
          options: [
            "postponed.",
            "reduced.",
            "completed.",
            "shared."
          ],
          answer: 0,
          type: "词义题",
          loc: "第 2 段",
          explain: "deferred maintenance 指被推迟的维护；后文说它会以紧急事故、更高维修账单的形式出现。A 最准确。B、C、D 与语境不符。"
        },
        {
          stem: "Paragraph 3 suggests that political incentives",
          options: [
            "reward long-term maintenance.",
            "favor visible projects over invisible prevention.",
            "make elections unnecessary.",
            "reduce the cost of new buildings."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "剪彩的新楼可见，维护计划不可见；选举周期奖励可见支出、惩罚税收。定位 a bias toward the urgent over the important。A 相反；C、D 无据。"
        },
        {
          stem: "According to Paragraph 4, long-term infrastructure accounts help by",
          options: [
            "eliminating political disagreement.",
            "making invisible costs visible.",
            "replacing maintenance with new construction.",
            "reducing the number of elections."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 they make the invisible visible；公开账目让原本无人计算的成本进入争论。A、C、D 均过度或无据。"
        },
        {
          stem: "The author's main point is that governments should",
          options: [
            "respond only to emergencies.",
            "count and credit prevention, not just crisis spending.",
            "stop publishing infrastructure accounts.",
            "avoid all long-term investment."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "末段说社会的能力更多体现在预防了多少危机，而非如何处理危机；需要不同的会计与政治，为“没有发生的灾难”记功。B 最完整。"
        }
      ]
    },
    {
      id: 13,
      title: "The Illusion of Fluency",
      topic: "教育与学习科学",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "Students often judge their own learning by how familiar a page feels. After rereading a chapter twice, the material seems smooth and the student concludes that it has been learned. In experiments, however, rereading produces modest gains that fade within days, while the confidence it creates lasts much longer. The problem is not laziness but a misreading of a signal: fluency is a feeling of ease, and ease is not the same as memory.",
        "A series of classroom studies illustrates the gap. In one, students read a passage once, twice, or four times and then took a test either immediately or a week later. More rereading improved performance on the immediate test, but the advantage nearly disappeared after a week. In another study, students who were told to expect a test studied differently from those who were not, spending less time on what they already understood — and remembered more.",
        "Retrieval practice works in the opposite direction. Testing oneself on material, even when the answers are wrong, forces the memory to be reconstructed, and each reconstruction strengthens it. Low-stakes quizzes, flashcards and closed-book summaries are all forms of retrieval. They feel harder than rereading, and that difficulty is part of the mechanism: the effort of pulling information out of memory is what makes later recall more reliable. Students who do not know this may abandon the methods that work in favour of the ones that feel better.",
        "Spacing adds a second layer. Reviewing material after a delay — rather than in a single long session — produces better long-term retention, even though it feels less productive at the time. Interleaving, or mixing different types of problems in one practice session, has a similar profile: it depresses practice scores and raises later performance. All three techniques, retrieval, spacing and interleaving, share one feature: they trade immediate comfort for durable learning.",
        "The practical lesson is not that rereading is worthless, but that it cannot be the main method, and that feelings of fluency should never be the final evidence that learning has happened. Teachers can help by testing more often and grading less, and by warning students about the confidence trap. The most honest measure of study remains what can be recalled tomorrow, with the book closed."
      ],
      glossary: [
        ["fluency", "流畅感；顺畅感"],
        ["retrieval practice", "提取练习"],
        ["spacing", "间隔复习"],
        ["interleaving", "交错练习"],
        ["low-stakes", "低利害的"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, rereading often leaves students with",
          options: [
            "a lasting improvement in memory.",
            "confidence that outlasts its actual benefit.",
            "a clearer sense of what they have not learned.",
            "an inability to judge difficulty at all."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 rereading produces modest gains that fade within days, while the confidence it creates lasts much longer：收益短暂，信心却持久。A 与原文相反；C、D 无依据。"
        },
        {
          stem: "The classroom studies mentioned in Paragraph 2 suggest that",
          options: [
            "rereading four times is always the best method.",
            "tests taken immediately can overstate the value of rereading.",
            "students dislike being tested.",
            "expecting a test harms performance."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "定位 More rereading improved performance on the immediate test, but the advantage nearly disappeared after a week：即时测试会高估重读的价值。A 绝对化；C、D 与原文相反。"
        },
        {
          stem: "The sentence \"that difficulty is part of the mechanism\" (Paragraph 3) means that the effort involved",
          options: [
            "should be avoided by beginners.",
            "proves the material is too hard.",
            "is what makes retrieval effective.",
            "can be removed by using flashcards."
          ],
          answer: 2,
          type: "词义题",
          loc: "第 3 段",
          explain: "定位 the effort of pulling information out of memory is what makes later recall more reliable：费力本身是机制的一部分，不是副作用。A、B、D 均曲解原文。"
        },
        {
          stem: "According to Paragraph 4, interleaving practice tends to",
          options: [
            "improve practice scores immediately.",
            "work only for young learners.",
            "replace the need for spacing.",
            "lower practice results while improving later performance."
          ],
          answer: 3,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 it depresses practice scores and raises later performance：练习时分数被压低，之后表现提高。A 相反；B、C 无依据。"
        },
        {
          stem: "Which of the following best states the main idea of the text?",
          options: [
            "Rereading should be abandoned completely.",
            "Fluency is a reliable sign that learning has happened.",
            "Study methods should be judged by long-term recall rather than by feelings of ease.",
            "Testing is only a way to measure learning, not to promote it."
          ],
          answer: 2,
          type: "主旨题",
          loc: "全文",
          explain: "全文对比重读与提取练习、间隔、交错，强调用“合上书明天还能回忆什么”衡量学习。A 过度；B 与原文相反；D 与文中“测试能强化记忆”相反。"
        }
      ]
    },
    {
      id: 14,
      title: "The Vanishing Night",
      topic: "环境与生态",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "For most of human history, night was genuinely dark, and the species that evolved under it still depend on that darkness. Artificial light has spread so widely that a majority of the world's population can no longer see the Milky Way. The change is rarely treated as an environmental problem, because light is associated with safety and progress. But a growing body of research suggests that excess light at night reshapes ecosystems in ways that are expensive to reverse.",
        "Insects offer the clearest example. Many species navigate by the moon and stars, and artificial lights draw them off course. A moth that circles a lamp all night may burn energy it needed for migration or reproduction; some die of exhaustion. Studies in several regions have found that streetlights reduce the local abundance of moths and other insects, with effects that carry into the food web, since birds, bats and fish feed on them. Light does not kill a habitat outright; it quietly changes who lives in it.",
        "Other victims are easier to overlook. Migrating birds often travel at night and use the sky as a compass; lit skyscrapers and towers disorient them, leading to collisions. Hatchling sea turtles move toward the brightest horizon, which for millions of years has meant the ocean — and now often means a promenade or a car park. Even plants are affected: trees near street lamps may keep their leaves longer in autumn and be more exposed to frost.",
        "The problem is not light itself but light at the wrong time, in the wrong place, in the wrong amount. Unlike many pollutants, light disappears the moment a switch is turned off, which makes it one of the most reversible environmental problems available. Cities that have changed their lighting have seen results quickly. Warm-coloured, shielded lamps that point downward reduce skyglow; motion sensors prevent car parks from glowing all night; and simple timers enforce darkness when nobody is present.",
        "None of this requires going back to candles. It requires acknowledging that darkness has functions, and that the benefits of light can usually be kept while its costs are cut. The night sky is not a luxury that belongs to astronomers. It is the environment in which a large part of the living world, including the human body, has always operated."
      ],
      glossary: [
        ["skyglow", "天空辉光"],
        ["hatchling", "刚孵化的幼体"],
        ["food web", "食物网"],
        ["promenade", "海滨步道"],
        ["migrate", "迁徙"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, light at night is seldom treated as an environmental problem because",
          options: [
            "its effects are limited to birds.",
            "it is linked with safety and progress.",
            "it can no longer be measured.",
            "astronomers are not persuasive."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 because light is associated with safety and progress：光被与安全和进步联系在一起，所以不被当作污染。A、C、D 均无依据。"
        },
        {
          stem: "The example of moths in Paragraph 2 suggests that artificial light",
          options: [
            "attracts insects only in spring.",
            "affects food chains, not just individual insects.",
            "is the main cause of all insect loss.",
            "helps birds and bats find food."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "定位 with effects that carry into the food web, since birds, bats and fish feed on them：影响沿食物链传导。A 无依据；C 绝对化；D 曲解——这些动物以蛾为食，蛾受光害会波及它们。"
        },
        {
          stem: "The examples in Paragraph 3 suggest that light pollution",
          options: [
            "affects only coastal species.",
            "disturbs the natural behaviour of species in different habitats.",
            "is most serious for plants.",
            "has already been fully researched."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "段内并列鸟类（导航）、海龟（寻海）、植物（落叶期）三例，共同点是干扰不同栖息地物种的自然行为。A、C 以偏概全；D 无依据。"
        },
        {
          stem: "Paragraph 4 states that one advantage of light pollution is that",
          options: [
            "it can be reversed almost immediately.",
            "it costs nothing to fix.",
            "it affects only cities.",
            "it has no effect on wildlife."
          ],
          answer: 0,
          type: "细节题",
          loc: "第 4 段",
          explain: "定位 light disappears the moment a switch is turned off, which makes it one of the most reversible environmental problems available：一关灯即消失，可逆性极强。B、C、D 均无依据或与原文相反。"
        },
        {
          stem: "Which of the following best states the main idea of the text?",
          options: [
            "Artificial light should be banned in cities.",
            "Night lighting has hidden ecological costs that can be reduced without giving up light.",
            "Migrating birds are the most important victims of light pollution.",
            "Darkness is healthier for humans but harmful to wildlife."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "全文从昆虫、鸟类、海龟、植物讲到“问题在于错误的时间、地点与亮度”，主张保留光的好处、削减代价。A 过度；C 只是例证之一；D 与原文相反。"
        }
      ]
    },
    {
      id: 15,
      title: "The Four-Day Experiment",
      topic: "劳动与经济",
      difficulty: "较难",
      minutes: 18,
      source: "仿真练习",
      paragraphs: [
        "When a British research group reported that most companies in a four-day week trial decided to keep the schedule, the headlines wrote themselves. Employees reported lower stress and better sleep; revenue at participating firms changed little; most of the firms stayed with the shorter week after the trial ended. For advocates, the case seemed closed. For anyone who has followed workplace reform, however, the interesting questions begin exactly where the headlines stop.",
        "The first question concerns who took part. Firms volunteer for such trials, and the ones that volunteer tend to be small, service-based and already interested in change. A marketing agency can restructure meetings and focus time more easily than a hospital, a factory or a delivery network, where output is tied to hours of coverage. When commentators generalize from the trial to the whole economy, they are stretching evidence from one kind of workplace to another.",
        "The second question is what happened to the fifth day. In many cases, the work did not disappear; it was compressed. Meetings were shortened, software and processes improved, and some employees worked longer days. The trial is best understood not as proof that a day can be removed for free, but as evidence that many organizations are inefficient enough to give back a day and still function. That is a promising but conditional finding.",
        "None of this dims the results, which were real, especially for individual well-being. The design was careful: pay was unchanged, and researchers measured outcomes rather than relying on enthusiasm. But a trial that lasts six months cannot show whether the gains hold over years, whether ambitious staff leave for firms where promotion is faster, or whether the model survives a recession, when companies cut whatever looks optional.",
        "The four-day week is therefore best treated as a serious hypothesis rather than a settled conclusion. It seems to work where work is measured by tasks completed rather than hours covered, and where managers are willing to remove rather than redistribute waste. Whether it can travel beyond that terrain is not a matter of belief. It is a question that more careful, more varied trials might answer."
      ],
      glossary: [
        ["revenue", "营收"],
        ["trial", "试验"],
        ["compressed", "被压缩的"],
        ["recession", "经济衰退"],
        ["hypothesis", "假设"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, in the British trial",
          options: [
            "revenue at most firms fell sharply.",
            "most firms chose to keep the shorter week.",
            "employees asked to return to five days.",
            "stress levels were not measured."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 most companies ... decided to keep the schedule 以及 most of the firms stayed with the shorter week after the trial ended。A 与 revenue changed little 相反；C、D 无依据。"
        },
        {
          stem: "The author's attitude toward generalizing the trial results to the whole economy is",
          options: [
            "enthusiastic.",
            "cautious.",
            "indifferent.",
            "hostile."
          ],
          answer: 1,
          type: "态度题",
          loc: "第 2 段",
          explain: "定位 they are stretching evidence from one kind of workplace to another：作者指出样本自选、行业差异，态度是谨慎（cautious），而非敌视或无所谓。"
        },
        {
          stem: "The sentence \"the work did not disappear; it was compressed\" (Paragraph 3) means that",
          options: [
            "employees completed fewer tasks.",
            "the same work was fitted into fewer days.",
            "companies hired more staff.",
            "the fifth day was paid as overtime."
          ],
          answer: 1,
          type: "词义题",
          loc: "第 3 段",
          explain: "定位 Meetings were shortened, software and processes improved, and some employees worked longer days：工作量未消失，而是被压缩进四天。A 与事实相反；C、D 无依据。"
        },
        {
          stem: "Paragraph 4 suggests that the trials cannot show whether",
          options: [
            "employees enjoyed the extra day.",
            "the model survives harder times.",
            "pay remained unchanged.",
            "researchers measured outcomes."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 4 段",
          explain: "定位 whether the model survives a recession, when companies cut whatever looks optional。A、C、D 都是试验已确认的事实，未回答的问题是长期与逆境表现。"
        },
        {
          stem: "Which of the following best states the main idea of the text?",
          options: [
            "The four-day week has been proven to work everywhere.",
            "The four-day week is a promising but conditional reform whose evidence is limited.",
            "Shorter weeks reduce revenue and should be rejected.",
            "Only factories can adopt a four-day week."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "全文肯定试验结果，同时指出样本、行业限制与时间跨度问题，主张将其视为严肃假设。A 过度；C、D 与原文不符。"
        }
      ]
    },
    {
      id: 16,
      title: "The Password Problem",
      topic: "技术与安全",
      difficulty: "中等",
      minutes: 16,
      source: "仿真练习",
      paragraphs: [
        "Passwords were a reasonable solution to a small problem: a handful of users, a handful of machines, no network. They have survived into an era for which they were never designed. The average internet user now manages dozens of accounts, and the rules imposed by different services pull in opposite directions — one demands a symbol, another forbids it; one expires passwords monthly, another forbids reuse of the last five.",
        "Human memory being what it is, people respond rationally. They reuse a few passwords, vary them slightly, or store them in a note. Each shortcut is criticized as carelessness, yet the underlying problem is a mismatch: systems ask users to remember secrets that are long, unique and constantly changing, three requirements that human memory cannot meet at once. Security advice that ignores this mismatch produces what researchers call security theatre — rules that feel protective and change little.",
        "The consequences are unevenly distributed. Attackers rarely guess passwords one by one. They take lists of credentials leaked from one service and try them on others, a technique known as credential stuffing, which works precisely because people reuse. A single breach at a small forum can therefore open a bank account, an email inbox and a work account, none of which the user thinks of as connected.",
        "A newer approach removes the secret from the user's head. Passkeys store a cryptographic key on a device, unlocked by a fingerprint or a face, and never send the secret across the network; there is nothing for a phishing page to steal. Early results are encouraging, but adoption faces a familiar obstacle: the system works best when every service supports it, and users must still trust that losing a phone will not mean losing every account.",
        "The lesson is not that users should try harder. It is that a security system which depends on perfect human behaviour will fail at human scale. The most useful reforms so far have reduced what users must remember, made the safe option the default, and accepted that convenience and safety are not enemies but conditions for each other."
      ],
      glossary: [
        ["credential", "登录凭证"],
        ["credential stuffing", "撞库攻击"],
        ["passkey", "通行密钥"],
        ["phishing", "网络钓鱼"],
        ["cryptographic", "加密的"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, the rules imposed by different services",
          options: [
            "are identical across platforms.",
            "often contradict one another.",
            "have become simpler over time.",
            "were designed for modern networks."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "定位 the rules ... pull in opposite directions，并举例一个要求符号、另一个禁止。A 与 opposite 相反；C、D 无依据。"
        },
        {
          stem: "The author suggests that users who reuse passwords are",
          options: [
            "unusually careless.",
            "responding rationally to unreasonable demands.",
            "unaware that security matters.",
            "responsible for most data breaches."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "定位 people respond rationally 与 three requirements that human memory cannot meet at once：复用是对不合理要求的理性反应。A、C、D 与作者立场相反。"
        },
        {
          stem: "The term \"security theatre\" in Paragraph 2 refers to",
          options: [
            "rules that feel protective but achieve little.",
            "training programmes for employees.",
            "attacks carried out in public places.",
            "software that stores passwords safely."
          ],
          answer: 0,
          type: "词义题",
          loc: "第 2 段",
          explain: "定位 rules that feel protective and change little：感觉在保护、实际改变甚微。B、C、D 均无依据。"
        },
        {
          stem: "Credential stuffing works because",
          options: [
            "passwords are too short to guess.",
            "users reuse the same password across services.",
            "banks send passwords by email.",
            "forums store passwords in plain text."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 3 段",
          explain: "定位 which works precisely because people reuse：撞库得手的前提正是复用。A 与“逐条猜密码很少成功”相反；C、D 无依据。"
        },
        {
          stem: "Which of the following best states the main idea of the text?",
          options: [
            "Users should memorise longer passwords.",
            "Security should be redesigned around human limits, not blamed on users.",
            "Passkeys have solved every security problem.",
            "Credential stuffing is impossible to prevent."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "全文指出密码要求与人类记忆不匹配，把责任推给用户无效；有效改革是减少记忆负担、让安全选项成为默认。A 与作者建议相反；C、D 过度。"
        }
      ]
    }
  ];
  extra.forEach(function (r) { window.READINGS.push(r); });
})();
