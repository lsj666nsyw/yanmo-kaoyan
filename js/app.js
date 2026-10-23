(function () {
  "use strict";

  /* ------------------------------------------------------------------
     data
  ------------------------------------------------------------------ */

  const ALL_WORDS = [];
  const seenWords = new Set();
  (window.VOCAB || []).forEach(function (w) {
    const key = String(w.w).toLowerCase();
    if (!seenWords.has(key)) {
      seenWords.add(key);
      ALL_WORDS.push(w);
    }
  });
  const WORD_MAP = new Map();
  ALL_WORDS.forEach(function (w) { WORD_MAP.set(w.w, w); });

  function wordDetail(w) {
    const map = window.VOCAB_DETAIL || {};
    return w ? (map[w.w] || null) : null;
  }
  function detailPh(w) {
    if (w && w.ph) return w.ph;
    const d = wordDetail(w);
    return d && d.ph ? d.ph : "";
  }
  function hasDetail(w) {
    const d = wordDetail(w);
    return !!(d && d.use && Array.isArray(d.phr) && d.phr.length && d.ex && d.exCn && d.deep);
  }

  const TAG_OPTIONS = [
    { v: "全部", l: "全部" },
    { v: "精讲", l: "精讲" },
    { v: "高频", l: "高频" },
    { v: "核心", l: "核心" },
    { v: "僻义", l: "熟词僻义" },
    { v: "易混", l: "易混辨析" },
    { v: "补充", l: "补充" },
    { v: "生词本", l: "生词本" }
  ];
  const TAG_LABEL = { "高频": "高频", "核心": "核心", "僻义": "僻义", "易混": "易混", "补充": "补充" };

  const TASKS = [
    { t: "词汇", s: "先过一遍词表，再逐张标记", href: "#/vocab", cta: "去背词", key: "vocab" },
    { t: "长难句 2 句", s: "拆主干、标修饰、译成中文", href: "#/sentences", cta: "看解析", key: "sentence" },
    { t: "阅读 1 篇", s: "限时 18 分钟，做完对答案", href: "#/reading", cta: "做阅读", key: "reading" },
    { t: "写作 1 段", s: "背 3 句功能句，或写一段主体", href: "#/writing", cta: "看写作", key: "writing" },
    { t: "复盘错题", s: "看 2 道错题，想清楚为什么错", href: "#/me/mistakes", cta: "看错题", key: "review" }
  ];

  /* ------------------------------------------------------------------
     helpers
  ------------------------------------------------------------------ */

  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function ymd(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function parseYmd(str) {
    const p = String(str).split("-").map(Number);
    return new Date(p[0], (p[1] || 1) - 1, p[2] || 1);
  }

  function todayKey() { return ymd(new Date()); }

  function addDays(date, n) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + n);
    return d;
  }

  function daysUntil(str) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = parseYmd(str);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - now) / 86400000);
  }

  function fmtDateCn(d) {
    const week = "日一二三四五六"[d.getDay()];
    return d.getFullYear() + " 年 " + (d.getMonth() + 1) + " 月 " + d.getDate() + " 日 · 星期" + week;
  }

  function fmtShort(str) {
    const p = String(str).split("-");
    return p[0] + "." + p[1] + "." + p[2];
  }

  function mmss(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function letter(i) { return String.fromCharCode(65 + i); }

  function wordCount(text) {
    return String(text).trim().split(/\s+/).filter(Boolean).length;
  }

  function thirdSaturday(year) {
    const first = new Date(year, 11, 1);
    const offset = (6 - first.getDay() + 7) % 7;
    return new Date(year, 11, 1 + offset + 14);
  }

  function defaultExamDate() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let d = thirdSaturday(now.getFullYear());
    if (d < now) d = thirdSaturday(now.getFullYear() + 1);
    return ymd(d);
  }

  function examYear() {
    return parseYmd(state.examDate).getFullYear() + 1;
  }

  function tagLabel(tag) { return TAG_LABEL[tag] || tag || ""; }

  function tagClass(tag) {
    if (tag === "高频") return "tag hot";
    if (tag === "核心") return "tag ink";
    if (tag === "补充") return "tag";
    return "tag";
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(ta);
    });
  }

  /* 朗读：系统英文语音优先；没有英文语音或系统语音报错时，使用内置离线语音。
     内置语音是 meSpeak（eSpeak 的 JS 移植），不联网，也不依赖 speechSynthesis。 */
  const TTS_MODES = ["auto", "native", "builtin"];
  let nativeVoiceList = [];
  let builtinTtsReady = false;
  let builtinTtsFailed = false;

  function refreshNativeVoices() {
    if (!("speechSynthesis" in window)) { nativeVoiceList = []; return; }
    try { nativeVoiceList = window.speechSynthesis.getVoices() || []; } catch (err) { nativeVoiceList = []; }
  }

  if ("speechSynthesis" in window) {
    refreshNativeVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", refreshNativeVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = refreshNativeVoices;
    }
  }

  function pickEnglishVoice() {
    let list = (nativeVoiceList && nativeVoiceList.length)
      ? nativeVoiceList
      : (("speechSynthesis" in window) ? (window.speechSynthesis.getVoices() || []) : []);
    if (!list.length) return null;
    const en = list.filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ""); });
    if (!en.length) return null;
    const score = function (v) {
      const name = (v.name || "").toLowerCase();
      let s = 0;
      if (/natural|neural|online/i.test(name)) s += 8;      // Windows 11「Aria Online (Natural)」等
      if (/^en-us/i.test(v.lang || "")) s += 3;
      if (/^en-gb/i.test(v.lang || "")) s += 2;
      if (/aria|jenny|ana|emma|michelle|guy|zira|samantha|daniel|serena|google/i.test(name)) s += 3;
      if (v.localService) s += 1;
      return s;
    };
    en.sort(function (a, b) { return score(b) - score(a); });
    return en[0];
  }

  function initBuiltinTts() {
    if (builtinTtsReady) return true;
    if (builtinTtsFailed) return false;
    if (!window.meSpeak || !window.meSpeakCore || !window.MESPEAK_VOICE) {
      return false;
    }
    try {
      const NativeXHR = window.XMLHttpRequest;
      function VoiceXHR() { this.readyState = 0; this.status = 0; this.responseText = ""; }
      VoiceXHR.prototype.open = function (method, url) { this.url = url; };
      VoiceXHR.prototype.send = function () {
        this.readyState = 4;
        this.status = 200;
        this.responseText = JSON.stringify(window.MESPEAK_VOICE);
        if (this.onreadystatechange) this.onreadystatechange();
      };
      window.XMLHttpRequest = VoiceXHR;
      let ok = false;
      try {
        meSpeak.loadVoice("voices/en/en-us.json", function (success) { if (success) ok = true; });
      } finally {
        window.XMLHttpRequest = NativeXHR;
      }
      builtinTtsReady = !!(ok || (meSpeak.isVoiceLoaded && meSpeak.isVoiceLoaded("en/en-us")));
      if (!builtinTtsReady) builtinTtsFailed = true;
      return builtinTtsReady;
    } catch (err) {
      builtinTtsFailed = true;
      return false;
    }
  }

  function speakBuiltin(text) {
    if (!initBuiltinTts()) {
      toast(builtinTtsFailed ? "内置语音不可用，请换用系统语音" : "内置语音正在加载，请稍后再点一次");
      return false;
    }
    try {
      if (meSpeak.stop) meSpeak.stop();
      meSpeak.speak(text, { speed: 150, amplitude: 100, wordgap: 25 }, function (ok) {
        if (!ok) toast("发音失败，请再点一次");
      });
      return true;
    } catch (err) {
      toast("发音失败：" + (err.message || "未知错误"));
      return false;
    }
  }

  // 长文本按句切分后依次入队播放，避免单条超长语音开头延迟大、中途卡顿
  function speechChunks(text) {
    if (text.length <= 200) return [text];
    const parts = [];
    let buf = "";
    const segs = text.split(/(?<=[.!?;:])\s+/);
    for (const s of segs) {
      if (buf && (buf.length + s.length + 1) > 200) { parts.push(buf); buf = s; }
      else buf = buf ? buf + " " + s : s;
      while (buf.length > 380) { parts.push(buf.slice(0, 380)); buf = buf.slice(380); }
    }
    if (buf) parts.push(buf);
    return parts;
  }

  let speakDelay = null;

  function speakNative(text) {
    if (!("speechSynthesis" in window)) return false;
    const voice = pickEnglishVoice();
    if (!voice) return false;
    const synth = window.speechSynthesis;
    let busy = false;
    try { busy = !!(synth.speaking || synth.pending); } catch (err) {}
    if (busy) { try { synth.cancel(); } catch (err) {} }
    if (speakDelay) { clearTimeout(speakDelay); speakDelay = null; }
    function start() {
      try {
        const chunks = speechChunks(text);
        for (let i = 0; i < chunks.length; i++) {
          const u = new SpeechSynthesisUtterance(chunks[i]);
          u.voice = voice;
          u.lang = voice.lang || "en-US";
          u.rate = chunks[i].length > 120 ? 0.95 : 0.92; // 句子稍快，单词稍慢更清楚
          u.pitch = 1;
          u.volume = 1;
          if (i === 0) u.onerror = function () { speakBuiltin(text); };
          synth.speak(u);
        }
      } catch (err) {
        speakBuiltin(text);
      }
    }
    // Windows 在「取消后立即开始」时大概率出现静音/迟滞，中断重播时延迟一拍启动
    speakDelay = setTimeout(start, busy ? 80 : 10);
    return true;
  }

  function speak(text) {
    text = String(text || "").trim();
    if (!text) return;
    const mode = (state && TTS_MODES.indexOf(state.ttsMode) !== -1) ? state.ttsMode : "auto";
    if (mode === "native") {
      if (!speakNative(text)) speakBuiltin(text);
      return;
    }
    if (mode === "builtin") {
      speakBuiltin(text);
      return;
    }
    if (!speakNative(text)) speakBuiltin(text);
  }

  /* ------------------------------------------------------------------
     state
  ------------------------------------------------------------------ */

  const KEY = "yanmo.kaoyan.v1";

  function clozeSets() {
    return (window.CLOZES && window.CLOZES.length) ? window.CLOZES : [window.CLOZE];
  }

  function sevenSets() {
    return (window.SEVENS && window.SEVENS.length) ? window.SEVENS : [window.SEVEN];
  }

  function orderSets() {
    return (window.ORDER_SETS && window.ORDER_SETS.length) ? window.ORDER_SETS : [];
  }

  function headingSets() {
    return (window.HEADING_SETS && window.HEADING_SETS.length) ? window.HEADING_SETS : [];
  }

  function emptyCloze() {
    return { answers: {}, submitted: false, score: 0 };
  }

  function emptySeven() {
    return { answers: [null, null, null, null, null], submitted: false, score: 0 };
  }

  function emptyOrder() {
    return { answers: [null, null, null, null, null], submitted: false, score: 0 };
  }

  function emptyHeading() {
    return { answers: [null, null, null, null, null], submitted: false, score: 0 };
  }

  function defaultState() {
    return {
      version: 1,
      examDate: defaultExamDate(),
      dailyWords: 30,
      ttsMode: "auto",
      words: {},
      notebook: [],
      mistakes: [],
      days: {},
      reading: {},
      clozes: clozeSets().map(function () { return emptyCloze(); }),
      sevens: sevenSets().map(function () { return emptySeven(); }),
      orders: orderSets().map(function () { return emptyOrder(); }),
      headings: headingSets().map(function () { return emptyHeading(); }),
      translations: {},
      drafts: {},
      trapStats: {}
    };
  }

  function normalizeState(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;
    const plain = function (v) { return !!v && typeof v === "object" && !Array.isArray(v); };
    const merged = Object.assign({}, base, raw);
    merged.words = plain(raw.words) ? raw.words : {};
    merged.notebook = (Array.isArray(raw.notebook) ? raw.notebook : []).filter(function (w) { return typeof w === "string"; });
    merged.mistakes = (Array.isArray(raw.mistakes) ? raw.mistakes : []).filter(function (m) { return m && typeof m === "object" && typeof m.key === "string"; });
    merged.days = plain(raw.days) ? raw.days : {};
    merged.reading = plain(raw.reading) ? raw.reading : {};
    merged.translations = plain(raw.translations) ? raw.translations : {};
    merged.drafts = plain(raw.drafts) ? raw.drafts : {};
    merged.trapStats = {};
    const rawTrapStats = plain(raw.trapStats) ? raw.trapStats : {};
    ["无中生有", "偷换概念", "反向/绝对化", "过度推断"].forEach(function (type) {
      const src = plain(rawTrapStats[type]) ? rawTrapStats[type] : {};
      const total = Math.max(0, Math.floor(Number(src.total) || 0));
      const right = Math.min(total, Math.max(0, Math.floor(Number(src.right) || 0)));
      if (total) merged.trapStats[type] = { total: total, right: right };
    });
    merged.clozes = clozeSets().map(function (_, i) {
      const src = Array.isArray(raw.clozes) && plain(raw.clozes[i])
        ? raw.clozes[i]
        : (i === 0 && plain(raw.cloze) ? raw.cloze : {});
      const st = Object.assign(emptyCloze(), src);
      if (!plain(st.answers)) st.answers = {};
      st.submitted = !!st.submitted;
      st.score = Number(st.score) || 0;
      return st;
    });
    merged.sevens = sevenSets().map(function (_, i) {
      const src = Array.isArray(raw.sevens) && plain(raw.sevens[i])
        ? raw.sevens[i]
        : (i === 0 && plain(raw.seven) ? raw.seven : {});
      const st = Object.assign(emptySeven(), src);
      if (!Array.isArray(st.answers)) st.answers = [null, null, null, null, null];
      while (st.answers.length < 5) st.answers.push(null);
      st.answers = st.answers.slice(0, 5);
      st.submitted = !!st.submitted;
      st.score = Number(st.score) || 0;
      return st;
    });
    merged.orders = orderSets().map(function (_, i) {
      const src = Array.isArray(raw.orders) && plain(raw.orders[i]) ? raw.orders[i] : {};
      const st = Object.assign(emptyOrder(), src);
      if (!Array.isArray(st.answers)) st.answers = [null, null, null, null, null];
      while (st.answers.length < 5) st.answers.push(null);
      st.answers = st.answers.slice(0, 5).map(function (x) { return x == null ? null : String(x); });
      st.submitted = !!st.submitted;
      st.score = Number(st.score) || 0;
      return st;
    });
    merged.headings = headingSets().map(function (_, i) {
      const src = Array.isArray(raw.headings) && plain(raw.headings[i]) ? raw.headings[i] : {};
      const st = Object.assign(emptyHeading(), src);
      if (!Array.isArray(st.answers)) st.answers = [null, null, null, null, null];
      while (st.answers.length < 5) st.answers.push(null);
      st.answers = st.answers.slice(0, 5);
      st.submitted = !!st.submitted;
      st.score = Number(st.score) || 0;
      return st;
    });
    delete merged.cloze;
    delete merged.seven;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(merged.examDate)) merged.examDate = base.examDate;
    merged.dailyWords = Math.min(100, Math.max(5, Number(merged.dailyWords) || 30));
    merged.ttsMode = TTS_MODES.indexOf(merged.ttsMode) !== -1 ? merged.ttsMode : "auto";
    return merged;
  }

  function loadState() {
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (err) { raw = null; }
    return normalizeState(raw);
  }

  const state = loadState();

  window.addEventListener("vocabdetailready", function () {
    if (ui.drawerWord) renderDrawer();
    const route = getRoute();
    if (route.name === "vocab" || route.name === "me") rerender();
  });

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* local file may block storage */ }
  }

  function ensureDay(key) {
    if (!state.days[key]) {
      state.days[key] = { tasks: [false, false, false, false, false], minutes: 0, words: 0, active: false };
    }
    const d = state.days[key];
    if (!Array.isArray(d.tasks)) d.tasks = [];
    while (d.tasks.length < TASKS.length) d.tasks.push(false);
    d.minutes = Number(d.minutes) || 0;
    d.words = Number(d.words) || 0;
    if (typeof d.active !== "boolean") d.active = false;
    return d;
  }

  function touch() {
    ensureDay(todayKey()).active = true;
    save();
  }

  function markTask(i, silent) {
    const d = ensureDay(todayKey());
    if (!d.tasks[i]) {
      d.tasks[i] = true;
      touch();
      if (!silent) toast("已记入今日任务");
    }
  }

  function isActiveDay(d) {
    if (!d) return false;
    return !!d.active || Number(d.minutes) > 0 || Number(d.words) > 0 || (Array.isArray(d.tasks) && d.tasks.some(Boolean));
  }

  function streakDays() {
    let cursor = new Date();
    if (!isActiveDay(state.days[ymd(cursor)])) cursor = addDays(cursor, -1);
    let count = 0;
    while (isActiveDay(state.days[ymd(cursor)])) {
      count++;
      cursor = addDays(cursor, -1);
      if (count > 3650) break;
    }
    return count;
  }

  function totalMinutes() {
    return Object.keys(state.days).reduce(function (sum, key) {
      return sum + (Number(state.days[key] && state.days[key].minutes) || 0);
    }, 0);
  }

  function knownCount() {
    return Object.keys(state.words).filter(function (w) { return state.words[w] === "known"; }).length;
  }

  function notebookWords() {
    return state.notebook.map(function (w) { return WORD_MAP.get(w); }).filter(Boolean);
  }

  function wordStatus(w) {
    if (state.words[w] === "known") return { key: "known", label: "已掌握", cls: "known" };
    if (state.words[w] === "fuzzy") return { key: "fuzzy", label: "待巩固", cls: "fuzzy" };
    if (state.notebook.indexOf(w) !== -1) return { key: "new", label: "生词", cls: "new" };
    return { key: "", label: "", cls: "" };
  }

  function setWordStatus(w, status) {
    if (status) state.words[w] = status;
    else delete state.words[w];
    if (status === "known") {
      state.notebook = state.notebook.filter(function (x) { return x !== w; });
    } else if (status === "new" || status === "fuzzy") {
      if (state.notebook.indexOf(w) === -1) state.notebook.unshift(w);
    }
    save();
  }

  function toggleNotebook(w) {
    const i = state.notebook.indexOf(w);
    if (i === -1) {
      state.notebook.unshift(w);
      toast("已加入生词本");
    } else {
      state.notebook.splice(i, 1);
      toast("已移出生词本");
    }
    save();
  }

  function currentPhase() {
    const d = daysUntil(state.examDate);
    if (d >= 240) return "basic";
    if (d >= 120) return "build";
    if (d >= 40) return "sprint";
    return "final";
  }

  function phaseInfo() {
    const key = currentPhase();
    return (window.PLAN.phases || []).find(function (p) { return p.key === key; }) || { name: "备考", when: "" };
  }

  function filteredWords() {
    let list = ALL_WORDS;
    if (ui.vocabTag === "生词本") {
      list = list.filter(function (w) { return state.notebook.indexOf(w.w) !== -1; });
    } else if (ui.vocabTag === "精讲") {
      list = list.filter(function (w) { return hasDetail(w); });
    } else if (ui.vocabTag !== "全部") {
      list = list.filter(function (w) { return w.tag === ui.vocabTag; });
    }
    const q = ui.vocabQ.trim().toLowerCase();
    if (q) {
      list = list.filter(function (w) {
        return w.w.toLowerCase().indexOf(q) !== -1 || String(w.cn).indexOf(q) !== -1;
      });
    }
    return list;
  }

  const ui = {
    vocabMode: "list",
    vocabTag: "全部",
    vocabQ: "",
    vocabLimit: 60,
    cardIndex: 0,
    cardFlipped: false,
    cardSession: { known: 0, fuzzy: 0, unknown: 0, graded: 0 },
    spell: null,
    drawerWord: null,
    drawerList: [],
    readId: null,
    readStart: null,
    writingTab: "small",
    clozeTab: "cloze",
    clozeSet: 0,
    sevenSet: 0,
    orderSet: 0,
    headingSet: 0,
    trapIndex: 0,
    trapPicked: null,
    trapChecked: false,
    trapScore: 0,
    trapAnswers: [],
    transOpen: {},
    notebookFilter: "all",
    mistakeFilter: "全部",
    sentenceLevel: "全部",
    sentenceOpen: {},
    sentenceOpened: {},
    transTab: "sentence",
    meTab: "notebook",
    redo: {},
    reviewed: {},
    searchTimer: null
  };

  function activeCloze() {
    const sets = clozeSets();
    const index = Math.min(Math.max(Number(ui.clozeSet) || 0, 0), sets.length - 1);
    ui.clozeSet = index;
    if (!state.clozes[index]) state.clozes[index] = emptyCloze();
    return { set: sets[index], index: index, st: state.clozes[index] };
  }

  function activeSeven() {
    const sets = sevenSets();
    const index = Math.min(Math.max(Number(ui.sevenSet) || 0, 0), sets.length - 1);
    ui.sevenSet = index;
    if (!state.sevens[index]) state.sevens[index] = emptySeven();
    return { set: sets[index], index: index, st: state.sevens[index] };
  }

  function activeOrder() {
    const sets = orderSets();
    if (!sets.length) return { set: null, index: 0, st: null };
    const index = Math.min(Math.max(Number(ui.orderSet) || 0, 0), sets.length - 1);
    ui.orderSet = index;
    if (!state.orders[index]) state.orders[index] = emptyOrder();
    return { set: sets[index], index: index, st: state.orders[index] };
  }

  function activeHeading() {
    const sets = headingSets();
    if (!sets.length) return { set: null, index: 0, st: null };
    const index = Math.min(Math.max(Number(ui.headingSet) || 0, 0), sets.length - 1);
    ui.headingSet = index;
    if (!state.headings[index]) state.headings[index] = emptyHeading();
    return { set: sets[index], index: index, st: state.headings[index] };
  }

  const timer = {
    total: 25 * 60,
    remaining: 25 * 60,
    running: false
  };

  /* ------------------------------------------------------------------
     shared page furniture
  ------------------------------------------------------------------ */

  function pageHead(no, label, title, lead) {
    return `
      <header class="page-head">
        <p class="eyebrow">${esc(no)} / ${esc(label)}</p>
        <h1 class="page-title">${title}</h1>
        <p class="page-lead">${lead || ""}</p>
      </header>`;
  }

  function footerNote() {
    return `<p class="footer-note"><span>研墨 · 考研英语</span><span>篇目与例句为原创仿真材料，供备考练习使用</span></p>`;
  }

  function updateSidebar() {
    const d = Math.max(0, daysUntil(state.examDate));
    const days = $("#sideDays");
    const date = $("#sideDate");
    if (days) days.textContent = d;
    if (date) date.textContent = fmtShort(state.examDate) + " 初试";
  }

  function getRoute() {
    const raw = (location.hash || "#/home").replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    return { name: parts[0] || "home", param: parts[1] || null, sub: parts[2] || null };
  }

  const PAGE_TITLES = {
    home: "今日", vocab: "词汇", sentences: "长难句", reading: "阅读",
    cloze: "完形与新题型", translation: "翻译", writing: "写作",
    plan: "真题与规划", me: "我的记录"
  };

  /* ------------------------------------------------------------------
     home
  ------------------------------------------------------------------ */

  function weekSeries() {
    const out = [];
    const now = new Date();
    const names = "日一二三四五六";
    for (let i = 6; i >= 0; i--) {
      const d = addDays(now, -i);
      const key = ymd(d);
      out.push({
        key: key,
        label: names[d.getDay()],
        minutes: Number(state.days[key] && state.days[key].minutes) || 0,
        today: i === 0
      });
    }
    return out;
  }

  function pageHome() {
    const d = Math.max(0, daysUntil(state.examDate));
    const day = ensureDay(todayKey());
    const done = day.tasks.filter(Boolean).length;
    const phase = phaseInfo();
    const quote = (window.SENTENCES && SENTENCES.length) ? SENTENCES[(Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)) % SENTENCES.length] : null;
    const week = weekSeries();
    const maxMin = Math.max(1, Math.max.apply(null, week.map(function (x) { return x.minutes; })));
    const weekTotal = week.reduce(function (s, x) { return s + x.minutes; }, 0);

    const taskRows = TASKS.map(function (t, i) {
      const isDone = !!day.tasks[i];
      const label = t.key === "vocab" ? "词汇 " + state.dailyWords + " 个" : t.t;
      const sub = t.key === "vocab" ? "先过一遍词表，再逐张标记" : t.s;
      return `
        <li class="task ${isDone ? "done" : ""}">
          <button class="check" data-action="toggle-task" data-i="${i}" aria-pressed="${isDone}" aria-label="标记任务：${esc(label)}">
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.3 4.8 9 10 3.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
          </button>
          <div class="task-copy"><b>${esc(label)}</b><span>${esc(sub)}</span></div>
          <a class="task-link" href="${t.href}">${esc(t.cta)}</a>
        </li>`;
    }).join("");

    const bars = week.map(function (w) {
      const height = w.minutes ? Math.max(4, Math.round(w.minutes / maxMin * 84)) : 2;
      return `<div class="bar-col ${w.today ? "today" : ""}" title="${w.key} · ${w.minutes} 分钟">
        <span class="bar" style="height:${height}%"></span>
        <span class="bar-label">${w.label}</span>
      </div>`;
    }).join("");

    return `
      <header class="home-head">
        <div>
          <p class="eyebrow">${fmtDateCn(new Date())}</p>
          <h1 class="page-title">今日</h1>
          <p class="page-lead">${esc(phase.name)}。${done === TASKS.length ? "今天的任务已经做完，剩下的时间留给复盘。" : "先做完下面五项，再考虑加量。"}</p>
        </div>
        <div class="countdown">
          <span class="countdown-num">${d}</span><span class="countdown-unit">天</span>
          <span class="countdown-cap">距 ${examYear()} 考研初试 · ${fmtShort(state.examDate)}</span>
        </div>
      </header>

      <div class="home-grid">
        <div class="home-col">
          <section class="section">
            <div class="section-head"><h2>今日任务</h2><span class="section-note"><b>${done}</b> / ${TASKS.length} 完成</span></div>
            <div class="progress"><span style="width:${Math.round(done / TASKS.length * 100)}%"></span></div>
            <ul class="task-list">${taskRows}</ul>
          </section>

          ${quote ? `
          <section class="section daily-quote">
            <div class="section-head"><h2>今日一句</h2><span class="section-note">长难句 · ${esc(quote.tags[0] || "")}</span></div>
            <p class="en">${esc(quote.en)}</p>
            <p class="cn">${esc(quote.cn)}</p>
            <div class="foot">
              <a class="text-link" href="#/sentences">看结构拆解</a>
              <button class="text-link" data-action="speak" data-text="${esc(quote.en)}">朗读原句</button>
            </div>
          </section>` : ""}

          <section class="section">
            <div class="section-head"><h2>直接开始</h2><span class="section-note">按题型</span></div>
            <div class="quick-grid">
              <a class="quick-item" href="#/reading"><span>阅读一篇</span><span>18 分钟 →</span></a>
              <a class="quick-item" href="#/reading/traps"><span>练干扰项归因</span><span>${(window.TRAP_DRILLS || []).length} 道 →</span></a>
              <a class="quick-item" href="#/sentences"><span>拆两句长难句</span><span>30 句 →</span></a>
              <a class="quick-item" href="#/me/notebook"><span>过一遍生词</span><span>${state.notebook.length} 词 →</span></a>
              <a class="quick-item" href="#/writing"><span>背三句功能句</span><span>写作 →</span></a>
              <a class="quick-item" href="#/plan"><span>看真题规划</span><span>备考 →</span></a>
            </div>
          </section>
        </div>

        <aside class="home-rail">
          <div class="timer-card ${timer.running ? "running" : ""}" id="timerCard">
            <div class="timer-head"><span class="label">专注</span><span class="live"><i class="timer-dot"></i><span id="timerState">${timer.running ? "进行中" : "未开始"}</span></span></div>
            <div class="timer-time" id="timerTime">${mmss(timer.remaining)}</div>
            <div class="timer-actions">
              <button class="btn btn-sm btn-solid" id="timerToggle" data-action="timer-toggle">${timer.running ? "暂停" : "开始"}</button>
              <button class="btn btn-sm btn-quiet" data-action="timer-reset">重置</button>
            </div>
            <div class="chips" style="margin-top:10px">
              <button class="chip ${timer.total === 1500 ? "on" : ""}" data-action="timer-set" data-min="25">25 分钟</button>
              <button class="chip ${timer.total === 3000 ? "on" : ""}" data-action="timer-set" data-min="50">50 分钟</button>
            </div>
            <p class="timer-note">完成一整段，时间才计入今日统计。</p>
          </div>

          ${homeNextStep()}

          <section class="rail-block">
            <div class="rail-head"><h3>本周专注</h3><span>${weekTotal} 分钟</span></div>
            <div class="bars">${bars}</div>
          </section>

          <section class="rail-block">
            <div class="rail-head"><h3>进度</h3><span>连续 ${streakDays()} 天</span></div>
            <div class="rail-stats">
              <div class="rail-stat"><span>已掌握词汇</span><b>${knownCount()}<small>/${ALL_WORDS.length}</small></b></div>
              <div class="rail-stat"><span>生词本</span><b>${state.notebook.length}<small>词</small></b></div>
              <div class="rail-stat"><span>错题</span><b>${state.mistakes.length}<small>道</small></b></div>
            </div>
          </section>
        </aside>
      </div>`;
  }

  /* ------------------------------------------------------------------
     vocabulary
  ------------------------------------------------------------------ */

  function tagChips() {
    return TAG_OPTIONS.map(function (t) {
      let count = "";
      if (t.v === "全部") count = ALL_WORDS.length;
      else if (t.v === "生词本") count = state.notebook.length;
      else if (t.v === "精讲") count = ALL_WORDS.filter(function (w) { return hasDetail(w); }).length;
      else count = ALL_WORDS.filter(function (w) { return w.tag === t.v; }).length;
      return `<button class="chip ${ui.vocabTag === t.v ? "on" : ""}" data-action="set-tag" data-tag="${t.v}">${t.l}<span class="n">${count}</span></button>`;
    }).join("");
  }

  function wordRow(w) {
    const st = wordStatus(w.w);
    const longClass = w.w.length > 22 ? " xlong" : (w.w.length > 14 ? " long" : "");
    const tag = w.tag ? `<span class="${tagClass(w.tag)}">${tagLabel(w.tag)}</span>` : "";
    return `<li>
      <button class="word-row" data-action="open-word" data-w="${esc(w.w)}">
        <span class="word-main${longClass}"><b>${esc(w.w)}</b><span class="phon">${detailPh(w) ? "&#47;" + esc(detailPh(w)) + "&#47;" : ""}</span></span>
        <span class="word-cn">${esc(w.cn)}</span>
        <span class="word-tag">${tag}</span>
        <span class="word-status ${st.cls}">${st.label}</span>
      </button>
    </li>`;
  }

  function pageVocab() {
    const day = ensureDay(todayKey());
    const list = filteredWords();
    const detailed = ALL_WORDS.filter(function (w) { return hasDetail(w); }).length;
    const detailReady = !!window.VOCAB_DETAIL;
    return `
      ${pageHead("02", "词汇", "词汇", "大纲词很多，真正反复考的只是一部分。先把高频义项和搭配吃透，再谈遍数。")}

      <div class="stat-strip">
        <div class="stat"><p class="k">词库</p><p class="v">${ALL_WORDS.length}<small>词</small></p><p class="s">${!detailReady ? "词条详解加载中" : (detailed === ALL_WORDS.length ? "全部带用法卡" : detailed + " 精讲 · " + (ALL_WORDS.length - detailed) + " 待补")}</p></div>
        <div class="stat"><p class="k">已掌握</p><p class="v">${knownCount()}<small>词</small></p><p class="s">标记为“认识”</p></div>
        <div class="stat"><p class="k">生词本</p><p class="v">${state.notebook.length}<small>词</small></p><p class="s">待复习</p></div>
        <div class="stat"><p class="k">今日已过</p><p class="v">${day.words}<small>/ ${state.dailyWords}</small></p><p class="s">目标 ${state.dailyWords} 词</p></div>
      </div>

      <p class="vocab-note">每个词条按“用法—搭配—例句—辨析”整理。点开任意单词即可看完整卡片；卡片背面也会带一句用法和例句，不再只给中文释义。</p>

      <div class="toolbar">
        <div class="toolbar-left">
          ${ui.vocabMode === "list" ? `
          <div class="search">
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 10.5 14 14" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>
            <input id="vocabSearch" type="search" value="${esc(ui.vocabQ)}" placeholder="查单词或释义" autocomplete="off">
          </div>` : ""}
          <div class="chips" id="vocabTags">${tagChips()}</div>
        </div>
        <div class="view-tabs">
          <button class="${ui.vocabMode === "list" ? "on" : ""}" data-action="set-mode" data-mode="list">词表</button>
          <button class="${ui.vocabMode === "card" ? "on" : ""}" data-action="set-mode" data-mode="card">卡片</button>
          <button class="${ui.vocabMode === "spell" ? "on" : ""}" data-action="set-mode" data-mode="spell">拼写</button>
        </div>
      </div>

      <div id="vocabBody">${vocabBody(list)}</div>`;
  }

  function vocabBody(list) {
    if (ui.vocabMode === "card") return cardBody(list || filteredWords());
    if (ui.vocabMode === "spell") return spellBody();
    const rows = list.slice(0, ui.vocabLimit);
    return `
      <div class="count-line" id="vocabCount">共 ${list.length} 词</div>
      <ul class="word-list" id="vocabList">
        ${rows.length ? rows.map(wordRow).join("") : `<li class="empty" style="border:0"><p class="mark">无</p><p>没有找到匹配的词条。</p></li>`}
      </ul>
      <div class="list-more ${list.length > ui.vocabLimit ? "" : "hidden"}" id="vocabMore">
        <button class="btn btn-quiet" data-action="load-more">加载更多</button>
      </div>`;
  }

  function cardBody(list) {
    if (!list.length) {
      return `<div class="empty"><p class="mark">空</p><p>这个分类里还没有词。换一个分类，或先看词表。</p><div class="actions"><button class="btn btn-quiet" data-action="set-mode" data-mode="list">返回词表</button></div></div>`;
    }
    if (ui.cardIndex >= list.length) {
      const s = ui.cardSession;
      return `<div class="study-wrap">
        <div class="summary">
          <p class="eyebrow" style="justify-content:center">本轮完成</p>
          <p class="big">${s.graded}</p>
          <h2>这一轮过完了</h2>
          <p>认识 ${s.known} · 模糊 ${s.fuzzy} · 不认识 ${s.unknown}</p>
          <div class="actions">
            <button class="btn btn-solid" data-action="restart-cards">再来一轮</button>
            <button class="btn btn-quiet" data-action="set-mode" data-mode="list">回到词表</button>
          </div>
        </div>
        <p class="flash-tips">“不认识”和“模糊”的词会自动进入生词本。</p>
      </div>`;
    }
    const w = list[ui.cardIndex];
    const st = wordStatus(w.w);
    const longClass = w.w.length > 20 ? " long" : "";
    const d = wordDetail(w);
    const backUse = d && d.use ? d.use : "";
    const backPhr = d && Array.isArray(d.phr) && d.phr.length ? d.phr.slice(0, 2).join(" · ") : (w.note || "");
    const backEx = (d && d.ex) || w.ex || "";
    const backExCn = (d && d.exCn) || w.exCn || "";
    const front = `
      <span class="flash-tag">${w.tag ? tagLabel(w.tag) : "词条"}</span>
      <span class="flash-word${longClass}">${esc(w.w)}</span>
      <span class="flash-phon">${detailPh(w) ? "/" + esc(detailPh(w)) + "/" : (w.pos || "")}</span>
      <span class="flash-hint">点击翻面 · 空格</span>`;
    const back = `
      <span class="flash-tag">${w.tag ? tagLabel(w.tag) : "词条"}</span>
      <div class="flash-back">
        <p class="flash-def">${w.pos ? `<span class="flash-pos">${esc(w.pos)}</span>` : ""}${esc(w.cn)}</p>
        ${backUse ? `<p class="flash-use">${esc(backUse)}</p>` : ""}
        ${backPhr ? `<p class="flash-phr">${esc(backPhr)}</p>` : ""}
        ${backEx ? `<p class="flash-ex">${esc(backEx)}<small>${esc(backExCn)}</small></p>` : ""}
      </div>
      <span class="flash-hint">1 不认识 · 2 模糊 · 3 认识</span>`;
    return `<div class="study-wrap">
      <div class="study-top">
        <span>${tagLabel(ui.vocabTag === "全部" ? "全部" : ui.vocabTag)}</span>
        <div class="progress"><span style="width:${Math.round((ui.cardIndex + 1) / list.length * 100)}%"></span></div>
        <span>${ui.cardIndex + 1} / ${list.length}</span>
      </div>
      <button class="flashcard" data-action="flip-card" aria-label="翻转卡片">
        ${ui.cardFlipped ? back : front}
      </button>
      <div class="flash-actions">
        ${ui.cardFlipped
          ? `<button class="btn btn-quiet" data-action="grade-card" data-grade="unknown">不认识</button>
             <button class="btn btn-quiet" data-action="grade-card" data-grade="fuzzy">模糊</button>
             <button class="btn btn-solid" data-action="grade-card" data-grade="known">认识</button>`
          : `<button class="btn btn-solid" data-action="flip-card">显示释义</button>`}
      </div>
      <p class="flash-tips">${st.label ? "当前标记：" + st.label + " · " : ""}键盘：空格翻面，1 / 2 / 3 选择</p>
    </div>`;
  }

  function buildSpell() {
    const pool = filteredWords().filter(function (w) { return w.tag !== "易混"; });
    const deck = pool.slice();
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    ui.spell = {
      items: deck.slice(0, 10),
      i: 0,
      value: "",
      checked: false,
      ok: false,
      score: 0
    };
  }

  function spellBody() {
    if (!ui.spell) buildSpell();
    const sp = ui.spell;
    if (!sp.items.length) {
      return `<div class="empty"><p class="mark">空</p><p>这个分类里没有可拼写的词条。</p></div>`;
    }
    if (sp.i >= sp.items.length) {
      return `<div class="study-wrap"><div class="summary">
        <p class="eyebrow" style="justify-content:center">拼写测试</p>
        <p class="big">${sp.score} <small style="font-size:18px;color:var(--muted)">/ ${sp.items.length}</small></p>
        <h2>${sp.score >= Math.ceil(sp.items.length * 0.8) ? "记得很稳" : "还需要再过一遍"}</h2>
        <p>错的词已经可以加入生词本，下次重点看。</p>
        <div class="actions"><button class="btn btn-solid" data-action="spell-restart">再来一组</button><button class="btn btn-quiet" data-action="set-mode" data-mode="list">回到词表</button></div>
      </div></div>`;
    }
    const w = sp.items[sp.i];
    return `<div class="spell-wrap"><div class="spell-card">
      <div class="study-top"><span>拼写测试</span><span>${sp.i + 1} / ${sp.items.length}</span><span>得分 ${sp.score}</span></div>
      <p class="eyebrow" style="margin-top:22px">根据释义写单词</p>
      <p class="spell-cn">${esc(w.cn)}</p>
      <p class="spell-meta">${esc(w.pos || "")}${detailPh(w) ? " · /" + esc(detailPh(w)) + "/" : ""}${w.note ? " · " + esc(w.note) : ""}</p>
      <input class="spell-input" id="spellInput" data-spell-input type="text" autocomplete="off" spellcheck="false" value="${esc(sp.value)}" placeholder="输入英文" ${sp.checked ? "disabled" : ""}>
      <div class="spell-actions">
        ${sp.checked
          ? `<button class="btn btn-solid" data-action="spell-next">${sp.i + 1 >= sp.items.length ? "查看结果" : "下一题"}</button>`
          : `<button class="btn btn-solid" data-action="spell-check">检查</button><button class="btn btn-quiet" data-action="spell-reveal">不会</button>`}
      </div>
      <div class="spell-feedback ${sp.checked ? (sp.ok ? "ok" : "no") : ""}">
        ${sp.checked ? (sp.ok ? "正确。" : "应为 <span class='spell-answer'>" + esc(w.w) + "</span>") : ""}
      </div>
      ${sp.checked && w.ex ? `<p class="flash-ex" style="margin-top:6px">${esc(w.ex)}<small>${esc(w.exCn || "")}</small></p>` : ""}
    </div>
    <p class="flash-tips">先想再写。不会就点“不会”，不扣分，但要加入生词本。</p></div>`;
  }

  function startSpell() {
    buildSpell();
    ui.spell && (ui.spell.value = "");
  }

  function focusSpell() {
    if (getRoute().name !== "vocab" || ui.vocabMode !== "spell" || ui.drawerWord) return;
    const el = $("#spellInput");
    if (el && !el.disabled) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }

  /* ------------------------------------------------------------------
     vocabulary drawer
  ------------------------------------------------------------------ */

  function renderDrawer() {
    const drawer = $("#drawer");
    const backdrop = $("#backdrop");
    if (!drawer || !backdrop) return;
    const w = WORD_MAP.get(ui.drawerWord);
    if (!w) { closeDrawer(); return; }
    const st = wordStatus(w.w);
    const idx = ui.drawerList.findIndex(function (x) { return x.w === w.w; });
    const inBook = state.notebook.indexOf(w.w) !== -1;
    const longClass = w.w.length > 18 ? " long" : "";
    const d = wordDetail(w);
    const use = d && d.use ? d.use : "";
    const phr = d && Array.isArray(d.phr) ? d.phr : [];
    const ex = (d && d.ex) || w.ex || "";
    const exCn = (d && d.exCn) || w.exCn || "";
    const deep = d && d.deep ? d.deep : "";
    const memo = d && d.memo ? d.memo : "";
    const defs = d && Array.isArray(d.defs) ? d.defs : [];
    const syn = d && Array.isArray(d.syn) ? d.syn : [];
    const family = d && Array.isArray(d.family) ? d.family : [];

    drawer.innerHTML = `
      <div class="drawer-head">
        <span class="eyebrow">词条 · ${d ? "精讲" : (w.tag ? tagLabel(w.tag) : "速记")}</span>
        <button class="icon-btn" data-action="close-drawer" aria-label="关闭">✕</button>
      </div>
      <div class="drawer-body">
        <div class="drawer-word">
          <h2 class="${longClass}">${esc(w.w)}</h2>
          <p class="ph">${detailPh(w) ? "/" + esc(detailPh(w)) + "/" : ""} ${w.pos ? "· " + esc(w.pos) : ""}</p>
        </div>
        <div class="drawer-tags">${w.tag ? `<span class="${tagClass(w.tag)}">${tagLabel(w.tag)}</span>` : ""}<span class="${st.cls === "known" ? "tag green" : "tag"}">${st.label || "未标记"}</span></div>
        <div class="drawer-actions">
          <button class="btn btn-sm btn-quiet" data-action="speak" data-text="${esc(w.w)}">朗读</button>
          <button class="btn btn-sm btn-quiet" data-action="word-status" data-w="${esc(w.w)}" data-status="known">认识</button>
          <button class="btn btn-sm btn-quiet" data-action="word-status" data-w="${esc(w.w)}" data-status="fuzzy">模糊</button>
          <button class="btn btn-sm btn-quiet" data-action="word-status" data-w="${esc(w.w)}" data-status="new">不认识</button>
        </div>
        <p class="drawer-def">${w.pos ? `<span class="pos">${esc(w.pos)}</span>` : ""}${esc(w.cn)}</p>
        ${use ? `<div class="drawer-block"><p class="block-k">用法</p><p class="block-text">${esc(use)}</p></div>` : ""}
        ${defs.length ? `<div class="drawer-block"><p class="block-k">义项</p><ul class="drawer-senses">${defs.map(function (x) {
          if (typeof x === "string") return `<li>${esc(x)}</li>`;
          return `<li>${x.pos ? `<span class="sense-pos">${esc(x.pos)}</span>` : ""}${esc(x.cn || "")}${x.en ? `<span class="sense-en">${esc(x.en)}</span>` : ""}</li>`;
        }).join("")}</ul></div>` : ""}
        ${phr.length ? `<div class="drawer-block"><p class="block-k">搭配</p><ul class="drawer-phr">${phr.map(function (p) { return `<li>${esc(p)}</li>`; }).join("")}</ul></div>` : (w.note ? `<div class="drawer-block"><p class="block-k">搭配</p><p class="block-text">${esc(w.note)}</p></div>` : "")}
        ${ex ? `<div class="drawer-ex"><p class="block-k">例句</p><p class="en">${esc(ex)}</p><p class="cn">${esc(exCn || "")}</p></div>` : ""}
        ${syn.length ? `<div class="drawer-block"><p class="block-k">近义</p><p class="drawer-syn">${syn.map(function (s) { return `<span>${esc(s)}</span>`; }).join("")}</p></div>` : ""}
        ${family.length ? `<div class="drawer-block"><p class="block-k">词族</p><p class="drawer-syn">${family.map(function (s) { return `<span>${esc(s)}</span>`; }).join("")}</p></div>` : ""}
        ${memo ? `<div class="drawer-block"><p class="block-k">记忆</p><p class="block-text">${esc(memo)}</p></div>` : ""}
        ${deep ? `<div class="drawer-block drawer-deep"><p class="block-k">辨析</p><p class="block-text">${esc(deep)}</p></div>` : ""}
        <dl class="drawer-facts">
          <div class="row"><dt>状态</dt><dd>${st.label || "尚未标记"}${inBook ? " · 已在生词本" : ""}</dd></div>
        </dl>
        <button class="btn btn-sm ${inBook ? "btn-quiet" : "btn-accent"}" data-action="word-toggle-notebook" data-w="${esc(w.w)}" style="margin-top:18px">${inBook ? "移出生词本" : "加入生词本"}</button>
        <p class="drawer-status">${inBook ? "生词本会自动收录“不认识”和“模糊”的词。" : ""}</p>
        <div class="drawer-nav">
          <button class="btn btn-sm btn-quiet" data-action="drawer-prev" ${idx <= 0 ? "disabled" : ""}>上一条</button>
          <button class="btn btn-sm btn-quiet" data-action="drawer-next" ${idx === -1 || idx >= ui.drawerList.length - 1 ? "disabled" : ""}>下一条</button>
        </div>
      </div>`;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    drawer.scrollTop = 0;
  }

  function openWord(word) {
    if (!WORD_MAP.has(word)) return;
    ui.drawerWord = word;
    const route = getRoute();
    if (route.name === "me") ui.drawerList = notebookWords();
    else if (route.name === "vocab") ui.drawerList = filteredWords();
    else ui.drawerList = ALL_WORDS;
    if (!ui.drawerList.some(function (x) { return x.w === word; })) ui.drawerList = ALL_WORDS;
    renderDrawer();
  }

  function closeDrawer() {
    const drawer = $("#drawer");
    const backdrop = $("#backdrop");
    ui.drawerWord = null;
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = "";
  }

  /* ------------------------------------------------------------------
     render
  ------------------------------------------------------------------ */

  function render(options) {
    const opt = options || {};
    const scrollY = window.scrollY;
    const route = getRoute();
    let html = "";

    switch (route.name) {
      case "home": html = pageHome(); break;
      case "vocab": html = pageVocab(); break;
      case "sentences": html = pageSentences(); break;
      case "reading":
        if (route.param === "traps") html = pageTrapDrill();
        else html = route.param ? pageReadingDetail(Number(route.param)) : pageReadingList();
        break;
      case "cloze": html = pageCloze(); break;
      case "translation": html = pageTranslation(); break;
      case "writing": html = pageWriting(); break;
      case "plan": html = pagePlan(); break;
      case "me": html = pageMe(); break;
      default: html = pageHome();
    }

    $("#main").innerHTML = html + footerNote();
    $$("[data-nav]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === route.name);
    });
    updateSidebar();
    document.title = (PAGE_TITLES[route.name] || "研墨") + " · 研墨";

    if (opt.keepScroll) window.scrollTo(0, scrollY);
    else window.scrollTo(0, 0);

    afterRender(route);
  }

  function afterRender(route) {
    if (route.name === "reading" && route.param && route.param !== "traps") {
      const id = Number(route.param);
      const rec = state.reading[id];
      if (!rec || !rec.submitted) {
        if (ui.readId !== id || !ui.readStart) {
          ui.readId = id;
          ui.readStart = Date.now();
        }
      } else {
        ui.readId = null;
        ui.readStart = null;
      }
    } else {
      ui.readId = null;
      ui.readStart = null;
    }
    if (route.name === "reading" && route.param && route.sub) {
      const key = route.param + "/" + route.sub;
      if (ui.readFocusKey !== key) {
        ui.readFocusKey = key;
        const q = document.getElementById("read-q-" + Number(route.sub));
        if (q) {
          q.scrollIntoView({ behavior: "smooth", block: "center" });
          q.classList.add("focus-question");
          window.setTimeout(function () { q.classList.remove("focus-question"); }, 2400);
        }
      }
    } else {
      ui.readFocusKey = null;
    }
    if (route.name === "reading" && !route.param && ui.scrollDiag) {
      ui.scrollDiag = false;
      const diagnoses = document.getElementById("read-diagnosis");
      if (diagnoses) diagnoses.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (route.name === "vocab" && ui.vocabMode === "spell") {
      setTimeout(focusSpell, 30);
    }
  }

  function rerender() {
    render({ keepScroll: true });
  }

  /* ------------------------------------------------------------------
     long sentences
  ------------------------------------------------------------------ */

  function pageSentences() {
    if (Object.keys(ui.sentenceOpen).length === 0 && window.SENTENCES.length) {
      ui.sentenceOpen[window.SENTENCES[0].id] = true;
      ui.sentenceOpened[window.SENTENCES[0].id] = true;
    }
    const levels = ["全部", "基础", "进阶", "难点"];
    const list = ui.sentenceLevel === "全部"
      ? window.SENTENCES
      : window.SENTENCES.filter(function (s) { return s.level === ui.sentenceLevel; });
    const chips = levels.map(function (lv) {
      const n = lv === "全部" ? window.SENTENCES.length : window.SENTENCES.filter(function (s) { return s.level === lv; }).length;
      return `<button class="chip ${ui.sentenceLevel === lv ? "on" : ""}" data-action="sentence-level" data-level="${lv}">${lv}<span class="n">${n}</span></button>`;
    }).join("");

    return `
      ${pageHead("03", "长难句", "长难句", "长句不是靠语感硬读。先找主干，再把从句、分词和插入语一层层挂回去。")}
      <div class="toolbar">
        <div class="chips">${chips}</div>
        <span class="count-line">共 ${list.length} 句 · 点击句子展开拆解</span>
      </div>
      <div class="sentence-list">
        ${list.length ? list.map(sentenceCard).join("") : `<div class="empty"><p class="mark">空</p><p>这个层级暂时没有句子。</p></div>`}
      </div>
      <div class="note-strip info" style="margin-top:26px">先自己划主干，再点开对照。看懂一遍不算会，能不看解析复述结构才算。</div>`;
  }

  function sentenceCard(s) {
    const open = ui.sentenceOpen[s.id] === true;
    const parts = s.parts.map(function (p, i) {
      return `<div class="analysis-row"><dt>成分 ${i + 1}</dt><dd><span class="en">${esc(p[0])}</span><span class="cn">${esc(p[1])}</span></dd></div>`;
    }).join("");
    return `
      <article class="sentence-card ${open ? "open" : ""}" id="sent-${s.id}">
        <button class="sentence-summary" data-action="toggle-sentence" data-id="${s.id}" aria-expanded="${open}">
          <span class="sentence-no">${String(s.id).padStart(2, "0")}</span>
          <span class="sentence-main">
            <span class="sentence-en">${esc(s.en)}</span>
            <span class="sentence-toggle"><span class="toggle-label">${open ? "收起解析" : "拆主干 · 看修饰"}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1v10M1 6h10" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></span>
          </span>
          <span class="sentence-tags">${s.tags.map(function (t) { return `<span class="tag">${esc(t)}</span>`; }).join("")}</span>
        </button>
        <div class="sentence-body">
          <dl class="analysis-grid">
            <div class="analysis-row"><dt>主干</dt><dd><span class="en">${esc(s.trunk)}</span></dd></div>
            ${parts}
            <div class="analysis-row"><dt>读法</dt><dd>${esc(s.point)}</dd></div>
          </dl>
          <p class="sentence-cn"><b>参考译文</b>　${esc(s.cn)}</p>
          <div class="sentence-foot">
            <span class="tag">${esc(s.level)}</span>
            <div class="chips">
              <button class="text-link" data-action="speak" data-text="${esc(s.en)}">朗读原句</button>
              <button class="text-link muted" data-action="copy-sentence" data-id="${s.id}">复制译文</button>
            </div>
          </div>
        </div>
      </article>`;
  }

  /* ------------------------------------------------------------------
     reading
  ------------------------------------------------------------------ */

  function readingRec(id) {
    const raw = state.reading[id];
    if (!raw || typeof raw !== "object") {
      return { answers: {}, submitted: false, score: 0, elapsed: 0, locates: {} };
    }
    return {
      answers: raw.answers && typeof raw.answers === "object" ? raw.answers : {},
      submitted: !!raw.submitted,
      score: Number(raw.score) || 0,
      elapsed: Number(raw.elapsed) || 0,
      locates: raw.locates && typeof raw.locates === "object" && !Array.isArray(raw.locates) ? raw.locates : {}
    };
  }

  function readingEvidence(id, qi) {
    const rows = window.READING_EVIDENCE && window.READING_EVIDENCE[String(id)];
    return rows && rows[qi] ? rows[qi] : null;
  }

  function readingEvidenceCn(id, qi) {
    const map = window.READING_EVIDENCE_CN;
    return map && map[id + "-" + qi] ? map[id + "-" + qi] : "";
  }

  function readingLocateScore(r, rec) {
    let asked = 0;
    let correct = 0;
    let total = 0;
    r.questions.forEach(function (q, qi) {
      const ev = readingEvidence(r.id, qi);
      if (!ev || !ev.para) return;
      total++;
      if (rec.locates[qi] == null) return;
      asked++;
      if (Number(rec.locates[qi]) === Number(ev.para)) correct++;
    });
    return { asked: asked, correct: correct, total: total };
  }

  function readingRiskItems() {
    const items = [];
    let luckyCount = 0;
    let unverifiedCount = 0;
    window.READINGS.forEach(function (r) {
      const rec = readingRec(r.id);
      if (!rec.submitted) return;
      const q = readingQuality(r, rec);
      q.luckyItems.forEach(function (item) {
        luckyCount++;
        items.push({
          r: item.r,
          q: item.q,
          qi: item.qi,
          kind: "lucky",
          located: rec.locates[item.qi] != null ? Number(rec.locates[item.qi]) : null,
          target: Number(readingEvidence(r.id, item.qi).para)
        });
      });
      q.unverifiedItems.forEach(function (item) {
        unverifiedCount++;
        items.push({ r: item.r, q: item.q, qi: item.qi, kind: "unverified" });
      });
    });
    return { items: items, lucky: luckyCount, unverified: unverifiedCount };
  }

  function readingQuality(r, rec) {
    const out = {
      trueMastery: 0,
      lucky: 0,
      locatedWrong: 0,
      lost: 0,
      unverifiedCorrect: 0,
      unverifiedWrong: 0,
      luckyItems: [],
      unverifiedItems: []
    };
    r.questions.forEach(function (q, qi) {
      const picked = rec.answers[qi];
      if (picked == null) return;
      const ev = readingEvidence(r.id, qi);
      if (!ev || !ev.para) return;
      const isCorrect = Number(picked) === q.answer;
      const located = rec.locates[qi] != null ? Number(rec.locates[qi]) : null;
      if (located == null) {
        if (isCorrect) {
          out.unverifiedCorrect++;
          out.unverifiedItems.push({ r: r, q: q, qi: qi });
        } else {
          out.unverifiedWrong++;
        }
      } else if (located === Number(ev.para)) {
        if (isCorrect) out.trueMastery++;
        else out.locatedWrong++;
      } else if (isCorrect) {
        out.lucky++;
        out.luckyItems.push({ r: r, q: q, qi: qi });
      } else {
        out.lost++;
      }
    });
    return out;
  }

  function readingDoneCount() {
    return window.READINGS.filter(function (r) {
      return readingRec(r.id).submitted;
    }).length;
  }

  function readingDiagnosis() {
    const types = {};
    const wrong = [];
    const locateWrong = [];
    let submitted = 0;
    let answered = 0;
    let correct = 0;
    let elapsed = 0;
    let locateAsked = 0;
    let locateOk = 0;
    const quality = {
      trueMastery: 0,
      lucky: 0,
      locatedWrong: 0,
      lost: 0,
      unverifiedCorrect: 0,
      unverifiedWrong: 0
    };
    const lucky = [];
    const unverified = [];

    window.READINGS.forEach(function (r) {
      const rec = readingRec(r.id);
      if (!rec.submitted) return;
      submitted++;
      elapsed += rec.elapsed;
      r.questions.forEach(function (q, qi) {
        const picked = rec.answers[qi];
        if (picked != null) {
          answered++;
          const isCorrect = Number(picked) === q.answer;
          if (!types[q.type]) types[q.type] = { type: q.type, total: 0, correct: 0 };
          types[q.type].total++;
          if (isCorrect) {
            types[q.type].correct++;
            correct++;
          } else {
            wrong.push({ r: r, q: q, qi: qi });
          }
        }
        const ev = readingEvidence(r.id, qi);
        if (ev && ev.para && rec.locates[qi] != null) {
          locateAsked++;
          if (Number(rec.locates[qi]) === Number(ev.para)) locateOk++;
          else locateWrong.push({ r: r, q: q, qi: qi });
        }
      });
      const rq = readingQuality(r, rec);
      quality.trueMastery += rq.trueMastery;
      quality.lucky += rq.lucky;
      quality.locatedWrong += rq.locatedWrong;
      quality.lost += rq.lost;
      quality.unverifiedCorrect += rq.unverifiedCorrect;
      quality.unverifiedWrong += rq.unverifiedWrong;
      rq.luckyItems.forEach(function (item) { lucky.push(item); });
      rq.unverifiedItems.forEach(function (item) { unverified.push(item); });
    });

    const typeRows = Object.keys(types).map(function (key) {
      const row = types[key];
      return { type: key, total: row.total, correct: row.correct, rate: row.total ? row.correct / row.total : 0 };
    }).sort(function (a, b) { return a.rate - b.rate || b.total - a.total; });
    const weakestType = typeRows[0] || null;
    const typeWeak = weakestType && weakestType.rate < 0.8 ? weakestType : null;
    const locateRate = locateAsked ? Math.round(locateOk / locateAsked * 100) : null;
    const focus = lucky.length
      ? { kind: "lucky", count: lucky.length }
      : (typeWeak
        ? { kind: "type", type: typeWeak.type, rate: typeWeak.rate }
        : (unverified.length
          ? { kind: "unverified", count: unverified.length }
          : (locateRate != null && locateRate < 80 ? { kind: "locate", rate: locateRate } : null)));
    const target = focus
      ? (focus.kind === "lucky"
        ? lucky[0]
        : (focus.kind === "unverified"
          ? unverified[0]
          : (focus.kind === "type"
            ? (wrong.find(function (w) { return w.q.type === focus.type; }) || wrong[0] || null)
            : (locateWrong[0] || wrong[0] || null))))
      : null;

    return {
      submitted: submitted,
      answered: answered,
      correct: correct,
      accuracy: answered ? Math.round(correct / answered * 100) : null,
      avgTime: submitted ? Math.round(elapsed / submitted) : 0,
      locateAsked: locateAsked,
      locateOk: locateOk,
      locateRate: locateRate,
      types: typeRows,
      weakest: typeWeak,
      quality: quality,
      focus: focus,
      target: target
    };
  }

  function readingDiagnosisPanel() {
    const d = readingDiagnosis();
    if (!d.answered) {
      return `
        <section class="diagnosis" id="read-diagnosis">
          <div class="section-head"><h2>阅读诊断</h2><span class="section-note">按题型、用时与依据定位</span></div>
          <div class="diagnosis-empty">
            <p>完成一篇并提交后，这里会告诉你：哪类题最弱、时间花在哪里、依据找得准不准。</p>
            <a class="text-link" href="#/reading/1">先做 Reading 01 →</a>
          </div>
        </section>`;
    }
    const advice = window.READING_TYPE_ADVICE || {};
    const weakest = d.weakest;
    const focus = d.focus;
    const target = d.target;
    const focusLabel = focus
      ? ({ lucky: "优先校准", unverified: "优先验证", type: "优先补", locate: "优先校准" }[focus.kind] || "优先处理")
      : "当前状态";
    const focusTitle = focus
      ? (focus.kind === "type"
        ? `${esc(focus.type)} <span>${Math.round(focus.rate * 100)}%</span>`
        : (focus.kind === "lucky"
          ? `危险正确 <span>${focus.count} 题</span>`
          : (focus.kind === "unverified"
            ? `依据待验 <span>${focus.count} 题</span>`
            : `依据定位 <span>${focus.rate}%</span>`)))
      : "暂无短板";
    const focusCopy = focus
      ? (focus.kind === "type"
        ? (advice[focus.type] || "先定位题干关键词，再回原文找同义替换。")
        : (focus.kind === "lucky"
          ? "答案对了，但依据段标错。这类题在考场上最容易翻车，先回看具体题，把依据找对。"
          : (focus.kind === "unverified"
            ? "答案对了，但没有标依据。无法判断是真会还是蒙对，下一遍先标依据再选。"
            : `总正确率不错，但 ${d.locateAsked} 次依据标注只对了 ${d.locateOk} 次。先回原文标题眼句，再选答案。`)))
      : "题型正确率和依据定位都稳定。下一步把用时压到 18 分钟以内，再做整套限时。";
    const typeBars = d.types.map(function (t) {
      const pct = Math.round(t.rate * 100);
      const isWeak = weakest && t.type === weakest.type;
      return `
        <div class="diagnosis-type${isWeak ? " weak" : ""}">
          <span class="diagnosis-type-name">${esc(t.type)}</span>
          <span class="diagnosis-bar"><i style="width:${pct}%"></i></span>
          <span class="diagnosis-type-score">${t.correct} / ${t.total}</span>
        </div>`;
    }).join("");
    const quality = d.quality;
    const unverified = quality.unverifiedCorrect + quality.unverifiedWrong;
    return `
      <section class="diagnosis" id="read-diagnosis">
        <div class="section-head"><h2>阅读诊断</h2><span class="section-note">已提交 ${d.submitted} 篇 · 作答 ${d.answered} 题${d.answered < 5 ? " · 样本还少" : ""}</span></div>
        <div class="diagnosis-grid">
          <div class="diagnosis-focus">
            <p class="eyebrow">${focusLabel}</p>
            <h3>${focusTitle}</h3>
            <p>${esc(focusCopy)}</p>
            ${target ? `<a class="text-link" href="#/reading/${target.r.id}/${target.qi + 1}">回看 Reading ${String(target.r.id).padStart(2, "0")} · 第 ${target.qi + 1} 题 →</a>` : `<span class="diagnosis-done">保持限时训练，别让速度掉下来。</span>`}
          </div>
          <div class="diagnosis-figures">
            <div><span>总正确率</span><b>${d.accuracy}%</b><em>${d.correct} / ${d.answered} 题</em></div>
            <div><span>平均用时</span><b>${mmss(d.avgTime)}</b><em>${d.avgTime <= 18 * 60 ? "在 18 分钟内" : "超过 18 分钟"}</em></div>
            <div><span>依据定位</span><b>${d.locateRate == null ? "—" : d.locateRate + "%"}</b><em>${d.locateAsked ? d.locateOk + " / " + d.locateAsked + " 题" : "尚未标依据"}</em></div>
          </div>
        </div>
        <div class="quality-caption"><span>定位题作答质量</span><span>答案 × 依据</span></div>
        <div class="quality-strip">
          <div class="quality-cell good"><span>真会</span><b>${quality.trueMastery}</b><em>对且依据准</em></div>
          <div class="quality-cell warn"><span>危险正确</span><b>${quality.lucky}</b><em>对但依据偏</em></div>
          <div class="quality-cell"><span>定位对·选错</span><b>${quality.locatedWrong}</b><em>替换没认出</em></div>
          <div class="quality-cell bad"><span>定位也偏</span><b>${quality.lost}</b><em>先回原文</em></div>
        </div>
        ${unverified ? `<p class="quality-unverified">另有 ${unverified} 题未标依据：${quality.unverifiedCorrect} 题答对、${quality.unverifiedWrong} 题答错，暂不计入质量统计。</p>` : ""}
        <div class="diagnosis-types">${typeBars}</div>
      </section>`;
  }

  function homeNextStep() {
    const d = readingDiagnosis();
    if (!d.answered) {
      return `
        <section class="rail-block rail-next">
          <div class="rail-head"><h3>下一步</h3><span>阅读诊断</span></div>
          <p class="next-kicker">还没有阅读记录</p>
          <p class="next-title">先做一篇，建立诊断</p>
          <p class="next-copy">提交后这里会给出：优先补哪类题、回看哪道题、依据找得准不准。</p>
          <a class="text-link" href="#/reading">先做 Reading 01 →</a>
        </section>`;
    }
    const focus = d.focus;
    const target = d.target;
    let kicker = "当前稳定";
    let title = "保持限时训练";
    let copy = "题型正确率与依据定位都稳定。下一步限时做一篇，把速度压到 18 分钟。";
    if (focus && focus.kind === "lucky") {
      kicker = "优先校准";
      title = "危险正确 " + focus.count + " 题";
      copy = "答案对了，依据却标错。先回看具体题，把运气变成依据，别把隐患带进考场。";
    } else if (focus && focus.kind === "unverified") {
      kicker = "优先验证";
      title = "依据待验 " + focus.count + " 题";
      copy = "答案对了，但没有标依据。无法判断是真会还是蒙对，下一遍先标依据再选。";
    } else if (focus && focus.kind === "type") {
      kicker = "优先补";
      title = focus.type + " " + Math.round(focus.rate * 100) + "%";
      copy = (window.READING_TYPE_ADVICE && window.READING_TYPE_ADVICE[focus.type]) || "先定位题干关键词，再回原文找同义替换。";
    } else if (focus && focus.kind === "locate") {
      kicker = "优先校准";
      title = "依据定位 " + focus.rate + "%";
      copy = "答案正确率不错，但依据定位还不稳。回原文标题眼句，再选答案。";
    }
    const href = target ? "#/reading/" + target.r.id + "/" + (target.qi + 1) : "#/reading";
    const linkText = target
      ? "回看 Reading " + String(target.r.id).padStart(2, "0") + " · 第 " + (target.qi + 1) + " 题 →"
      : "再做一篇 →";
    return `
      <section class="rail-block rail-next">
        <div class="rail-head"><h3>下一步</h3><span>阅读诊断</span></div>
        <p class="next-kicker">${kicker}</p>
        <p class="next-title">${esc(title)}</p>
        <p class="next-copy">${esc(copy)}</p>
        <a class="text-link" href="${href}">${linkText}</a>
      </section>`;
  }

  function pageReadingList() {
    const done = readingDoneCount();
    const scores = window.READINGS.map(function (r) { return readingRec(r.id); }).filter(function (r) { return r.submitted; });
    const avg = scores.length ? (scores.reduce(function (s, r) { return s + r.score; }, 0) / scores.length).toFixed(1) : "—";

    const rows = window.READINGS.map(function (r) {
      const rec = readingRec(r.id);
      return `
        <a class="reading-item" href="#/reading/${r.id}">
          <span class="reading-no">NO. ${String(r.id).padStart(2, "0")}</span>
          <span>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.topic)} · ${esc(r.difficulty)} · 约 ${wordCount(r.paragraphs.join(" "))} 词</p>
          </span>
          <span class="reading-meta">建议 ${r.minutes} 分钟<br>${esc(r.source)} · 5 题</span>
          <span class="reading-state ${rec.submitted ? "done" : ""}">${rec.submitted ? rec.score + " / 5" : "未做"}</span>
        </a>`;
    }).join("");

    return `
      ${pageHead("04", "阅读", "阅读", "先读题干，再带着问题读文章。每篇限时，做完必须回到原文找依据。")}
      <div class="stat-strip">
        <div class="stat"><p class="k">篇目</p><p class="v">${window.READINGS.length}<small>篇</small></p><p class="s">原创仿真材料</p></div>
        <div class="stat"><p class="k">已完成</p><p class="v">${done}<small>篇</small></p><p class="s">做完并提交</p></div>
        <div class="stat"><p class="k">平均分</p><p class="v">${avg}<small>/ 5</small></p><p class="s">按已提交篇目</p></div>
        <div class="stat"><p class="k">建议用时</p><p class="v">18<small>分钟</small></p><p class="s">单篇上限</p></div>
      </div>

      <p class="method-line"><b>本页练法</b> 先标依据段，再选答案；定位题未标依据时不能作答。提交后对照题眼句与同义替换，答案对但依据偏会被标成“危险正确”。</p>

      <a class="drill-banner" href="#/reading/traps">
        <span class="drill-kicker">专项训练 · ${(window.TRAP_DRILLS || []).length} 道</span>
        <strong>干扰项归因</strong>
        <span class="drill-copy">只给一个错误选项和题眼句，先判断它错在哪：无中生有、偷换概念、反向/绝对化，还是过度推断。</span>
        <span class="drill-arrow">进入训练 →</span>
      </a>

      ${readingDiagnosisPanel()}

      <div class="reading-list">${rows}</div>

      <section class="section">
        <div class="section-head"><h2>做题顺序</h2><span class="section-note">不要一上来就读全文</span></div>
        <div class="method-grid">
          <div class="method"><h3>先看题干</h3><p>圈出人名、年份、专有名词和题干核心词。不要先看选项，避免被干扰项带着走。</p></div>
          <div class="method"><h3>再读文章</h3><p>每段用一句话概括功能：提出观点、举例、转折还是结论。重点读首尾句与转折处。</p></div>
          <div class="method"><h3>回文定位</h3><p>先在题下标出依据段，再选答案。正确项多为同义替换，错误项常见偷换主体、因果倒置、范围扩大。</p></div>
          <div class="method"><h3>控制时间</h3><p>单篇 18 分钟。一道题超过 3 分钟先标记，做完再回来，别让一道题拖垮整篇。</p></div>
        </div>
      </section>

      <div class="note-strip info" style="margin-top:26px">${window.READINGS.length} 篇文章参照考研英语阅读 Part A 的题型与难度编写，为原创仿真练习，不是历年真题原文。</div>`;
  }

  function trapTypeStats() {
    const order = ["无中生有", "偷换概念", "反向/绝对化", "过度推断"];
    const rows = order.map(function (type) {
      return { type: type, total: 0, right: 0 };
    });
    (ui.trapAnswers || []).forEach(function (item) {
      const row = rows.find(function (x) { return x.type === item.type; });
      if (!row) return;
      row.total++;
      if (item.right) row.right++;
    });
    return rows;
  }

  function trapLifetimeStats() {
    const order = ["无中生有", "偷换概念", "反向/绝对化", "过度推断"];
    return order.map(function (type) {
      const row = state.trapStats && state.trapStats[type];
      return {
        type: type,
        total: row ? Math.max(0, Number(row.total) || 0) : 0,
        right: row ? Math.max(0, Number(row.right) || 0) : 0
      };
    });
  }

  function trapLifetimeLine() {
    const rows = trapLifetimeStats();
    const total = rows.reduce(function (n, x) { return n + x.total; }, 0);
    if (!total) return "";
    const right = rows.reduce(function (n, x) { return n + x.right; }, 0);
    const weak = rows.filter(function (x) { return x.total && x.right < x.total; })
      .sort(function (a, b) { return a.right / a.total - b.right / b.total; })[0];
    const pct = Math.round(right / total * 100);
    return `历史累计 ${right} / ${total}（${pct}%）${weak ? " · 最弱：" + weak.type : " · 四类都稳定"}`;
  }

  function pageTrapDrill() {
    const drills = window.TRAP_DRILLS || [];
    if (!drills.length) {
      return `${pageHead("04", "阅读", "干扰项归因", "专项训练")}
        <p class="note-strip">训练数据尚未加载。</p>`;
    }
    if (ui.trapIndex >= drills.length) {
      const stats = trapTypeStats();
      const weak = stats.filter(function (x) { return x.total && x.right < x.total; })
        .sort(function (a, b) { return a.right / a.total - b.right / b.total; })[0];
      const breakdown = stats.map(function (x) {
        const pct = x.total ? Math.round(x.right / x.total * 100) : 0;
        return `<div class="trap-breakdown-row${weak && weak.type === x.type ? " weak" : ""}">
          <span class="trap-breakdown-name">${esc(x.type)}</span>
          <span class="trap-bar"><i style="width:${pct}%"></i></span>
          <span class="trap-breakdown-score">${x.right} / ${x.total}</span>
        </div>`;
      }).join("");
      return `
        ${pageHead("04", "阅读", "干扰项归因", "正确项有依据，错误项也有破绽。先判断错因，再记答案。")}
        <section class="trap-summary">
          <p class="trap-summary-kicker">本轮完成</p>
          <p class="trap-summary-score">${ui.trapScore}<small> / ${drills.length}</small></p>
          ${trapLifetimeLine() ? `<p class="trap-lifetime">${trapLifetimeLine()}</p>` : ""}
          <div class="trap-breakdown">${breakdown}</div>
          <p class="trap-summary-copy">${weak
            ? `错得最多的是「${esc(weak.type)}」：${weak.total} 题中判断错 ${weak.total - weak.right} 题。回到对应阅读题，把题眼句和错误选项逐词对照。`
            : "四类干扰项都判断正确。下一步回到阅读题，练习在选项之间做排除。"}</p>
          <div class="q-actions">
            <button class="btn btn-solid" data-action="trap-restart">再练一组</button>
            <a class="btn btn-sm btn-quiet" href="#/reading">回到阅读</a>
          </div>
        </section>`;
    }

    const item = drills[ui.trapIndex];
    const r = (window.READINGS || []).find(function (x) { return x.id === Number(item.rid); });
    const q = r && r.questions[item.qi];
    const ev = r && readingEvidence(r.id, item.qi);
    if (!r || !q || !ev || q.answer === item.oi) {
      return `${pageHead("04", "阅读", "干扰项归因", "专项训练")}
        <p class="note-strip">这道训练题的数据不完整。</p>`;
    }
    const types = ["无中生有", "偷换概念", "反向/绝对化", "过度推断"];
    const checked = ui.trapChecked;
    const picked = ui.trapPicked;
    const isRight = picked === item.type;
    const buttons = types.map(function (type) {
      let cls = "trap-type";
      if (checked) {
        if (type === item.type) cls += " correct";
        else if (type === picked) cls += " wrong";
        else cls += " dim";
      }
      return `<button class="${cls}" data-action="trap-pick" data-type="${esc(type)}" ${checked ? "disabled" : ""}>${esc(type)}</button>`;
    }).join("");
    const feedback = checked ? `
      <div class="trap-feedback ${isRight ? "good" : "bad"}">
        <p class="trap-verdict">${isRight ? "判断正确" : "再想一步"}　<span>正确归因：${esc(item.type)}</span></p>
        <p class="trap-why">${esc(item.why)}</p>
        <p class="trap-answer"><b>正确项 ${letter(q.answer)}.</b> ${esc(q.options[q.answer])}</p>
        <p class="trap-paraphrase"><b>同义替换</b> ${esc(ev.paraphrase)}</p>
        <div class="q-actions">
          <button class="btn btn-solid" data-action="trap-next">${ui.trapIndex + 1 >= drills.length ? "看本轮结果" : "下一题"}</button>
        </div>
      </div>` : "";

    return `
      ${pageHead("04", "阅读", "干扰项归因", "正确项有依据，错误项也有破绽。先判断错因，再记答案。")}
      <div class="trap-top">
        <span class="trap-progress">第 ${ui.trapIndex + 1} / ${drills.length} 题</span>
        <span class="trap-score">本轮答对 ${ui.trapScore}</span>
      </div>
      <article class="trap-card">
        <div class="trap-meta">
          <span>Reading ${String(r.id).padStart(2, "0")} · 第 ${item.qi + 1} 题</span>
          <span>${esc(q.type)}</span>
        </div>
        <p class="trap-stem">${esc(q.stem)}</p>
        <div class="trap-wrong"><span class="tag">错误选项 ${letter(item.oi)}</span><p>${esc(q.options[item.oi])}</p></div>
        <blockquote class="trap-quote">${esc(ev.evidence)}</blockquote>
        ${readingEvidenceCn(r.id, item.qi) ? `<p class="trap-cn">${esc(readingEvidenceCn(r.id, item.qi))}</p>` : ""}
        <p class="trap-ask">这个选项的问题是什么？</p>
        <div class="trap-types">${buttons}</div>
        ${feedback}
      </article>
      <div class="trap-foot">
        <a class="text-link muted" href="#/reading">← 回到阅读</a>
        <span>先看选项与题眼句的差距，不要凭印象。</span>
      </div>`;
  }

  function readElapsed(rec) {
    if (rec.submitted) return Number(rec.elapsed) || 0;
    if (ui.readId && ui.readStart) return Math.max(0, Math.floor((Date.now() - ui.readStart) / 1000));
    return 0;
  }

  function readingQuestion(r, q, qi, rec) {
    const picked = rec.answers[qi];
    const ev = readingEvidence(r.id, qi);
    const targetPara = ev && ev.para ? Number(ev.para) : null;
    const located = rec.locates[qi] != null ? Number(rec.locates[qi]) : null;
    const pickedCorrect = picked != null && Number(picked) === q.answer;
    const locateButtons = targetPara ? Array.from({ length: r.paragraphs.length }, function (_, i) {
      const n = i + 1;
      let cls = "locate-dot";
      if (located === n) cls += " on";
      if (rec.submitted && n === targetPara) cls += " right";
      if (rec.submitted && located === n && n !== targetPara) cls += " wrong";
      return `<button class="${cls}" data-action="pick-locate" data-id="${r.id}" data-qi="${qi}" data-para="${n}" ${rec.submitted ? "disabled" : ""} aria-label="依据在第 ${n} 段">${n}</button>`;
    }).join("") : "";
    const locateHint = rec.submitted
      ? (located == null ? "未标依据" : (located === targetPara ? "定位正确" : "应在第 " + targetPara + " 段"))
      : (located == null ? "先标依据，才能选答案" : "已标第 " + located + " 段");
    let qualityTag = "";
    if (rec.submitted && targetPara && picked != null) {
      if (located == null) {
        qualityTag = `<span class="quality-tag ${pickedCorrect ? "pending" : "bad"}">${pickedCorrect ? "对但未验" : "错且未标"}</span>`;
      } else if (located === targetPara) {
        qualityTag = `<span class="quality-tag ${pickedCorrect ? "good" : "mid"}">${pickedCorrect ? "真会" : "定位对·选错"}</span>`;
      } else {
        qualityTag = `<span class="quality-tag ${pickedCorrect ? "warn" : "bad"}">${pickedCorrect ? "危险正确" : "定位也偏"}</span>`;
      }
    }
    const options = q.options.map(function (opt, oi) {
      let cls = "option";
      if (rec.submitted) {
        if (oi === q.answer) cls += " correct";
        else if (oi === picked) cls += " wrong";
        else cls += " dim";
      } else if (oi === picked) {
        cls += " sel";
      }
      return `<button class="${cls}" data-action="pick-reading" data-id="${r.id}" data-qi="${qi}" data-oi="${oi}" ${rec.submitted ? "disabled" : ""}><i>${letter(oi)}</i><span>${esc(opt)}</span></button>`;
    }).join("");
    const evCn = readingEvidenceCn(r.id, qi);
    const evidence = rec.submitted && ev ? `
      <div class="evidence-chain">
        <div class="evidence-head"><span>题眼句</span>${targetPara ? `<button class="text-link" data-action="jump-para" data-para="${targetPara}">回文定位</button>` : ""}</div>
        <blockquote>${esc(ev.evidence)}</blockquote>
        ${evCn ? `<p class="evidence-cn"><b>句意</b> ${esc(evCn)}</p>` : ""}
        <p class="paraphrase"><b>同义替换</b> ${esc(ev.paraphrase)}</p>
      </div>` : "";
    return `
      <article class="question" id="read-q-${qi + 1}">
        <div class="q-head"><span class="q-no">${qi + 1}</span><span class="q-type">${esc(q.type)}</span></div>
        <p class="q-stem">${esc(q.stem)}</p>
        ${targetPara ? `<div class="locate-row"><span class="locate-label">依据段</span>${locateButtons}<span class="locate-hint">${locateHint}</span>${qualityTag}</div>` : ""}
        <div class="options">${options}</div>
        ${rec.submitted ? `<div class="q-explain"><span class="loc">${esc(q.loc)}</span>${esc(q.explain)}</div>` : ""}
        ${evidence}
      </article>`;
  }

  function pageReadingDetail(id) {
    const r = window.READINGS.find(function (x) { return x.id === id; });
    if (!r) {
      return `${pageHead("04", "阅读", "没有这一篇", "链接可能有误，回到阅读列表重新选择。")}
        <div class="empty"><p class="mark">无</p><p>没有找到编号为 ${esc(id)} 的阅读。</p><div class="actions"><a class="btn btn-quiet" href="#/reading">返回列表</a></div></div>`;
    }
    const rec = readingRec(id);
    const selected = Object.keys(rec.answers).filter(function (k) { return rec.answers[k] != null; }).length;
    const loc = readingLocateScore(r, rec);
    const rq = readingQuality(r, rec);
    const wrongCount = r.questions.filter(function (q, qi) {
      return rec.answers[qi] != null && Number(rec.answers[qi]) !== q.answer;
    }).length;
    const locMissing = r.questions.filter(function (q, qi) {
      const ev = readingEvidence(id, qi);
      return ev && ev.para && rec.locates[qi] == null;
    }).length;
    const paragraphs = r.paragraphs.map(function (p, i) {
      return `<p data-para="${i + 1}"><span class="para">${i + 1}</span>${esc(p)}</p>`;
    }).join("");
    const glossary = r.glossary.map(function (g) {
      return `<li><span>${esc(g[0])}</span><span>${esc(g[1])}</span></li>`;
    }).join("");
    const questions = r.questions.map(function (q, qi) { return readingQuestion(r, q, qi, rec); }).join("");

    return `
      <a class="back" href="#/reading">← 阅读列表</a>
      <header class="article-head">
        <p class="eyebrow">Reading ${String(r.id).padStart(2, "0")} / 阅读</p>
        <h1 class="article-title">${esc(r.title)}</h1>
        <div class="article-meta">
          <span>${esc(r.topic)}</span><span>${esc(r.difficulty)}</span>
          <span>约 ${wordCount(r.paragraphs.join(" "))} 词</span><span>建议 ${r.minutes} 分钟</span>
        </div>
      </header>

      <div class="reading-layout">
        <div class="passage">${paragraphs}</div>
        <aside class="passage-side">
          <div>
            <p class="side-timer-label">阅读用时</p>
            <p class="side-timer" id="readClock">${mmss(readElapsed(rec))}</p>
            <p class="side-timer-note">${rec.submitted ? "已提交，计时停止" : "进入本页后开始计时"}</p>
          </div>
          <div class="glossary"><h3>文中词</h3><ul>${glossary}</ul></div>
          <div class="glossary"><h3>做题提示</h3><p class="score-note">先在原文标出每道题的依据，再选答案。没有依据的选项，多半是干扰项。</p></div>
        </aside>
      </div>

      <section class="questions">
        <div class="questions-head"><h2>题目</h2><span class="section-note">${rec.submitted ? rec.score + " / 5 正确" : "已选 " + selected + " / 5"}</span></div>
        ${questions}
        ${rec.submitted ? `
          <div class="score-banner">
            <div><p class="label">本篇得分</p><p class="score">${rec.score}<small> / 5</small></p></div>
            <div class="score-copy">
              <p class="copy">用时 ${mmss(rec.elapsed)} · ${loc.asked ? "依据定位 " + loc.correct + " / " + loc.asked : "依据未标"} · ${wrongCount ? "错题已收入错题本" : "本篇无错题"}</p>
              ${rq.lucky ? `<p class="score-warning">${rq.lucky} 题答案正确，但依据段标错。先看诊断，把运气变成依据。</p>` : (rq.unverifiedCorrect ? `<p class="score-warning">${rq.unverifiedCorrect} 题答案正确，但未标依据。补标后再看诊断，才能判断是否真会。</p>` : "")}
            </div>
            <div class="actions"><button class="btn btn-sm btn-quiet" data-action="reset-reading" data-id="${r.id}">重做本篇</button><a class="btn btn-sm btn-quiet" href="#/reading" data-action="view-diagnosis">看诊断</a><a class="btn btn-sm btn-quiet" href="#/me/mistakes">看错题</a></div>
          </div>` : `
          <div class="q-actions">
            <span class="score-note">${selected < 5 ? "还有 " + (5 - selected) + " 题未选。" : (locMissing ? "已全部作答；还有 " + locMissing + " 题未标依据，可直接提交，诊断会记为未标。" : "已全部作答，可以提交。")}</span>
            <button class="btn btn-solid" data-action="submit-reading" data-id="${r.id}">提交答案</button>
          </div>`}
      </section>

      ${r.id < window.READINGS.length ? `<p style="text-align:right;margin-top:20px"><a class="text-link" href="#/reading/${r.id + 1}">下一篇：${esc(window.READINGS[r.id].title)} →</a></p>` : ""}`;
  }

  /* ------------------------------------------------------------------
     cloze / seven
  ------------------------------------------------------------------ */

  function exerciseSetPicker(kind, sets, index) {
    return `
      <div class="set-picker">
        <span class="set-label">篇目</span>
        <div class="chips">
          ${sets.map(function (item, i) {
            return `<button class="chip ${i === index ? "on" : ""}" data-action="${kind}-set" data-i="${i}" title="${esc(item.title)}">${String(i + 1).padStart(2, "0")}</button>`;
          }).join("")}
        </div>
        <span class="set-title">${esc(sets[index].title)}</span>
      </div>`;
  }

  function pageCloze() {
    const tab = ["cloze", "seven", "order", "heading"].indexOf(ui.clozeTab) !== -1 ? ui.clozeTab : "cloze";
    const meta = {
      cloze: ["完形填空", "完形考的不是单词量，而是上下文关系。先通读定调，再逐空找搭配与逻辑。"],
      seven: ["新题型 · 七选五", "七选五考篇章衔接。先看选项里的代词和连接词，再回到空白前后找线索。"],
      order: ["新题型 · 排序题", "排序题考篇章骨架。先读首尾定方向，再抓序数、代词与递进词。"],
      heading: ["新题型 · 小标题", "小标题考段落主旨。标题是概括，不是细节复述。"]
    }[tab];
    const sets = tab === "cloze" ? clozeSets() : tab === "seven" ? sevenSets() : tab === "order" ? orderSets() : headingSets();
    const active = tab === "cloze" ? activeCloze() : tab === "seven" ? activeSeven() : tab === "order" ? activeOrder() : activeHeading();
    const body = tab === "cloze" ? clozeBody(active) : tab === "seven" ? sevenBody(active) : tab === "order" ? orderBody(active) : headingBody(active);
    return `
      ${pageHead("05", "完形 · 新题型", meta[0], meta[1])}
      <div class="subnav">
        <button class="${tab === "cloze" ? "on" : ""}" data-action="cloze-tab" data-tab="cloze">完形填空</button>
        <button class="${tab === "seven" ? "on" : ""}" data-action="cloze-tab" data-tab="seven">七选五</button>
        <button class="${tab === "order" ? "on" : ""}" data-action="cloze-tab" data-tab="order">排序题</button>
        <button class="${tab === "heading" ? "on" : ""}" data-action="cloze-tab" data-tab="heading">小标题</button>
      </div>
      ${sets.length ? exerciseSetPicker(tab, sets, active.index) + body : `<div class="empty"><p class="mark">空</p><p>这一类题目还在整理中。</p></div>`}`;
  }

  function clozeBlank(n, active) {
    const st = active.st;
    const i = n - 1;
    const item = active.set.items[i];
    const picked = st.answers[i];
    const correct = item ? item.answer : 0;
    let cls = "blank";
    if (picked != null) cls += " filled";
    if (st.submitted) cls += picked === correct ? " ok" : " no";
    return `<span class="${cls}" title="${st.submitted ? "正确答案 " + letter(correct) : "第 " + n + " 空"}">${picked != null ? letter(picked) : n}</span>`;
  }

  function clozeParagraph(text, active) {
    return String(text).split(/(\{\{\d+\}\})/g).map(function (part) {
      const m = part.match(/^\{\{(\d+)\}\}$/);
      if (m) return clozeBlank(Number(m[1]), active);
      return esc(part);
    }).join("");
  }

  function clozeBody(active) {
    const set = active.set;
    const st = active.st;
    const total = set.items.length;
    const answered = Object.keys(st.answers).filter(function (k) { return st.answers[k] != null; }).length;
    const passage = set.paragraphs.map(function (p) { return `<p>${clozeParagraph(p, active)}</p>`; }).join("");
    const items = set.items.map(function (item, i) {
      const picked = st.answers[i];
      const options = item.options.map(function (opt, oi) {
        let cls = "opt-pill";
        if (st.submitted) {
          if (oi === item.answer) cls += " correct";
          else if (oi === picked) cls += " wrong";
          else cls += " dim";
        } else if (oi === picked) {
          cls += " sel";
        }
        return `<button class="${cls}" data-action="pick-cloze" data-i="${i}" data-oi="${oi}" ${st.submitted ? "disabled" : ""}><i>${letter(oi)}</i>${esc(opt)}</button>`;
      }).join("");
      return `
        <div class="blank-item ${st.submitted ? "revealed" : ""}">
          <div class="blank-line"><span class="blank-no">${i + 1}</span><div class="blank-options">${options}</div></div>
          <p class="blank-explain">${st.submitted ? `<b>答案 ${letter(item.answer)}.</b> ${esc(item.explain)}` : ""}</p>
        </div>`;
    }).join("");

    return `
      <p class="cloze-intro">${esc(set.intro)}</p>
      <div class="cloze-toolbar">
        <span class="count-line">已选 ${answered} / ${total}</span>
        <span class="score-note">${st.submitted ? "已提交，解析已展开" : "先通读全文，再逐空作答"}</span>
      </div>
      <div class="cloze-passage">${passage}</div>
      <div class="blank-items">${items}</div>
      ${st.submitted ? `
        <div class="score-banner">
          <div><p class="label">完形得分</p><p class="score">${st.score}<small> / ${total}</small></p></div>
          <p class="copy">错题已收入错题本 · 每题 0.5 分，折算 ${(st.score * 0.5).toFixed(1)} 分</p>
          <div class="actions"><button class="btn btn-sm btn-quiet" data-action="reset-cloze">重做本篇</button><a class="btn btn-sm btn-quiet" href="#/me/mistakes">看错题</a></div>
        </div>` : `
        <div class="q-actions">
          <span class="score-note">${answered < total ? "还有 " + (total - answered) + " 空未选。" : "已全部作答，可以提交。"}</span>
          <button class="btn btn-solid" data-action="submit-cloze">提交答案</button>
        </div>`}
      ${tipsAccordion("五条做完形的方法", set.tips)}`;
  }

  function sevenParagraph(text, active) {
    const st = active.st;
    return String(text).split(/(\{\{\d+\}\})/g).map(function (part) {
      const m = part.match(/^\{\{(\d+)\}\}$/);
      if (!m) return esc(part);
      const i = Number(m[1]) - 1;
      const picked = st.answers[i];
      const correct = active.set.answers[i];
      let cls = "blank seven-blank";
      if (picked != null) cls += " filled";
      if (st.submitted) cls += picked === correct ? " ok" : " no";
      return `<span class="${cls}" title="${st.submitted ? "正确答案 " + letter(correct) : "第 " + (i + 1) + " 空"}">${picked != null ? letter(picked) : i + 1}</span>`;
    }).join("");
  }

  function sevenBody(active) {
    const set = active.set;
    const st = active.st;
    const answers = st.answers;
    const chosenCount = answers.filter(function (x) { return x != null; }).length;
    const paragraphs = set.paragraphs.map(function (p) { return `<p>${sevenParagraph(p, active)}</p>`; }).join("");
    const options = set.options.map(function (opt, i) {
      return `<div class="seven-option ${st.submitted && i === set.extra ? "extra" : ""}"><i>${letter(i)}</i><span class="en">${esc(opt)}</span>${st.submitted && i === set.extra ? `<span class="tag">多余</span>` : ""}</div>`;
    }).join("");
    const slots = answers.map(function (picked, i) {
      const correct = set.answers[i];
      const buttons = set.options.map(function (_, oi) {
        let cls = "";
        if (st.submitted) {
          if (oi === correct) cls = "correct";
          else if (oi === picked) cls = "wrong";
        } else if (oi === picked) {
          cls = "sel";
        } else if (answers.indexOf(oi) !== -1) {
          cls = "used";
        }
        return `<button class="${cls}" data-action="pick-seven" data-i="${i}" data-oi="${oi}" ${st.submitted ? "disabled" : ""} aria-label="第 ${i + 1} 空选 ${letter(oi)}">${letter(oi)}</button>`;
      }).join("");
      return `<div class="seven-slot"><label>第 ${i + 1} 空</label><div class="slot-options">${buttons}</div></div>`;
    }).join("");
    const explanations = set.explain.map(function (text, i) {
      return `<div class="explain-item"><i>${i + 1}</i><div><b>${letter(set.answers[i])}</b>　${esc(text)}</div></div>`;
    }).join("");

    return `
      <p class="cloze-intro">${esc(set.intro)}</p>
      <div class="cloze-toolbar">
        <span class="count-line">已选 ${chosenCount} / 5</span>
        <span class="score-note">同一选项只能使用一次</span>
      </div>
      <div class="cloze-passage seven-passage">${paragraphs}</div>

      <div class="seven-options">
        <p class="label" style="margin-bottom:8px">选项 A—F</p>
        ${options}
      </div>

      <div class="seven-selects">${slots}</div>

      ${st.submitted ? `
        <div class="score-banner">
          <div><p class="label">七选五得分</p><p class="score">${st.score}<small> / 5</small></p></div>
          <p class="copy">多余项为 ${letter(set.extra)} · 错题已收入错题本</p>
          <div class="actions"><button class="btn btn-sm btn-quiet" data-action="reset-seven">重做本篇</button><a class="btn btn-sm btn-quiet" href="#/me/mistakes">看错题</a></div>
        </div>
        <div class="explain-list">${explanations}</div>` : `
        <div class="q-actions">
          <span class="score-note">${chosenCount < 5 ? "还有 " + (5 - chosenCount) + " 空未选。" : "已全部作答，可以提交。"}</span>
          <button class="btn btn-solid" data-action="submit-seven">提交答案</button>
        </div>`}
      ${tipsAccordion("五条做七选五的方法", set.tips)}`;
  }

  function orderBody(active) {
    const set = active.set;
    const st = active.st;
    const answers = st.answers;
    const chosen = answers.filter(function (x) { return x != null; }).length;
    const letters = ["B", "C", "D", "E", "F"];
    const paragraphs = set.paragraphs.map(function (p) {
      const fixed = p.label === set.first ? "已定首段" : p.label === set.last ? "已定末段" : "";
      return `<p><b class="order-tag">${p.label}</b>${esc(p.text)}${fixed ? ` <span class="tag">${fixed}</span>` : ""}</p>`;
    }).join("");
    const slots = answers.map(function (picked, i) {
      const correct = set.answers[i];
      const buttons = letters.map(function (lab) {
        let cls = "";
        if (st.submitted) {
          if (lab === correct) cls = "correct";
          else if (lab === picked) cls = "wrong";
        } else if (lab === picked) {
          cls = "sel";
        } else if (answers.indexOf(lab) !== -1) {
          cls = "used";
        }
        return `<button class="${cls}" data-action="pick-order" data-i="${i}" data-oi="${lab}" ${st.submitted ? "disabled" : ""} aria-label="第 ${i + 2} 段选 ${lab}">${lab}</button>`;
      }).join("");
      return `<div class="seven-slot"><label>第 ${i + 2} 段</label><div class="slot-options">${buttons}</div></div>`;
    }).join("");
    const explanations = set.explain.map(function (text, i) {
      return `<div class="explain-item"><i>${i + 2}</i><div><b>${set.answers[i]}</b>　${esc(text)}</div></div>`;
    }).join("");

    return `
      <p class="cloze-intro">${esc(set.intro)}</p>
      <div class="cloze-toolbar">
        <span class="count-line">已排 ${chosen} / 5</span>
        <span class="score-note">A 为首段、G 为末段，其余五段各用一次</span>
      </div>
      <div class="cloze-passage order-passage">${paragraphs}</div>
      <div class="seven-selects">${slots}</div>
      ${st.submitted ? `
        <div class="score-banner">
          <div><p class="label">排序题得分</p><p class="score">${st.score}<small> / 5</small></p></div>
          <p class="copy">正确顺序：A → ${set.answers.join(" → ")} → G · 错题已收入错题本</p>
          <div class="actions"><button class="btn btn-sm btn-quiet" data-action="reset-order">重做本篇</button><a class="btn btn-sm btn-quiet" href="#/me/mistakes">看错题</a></div>
        </div>
        <div class="explain-list">${explanations}</div>` : `
        <div class="q-actions">
          <span class="score-note">${chosen < 5 ? "还有 " + (5 - chosen) + " 段未排。" : "已全部排好，可以提交。"}</span>
          <button class="btn btn-solid" data-action="submit-order">提交答案</button>
        </div>`}
      ${tipsAccordion("五条做排序题的方法", set.tips)}`;
  }

  function headingBody(active) {
    const set = active.set;
    const st = active.st;
    const answers = st.answers;
    const chosen = answers.filter(function (x) { return x != null; }).length;
    const options = set.options.map(function (opt, i) {
      return `<div class="seven-option ${st.submitted && i === set.extra ? "extra" : ""}"><i>${letter(i)}</i><span class="en">${esc(opt)}</span>${st.submitted && i === set.extra ? `<span class="tag">多余</span>` : ""}</div>`;
    }).join("");
    const sections = set.sections.map(function (text, i) {
      const picked = answers[i];
      const correct = set.answers[i];
      const buttons = set.options.map(function (_, oi) {
        let cls = "";
        if (st.submitted) {
          if (oi === correct) cls = "correct";
          else if (oi === picked) cls = "wrong";
        } else if (oi === picked) {
          cls = "sel";
        } else if (answers.indexOf(oi) !== -1) {
          cls = "used";
        }
        return `<button class="${cls}" data-action="pick-heading" data-i="${i}" data-oi="${oi}" ${st.submitted ? "disabled" : ""} aria-label="第 ${i + 1} 段选 ${letter(oi)}">${letter(oi)}</button>`;
      }).join("");
      return `<div class="heading-item">
        <div class="seven-slot"><label>第 ${i + 1} 段标题</label><div class="slot-options">${buttons}</div></div>
        <p class="heading-text">${esc(text)}</p>
      </div>`;
    }).join("");
    const explanations = set.explain.map(function (text, i) {
      return `<div class="explain-item"><i>${i + 1}</i><div><b>${letter(set.answers[i])}</b>　${esc(text)}</div></div>`;
    }).join("");

    return `
      <p class="cloze-intro">${esc(set.intro)}</p>
      <div class="cloze-toolbar">
        <span class="count-line">已选 ${chosen} / 5</span>
        <span class="score-note">同一标题只能使用一次</span>
      </div>
      <div class="seven-options">
        <p class="label" style="margin-bottom:8px">标题 A—F</p>
        ${options}
      </div>
      <div class="heading-list">${sections}</div>
      ${st.submitted ? `
        <div class="score-banner">
          <div><p class="label">小标题得分</p><p class="score">${st.score}<small> / 5</small></p></div>
          <p class="copy">多余项为 ${letter(set.extra)} · 错题已收入错题本</p>
          <div class="actions"><button class="btn btn-sm btn-quiet" data-action="reset-heading">重做本篇</button><a class="btn btn-sm btn-quiet" href="#/me/mistakes">看错题</a></div>
        </div>
        <div class="explain-list">${explanations}</div>` : `
        <div class="q-actions">
          <span class="score-note">${chosen < 5 ? "还有 " + (5 - chosen) + " 段未选。" : "已全部作答，可以提交。"}</span>
          <button class="btn btn-solid" data-action="submit-heading">提交答案</button>
        </div>`}
      ${tipsAccordion("五条做小标题的方法", set.tips)}`;
  }

  function tipsAccordion(title, tips) {
    const items = tips.map(function (t) {
      return `<li><b>${esc(t[0])}</b><span class="cn">${esc(t[1])}</span></li>`;
    }).join("");
    return `
      <details class="acc tips-acc">
        <summary><span class="acc-no">TIP</span><span class="acc-title">${esc(title)}</span><span class="acc-sub">做完再看</span><span class="acc-plus"></span></summary>
        <div class="acc-body"><ul class="tips-list">${items}</ul></div>
      </details>`;
  }

  /* ------------------------------------------------------------------
     translation
  ------------------------------------------------------------------ */

  function transEntryByKey(key) {
    if (key === "p") return window.TRANSLATIONS.passage;
    const id = Number(String(key).replace(/^s/, ""));
    return window.TRANSLATIONS.sentences.find(function (s) { return s.id === id; });
  }

  function transValue(key) {
    return typeof state.translations[key] === "string" ? state.translations[key] : "";
  }

  function countChars(text) {
    return String(text || "").replace(/\s/g, "").length;
  }

  function pageTranslation() {
    const isSentence = ui.transTab === "sentence";
    const methods = window.TRANSLATIONS.methods.map(function (m) {
      return `<div class="method"><h3>${esc(m[0])}</h3><p>${esc(m[1])}</p></div>`;
    }).join("");
    const pitfalls = window.TRANSLATIONS.pitfalls.map(function (p) { return `<li>${esc(p)}</li>`; }).join("");

    return `
      ${pageHead("06", "翻译", "翻译", "先读懂，再说人话。逐词硬译最省事，也最容易丢分。")}
      <section class="section trans-methods">
        <div class="section-head"><h2>五步翻译法</h2><span class="section-note">理解 → 断句 → 成句 → 润色 → 核对</span></div>
        <div class="method-grid">${methods}</div>
      </section>

      <details class="acc" style="margin-top:26px">
        <summary><span class="acc-no">!</span><span class="acc-title">六个常见失分点</span><span class="acc-sub">翻译前先看一遍</span><span class="acc-plus"></span></summary>
        <div class="acc-body"><ul class="pitfall-list">${pitfalls}</ul></div>
      </details>

      <div class="subnav" style="margin-top:34px">
        <button class="${isSentence ? "on" : ""}" data-action="trans-tab" data-tab="sentence">句子翻译</button>
        <button class="${!isSentence ? "on" : ""}" data-action="trans-tab" data-tab="passage">英语二 · 段落翻译</button>
      </div>

      ${isSentence ? translationSentences() : translationPassage()}`;
  }

  function translationSentences() {
    return `<div class="trans-list">${window.TRANSLATIONS.sentences.map(function (s) {
      const key = "s" + s.id;
      const open = ui.transOpen[key] === true;
      const value = transValue(key);
      const entry = transEntryByKey(key);
      return `
        <article class="trans-item">
          <div class="trans-head">
            <span class="label">句子 ${String(s.id).padStart(2, "0")}</span>
            <div class="chips">${s.tags.map(function (t) { return `<span class="tag">${esc(t)}</span>`; }).join("")}</div>
          </div>
          <p class="trans-en">${esc(s.en)}</p>
          <div class="trans-tools">
            <button class="text-link" data-action="toggle-trans" data-key="${key}">${open ? "收起参考" : "对照参考"}</button>
            <button class="text-link muted" data-action="speak-trans" data-key="${key}">朗读原句</button>
            <button class="text-link muted" data-action="copy-trans" data-key="${key}">复制参考</button>
          </div>
          <textarea class="trans-input" data-trans-input="${key}" placeholder="先自己译一遍，再对照参考。">${esc(value)}</textarea>
          <div class="trans-count"><span data-trans-count="${key}">已写 ${countChars(value)} 字</span><span>参考译文约 ${countChars(entry ? entry.ref : "")} 字</span></div>
          ${open ? transRefPanel(entry, key) : ""}
        </article>`;
    }).join("")}</div>`;
  }

  function translationPassage() {
    const key = "p";
    const entry = window.TRANSLATIONS.passage;
    const open = ui.transOpen[key] === true;
    const value = transValue(key);
    const paragraphs = String(entry.en).split(/\n{2,}/).map(function (p) { return `<p>${esc(p)}</p>`; }).join("");
    return `
      <article class="trans-item passage-trans">
        <div class="trans-head">
          <span class="label">英语二 · 段落翻译</span>
          <span class="tag">约 ${wordCount(entry.en)} 词</span>
        </div>
        <div class="trans-en passage-en">${paragraphs}</div>
        <div class="trans-tools">
          <button class="text-link" data-action="toggle-trans" data-key="${key}">${open ? "收起参考" : "对照参考"}</button>
          <button class="text-link muted" data-action="speak-trans" data-key="${key}">朗读原文</button>
          <button class="text-link muted" data-action="copy-trans" data-key="${key}">复制参考</button>
        </div>
        <textarea class="trans-input trans-input-lg" data-trans-input="${key}" placeholder="按英语二段落翻译的要求，译成连贯的中文。">${esc(value)}</textarea>
        <div class="trans-count"><span data-trans-count="${key}">已写 ${countChars(value)} 字</span><span>参考译文约 ${countChars(entry.ref)} 字</span></div>
        ${open ? transRefPanel(entry, key) : ""}
      </article>`;
  }

  function transRefPanel(entry, key) {
    if (!entry) return "";
    const points = (entry.points || []).map(function (p) { return `<li>${esc(p)}</li>`; }).join("");
    const chunks = (entry.chunks || []).map(function (c) {
      return `<div class="chunk"><span class="en">${esc(c[0])}</span><span class="cn">${esc(c[1])}</span></div>`;
    }).join("");
    const words = (entry.words || []).map(function (w) {
      return `<span class="word-pair"><b>${esc(w[0])}</b>${esc(w[1])}</span>`;
    }).join("");
    return `
      <div class="trans-ref" id="transRef-${key}">
        <p class="ref-label">参考译文</p>
        <p class="ref-cn">${esc(entry.ref)}</p>
        ${points ? `<div class="points"><p class="label" style="margin-top:16px">得分点</p><ul>${points}</ul></div>` : ""}
        ${chunks ? `<div class="chunks"><p class="label" style="margin-top:16px">意群切分</p>${chunks}</div>` : ""}
        ${words ? `<div class="word-pairs">${words}</div>` : ""}
      </div>`;
  }

  /* ------------------------------------------------------------------
     writing
  ------------------------------------------------------------------ */

  function pageWriting() {
    return `
      ${pageHead("07", "写作", "写作", "范文不是拿来整篇背的。拆结构、换主题、改句子，最后要能写出自己的版本。")}
      <div class="writing-intro">
        <p>小作文先保格式与信息点，再谈语言。称呼、目的、细节、请求、署名，少一项就扣一项。</p>
        <p>大作文先描述，再分析，最后收束。描述抓关键细节，分析讲机制，不喊口号，不堆模板。</p>
      </div>
      <div class="subnav">
        <button class="${ui.writingTab === "small" ? "on" : ""}" data-action="writing-tab" data-tab="small">小作文</button>
        <button class="${ui.writingTab === "big" ? "on" : ""}" data-action="writing-tab" data-tab="big">大作文</button>
        <button class="${ui.writingTab === "patterns" ? "on" : ""}" data-action="writing-tab" data-tab="patterns">句型 · 常用句 · 替换</button>
      </div>
      ${ui.writingTab === "small" ? smallWriting() : (ui.writingTab === "big" ? bigWriting() : writingPatterns())}`;
  }

  function smallWriting() {
    return window.WRITING.small.map(function (w, i) {
      return `
        <details class="acc" ${i === 0 ? "open" : ""}>
          <summary>
            <span class="acc-no">${String(i + 1).padStart(2, "0")}</span>
            <span class="acc-title">${esc(w.type)}</span>
            <span class="acc-sub">约 100 词</span>
            <span class="acc-plus"></span>
          </summary>
          <div class="acc-body">
            <p class="scene">${esc(w.scene)}</p>
            <dl class="structure-grid">${w.structure.map(function (row) {
              return `<div class="structure-row"><dt>${esc(row[0])}</dt><dd>${esc(row[1])}</dd></div>`;
            }).join("")}</dl>
            <div class="pattern-block">
              <p class="label">可直接改写的功能句</p>
              <ul class="pattern-list">${w.patterns.map(function (p) {
                return `<li><span class="en">${esc(p)}</span></li>`;
              }).join("")}</ul>
            </div>
            ${sampleBlock(w, "small", i)}
            ${draftBlock(w, "small", i, 100)}
          </div>
        </details>`;
    }).join("");
  }

  function bigWriting() {
    return window.WRITING.big.map(function (w, i) {
      return `
        <details class="acc" ${i === 0 ? "open" : ""}>
          <summary>
            <span class="acc-no">${String(i + 1).padStart(2, "0")}</span>
            <span class="acc-title">${esc(w.kind)} · ${esc(w.topic)}</span>
            <span class="acc-sub">160–200 词</span>
            <span class="acc-plus"></span>
          </summary>
          <div class="acc-body">
            <div class="prompt-box"><span class="label">题目</span><p>${esc(w.prompt)}</p></div>
            <dl class="structure-grid">${w.structure.map(function (row) {
              return `<div class="structure-row"><dt>${esc(row[0])}</dt><dd>${esc(row[1])}</dd></div>`;
            }).join("")}</dl>
            ${sampleBlock(w, "big", i)}
            ${draftBlock(w, "big", i, 160)}
          </div>
        </details>`;
    }).join("");
  }

  function sampleBlock(w, kind, i) {
    const paragraphs = String(w.sample).split(/\n{2,}/).map(function (p) { return `<p>${esc(p)}</p>`; }).join("");
    const notes = (w.notes || []).map(function (n) { return `<li>${esc(n)}</li>`; }).join("");
    return `
      <div class="sample">
        <div class="sample-head">
          <span class="label">范文</span>
          <div class="sample-actions">
            <button class="text-link muted" data-action="speak" data-text="${esc(w.sample)}">朗读</button>
            <button class="text-link muted" data-action="copy-sample" data-kind="${kind}" data-i="${i}">复制</button>
          </div>
        </div>
        <div class="sample-en">${paragraphs}</div>
        ${notes ? `<div class="sample-note"><p class="label" style="margin-bottom:4px">注意</p><ul class="sample-notes">${notes}</ul></div>` : ""}
      </div>`;
  }

  function draftBlock(w, kind, i, target) {
    const key = kind + "-" + i;
    const value = typeof state.drafts[key] === "string" ? state.drafts[key] : "";
    return `
      <div class="draft-box">
        <div class="draft-head"><span class="label">写作练习</span><span class="score-note">目标 ${target} 词左右</span></div>
        <textarea data-draft="${key}" placeholder="先列提纲，再写。写完对照范文，只改三处：结构、语法、重复用词。">${esc(value)}</textarea>
        <div class="draft-foot"><span data-draft-count="${key}">${wordCount(value)} 词</span><span>内容仅保存在本机</span></div>
      </div>`;
  }

  function writingPatterns() {
    const index = window.WRITING.patterns.map(function (g, i) {
      return `<button class="chip" data-action="jump-pattern" data-i="${i}">${esc(g.label)}</button>`;
    }).join("");
    const groups = window.WRITING.patterns.map(function (g, i) {
      return `
        <div class="pattern-group" id="pattern-g-${i}">
          <h3>${esc(g.label)}</h3>
          <ul class="pattern-list">${g.items.map(function (it) {
            return `<li><span class="en">${esc(it[0])}</span><span class="cn">${esc(it[1])}</span></li>`;
          }).join("")}</ul>
        </div>`;
    }).join("");
    const upgrades = window.WRITING.upgrades.map(function (u) {
      return `<tr><td>${esc(u[0])}</td><td>${esc(u[1])}</td><td>${esc(u[2])}</td></tr>`;
    }).join("");
    const criteria = window.WRITING.criteria.map(function (c) {
      return `<tr><td>${esc(c[0])}</td><td>${esc(c[1])}</td></tr>`;
    }).join("");
    const pitfalls = window.WRITING.pitfalls.map(function (p) { return `<li>${esc(p)}</li>`; }).join("");

    return `
      <section class="section">
        <div class="section-head"><h2>功能句库</h2><span class="section-note">按段落功能记，不要按字母背</span></div>
        <div class="pattern-index">${index}</div>
        <div class="pattern-groups">${groups}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>替换词</h2><span class="section-note">准确优先，不要为了高级而高级</span></div>
        <div class="table-wrap"><table class="data upgrade-table"><thead><tr><th>常见表达</th><th>可替换为</th><th>使用提示</th></tr></thead><tbody>${upgrades}</tbody></table></div>
      </section>

      <section class="section">
        <div class="section-head"><h2>评分标准</h2><span class="section-note">考场自查</span></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>维度</th><th>要求</th></tr></thead><tbody>${criteria}</tbody></table></div>
      </section>

      <section class="section">
        <div class="section-head"><h2>常见失分点</h2><span class="section-note">写完后逐条核对</span></div>
        <ul class="pitfall-list">${pitfalls}</ul>
      </section>`;
  }

  /* ------------------------------------------------------------------
     plan
  ------------------------------------------------------------------ */

  function pagePlan() {
    const d = Math.max(0, daysUntil(state.examDate));
    const phase = phaseInfo();
    const current = currentPhase();
    const structure = window.PLAN.structure.map(function (row) {
      return `<tr><td>${esc(row.part)}</td><td class="num" data-label="题量">${esc(row.format)}</td><td class="num" data-label="英语一">${esc(row.y1)}</td><td class="num" data-label="英语二">${esc(row.y2)}</td><td class="num" data-label="建议用时">${esc(row.time)}</td><td data-label="备注">${esc(row.note)}</td></tr>`;
    }).join("");
    const order = window.PLAN.order.map(function (row, i) {
      return `<li><span class="order-no">${String(i + 1).padStart(2, "0")}</span><span class="order-main"><b>${esc(row[0])}</b><span>${esc(row[2])}</span></span><span class="order-time">${esc(row[1])}</span></li>`;
    }).join("");
    const targets = window.PLAN.targets.map(function (row) {
      return `<tr><td class="em">${esc(row[0])}</td><td class="num" data-label="阅读 A">${esc(row[1])}</td><td class="num" data-label="写作">${esc(row[2])}</td><td data-label="要求">${esc(row[3])}</td></tr>`;
    }).join("");
    const phases = window.PLAN.phases.map(function (p) {
      const isNow = p.key === current;
      return `
        <div class="phase ${isNow ? "current" : ""}">
          <div class="phase-when"><b>${esc(p.name)}</b>${esc(p.when)}${isNow ? `<span class="tag hot" style="margin-top:7px">当前阶段</span>` : ""}</div>
          <div>
            <h3>${esc(p.goal)}</h3>
            <ul>${p.tasks.map(function (t) { return `<li>${esc(t)}</li>`; }).join("")}</ul>
          </div>
        </div>`;
    }).join("");
    const years = window.PLAN.years.map(function (row) {
      return `<tr><td class="num">${esc(row[0])}</td><td class="year-use">${esc(row[1])}</td><td class="year-method">${esc(row[2])}</td></tr>`;
    }).join("");
    const methods = window.PLAN.methods.map(function (m) {
      return `<div class="method"><h3>${esc(m.t)}</h3><ul>${m.items.map(function (it) { return `<li>${esc(it)}</li>`; }).join("")}</ul></div>`;
    }).join("");
    const weekly = window.PLAN.weekly.map(function (row, i) {
      return `<div class="week-day ${i >= 5 ? "weekend" : ""}"><p class="d">${esc(row[0])}</p><p class="t">${esc(row[1])}</p></div>`;
    }).join("");
    const final = window.PLAN.final.map(function (t) {
      return `<li><span class="sq"></span><span>${esc(t)}</span></li>`;
    }).join("");

    return `
      ${pageHead("08", "真题与规划", "真题与规划", "规划不是把每天排满，而是知道每个阶段该解决什么问题。真题要反复做，但每一遍要有不同任务。")}
      <div class="plan-hero">
        <div>
          <p class="big">${d}<small>天</small></p>
          <p class="sub">距 ${examYear()} 考研初试 · ${fmtShort(state.examDate)} · 当前为${esc(phase.name)}</p>
        </div>
        <div class="head-actions"><button class="btn btn-sm btn-quiet" data-action="print">打印这份规划</button></div>
      </div>

      <section class="section">
        <div class="section-head"><h2>考试结构</h2><span class="section-note">英语一 / 英语二</span></div>
        <div class="table-wrap"><table class="data plan-table struct"><thead><tr><th>部分</th><th>题量</th><th>英语一</th><th>英语二</th><th>建议用时</th><th>备注</th></tr></thead><tbody>${structure}</tbody></table></div>
      </section>

      <section class="section">
        <div class="section-head"><h2>做题顺序</h2><span class="section-note">先拿大头，再补小分</span></div>
        <ol class="order-list">${order}</ol>
      </section>

      <section class="section">
        <div class="section-head"><h2>分数目标</h2><span class="section-note">按阅读与写作折算</span></div>
        <div class="table-wrap"><table class="data plan-table targets"><thead><tr><th>目标</th><th>阅读 A</th><th>写作</th><th>要求</th></tr></thead><tbody>${targets}</tbody></table></div>
      </section>

      <section class="section">
        <div class="section-head"><h2>四个阶段</h2><span class="section-note">按考试倒计时自动标记</span></div>
        <div class="phase-list">${phases}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>真题安排</h2><span class="section-note">年份越近，越要留到最后</span></div>
        <div class="table-wrap"><table class="data plan-table years"><thead><tr><th>年份</th><th>用途</th><th>做法</th></tr></thead><tbody>${years}</tbody></table></div>
      </section>

      <section class="section">
        <div class="section-head"><h2>分题型方法</h2><span class="section-note">先方法，后速度</span></div>
        <div class="method-grid">${methods}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>一周安排</h2><span class="section-note">可执行的周模板</span></div>
        <div class="weekly">${weekly}</div>
        <p class="mini-note">周内任务可前后调整，但每周至少保留一次完整模考与一次彻底复盘。</p>
      </section>

      <section class="section">
        <div class="section-head"><h2>考前清单</h2><span class="section-note">打印出来逐项核对</span></div>
        <ul class="checklist two-col">${final}</ul>
      </section>

      <div class="note-strip info" style="margin-top:28px">阶段月份是通用建议。开始得晚，就压缩基础期，但不要跳过“逐句精读”和“错题归类”这两步。</div>`;
  }

  /* ------------------------------------------------------------------
     me
  ------------------------------------------------------------------ */

  function pageMe() {
    const route = getRoute();
    if (route.param === "notebook" || route.param === "mistakes" || route.param === "records") {
      ui.meTab = route.param;
    }
    const tab = ui.meTab;
    return `
      ${pageHead("09", "我的记录", "我的记录", "记录不是为了好看。生词要回看，错题要重做，时间要能解释清楚。")}
      <div class="stat-strip">
        <div class="stat"><p class="k">连续学习</p><p class="v">${streakDays()}<small>天</small></p><p class="s">今天也算在内</p></div>
        <div class="stat"><p class="k">累计专注</p><p class="v">${totalMinutes()}<small>分钟</small></p><p class="s">完整专注时段</p></div>
        <div class="stat"><p class="k">已掌握</p><p class="v">${knownCount()}<small>词</small></p><p class="s">标记为“认识”</p></div>
        <div class="stat"><p class="k">错题</p><p class="v">${state.mistakes.length}<small>道</small></p><p class="s">阅读 · 完形 · 新题型</p></div>
      </div>

      <div class="subnav">
        <button class="${tab === "notebook" ? "on" : ""}" data-action="me-tab" data-tab="notebook">生词本</button>
        <button class="${tab === "mistakes" ? "on" : ""}" data-action="me-tab" data-tab="mistakes">错题本</button>
        <button class="${tab === "records" ? "on" : ""}" data-action="me-tab" data-tab="records">记录与设置</button>
      </div>

      ${tab === "notebook" ? meNotebook() : (tab === "mistakes" ? meMistakes() : meRecords())}`;
  }

  function meNotebook() {
    let list = notebookWords();
    if (ui.notebookFilter === "new") list = list.filter(function (w) { return wordStatus(w.w).key === "new"; });
    if (ui.notebookFilter === "fuzzy") list = list.filter(function (w) { return wordStatus(w.w).key === "fuzzy"; });
    const filters = [["all", "全部"], ["new", "生词"], ["fuzzy", "待巩固"]].map(function (f) {
      return `<button class="chip ${ui.notebookFilter === f[0] ? "on" : ""}" data-action="notebook-filter" data-filter="${f[0]}">${f[1]}</button>`;
    }).join("");
    const rows = list.map(function (w) {
      const st = wordStatus(w.w);
      return `
        <div class="notebook-row">
          <button class="w" data-action="open-word" data-w="${esc(w.w)}">${esc(w.w)}</button>
          <span class="m">${esc(w.cn)}</span>
          <span class="acts">
            <span class="word-status ${st.cls}">${st.label}</span>
            <button class="text-link muted" data-action="speak" data-text="${esc(w.w)}">朗读</button>
            <button class="text-link muted" data-action="remove-notebook" data-w="${esc(w.w)}">移出</button>
          </span>
        </div>`;
    }).join("");

    return `
      <div class="toolbar" style="margin-bottom:16px">
        <div class="chips">${filters}</div>
        <span class="count-line">${list.length} 词 · 不认识与模糊的词会自动进入这里</span>
      </div>
      ${list.length ? `<div class="notebook-list">${rows}</div>` : `
        <div class="empty"><p class="mark">净</p><p>这里还没有词。背词时点“不认识”或“模糊”，词会自动进来。</p><div class="actions"><a class="btn btn-quiet" href="#/vocab">去背词</a></div></div>`}`;
  }

  function mistakeRedo(m, q) {
    const st = ui.redo[m.key] || { pick: null, checked: false, ok: false };
    const options = q.options.map(function (opt, oi) {
      let cls = "option";
      if (st.checked) {
        if (oi === q.answer) cls += " correct";
        else if (oi === st.pick) cls += " wrong";
        else cls += " dim";
      } else if (oi === st.pick) {
        cls += " sel";
      }
      return `<button class="${cls}" data-action="redo-pick" data-key="${esc(m.key)}" data-oi="${oi}" ${st.checked ? "disabled" : ""}><i>${letter(oi)}</i><span>${esc(opt)}</span></button>`;
    }).join("");
    const evCn = q.evidence ? readingEvidenceCn(q.rid, q.qi) : "";
    const result = st.checked
      ? (st.ok
        ? `<p class="redo-result ok">答对了。确认这道题已经弄懂，再移出错题本。</p>`
        : `<p class="redo-result no">答错了。正确答案是 ${letter(q.answer)}，回到解析看一遍定位依据。</p>`)
      : "";
    return `<div class="redo-panel">
      <div class="redo-head"><span>重做 · 先不看答案</span><span>${esc(q.loc || m.loc || "")}</span></div>
      <div class="options">${options}</div>
      ${result}
      <div class="redo-actions">
        ${st.checked
          ? `${st.ok
            ? `<button class="btn btn-sm btn-solid" data-action="redo-remove" data-key="${esc(m.key)}">移出错题本</button>`
            : `<button class="btn btn-sm btn-quiet" data-action="redo-reset" data-key="${esc(m.key)}">再做一次</button>`}
             <button class="text-link muted" data-action="redo-reset" data-key="${esc(m.key)}">收起</button>`
          : `<button class="btn btn-sm btn-solid" data-action="redo-check" data-key="${esc(m.key)}">核对答案</button>
             <button class="text-link muted" data-action="redo-reset" data-key="${esc(m.key)}">取消</button>`}
      </div>
      ${st.checked && q.explain ? `<div class="q-explain"><span class="loc">${esc(q.loc || "")}</span>${esc(q.explain)}</div>` : ""}
      ${st.checked && q.evidence ? `
        <div class="evidence-chain compact">
          <div class="evidence-head"><span>题眼句</span><a class="text-link" href="#/reading/${q.rid}/${q.qi + 1}">回看原文 →</a></div>
          <blockquote>${esc(q.evidence.evidence)}</blockquote>
          ${evCn ? `<p class="evidence-cn"><b>句意</b> ${esc(evCn)}</p>` : ""}
          <p class="paraphrase"><b>同义替换</b> ${esc(q.evidence.paraphrase)}</p>
        </div>` : ""}
    </div>`;
  }

  function meMistakes() {
    const types = ["全部", "阅读", "完形", "七选五", "排序", "小标题"];
    const chips = types.map(function (t) {
      const n = t === "全部" ? state.mistakes.length : state.mistakes.filter(function (m) { return m.type === t; }).length;
      return `<button class="chip ${ui.mistakeFilter === t ? "on" : ""}" data-action="mistake-filter" data-filter="${t}">${t}<span class="n">${n}</span></button>`;
    }).join("");
    const list = ui.mistakeFilter === "全部" ? state.mistakes : state.mistakes.filter(function (m) { return m.type === ui.mistakeFilter; });
    const risk = readingRiskItems();
    const showRisk = (ui.mistakeFilter === "全部" || ui.mistakeFilter === "阅读") && risk.items.length > 0;
    const riskRows = risk.items.slice(0, 5).map(function (item) {
      const isLucky = item.kind === "lucky";
      const detail = isLucky
        ? `依据标成第 ${item.located} 段，应在第 ${item.target} 段`
        : "答案对，但还没标依据";
      return `<a class="risk-row" href="#/reading/${item.r.id}/${item.qi + 1}">
        <span class="quality-tag ${isLucky ? "warn" : "pending"}">${isLucky ? "危险正确" : "对但未验"}</span>
        <span class="risk-main"><b>Reading ${String(item.r.id).padStart(2, "0")} · 第 ${item.qi + 1} 题</b><em>${detail}</em></span>
        <span class="risk-arrow">→</span>
      </a>`;
    }).join("");
    const riskSection = showRisk ? `
      <section class="risk-panel">
        <div class="risk-head">
          <div><p class="eyebrow">答案之外的隐患</p><h2>风险正确 <span>${risk.items.length} 题</span></h2></div>
          <a class="text-link" href="#/reading" data-action="view-diagnosis">去阅读页校准 →</a>
        </div>
        <p class="risk-copy">答案对了，但依据没对上。它们不在错题本里，却最容易在考场变成错题。</p>
        <div class="risk-list">${riskRows}</div>
        ${risk.items.length > 5 ? `<p class="risk-more">还有 ${risk.items.length - 5} 题，回阅读页逐篇校准。</p>` : ""}
      </section>` : "";

    const cards = list.map(function (m) {
      const q = mistakeQuestion(m);
      const active = q && ui.redo[m.key];
      let qtag = "";
      if (q && q.rid && q.evidence) {
        const rec = readingRec(q.rid);
        if (rec.locates[q.qi] == null) qtag = `<span class="quality-tag bad">错且未标</span>`;
        else if (Number(rec.locates[q.qi]) === Number(q.evidence.para)) qtag = `<span class="quality-tag mid">定位对·选错</span>`;
        else qtag = `<span class="quality-tag bad">定位也偏</span>`;
      }
      return `
        <article class="mistake-card">
          <div>
            <p class="src">${esc(m.type)} · ${esc(m.source)}${m.loc ? " · " + esc(m.loc) : ""}${qtag}</p>
            <p class="stem">${esc(m.stem)}</p>
            ${active ? mistakeRedo(m, q) : `
              <div class="ans-line"><span class="bad">你的答案 ${esc(m.your || "—")}</span><span class="good">正确答案 ${esc(m.answer || "—")}</span></div>
              ${m.explain ? `<p class="why"><b>解析</b>　${esc(m.explain)}</p>` : ""}
              ${q ? `<div class="redo-entry"><button class="text-link" data-action="redo-start" data-key="${esc(m.key)}">重做这道</button><span>先遮住答案，再选一次</span></div>` : ""}`}
          </div>
          <button class="icon-btn" data-action="remove-mistake" data-key="${esc(m.key)}" aria-label="移除这道错题">✕</button>
        </article>`;
    }).join("");

    return `
      ${riskSection}
      <div class="toolbar" style="margin-bottom:6px">
        <div class="chips">${chips}</div>
        <span class="count-line">${list.length} 道</span>
      </div>
      ${list.length ? `<div class="mistake-list">${cards}</div>` : `
        <div class="empty"><p class="mark">净</p><p>这个分类还没有错题。做完阅读、完形、七选五、排序或小标题，答错的题会自动收录。</p><div class="actions"><a class="btn btn-quiet" href="#/reading">去做阅读</a></div></div>`}`;
  }

  function meRecords() {
    const trapLine = trapLifetimeLine();
    const rows = [];
    let totalTask = 0;
    let totalWord = 0;
    let totalMin = 0;
    for (let i = 13; i >= 0; i--) {
      const date = addDays(new Date(), -i);
      const key = ymd(date);
      const day = state.days[key];
      const tasks = day && Array.isArray(day.tasks) ? day.tasks.filter(Boolean).length : 0;
      const words = Number(day && day.words) || 0;
      const minutes = Number(day && day.minutes) || 0;
      totalTask += tasks; totalWord += words; totalMin += minutes;
      rows.push(`<tr class="${key === todayKey() ? "today" : ""}"><td class="num">${key.slice(5)}</td><td>${tasks ? tasks + " / 5" : "—"}</td><td class="num">${words || "—"}</td><td class="num">${minutes ? minutes + " 分" : "—"}</td></tr>`);
    }

    return `
      <div class="me-grid">
        <section>
          <div class="section-head" style="margin-bottom:0"><h2>最近 14 天</h2><span class="section-note">${totalTask} 项任务 · ${totalMin} 分钟 · ${totalWord} 词</span></div>
          <div class="table-wrap">
            <table class="data history-table">
              <thead><tr><th>日期</th><th>任务</th><th>词汇</th><th>专注</th></tr></thead>
              <tbody>${rows.join("")}</tbody>
            </table>
          </div>
          <p class="mini-note">任务完成数按今日清单计算；专注时长只统计完整走完的计时。数据保存在本机浏览器。</p>
        </section>

        <aside class="settings-box">
          <h3>考试与练习</h3>
          <div class="field">
            <label for="examDateInput">初试日期</label>
            <input id="examDateInput" type="date" value="${esc(state.examDate)}">
          </div>
          <div class="field">
            <label for="dailyWordsInput">每日词汇量</label>
            <input id="dailyWordsInput" type="number" min="5" max="100" step="5" value="${state.dailyWords}">
          </div>
          <p class="mini-note">修改后倒计时与今日任务会立即更新。建议每天 20–50 词，按能复习完的量来定。</p>
          <div class="field">
            <label>朗读方式</label>
            <div class="chips">
              <button class="chip ${state.ttsMode === "auto" ? "on" : ""}" data-action="set-tts" data-mode="auto">自动</button>
              <button class="chip ${state.ttsMode === "native" ? "on" : ""}" data-action="set-tts" data-mode="native">系统语音</button>
              <button class="chip ${state.ttsMode === "builtin" ? "on" : ""}" data-action="set-tts" data-mode="builtin">内置语音</button>
            </div>
            <p class="mini-note">自动：优先系统英文语音；浏览器没有英文语音时，自动改用内置离线语音。系统语音不可用时，也可以在词条里直接切到“内置语音”。</p>
            <button class="text-link" data-action="test-tts">试听一句</button>
          </div>
          <div class="field">
            <label>干扰项归因</label>
            <p class="mini-note">${trapLine || "还没有训练记录。完成一组后，这里会保留累计正确率与最弱类型。"}</p>
            <a class="text-link" href="#/reading/traps">${trapLine ? "再练一组 →" : "去练一组 →"}</a>
          </div>
          <div class="settings-actions">
            <button class="btn btn-sm btn-quiet" data-action="print">打印规划</button>
            <button class="btn btn-sm btn-quiet" data-action="export-data">导出记录</button>
            <button class="btn btn-sm btn-quiet" data-action="import-data">导入记录</button>
            <button class="btn btn-sm btn-quiet danger" data-action="reset-data">清空记录</button>
          </div>
        </aside>
      </div>`;
  }

  /* ------------------------------------------------------------------
     mistakes / exercise helpers
  ------------------------------------------------------------------ */

  function upsertMistake(m) {
    const i = state.mistakes.findIndex(function (x) { return x.key === m.key; });
    if (i !== -1) state.mistakes.splice(i, 1);
    state.mistakes.unshift(m);
    save();
  }

  function removeMistake(key) {
    state.mistakes = state.mistakes.filter(function (m) { return m.key !== key; });
    delete ui.redo[key];
    save();
  }

  function clearMistakes(prefix) {
    state.mistakes = state.mistakes.filter(function (m) { return String(m.key).indexOf(prefix) !== 0; });
    Object.keys(ui.redo).forEach(function (key) {
      if (key.indexOf(prefix) === 0) delete ui.redo[key];
    });
  }

  function clearExerciseMistakes(kind, index) {
    const prefix = kind + "-" + index + "-";
    const legacy = new RegExp("^" + kind + "-\\d+$");
    const isMine = function (key) {
      return key.indexOf(prefix) === 0 || (index === 0 && legacy.test(key));
    };
    state.mistakes = state.mistakes.filter(function (m) { return !isMine(String(m.key)); });
    Object.keys(ui.redo).forEach(function (key) {
      if (isMine(key)) delete ui.redo[key];
    });
  }

  function clearClozeMistakes(index) {
    clearExerciseMistakes("cloze", index);
  }

  function clearSevenMistakes(index) {
    clearExerciseMistakes("seven", index);
  }

  function findMistake(key) {
    return state.mistakes.find(function (m) { return m.key === key; }) || null;
  }

  function mistakeQuestion(m) {
    if (!m) return null;
    const parts = String(m.key).split("-");
    if (parts[0] === "read") {
      const rid = Number(parts[1]);
      const qi = Number(parts[2]);
      const r = (window.READINGS || []).find(function (x) { return x.id === rid; });
      const q = r && r.questions[qi];
      if (!q) return null;
      return { options: q.options, answer: q.answer, explain: q.explain, loc: q.loc, evidence: readingEvidence(rid, qi), rid: rid, qi: qi };
    }
    if (parts[0] === "cloze") {
      const hasSet = parts.length >= 3;
      const setIndex = hasSet ? Number(parts[1]) : 0;
      const i = Number(hasSet ? parts[2] : parts[1]);
      const set = clozeSets()[setIndex];
      const item = set && set.items[i];
      if (!item) return null;
      return { options: item.options, answer: item.answer, explain: item.explain, loc: "第 " + (i + 1) + " 空" };
    }
    if (parts[0] === "seven") {
      const hasSet = parts.length >= 3;
      const setIndex = hasSet ? Number(parts[1]) : 0;
      const i = Number(hasSet ? parts[2] : parts[1]);
      const set = sevenSets()[setIndex];
      const answer = set && set.answers[i];
      if (answer == null) return null;
      return { options: set.options, answer: answer, explain: set.explain[i], loc: "第 " + (i + 1) + " 空" };
    }
    if (parts[0] === "heading") {
      const hasSet = parts.length >= 3;
      const setIndex = hasSet ? Number(parts[1]) : 0;
      const i = Number(hasSet ? parts[2] : parts[1]);
      const set = headingSets()[setIndex];
      const answer = set && set.answers[i];
      if (answer == null) return null;
      return { options: set.options, answer: answer, explain: set.explain[i], loc: "第 " + (i + 1) + " 段" };
    }
    return null;
  }

  function blankContext(paragraphs, n) {
    for (let p = 0; p < paragraphs.length; p++) {
      if (paragraphs[p].indexOf("{{" + n + "}}") !== -1) {
        const clean = paragraphs[p].replace(/\{\{\d+\}\}/g, "____");
        return clean.length > 190 ? clean.slice(0, 187) + "…" : clean;
      }
    }
    return "第 " + n + " 空";
  }

  function gradeCard(grade) {
    const list = filteredWords();
    const w = list[ui.cardIndex];
    if (!w) return;
    if (grade === "known") setWordStatus(w.w, "known");
    else if (grade === "fuzzy") setWordStatus(w.w, "fuzzy");
    else setWordStatus(w.w, "new");
    ui.cardSession[grade]++;
    ui.cardSession.graded++;
    const day = ensureDay(todayKey());
    day.words++;
    touch();
    const goal = Math.max(1, Number(state.dailyWords) || 30);
    if (day.words >= goal) {
      const wasDone = !!day.tasks[0];
      markTask(0, true);
      if (!wasDone) toast("今日词汇已完成");
    }
    ui.cardIndex++;
    ui.cardFlipped = false;
    save();
    rerender();
  }

  function spellCheck(reveal) {
    const sp = ui.spell;
    if (!sp || sp.checked || sp.i >= sp.items.length) return;
    const w = sp.items[sp.i];
    const given = String(sp.value || "").trim().toLowerCase().replace(/\s+/g, " ");
    const expected = String(w.w || "").trim().toLowerCase().replace(/\s+/g, " ");
    const ok = !reveal && given === expected;
    sp.checked = true;
    sp.ok = ok;
    if (ok) {
      sp.score++;
      setWordStatus(w.w, "known");
    } else {
      setWordStatus(w.w, "fuzzy");
    }
    const day = ensureDay(todayKey());
    day.words++;
    const goal = Math.max(1, Number(state.dailyWords) || 30);
    if (day.words >= goal) {
      const wasDone = !!day.tasks[0];
      markTask(0, true);
      if (!wasDone) toast("今日词汇已完成");
    }
    touch();
    save();
    rerender();
  }

  function spellNext() {
    const sp = ui.spell;
    if (!sp || !sp.checked) return;
    sp.i++;
    sp.checked = false;
    sp.ok = false;
    sp.value = "";
    rerender();
  }

  /* ------------------------------------------------------------------
     actions
  ------------------------------------------------------------------ */

  let searchTimer = null;

  function handleAction(action, el) {
    const data = el.dataset;

    switch (action) {
      case "toggle-task": {
        const i = Number(data.i);
        const day = ensureDay(todayKey());
        day.tasks[i] = !day.tasks[i];
        touch();
        save();
        toast(day.tasks[i] ? "已标记完成" : "已取消标记");
        rerender();
        break;
      }
      case "timer-toggle": {
        if (timer.running) {
          timer.remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
          timer.running = false;
          timer.endAt = null;
        } else {
          if (timer.remaining <= 0) timer.remaining = timer.total;
          timer.running = true;
          timer.endAt = Date.now() + timer.remaining * 1000;
        }
        updateTimerDom();
        if (getRoute().name === "home") rerender();
        break;
      }
      case "timer-reset": {
        timer.running = false;
        timer.endAt = null;
        timer.remaining = timer.total;
        updateTimerDom();
        if (getRoute().name === "home") rerender();
        break;
      }
      case "timer-set": {
        const min = Number(data.min) || 25;
        timer.total = min * 60;
        timer.remaining = timer.total;
        timer.running = false;
        timer.endAt = null;
        updateTimerDom();
        rerender();
        break;
      }
      case "set-tag": {
        ui.vocabTag = data.tag;
        ui.vocabLimit = 60;
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        ui.spell = null;
        rerender();
        break;
      }
      case "set-mode": {
        const mode = data.mode;
        ui.vocabMode = mode;
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        ui.spell = null;
        if (mode === "spell") buildSpell();
        render();
        break;
      }
      case "load-more": {
        ui.vocabLimit += 60;
        rerender();
        break;
      }
      case "open-word":
        openWord(data.w);
        break;
      case "close-drawer":
        closeDrawer();
        break;
      case "word-status": {
        setWordStatus(data.w, data.status);
        rerender();
        renderDrawer();
        toast(data.status === "known" ? "已标记为认识" : (data.status === "fuzzy" ? "已加入待巩固" : "已加入生词本"));
        break;
      }
      case "word-toggle-notebook": {
        toggleNotebook(data.w);
        rerender();
        renderDrawer();
        break;
      }
      case "drawer-prev":
      case "drawer-next": {
        const idx = ui.drawerList.findIndex(function (x) { return x.w === ui.drawerWord; });
        const next = action === "drawer-prev" ? idx - 1 : idx + 1;
        if (next >= 0 && next < ui.drawerList.length) {
          ui.drawerWord = ui.drawerList[next].w;
          renderDrawer();
        }
        break;
      }
      case "speak": {
        const text = data.text || data.w || "";
        if (text) speak(text);
        break;
      }
      case "set-tts": {
        if (TTS_MODES.indexOf(data.mode) !== -1) {
          state.ttsMode = data.mode;
          save();
          rerender();
          toast("朗读方式已切换");
        }
        break;
      }
      case "test-tts": {
        speak("Reading is not a race. Slow down, and the argument will become clear.");
        break;
      }
      case "flip-card":
        ui.cardFlipped = !ui.cardFlipped;
        rerender();
        break;
      case "grade-card":
        gradeCard(data.grade);
        break;
      case "restart-cards":
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        rerender();
        break;
      case "spell-check":
        spellCheck(false);
        break;
      case "spell-reveal":
        spellCheck(true);
        break;
      case "spell-next":
        spellNext();
        break;
      case "spell-restart":
        buildSpell();
        rerender();
        break;
      case "sentence-level":
        ui.sentenceLevel = data.level;
        render();
        break;
      case "toggle-sentence": {
        const card = el.closest(".sentence-card");
        if (!card) break;
        const id = Number(data.id);
        const open = !card.classList.contains("open");
        card.classList.toggle("open", open);
        ui.sentenceOpen[id] = open;
        el.setAttribute("aria-expanded", String(open));
        const label = el.querySelector(".toggle-label");
        if (label) label.textContent = open ? "收起解析" : "拆主干 · 看修饰";
        if (open) {
          ui.sentenceOpened[id] = true;
          if (Object.keys(ui.sentenceOpened).length >= 2) markTask(1, true);
        }
        break;
      }
      case "copy-sentence": {
        const s = window.SENTENCES.find(function (x) { return x.id === Number(data.id); });
        if (s) copyThen(s.cn, "译文已复制");
        break;
      }
      case "pick-reading": {
        const id = Number(data.id);
        const qi = Number(data.qi);
        const oi = Number(data.oi);
        const rec = readingRec(id);
        if (rec.submitted) break;
        const ev = readingEvidence(id, qi);
        if (ev && ev.para && rec.locates[qi] == null) {
          toast("先在题下标出依据段，再选答案");
          break;
        }
        rec.answers[qi] = oi;
        state.reading[id] = rec;
        save();
        rerender();
        break;
      }
      case "pick-locate": {
        const id = Number(data.id);
        const qi = Number(data.qi);
        const para = Number(data.para);
        const raw = state.reading[id];
        if (raw && raw.submitted) break;
        const next = raw && typeof raw === "object" ? raw : { answers: {}, submitted: false, score: 0, elapsed: 0 };
        next.locates = next.locates && typeof next.locates === "object" && !Array.isArray(next.locates) ? next.locates : {};
        next.locates[qi] = para;
        state.reading[id] = next;
        save();
        rerender();
        break;
      }
      case "view-diagnosis": {
        ui.scrollDiag = true;
        const route = getRoute();
        if (route.name === "reading" && !route.param) {
          const el = document.getElementById("read-diagnosis");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          ui.scrollDiag = false;
        }
        break;
      }
      case "jump-para": {
        const target = document.querySelector('.passage [data-para="' + Number(data.para) + '"]');
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("para-flash");
          window.setTimeout(function () { target.classList.remove("para-flash"); }, 1800);
        }
        break;
      }
      case "submit-reading": {
        const id = Number(data.id);
        const r = window.READINGS.find(function (x) { return x.id === id; });
        if (!r) break;
        const rec = readingRec(id);
        const missing = r.questions.length - Object.keys(rec.answers).filter(function (k) { return rec.answers[k] != null; }).length;
        if (missing > 0) { toast("还有 " + missing + " 题未选"); break; }
        let score = 0;
        r.questions.forEach(function (q, qi) {
          const picked = rec.answers[qi];
          if (picked === q.answer) score++;
          else upsertMistake({
            key: "read-" + id + "-" + qi,
            type: "阅读",
            source: "阅读 " + String(id).padStart(2, "0") + " · " + r.title,
            stem: q.stem,
            your: picked != null ? letter(picked) : "—",
            answer: letter(q.answer),
            explain: q.explain,
            loc: q.loc
          });
        });
        rec.score = score;
        rec.elapsed = readElapsed(rec);
        rec.submitted = true;
        rec.at = todayKey();
        state.reading[id] = rec;
        ui.readStart = null;
        ui.readId = null;
        markTask(2, true);
        touch();
        save();
        toast("已提交 · 答对 " + score + " 题");
        rerender();
        break;
      }
      case "reset-reading": {
        const id = Number(data.id);
        delete state.reading[id];
        clearMistakes("read-" + id + "-");
        ui.readId = null;
        ui.readStart = null;
        ui.readFocusKey = null;
        save();
        render();
        toast("已重置本篇");
        break;
      }
      case "trap-pick": {
        if (ui.trapChecked) break;
        ui.trapPicked = data.type;
        ui.trapChecked = true;
        const item = (window.TRAP_DRILLS || [])[ui.trapIndex];
        if (item) {
          const right = item.type === data.type;
          if (right) ui.trapScore++;
          ui.trapAnswers.push({ type: item.type, right: right });
          if (!state.trapStats || typeof state.trapStats !== "object") state.trapStats = {};
          const row = state.trapStats[item.type] || { total: 0, right: 0 };
          row.total = (Number(row.total) || 0) + 1;
          if (right) row.right = (Number(row.right) || 0) + 1;
          state.trapStats[item.type] = row;
          save();
        }
        rerender();
        break;
      }
      case "trap-next":
        ui.trapIndex++;
        ui.trapPicked = null;
        ui.trapChecked = false;
        render();
        break;
      case "trap-restart":
        ui.trapIndex = 0;
        ui.trapPicked = null;
        ui.trapChecked = false;
        ui.trapScore = 0;
        ui.trapAnswers = [];
        render();
        break;
      case "cloze-tab":
        ui.clozeTab = data.tab;
        render();
        break;
      case "cloze-set":
        ui.clozeSet = Math.max(0, Number(data.i) || 0);
        render();
        break;
      case "seven-set":
        ui.sevenSet = Math.max(0, Number(data.i) || 0);
        render();
        break;
      case "order-set":
        ui.orderSet = Math.max(0, Number(data.i) || 0);
        render();
        break;
      case "heading-set":
        ui.headingSet = Math.max(0, Number(data.i) || 0);
        render();
        break;
      case "pick-cloze": {
        const active = activeCloze();
        if (active.st.submitted) break;
        active.st.answers[Number(data.i)] = Number(data.oi);
        save();
        rerender();
        break;
      }
      case "submit-cloze": {
        const active = activeCloze();
        const set = active.set;
        const st = active.st;
        const total = set.items.length;
        const answered = Object.keys(st.answers).filter(function (k) { return st.answers[k] != null; }).length;
        if (answered < total) { toast("还有 " + (total - answered) + " 空未选"); break; }
        let score = 0;
        set.items.forEach(function (item, i) {
          const picked = st.answers[i];
          if (picked === item.answer) score++;
          else upsertMistake({
            key: "cloze-" + active.index + "-" + i,
            type: "完形",
            source: set.title,
            stem: blankContext(set.paragraphs, i + 1),
            your: picked != null ? letter(picked) : "—",
            answer: letter(item.answer),
            explain: item.explain,
            loc: "第 " + (i + 1) + " 空"
          });
        });
        st.score = score;
        st.submitted = true;
        touch();
        save();
        toast("已提交 · 答对 " + score + " 空");
        rerender();
        break;
      }
      case "reset-cloze": {
        const active = activeCloze();
        state.clozes[active.index] = emptyCloze();
        clearClozeMistakes(active.index);
        save();
        render();
        toast("已重置本篇完形");
        break;
      }
      case "pick-seven": {
        const active = activeSeven();
        if (active.st.submitted) break;
        const i = Number(data.i);
        const oi = Number(data.oi);
        const answers = active.st.answers.slice(0, 5);
        while (answers.length < 5) answers.push(null);
        const used = answers.indexOf(oi);
        if (used !== -1 && used !== i) answers[used] = null;
        answers[i] = oi;
        active.st.answers = answers;
        save();
        rerender();
        break;
      }
      case "submit-seven": {
        const active = activeSeven();
        const set = active.set;
        const st = active.st;
        const chosen = st.answers.filter(function (x) { return x != null; }).length;
        if (chosen < 5) { toast("还有 " + (5 - chosen) + " 空未选"); break; }
        let score = 0;
        set.answers.forEach(function (correct, i) {
          const picked = st.answers[i];
          if (picked === correct) score++;
          else upsertMistake({
            key: "seven-" + active.index + "-" + i,
            type: "七选五",
            source: set.title,
            stem: blankContext(set.paragraphs, i + 1),
            your: picked != null ? letter(picked) : "—",
            answer: letter(correct),
            explain: set.explain[i],
            loc: "第 " + (i + 1) + " 空"
          });
        });
        st.score = score;
        st.submitted = true;
        touch();
        save();
        toast("已提交 · 答对 " + score + " 空");
        rerender();
        break;
      }
      case "reset-seven": {
        const active = activeSeven();
        state.sevens[active.index] = emptySeven();
        clearSevenMistakes(active.index);
        save();
        render();
        toast("已重置本篇七选五");
        break;
      }
      case "pick-order": {
        const active = activeOrder();
        if (!active.st || active.st.submitted) break;
        const i = Number(data.i);
        const lab = String(data.oi);
        const answers = active.st.answers.slice(0, 5);
        while (answers.length < 5) answers.push(null);
        const used = answers.indexOf(lab);
        if (used !== -1 && used !== i) answers[used] = null;
        answers[i] = lab;
        active.st.answers = answers;
        save();
        rerender();
        break;
      }
      case "submit-order": {
        const active = activeOrder();
        const set = active.set;
        const st = active.st;
        if (!set || !st) break;
        const chosen = st.answers.filter(function (x) { return x != null; }).length;
        if (chosen < 5) { toast("还有 " + (5 - chosen) + " 段未排"); break; }
        let score = 0;
        set.answers.forEach(function (correct, i) {
          const picked = st.answers[i];
          if (picked === correct) score++;
          else {
            const prev = i === 0 ? set.first : set.answers[i - 1];
            upsertMistake({
              key: "order-" + active.index + "-" + i,
              type: "排序",
              source: set.title,
              stem: "接在 " + prev + " 之后（第 " + (i + 2) + " 段）应选哪一段？",
              your: picked || "—",
              answer: correct,
              explain: set.explain[i],
              loc: "第 " + (i + 2) + " 段"
            });
          }
        });
        st.score = score;
        st.submitted = true;
        touch();
        save();
        toast("已提交 · 答对 " + score + " 段");
        rerender();
        break;
      }
      case "reset-order": {
        const active = activeOrder();
        if (!active.st) break;
        state.orders[active.index] = emptyOrder();
        clearExerciseMistakes("order", active.index);
        save();
        render();
        toast("已重置本篇排序题");
        break;
      }
      case "pick-heading": {
        const active = activeHeading();
        if (!active.st || active.st.submitted) break;
        const i = Number(data.i);
        const oi = Number(data.oi);
        const answers = active.st.answers.slice(0, 5);
        while (answers.length < 5) answers.push(null);
        const used = answers.indexOf(oi);
        if (used !== -1 && used !== i) answers[used] = null;
        answers[i] = oi;
        active.st.answers = answers;
        save();
        rerender();
        break;
      }
      case "submit-heading": {
        const active = activeHeading();
        const set = active.set;
        const st = active.st;
        if (!set || !st) break;
        const chosen = st.answers.filter(function (x) { return x != null; }).length;
        if (chosen < 5) { toast("还有 " + (5 - chosen) + " 段未选"); break; }
        let score = 0;
        set.answers.forEach(function (correct, i) {
          const picked = st.answers[i];
          if (picked === correct) score++;
          else upsertMistake({
            key: "heading-" + active.index + "-" + i,
            type: "小标题",
            source: set.title,
            stem: set.sections[i].slice(0, 110) + (set.sections[i].length > 110 ? "…" : ""),
            your: picked != null ? letter(picked) : "—",
            answer: letter(correct),
            explain: set.explain[i],
            loc: "第 " + (i + 1) + " 段"
          });
        });
        st.score = score;
        st.submitted = true;
        touch();
        save();
        toast("已提交 · 答对 " + score + " 段");
        rerender();
        break;
      }
      case "reset-heading": {
        const active = activeHeading();
        if (!active.st) break;
        state.headings[active.index] = emptyHeading();
        clearExerciseMistakes("heading", active.index);
        save();
        render();
        toast("已重置本篇小标题");
        break;
      }
      case "trans-tab":
        ui.transTab = data.tab;
        render();
        break;
      case "toggle-trans": {
        const key = data.key;
        ui.transOpen[key] = !ui.transOpen[key];
        rerender();
        break;
      }
      case "speak-trans": {
        const entry = transEntryByKey(data.key);
        if (entry) speak(entry.en);
        break;
      }
      case "copy-trans": {
        const entry = transEntryByKey(data.key);
        if (entry) copyThen(entry.ref, "参考译文已复制");
        break;
      }
      case "writing-tab":
        ui.writingTab = data.tab;
        render();
        break;
      case "jump-pattern": {
        const el = document.getElementById("pattern-g-" + data.i);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "copy-sample": {
        const list = window.WRITING[data.kind];
        const item = list && list[Number(data.i)];
        if (item) copyThen(item.sample, "范文已复制");
        break;
      }
      case "me-tab":
        ui.meTab = data.tab;
        if (getRoute().param) location.hash = "#/me";
        else render();
        break;
      case "notebook-filter":
        ui.notebookFilter = data.filter;
        rerender();
        break;
      case "mistake-filter":
        ui.mistakeFilter = data.filter;
        rerender();
        break;
      case "redo-start": {
        if (!findMistake(data.key)) break;
        ui.redo[data.key] = { pick: null, checked: false, ok: false };
        rerender();
        break;
      }
      case "redo-pick": {
        const st = ui.redo[data.key];
        if (!st || st.checked) break;
        st.pick = Number(data.oi);
        rerender();
        break;
      }
      case "redo-check": {
        const m = findMistake(data.key);
        const q = mistakeQuestion(m);
        const st = ui.redo[data.key];
        if (!q || !st) break;
        if (st.pick == null) { toast("先选一个答案"); break; }
        st.checked = true;
        st.ok = st.pick === q.answer;
        ui.reviewed[data.key] = true;
        if (Object.keys(ui.reviewed).length >= 2) markTask(4, true);
        touch();
        rerender();
        break;
      }
      case "redo-reset":
        delete ui.redo[data.key];
        rerender();
        break;
      case "redo-remove":
        delete ui.redo[data.key];
        removeMistake(data.key);
        rerender();
        toast("已移出错题本");
        break;
      case "remove-notebook": {
        const w = data.w;
        state.notebook = state.notebook.filter(function (x) { return x !== w; });
        if (state.words[w] === "new" || state.words[w] === "fuzzy") delete state.words[w];
        save();
        rerender();
        toast("已移出生词本");
        break;
      }
      case "remove-mistake":
        removeMistake(data.key);
        rerender();
        toast("已移除");
        break;
      case "print":
        window.print();
        break;
      case "import-data": {
        const input = $("#importFile");
        if (input) input.click();
        break;
      }
      case "export-data": {
        const payload = Object.assign({}, state, { exportedAt: new Date().toISOString() });
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "yanmo-kaoyan-" + todayKey() + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        toast("记录已导出");
        break;
      }
      case "reset-data": {
        if (!window.confirm("确定清空所有背词标记、生词本、错题、翻译草稿和计时记录？此操作不可恢复。")) break;
        try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
        Object.keys(state).forEach(function (k) { delete state[k]; });
        Object.assign(state, defaultState());
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        ui.spell = null;
        ui.redo = {};
        ui.reviewed = {};
        ui.sentenceOpen = {};
        ui.sentenceOpened = {};
        ui.mistakeFilter = "全部";
        ui.notebookFilter = "all";
        ui.clozeSet = 0;
        ui.sevenSet = 0;
        ui.transOpen = {};
        ui.readId = null;
        ui.readStart = null;
        ui.readFocusKey = null;
        ui.scrollDiag = false;
        closeDrawer();
        save();
        render();
        toast("记录已清空");
        break;
      }
      default:
        break;
    }
  }

  function copyThen(text, message) {
    copyText(text).then(function () { toast(message); }).catch(function () { toast("复制失败，请手动选择"); });
  }

  /* ------------------------------------------------------------------
     timer
  ------------------------------------------------------------------ */

  function updateTimerDom() {
    const time = $("#timerTime");
    const stateEl = $("#timerState");
    const card = $("#timerCard");
    const toggle = $("#timerToggle");
    if (!time) return;
    time.textContent = mmss(timer.remaining);
    if (stateEl) stateEl.textContent = timer.running ? "进行中" : (timer.remaining === timer.total ? "未开始" : "已暂停");
    if (card) card.classList.toggle("running", timer.running);
    if (toggle) toggle.textContent = timer.running ? "暂停" : "开始";
  }

  function timerTick() {
    if (!timer.running) return;
    const remaining = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
    timer.remaining = remaining;
    updateTimerDom();
    if (remaining > 0) return;
    timer.running = false;
    timer.endAt = null;
    const minutes = Math.round(timer.total / 60);
    const day = ensureDay(todayKey());
    day.minutes += minutes;
    touch();
    save();
    timer.remaining = timer.total;
    updateTimerDom();
    toast("专注完成 · 记入 " + minutes + " 分钟");
    if (getRoute().name === "home") rerender();
  }

  function readingTick() {
    if (!ui.readStart || !ui.readId) return;
    const el = $("#readClock");
    if (!el) return;
    el.textContent = mmss((Date.now() - ui.readStart) / 1000);
  }

  /* ------------------------------------------------------------------
     input / change / keyboard
  ------------------------------------------------------------------ */

  function bindEvents() {
    document.addEventListener("click", function (e) {
      const el = e.target.closest("[data-action]");
      if (!el || el.disabled) return;
      handleAction(el.getAttribute("data-action"), el);
    });

    document.addEventListener("input", function (e) {
      const t = e.target;

      if (t.id === "vocabSearch") {
        ui.vocabQ = t.value;
        ui.vocabLimit = 60;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
          const body = $("#vocabBody");
          if (body && ui.vocabMode === "list") body.innerHTML = vocabBody(filteredWords());
        }, 110);
        return;
      }

      if (t.id === "spellInput") {
        if (ui.spell) ui.spell.value = t.value;
        return;
      }

      if (t.hasAttribute("data-trans-input")) {
        const key = t.getAttribute("data-trans-input");
        state.translations[key] = t.value;
        save();
        const counter = document.querySelector('[data-trans-count="' + key + '"]');
        if (counter) counter.textContent = "已写 " + countChars(t.value) + " 字";
        return;
      }

      if (t.hasAttribute("data-draft")) {
        const key = t.getAttribute("data-draft");
        state.drafts[key] = t.value;
        save();
        const counter = document.querySelector('[data-draft-count="' + key + '"]');
        const n = wordCount(t.value);
        if (counter) counter.textContent = n + " 词";
        if (n >= 50) markTask(3, true);
      }
    });

    document.addEventListener("change", function (e) {
      const t = e.target;
      if (t.id === "examDateInput") {
        const v = t.value;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { toast("日期格式不正确"); return; }
        state.examDate = v;
        save();
        rerender();
        toast("初试日期已更新");
      }
      if (t.id === "dailyWordsInput") {
        const n = Math.min(100, Math.max(5, Number(t.value) || 30));
        state.dailyWords = n;
        save();
        rerender();
        toast("每日词汇量已设为 " + n);
      }
      if (t.id === "importFile") {
        const file = t.files && t.files[0];
        t.value = "";
        if (!file) return;
        if (!window.confirm("导入会覆盖当前记录，确定继续？")) return;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const raw = JSON.parse(String(reader.result));
            if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("bad");
            delete raw.exportedAt;
            const next = normalizeState(raw);
            Object.keys(state).forEach(function (k) { delete state[k]; });
            Object.assign(state, next);
            ui.cardIndex = 0;
            ui.cardFlipped = false;
            ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
            ui.spell = null;
            ui.redo = {};
            ui.reviewed = {};
            ui.sentenceOpen = {};
            ui.sentenceOpened = {};
            ui.mistakeFilter = "全部";
            ui.notebookFilter = "all";
            ui.transOpen = {};
            ui.readId = null;
            ui.readStart = null;
            closeDrawer();
            save();
            render();
            toast("记录已导入");
          } catch (err) {
            toast("导入失败：不是有效的记录文件");
          }
        };
        reader.onerror = function () { toast("读取文件失败"); };
        reader.readAsText(file);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (ui.drawerWord) closeDrawer();
        return;
      }
      if (ui.drawerWord) return;
      const tag = document.activeElement ? document.activeElement.tagName : "";
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const route = getRoute();

      if (route.name === "vocab" && ui.vocabMode === "spell" && e.key === "Enter" && document.activeElement && document.activeElement.id === "spellInput") {
        e.preventDefault();
        if (ui.spell && ui.spell.checked) spellNext();
        else spellCheck(false);
        return;
      }

      if (typing) return;
      if (route.name === "vocab" && ui.vocabMode === "card") {
        if (e.key === " " || e.code === "Space") {
          e.preventDefault();
          ui.cardFlipped = !ui.cardFlipped;
          rerender();
          return;
        }
        if (ui.cardFlipped && (e.key === "1" || e.key === "2" || e.key === "3")) {
          e.preventDefault();
          gradeCard(e.key === "1" ? "unknown" : (e.key === "2" ? "fuzzy" : "known"));
        }
      }
    });

    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("click", function (e) {
        e.preventDefault();
        const main = $("#main");
        if (main) {
          main.focus();
          main.scrollIntoView({ block: "start" });
        }
      });
    }

    window.addEventListener("hashchange", function () {
      closeDrawer();
      render();
    });
  }

  /* ------------------------------------------------------------------
     boot
  ------------------------------------------------------------------ */

  bindEvents();
  setInterval(timerTick, 250);
  setInterval(readingTick, 1000);
  render();

})();
