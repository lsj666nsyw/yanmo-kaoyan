/* 写作 · 小作文模板与范文、大作文范文、句型库、替换词、失分点 */
window.WRITING = {
  small: [
    {
      type: "建议信",
      scene: "给校图书馆馆长写信，建议在考试周延长开放时间。",
      structure: [
        ["第一段", "表明身份 + 一句话说明写信目的，不绕弯。"],
        ["第二段", "提出具体建议（时间、楼层、人员安排），并说明理由。"],
        ["第三段", "表示理解与感谢，请求考虑，留下回旋余地。"]
      ],
      patterns: [
        "I am writing to suggest that the library extend its opening hours during the examination period.",
        "At present ..., which leaves students with few quiet places to study.",
        "If staffing is a concern, the library might begin with ...",
        "I would be grateful if you could consider this suggestion."
      ],
      sample: `Dear Director,

I am a third-year student in the Department of History. I am writing to suggest that the university library extend its opening hours during the examination period.

At present the library closes at 9 p.m., which leaves students who live far from campus with few quiet places to study. Extending the closing time to 11 p.m. for the four weeks before examinations would make a real difference. If staffing is a concern, the library might begin with the reading rooms on the second floor.

I would be grateful if you could consider this suggestion.

Yours sincerely,
Li Ming`,
      notes: [
        "建议要具体到“考试前四周、延长到十一点、先开放二层阅览室”，避免“希望改进服务”这类空话。",
        "语气克制：先说明困难，再给方案，最后才请求考虑，不命令、不抱怨。",
        "格式：称呼顶格，正文分段，结尾 Yours sincerely + 姓名；不知道收信人姓名时用 Dear Sir or Madam / Yours faithfully。"
      ]
    },
    {
      type: "感谢信",
      scene: "给外教写信，感谢其指导毕业论文。",
      structure: [
        ["第一段", "直接致谢，说明感谢的具体事由。"],
        ["第二段", "写清对方的帮助产生了什么具体影响，避免只堆形容词。"],
        ["第三段", "再次致谢，表达祝愿或保持联系的意愿。"]
      ],
      patterns: [
        "I am writing to thank you for the guidance you gave me during ...",
        "Your comments on my second draft were especially helpful: they showed me that ...",
        "I have also benefited from ...",
        "Thank you again for your patience and generosity."
      ],
      sample: `Dear Professor Smith,

I am writing to thank you for the guidance you gave me during the writing of my graduation thesis. Your comments on my second draft were especially helpful: they showed me that my argument was too broad and helped me narrow it to a question I could actually answer.

I have also benefited from the articles you recommended. They changed the way I read primary sources, and I expect to use them in my future research.

Thank you again for your patience and generosity.

Yours sincerely,
Li Ming`,
      notes: [
        "感谢信最忌空泛。写“你指出我的论证过宽，帮我收窄到一个可回答的问题”，比“您的指导让我受益匪浅”有效得多。",
        "第二段写“影响”，不是重复感谢；这能让 100 词的信有实质内容。",
        "不要虚构夸张的成果，如“发表了论文”“获得大奖”，考官一眼能看出套作。"
      ]
    },
    {
      type: "投诉信",
      scene: "网上书店迟迟未发货，客服两次未回复，写信投诉并要求退款。",
      structure: [
        ["第一段", "说明交易事实：时间、订单号、承诺与实际情况。"],
        ["第二段", "指出核心问题（不是延迟本身，而是没有任何解释），提出明确诉求。"],
        ["第三段", "要求回复，保持礼貌但坚定。"]
      ],
      patterns: [
        "On 3 May I ordered ... from your website (order number ...).",
        "The website promised delivery within three days, but ...",
        "What concerns me is not ... but ...",
        "I would be grateful if you could confirm ... and, if not, refund the payment."
      ],
      sample: `Dear Customer Service,

On 3 May I ordered a copy of The Craft of Research from your website (order number 20481). The website promised delivery within three days, but the book has not arrived, and two emails to your support team have received no reply.

I understand that delays happen. What concerns me is the absence of any explanation. I would be grateful if you could confirm whether the order is still being processed and, if not, refund the payment.

I look forward to hearing from you.

Yours faithfully,
Li Ming`,
      notes: [
        "投诉信要“对事不对人”：先陈述事实，再说明诉求，避免情绪化形容词。",
        "What concerns me is ... 把抱怨转为具体问题，语气更专业。",
        "明确诉求（确认订单或退款），不要只写“希望尽快处理”，否则对方无从执行。"
      ]
    },
    {
      type: "通知",
      scene: "学院将举办语言与技术国际会议，招募学生志愿者。",
      structure: [
        ["标题", "Notice，居中。"],
        ["第一段", "活动名称、时间、地点、招募对象。"],
        ["第二段", "要求、培训安排、待遇。"],
        ["第三段", "报名方式与截止日期，署名与日期。"]
      ],
      patterns: [
        "The School of Foreign Languages will host ... on ...",
        "We are looking for twenty student volunteers to assist with ...",
        "Volunteers should be able to ... and be available for ...",
        "Those interested should send ... to ... by ..."
      ],
      sample: `Notice

The School of Foreign Languages will host an international conference on language and technology on 12-13 June. We are looking for twenty student volunteers to assist with registration, guest reception and room coordination.

Volunteers should be able to communicate in English and be available for at least one full day. Training will be provided on 8 June. Participants will receive a certificate and meals during the event.

Those interested should send their name, student number and available dates to conference@university.edu.cn by 30 May.

The Organizing Committee`,
      notes: [
        "通知不需要称呼和结尾敬语；标题、正文、署名即可。",
        "把“要求、培训、待遇、报名方式”四件事写全，比堆砌礼貌用语得分高。",
        "时间、地点、邮箱、截止日期必须具体；这是通知类应用文的信息核心。"
      ]
    },
    {
      type: "邀请信",
      scene: "邀请校友参加职业分享会并做三十分钟发言。",
      structure: [
        ["第一段", "发出邀请，说明活动名称、时间与受众。"],
        ["第二段", "说明为什么邀请对方、希望讲什么、时长安排。"],
        ["第三段", "询问是否方便，说明可承担的费用，等待回复。"]
      ],
      patterns: [
        "On behalf of ..., I am writing to invite you to ...",
        "We would be particularly interested in your experience of ...",
        "A thirty-minute talk followed by questions would suit our programme well.",
        "Please let us know if the date is convenient."
      ],
      sample: `Dear Mr. Wang,

On behalf of the Student Career Association, I am writing to invite you to speak at our annual career forum on 20 November. The forum will bring together about 150 students from different departments, most of whom are preparing for their first job search.

We would be particularly interested in your experience of moving from a technical role into management. A thirty-minute talk followed by questions would suit our programme well.

Please let us know if the date is convenient. We would be glad to cover your travel costs.

Yours sincerely,
Li Ming`,
      notes: [
        "邀请信的关键是“给对方一个答应的理由”：说明受众、主题与对方经历的关联。",
        "把时长、形式（演讲 + 提问）写清楚，方便对方判断。",
        "主动提出承担交通费用，是商务邀请中的常见礼貌，也显得考虑周全。"
      ]
    },
    {
      type: "道歉信",
      scene: "与外教约好周三下午讨论论文选题，因突发流感无法赴约，写信说明并请求改期。",
      structure: [
        ["第一段", "直接道歉，说明原定的约定（时间、事由）。"],
        ["第二段", "说明具体原因，不写模糊借口；用行动补救（附提纲、请求改期）。"],
        ["第三段", "再次致歉，把时间安排的决定权交给对方。"]
      ],
      patterns: [
        "I am writing to apologise for missing our appointment on Wednesday afternoon.",
        "I came down with flu the night before and was in no condition to travel.",
        "To avoid costing you more time, I have attached a short outline of my topic.",
        "Would it be possible to meet again at your convenience next week?"
      ],
      sample: `Dear Professor Smith,

I am writing to apologise for missing our appointment on Wednesday afternoon, when we were to discuss my thesis topic. I came down with flu the night before and was in no condition to leave my room.

I do not want to cost you more time, so I have attached a two-page outline of the topic and the sources I plan to use. If it is convenient, I would be grateful for another meeting next week, at any time that suits you.

Please accept my apology for the short notice. I will come prepared to discuss your comments in person.

Yours sincerely,
Li Ming`,
      notes: [
        "道歉信按“承认失约—说明原因—提出补救”三段推进，不要把道歉重复成一段。",
        "用“附上两页提纲”这样的行动补救，比连续说 sorry 更能挽回印象。",
        "改期意向要具体（下周），但把具体时间交给对方决定，分寸得体。"
      ]
    },
    {
      type: "申请信",
      scene: "申请加入暑期社区英语辅导项目，需要说明自身条件并等待面试。",
      structure: [
        ["第一段", "说明申请的项目、信息来源与自身身份。"],
        ["第二段", "逐条对应项目要求写条件：经历、能力、对地点的熟悉。"],
        ["第三段", "表示可参加面试、可提供推荐人，留下联系方式。"]
      ],
      patterns: [
        "I am writing to apply for a place in the summer tutoring programme advertised on the noticeboard.",
        "The programme calls for patience and basic teaching skills, and I believe I can meet both.",
        "Last term I spent two hours a week helping first-year students with pronunciation.",
        "I would be glad to attend an interview at any time and can provide references."
      ],
      sample: `Dear Sir or Madam,

I am a second-year English major and I am writing to apply for a place in the summer tutoring programme advertised on the department noticeboard.

The programme calls for patience and basic teaching skills, and I believe I can meet both. Last term I spent two hours a week helping first-year students with pronunciation, and I have taken a course in language teaching methods. I also know the neighbourhood where the programme will run, as I volunteered at its community centre during the winter holiday.

I would be glad to attend an interview at any time and can provide references from two teachers.

Yours faithfully,
Li Ming`,
      notes: [
        "申请信的核心不是“我很优秀”，而是“我符合你们的要求”：把项目条件逐条对应地写。",
        "用一段可核实的经历（纠音辅导、社区志愿）证明能力，比堆形容词可信。",
        "结尾给出下一步动作：可面试、可提供推荐人，方便对方安排。"
      ]
    },
    {
      type: "咨询信",
      scene: "想报名英语演讲工作坊，写信询问分班、时间、费用与截止日期。",
      structure: [
        ["第一段", "说明从何处得知该项目，以及写信目的。"],
        ["第二段", "把要问的问题按 first / second / third 列出，一条一问。"],
        ["第三段", "表达兴趣，附联系方式，等待回复。"]
      ],
      patterns: [
        "I am writing to enquire about the English public-speaking workshop advertised in the student newspaper.",
        "Could you kindly clarify three points?",
        "I would also like to know whether the fee covers the course materials.",
        "I would appreciate a reply at your earliest convenience."
      ],
      sample: `Dear Sir or Madam,

I read about the English public-speaking workshop in the student newspaper and I am writing to enquire about the details before registering.

Could you kindly clarify three points? First, is there a placement test to decide the class level? Second, are the sessions held on weekday evenings or at weekends? Third, does the fee include the course materials mentioned in the advertisement? I would also like to know the deadline for registration.

I am very interested in the programme and would appreciate a reply at your earliest convenience. My email address is liming@university.edu.cn.

Yours faithfully,
Li Ming`,
      notes: [
        "咨询信的价值在于“把问题问清楚”：分条提问，对方才能逐条回答。",
        "不要写 tell me everything about the course；具体问题是得分点，也是真实沟通的基本功。",
        "附邮箱并保持礼貌收尾，比反复说 I am interested 更有诚意。"
      ]
    },
    {
      type: "祝贺信",
      scene: "好友被心仪大学的研究生院录取，写信祝贺并提议临行前聚一次。",
      structure: [
        ["第一段", "开门见山祝贺，说明从何处得知好消息。"],
        ["第二段", "写你亲眼见到的努力细节，让祝贺有分量、不流于客套。"],
        ["第三段", "送上祝愿，并给出一个具体提议（聚会、保持联系）。"]
      ],
      patterns: [
        "I was delighted to hear that you have been admitted to ...",
        "The news came as no surprise to those of us who watched you prepare.",
        "Getting there took more than luck: you ...",
        "Let us know when you are free, and we will celebrate properly."
      ],
      sample: `Dear Chen,

I was delighted to hear that you have been admitted to the graduate programme in journalism at your first-choice university. Your message arrived last night, and I read it twice to be sure.

The news came as no surprise to those of us who watched you prepare. You spent a year rewriting your application essays and never once complained about the rejections along the way. Getting there took more than luck, and the result is the one you deserved.

Warmest congratulations. Let us know when you are free, and we will celebrate properly before you leave.

Best wishes,
Li Ming`,
      notes: [
        "祝贺信要有“具体”的祝贺：写出你亲眼见到的努力，而不是只重复 congratulations。",
        "避免夸张之词（the best ever）；点出对方付出的细节，反而更可信。",
        "结尾落在一个具体提议上（临行前聚一次），让信有真实的人情味。"
      ]
    },
    {
      type: "推荐信",
      scene: "为你的学生写推荐信，推荐其申请暑期海外交换项目。",
      structure: [
        ["第一段", "说明推荐人身份与推荐关系：认识多久、什么场合。"],
        ["第二段", "用一两个具体事例证明能力，给出对比性评价而非形容词。"],
        ["第三段", "明确表态推荐，并留下可补充信息的渠道。"]
      ],
      patterns: [
        "I am writing to recommend ... for the summer exchange programme at your university.",
        "I have known her for three years, first as a student in my ... course.",
        "What distinguishes her is not only ... but ...",
        "I recommend her without reservation and would be glad to provide further details."
      ],
      sample: `Dear Selection Committee,

I am writing to recommend Wang Yue for the summer exchange programme at your university. I have taught her for three years, first in my academic writing course and later as her thesis supervisor.

What distinguishes her is not only her language ability but her persistence. When her first field study fell through last spring, she redesigned the project within a week and completed it with data she collected herself. She also volunteers as a note-taker for a deaf student in her year, which says something about how she treats the people around her.

I recommend her without reservation and would be glad to provide further details.

Yours sincerely,
Li Ming`,
      notes: [
        "推荐信的分量来自“具体事例 + 对比性评价”，不是形容词清单。",
        "写清你与推荐对象的关系和时长，评审才知道这份推荐的分量。",
        "结尾明确表态（without reservation），并留下补充信息的渠道。"
      ]
    }
  ],

  big: [
    {
      kind: "图画作文",
      topic: "短视频与注意力",
      prompt: "图画：深夜书桌前，学生盯着发亮的手机，摊开的书一页未翻。文字说明：“近在眼前，远在天边”。",
      structure: [
        ["第一段", "描述图画：人物、动作、关键细节、文字说明。控制在 50 词左右。"],
        ["第二段", "揭示寓意：即时娱乐与深度学习的冲突；分析机制而非喊口号。"],
        ["第三段", "给出可执行的建议，收束到“注意力”这一核心。"],
      ],
      sample: `The drawing shows a student at a desk late at night. The lamp is on, books are open, but his eyes are fixed on a phone screen, and the pages in front of him have not been turned. The caption reads: "So close, yet so far."

This scene captures a familiar tension. Digital devices offer instant entertainment, while serious study requires sustained attention. When every spare minute is filled with short videos, the mind becomes accustomed to rapid rewards and less willing to tolerate the slower pace of reading and reflection. The problem is not the phone itself, but the habit of reaching for it whenever a task becomes difficult.

The solution is not to abandon technology but to set boundaries. Students can keep phones out of sight during study hours, divide work into manageable blocks, and protect at least one period each day for uninterrupted reading. Universities can also provide quiet spaces and practical guidance on digital habits.

Attention is the raw material of learning. Those who learn to guard it will have an advantage that no device can supply.`,
      notes: [
        "描述段只抓“深夜、书未翻、手机亮”三个细节，不逐像素描写。",
        "分析段解释“即时奖励—注意力碎片化”的机制，比“我们应该放下手机”更有内容。",
        "建议要可执行：收手机、分块工作、保留一段不被打断的阅读时间。"
      ]
    },
    {
      kind: "图画作文",
      topic: "过度保护",
      prompt: "图画：一家三口登山，父母背着背包、水壶和外套，孩子空手走在前面看手机。文字说明：“最重的爱”。",
      structure: [
        ["第一段", "描述对比：父母负重，孩子空手；点出文字说明的反讽。"],
        ["第二段", "分析“过度保护”的代价：责任感、独立性、面对失败的能力。"],
        ["第三段", "提出“支持而不代替”的做法，回到爱的本义。"],
      ],
      sample: `The picture shows a family climbing a mountain. The parents carry the backpack, the water bottle and even the jacket, while their teenage son walks ahead, looking at his phone. The caption reads: "The heaviest burden is love."

The scene is meant to be ironic. Parents who do everything for their children believe they are being kind, but they may be depriving them of the chance to develop responsibility. A young person who never carries his own bag will struggle when he has to carry a project, a team or a family. Overprotection, however well intentioned, can become a form of neglect.

The remedy is not to withdraw support but to redistribute it. Parents can let children manage their own belongings, make small decisions and face the consequences. Schools can assign tasks that require persistence rather than talent alone.

Love should prepare a person for the world, not shelter him from it. The greatest gift a parent can give is the confidence that comes from having done something difficult alone.`,
      notes: [
        "把“背包”当作责任的隐喻，文章就有了解读层次，不停留在“父母太溺爱”。",
        "第二段用“从未背过自己包的人，如何承担项目、团队、家庭”推进后果，逻辑具体。",
        "结尾避免“让我们…”，用判断句收束，更像议论文而不是倡议书。"
      ]
    },
    {
      kind: "图画作文",
      topic: "传统与创新",
      prompt: "图画：小剧场内，老艺人幕后操纵皮影，年轻人用手机直播，屏幕上不断出现点赞。文字说明：“老戏台，新观众”。",
      structure: [
        ["第一段", "描述新旧同框：皮影、手机、直播、观众。"],
        ["第二段", "分析直播对传统文化的作用：扩大受众，但不能替代技艺本身。"],
        ["第三段", "提出传承的关键：保留技艺、解释历史、让年轻人有理由学。"],
      ],
      sample: `The drawing shows an old shadow-puppet performer and a young woman in the same small theatre. He manipulates the figures behind the screen; she holds a phone, livestreaming the performance to an audience of thousands. The caption reads: "Old art, new stage."

This image offers a hopeful answer to a difficult question: how can traditional culture survive in a digital age? Many forms of heritage are fragile because they depend on a small number of practitioners and a local audience. Livestreaming does not change the art itself, but it changes who can see it. A craft that once belonged to a village can now reach students, designers and curious viewers in other cities.

Yet technology is only a channel. If the performance is reduced to a backdrop for novelty, the audience will leave as quickly as it arrived. The real work is to preserve the skill, explain its history and give young people a reason to learn it.

Tradition is not a photograph to be protected under glass. It is a practice that lives only when someone chooses to perform it. New stages can help, provided the performance is worth watching.`,
      notes: [
        "描述时用“他操纵皮影 / 她举着手机”对照，一句就建立新旧关系。",
        "第二段先承认直播的价值，再指出局限，避免一边倒的赞美。",
        "结尾“Tradition is not a photograph...”是全文的观点句，前面的描写都在为它服务。"
      ]
    },
    {
      kind: "图表作文",
      topic: "阅读方式变化",
      prompt: "柱状图：某市居民主要阅读方式占比，2016 与 2026 对比。纸质书 58%→31%，手机 22%→51%，电子阅读器 12%→10%，有声书 8%→8%。",
      structure: [
        ["第一段", "概述图表主题，挑两到三个最关键的数据对比，不逐项报数。"],
        ["第二段", "解释变化原因：便利、成本、碎片时间。"],
        ["第三段", "评价影响：阅读更易获得，但注意力更易被打断；提出应对。"],
      ],
      sample: `The bar chart compares the main reading habits of residents in a Chinese city in 2016 and 2026. Paper books fell from 58% to 31%, while reading on mobile phones rose from 22% to 51%. E-readers and audio books remained relatively stable, at around 10% and 8% respectively.

Several factors explain the shift. Smartphones are always at hand, and reading apps make it easy to fill a few spare minutes. The decline of paper is also a matter of cost and convenience: a single device can hold hundreds of books.

The trend has consequences. Mobile reading may widen access, but it also encourages fragmentation; a page is often interrupted by messages and notifications. Publishers and schools should respond not by resisting the change, but by improving what is offered in digital form and by teaching readers how to protect their attention.

Reading is not defined by the surface it appears on. What matters is whether the text is read with patience and thought.`,
      notes: [
        "图表作文第一段只报“变化最大”和“基本不变”的数据，避免把四个数字全抄一遍。",
        "第二段用“设备在手、填充碎片时间、成本与便利”解释，不需要编造调查。",
        "第三段从“获取”转向“注意力”，让文章有评价而不只是描述。"
      ]
    },
    {
      kind: "图表作文",
      topic: "在线课程使用率",
      prompt: "折线图：某高校学生每周至少使用一次在线课程平台的比例，2019—2025：21%、63%、58%、49%、54%、61%、68%。",
      structure: [
        ["第一段", "概括总体趋势，点出 2020 年峰值与 2022 年回落。"],
        ["第二段", "解释两次变化：疫情迫使、线下恢复、之后找到补充定位。"],
        ["第三段", "讨论高校应如何利用在线资源，警惕“录制即教学”。"],
      ],
      sample: `The line chart traces the proportion of students at a university who used online course platforms at least once a week between 2019 and 2025. The figure stood at 21% in 2019, jumped to 63% in 2020, fell back to 49% in 2022, and then climbed steadily to 68% in 2025.

The pattern reflects two forces. The sharp rise was driven by necessity: when classrooms closed, online platforms became the only way to continue teaching. The later decline suggests that students returned to face-to-face classes once they could. The steady growth after 2022 is more interesting. It implies that online learning has found a durable role, not as a replacement for the classroom but as a supplement to it.

Universities should treat this as an opportunity rather than a threat. Recorded lectures and discussion forums can free class time for debate and practice. The risk is that online materials become an excuse for poor teaching.

A screen cannot replace a teacher, but it can extend the reach of a good one.`,
      notes: [
        "折线图不要只写“上升”，要分出“激增—回落—稳步上升”三段，文章才有分析空间。",
        "把 2020 的峰值归因于“必要性”，把 2022 后的增长归因于“补充定位”，解释更有层次。",
        "结尾区分“替代”与“延伸”，是对全文论证的收束，不是空泛口号。"
      ]
    },
    {
      kind: "图表作文",
      topic: "新能源汽车与充电桩",
      prompt: "柱状图：某市新能源汽车保有量与公共充电桩数量，2018—2025。汽车（万辆）：2.1、3.8、6.5、12.4、21.7、36.2、55.8、78.4；充电桩（万个）：0.4、0.7、1.3、2.6、4.9、8.1、12.6、18.9。",
      structure: [
        ["第一段", "概括两条曲线同步上升，报起止数据与倍数，不逐年报数。"],
        ["第二段", "解释增长的条件：政策、电池成本、使用成本、充电网络互相支撑。"],
        ["第三段", "从“卖了多少”转向“用得好不好”：电网、旧电池、公共空间。"],
      ],
      sample: `The chart compares new energy vehicles with public charging points in a Chinese city from 2018 to 2025. Car ownership grew from about 21,000 to 784,000, while chargers rose from 4,000 to 189,000. Both curves are steep, and they climb together.

The parallel growth is no coincidence. Policy played a part: subsidies, tax breaks and licence plates easier to obtain than those for petrol cars. Falling battery prices made the vehicles affordable, and lower running costs attracted drivers. A dense charging network, in turn, made ownership practical. Each condition supported the others; had chargers lagged behind, sales would have stalled.

The trend is encouraging, yet it raises questions that sales figures hide. Charging demand will strain the grid in older neighbourhoods, and used batteries must be recycled rather than stockpiled. Public chargers also compete for space with parking and pavements.

Adoption is a beginning. The test of an electric city is not how many cars are sold, but how well their owners can live with them.`,
      notes: [
        "两条曲线同步上升时，重点不是分别报数，而是点出“增长互为条件”。",
        "第二段用政策、成本、充电网络三个因素，并说明它们如何相互支撑。",
        "结尾从“卖出去”转到“用得好”，数据作文才有评价而不只是复述。"
      ]
    },
    {
      kind: "图画作文",
      topic: "数字生活与代际互助",
      prompt: "图画：社区活动室里，一位老人举着手机，向身旁的学生志愿者请教扫码付款；桌上放着一本手写笔记。文字说明：“新课堂”。",
      structure: [
        ["第一段", "描述人物、动作与关键细节（手写笔记），点出文字说明。"],
        ["第二段", "揭示寓意：数字服务的门槛与代际互助；问题多在设计与习惯，不在能力。"],
        ["第三段", "提建议：保留线下渠道、按真实任务设计课程；教学也是双向的。"],
      ],
      sample: `The drawing shows a community room where an elderly woman holds up her phone, asking the student beside her how to pay with a QR code. On the table lies a notebook in which she has written each step by hand. The caption reads: "A new class."

The scene is warm, but it points to an uncomfortable fact. Services from hospital appointments to bus tickets have moved online, and those who cannot follow are quietly excluded. Their difficulty is rarely a matter of intelligence; it comes from interfaces designed for confident users, and from the fear of making an expensive mistake.

Closing the gap takes more than patience. Public services should keep a counter or a hotline for people who prefer to speak to a human being. Communities can run short courses, as this room does, built around tasks people actually need: booking a doctor, buying a ticket, paying a bill. Young volunteers gain something too, since explaining a familiar step reveals how much they have taken for granted.

A technology belongs to a society only when its oldest members can use it.`,
      notes: [
        "描写段放进“手写笔记”这一细节，把学习门槛写得具体，也为下段分析埋伏笔。",
        "第二段避开“要关爱老人”的套话，转从界面设计与公共服务方式找原因。",
        "建议落到挂号、买票、缴费这类真实任务上，比“多开培训班”更可执行。"
      ]
    },
    {
      kind: "图画作文",
      topic: "旧物交换与消费习惯",
      prompt: "图画：小区广场上办起旧物交换市集，男孩用玩具车换了一摞绘本，邻居在摊位前交谈。文字说明：“旧物新生”。",
      structure: [
        ["第一段", "描述场景：摊位、交换行为、邻里交流，点出文字说明。"],
        ["第二段", "揭示寓意：物品缺的不是价值，而是下一个使用者；平台让流转变得方便。"],
        ["第三段", "讨论让这种习惯持续的条件：便利与信任、城市空间、观念转变。"],
      ],
      sample: `The drawing shows a neighbourhood square turned into a market for used goods. A boy trades his model cars for a stack of picture books, and two neighbours chat over a table of tools and kitchenware. A banner above them reads: "Old things, new lives."

The scene questions a familiar habit: buying, using once and discarding. Many cupboards are full of objects that were briefly useful and are still in good condition; what they lack is not value but a second owner. Exchange events and second-hand platforms make the transfer visible and convenient, turning an idea about waste into an ordinary weekend activity.

For the habit to last, convenience and trust matter more than slogans. Platforms need simple tools for inspection, pricing and delivery; cities can reserve space where such markets may operate; and families can treat repair and resale as normal rather than embarrassing.

Thrift used to be a response to scarcity. It can become a habit of prosperity — chosen, not forced.`,
      notes: [
        "描写段用“玩具车换绘本”一个小场景切入，比堆环保口号清楚。",
        "第二段把问题定为“物品缺的不是价值，而是下一个使用者”，立意比“要节约”新。",
        "结尾用“匮乏时代的节约”与“丰裕时代的选择”对照，避免说教口吻。"
      ]
    },
    {
      kind: "图表作文",
      topic: "人口老龄化与社区养老",
      prompt: "柱状图：某市 65 岁及以上人口占常住人口比例，2010、2015、2020、2025 分别为 9.1%、11.4%、14.2%、18.6%。",
      structure: [
        ["第一段", "描述占比持续上升，点出 2020 年后加速；四个数据不必全抄。"],
        ["第二段", "解释原因：寿命延长、出生数下降、成年子女外迁。"],
        ["第三段", "不把老人一律写成“负担”：社区服务、适老改造、照护人力、银发经济。"],
      ],
      sample: `The bar chart shows the share of residents aged 65 and above in a Chinese city from 2010 to 2025. The figure rose from 9.1% to 11.4% in the first five years, reached 14.2% in 2020, and climbed to 18.6% by 2025. The increase has been steady, and it has accelerated since 2020.

Demography explains most of the trend. People live longer than they did a generation ago, while the number of births has fallen, so the elderly form a larger share of a slowly growing population. Migration matters too: in many families, adult children work in larger cities and leave their parents behind.

An ageing society is often described as a burden, but the label hides the real question, which is how care is organized. Cities can expand community services, adapt housing and transport for people with limited mobility, and train more workers for the sector. Companies may find opportunities in the so-called silver economy, though consumption alone will not solve the problem of daily care.

The measure of a city is not how many people it keeps young, but how decently it allows them to grow old.`,
      notes: [
        "描述段抓“持续上升、近年加速”，四个数据不必全抄，避免变成读数。",
        "原因段从寿命、出生数、人口流动三个方向解释，比只写“老龄化是趋势”完整。",
        "结尾同时警惕“负担论”和“银发经济万能论”，用判断句收束。"
      ]
    },
    {
      kind: "图画作文",
      topic: "博物馆热",
      prompt: "图画：博物馆门前排起长队，多为年轻观众，有人举着手机出示预约码，有人拎着文创购物袋。文字说明：“一票难求”。",
      structure: [
        ["第一段", "描述长队、预约码、文创袋，点出文字说明。"],
        ["第二段", "分析热潮的来源（展览、文化认同、社交传播），并指出“打卡替代观看”的风险。"],
        ["第三段", "让热度可持续：预约限流、讲解引导、把耐心带回日常。"],
      ],
      sample: `The drawing shows a long queue outside a museum. Most of those waiting are young: one holds up a phone with a booking code, and several carry bags from the museum shop. A sign by the entrance reads: "Sold out."

The scene would have puzzled observers a decade ago, when museums were regarded as quiet places for specialists. Their new popularity has several sources: better-designed exhibitions, a growing interest in cultural identity, and social media that turns a good show into a shared event. The trend is welcome, yet it carries a risk. If visitors come mainly for photographs, the queue becomes the experience, and the objects on display are merely a backdrop.

To keep the interest alive, museums need more than enthusiasm. Timed booking protects the viewing experience; guided tours and audio guides help newcomers understand what they are looking at; and schools can teach students to look patiently rather than rush from one highlight to the next.

A full museum is good news. A museum where people actually see something is better.`,
      notes: [
        "描述段把“预约码”和“文创袋”写进画面：它们是新一代观众身份的两个符号。",
        "第二段先承认热潮的价值，再指出“拍照替代观看”的风险，避免一边倒。",
        "结尾用两句短句对照，收在“真正看到东西”上，不喊口号。"
      ]
    }
  ],

  patterns: [
    {
      label: "开头与描述",
      items: [
        ["The chart compares A and B over the period from 2019 to 2025.", "图表作文开头，交代对象与时间范围。"],
        ["The scene in the picture is simple, but it raises a question that is not.", "图画作文开头，避免“vividly depicts”这类滥调。"],
        ["At first glance, the figures suggest ...; on closer inspection, they reveal ...", "先给表层印象，再转折到深层含义。"],
        ["Behind the figures lies a shift that is easy to miss.", "数据作文中引出结构性变化。"],
        ["The most striking feature of the drawing is not ... but ...", "用对比抓住图画的核心细节。"]
      ]
    },
    {
      label: "数据对比",
      items: [
        ["A rose from 21% to 68%, while B moved in the opposite direction.", "一升一降，用 while 连接。"],
        ["The figure peaked at 63% in 2020 before falling back to 49%.", "描述峰值与回落，before 连接两个动作。"],
        ["The gap between the two groups narrowed steadily.", "描述差距变化，比反复报数字高级。"],
        ["Both groups followed a similar pattern, though at different speeds.", "两组趋势相似但幅度不同。"],
        ["The change is less dramatic than the raw numbers suggest.", "提醒读者不要只看表面幅度。"]
      ]
    },
    {
      label: "分析原因",
      items: [
        ["Several factors may account for this shift.", "原因段的标准开头，后面必须真的给两三个因素。"],
        ["The change is driven less by X than by Y.", "把原因分层，指出主因。"],
        ["One explanation is practical: ...", "从具体、可验证的原因写起。"],
        ["This is not simply a matter of preference; it reflects a deeper change in ...", "从个人选择上升到结构变化。"],
        ["The timing is telling: the rise began exactly when ...", "用时间点建立因果关联。"],
        ["It would be wrong to attribute the trend to a single cause.", "防止因果分析过于简单。"]
      ]
    },
    {
      label: "让步与转折",
      items: [
        ["It would be wrong to suggest that ...", "先挡掉一个极端观点，再立论。"],
        ["Yet the trend has a cost, and it is not evenly distributed.", "承认趋势，同时指出代价。"],
        ["This is not to say that ...; rather, ...", "修正而非全盘否定。"],
        ["The benefits are real, but they are not automatic.", "避免一边倒的赞美。"],
        ["However plausible this explanation sounds, it leaves one question unanswered.", "过渡到更深层分析。"]
      ]
    },
    {
      label: "结论与建议",
      items: [
        ["The solution is not to ... but to ...", "提出有区分度的对策。"],
        ["What matters is not whether ... but how ...", "把讨论从“要不要”推进到“怎么做”。"],
        ["Policies can set the frame, but habits do the work.", "强调制度与个人习惯的配合。"],
        ["A label can start a conversation; it cannot finish one.", "用短句收束，留有余味。"],
        ["The choice is ours, and it is being made every day.", "结尾回到行动，但避免感叹号。"]
      ]
    },
    {
      label: "应用文开头与收尾",
      items: [
        ["I am writing to suggest that ...", "建议信开头，直接交代目的。"],
        ["I am writing to apply for a place in ...", "申请信开头，说明申请对象。"],
        ["I regret to say that I will be unable to ...", "不能赴约或无法出席时的委婉说法。"],
        ["I would be grateful if you could clarify ...", "咨询信提出问题的礼貌句式。"],
        ["I look forward to hearing from you.", "投诉、咨询、申请类信件的通用收尾。"],
        ["Yours sincerely / Yours faithfully,", "知道对方姓名用前者，不知道用后者。"]
      ]
    }
  ],

  upgrades: [
    ["important", "crucial / pivotal", "crucial 更强，pivotal 强调转折点"],
    ["many people", "a growing number of people", "强调趋势，而非静态数量"],
    ["think", "argue / maintain / contend", "议论文中更精确"],
    ["show", "demonstrate / reveal / indicate", "demonstrate 偏论证，reveal 偏揭示"],
    ["cause", "give rise to / contribute to", "contribute to 不一定是唯一原因"],
    ["problem", "challenge / dilemma / drawback", "dilemma 强调两难"],
    ["help", "facilitate / enable", "facilitate 促进，enable 使能够"],
    ["use", "employ / draw on", "draw on 强调借鉴"],
    ["big", "substantial / considerable", "修饰数量、影响"],
    ["bad", "harmful / damaging", "比 bad 具体"],
    ["good", "beneficial / effective", "beneficial 偏益处"],
    ["change", "shift / transform", "shift 强调方向性变化"],
    ["because", "in that / owing to", "in that 更书面"],
    ["but", "yet / nevertheless", "nevertheless 更正式"],
    ["so", "consequently / as a result", "明确因果"],
    ["people", "individuals / the public", "按语境选择"],
    ["young people", "the younger generation", "避免反复用 young people"],
    ["old people", "older adults", "更中性、尊重"],
    ["money", "funding / resources", "公共语境用 funding"],
    ["government", "the authorities / policymakers", "policymakers 强调决策者"],
    ["say", "note / observe / point out", "转述观点时更准确"],
    ["get", "obtain / secure", "secure 强调争取到"],
    ["need", "require / call for", "call for 强调呼吁"],
    ["stop", "curb / restrain", "curb 常与 inflation, spending 搭配"],
    ["increase", "surge / climb", "surge 强调激增"],
    ["decrease", "decline / fall", "decline 更正式"],
    ["difficult", "demanding / challenging", "demanding 强调要求高"],
    ["easy", "straightforward", "straightforward 强调不复杂"],
    ["wrong", "misguided / flawed", "flawed 指论证有缺陷"],
    ["always", "consistently / without exception", "避免绝对化"]
  ],

  criteria: [
    ["内容", "切题、要点完整。小作文信息点齐全；大作文描述准确、分析有因果、结论明确。"],
    ["结构", "三段清晰，段内有层次。连接词服务于逻辑，而不是每句都加一个。"],
    ["语言", "语法准确优先于词汇华丽。允许少量复杂句，但不冒险写没把握的结构。"],
    ["格式", "小作文注意称呼、正文、结尾、署名；通知用标题 + 正文 + 署名，不用敬语。"],
    ["字数", "小作文约 100 词；英语一大作文 160–200 词；英语二大作文 150 词以上。少 10 词不明显，少 30 词必扣分。"]
  ],

  pitfalls: [
    "模板句堆砌，内容空洞。整篇都是“With the development of society”，却没有一个具体判断。",
    "图画描述过多。英语一大作文描述段超过一半，分析只剩两句，内容分上不去。",
    "图表作文只报数字，不解释变化，也不评价影响。",
    "观点绝对化：all, never, must, completely。议论文要留有余地。",
    "小作文格式错误：投诉信结尾用 Yours sincerely 却不知道对方姓名；通知加了 Dear Sir。",
    "段落不分，或一段到底。三段是最稳的结构，但每段必须有中心句。",
    "套用与题目无关的“万能”句子，逻辑断裂，考官一眼能看出。",
    "字数严重不足，或超到 250 词以上，挤占其他题型时间。",
    "拼写与主谓一致错误集中出现，比如 government are, benefit 写成 benifit。",
    "结尾只喊口号，不回应前文提出的问题。"
  ]
};
