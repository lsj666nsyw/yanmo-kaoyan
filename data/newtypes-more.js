/* 新题型扩充（第二批）
   排序题 1 套 + 小标题匹配 1 套，材料为原创仿真内容。 */

(function () {
  window.ORDER_SETS = (window.ORDER_SETS || []).concat([
    {
      title: "The Economics of Repair",
      intro: "排序题 · 7 段 · 首段 A、末段 G 已定 · 建议 18 分钟。注意问题、后果与对策的先后。",
      paragraphs: [
        {
          label: "A",
          text: "Most of the products in a modern home are cheaper to replace than to repair. A kettle fails, a phone screen cracks, a washing machine's bearing wears out, and the practical answer is a new one. This is not because repair is impossible. It is because the price of a new product reflects a global supply chain, while the price of repair reflects local labour, spare parts and time."
        },
        {
          label: "B",
          text: "Right-to-repair laws try to change the arithmetic. They require access to parts, tools and manuals, and they prevent warranties from being voided simply because an independent shop did the work. The aim is not to force everyone to repair, but to make repair a real option. Competition, not sentiment, is supposed to bring prices down."
        },
        {
          label: "C",
          text: "Manufacturers have little reason to make repair easy. A product that lasts a decade sells once; a product that lasts three years sells three times. Sealed cases, glued batteries and proprietary screws are not accidents. They shorten the interval between purchases and make independent repair shops dependent on the manufacturer for parts and tools."
        },
        {
          label: "D",
          text: "Repair is not always the right answer. Old appliances can consume far more energy than new ones; safety-critical components may need replacement rather than patching; some products are so poorly built that repair is a trap. A sensible policy distinguishes between devices that can be kept in service and those that should be retired."
        },
        {
          label: "E",
          text: "Consumers are not simply careless. Repair requires finding a technician, leaving a device behind, and accepting a bill that may approach the price of a new one. Warranties often punish unauthorized repair, and insurance may replace rather than fix. Faced with these frictions, replacement is rational even for someone who would prefer to repair."
        },
        {
          label: "F",
          text: "The environmental bill is paid elsewhere. Manufacturing a phone concentrates energy, water and rare materials in a small object; discarding it adds to a growing stream of electronic waste. Because the damage is distant and cumulative, it does not appear in the price of either the device or the repair. The market is efficient at making the choice, but blind to what the choice costs."
        },
        {
          label: "G",
          text: "The deeper shift is cultural as much as legal. A society that repairs needs technicians with status, spare parts in stock and consumers willing to wait. It also needs products designed to be opened. None of that can be legislated into existence overnight, but the price signals can point in the right direction."
        }
      ],
      first: "A",
      last: "G",
      answers: ["C", "E", "F", "B", "D"],
      explain: [
        "A 末句对比“新品价格”与“维修价格”，C 用 Manufacturers have little reason... 接住“为什么维修不划算”，再讲设计与商业动机。B 是政策回应，必须等问题充分展开后再出现。",
        "C 讲完厂商一侧，E 转到消费者一侧：Consumers are not simply careless 解释“换新其实是理性选择”。F 讲环境成本，是更外层的后果，不能插在消费者行为之前。",
        "E 末句说“换新是理性的”，F 用 The environmental bill is paid elsewhere 指出这个选择的代价没有计入价格。B 的 right-to-repair laws 是对策，应排在问题之后。",
        "F 讲完市场失灵，B 用 Right-to-repair laws try to change the arithmetic 接住“改变算法”，提出制度方案。D 的 Repair is not always... 是对方案的限定，必须在其后。",
        "B 讲“让维修成为真正的选项”，D 用 Repair is not always the right answer 转折限定，避免一边倒。G 的 The deeper shift 是全文收束。"
      ],
      tips: [
        ["先定首尾", "A 提出“换比修便宜”的反常现象，G 收束到文化与制度。中间段落应按“厂商动机 → 消费者处境 → 环境后果 → 政策方案 → 方案边界”推进。"],
        ["注意对比信号", "not because... It is because...、not simply careless、paid elsewhere 都是转折或递进，提示下一段要换一个层面解释。"],
        ["对策不能太早", "Right-to-repair laws 是对前面问题的回应，必须排在厂商、消费者、环境三层问题之后。"],
        ["限定段在方案后", "Repair is not always the right answer 承认维修的边界，作用是在提出政策后补充限定，不能放在开头。"],
        ["代入通读", "排完后从 A 读到 G，检查每段开头是否能接上上一段末句；尤其注意 B 的 the arithmetic 指代什么。"]
      ]
    }
  ]);

  window.HEADING_SETS = (window.HEADING_SETS || []).concat([
    {
      title: "What Makes a Good Street",
      intro: "小标题匹配 · 5 段 6 选项 · 建议 12 分钟。为每段选一个标题，有一项多余。",
      sections: [
        "A good street is not defined by its buildings but by what happens at eye level. Shade, somewhere to sit, a reason to linger: these small affordances decide whether people walk or drive. A bench under a tree can do more for a shopping district than a new sign, because it turns a route into a place.",
        "Safety on a street depends less on patrols than on the presence of people. When windows overlook the pavement and doors open onto it, a street has many informal witnesses. A blank wall or a parking garage does the opposite: it removes the eyes that make a place feel safe after dark.",
        "A wide road may move cars efficiently while emptying the street of life. The faster traffic goes, the less it stops, and the fewer reasons there are to cross on foot. Retailers often discover too late that the extra lanes brought more vehicles but fewer customers.",
        "Small businesses spill onto the pavement: a few tables, a rack of postcards, a queue that forms a block. This is not clutter to be designed away but the visible economy of a street. Rules that forbid every obstruction can make a place tidier and poorer at the same time.",
        "None of this survives without maintenance. A street is a long piece of infrastructure: drains, lights, paving, trees and bins. The work is unglamorous and easy to defer, and the decline is gradual enough that no single budget meeting looks responsible. By the time the street feels neglected, the cost of catching up has grown."
      ],
      options: [
        "Eyes on the street",
        "The cost of speed and width",
        "Room for small commerce",
        "Why tall buildings are the answer",
        "Shade, seats and reasons to linger",
        "The unglamorous work of upkeep"
      ],
      answers: [4, 0, 1, 2, 5],
      extra: 3,
      explain: [
        "首句直接说街道不由建筑决定，而由“eye level”发生的事决定；随后列举树荫、座椅、停留的理由。E 的 shade, seats and reasons to linger 是准确概括。",
        "本段的关键词是 windows overlook、doors open、informal witnesses，讲的是“有人看着街道”带来的安全感。A 的 eyes on the street 对应这一机制。",
        "本段讲宽路让车更快、却让街道失去生活，过街理由减少，商铺客流下降。B 的 the cost of speed and width 概括这一交换。",
        "本段讲小商家把桌椅、明信片架摆到人行道上，这是街道可见的经济活动，不该被“整洁”规则全部清除。C 的 room for small commerce 对应。",
        "末段讲排水、路灯、铺装、树木、垃圾桶的维护，工作不起眼、容易被推迟，拖久了成本更高。F 的 the unglamorous work of upkeep 是概括。"
      ],
      tips: [
        ["标题看功能", "五个标题分别对应“舒适停留、非正式看护、速度代价、小商业、维护”。先把段落归入这五种功能，再看措辞。"],
        ["同义替换", "upkeep 对应 maintenance，eyes on the street 对应 informal witnesses，room 对应 spill onto the pavement。标题很少直接重复原文词。"],
        ["注意对比", "首段 not defined by its buildings but by... 是典型的“否定—更正”结构，主旨落在 but 之后。"],
        ["多余项像但不对", "Why tall buildings are the answer 借用了首段的 buildings，但全文没有论证高层建筑，只是用建筑作对比。"],
        ["末段常收束", "最后一段从具体设施上升到“维护容易被推迟”，标题要能覆盖整段，而不只是 drains 或 bins。"]
      ]
    }
  ]);
})();
