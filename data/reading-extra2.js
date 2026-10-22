/* 阅读 21—22：自编仿真材料，不冒充真题。 */
(function () {
  const extra = [
    {
      id: 21,
      title: "The Price of Speed",
      topic: "消费与物流",
      difficulty: "中等",
      minutes: 18,
      source: "仿真练习",
      paragraphs: [
        "Same-day delivery is presented as a natural next step in shopping: you order, and the object appears at your door before dinner. The promise depends on a system that is anything but simple. Retailers keep small warehouses in cities, couriers wait for orders, and routing software recalculates every few seconds. The convenience is real, but it is produced by moving work and cost to places where the customer does not see them.",
        "The first hidden cost is labour. A delivery that takes twenty minutes may require a picker, a packer, a driver and a dispatcher, each working to a timetable set by software. Because the customer pays little or nothing for delivery, the pressure to reduce cost falls on wages, vehicle maintenance and the time allowed for each stop. The result is a service that looks cheap at the point of sale and expensive somewhere else in the chain.",
        "The second cost is environmental. A single van delivering thirty parcels may be more efficient than thirty separate car trips, but the comparison is not so favourable when the van is half empty or when returns multiply the journeys. Same-day delivery encourages small, frequent orders, and small, frequent orders are exactly what consolidated logistics is designed to avoid. The convenience of one click can therefore increase the number of vehicles on the road even as each vehicle becomes more efficient.",
        "The third cost is to the workers themselves. Routing software does not simply suggest a route; it sets the pace. Drivers are rated on time, stops per hour and customer feedback, and the algorithm adjusts. A system that treats traffic, weather and building access as noise will always find someone to blame when the schedule fails. The worker absorbs the uncertainty that the model cannot represent.",
        "None of this means that same-day delivery should be banned. It means that the price should tell the truth. Cities can charge for the road space and kerbside access that delivery uses, require companies to report labour conditions, and set standards for returns and packaging. Consumers can decide how much speed they actually need. The question is not whether convenience is worth having, but who is paying for it and whether they have agreed to."
      ],
      glossary: [
        ["consolidated", "合并的；集约的"],
        ["kerbside", "路边"],
        ["routing", "路线规划"],
        ["dispatcher", "调度员"],
        ["uncertainty", "不确定性"]
      ],
      questions: [
        {
          stem: "The author describes same-day delivery as a system that",
          options: [
            "has made shopping simpler for everyone.",
            "moves work and cost out of the customer's sight.",
            "has replaced traditional warehouses.",
            "is less popular than it appears."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "第 1 段末句：The convenience is real, but it is produced by moving work and cost to places where the customer does not see them。B 是原句的同义概括。A 只重复 convenience，忽略隐藏成本；C、D 无据。"
        },
        {
          stem: "The phrase \"the pressure to reduce cost falls on wages\" suggests that",
          options: [
            "delivery workers are paid more than they should be.",
            "customers are unaware of the labour behind low delivery fees.",
            "wages are the only cost in the delivery chain.",
            "software has eliminated the need for drivers."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 2 段",
          explain: "第 2 段说客户为配送付得很少，降低成本的压力就落到工资、车辆维护和每站时间上。B 概括了“低价由别处承担”的含义。A 与文意相反；C 过于绝对；D 与 picker, packer, driver 并存矛盾。"
        },
        {
          stem: "The comparison between a van and thirty car trips is used to show that",
          options: [
            "vans are always better for the environment.",
            "efficiency depends on how full the vehicle is and how many journeys are made.",
            "returns have no effect on emissions.",
            "same-day delivery reduces the number of vehicles."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 3 段",
          explain: "第 3 段先承认 van 可能更高效，随后用 half empty 和 returns multiply the journeys 限定这一结论，说明效率取决于装载率和行程数。B 准确。A 是绝对化；C 与 returns 句相反；D 与最后一句 increase the number of vehicles 相反。"
        },
        {
          stem: "The author's attitude toward banning same-day delivery is",
          options: [
            "supportive.",
            "opposed to any regulation.",
            "cautious: regulation is preferable to a ban.",
            "indifferent."
          ],
          answer: 2,
          type: "态度题",
          loc: "第 5 段",
          explain: "第 5 段开头 None of this means that same-day delivery should be banned，随后提出收费、报告劳动条件、设定标准等监管措施。C 兼顾“不禁止”与“要监管”。A 与开头相反；B 与后文措施矛盾；D 与作者明确立场不符。"
        },
        {
          stem: "The passage is mainly about",
          options: [
            "the technical details of routing software.",
            "why consumers prefer same-day delivery.",
            "the hidden costs of a convenience presented as free.",
            "how to eliminate delivery work."
          ],
          answer: 2,
          type: "主旨题",
          loc: "全文",
          explain: "全文围绕 same-day delivery 的便利与三重隐藏成本（劳动、环境、工人）展开，末段落到“价格应说真话”。C 概括准确。A 只是第 4 段细节；B 只涉及第 1 段；D 无据。"
        }
      ]
    },
    {
      id: 22,
      title: "The Small Shop Problem",
      topic: "城市与商业",
      difficulty: "中等",
      minutes: 17,
      source: "仿真练习",
      paragraphs: [
        "The closure of a local shop is usually described as a loss of character. That is true, but it is not the whole story. A street of small shops is also a piece of infrastructure: it shortens the distance between home and the things people need, gives older residents a place to meet, and offers a low-cost entry point for people who want to start a business. When the shops go, those functions do not disappear; they move somewhere less convenient, or they are simply not provided.",
        "The usual explanation is that small shops cannot compete with chains and online retailers. There is truth in this, but the explanation is incomplete. Chains benefit from scale in purchasing, marketing and logistics; small shops benefit from location, knowledge and trust. The problem is that the second set of advantages is hard to measure and easy to ignore. A planning system that counts parking spaces but not walkable destinations will keep producing the same result.",
        "Rent is the hinge. A landlord who can let a unit to a chain at a higher rent has little reason to wait for a local business, and a local business that succeeds may be priced out when its lease is renewed. The result is a kind of filtering: the shops that survive are not necessarily the ones that serve the neighbourhood best, but the ones that can carry the highest rent. This is not a moral failure of any individual; it is what the rules reward.",
        "The policy response is often to protect small shops as a category. That can help, but it can also freeze a street in place, preserving a shop that no longer serves anyone while preventing a new use from emerging. A better approach is to protect the functions rather than the form: support affordable workspace, allow temporary and mixed uses, and tax land in a way that does not punish improvements. The aim is not to keep every shop open, but to keep the street capable of adapting.",
        "Nostalgia is a poor guide here. The question is not whether the old street was better, but what a street is for. If it is only a place to pass through, then a row of closed shutters is efficient. If it is a place where people live, meet and trade, then the mix of uses matters. A city that wants the second kind of street has to decide that it is worth paying for, and then write rules that make it possible."
      ],
      glossary: [
        ["infrastructure", "基础设施"],
        ["hinge", "关键；枢纽"],
        ["lease", "租约"],
        ["filtering", "筛选"],
        ["shutter", "百叶窗；关闭的店门"]
      ],
      questions: [
        {
          stem: "The author argues that small shops should be seen as",
          options: [
            "a nostalgic symbol of the past.",
            "a form of urban infrastructure.",
            "a temporary stage before chains take over.",
            "a problem for urban planning."
          ],
          answer: 1,
          type: "细节题",
          loc: "第 1 段",
          explain: "第 1 段明确说 A street of small shops is also a piece of infrastructure，并列举缩短距离、提供见面场所、降低创业门槛等功能。B 对应。A 是末段批评的怀旧框架；C、D 无据。"
        },
        {
          stem: "The author suggests that the \"usual explanation\" for shop closures is",
          options: [
            "completely wrong.",
            "partly right but incomplete.",
            "the only explanation supported by evidence.",
            "irrelevant to planning policy."
          ],
          answer: 1,
          type: "态度题",
          loc: "第 2 段",
          explain: "第 2 段说 There is truth in this, but the explanation is incomplete，随后补充小店铺的位置、知识和信任优势。B 准确。A、C、D 都与“有道理但不完整”矛盾。"
        },
        {
          stem: "The word \"hinge\" in paragraph 3 is closest in meaning to",
          options: [
            "a minor detail.",
            "the central factor.",
            "a legal restriction.",
            "an unexpected result."
          ],
          answer: 1,
          type: "词义题",
          loc: "第 3 段",
          explain: "后文围绕租金如何决定哪些店铺能留下展开，说明 rent 是关键因素。B 正确。A 与后文重要性相反；C、D 与租金机制无关。"
        },
        {
          stem: "The author's view of protecting small shops \"as a category\" is that it",
          options: [
            "is the best available policy.",
            "may preserve form while losing function.",
            "should be extended to all retail.",
            "has no effect on rents."
          ],
          answer: 1,
          type: "推断题",
          loc: "第 4 段",
          explain: "第 4 段说这种保护可能 freeze a street in place，preserving a shop that no longer serves anyone，并主张 protect the functions rather than the form。B 概括了这一批评。A 与“better approach”矛盾；C、D 无据。"
        },
        {
          stem: "The passage concludes that the real question is",
          options: [
            "whether the old street was better.",
            "how to keep every shop open.",
            "what a street is for and whether the city will pay for it.",
            "how to attract more chains."
          ],
          answer: 2,
          type: "主旨题",
          loc: "第 5 段",
          explain: "末段说 The question is not whether the old street was better, but what a street is for，并强调城市必须决定是否值得为之付费。C 准确。A 是作者否定的问题；B 与“not keep every shop open”相反；D 无据。"
        }
      ]
    }
  ];

  extra.forEach(function (r) { window.READINGS.push(r); });
})();