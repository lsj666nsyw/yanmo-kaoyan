/* 长难句精讲 · 31—40
   例句为原创仿真材料，结构覆盖倒装、虚拟、比较、插入与名词性从句 */

(function () {
  const extra = [
    {
      id: 31, level: "难点",
      en: "Not until the cost of failure is borne by those who make the decision, rather than by those who live with it, do organizations begin to learn from their mistakes.",
      tags: ["部分倒装", "定语从句", "比较结构"],
      trunk: "Organizations do not begin to learn ... until the cost of failure is borne by decision-makers.",
      parts: [
        ["Not until the cost of failure is borne by those who make the decision", "Not until 引导时间状语从句置于句首，主句需部分倒装"],
        ["rather than by those who live with it", "与 by those who make the decision 并列比较；it 指 the cost"],
        ["do organizations begin to learn from their mistakes", "主句倒装；learn from 从……中学习"]
      ],
      point: "Not until 放在句首时，主句用助动词倒装。两个 those who 形成对照：决策者与承受者。翻译时把“直到……才……”放在主句前。",
      cn: "只有当失败的代价由决策者而非承受者承担时，组织才会真正开始从错误中学习。"
    },
    {
      id: 32, level: "难点",
      en: "What would have happened if the same policy had been introduced in a city with half the budget and none of the administrative capacity was never seriously examined.",
      tags: ["主语从句", "虚拟语气", "定语从句"],
      trunk: "What would have happened ... was never seriously examined.",
      parts: [
        ["What would have happened", "what 引导主语从句，作整句主语"],
        ["if the same policy had been introduced in a city with half the budget and none of the administrative capacity", "虚拟条件从句，与过去事实相反"],
        ["was never seriously examined", "主句谓语，被动语态"]
      ],
      point: "主语从句里套了一个很长的虚拟条件，先抓 What ... was never examined。with half the budget 是后置定语，修饰 city。",
      cn: "如果把同样的政策引入一座预算只有一半、行政能力几乎为零的城市，会发生什么，从未被认真审视。"
    },
    {
      id: 33, level: "进阶",
      en: "The researchers, whose funding depended on a finding that would attract attention, were careful to describe their results as preliminary—a caution that the headlines promptly ignored.",
      tags: ["非限制性定语从句", "同位语", "插入语"],
      trunk: "The researchers were careful to describe their results as preliminary.",
      parts: [
        ["whose funding depended on a finding that would attract attention", "非限制性定语从句修饰 researchers，其中又套 that 定语从句"],
        ["were careful to describe their results as preliminary", "主句；describe A as B"],
        ["a caution that the headlines promptly ignored", "同位语，概括前面的谨慎做法；that 从句修饰 caution"]
      ],
      point: "两个定语从句连续套嵌，先跳过 whose 从句抓主句。a caution 是对前文“把结果称为初步”的概括，不是新的主语。",
      cn: "这些研究者的经费取决于一项能吸引注意的发现，因此他们谨慎地把结果称为初步的——而媒体标题立刻无视了这份谨慎。"
    },
    {
      id: 34, level: "进阶",
      en: "The more confident a society is that its institutions are fair, the less prepared it tends to be for evidence that they are not.",
      tags: ["比较结构", "宾语从句", "省略"],
      trunk: "The more confident ..., the less prepared ...",
      parts: [
        ["The more confident a society is that its institutions are fair", "the more ... the less ... 结构前半；that 从句作 confident 的补足语"],
        ["the less prepared it tends to be", "结构后半；it 指 society"],
        ["for evidence that they are not", "that 从句修饰 evidence；are not 后省略 fair"]
      ],
      point: "the more ... the less ... 译“越……越……”。are not 后省略了 fair，补全后才看得清比较对象。",
      cn: "一个社会越确信自己的制度是公平的，就越不容易为“制度并不公平”的证据做好准备。"
    },
    {
      id: 35, level: "进阶",
      en: "However carefully a measure is designed, it will be gamed by the people it is meant to constrain, unless those people have a reason to want it to succeed.",
      tags: ["让步状语", "定语从句", "条件状语"],
      trunk: "It will be gamed by the people ..., unless those people have a reason to want it to succeed.",
      parts: [
        ["However carefully a measure is designed", "however + 副词引导让步状语从句"],
        ["it will be gamed by the people it is meant to constrain", "主句被动；people 后省略关系词，it is meant to constrain 是定语从句"],
        ["unless those people have a reason to want it to succeed", "unless 引导条件状语从句"]
      ],
      point: "however 在此是“无论多么”，不是“然而”。be gamed 是“被钻空子”，不是“被游戏”。",
      cn: "一项措施无论设计得多么周密，都会被它本要约束的人钻空子，除非这些人有理由希望它成功。"
    },
    {
      id: 36, level: "难点",
      en: "So central has measurement become to modern management that the things that cannot be counted are often treated as if they did not exist.",
      tags: ["倒装", "结果状语从句", "虚拟语气"],
      trunk: "Measurement has become so central to modern management that ...",
      parts: [
        ["So central has measurement become to modern management", "so + 形容词置于句首，主句完全倒装"],
        ["that the things that cannot be counted are often treated", "that 引导结果状语从句；第二个 that 引导定语从句"],
        ["as if they did not exist", "as if 从句用虚拟语气"]
      ],
      point: "还原语序是 Measurement has become so central that ...。as if 后用 did not exist，表示与事实相反。",
      cn: "计量在现代管理中已变得如此核心，以至于无法计数的事物常常被当作不存在。"
    },
    {
      id: 37, level: "进阶",
      en: "With the archive now open to the public, historians have begun to ask questions that could not be asked while the files remained sealed.",
      tags: ["独立主格", "定语从句", "时间状语"],
      trunk: "Historians have begun to ask questions.",
      parts: [
        ["With the archive now open to the public", "with + 名词 + 形容词，独立主格结构，表伴随状态"],
        ["have begun to ask questions", "主句"],
        ["that could not be asked while the files remained sealed", "定语从句，内含 while 时间状语从句"]
      ],
      point: "with 复合结构不是完整句子，翻译时处理为“随着……”。remain sealed 是系表结构，表示持续状态。",
      cn: "随着档案如今向公众开放，历史学者开始提出那些在文件仍然封存时无法提出的问题。"
    },
    {
      id: 38, level: "进阶",
      en: "It is not the absence of evidence that should worry us most, but the ease with which we accept evidence that confirms what we already believe.",
      tags: ["强调句", "否定", "定语从句"],
      trunk: "It is not the absence of evidence ... but the ease ...",
      parts: [
        ["It is not the absence of evidence that should worry us most", "It is ... that 强调句，强调否定部分"],
        ["but the ease with which we accept evidence", "but 连接的并列强调成分；with which 引导定语从句"],
        ["that confirms what we already believe", "定语从句修饰 evidence；what 从句作 confirms 的宾语"]
      ],
      point: "强调句中的 not A but B 要把两端都还原：不是证据缺失，而是接受证据的轻易程度。the ease with which 译“……的容易程度”。",
      cn: "最该让我们担心的不是证据的缺失，而是我们接受那些印证既有信念的证据时有多么轻易。"
    },
    {
      id: 39, level: "进阶",
      en: "A policy that is judged only by its intentions, rather than by what it actually changes, will always look better on paper than it does in the lives of the people it touches.",
      tags: ["定语从句", "比较结构", "宾语从句"],
      trunk: "A policy ... will always look better on paper than it does in practice.",
      parts: [
        ["that is judged only by its intentions", "定语从句修饰 policy"],
        ["rather than by what it actually changes", "与 by its intentions 并列比较；what 从句作 by 的宾语"],
        ["will always look better on paper than it does in the lives of the people it touches", "主句比较结构；it touches 省略关系词"]
      ],
      point: "judged by A rather than by B 是“按 A 而非 B 评判”。look better on paper than it does in practice 可译“纸上好看，现实未必”。",
      cn: "一项只按意图、而不按实际改变来评判的政策，在纸面上总比在它所触及的人的生活中好看。"
    },
    {
      id: 40, level: "难点",
      en: "Rarely does a reform fail because its goals were too ambitious; more often it fails because no one was given the authority, the money or the time to carry it out.",
      tags: ["部分倒装", "原因状语从句", "比较"],
      trunk: "A reform rarely fails because its goals were too ambitious; it more often fails because ...",
      parts: [
        ["Rarely does a reform fail because its goals were too ambitious", "否定副词 Rarely 置首，主句部分倒装"],
        ["more often it fails because no one was given the authority, the money or the time", "比较 + 原因状语从句"],
        ["to carry it out", "不定式作定语，修饰 time/authority/money 所支持的行动"]
      ],
      point: "Rarely 置句首引起倒装，还原为 A reform rarely fails。分号前后是“很少因为……更常因为……”的对照。",
      cn: "改革很少因目标过于宏大而失败；更常见的是，没有人被赋予执行它所需的权力、资金或时间。"
    }
  ];

  extra.forEach(function (s) { window.SENTENCES.push(s); });
})();
