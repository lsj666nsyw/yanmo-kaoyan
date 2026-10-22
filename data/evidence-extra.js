/* 阅读 07—12 的证据链与参考句意
   与 reading-extra.js 逐题对应，quote 均取自原文，不另行改写 */

(function () {
  const evidence = {
    "7": [
      {
        para: 1,
        evidence: "Yet finding a disease earlier is not the same as changing its course.",
        paraphrase: "finding a disease earlier = early detection（更早发现）｜changing its course = altering the outcome of the disease（改变疾病走向）"
      },
      {
        para: 2,
        evidence: "If a patient is diagnosed five years earlier but dies at the same age, survival after diagnosis appears five years longer, even though the date of death has not moved.",
        paraphrase: "diagnosed earlier but dies at the same age = survival looks longer while the date of death is unchanged（诊断提前，死亡日期没变，生存期只是看起来变长）"
      },
      {
        para: 3,
        evidence: "Thyroid screening in some countries produced a sharp rise in diagnoses without a corresponding fall in deaths.",
        paraphrase: "a sharp rise in diagnoses without a fall in deaths = more cases found but no more lives saved（诊断数大增、死亡数不降，说明检出了不会致病的病例）"
      },
      {
        para: 4,
        evidence: "A screening programme should be judged by whether it improves outcomes that matter, not by how many abnormalities it finds.",
        paraphrase: "improves outcomes that matter = reduces deaths or serious harm（改善真正重要的健康结果）｜not by how many abnormalities it finds = detection volume is not the standard（发现数量不是评价标准）"
      },
      {
        para: null,
        evidence: "The goal is not less screening, but better screening: tests that have been shown to help, communication that explains the trade-offs, and the honesty to admit when the evidence is uncertain.",
        paraphrase: "better screening = evidence-based tests plus honest communication（不是少筛查，而是筛得更准、讲得更清楚）"
      }
    ],
    "8": [
      {
        para: 1,
        evidence: "But a rule is not neutral simply because a machine applies it. Someone chose what to measure, how to weight it and what counts as failure.",
        paraphrase: "a machine applies it ≠ neutral = the choice behind the rule is human（机器执行不等于规则中立，指标是人选的）"
      },
      {
        para: 2,
        evidence: "Workers learn to optimise the number rather than the service it was meant to represent, a pattern familiar from schools that teach to the test.",
        paraphrase: "optimise the number rather than the service = the metric replaces the goal（优化数字而非服务本身）｜teach to the test = 应试化，目标被指标替代"
      },
      {
        para: 3,
        evidence: "A worker who is suspended or demoted may be told that an automated system made the decision, without being shown the evidence or the rule that was applied.",
        paraphrase: "without being shown the evidence or the rule = the decision is opaque（看不到证据和规则，即不透明）"
      },
      {
        para: 4,
        evidence: "The answer is not a perfect algorithm but a system of accountability: published criteria, independent appeal, and a human who can override the score.",
        paraphrase: "not a perfect algorithm but accountability = 不追求完美算法，而建立问责机制｜published criteria, appeal, human override = 公开标准、独立申诉、人工推翻"
      },
      {
        para: null,
        evidence: "It will be realised by asking who chose the numbers, who can challenge them, and who bears the cost when they are wrong.",
        paraphrase: "who chose / who can challenge / who bears the cost = 追问指标由谁设定、能否质疑、出错谁负责"
      }
    ],
    "9": [
      {
        para: 1,
        evidence: "They widened motorways, added lanes and built bypasses, expecting journey times to fall.",
        paraphrase: "widened ... added ... built ... expecting journey times to fall = 扩建道路，期待通行时间下降"
      },
      {
        para: 2,
        evidence: "New capacity lowers the cost of driving, in time and fuel, and encourages people to make trips they had previously avoided, move farther from work, or abandon public transport.",
        paraphrase: "new capacity lowers the cost of driving = 新容量降低驾驶成本｜make trips ... move farther ... abandon public transport = 诱发更多、更远的出行"
      },
      {
        para: 3,
        evidence: "The result is a planning trap: each expansion looks justified by the congestion that the last one helped create.",
        paraphrase: "each expansion looks justified by the congestion the last one created = 上一次扩建制造拥堵，拥堵又证明下一次扩建合理（自我强化的规划陷阱）"
      },
      {
        para: 4,
        evidence: "Land-use rules matter too: a city that requires every new development to include parking is quietly deciding that driving will remain the default.",
        paraphrase: "require parking = make driving the default（强制配建停车位，等于默认开车）"
      },
      {
        para: null,
        evidence: "Measuring lane miles is easy. Measuring access, safety and the health of a city is harder, but it is the only measurement that tells us whether the road actually helped.",
        paraphrase: "lane miles ≠ access, safety, health = 车道里程不是目的，可达性、安全与城市健康才是"
      }
    ],
    "10": [
      {
        para: 1,
        evidence: "The loss is easy to miss because national and international news has never been more available.",
        paraphrase: "national and international news is abundant = 全国与国际新闻充足，掩盖了地方新闻的消失"
      },
      {
        para: 2,
        evidence: "A market can produce plenty of national opinion and very little information about the zoning meeting down the street.",
        paraphrase: "plenty of national opinion but little local information = 全国观点很多，地方信息很少（news desert 的实质）"
      },
      {
        para: 3,
        evidence: "The mechanisms are ordinary: someone has to read the budget, attend the meeting and ask why the contract went to that company.",
        paraphrase: "read the budget, attend the meeting, ask why = 日常监督的具体动作｜someone has to = 问责需要有人持续做这些事"
      },
      {
        para: 4,
        evidence: "The design of the funding matters as much as its size: endowments, small-donor memberships and rules that protect editorial independence can help, while a single powerful backer can turn a newspaper into a newsletter.",
        paraphrase: "design matters as much as size = 资助结构同样重要｜a single powerful backer can turn a newspaper into a newsletter = 单一金主会损害编辑独立"
      },
      {
        para: null,
        evidence: "Local news produces something that is hard to sell and easy to take for granted: the daily record of how a place is governed.",
        paraphrase: "hard to sell and easy to take for granted = 难变现、易被忽视｜the daily record of how a place is governed = 地方治理的日常记录（公共基础设施）"
      }
    ],
    "11": [
      {
        para: 1,
        evidence: "A visitor in London or Berlin can compare a Greek vase, a Benin bronze and a Chinese scroll without leaving the building.",
        paraphrase: "compare objects from different cultures in one place = 在一座博物馆里并置、比较不同文化的藏品"
      },
      {
        para: 2,
        evidence: "Repatriation does not always mean a gallery emptied; it can mean a loan, a shared catalogue, a joint exhibition or a transfer to a museum with better conditions.",
        paraphrase: "does not always mean a gallery emptied = 归还未必等于清空展厅｜loan, shared catalogue, joint exhibition, transfer = 归还可以采取多种合作形式"
      },
      {
        para: 3,
        evidence: "A blanket rule would be unjust in one direction or the other.",
        paraphrase: "a blanket rule = 一刀切规则｜unjust in one direction or the other = 无论偏向哪边都可能不公，因此要逐案判断"
      },
      {
        para: 4,
        evidence: "Partnerships can address them through agreements on display, care and long-term loans.",
        paraphrase: "address fears through agreements on display, care and long-term loans = 通过展示、保管、长期出借协议回应博物馆的担忧"
      },
      {
        para: null,
        evidence: "If it is a place where cultures explain themselves to one another, then the goal is a relationship, and relationships require negotiation.",
        paraphrase: "cultures explain themselves to one another = 博物馆是文化间相互解释的场所｜relationship requires negotiation = 目标是关系，关系需要协商（共享管理权）"
      }
    ],
    "12": [
      {
        para: 1,
        evidence: "A programme that repairs bridges before they fail produces no dramatic photograph, and its success is measured by something that did not happen.",
        paraphrase: "no dramatic photograph = 没有戏剧性画面｜success measured by something that did not happen = 成功体现为“没有发生的灾难”，难以展示"
      },
      {
        para: 2,
        evidence: "Deferred maintenance on roads, water systems and public buildings accumulates, but it does not appear as a single line in the budget.",
        paraphrase: "deferred maintenance = 被推迟的维护｜does not appear as a single line = 不会作为一笔显性预算出现，成本被隐藏"
      },
      {
        para: 3,
        evidence: "The result is a bias toward the urgent over the important, which is not a failure of individual intelligence but a feature of the system.",
        paraphrase: "bias toward the urgent over the important = 重紧急、轻重要｜a feature of the system = 制度激励造成的结构性偏差"
      },
      {
        para: 4,
        evidence: "These tools do not remove the political difficulty, but they make the invisible visible.",
        paraphrase: "make the invisible visible = 让原本不被计算的成本变得可见、可争论"
      },
      {
        para: null,
        evidence: "That requires a different kind of accounting, and a different kind of politics: one that gives credit for the disaster that did not happen.",
        paraphrase: "give credit for the disaster that did not happen = 为“没有发生的灾难”记功，即奖励预防"
      }
    ],
    "13": [
      {
        para: 1,
        evidence: "rereading produces modest gains that fade within days, while the confidence it creates lasts much longer",
        paraphrase: "modest gains that fade within days = 收益有限且很快消退｜the confidence ... lasts much longer = 信心却持续久得多（顺畅感不等于记忆）"
      },
      {
        para: 2,
        evidence: "More rereading improved performance on the immediate test, but the advantage nearly disappeared after a week.",
        paraphrase: "the advantage nearly disappeared after a week = 即时测试会高估重读的价值，一周后优势几乎消失"
      },
      {
        para: 3,
        evidence: "the effort of pulling information out of memory is what makes later recall more reliable",
        paraphrase: "the effort ... makes later recall more reliable = 费力本身是提取练习起效的机制，不是副作用"
      },
      {
        para: 4,
        evidence: "it depresses practice scores and raises later performance",
        paraphrase: "depresses practice scores = 练习时分数被压低｜raises later performance = 之后表现提高，以短期不适换长期牢固"
      },
      {
        para: null,
        evidence: "The most honest measure of study remains what can be recalled tomorrow, with the book closed.",
        paraphrase: "recalled tomorrow, with the book closed = 衡量标准是延迟回忆，而不是当下的顺畅感"
      }
    ],
    "14": [
      {
        para: 1,
        evidence: "The change is rarely treated as an environmental problem, because light is associated with safety and progress.",
        paraphrase: "light is associated with safety and progress = 光被视为安全与进步，问题因此长期不被当作污染"
      },
      {
        para: 2,
        evidence: "with effects that carry into the food web, since birds, bats and fish feed on them",
        paraphrase: "carry into the food web = 影响沿食物链扩散，不止作用于昆虫本身"
      },
      {
        para: 3,
        evidence: "Hatchling sea turtles move toward the brightest horizon, which for millions of years has meant the ocean",
        paraphrase: "move toward the brightest horizon = 靠最亮方向定向；这个方向本应是海，如今常是人工光源"
      },
      {
        para: 4,
        evidence: "light disappears the moment a switch is turned off",
        paraphrase: "disappears the moment a switch is turned off = 一关灯即消失，是极少数可快速逆转的污染"
      },
      {
        para: null,
        evidence: "acknowledging that darkness has functions",
        paraphrase: "darkness has functions = 黑暗有生态功能，不是可有可无的背景"
      }
    ],
    "15": [
      {
        para: 1,
        evidence: "most of the firms stayed with the shorter week after the trial ended",
        paraphrase: "stayed with the shorter week = 试验结束后仍保留四天工作制"
      },
      {
        para: 2,
        evidence: "they are stretching evidence from one kind of workplace to another",
        paraphrase: "stretching evidence = 把一类工作场所的证据外推到另一类，超出样本能支持的范围"
      },
      {
        para: 3,
        evidence: "the work did not disappear; it was compressed",
        paraphrase: "was compressed = 工作量未消失，而是被压进更少的天数（会议精简、部分人工作更长）"
      },
      {
        para: 4,
        evidence: "whether the model survives a recession, when companies cut whatever looks optional",
        paraphrase: "survives a recession = 经济下行、公司削减“可有可无”的开支时能否存活"
      },
      {
        para: null,
        evidence: "best treated as a serious hypothesis rather than a settled conclusion",
        paraphrase: "hypothesis rather than conclusion = 是待检验的假设，不是已被证实的结论"
      }
    ],
    "16": [
      {
        para: 1,
        evidence: "the rules imposed by different services pull in opposite directions",
        paraphrase: "pull in opposite directions = 不同服务的要求互相冲突，用户无所适从"
      },
      {
        para: 2,
        evidence: "systems ask users to remember secrets that are long, unique and constantly changing",
        paraphrase: "long, unique and constantly changing = 三项要求超出人类记忆能力，关键在错配而非粗心"
      },
      {
        para: 2,
        evidence: "rules that feel protective and change little",
        paraphrase: "feel protective and change little = 安全戏院：有安全感，无实际效果"
      },
      {
        para: 3,
        evidence: "which works precisely because people reuse",
        paraphrase: "works precisely because people reuse = 密码复用正是撞库攻击奏效的前提"
      },
      {
        para: null,
        evidence: "a security system which depends on perfect human behaviour will fail at human scale",
        paraphrase: "fail at human scale = 在真实用户规模下必然失效，责任不应推给个人"
      }
    ]
  };

  const cn = {
    "7-0": "然而，更早发现疾病并不等于改变疾病的进程。",
    "7-1": "如果患者提前五年被诊断，却在相同年龄去世，那么诊断后的生存期看起来延长了五年，尽管死亡日期并未改变。",
    "7-2": "在一些国家，甲状腺筛查使诊断数量急剧上升，死亡人数却没有相应下降。",
    "7-3": "判断一项筛查计划，应看它是否改善了真正重要的健康结果，而不是看它发现了多少异常。",
    "7-4": "目标不是更少的筛查，而是更好的筛查：已被证明有效的检查、解释利弊的沟通，以及承认证据不确定的诚实。",
    "8-0": "但一条规则并不会仅仅因为由机器执行就变得中立。有人选择了衡量什么、如何加权，以及什么算作失败。",
    "8-1": "工人学会优化数字，而不是数字本应代表的服务——这与学校“为考试而教”的模式如出一辙。",
    "8-2": "被停职或降级的工人可能只会被告知是自动系统做出的决定，却看不到所依据的证据或规则。",
    "8-3": "答案不是一个完美的算法，而是一套问责机制：公开标准、独立申诉，以及可以推翻评分的人。",
    "8-4": "它将通过追问谁选择了这些数字、谁能够质疑它们、以及当它们出错时谁承担代价来实现。",
    "9-0": "他们拓宽高速公路、增加车道、修建绕行道路，期待通行时间下降。",
    "9-1": "新增容量降低了驾驶的时间与燃料成本，鼓励人们进行以前会避免的出行、住得离工作地点更远，或放弃公共交通。",
    "9-2": "结果是一个规划陷阱：每一次扩建都显得有理，因为拥堵正是上一次扩建帮忙造成的。",
    "9-3": "土地使用规则同样重要：要求每个新开发项目都配建停车位的城市，实际上是在悄悄决定让开车继续成为默认选项。",
    "9-4": "衡量车道里程很容易；衡量可达性、安全性和城市健康更难，但只有这种衡量才能告诉我们道路是否真的起了作用。",
    "10-0": "这种损失容易被忽视，因为全国与国际新闻从未像现在这样触手可及。",
    "10-1": "市场可以生产大量全国性观点，却几乎不提供关于街角规划会议的信息。",
    "10-2": "机制很普通：总得有人读预算、参加会议，并追问合同为什么给了那家公司。",
    "10-3": "资助的设计与规模同样重要：捐赠基金、小额捐助会员制以及保护编辑独立性的规则会有帮助，而单一强势金主可能把报纸变成通讯稿。",
    "10-4": "地方新闻生产着一种难以出售、容易被视作理所当然的东西：一个地方如何被治理的日常记录。",
    "11-0": "在伦敦或柏林的参观者无需离开建筑，就能比较希腊花瓶、贝宁青铜器和中国卷轴。",
    "11-1": "归还并不总意味着展厅被清空；它可以是出借、共享目录、联合展览，或移交给条件更好的博物馆。",
    "11-2": "一刀切的规则无论偏向哪一边，都会造成不公。",
    "11-3": "合作可以通过展示、保管和长期出借协议来回应这些担忧。",
    "11-4": "如果博物馆是不同文化相互解释的场所，那么目标就是关系，而关系需要协商。",
    "12-0": "在桥梁坍塌前修好它的项目不会产生引人注目的照片，它的成功是用“没有发生的事情”来衡量的。",
    "12-1": "道路、供水系统和公共建筑的延期维护会不断累积，却不会作为预算中的单独一项出现。",
    "12-2": "结果是一种偏向紧急事务、忽视重要事务的偏差；这不是个人智力的问题，而是制度的一个特征。",
    "12-3": "这些工具不能消除政治困难，但它们让看不见的东西变得可见。",
    "12-4": "这需要一种不同的会计方式，也需要一种不同的政治：为“没有发生的灾难”记上一功。",
    "13-0": "然而重读带来的提升有限、几天就消退，而它制造的信心却持续久得多。",
    "13-1": "重读越多，即时测试表现越好，但一周后这一优势几乎消失。",
    "13-2": "把信息从记忆中提取出来的费力过程，才让日后的回忆更可靠。",
    "13-3": "交错练习会压低练习时的分数，却提高之后的表现。",
    "13-4": "衡量学习最诚实的方式，仍然是合上书、看明天还能回忆起什么。",
    "14-0": "这一变化很少被当作环境问题，因为光总是与安全和进步联系在一起。",
    "14-1": "影响还会沿食物网传导，因为鸟类、蝙蝠和鱼类以它们为食。",
    "14-2": "刚孵化的海龟会朝着最亮的地平线爬行——几百万年来那意味着海洋。",
    "14-3": "与许多污染物不同，光在开关关掉的一刻就消失了。",
    "14-4": "需要我们承认，黑暗是有功能的。",
    "15-0": "试验结束后，大多数公司保留了更短的工作周。",
    "15-1": "他们这是在把某一类工作场所的证据拉伸到另一类。",
    "15-2": "工作并没有消失，而是被压缩了。",
    "15-3": "这一模式能否在经济衰退中存活——那时公司会砍掉一切看似可有可无的东西。",
    "15-4": "更应被当作一个严肃的假设，而不是已经盖棺定论的结论。",
    "16-0": "不同服务强加的规则相互矛盾。",
    "16-1": "系统要求用户记住既长、又唯一、还不断变化的口令。",
    "16-2": "让人感觉受到保护、实际改变甚微的规则。",
    "16-3": "它之所以奏效，恰恰是因为人们重复使用密码。",
    "16-4": "依赖完美人类行为的安全体系，在人类规模上必然失败。"
  };

  Object.keys(evidence).forEach(function (key) {
    window.READING_EVIDENCE[key] = evidence[key];
  });
  Object.keys(cn).forEach(function (key) {
    window.READING_EVIDENCE_CN[key] = cn[key];
  });
})();
