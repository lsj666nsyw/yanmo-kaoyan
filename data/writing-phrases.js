/* 作文常用句库：按功能分组，追加到 WRITING.patterns。
   每条为 [英文, 中文释义与用法]，避免只给“万能句”而不说明放在哪里。 */
(function () {
  const W = window.WRITING;
  if (!W || !Array.isArray(W.patterns)) return;

  const extra = [
    {
      label: "开头：现象与争议",
      items: [
        ["The debate over X has moved from the margins to the centre of public life.", "关于 X 的争论已从边缘进入公共生活的中心；适合开篇点明议题的分量。"],
        ["What looks like a personal choice is often shaped by forces larger than the individual.", "看似个人选择的事，往往由大于个人的力量塑造；用于从现象转向结构分析。"],
        ["The figures are familiar; the explanation is not.", "数据人人熟悉，解释却并不清楚；适合引出被忽略的问题。"],
        ["Behind the headline is a quieter change that deserves more attention.", "头条背后有一个更安静、却更值得注意的变化；用于引出深层趋势。"],
        ["Few issues divide opinion as sharply as X.", "很少有议题像 X 这样使意见尖锐对立；适合争议型话题。"],
        ["The question is not whether X matters, but how it should be managed.", "问题不是 X 是否重要，而是如何管理它；用于避免停留在“重要不重要”的空论。"]
      ]
    },
    {
      label: "图表：趋势与对比",
      items: [
        ["The overall trend is upward, but the path is far from smooth.", "总体趋势向上，但过程远非平稳；用于描述有波动的折线图。"],
        ["The most striking change is not the total but the composition.", "最显著的变化不在总量，而在构成；用于结构变化类图表。"],
        ["The two lines diverge after 2020, and the gap continues to widen.", "两条线在 2020 年后分开，差距持续扩大；用于对比两组数据。"],
        ["A closer look reveals that the average hides very different experiences.", "细看会发现平均值掩盖了差异很大的个体经历；用于批评“平均数”叙事。"],
        ["The share rose steadily before levelling off at around two thirds.", "比例稳步上升，随后在三分之二左右趋于平稳；用于描述饱和趋势。"],
        ["The change is modest in percentage terms but large in absolute numbers.", "按比例看变化不大，但按绝对数量看很大；用于避免只报百分比。"]
      ]
    },
    {
      label: "图画：细节与寓意",
      items: [
        ["The drawing works through contrast: one figure is surrounded by tools, the other by distractions.", "图画通过对比表意：一个人被工具包围，另一个人被干扰包围；用于描述对比型图画。"],
        ["The caption turns a familiar scene into an argument.", "文字说明把一个熟悉的场景变成了一个论点；用于点出图画的讽喻。"],
        ["What the picture leaves out is as telling as what it shows.", "图画没有画出的部分，和画出的部分一样能说明问题；用于深层解读。"],
        ["The scene is ordinary, and that is precisely the point.", "场景很普通，而这正是关键；用于从日常细节提炼普遍问题。"],
        ["The smile on the face does not match the weight in the hands.", "脸上的笑与手中的重量并不相称；用于描述反差细节。"],
        ["Read together, the details point to a single question: who bears the cost?", "把细节合起来看，它们指向同一个问题：谁来承担代价？；用于收束描述段。"]
      ]
    },
    {
      label: "观点：立论与限定",
      items: [
        ["My argument is narrower: X helps, but only under certain conditions.", "我的论点更窄：X 有帮助，但只在特定条件下；用于避免绝对化。"],
        ["The evidence points to a middle position rather than either extreme.", "证据指向中间立场，而非任一极端；用于平衡型议论文。"],
        ["It is tempting to blame X, but the causes are more dispersed.", "把责任归给 X 很省事，但原因分布得更广；用于拒绝单一归因。"],
        ["The real test is not intention but outcome.", "真正的检验不是意图，而是结果；用于评价政策或做法。"],
        ["This is less a technological problem than a question of incentives.", "这与其说是技术问题，不如说是激励问题；用于转换分析视角。"],
        ["A policy can be well meaning and still poorly designed.", "政策可以出于善意，却设计得很糟；用于承认动机、批评效果。"]
      ]
    },
    {
      label: "原因：机制与层次",
      items: [
        ["The mechanism is simple: when X becomes cheaper, people do more of it.", "机制很简单：当 X 变便宜，人们就会做得更多；用于解释行为变化。"],
        ["Two forces reinforce each other: ... and ...", "两股力量相互强化：……与……；用于分析复合原因。"],
        ["The change began not with technology but with a shift in norms.", "变化并非始于技术，而是始于规范的变化；用于纠正技术决定论。"],
        ["Short-term incentives often crowd out long-term judgment.", "短期激励常常挤出长期判断；用于分析制度性短视。"],
        ["The effect is uneven because the starting points are unequal.", "效果不均衡，因为起点并不平等；用于讨论分配效应。"],
        ["Correlation is easy to find; causation requires a mechanism.", "相关容易发现，因果需要机制；用于提醒论证不要跳步。"]
      ]
    },
    {
      label: "举例：具体与概括",
      items: [
        ["Consider a familiar case: ...", "看一个熟悉的例子：……；用于引出具体例证。"],
        ["The example is not exceptional; it illustrates a pattern.", "这个例子并非例外，而是说明了一种模式；用于从个案上升到趋势。"],
        ["A single case cannot prove the rule, but it can show how the rule works.", "单一案例不能证明规律，但能说明规律如何运作；用于限定例证的作用。"],
        ["The same logic applies to ..., where ...", "同样的逻辑适用于……，在那里……；用于扩展论证。"],
        ["What happened in X is a warning, not a template.", "X 发生的事是警示，不是模板；用于防止机械照搬。"],
        ["The detail matters because it shows what the abstract claim looks like in practice.", "细节重要，因为它展示了抽象主张在现实中是什么样子；用于连接例证与论点。"]
      ]
    },
    {
      label: "让步：承认与反驳",
      items: [
        ["The objection has force, but it does not overturn the main point.", "这一反对意见有力量，但并不能推翻主要观点；用于让步后回收论点。"],
        ["It is true that X; it does not follow that Y.", "X 固然属实，但不能由此推出 Y；用于指出逻辑跳跃。"],
        ["Even if the critics are right about the cost, the alternative is worse.", "即使批评者关于成本的判断是对的，替代方案也更糟；用于比较而非否认。"],
        ["The problem with this view is not its values but its evidence.", "这一观点的问题不在价值取向，而在证据；用于精确反驳。"],
        ["A fair reading of the evidence allows for both gains and losses.", "公允解读证据，应同时承认收益与损失；用于避免选择性引用。"],
        ["This is not to deny X; it is to ask what X costs and who pays.", "这不是否认 X，而是追问 X 的代价由谁承担；用于把争论推向分配问题。"]
      ]
    },
    {
      label: "建议：主体与措施",
      items: [
        ["The first step is to make the trade-off visible.", "第一步是让取舍变得可见；用于建议段开头。"],
        ["Rules should target the harm, not the technology itself.", "规则应针对危害，而不是技术本身；用于监管类话题。"],
        ["Universities can do more than issue guidelines: they can redesign the incentives.", "大学不应只发指南，还可以重新设计激励；用于具体建议。"],
        ["A pilot programme would test the idea before it is scaled up.", "先用试点检验，再扩大规模；用于稳妥的政策建议。"],
        ["The measure should include a review clause, so that failures can be corrected.", "措施应包含复审条款，以便纠正失败；用于提高建议的可操作性。"],
        ["Individual effort matters, but it cannot replace public provision.", "个人努力重要，但不能替代公共供给；用于平衡个人与制度。"]
      ]
    },
    {
      label: "结尾：回落与前瞻",
      items: [
        ["The issue is not going away; the question is whether our response will be deliberate.", "问题不会消失，关键在于我们的回应是否有意为之；用于收束而不喊口号。"],
        ["The choice is not between change and stability, but between two kinds of change.", "选择不是在变化与稳定之间，而是在两种变化之间；用于提升结尾层次。"],
        ["A society is judged by what it does when the easy options run out.", "一个社会的品格，体现在容易的选择用尽之后；用于有余味的结尾。"],
        ["If the diagnosis is wrong, the remedy will be too.", "诊断错了，药方也会错；用于强调分析的重要性。"],
        ["The point is not to predict the future, but to widen the range of futures we can choose from.", "重点不是预测未来，而是扩大我们可以选择的未来；用于前瞻性结尾。"],
        ["What begins as a technical fix may end by changing who gets to decide.", "起初的技术修补，最终可能改变谁拥有决定权；用于点出治理含义。"]
      ]
    },
    {
      label: "小作文：书信开头与结尾",
      items: [
        ["I am writing to raise a concern about ..., which has affected ...", "写信就……提出关切，该问题已影响……；投诉信开头。"],
        ["I would like to apply for ..., and I would be grateful for the chance to ...", "我想申请……，如能有机会……将不胜感激；申请信开头。"],
        ["I am writing to recommend ..., whose work on ... has been consistently strong.", "写信推荐……，其在……方面的工作一直很出色；推荐信开头。"],
        ["I would be grateful if you could confirm whether ...", "如能确认是否……，我将不胜感激；询问信礼貌请求。"],
        ["I understand that ..., but I hope you will consider ...", "我理解……，但希望您考虑……；投诉/建议信中的让步。"],
        ["Thank you for your time and for considering this request.", "感谢您抽出时间考虑这一请求；书信结尾的稳妥表达。"]
      ]
    },
    {
      label: "小作文：通知与告示",
      items: [
        ["This notice is to inform all students that ...", "本通知告知全体学生……；通知开头，直接给信息。"],
        ["The event will take place in ... on ..., from ... to ...", "活动将于……在……举行，时间为……至……；通知的时间地点句。"],
        ["Those who wish to attend should register by ... at ...", "有意参加者请于……前在……报名；通知的行动要求。"],
        ["Please note that late applications cannot be accepted.", "请注意，逾期申请不予受理；通知的限制条件。"],
        ["For further information, please contact ...", "如需进一步信息，请联系……；通知结尾。"],
        ["We apologize for any inconvenience and thank you for your cooperation.", "对由此造成的不便深表歉意，感谢配合；通知中的致歉句。"]
      ]
    }
  ];

  W.patterns = W.patterns.concat(extra);
})();