/* 阅读 23—26 的定位证据链与参考译文。 */
(function () {
  const evidence = {
    "23": [
      {
        para: 1,
        evidence: "Most of the original researchers had not cheated; they had simply worked in a system that rewarded interesting results and never checked whether those results were stable.",
        paraphrase: "had not cheated = not dishonest（多数人没有造假）；a system that rewarded interesting results = 问题在激励导向，而非个人诚信"
      },
      {
        para: 2,
        evidence: "When a result looks weak, there is a quiet temptation to run the analysis another way, to drop a few participants, or to report the measure that happened to work.",
        paraphrase: "a quiet temptation to ... = 期刊偏好使研究者悄悄“调整”结果；run the analysis another way / drop participants / report the measure that worked 都是让结果更显著的做法"
      },
      {
        para: 3,
        evidence: "unusually large effects are the ones most likely to be reported and remembered.",
        paraphrase: "most likely to be reported and remembered = 更可能被发表、被记住，因此文献里堆积的是这类效应"
      },
      {
        para: 4,
        evidence: "the journal promises to publish the result whatever it shows. This removes the incentive to make the data tell a better story.",
        paraphrase: "publish ... whatever it shows = 发表与否与结果好坏脱钩；removes the incentive = 不再有把数据修饰得更好看的动机"
      },
      {
        para: 5,
        evidence: "What the reforms change is the balance of incentives: they make it slightly easier to do careful work and slightly harder to publish a story that the data do not support.",
        paraphrase: "the balance of incentives = 核心问题是激励结构；careful work easier / unsupported story harder = 改革调整的是激励，不是靠指责造假"
      }
    ],
    "24": [
      {
        para: 2,
        evidence: "the lecture group receives exactly what the lecturer would have done anyway, while the active group receives careful design, trained teaching assistants and regular feedback.",
        paraphrase: "exactly what the lecturer would have done anyway = 对照组维持原样；careful design, trained assistants, regular feedback = 主动学习组获得额外投入，比较不公平"
      },
      {
        para: 3,
        evidence: "A well-constructed explanation, delivered with pauses for thought, can give hundreds of students a shared framework that discussion in small groups rarely produces.",
        paraphrase: "give hundreds of students a shared framework = 讲座能给大量学生共同框架；discussion in small groups rarely produces = 小组讨论难以做到"
      },
      {
        para: 4,
        evidence: "Active work is better for repairing misunderstandings, because it forces students to reveal what they actually think.",
        paraphrase: "better for repairing misunderstandings = 主动学习擅长纠错；forces students to reveal what they actually think = 迫使学生暴露真实理解"
      },
      {
        para: 5,
        evidence: "Flipping a course means designing what students do before class, training staff to respond to what they produce, and accepting that some of the time saved in the lecture hall is spent elsewhere.",
        paraphrase: "designing ... before class / training staff / time saved ... spent elsewhere = 翻转课堂有隐性成本，“结合不是免费的”"
      },
      {
        para: 5,
        evidence: "Done carelessly, the result is neither a good lecture nor good active learning - just a room of students who have been told to discuss something nobody prepared them to discuss.",
        paraphrase: "Done carelessly = 草率结合会两头落空；neither ... nor = 既不是好讲座也不是好主动学习，作者因此持保留态度"
      }
    ],
    "25": [
      {
        para: 1,
        evidence: "They follow from a simple fact: manufacturers earn more from selling a new product than from repairing an old one.",
        paraphrase: "earn more from selling a new product than from repairing = 厂商从“卖新的”获利更多，因此设计上就不利于维修"
      },
      {
        para: 2,
        evidence: "the largest share of that burden comes from manufacture, not from use.",
        paraphrase: "largest share ... from manufacture, not from use = 环境影响主要产生于制造阶段，所以延长使用寿命收益大"
      },
      {
        para: 3,
        evidence: "Manufacturers reply that opening their products to untrained hands creates safety risks and that repair documentation contains commercial secrets.",
        paraphrase: "creates safety risks / documentation contains commercial secrets = 厂商反对的两条理由：安全风险与商业秘密"
      },
      {
        para: 5,
        evidence: "A purchase that comes with restrictions on how the object may be opened, modified or repaired is not quite a purchase; it is a licence with a physical form.",
        paraphrase: "not quite a purchase ... a licence with a physical form = 附带限制的“购买”更像一份有形的许可"
      },
      {
        para: 5,
        evidence: "The deeper argument is about who owns the things we buy.",
        paraphrase: "who owns the things we buy = 争论的实质是所有权；后文 repair cafes 是对这一主张的实践"
      }
    ],
    "26": [
      {
        para: 2,
        evidence: "uncertainties that were once carried by firms are now carried by individuals who have less ability to bear them.",
        paraphrase: "carried by individuals who have less ability to bear them = 风险从公司转给承受力更弱的个人，即 transfer of risk"
      },
      {
        para: 3,
        evidence: "Over months, small differences in speed become differences in income, and the pressure is applied not by a manager but by a system that appears to have no author.",
        paraphrase: "the pressure is applied not by a manager but by a system = 压力来自算法而非管理者；appears to have no author = 骑手难以找到可申诉的对象"
      },
      {
        para: 4,
        evidence: "Students, carers and others who cannot commit to fixed shifts can earn when it suits them; surveys of riders often find that many value this freedom even while complaining about pay.",
        paraphrase: "can earn when it suits them / many value this freedom = 灵活确有其价值，作者用学生与照护者举例承认对方论点"
      },
      {
        para: 5,
        evidence: "A labour market can be flexible and still decide, deliberately, who pays when things go wrong.",
        paraphrase: "can be flexible and still decide ... who pays = 灵活与“明确成本承担者”并不冲突"
      },
      {
        para: 5,
        evidence: "The choice is not between convenience and regulation. It is about whether the convenience is priced honestly.",
        paraphrase: "not between convenience and regulation = 作者不主张简单禁止；priced honestly = 把真实成本计入价格"
      }
    ]
  };

  const cn = {
    "23-0": "多数原作者并没有造假；他们只是在一个奖励“有趣结果”、却从不核查结果是否稳定的体系里工作。",
    "23-1": "当一个结果看起来不够强时，就会有一种不易察觉的诱惑：换一种方式做分析、删掉几个被试，或者报告恰好显著的那个指标。",
    "23-2": "异常大的效应恰恰是最容易被发表、被记住的那些。",
    "23-3": "期刊承诺无论结果如何都会发表，这就消除了“让数据讲一个更好故事”的动机。",
    "23-4": "改革改变的是激励的平衡：让认真做事稍微容易一点，让发表数据不支持的故事稍微难一点。",
    "24-0": "讲座组得到的只是讲者本来也会做的那套教学，而主动学习组得到了精心设计、受过培训的助教和定期反馈。",
    "24-1": "一个结构良好的讲解、配上留白思考的停顿，能给几百名学生一个共同框架，而这是小组讨论很少能产生的。",
    "24-2": "主动学习更擅长修补误解，因为它迫使学生暴露自己真实的理解。",
    "24-3": "翻转课堂意味着设计课前任务、培训教师回应学生的产出，并接受讲座里省下的时间要花在别处。",
    "24-4": "做得草率，结果既不是好讲座也不是好的主动学习——只是一屋子被要求讨论、却没人提前准备的学生。",
    "25-0": "它们源于一个简单事实：厂商从卖新产品中赚到的，比从修旧产品中赚到的多。",
    "25-1": "这一负担的最大份额来自制造，而不是使用。",
    "25-2": "厂商回应说，把产品交给未经训练的人拆开会有安全风险，维修资料也包含商业秘密。",
    "25-3": "一次购买如果附带“不得拆开、改装或维修”的限制，就不太像购买，而更像一份有形的许可。",
    "25-4": "更深一层的争论在于：我们买下的东西究竟归谁所有。",
    "26-0": "曾经由公司承担的不确定性，如今由承受能力更弱的个人承担。",
    "26-1": "几个月下来，速度上的微小差异就变成了收入差异；施加压力的不是管理者，而是一个似乎没有作者的体系。",
    "26-2": "学生、照护者等无法固定排班的人可以在方便时挣钱；对骑手的调查也常发现，许多人在抱怨报酬的同时仍看重这份自由。",
    "26-3": "劳动力市场可以灵活，同时仍能刻意决定：出了问题时由谁承担代价。",
    "26-4": "选择不在于便利与监管之间，而在于这份便利是否被诚实地定价。"
  };

  Object.keys(evidence).forEach(function (key) { window.READING_EVIDENCE[key] = evidence[key]; });
  Object.keys(cn).forEach(function (key) { window.READING_EVIDENCE_CN[key] = cn[key]; });
})();