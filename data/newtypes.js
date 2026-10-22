/* 新题型扩充 · 排序题 + 小标题匹配
   英语一新题型的另外两种形式，材料为原创仿真内容。
   排序题：A—G 七段，A 为首段、G 为末段，其余五段排序。
   小标题：五段配六个标题，一项多余。 */

(function () {
  window.ORDER_SETS = (window.ORDER_SETS || []).concat([
    {
      title: "Why Cities Keep Building on Floodplains",
      intro: "排序题 · 7 段 · 首段 A、末段 G 已定 · 建议 18 分钟。先读首尾，再找段间的逻辑信号。",
      paragraphs: [
        {
          label: "A",
          text: "Every year, cities on floodplains are flooded, rebuilt and flooded again. The pattern is old enough to be predicted, yet the building continues. The explanation is not simple ignorance. Floodplains are flat, close to water and transport, and often cheap to develop. The benefits are immediate and visible; the risks are intermittent and easy to postpone."
        },
        {
          label: "B",
          text: "Engineering then appears to solve the problem. Levees and drainage channels reduce the chance of ordinary flooding, which makes the floodplain feel safe and attracts more construction. When a larger flood eventually exceeds the defences, the damage is greater than it would have been without them. Protection, in this sense, can manufacture risk."
        },
        {
          label: "C",
          text: "The first factor is memory. A serious flood recedes, repairs are completed, and within a decade the event feels unlikely to recur. People who move to the area afterwards have no memory of it at all. Insurance can reinforce the amnesia: if premiums do not reflect the risk, living on a floodplain looks cheaper than it is."
        },
        {
          label: "D",
          text: "None of these measures is popular in the short term. They constrain development, raise costs and ask voters to accept a benefit they will never see. That is why they are usually adopted after a disaster, when the memory is fresh and the political window is briefly open. The window closes quickly."
        },
        {
          label: "E",
          text: "The second factor is incentive. Local governments collect taxes from new development but rarely bear the full cost of disaster relief, which is often funded nationally. A mayor who blocks construction protects the budget in the long run and loses investment in the short run. The political arithmetic favours building now and asking for help later."
        },
        {
          label: "F",
          text: "There are alternatives. Zoning can keep the most dangerous land open as parks and playing fields, which absorb water and require no evacuation. Building codes can raise the ground floor, protect utilities and provide escape routes. Insurance can be priced to reflect risk, with subsidies for those who cannot afford to move."
        },
        {
          label: "G",
          text: "The lesson is not that floodplains must be abandoned. It is that the decision to build there should be made with the costs included, at the moment of construction rather than after the water arrives. A city that cannot remember a flood will keep paying to rebuild one."
        }
      ],
      first: "A",
      last: "G",
      answers: ["C", "E", "B", "F", "D"],
      explain: [
        "A 末句说“收益即时、风险容易被推迟”，C 用 The first factor is memory 接住“为什么会被推迟”，再解释洪水记忆如何消退。B 以 Engineering 开头，必须排在“激励”之后。",
        "C 讲完记忆，E 用 The second factor is incentive 形成并列。D 的 None of these measures 需要前文先出现具体措施，不能放在这里。",
        "E 末句说“先建设、后求助”，B 的 Engineering then appears to solve the problem 正是这种激励下的技术回应，then 也提示承接。",
        "B 末句指出“保护反而制造风险”，F 用 There are alternatives 转折到解决路径，语义衔接自然。",
        "F 列举分区、建筑规范、保险三项措施，D 的 None of these measures 正好回指这三项，并解释它们为何难以推行。"
      ],
      tips: [
        ["先定首尾", "首段提出反常现象，末段给出判断。A、G 已固定，不要改动；把注意力放在中间五段的因果链上。"],
        ["抓序号与并列", "The first factor / The second factor 是明确的路标，决定 C 在 E 之前，而不是相反。"],
        ["代词回指", "None of these measures 必须跟在具体措施之后；this sense、such workers 一类表达也要先找到前文指代对象。"],
        ["先搭骨架", "全文是“现象 → 记忆 → 激励 → 技术回应 → 替代方案 → 政治阻力 → 结论”，先排逻辑，再逐段核对语言线索。"],
        ["代入通读", "排完后从 A 读到 G，检查每段开头能否自然接上上一段末句；读不顺通常就是顺序错了。"]
      ]
    },
    {
      title: "How a Rumor Travels",
      intro: "排序题 · 7 段 · 首段 A、末段 G 已定 · 建议 18 分钟。注意 also、worse、what works 这类推进信号。",
      paragraphs: [
        {
          label: "A",
          text: "A rumor is not simply a false statement. It is a story that spreads because it explains something people already suspect. The content matters, but so does the situation: uncertainty, anxiety and a gap between what is known and what people need to know. Remove the gap and the rumor loses its fuel."
        },
        {
          label: "B",
          text: "Repetition then does the rest. Hearing a claim several times makes it feel familiar, and familiarity is easily mistaken for truth. The effect is stronger when the claim is repeated by people we trust, or when it arrives through several channels that appear independent. A single origin can look like a consensus."
        },
        {
          label: "C",
          text: "Worse, repeating a false claim in order to deny it can strengthen it. Readers remember the claim more easily than the negation attached to it. The result is a familiar pattern: a correction is issued, the correction is shared, and the original claim survives in memory with a vague sense that it was discussed."
        },
        {
          label: "D",
          text: "Psychologists have long observed that rumors flourish when an event matters and the facts are unclear. Importance supplies the motive to talk; ambiguity supplies the room for invention. A story that is both urgent and unverifiable travels faster than one that is merely false, which is why corrections often arrive too late."
        },
        {
          label: "E",
          text: "What works better is to fill the gap before it is exploited. Explain the uncertainty honestly, give people a coherent account of what is known and what is not, and name the techniques used to mislead. This is why public health agencies now brief journalists on likely false claims before an outbreak, rather than waiting to deny them afterwards."
        },
        {
          label: "F",
          text: "Rumors also do social work. Passing one on signals that we are inside a group, that we know something useful, that we are looking after our friends. This is why fact-checking alone changes so few minds: it challenges the claim but not the social exchange that carried it."
        },
        {
          label: "G",
          text: "None of this makes rumors a problem that can be solved once. They are a symptom of incomplete information and social needs that do not disappear. The practical aim is narrower: make the gap smaller, make the correction more memorable than the myth, and make it easier for people to check before they share."
        }
      ],
      first: "A",
      last: "G",
      answers: ["D", "B", "F", "C", "E"],
      explain: [
        "A 末句说“移走信息缺口，谣言就失去燃料”，D 紧接着给出“重要 + 模糊”两个条件，Importance supplies... 与 gap 直接呼应。B 以 Repetition 开头，必须排在传播条件之后。",
        "D 讲完“重要且模糊”，B 用 Repetition then does the rest 承接：先有传播动机，才有重复放大。F 讲社交功能，是另一层机制。",
        "B 讲重复与熟悉感，F 的 also 引出另一机制——谣言的社交功能。also 是明确信号，说明它接在另一机制之后。",
        "F 末句说事实核查改变不了社交交换，C 用 Worse 进一步：连辟谣本身也可能强化原说法。",
        "C 讲辟谣的反效果，E 用 What works better 转到有效做法，形成“问题—对策”。G 的 None of this 是全文收束。"
      ],
      tips: [
        ["首段看功能", "A 提出“谣言是解释人们已有怀疑的故事”，并给出信息缺口。中间段落必须围绕“为什么传播、如何传播、如何应对”展开。"],
        ["抓递进词", "also 引出并列机制，worse 引出更严重的后果，What works better 引出对策。这些词决定段落先后，比关键词更可靠。"],
        ["区分问题与对策", "B、C 仍在讲传播机制与反效果，E 才开始讲应对。把对策段误放在问题段之前，是排序题最常见的错误。"],
        ["代词与回指", "None of this 回指全文的分析；the original claim 回指前文被重复的说法。回指对象找不到，顺序多半有问题。"],
        ["末段看收束", "G 不再引入新机制，而是把目标收窄为三条可执行的事，符合末段功能。"]
      ]
    }
  ]);

  window.HEADING_SETS = (window.HEADING_SETS || []).concat([
    {
      title: "The Work of Maintenance",
      intro: "小标题匹配 · 5 段 6 选项 · 建议 12 分钟。为每段选一个标题，有一项多余。",
      sections: [
        "A bridge that is repainted every few years attracts no attention. A bridge that collapses does. The work that keeps systems working is, almost by definition, the work that nobody notices, and that is one reason it is so easy to cut. The better it is done, the less evidence there is that it was needed at all.",
        "The problem is especially acute in budgets. A new building can be photographed and opened; a drainage system that is cleaned is merely expected to keep working. Politicians rarely win votes for the repair that prevented a disaster, because the disaster does not happen. The credit goes to no one, while the cost appears on every budget line.",
        "Deferred maintenance does not save money; it moves the cost forward and adds interest. A roof ignored for a decade does not merely need repair; it needs replacement, and the water damage behind the walls may cost more than the roof. The same pattern appears in software, in hospitals and in the pipes beneath a street.",
        "The people who do this work are not interchangeable. A technician who knows the peculiarities of an old lift or a local water network carries knowledge that is not written down. When such workers retire and are not replaced, the loss becomes visible only when something fails. By then, the person who could have explained the system is no longer there.",
        "The final difficulty is measurement. A successful maintenance programme produces no dramatic statistics: no collapse, no outbreak, no outage. Its achievements are absences, and absences are hard to present in an annual report. What can be counted is the repair bill, which looks like a cost rather than a saving."
      ],
      options: [
        "When maintenance is deferred",
        "Measuring what does not fail",
        "Maintenance is invisible by design",
        "Why new construction is more exciting",
        "The political cost of prevention",
        "Skills that are learned on the job"
      ],
      answers: [2, 4, 0, 5, 1],
      extra: 3,
      explain: [
        "首句用“刷漆的桥无人注意、倒塌的桥才被看见”点题，整段都在说维护越是成功越不可见。C 的 invisible by design 概括这一悖论。",
        "本段落在预算与选票：新楼可以剪彩，预防灾难的维修却无人记功。E 的 political cost of prevention 正是这一层。",
        "首句直接给出 Deferred maintenance does not save money，后文用屋顶、软件、医院、管道说明拖延如何把成本推高。A 对应。",
        "本段讲老电梯、水管网络的技术人员，知识没有写下来，人一走就断档。F 的 skills learned on the job 概括这种口传心授。",
        "末段说维护的成绩是“没有发生的事”，无法写进年度报告。B 的 measuring what does not fail 是这一困境的准确概括。"
      ],
      tips: [
        ["先读选项抓核心", "六个标题的核心词分别是 deferred、measurement、invisible、new construction、prevention、skills。先建立这张“主题地图”。"],
        ["标题是主旨不是细节", "某段出现 budget 不等于标题要谈钱；要看整段在论证什么，而不是抓住一个词。"],
        ["看段首与段末", "说明文常在首句给主题、末句收束。首句出现 none of these / the final difficulty 时，主题往往就在附近。"],
        ["先做有把握的", "先锁定“invisible by design”“skills on the job”这类特征鲜明的段，剩余选项减少后再处理抽象段。"],
        ["多余项像但不对", "Why new construction is more exciting 看似与预算段相关，但它只是段中的一个对比，不是整段主旨。"]
      ]
    },
    {
      title: "What Makes a Team Learn",
      intro: "小标题匹配 · 5 段 6 选项 · 建议 12 分钟。为每段选一个标题，有一项多余。",
      sections: [
        "A team that never disagrees is not necessarily harmonious; it may simply be avoiding the cost of disagreement. The first condition for learning is that people can say what they do not know without being punished for it. That sounds soft, but it is practical: problems are reported earlier, and fewer of them become surprises.",
        "The second condition is a shared record. Teams that rely on memory repeat the same debate every few months. A short written note of what was decided, and why, turns a conversation into something that can be examined later. It also prevents the past from being rewritten by whoever speaks most confidently in the present.",
        "Third, errors need to be discussed without turning every discussion into a trial. The useful question is not who is to blame but what made the error likely: a confusing form, an unrealistic deadline, a handover that no one owned. A team that can ask this question learns; a team that only assigns blame learns to hide.",
        "Fourth, teams need access to people outside the group. A group that only talks to itself becomes confident and narrow at the same rate. Outsiders ask the obvious question that insiders have stopped noticing, and they are less invested in the answer the group has already chosen.",
        "None of these conditions requires a new philosophy or a motivational campaign. They require time, a few habits and the willingness to be inconvenient. That is why they are rare: the cost is small but immediate, while the benefit is invisible and shared."
      ],
      options: [
        "Blame is not the same as explanation",
        "Outside eyes",
        "Talent is the only thing that matters",
        "Safety to admit uncertainty",
        "The cost of plain habits",
        "A record that outlasts the meeting"
      ],
      answers: [3, 5, 0, 1, 4],
      extra: 2,
      explain: [
        "首句说“从不争吵的团队可能只是在回避分歧”，随后提出“可以说自己不知道而不受惩罚”。D 的 safety to admit uncertainty 概括这一条件。",
        "本段讲书面记录：把决定和理由写下来，避免每隔几个月重开同一场辩论。F 的 a record that outlasts the meeting 对应。",
        "本段的关键句是 not who is to blame but what made the error likely。A 的 blame is not the same as explanation 正是这一区分。",
        "本段讲团队需要外部的人，局外人会问出内部人已经不再注意的显而易见的问题。B 的 outside eyes 概括。",
        "末段说这些条件不需要新哲学或动员运动，只需要时间、习惯和“愿意麻烦自己”。E 的 the cost of plain habits 对应这种小而即时的成本。"
      ],
      tips: [
        ["抓序数词", "The first condition / The second / Third / Fourth 把五段串成清单，标题顺序也应跟着这条线索走。"],
        ["区分机制与结论", "前四段各讲一个机制，末段收束到“成本很小但即时”。标题要匹配段落功能，而不是重复关键词。"],
        ["注意否定式主旨", "第三段的核心是“不要只追责”，标题 Blame is not the same as explanation 用否定式保留了这层意思。"],
        ["多余项通常过于绝对", "Talent is the only thing that matters 语气绝对，且全文谈的是团队习惯，不是人才选拔。"],
        ["用末段检验", "The cost of plain habits 与末段的 small but immediate / invisible and shared 形成对照，能解释为什么这些做法很少见。"]
      ]
    }
  ]);
})();
