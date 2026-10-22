/* 阅读 21—22 的定位证据与参考译文。 */
(function () {
  const evidence = {
    "21": [
      {
        para: 1,
        evidence: "The convenience is real, but it is produced by moving work and cost to places where the customer does not see them.",
        paraphrase: "convenience is real = the service does save time（便利确实存在）；moving work and cost out of sight = the customer does not see the labour and expense behind it（把劳动和成本移到顾客看不见的地方）。"
      },
      {
        para: 2,
        evidence: "Because the customer pays little or nothing for delivery, the pressure to reduce cost falls on wages, vehicle maintenance and the time allowed for each stop.",
        paraphrase: "pays little or nothing = low delivery fee（配送费很低或免费）；pressure falls on wages ... = the cost is pushed onto workers and maintenance（成本被转嫁给工资、车辆维护和每站时间）。"
      },
      {
        para: 3,
        evidence: "A single van delivering thirty parcels may be more efficient than thirty separate car trips, but the comparison is not so favourable when the van is half empty or when returns multiply the journeys.",
        paraphrase: "more efficient ... but not so favourable when ... = efficiency depends on load and journeys（效率取决于装载率和行程数）；returns multiply journeys = returns add extra trips（退货增加行程）。"
      },
      {
        para: 5,
        evidence: "None of this means that same-day delivery should be banned. It means that the price should tell the truth.",
        paraphrase: "not banned = the author opposes a ban（作者不主张禁止）；price should tell the truth = charge for the hidden costs（让价格反映隐藏成本，即监管而非禁止）。"
      },
      {
        para: 5,
        evidence: "The question is not whether convenience is worth having, but who is paying for it and whether they have agreed to.",
        paraphrase: "not whether ... but who ... = the real issue is cost-bearing and consent（真正的问题是成本由谁承担、是否同意），概括全文对隐藏成本的追问。"
      }
    ],
    "22": [
      {
        para: 1,
        evidence: "A street of small shops is also a piece of infrastructure: it shortens the distance between home and the things people need, gives older residents a place to meet, and offers a low-cost entry point for people who want to start a business.",
        paraphrase: "piece of infrastructure = a public-serving system, not just decoration（基础设施，而非怀旧装饰）；shortens distance / place to meet / entry point = three functions（三项城市功能）。"
      },
      {
        para: 2,
        evidence: "There is truth in this, but the explanation is incomplete.",
        paraphrase: "there is truth = the usual explanation is partly right（通常解释有道理）；but incomplete = it misses location, knowledge and trust（但它忽略了位置、知识和信任等优势）。"
      },
      {
        para: 3,
        evidence: "Rent is the hinge.",
        paraphrase: "hinge = the central factor on which the outcome turns（关键因素/枢纽），后文以租金决定店铺去留展开。"
      },
      {
        para: 4,
        evidence: "That can help, but it can also freeze a street in place, preserving a shop that no longer serves anyone while preventing a new use from emerging.",
        paraphrase: "freeze a street in place = preserve the form but block adaptation（冻结现状、阻碍更新）；preserving ... while preventing ... = form survives, function does not（保住形式，失去功能）。"
      },
      {
        para: 5,
        evidence: "The question is not whether the old street was better, but what a street is for.",
        paraphrase: "not whether the old street was better = reject nostalgia（拒绝怀旧式比较）；what a street is for = purpose and public investment（街道的用途与公共投入）。"
      }
    ]
  };

  const cn = {
    "21-0": "便利确实存在，但它是靠把劳动和成本转移到顾客看不见的地方生产出来的。",
    "21-1": "由于顾客为配送支付得很少甚至不付，降低成本的压力就落到工资、车辆维护和每站允许的时间上。",
    "21-2": "一辆送三十个包裹的货车可能比三十趟单独开车更高效，但当货车半空或退货增加行程时，这一比较就不那么有利了。",
    "21-3": "这并不意味着应当禁止当日达；它意味着价格应当说出真相。",
    "21-4": "问题不是便利是否值得拥有，而是谁在为它付费，以及他们是否同意。",
    "22-0": "一条由小店铺组成的街道也是一套基础设施：它缩短了家与所需物品之间的距离，为老年人提供见面场所，也为想创业的人提供低成本入口。",
    "22-1": "这种解释有道理，但并不完整。",
    "22-2": "租金是关键。",
    "22-3": "这可能有帮助，但也可能把街道冻结在原地：保住一家不再服务任何人的店，同时阻止新的用途出现。",
    "22-4": "问题不是老街道是否更好，而是一条街道究竟用来做什么。"
  };

  Object.keys(evidence).forEach(function (key) { window.READING_EVIDENCE[key] = evidence[key]; });
  Object.keys(cn).forEach(function (key) { window.READING_EVIDENCE_CN[key] = cn[key]; });
})();