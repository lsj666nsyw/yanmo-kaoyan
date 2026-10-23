/* 阅读 23—26 篇（原创仿真材料，非真题原文）。配套证据链见 evidence-extra3.js。 */
(function () {
  window.READINGS = (window.READINGS || []).concat([
    {
      id: 23,
      title: "Why So Many Studies Fail to Replicate",
      topic: "科技与学术",
      difficulty: "较难",
      minutes: 18,
      source: "原创仿真练习",
      paragraphs: [
        "In 2015, a team of psychologists tried to repeat one hundred well-known experiments in their field. Fewer than half produced the same result. The finding was reported widely, and it was often described as a crisis of fraud. That description is misleading. Most of the original researchers had not cheated; they had simply worked in a system that rewarded interesting results and never checked whether those results were stable.",
        "The problem begins with publication. Journals prefer findings that are new, surprising and statistically significant; a study that finds nothing is rarely published. That preference shapes what researchers do long before they submit a paper. When a result looks weak, there is a quiet temptation to run the analysis another way, to drop a few participants, or to report the measure that happened to work. None of these choices is fraud. Together, they can turn a fragile effect into a confident claim.",
        "Sample size makes the situation worse. A small study has a poor chance of detecting a real effect, so the effects it does detect are likely to be unusually large - and unusually large effects are the ones most likely to be reported and remembered. The literature then fills with results that are partly luck, and the next team cannot reproduce them.",
        "Reforms exist, and some are working. Several journals now accept \"registered reports\": researchers submit their design before collecting data, and the journal promises to publish the result whatever it shows. This removes the incentive to make the data tell a better story. Data sharing, too, has begun to allow outsiders to check analyses that were once private.",
        "None of this will make every result reproducible. Human behaviour is variable, and a failure to replicate is not proof that the original study was wrong. What the reforms change is the balance of incentives: they make it slightly easier to do careful work and slightly harder to publish a story that the data do not support. Science, after all, is not a collection of findings; it is a method for finding out when the findings are wrong."
      ],
      glossary: [
        ["replicate", "复现；重复(实验)"],
        ["fraud", "学术造假；欺诈"],
        ["statistically significant", "统计显著的"],
        ["incentive", "激励；诱因"],
        ["registered report", "注册报告"]
      ],
      questions: [
        {
          stem: "What does the author say about the failed replications?",
          options: [
            "They proved that most psychologists had committed fraud.",
            "They showed that most of the original studies were not dishonest.",
            "They were rejected by journals before publication.",
            "They were caused mainly by researchers sharing too much data."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "第 1 段明确说 That description is misleading；most of the original researchers had not cheated。A 与原文相反，C、D 均未提及。"
        },
        {
          stem: "According to Paragraph 2, the preferences of journals affect researchers by",
          options: [
            "forcing them to share data with competitors.",
            "encouraging them to present results in a more convincing way.",
            "leading them to choose topics that are less surprising.",
            "reducing the number of papers they submit each year."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 2 段",
          explain: "第 2 段说这种偏好 shape what researchers do long before they submit；后文列出的“换一种分析、删几个被试、挑一个恰好显著的指标”就是让结果更好看。B 是概括，C 与 surprising 相反。"
        },
        {
          stem: "Why do unusually large effects tend to fill the literature?",
          options: [
            "Because they are easier for other teams to reproduce.",
            "Because they usually come from larger samples.",
            "Because they are more likely to be reported and remembered.",
            "Because researchers avoid measuring them precisely."
          ],
          answer: 2,
          type: "推断题",
          loc: "第 3 段",
          explain: "第 3 段说 unusually large effects are the ones most likely to be reported and remembered，因此文献里留下的多是这类结果。B 与“小样本更易得到夸大的效应”相反。"
        },
        {
          stem: "What is the purpose of \"registered reports\"?",
          options: [
            "To shorten the time between design and publication.",
            "To separate the decision to publish from the result.",
            "To give journals control over how research is designed.",
            "To replace data sharing among laboratories."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 4 段",
          explain: "第 4 段说先交设计、期刊承诺 whatever it shows 都发表，This removes the incentive to make the data tell a better story——即把“发不发”与“结果好不好看”分开。C 原文未说期刊控制设计。"
        },
        {
          stem: "Which statement best summarizes the author's view?",
          options: [
            "Fraud is more common in science than the public believes.",
            "Replication failures mean that most published findings are false.",
            "Science progresses mainly by collecting as many findings as possible.",
            "The problem is essentially about incentives rather than dishonesty."
          ],
          answer: 3,
          type: "主旨题",
          loc: "第 1、5 段",
          explain: "首段否定“造假危机”，末段说 reforms change the balance of incentives，并以 Science is a method for finding out when the findings are wrong 收束。全文主线是激励机制，不是诚信。"
        }
      ]
    },
    {
      id: 24,
      title: "What the Lecture Still Does Well",
      topic: "教育",
      difficulty: "中等",
      minutes: 17,
      source: "原创仿真练习",
      paragraphs: [
        "The lecture is under attack. Studies comparing lectures with \"active learning\" - classes in which students solve problems, discuss and explain ideas to one another - often find that students in active classes learn more and fail less. Administrators read these results and ask why so much teaching is still a performance delivered from the front of a room.",
        "The evidence for active learning is strong, but the comparison is often unfair. In a typical experiment, the lecture group receives exactly what the lecturer would have done anyway, while the active group receives careful design, trained teaching assistants and regular feedback. The lecture is being compared not with better teaching in general, but with a particular method that has been generously supported.",
        "The lecture has one advantage that is easy to overlook: it can make a large audience think about the same problem at the same time. A well-constructed explanation, delivered with pauses for thought, can give hundreds of students a shared framework that discussion in small groups rarely produces. What lectures do badly is the part that follows: the assumption that listening is the same as learning.",
        "The most convincing accounts of teaching treat the format as a choice about where attention goes. A lecture is efficient for introducing a framework, showing how experts reason, and creating a sense of the subject as a whole. Active work is better for repairing misunderstandings, because it forces students to reveal what they actually think.",
        "The practical question, then, is not which method wins. It is how to combine them without pretending the combination is free. Flipping a course means designing what students do before class, training staff to respond to what they produce, and accepting that some of the time saved in the lecture hall is spent elsewhere. Done carelessly, the result is neither a good lecture nor good active learning - just a room of students who have been told to discuss something nobody prepared them to discuss."
      ],
      glossary: [
        ["lecture", "讲座；授课"],
        ["active learning", "主动学习"],
        ["framework", "框架"],
        ["flip a course", "翻转课堂"],
        ["misunderstanding", "误解；理解错误"]
      ],
      questions: [
        {
          stem: "What does the author say about studies comparing lectures with active learning?",
          options: [
            "They often give the active group more support.",
            "They show that lectures are always less effective.",
            "They are usually designed by administrators.",
            "They measure students' satisfaction rather than learning."
          ],
          answer: 0,
          type: "细节题",
          loc: "第 2 段",
          explain: "第 2 段说 active group receives careful design, trained teaching assistants and regular feedback，即实验里的主动学习组得到更多投入；B 的 always 过于绝对。"
        },
        {
          stem: "What advantage of lectures does Paragraph 3 identify?",
          options: [
            "They allow students to reveal their misunderstandings.",
            "They can give many students a shared framework.",
            "They require less preparation than discussion.",
            "They make it easy to test students' memory."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "第 3 段说讲座可以 give hundreds of students a shared framework that discussion in small groups rarely produces。A 是主动学习的优点（第 4 段），别混。"
        },
        {
          stem: "According to Paragraph 4, active work is especially useful for",
          options: [
            "introducing a subject as a whole.",
            "showing how experts reason.",
            "correcting misunderstandings.",
            "saving time in the classroom."
          ],
          answer: 2,
          type: "细节题",
          loc: "第 4 段",
          explain: "第 4 段明确说 Active work is better for repairing misunderstandings，因为学生必须暴露自己真实的想法。A、B 是讲座的优势。"
        },
        {
          stem: "The phrase \"the combination is free\" (Para 5) is used to suggest that",
          options: [
            "combining methods has hidden costs.",
            "lectures cost less than discussions.",
            "active learning requires no training.",
            "students should not pay for courses."
          ],
          answer: 0,
          type: "词义题",
          loc: "第 5 段",
          explain: "作者紧接着说明翻转课堂要重新设计课前任务、培训教师、把省下的时间花到别处，因此“结合不是免费的”指有隐性成本。"
        },
        {
          stem: "The author's attitude toward \"flipping a course\" is",
          options: [
            "strongly opposed.",
            "entirely neutral.",
            "supportive but cautious.",
            "enthusiastic and uncritical."
          ],
          answer: 2,
          type: "态度题",
          loc: "第 5 段",
          explain: "作者承认结合两种方法有价值，但反复强调 Done carelessly 的后果，属于“支持但有保留”。D 忽略了 caution，A 与全文不符。"
        }
      ]
    },
    {
      id: 25,
      title: "The Right to Repair",
      topic: "环境与消费",
      difficulty: "中等",
      minutes: 17,
      source: "原创仿真练习",
      paragraphs: [
        "A toaster costs less than the labour required to fix it. A washing machine is designed so that replacing a bearing requires dismantling the drum. A phone is glued shut, its battery held in place by adhesive rather than screws. None of these choices is accidental. They follow from a simple fact: manufacturers earn more from selling a new product than from repairing an old one.",
        "The environmental arithmetic is uncomfortable. Every product that is thrown away carries with it the energy and materials used to make it, as well as the cost of disposing of it. Extending the life of a device by even a few years can reduce its annual environmental burden substantially, because the largest share of that burden comes from manufacture, not from use.",
        "In response, a \"right to repair\" movement has emerged. Its proposals vary, but the core is access: manuals, spare parts and software tools should be available to independent repairers and, increasingly, to owners themselves. Manufacturers reply that opening their products to untrained hands creates safety risks and that repair documentation contains commercial secrets.",
        "Neither claim is entirely baseless, but both are often overstated. Safety standards can be written for parts that consumers are allowed to replace, as they already are for batteries in some devices. Commercial secrecy is a real interest, yet the information at issue is usually a diagram and a part number, not a formula.",
        "The deeper argument is about who owns the things we buy. A purchase that comes with restrictions on how the object may be opened, modified or repaired is not quite a purchase; it is a licence with a physical form. Repair cafes, where volunteers help people fix their own possessions, are a practical protest against this idea. They are also, quietly, a lesson in how much of what we treat as disposable is not."
      ],
      glossary: [
        ["adhesive", "黏合剂"],
        ["dismantle", "拆卸"],
        ["spare part", "备件"],
        ["disposable", "用后即弃的"],
        ["right to repair", "维修权"]
      ],
      questions: [
        {
          stem: "According to Paragraph 1, why are many products difficult to repair?",
          options: [
            "Repair parts are no longer produced.",
            "Consumers prefer to buy new products.",
            "Manufacturers profit more from replacement than from repair.",
            "Safety rules forbid independent repair."
          ],
          answer: 2,
          type: "细节题",
          loc: "第 1 段",
          explain: "第 1 段末句给出原因：manufacturers earn more from selling a new product than from repairing an old one。B 把结果当原因，D 是第 3 段厂商的说法。"
        },
        {
          stem: "What can be inferred from Paragraph 2 about environmental costs?",
          options: [
            "Disposal is the largest part of a product's impact.",
            "Most of a product's impact comes before it is used.",
            "Repairing devices increases total energy use.",
            "Older devices consume more electricity than new ones."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "第 2 段说 the largest share of that burden comes from manufacture, not from use，因此产品影响的主体在“制造”，即使用之前。A 与原文相反。"
        },
        {
          stem: "What do manufacturers argue against right-to-repair rules?",
          options: [
            "Repairs would reduce the prices of new products.",
            "Independent repairers lack experience with software.",
            "Consumers would stop recycling old devices.",
            "Repair information may expose trade secrets."
          ],
          answer: 3,
          type: "细节题",
          loc: "第 3 段",
          explain: "第 3 段说 Manufacturers reply that ... repair documentation contains commercial secrets，D 是原文改写。B 原文只说 untrained hands 有安全风险，未单指软件经验。"
        },
        {
          stem: "In Paragraph 5, the author compares a restricted purchase to",
          options: [
            "a rental agreement with no fixed term.",
            "a licence rather than a piece of property.",
            "a donation to the manufacturer.",
            "a service contract with hidden fees."
          ],
          answer: 1,
          type: "词义题",
          loc: "第 5 段",
          explain: "第 5 段说 it is not quite a purchase; it is a licence with a physical form，即买到的更像许可而非财产。"
        },
        {
          stem: "The author's main purpose is to",
          options: [
            "explain why repair cafes are becoming more popular.",
            "defend the idea that buyers should be able to repair what they own.",
            "show that safety concerns are entirely unfounded.",
            "compare repair costs across different countries."
          ],
          answer: 1,
          type: "主旨题",
          loc: "全文",
          explain: "全文从“难修”到“维修权”再到“买的到底是什么”，最终落在支持维修权。C 的 entirely 太绝对——作者承认安全顾虑并非毫无根据。"
        }
      ]
    },
    {
      id: 26,
      title: "The Invisible Work Behind Fast Delivery",
      topic: "经济与社会",
      difficulty: "中等",
      minutes: 18,
      source: "原创仿真练习",
      paragraphs: [
        "The delivery rider appears at the door, hands over a meal and disappears. What the customer experiences as a simple transaction is the last link in a chain that includes dispatchers, warehouses, cooks, packers and the algorithms that decide how many stops fit into an hour. The convenience is real. The question is where its cost goes.",
        "Platforms describe themselves as technology companies that connect independent partners with customers. This description is legally convenient: partners are not employees, so the platform does not pay for sick leave, insurance or the equipment riders use. Economists have begun to call this arrangement the \"transfer of risk\": uncertainties that were once carried by firms are now carried by individuals who have less ability to bear them.",
        "The algorithm is not neutral. It records how long each delivery takes and adjusts future assignments accordingly. A rider who learns every shortcut in a district may receive more orders; a rider who waits at a slow restaurant loses time that is not compensated. Over months, small differences in speed become differences in income, and the pressure is applied not by a manager but by a system that appears to have no author.",
        "Defenders reply that the flexibility is genuine. Students, carers and others who cannot commit to fixed shifts can earn when it suits them; surveys of riders often find that many value this freedom even while complaining about pay. Both things can be true at once, which is what makes the debate so difficult.",
        "What is missing from the argument is a public account of the risk. When a rider is injured and has no insurance, the cost does not vanish; it moves to a hospital, a family or a state budget. A labour market can be flexible and still decide, deliberately, who pays when things go wrong. The choice is not between convenience and regulation. It is about whether the convenience is priced honestly."
      ],
      glossary: [
        ["dispatcher", "调度员"],
        ["algorithm", "算法"],
        ["compensate", "补偿"],
        ["flexibility", "灵活性"],
        ["regulation", "监管"]
      ],
      questions: [
        {
          stem: "What does Paragraph 2 say about the \"transfer of risk\"?",
          options: [
            "Platforms pay for the equipment that riders use.",
            "Uncertainties are shifted to people less able to bear them.",
            "Riders receive insurance as independent partners.",
            "Firms now carry more risk than they did before."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 2 段",
          explain: "第 2 段定义 transfer of risk：uncertainties ... are now carried by individuals who have less ability to bear them。A、C 与“平台不付保险和设备”相反。"
        },
        {
          stem: "How does the algorithm influence riders according to Paragraph 3?",
          options: [
            "It guarantees equal income for all riders.",
            "It rewards speed in ways riders cannot easily challenge.",
            "It assigns a manager to supervise each rider.",
            "It compensates riders for waiting at restaurants."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "第 3 段说系统记录时长并据此调整派单，快的人订单更多，慢的人损失时间且没有补偿；压力来自 a system that appears to have no author，即难以申诉。"
        },
        {
          stem: "Why does the author mention students and carers?",
          options: [
            "To show that most riders are young.",
            "To prove that platforms are not profitable.",
            "To acknowledge that flexibility has real value.",
            "To suggest that riders need more training."
          ],
          answer: 2,
          type: "细节题",
          loc: "第 4 段",
          explain: "第 4 段用学生、照护者说明 flexibility is genuine，并说 Both things can be true at once，作者在承认对方论点有真实成分。"
        },
        {
          stem: "The phrase \"priced honestly\" (Para 5) most nearly means",
          options: [
            "at a lower price for customers.",
            "with its real costs included.",
            "through direct negotiation with riders.",
            "according to government guidelines."
          ],
          answer: 1,
          type: "词义题",
          loc: "第 5 段",
          explain: "前文说受伤无保险时成本转移到医院、家庭或财政，因此 priced honestly 指把这部分真实成本计入价格。"
        },
        {
          stem: "Which best states the author's position?",
          options: [
            "Platforms should be banned from using algorithms.",
            "Riders would be better off as employees in every case.",
            "Flexibility is compatible with rules that assign costs fairly.",
            "Customers should pay more for every delivery."
          ],
          answer: 2,
          type: "主旨题",
          loc: "第 5 段",
          explain: "末段说 A labour market can be flexible and still decide ... who pays when things go wrong，作者不反对灵活，而是主张明确成本由谁承担。A、B 过于极端。"
        }
      ]
    }
  ]);
})();