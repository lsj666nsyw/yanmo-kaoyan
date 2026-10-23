/* 英语二 · 段落翻译题库（第 2、3 篇）。第 1 篇仍在 translation.js 的 TRANSLATIONS.passage。 */
window.TRANS_PASSAGES = [
  {
    id: 2,
    title: "远程办公的隐性成本",
    en: "Remote work was welcomed for the hours it gave back. Commuters no longer spent two hours on trains, and companies discovered that they could hire people who lived far from the office. Yet something that used to happen by accident has become difficult to arrange: the brief, unplanned conversation that solves a problem in five minutes or plants an idea for next month.\n\nIn an office, such exchanges are a by-product of shared space. On a video call, every minute has an agenda, and nobody schedules a chat about nothing. The result is not that remote workers are less productive; most studies find the opposite. The cost is paid by those who need to learn from others. A new employee can read documents, but documents rarely explain how a team actually makes decisions. The knowledge that matters most is often the knowledge nobody thought to write down.",
    ref: "远程办公曾因其节省的时间而受到欢迎。通勤者不再需要在火车上花两个小时，公司也发现可以雇用住在离办公室很远的人。然而，一件过去常常偶然发生的事现在却变得难以安排：那种五分钟就能解决问题、或者为下个月埋下一个想法的简短而即兴的交谈。\n\n在办公室里，这样的交流是共享空间的副产品。而在视频通话中，每一分钟都有议程，没有人会安排一场“什么正事都没有”的闲聊。结果并不是远程工作者的效率更低；多数研究得出的结论恰恰相反。代价由那些需要向他人学习的人来承担。新员工可以阅读文档，但文档很少解释一个团队实际上是如何做决定的。最重要的知识，往往正是没有人想到要写下来的知识。",
    points: [
      "was welcomed for the hours it gave back：译出“因为省下了时间而受欢迎”，不要逐字译成“为它还给的时间而欢迎”。",
      "the brief, unplanned conversation that solves... or plants...：定语从句拆成两个汉语短句，“简短而即兴的交谈”。",
      "by-product of shared space：保留比喻，译“共享空间的副产品”，不要译成“共同空间的副产品”。",
      "The cost is paid by those who need to learn from others：被动转主动更自然，“代价由那些需要向他人学习的人承担”。",
      "nobody thought to write down：译“没有人想到要写下来”，thought to 表“想到要……”，不是“以为”。"
    ],
    chunks: [
      ["Remote work was welcomed for the hours it gave back.", "远程办公因其节省的时间而受到欢迎。"],
      ["the brief, unplanned conversation that solves a problem in five minutes", "那种五分钟就能解决问题的简短而即兴的交谈"],
      ["such exchanges are a by-product of shared space", "这样的交流是共享空间的副产品"],
      ["The cost is paid by those who need to learn from others.", "代价由那些需要向他人学习的人承担。"]
    ],
    words: [
      ["commuter", "通勤者"],
      ["by-product", "副产品"],
      ["agenda", "议程；日程"],
      ["productive", "高效的；多产的"]
    ]
  },
  {
    id: 3,
    title: "慢读的价值",
    en: "Reading quickly is not the same as reading well. A headline can tell us that a study has found something surprising, but it cannot tell us how large the study was, who paid for it, or what the researchers themselves consider uncertain. Those details are precisely what slow reading is for.\n\nWhen we move through a text at the speed of conversation, we give ourselves time to notice a qualification, to ask whether a number supports the claim it appears to support, and to compare what is said on page two with what is said on page twenty. This is not a defence of reading everything slowly. Much of what we encounter deserves only a glance. The point is to choose deliberately, rather than to let the speed of the medium choose for us.",
    ref: "快速阅读并不等于读得好。一条标题可以告诉我们某项研究发现了令人惊讶的东西，但它无法告诉我们这项研究规模有多大、是谁出的钱，或者研究者自己认为哪些地方还不确定。而这些细节恰恰是慢读的用武之地。\n\n当我们以交谈的速度推进一篇文章时，我们给自己留出了时间：去注意到一处限定条件，去追问一个数字是否支撑了它表面上支撑的那个结论，并把第二页所说的内容与第二十页所说的内容作比较。这并不是主张读什么都慢。我们遇到的大部分内容只值得扫一眼。关键在于有意识地做出选择，而不是让媒介的速度替我们选择。",
    points: [
      "is not the same as：译“并不等于”，不能译成“和……不一样”而丢掉程度差别。",
      "how large the study was, who paid for it, or what... uncertain：三个并列宾语从句，译成三个短句，注意“谁出的钱”。",
      "what slow reading is for：what 引导表语从句，译“正是慢读的用武之地”。",
      "a defence of reading everything slowly：defence 此处是“辩护、主张”，不是“防御”。",
      "let the speed of the medium choose for us：译出“让媒介的速度替我们做选择”，choose for 表“替……选择”。"
    ],
    chunks: [
      ["Reading quickly is not the same as reading well.", "快速阅读并不等于读得好。"],
      ["how large the study was, who paid for it, or what the researchers themselves consider uncertain", "研究规模有多大、是谁出的钱、研究者自己认为哪些还不确定"],
      ["Those details are precisely what slow reading is for.", "这些细节恰恰是慢读的用武之地。"],
      ["to let the speed of the medium choose for us", "让媒介的速度替我们做选择"]
    ],
    words: [
      ["qualification", "限定条件；保留意见"],
      ["claim", "主张；断言"],
      ["deliberately", "有意识地；故意地"],
      ["medium", "媒介（复数 media）"]
    ]
  }
];