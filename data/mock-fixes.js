/* 模考答案分布校正层
   全真模考阅读与完形的原始选项顺序存在答案过度集中在 B 的问题。
   本文件按整卷 A/B/C/D 各 5 题重排选项位置；正确项文本不变，
   阅读解析中引用选项字母的地方同步换算。源篇目保留原始顺序。 */
(function () {
  const READING_FIXES = [
    // en2-1
    {"id":1,"q":0,"options":["removing a daily reason for workers to enter the city.","reducing the number of new offices being built.","increasing demand for public transport.","forcing shops to close permanently."],"answer":0,"explain":"定位第 1 段第三句：it removed the reason many of them had for entering the city at all。远程办公不只是把人留在家里，而是抽掉了他们进城的理由。B、D 均未提及；C 与第 2 段交通客流下降相反。"},
    {"id":1,"q":4,"options":["The End of the Office","The Cost of Public Transport","Why Cities Need to Rethink Downtown","How to Convert Offices into Homes"],"answer":2,"explain":"文章从办公区空心化谈到改造障碍，最后落到“城市的功能是什么”，核心是城市需要重新思考中心区的用途。A 过窄且极端；B、D 只是局部细节。"},
    {"id":3,"q":3,"options":["minority students performed poorly on standardized tests.","test scores were still required for most applicants.","universities failed to publicize the new policy.","students with other resources benefit most from dropping test scores."],"answer":3,"explain":"第 4 段指出，从取消考试中受益最多的，往往是已有资源以其他方式呈现强申请的学生；政策改变了一个信号的权重，却没有改变其他信号背后的资源。D 是原文的概括。"},
    {"id":4,"q":1,"options":["carbon labels are always inaccurate.","consumers prefer ethically produced goods.","labour conditions are improving worldwide.","a single metric can hide other important harms."],"answer":3,"explain":"低碳产品仍可能涉及恶劣劳动条件或长距离运输，说明单一指标会掩盖其他伤害。A 过于绝对“always”；B、C 无依据。"},
    {"id":4,"q":4,"options":["Carbon labels are ineffective and should be abandoned.","Consumers are misled mainly by dishonest companies.","Carbon labels are more effective than carbon taxes.","Carbon labels are a useful but limited tool for reducing emissions."],"answer":3,"explain":"文章承认标签的吸引力与作用，同时从理解、覆盖、分布三方面指出局限，结论是工具而非政策。D 最完整；A、B、C 均偏。"},
    // en2-2
    {"id":5,"q":1,"options":["devices should be rented rather than bought.","repair restrictions raise a question about who really owns a product.","manufacturers charge too little for their products.","consumers rarely read the terms of sale."],"answer":1,"explain":"前句说 cannot repair what you buy，后句用 licence 作比：不能修，就等于只买到“使用许可”，而不是完整的所有权。A 是曲解；C、D 无依据。"},
    {"id":7,"q":0,"options":["early detection may not change the course of a disease.","it detects diseases too late to treat them.","it is too expensive for most patients.","doctors are unwilling to treat early disease."],"answer":0,"explain":"定位 Yet finding a disease earlier is not the same as changing its course。更早发现不等于改变疾病进程。B 与 early 相反；C、D 均无依据。"},
    {"id":7,"q":1,"options":["an apparent survival gain created by earlier diagnosis.","the tendency to diagnose slow-growing tumours.","the influence of patient age on screening.","a statistical error caused by small samples."],"answer":0,"explain":"提前五年诊断、死亡年龄不变，诊断后的生存期看起来延长了五年，这正是领先时间偏倚。B 是 length bias；C、D 无依据。"},
    {"id":7,"q":4,"options":["Screening is a waste of medical resources.","Earlier diagnosis always extends life.","Screening should be evaluated by outcomes and explained honestly.","Only wealthy countries can afford screening."],"answer":2,"explain":"文章既承认有效筛查，也指出过度诊断与统计错觉，末段主张更好的筛查、解释利弊并承认不确定性。C 最完整；A、B、D 均偏。"},
    {"id":8,"q":3,"options":["a more detailed algorithm that cannot be gamed.","decisions made only by workers.","the removal of all performance metrics.","published criteria, independent appeal and human override."],"answer":3,"explain":"定位 published criteria, independent appeal, and a human who can override the score。作者明确说没有完美算法，任何规则都可能被规避或藏偏见。A 与文意矛盾；B、C 过度。"},
    {"id":8,"q":4,"options":["is always fairer than human managers.","cannot measure anything useful.","should be abolished in delivery work.","needs accountability and worker voice, not just efficiency."],"answer":3,"explain":"文章承认算法管理可能带来公平与可预测性，但强调指标是人为选择，必须公开标准、允许申诉、保留人工推翻，并让工人参与设定指标。D 最完整；A、B、C 均偏。"},
    // en1-1
    {"id":9,"q":4,"options":["stop building any new roads.","ban cars from all city centres.","measure access and safety rather than lane miles.","rely only on congestion charging."],"answer":2,"explain":"文章不否定道路本身，而是否定以车道里程为目标；末段主张衡量可达性、安全与城市健康。A、B、D 均过度。"},
    {"id":10,"q":3,"options":["it determines whether newsrooms can be profitable.","donors always support government policy.","a single powerful backer can undermine independence.","public funding is illegal in most countries."],"answer":2,"explain":"定位 a single powerful backer can turn a newspaper into a newsletter；因此基金设计要保护编辑独立。A 不是重点；B、D 无依据。"},
    {"id":10,"q":4,"options":["is a failed business that should be abandoned.","is less important than national news.","should be owned entirely by government.","is civic infrastructure whose funding must protect independence."],"answer":3,"explain":"文章把地方新闻称为“地方如何被治理的日常记录”，强调市场失灵不等于无人需要，并讨论资助方式与独立性。D 最完整；A、B、C 均偏。"},
    {"id":11,"q":2,"options":["supportive.","indifferent.","critical, because acquisitions have different histories.","confident that all objects should stay."],"answer":2,"explain":"定位 A blanket rule would be unjust in one direction or the other；文物来源不同，应逐案判断。A 相反；B、D 无据。"},
    {"id":11,"q":3,"options":["preventing any object from being returned.","removing source communities from decisions.","transferring all authority to donors.","agreeing on display, care and long-term loans."],"answer":3,"explain":"定位 agreements on display, care and long-term loans。合作可以回应展示、保管与出借的担忧，但不能维持“博物馆是唯一负责所有者”的虚构。A、B、C 相反。"},
    {"id":11,"q":4,"options":["keep all objects to preserve universal access.","stop displaying objects from other cultures.","sell their collections to fund new buildings.","share stewardship and negotiate with source communities."],"answer":3,"explain":"文章主张博物馆的目标是文化之间的关系，关系需要协商；未来可能藏品更少、故事更复杂。D 最完整；A、B、C 均偏。"},
    {"id":12,"q":1,"options":["completed.","reduced.","postponed.","shared."],"answer":2,"explain":"deferred maintenance 指被推迟的维护；后文说它会以紧急事故、更高维修账单的形式出现。C 最准确。A、B、D 与语境不符。"},
    {"id":12,"q":2,"options":["reward long-term maintenance.","make elections unnecessary.","favor visible projects over invisible prevention.","reduce the cost of new buildings."],"answer":2,"explain":"剪彩的新楼可见，维护计划不可见；选举周期奖励可见支出、惩罚税收。定位 a bias toward the urgent over the important。A 相反；B、D 无据。"},
    {"id":12,"q":3,"options":["eliminating political disagreement.","reducing the number of elections.","replacing maintenance with new construction.","making invisible costs visible."],"answer":3,"explain":"定位 they make the invisible visible；公开账目让原本无人计算的成本进入争论。A、B、C 均过度或无据。"},
    {"id":12,"q":4,"options":["respond only to emergencies.","avoid all long-term investment.","stop publishing infrastructure accounts.","count and credit prevention, not just crisis spending."],"answer":3,"explain":"末段说社会的能力更多体现在预防了多少危机，而非如何处理危机；需要不同的会计与政治，为“没有发生的灾难”记功。D 最完整。"},
    // en1-2
    {"id":13,"q":0,"options":["confidence that outlasts its actual benefit.","a lasting improvement in memory.","a clearer sense of what they have not learned.","an inability to judge difficulty at all."],"answer":0,"explain":"定位 rereading produces modest gains that fade within days, while the confidence it creates lasts much longer：收益短暂，信心却持久。B 与原文相反；C、D 无依据。"},
    {"id":14,"q":0,"options":["it is linked with safety and progress.","its effects are limited to birds.","it can no longer be measured.","astronomers are not persuasive."],"answer":0,"explain":"定位 because light is associated with safety and progress：光被与安全和进步联系在一起，所以不被当作污染。B、C、D 均无依据。"},
    {"id":14,"q":4,"options":["Artificial light should be banned in cities.","Migrating birds are the most important victims of light pollution.","Night lighting has hidden ecological costs that can be reduced without giving up light.","Darkness is healthier for humans but harmful to wildlife."],"answer":2,"explain":"全文从昆虫、鸟类、海龟、植物讲到“问题在于错误的时间、地点与亮度”，主张保留光的好处、削减代价。A 过度；B 只是例证之一；D 与原文相反。"},
    {"id":15,"q":0,"options":["most firms chose to keep the shorter week.","revenue at most firms fell sharply.","employees asked to return to five days.","stress levels were not measured."],"answer":0,"explain":"定位 most companies ... decided to keep the schedule 以及 most of the firms stayed with the shorter week after the trial ended。B 与 revenue changed little 相反；C、D 无依据。"},
    {"id":15,"q":3,"options":["employees enjoyed the extra day.","researchers measured outcomes.","pay remained unchanged.","the model survives harder times."],"answer":3,"explain":"定位 whether the model survives a recession, when companies cut whatever looks optional。A、B、C 都是试验已确认的事实，未回答的问题是长期与逆境表现。"},
    {"id":15,"q":4,"options":["The four-day week has been proven to work everywhere.","Only factories can adopt a four-day week.","Shorter weeks reduce revenue and should be rejected.","The four-day week is a promising but conditional reform whose evidence is limited."],"answer":3,"explain":"全文肯定试验结果，同时指出样本、行业限制与时间跨度问题，主张将其视为严肃假设。A 过度；B、C 与原文不符。"},
    {"id":16,"q":0,"options":["are identical across platforms.","have become simpler over time.","often contradict one another.","were designed for modern networks."],"answer":2,"explain":"定位 the rules ... pull in opposite directions，并举例一个要求符号、另一个禁止。A 与 opposite 相反；B、D 无依据。"},
    {"id":16,"q":1,"options":["unusually careless.","unaware that security matters.","responding rationally to unreasonable demands.","responsible for most data breaches."],"answer":2,"explain":"定位 people respond rationally 与 three requirements that human memory cannot meet at once：复用是对不合理要求的理性反应。A、B、D 与作者立场相反。"},
    {"id":16,"q":3,"options":["passwords are too short to guess.","forums store passwords in plain text.","banks send passwords by email.","users reuse the same password across services."],"answer":3,"explain":"定位 which works precisely because people reuse：撞库得手的前提正是复用。A 与“逐条猜密码很少成功”相反；B、C 无依据。"},
    {"id":16,"q":4,"options":["Users should memorise longer passwords.","Credential stuffing is impossible to prevent.","Passkeys have solved every security problem.","Security should be redesigned around human limits, not blamed on users."],"answer":3,"explain":"全文指出密码要求与人类记忆不匹配，把责任推给用户无效；有效改革是减少记忆负担、让安全选项成为默认。A 与作者建议相反；B、C 过度。"},
  ];
  const CLOZE_FIXES = [
    // en2-1
    {"index":0,"q":7,"options":["consistent","decisive","limited","public"],"answer":2},
    {"index":0,"q":8,"options":["satisfied","familiar","crowded","consistent"],"answer":3},
    {"index":0,"q":9,"options":["by","on","at","in"],"answer":3},
    {"index":1,"q":6,"options":["Similarly","Moreover","For example","Yet"],"answer":3},
    // en2-2
    {"index":2,"q":0,"options":["mistaken","correct","popular","recent"],"answer":0},
    {"index":3,"q":0,"options":["haste","memory","luck","logic"],"answer":0},
    {"index":3,"q":6,"options":["emotion","speed","precision","loyalty"],"answer":2},
    {"index":3,"q":8,"options":["or","yet","so","nor"],"answer":3},
    {"index":3,"q":9,"options":["announce","publish","defend","question"],"answer":3},
    // en1-1
    {"index":4,"q":1,"options":["enter","leave","cover","heat"],"answer":0},
    {"index":4,"q":7,"options":["private","artificial","shared","temporary"],"answer":2},
    {"index":4,"q":8,"options":["individual","voluntary","sudden","collective"],"answer":3},
    {"index":4,"q":9,"options":["permanent","expensive","mysterious","disposable"],"answer":3},
    {"index":5,"q":9,"options":["wait","apologise","pay","fight"],"answer":3},
    // en1-2
    {"index":6,"q":4,"options":["gained","lost","booked","shared"],"answer":1},
  ];
  const readings = {};
  (window.READINGS || []).forEach(function (r) { readings[r.id] = r; });
  READING_FIXES.forEach(function (fix) {
    const r = readings[fix.id];
    const q = r && r.questions && r.questions[fix.q];
    if (!q) return;
    q.options = fix.options.slice();
    q.answer = fix.answer;
    q.explain = fix.explain;
  });
  CLOZE_FIXES.forEach(function (fix) {
    const set = (window.CLOZES || [])[fix.index];
    const item = set && set.items && set.items[fix.q];
    if (!item) return;
    item.options = fix.options.slice();
    item.answer = fix.answer;
    if (fix.explain) item.explain = fix.explain;
  });
})();
