/* 易混词组：按考研最常见的拼写/词性混淆整理。 */
window.VOCAB_DETAIL = Object.assign(window.VOCAB_DETAIL || {}, {
  "affect / effect": {
    use: "affect 是动词“影响”；effect 通常作名词“影响、效果”，作动词时意为“实现、造成”。",
    phr: ["affect the outcome 影响结果", "have an effect on 对……有影响", "effect a change 实现改变"],
    ex: "The new tax affected consumer spending, but its effect on inflation was small.",
    exCn: "新税影响了消费支出，但对通胀的影响很小。",
    deep: "看到“影响”先判断词性：缺谓语用 affect；有冠词/形容词修饰多用 effect；effect 作动词非常正式，考研阅读中少见。"
  },
  "adapt / adopt / adept": {
    use: "adapt 是“适应/改编”；adopt 是“采用/收养”；adept 是形容词“熟练的”。",
    phr: ["adapt to change 适应变化", "adopt a policy 采用政策", "be adept at 擅长"],
    ex: "Firms that adapt quickly are more likely to adopt new technologies and become adept at using them.",
    exCn: "能迅速适应的公司更可能采用新技术，并变得善于使用它们。",
    deep: "三个词只差一两个字母：adapt 含“调整”，adopt 含“拿走采用”，adept 与 expert 近义；先看词性和介词。"
  },
  "principal / principle": {
    use: "principal 可作形容词“主要的”或名词“校长/本金”；principle 是名词“原则、原理”。",
    phr: ["the principal reason 主要原因", "in principle 原则上", "a matter of principle 原则问题"],
    ex: "The principal reason for the delay was a disagreement over principle, not money.",
    exCn: "延误的主要原因是原则上的分歧，而不是钱。",
    deep: "principle 只作名词，结尾 -ple 与 rule 的“原则”对应；principal 可作形容词/名词，结尾 -pal 像“朋友”，可指校长。"
  },
  "complement / compliment": {
    use: "complement 是“补充、补足”；compliment 是“赞美、恭维”。",
    phr: ["complement each other 相互补充", "a compliment on 对……的赞美", "pay sb a compliment 赞美某人"],
    ex: "Her remarks complemented his argument, and he took them as a compliment.",
    exCn: "她的话补充了他的论证，他把它当作赞美。",
    deep: "complement 与 complete 同源，强调“补全”；compliment 与 polite 相关，强调“客气/赞美”。"
  },
  "ensure / assure / insure": {
    use: "ensure 是“确保某事发生”；assure 是“向某人保证、使确信”；insure 是“投保”。",
    phr: ["ensure that 确保……", "assure sb of sth 向某人保证", "insure against 为……投保"],
    ex: "The company assured investors that it had insured the cargo and would ensure timely delivery.",
    exCn: "公司向投资者保证已为货物投保，并将确保按时交付。",
    deep: "ensure 后接事实/that 从句；assure 必须接人作宾语；insure 与 insurance 同源，涉及金钱赔付。"
  },
  "rise / raise / arise": {
    use: "rise 不及物“上升”；raise 及物“提高、抚养”；arise 不及物“出现、产生”，多指问题/情况。",
    phr: ["prices rise 价格上涨", "raise awareness 提高意识", "problems arise 问题出现"],
    ex: "As prices rose, questions arose about whether the government would raise taxes.",
    exCn: "随着价格上涨，人们开始质疑政府是否会增税。",
    deep: "rise 不带宾语；raise 必须带宾语；arise 常与 problem、question、issue 搭配，不表示物理上升。"
  },
  "lie / lay": {
    use: "lie（lay, lain）不及物“躺、位于”；lie（lied, lied）是“说谎”；lay（laid, laid）及物“放置、产卵”。",
    phr: ["lie on the table 躺在桌上", "lay the foundation 奠定基础", "tell a lie 说谎"],
    ex: "The documents lay on the desk where he had laid them the night before.",
    exCn: "文件躺在他前一晚放置的桌子上。",
    deep: "lie 的过去式 lay 与及物动词 lay 原形同形，是最大陷阱；看后面有没有宾语：有宾语多用 lay。"
  },
  "economic / economical": {
    use: "economic 是“经济的、经济学的”；economical 是“节约的、划算的”。",
    phr: ["economic growth 经济增长", "economic policy 经济政策", "economical with money 省钱"],
    ex: "The government's economic policy is not always economical for small firms.",
    exCn: "政府的经济政策对小企业并不总是划算。",
    deep: "economic 修饰“经济领域”；economical 修饰“省钱/高效”，常与 with 搭配。"
  },
  "historic / historical": {
    use: "historic 是“具有历史意义的”；historical 是“历史的、与历史有关的”。",
    phr: ["a historic decision 历史性决定", "historical evidence 历史证据", "historical context 历史背景"],
    ex: "The court's decision was historic, but it rested on a long historical tradition.",
    exCn: "法院的裁决具有历史意义，但它建立在悠久的历史传统之上。",
    deep: "historic 强调“重要到会写进历史”；historical 只说明“属于历史”，不含重要性。"
  },
  "sensible / sensitive": {
    use: "sensible 是“明智的、合理的”；sensitive 是“敏感的、易受伤害的”。",
    phr: ["a sensible decision 明智的决定", "be sensitive to 对……敏感", "sensitive information 敏感信息"],
    ex: "It would be sensible to treat the data as sensitive until the review is complete.",
    exCn: "在审查完成前，把这些数据视为敏感信息是明智的。",
    deep: "sensible 与 sense“判断力”有关；sensitive 与 sense“感觉”有关，常接 to。"
  },
  "continual / continuous": {
    use: "continual 指“反复发生、断断续续”；continuous 指“连续不断、没有中断”。",
    phr: ["continual interruptions 反复打断", "continuous growth 持续增长", "a continuous line 连续的线"],
    ex: "Continual interruptions made continuous work impossible.",
    exCn: "反复的打断使连续工作变得不可能。",
    deep: "continual 含“烦人地反复”；continuous 强调时间/空间上没有断点。"
  },
  "alternate / alternative": {
    use: "alternate 是“交替的、轮流”；alternative 是“替代的、另一种选择”。",
    phr: ["alternate between A and B 在 A 与 B 之间交替", "an alternative option 替代方案", "have no alternative 别无选择"],
    ex: "The two systems alternate, but neither offers a real alternative to the old one.",
    exCn: "两种系统交替使用，但都不能真正替代旧系统。",
    deep: "alternate 强调“轮换”；alternative 强调“可供替代”，写作中更常用。"
  },
  "imaginary / imaginative / imaginable": {
    use: "imaginary 是“虚构的、想象中的”；imaginative 是“富有想象力的”；imaginable 是“可想象的”。",
    phr: ["an imaginary world 虚构世界", "an imaginative solution 有想象力的方案", "the best imaginable 能想到的最好的"],
    ex: "The novel describes an imaginary country through the eyes of an imaginative child.",
    exCn: "小说通过一个富有想象力的孩子的眼睛描述了一个虚构国家。",
    deep: "imaginary 指“不存在”；imaginative 指“有创造力”；imaginable 常与最高级/形容词连用，表示“可想到的”。"
  },
  "respectable / respectful / respective": {
    use: "respectable 是“体面的、值得尊敬的”；respectful 是“恭敬的”；respective 是“各自的”。",
    phr: ["a respectable job 体面的工作", "be respectful of 尊重", "their respective roles 各自角色"],
    ex: "The three researchers returned to their respective labs and remained respectful of one another's work.",
    exCn: "三位研究人员回到各自的实验室，仍然尊重彼此的工作。",
    deep: "respectable 修饰“人或行为值得尊重”；respectful 修饰“态度恭敬”；respective 只表示“各自”，不涉及尊重。"
  },
  "beside / besides": {
    use: "beside 是“在……旁边”；besides 是“除……之外（还）”。",
    phr: ["beside the window 在窗边", "besides that 除此之外", "beside the point 离题"],
    ex: "Beside the main road stands a small shop; besides selling food, it repairs bicycles.",
    exCn: "主干道旁有一家小店；除了卖食品，它还修自行车。",
    deep: "beside 只表位置；besides 表递进/补充；beside the point 是固定搭配，意为“无关紧要”。"
  },
  "farther / further": {
    use: "farther 多指物理距离更远；further 可指距离，也可指程度“进一步”。",
    phr: ["farther away 更远", "further research 进一步研究", "furthermore 此外"],
    ex: "The village is farther from the station than it looks, and further delays are likely.",
    exCn: "村子离车站比看起来更远，而且很可能进一步延误。",
    deep: "现代英语中 further 可替代 farther 表距离；但“进一步”只能用 further。"
  },
  "later / latter": {
    use: "later 是“后来、较晚的”；latter 是“后者”，常与 the former 对应。",
    phr: ["later that day 当天晚些时候", "the latter 后者", "the former and the latter 前者与后者"],
    ex: "The latter proposal was rejected; later, a compromise was reached.",
    exCn: "后一个提案被否决；后来达成了妥协。",
    deep: "later 表时间；latter 表列举中的“后者”，必须与 the 连用，不能单独指时间。"
  },
  "moral / morale": {
    use: "moral 是“道德的、道德教训”；morale 是“士气”。",
    phr: ["moral judgment 道德判断", "boost morale 提振士气", "low morale 士气低落"],
    ex: "The moral of the story is that low morale can damage an organization's moral authority.",
    exCn: "这个故事的寓意是，士气低落会损害一个组织的道德权威。",
    deep: "morale 结尾 -e，与“士气”对应；moral 可作形容词/名词，注意不要漏掉 e。"
  },
  "personal / personnel": {
    use: "personal 是“个人的、私人的”；personnel 是“全体人员、人事部门”。",
    phr: ["personal experience 个人经历", "personnel management 人事管理", "military personnel 军事人员"],
    ex: "The personnel department keeps personal records separate from performance reviews.",
    exCn: "人事部门将个人记录与绩效评估分开保存。",
    deep: "personnel 是集合名词，通常作复数；personal 是形容词，注意拼写和重音。"
  },
  "precede / proceed": {
    use: "precede 是“在……之前发生”；proceed 是“继续进行、前往”。",
    phr: ["precede the meeting 在会议之前", "proceed with 继续进行", "proceed to 前往/进而"],
    ex: "A short briefing preceded the discussion, after which the committee proceeded to vote.",
    exCn: "讨论前有一个简短通报，随后委员会进行投票。",
    deep: "precede 含 pre-“在前”；proceed 含 pro-“向前”，常与 with/to 搭配。"
  },
  "stationary / stationery": {
    use: "stationary 是“静止的、不动的”；stationery 是“文具”。",
    phr: ["a stationary vehicle 停着的车辆", "office stationery 办公文具", "remain stationary 保持静止"],
    ex: "The van remained stationary while the driver looked for stationery in the glove box.",
    exCn: "货车停着不动，司机在手套箱里找文具。",
    deep: "stationary 结尾 -ary，与“停留”有关；stationery 结尾 -ery，与“文具店”有关，可用“e 像纸”记忆。"
  },
  "statue / status / statute": {
    use: "statue 是“雕像”；status 是“地位、状态”；statute 是“法规、成文法”。",
    phr: ["a bronze statue 铜像", "social status 社会地位", "by statute 依据法规"],
    ex: "The statue was moved, but its legal status under the statute did not change.",
    exCn: "雕像被移走了，但它在法规下的法律地位没有改变。",
    deep: "statue 有 ue，像“立像”；status 是“状态/地位”；statute 是“法规”，结尾 -ute 与 legal 语境搭配。"
  },
  "confirm / conform": {
    use: "confirm 是“确认、证实”；conform 是“遵守、符合”，常接 to。",
    phr: ["confirm a booking 确认预订", "confirm that 证实……", "conform to standards 符合标准"],
    ex: "The inspection confirmed that the building did not conform to safety standards.",
    exCn: "检查证实该建筑不符合安全标准。",
    deep: "confirm 含 firm“确定”；conform 含 form“形式”，强调与规则/标准一致。"
  },
  "elicit / illicit": {
    use: "elicit 是动词“引出、诱出”；illicit 是形容词“非法的、不正当的”。",
    phr: ["elicit a response 引出回应", "elicit information 获取信息", "illicit trade 非法贸易"],
    ex: "The interview was designed to elicit information about illicit payments.",
    exCn: "这次采访旨在获取有关非法付款的信息。",
    deep: "elicit 是动词，重音在第二音节；illicit 是形容词，与 illegal 近义，注意双 l。"
  },
  "device / devise": {
    use: "device 是名词“装置、手段”；devise 是动词“设计、想出”。",
    phr: ["a safety device 安全装置", "a rhetorical device 修辞手法", "devise a plan 设计计划"],
    ex: "The team devised a simple device to measure air quality.",
    exCn: "团队设计了一个简单的装置来测量空气质量。",
    deep: "device 是名词，结尾 -ce；devise 是动词，结尾 -se；看句子是否需要谓语。"
  }
});