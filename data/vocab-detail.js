/* 词条精讲层：按单词合并进基础词库，不改动原 VOCAB 数据。
   字段：use 用法；phr 搭配；ex 例句；exCn 中译；deep 辨析/考点。 */
window.VOCAB_DETAIL = Object.assign(window.VOCAB_DETAIL || {}, {
  "abolish": {
    use: "及物动词，正式用语，常接制度、法律、习俗等抽象名词作宾语；不用于取消会议、订单等具体安排。",
    phr: ["abolish slavery 废除奴隶制", "abolish the death penalty 废除死刑", "abolish an outdated rule 废除过时规定"],
    ex: "The committee voted to abolish the rule after years of criticism from local residents.",
    exCn: "在地方居民多年批评之后，委员会投票废除了这项规定。",
    deep: "abolish 强调彻底终止一项长期存在的制度或做法；cancel 多指取消已安排的活动，eliminate 强调消除具体事物或问题。"
  },
  "abrupt": {
    use: "形容词，可修饰变化、结束或人的态度；含“突然且缺乏过渡”之意，形容人时带生硬、无礼的色彩。",
    phr: ["an abrupt change 突然的变化", "an abrupt ending 戛然而止的结局", "an abrupt manner 生硬的态度"],
    ex: "The abrupt ending of the negotiation surprised participants who had expected a longer discussion.",
    exCn: "谈判的突然结束让原本期待更长讨论的参与者感到意外。",
    deep: "abrupt 不只表示时间快，还强调缺少过渡或礼貌；sudden 仅指发生得快，不一定含负面评价。"
  },
  "absurd": {
    use: "形容词，表“荒谬、不合逻辑”，可作定语或表语；语气较强，常用来批评观点、制度或情境。",
    phr: ["an absurd idea 荒谬的想法", "an absurd situation 荒诞的处境", "it is absurd to do sth 做某事是荒唐的"],
    ex: "It is absurd to assume that economic growth can continue indefinitely without environmental limits.",
    exCn: "假设经济增长可以不受环境限制地无限持续下去，是荒谬的。",
    deep: "absurd 侧重违背理性或常识；ridiculous 更强调可笑、值得嘲笑，语气更轻蔑。"
  },
  "accelerate": {
    use: "及物或不及物动词，既可用于物体加速，也可用于抽象过程（增长、变化、衰退）加快。",
    phr: ["accelerate growth 加快增长", "accelerate the process 加速进程", "accelerate the transition 加快转型"],
    ex: "Cheap credit accelerated the rise in house prices, but it also made the eventual correction sharper.",
    exCn: "廉价信贷加快了房价上涨，但也使最终的调整更加剧烈。",
    deep: "accelerate 强调速度提高；promote 强调促进发展，不一定涉及速度；hasten 常指促使不快的事提前发生。"
  },
  "accessible": {
    use: "形容词，表示“可到达的、可获得的、易理解的”；接介词 to，常见 be accessible to sb。",
    phr: ["accessible to the public 向公众开放", "easily accessible 容易到达的", "accessible language 通俗易懂的语言"],
    ex: "The archive is now accessible to the public, although some documents remain restricted.",
    exCn: "该档案馆现在向公众开放，尽管部分文件仍然受限。",
    deep: "accessible 强调“能够进入/获得/理解”；available 强调“可以使用或获得”，不涉及障碍；approachable 多形容人平易近人。"
  },
  "accommodate": {
    use: "及物动词，核心义是“容纳、为……提供空间/住宿”，引申为“迁就、适应”；正式语境常用 accommodate the needs of ...。",
    phr: ["accommodate students 容纳学生", "accommodate the needs of 满足……的需要", "accommodate change 适应变化"],
    ex: "The new library can accommodate twice as many readers as the old building.",
    exCn: "新图书馆能容纳的读者数量是旧馆的两倍。",
    deep: "accommodate 强调调整自身以容纳或适应；adapt 强调改变以适应新条件；contain 只强调内部包含，不一定是为对方作出调整。"
  },
  "accumulate": {
    use: "及物或不及物动词，指数量、财富、知识、问题等逐渐积累；强调过程而非一次获得。",
    phr: ["accumulate wealth 积累财富", "accumulate evidence 收集证据", "accumulate over time 随时间积累"],
    ex: "Small advantages accumulate over time and eventually produce a gap that is hard to close.",
    exCn: "小的优势会随时间积累，最终形成难以弥合的差距。",
    deep: "accumulate 强调逐渐增多；collect 强调有选择地收集；amass 语气更强，常指大量聚敛财富或信息。"
  },
  "acknowledge": {
    use: "及物动词，可表示“承认（事实/错误）”“确认收到”“致谢”；后接名词、that 从句或 sb for sth。",
    phr: ["acknowledge a mistake 承认错误", "acknowledge receipt of 确认收到", "acknowledge the contribution of 感谢……的贡献"],
    ex: "The report acknowledges that progress has been made, but argues that it remains uneven.",
    exCn: "报告承认已经取得进展，但认为进展仍不均衡。",
    deep: "acknowledge 是中性、正式的“承认”，不一定认错；admit 常含不情愿承认错误；confess 多指承认罪行或隐私。"
  },
  "acquire": {
    use: "及物动词，表示“获得、习得、收购”；既可指获得具体资产，也可指通过努力获得技能或习惯。",
    phr: ["acquire knowledge 获取知识", "acquire a language 习得语言", "acquire a company 收购公司"],
    ex: "Children acquire their first language through interaction, not through formal instruction alone.",
    exCn: "儿童是通过互动习得母语的，而非仅靠正式教学。",
    deep: "acquire 强调经过过程而获得并拥有；obtain 更正式，强调得到结果；gain 强调增加或赢得，常与 advantage、weight 搭配。"
  },
  "adapt": {
    use: "及物或不及物动词：不及物时接 to，表示“适应”；及物时可表示“改编、改造”。",
    phr: ["adapt to change 适应变化", "adapt a novel for film 把小说改编成电影", "adapt the design 改造设计"],
    ex: "Firms that adapt quickly to new technologies tend to survive downturns better than those that do not.",
    exCn: "能迅速适应新技术的公司，往往比不能适应的公司更能挺过衰退。",
    deep: "adapt 强调为适应新环境而调整；adopt 是“采用、收养”，拼写只差一个字母，是高频混淆点。"
  },
  "adequate": {
    use: "形容词，表示“足够的、适当的”，常修饰抽象名词；be adequate for/to do 表示“足以……”。",
    phr: ["adequate funding 充足的资金", "adequate for the purpose 足以达到目的", "adequate response 适当的回应"],
    ex: "The evidence is adequate to support the conclusion, but it does not prove causation.",
    exCn: "这些证据足以支持该结论，但并不能证明因果关系。",
    deep: "adequate 强调“达到最低要求、够用”，不一定是“优秀”；sufficient 更强调数量充足；proper 强调恰当、合乎规范。"
  },
  "advocate": {
    use: "作动词时及物，表示“提倡、主张”，后接名词或 that 从句；作名词时指“拥护者、辩护律师”。",
    phr: ["advocate reform 主张改革", "an advocate of 提倡……的人", "advocate doing sth 主张做某事"],
    ex: "Some economists advocate raising the retirement age, but critics warn that the burden would fall unevenly.",
    exCn: "一些经济学家主张提高退休年龄，但批评者警告说负担会分配不均。",
    deep: "advocate 强调公开支持某项主张；support 更宽泛；oppose 是反义。注意 advocate 后接动名词，不接不定式。"
  },
  "aesthetic": {
    use: "形容词，表示“审美的、美学的”；也可作名词，指“审美观、美学”。",
    phr: ["aesthetic value 审美价值", "aesthetic judgment 审美判断", "for aesthetic reasons 出于审美原因"],
    ex: "The building was preserved for its aesthetic value rather than its historical importance.",
    exCn: "这座建筑因其审美价值而非历史重要性得以保留。",
    deep: "aesthetic 与“美感和品味”有关；artistic 指“艺术的、有艺术性的”；cosmetic 指表面修饰，常含贬义。"
  },
  "ambiguous": {
    use: "形容词，表示“模棱两可的、含糊的”，既可修饰语言，也可修饰态度、结果或证据。",
    phr: ["an ambiguous statement 含糊的陈述", "ambiguous evidence 不明确的证据", "remain ambiguous 仍然不明朗"],
    ex: "The results were ambiguous: they suggested a link but could not rule out other explanations.",
    exCn: "结果并不明确：它们暗示存在联系，但无法排除其他解释。",
    deep: "ambiguous 指可作多种解释；vague 指表达模糊、不具体；obscure 指难以理解或鲜为人知。"
  },
  "analogy": {
    use: "名词，表示“类比、类推”，常用 by analogy with、draw an analogy between A and B。",
    phr: ["draw an analogy between A and B 把 A 与 B 类比", "by analogy with 与……类似", "a false analogy 错误类比"],
    ex: "The author draws an analogy between the immune system and a city's defence network.",
    exCn: "作者把免疫系统比作城市的防御网络。",
    deep: "analogy 是解释或论证中的“类比”；metaphor 是修辞上的“隐喻”；comparison 是一般比较，不强调结构对应。"
  },
  "anticipate": {
    use: "及物动词，表示“预料、预期”，也可表示“预先采取行动”；后接名词、that 从句或动名词。",
    phr: ["anticipate problems 预见问题", "anticipate a rise in demand 预计需求上升", "anticipate doing sth 预计做某事"],
    ex: "Policymakers failed to anticipate how quickly the new rules would change rental markets.",
    exCn: "政策制定者没有预料到新规会多快改变租赁市场。",
    deep: "anticipate 强调事先想到并可能做好准备；expect 只是一般预期；predict 强调作出预测，不一定采取行动。"
  },
  "apparent": {
    use: "形容词，有两层常见义：①“明显的”；②“表面上的、未必真实的”。语境决定含义。",
    phr: ["it is apparent that 显然……", "for no apparent reason 没有明显原因", "apparent contradiction 表面矛盾"],
    ex: "The apparent decline in unemployment masked a rise in part-time and insecure work.",
    exCn: "失业率表面上的下降掩盖了兼职和不稳定工作的增加。",
    deep: "apparent 作“表面上的”时暗示未必真实；obvious 强调一眼可见；evident 强调有证据支持。"
  },
  "appeal": {
    use: "作不及物动词时接 to，表示“呼吁、吸引”；作名词时表示“呼吁、吸引力、上诉”。",
    phr: ["appeal to the public 向公众呼吁", "hold little appeal 吸引力不大", "file an appeal 提起上诉"],
    ex: "The proposal appeals to voters because it promises immediate relief, even if the cost is deferred.",
    exCn: "该提案对选民有吸引力，因为它承诺立即缓解压力，即使代价被推迟。",
    deep: "appeal to 既可表示“呼吁某人”，也可表示“对某人有吸引力”；attract 只强调吸引，不包含呼吁义。"
  },
  "arbitrary": {
    use: "形容词，表示“任意的、武断的、缺乏合理依据的”，常用于批评规则、决定或分类。",
    phr: ["an arbitrary decision 武断的决定", "arbitrary distinction 人为的区分", "arbitrary power 专断权力"],
    ex: "Critics argued that the cut-off was arbitrary and punished students for circumstances beyond their control.",
    exCn: "批评者认为这一截止标准是武断的，因学生无法控制的情况而惩罚他们。",
    deep: "arbitrary 强调缺乏合理依据或规则；random 强调随机；subjective 强调主观，不一定没有依据。"
  },
  "assess": {
    use: "及物动词，表示“评估、估价”，常用于对影响、风险、表现、价值作出判断；正式语境常见 assess whether/how。",
    phr: ["assess the impact 评估影响", "assess the risk 评估风险", "assess whether 评估是否……"],
    ex: "It is difficult to assess the long-term impact of the policy while the data remain incomplete.",
    exCn: "在数据仍不完整的情况下，很难评估该政策的长期影响。",
    deep: "assess 强调经过分析后作出判断；evaluate 更强调按标准衡量价值或效果；estimate 强调估算数量，不一定作评价。"
  }
});