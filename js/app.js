(function () {
  "use strict";

  // 显示在页脚与语音自检里，方便确认手机上跑的是不是最新版本
  const APP_BUILD = (document.querySelector('meta[name="app-build"]') || {}).content || "2026-10-27.2";

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
    { v: "待复习", l: "待复习" },
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

  function formatBytes(n) {
    const v = Number(n);
    if (!isFinite(v) || v <= 0) return "0 B";
    if (v < 1024) return Math.round(v) + " B";
    if (v < 1024 * 1024) return (v / 1024).toFixed(1) + " KB";
    if (v < 1024 * 1024 * 1024) return (v / (1024 * 1024)).toFixed(1) + " MB";
    return (v / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  function backupAgeDays() {
    const t = Date.parse(state.lastExportAt || "");
    if (!isFinite(t)) return null;
    return Math.max(0, Math.floor((Date.now() - t) / 86400000));
  }

  function backupDue() {
    const days = backupAgeDays();
    return days === null || days >= 14;
  }

  function backupLine() {
    const days = backupAgeDays();
    if (days === null) return "还没有导出过备份。";
    if (days === 0) return "上次备份：今天。";
    return "上次备份：" + days + " 天前。";
  }

  function backupHint() {
    const days = backupAgeDays();
    if (days === null) return "建议先导出一次，换设备或清理浏览器后可恢复。";
    if (days >= 14) return "已超过两周没有备份，建议现在导出一次。";
    return "备份文件可恢复背词、错题、模考和打卡记录。";
  }

  function backupSummary(s) {
    const src = s || {};
    const words = Object.keys(src.words || {}).length;
    const notebook = Array.isArray(src.notebook) ? src.notebook.length : 0;
    const mistakes = Array.isArray(src.mistakes) ? src.mistakes.length : 0;
    const days = Object.keys(src.days || {}).filter(function (k) { return isActiveDay(src.days[k]); }).length;
    const exams = Array.isArray(src.exams) ? src.exams.length : 0;
    const drafts = Object.keys(src.drafts || {}).length;
    const bits = [];
    if (words) bits.push(words + " 个背词标记");
    if (notebook) bits.push(notebook + " 个生词");
    if (mistakes) bits.push(mistakes + " 道错题");
    if (days) bits.push(days + " 天学习记录");
    if (exams) bits.push(exams + " 次模考");
    if (drafts) bits.push(drafts + " 篇写作草稿");
    return bits.length ? bits.join("、") : "没有可统计的学习记录";
  }

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

  /* 朗读分层：自然神经音 → 有道单词真人音 / 百度整句人声 → 系统普通音 → 离线合成音。
     没有自然音的环境（360/Chrome/安卓常见）也能听到正常人声。 */
  const TTS_MODES = ["auto", "native", "builtin"];
  let nativeVoiceList = [];
  let builtinTtsReady = false;
  let builtinTtsFailed = false;
  let ttsDiagActive = false;
  let lastTtsDiag = "";

  // 平台判定：手机/平板的朗读链路与桌面不同，单独做稳定性处理。
  const IS_TOUCH = (typeof window !== "undefined") && (("ontouchstart" in window) || (navigator.maxTouchPoints || 0) > 0);
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent || "")
    || (navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
  const IS_MOBILE = IS_TOUCH || /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent || "");
  // 每次系统语音朗读的令牌：切换文本/停止后，旧回调与旧定时器全部作废。
  let nativeRunToken = 0;

  function refreshNativeVoices() {
    if (!("speechSynthesis" in window)) { nativeVoiceList = []; return; }
    try { nativeVoiceList = window.speechSynthesis.getVoices() || []; } catch (err) { nativeVoiceList = []; }
    // 设置页开着且语音列表后到时，重渲染让「当前将使用」的提示跟上（自检进行中不打断）
    try {
      if (nativeVoiceList.length && !ttsDiagActive && typeof rerender === "function" && document.querySelector("#ttsVoiceSelect")) rerender();
    } catch (err) {}
  }

  /* 预热：在线神经网络音首次合成要连服务并取首包音频(实测首帧要 2~4 秒)。
     进页面/首次触摸时先派一个静音小请求，把连接提前建好，点词时几乎立刻出声。 */
  let warmedVoice = false;

  function warmNativeVoice() {
    if (warmedVoice || !("speechSynthesis" in window)) return;
    // 移动端浏览器要求语音必须在用户手势里启动；无手势预热会被静默拦截，
    // 甚至把引擎卡在 pending，导致第一次点朗读不出声。手机直接跳过预热。
    if (IS_MOBILE) return;
    try {
      if (navigator.userActivation && navigator.userActivation.hasBeenActive === false) return;
    } catch (err) {}
    const synth = window.speechSynthesis;
    try { if (synth.speaking || synth.pending) return; } catch (err) { return; }
    const v = resolveVoice();
    if (!v) return;   // 语音列表还没就绪：不封锁,下个时机再试
    warmedVoice = true;
    try {
      const u = new SpeechSynthesisUtterance("a");
      u.voice = v;
      u.lang = v.lang || "en-US";
      u.volume = 0;   // 完全静音,只建立服务连接
      u.rate = 2;
      synth.speak(u);
    } catch (err) { warmedVoice = false; }
  }

  if ("speechSynthesis" in window) {
    refreshNativeVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", refreshNativeVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = refreshNativeVoices;
    }
    // voices 到达后也要各试一次预热(voiceschanged 可能触发多次,函数内部自会锁)
    try { window.speechSynthesis.addEventListener("voiceschanged", warmNativeVoice); } catch (err) {}
  }

  function englishVoices() {
    let list = (nativeVoiceList && nativeVoiceList.length)
      ? nativeVoiceList
      : (("speechSynthesis" in window) ? (window.speechSynthesis.getVoices() || []) : []);
    if (!list.length) return [];
    const en = list.filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ""); });
    const score = function (v) {
      const name = (v.name || "").toLowerCase();
      let s = 0;
      if (/natural|neural|online/i.test(name)) s += 8;      // Windows 11 / Edge 的神经网络音最自然
      if (/multilingual/i.test(name)) s -= 2;                // 多语言版读英文带口音，优先纯英文版
      if (/^en-us/i.test(v.lang || "")) s += 3;
      if (/^en-gb/i.test(v.lang || "")) s += 2;
      if (/aria|jenny|ana|emma|michelle|guy|zira|samantha|daniel|serena|google/i.test(name)) s += 3;
      if (v.localService) s += 1;
      return s;
    };
    en.sort(function (a, b) { return score(b) - score(a); });
    return en;
  }

  // 本次访问内被判定「没读出来/假死」的系统语音，之后不再重试
  const deadVoices = new Set();

  // 设置里手动选过的声音优先；否则取质量最高的一条。已列入黑名单的自动跳过
  function resolveVoice() {
    const alive = englishVoices().filter(function (v) { return !deadVoices.has(v.name); });
    if (!alive.length) return null;
    const pref = (state && state.ttsVoice) || "";
    if (pref) {
      for (let i = 0; i < alive.length; i++) {
        if (alive[i].name === pref || alive[i].voiceURI === pref) return alive[i];
      }
    }
    return alive[0];
  }

  // 朗读候选链：首选（手动指定或自动最优）→ 其他自然系统语音。
  // 只要设备有自然音，就不把机械本地音放进候选链，免得读到一半突然变机器音；
  // 自然音全失败后由上层接着走在线人声。
  function voiceCandidates() {
    const alive = englishVoices().filter(function (v) { return !deadVoices.has(v.name); });
    const pref = (state && state.ttsVoice) || "";
    let pool = alive;
    if (!pref) {
      const naturalAlive = alive.filter(function (v) { return NATURAL_VOICE_RE.test(v.name || ""); });
      if (naturalAlive.length) pool = naturalAlive;
    }
    const out = [];
    if (pref) {
      for (let i = 0; i < alive.length; i++) {
        if (alive[i].name === pref || alive[i].voiceURI === pref) { out.push(alive[i]); break; }
      }
    } else if (pool.length) {
      out.push(pool[0]);
    }
    const rest = pool.filter(function (v) { return out.indexOf(v) === -1; });
    for (let i = 0; i < rest.length && out.length < 4; i++) out.push(rest[i]);
    return out;
  }

  // 语速：慢/正常/快；长句（阅读原句）略快于单词
  function rateBase(len) {
    const t = (state && state.ttsRate) || "normal";
    const long = len > 120;
    if (t === "slow") return long ? 0.78 : 0.72;
    if (t === "fast") return long ? 1.12 : 1.06;
    return long ? 0.95 : 0.9;
  }

  /* ------------------------------------------------------------------
     在线真人发音：有道词典音频（单词与词组）。国内直连、无需密钥、
     跨源 <audio> 播放不受 CORS 限制；播放失败自动落到下一层。
  ------------------------------------------------------------------ */
  const NATURAL_VOICE_RE = /natural|neural|online|enhanced|premium|siri|samantha|daniel|moira|karen|tessa|serena/i;
  let onlineAudio = null;
  let onlineAudioUnlocked = false;
  let onlineToken = 0;
  let onlineActive = false;
  let onlineFailedText = "";
  // 极短的静音 WAV：首次触摸时用它把音频元素解锁，之后整段朗读都复用这个元素
  const SILENT_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

  function onlineAudioEl() {
    if (onlineAudio) return onlineAudio;
    try {
      const a = new Audio();
      a.preload = "auto";
      a.setAttribute("playsinline", "");
      onlineAudio = a;
    } catch (err) { onlineAudio = null; }
    return onlineAudio;
  }

  /* 手机浏览器只允许“被用户手势解锁过”的音频元素继续播放。
     整段朗读必须复用同一个元素；每段新建 Audio 时，第二段起会被拦截，
     表现就是“第一段人声、后面全变机械音”。 */
  function unlockOnlineAudio() {
    if (!IS_MOBILE || onlineAudioUnlocked) return;
    const a = onlineAudioEl();
    if (!a) return;
    try {
      a.pause();
      a.onended = null;
      a.onerror = null;
      a.onplaying = null;
      a.src = SILENT_WAV;
      onlineAudioUnlocked = true;
      const p = a.play();
      if (p && p.catch) p.catch(function () { try { a.pause(); } catch (err) {} });
    } catch (err) { onlineAudioUnlocked = false; }
  }

  function clearOnlineAudio() {
    const a = onlineAudio;
    if (!a) return;
    try {
      a.onended = null;
      a.onerror = null;
      a.onplaying = null;
      a.pause();
    } catch (err) {}
  }

  function hasNaturalVoice() {
    return englishVoices().some(function (v) {
      return !deadVoices.has(v.name) && NATURAL_VOICE_RE.test(v.name || "");
    });
  }

  // 只把「单词/短词组」交给词典音源；整句、长短语不走（词典接口不支持）
  function isWordLike(text) {
    const t = String(text || "").trim();
    if (!t || t.length > 40) return false;
    if (/[.!?;:,]/.test(t)) return false;
    if ((t.match(/\s+/g) || []).length > 4) return false;
    return /^[A-Za-z][A-Za-z'’\- ]*$/.test(t);
  }

  function speakOnline(text, onFail) {
    if (!isWordLike(text)) return false;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
    const a = onlineAudioEl();
    if (!a) return false;
    const token = ++onlineToken;
    const rate = state && state.ttsRate === "slow" ? 0.8 : (state && state.ttsRate === "fast" ? 1.15 : 1);
    let settled = false;
    let guard = null;
    const finish = function (ok) {
      if (settled) return;
      settled = true;
      if (guard) { clearTimeout(guard); guard = null; }
      if (token !== onlineToken) return;
      try {
        a.onended = null;
        a.onerror = null;
        a.onplaying = null;
      } catch (err) {}
      onlineActive = false;
      ttsMarkSpeaking(false);
      if (!ok) { onlineFailedText = text; onFail(); }
    };
    guard = setTimeout(function () {
      if (token !== onlineToken) return;
      if (a.currentTime > 0 && !a.paused) return;   // 已经在放，不打扰
      try { a.pause(); } catch (err) {}
      finish(false);
    }, IS_MOBILE ? 2800 : 4200);
    try {
      a.pause();
      a.onended = null;
      a.onerror = null;
      a.onplaying = null;
      a.preload = "auto";
      a.referrerPolicy = "no-referrer";
      a.src = "https://dict.youdao.com/dictvoice?audio=" + encodeURIComponent(text) + "&type=2";
      a.playbackRate = rate;
      a.onended = function () { finish(true); };
      a.onerror = function () { finish(false); };
      ttsMarkSpeaking(true);
      onlineActive = true;
      const p = a.play();
      if (p && p.catch) p.catch(function () { if (token === onlineToken) finish(false); });
      return true;
    } catch (err) {
      onlineActive = false;
      onlineToken++;
      ttsMarkSpeaking(false);
      return false;
    }
  }

  /* ------------------------------------------------------------------
     在线整句/整段真人声：百度翻译 TTS（无需密钥、国内直连、返回 mp3）。
     单条上限约 600 字符，这里按句切成 160 字符以内，逐块播放并提前预取
     下一块，句间几乎无缝；整页只探测一次，失败即回系统语音/离线音。
     注意：百度会拒绝带站外 Referer 的请求，整页依赖 index.html 里的
     <meta name="referrer" content="no-referrer">（单文件版同样保留）。
  ------------------------------------------------------------------ */
  let onlineTextDead = false;
  let onlineTextDeadAt = 0;
  let onlineTextNoted = false;

  function baiduTtsUrl(text) {
    return "https://fanyi.baidu.com/gettts?lan=en&text=" + encodeURIComponent(text) + "&spd=3&source=web";
  }

  function onlineSplit(text, limit) {
    limit = limit || 160;
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return [];
    const out = [];
    let buf = "";
    const flush = function () {
      const t = buf.trim();
      if (t) out.push(t);
      buf = "";
    };
    const segs = clean.split(/(?<=[.!?;:])\s+/);
    for (const raw of segs) {
      let s = raw.trim();
      if (!s) continue;
      while (s.length > limit) {
        flush();
        let cut = s.lastIndexOf(" ", limit);
        if (cut < Math.floor(limit * 0.55)) cut = limit;
        out.push(s.slice(0, cut).trim());
        s = s.slice(cut).trim();
      }
      if (!s) continue;
      if (buf && buf.length + 1 + s.length > limit) flush();
      buf = buf ? buf + " " + s : s;
    }
    flush();
    return out;
  }

  function speakOnlineSentence(text, onFail) {
    if (onlineTextDead && Date.now() - onlineTextDeadAt < 180000) return false;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
    onlineTextDead = false;
    const chunks = onlineSplit(text, 160);
    if (!chunks.length) return false;
    const a = onlineAudioEl();
    if (!a) return false;
    const token = ++onlineToken;
    const rate = state && state.ttsRate === "slow" ? 0.82 : (state && state.ttsRate === "fast" ? 1.16 : 1);
    let idx = 0;
    let settled = false;
    let guard = null;

    function clearHandlers() {
      try {
        a.onended = null;
        a.onerror = null;
        a.onplaying = null;
      } catch (err) {}
    }

    function cleanUp() {
      if (guard) { clearTimeout(guard); guard = null; }
      clearHandlers();
    }

    function fail(blocked) {
      if (settled) return;
      settled = true;
      cleanUp();
      if (token !== onlineToken) return;
      onlineActive = false;
      try { a.pause(); } catch (err) {}
      ttsMarkSpeaking(false);
      if (idx === 0 && !blocked) {
        onlineTextDead = true;
        onlineTextDeadAt = Date.now();
        if (!onlineTextNoted) {
          onlineTextNoted = true;
          toast("在线人声暂时连不上，先用系统语音；稍后会自动重试");
        }
      }
      // 中途失败时只把剩下的部分交给下一层，避免从头再读一遍
      const rest = idx === 0 ? "" : chunks.slice(idx).join(" ");
      try { onFail(rest); } catch (err) {}
    }

    function done() {
      if (settled) return;
      settled = true;
      cleanUp();
      if (token !== onlineToken) return;
      onlineActive = false;
      ttsMarkSpeaking(false);
    }

    function playChunk() {
      if (settled) return;
      if (token !== onlineToken) { done(); return; }
      if (idx >= chunks.length) { done(); return; }
      const myIdx = idx;
      try {
        a.pause();
        clearHandlers();
        a.preload = "auto";
        a.referrerPolicy = "no-referrer";
        a.playbackRate = rate;
        a.onplaying = function () {
          if (guard) { clearTimeout(guard); guard = null; }
        };
        a.onended = function () {
          if (settled || token !== onlineToken) return;
          if (guard) { clearTimeout(guard); guard = null; }
          idx++;
          playChunk();
        };
        a.onerror = function () { fail(false); };
        onlineActive = true;
        ttsMarkSpeaking(true);
        a.src = baiduTtsUrl(chunks[myIdx]);
        if (guard) clearTimeout(guard);
        // 首块允许 4 秒（含网络与合成），后续块 6 秒；已开始或已缓冲好就不再拦
        guard = setTimeout(function () {
          if (settled || token !== onlineToken || idx !== myIdx) return;
          if (!a.paused && a.currentTime > 0.05) return;
          if (a.readyState >= 3 && !a.paused) return;
          fail(false);
        }, myIdx === 0 ? (IS_MOBILE ? 4000 : 7000) : (IS_MOBILE ? 6000 : 9000));
        const pr = a.play();
        if (pr && pr.catch) pr.catch(function (err) {
          if (token !== onlineToken) return;
          fail(!!err && err.name === "NotAllowedError");
        });
      } catch (err) { fail(false); }
    }

    playChunk();
    return true;
  }

  /* 设置页的「朗读声音」选择器 */
  function ttsVoiceField() {
    const list = englishVoices();
    const opts = ['<option value=""' + (!(state && state.ttsVoice) ? " selected" : "") + '>自动选择（质量最高优先）</option>'];
    if (list.length) {
      for (const v of list.slice(0, 24)) {
        const natural = /natural|neural|online/i.test(v.name || "");
        opts.push('<option value="' + esc(v.name) + '"' + (state && state.ttsVoice === v.name ? " selected" : "") + '>'
          + esc(v.name) + " · " + esc(String(v.lang || "").replace("_", "-")) + (natural ? " · 神经网络" : (v.localService ? " · 本地" : " · 在线")) + '</option>');
      }
    } else {
      opts.push('<option disabled>当前浏览器/设备未检测到英文语音</option>');
    }
    const cur = resolveVoice();
    const hint = cur
      ? "当前将使用：" + esc(cur.name) + (state && state.ttsVoice ? "（手动指定）" : "（自动选择）") + "。若没读出来会自动换下一个语音。"
      : "未检测到系统英文语音，当前会用离线内置语音朗读。";
    const natural = list.filter(function (v) { return /natural|neural|online/i.test(v.name || ""); }).length;
    const warn = !list.length
      ? '<p class="mini-note">当前浏览器没有英文系统语音：单词自动用有道真人发音、整句自动用百度在线人声（需联网）；断网时用离线合成音。用 Microsoft Edge 打开可获得完整神经语音。</p>'
      : (!natural ? '<p class="mini-note">当前英文语音偏机械：单词自动用有道真人发音，整句自动用百度在线人声（需联网）；断网时回落到系统语音。想要神经语音，用 Microsoft Edge 打开。</p>' : "");
    return `<div class="field" style="margin-top:10px"><label for="ttsVoiceSelect">朗读声音</label><select id="ttsVoiceSelect">${opts.join("")}</select><p class="mini-note">${hint}</p>${warn}</div>`;
  }

  /* 语音自检：逐条试播候选语音,把浏览器/语音数量/出声耗时摊开给用户看 */
  function ttsBrowserName() {
    const ua = navigator.userAgent || "";
    if (/MicroMessenger/i.test(ua)) return "微信内置浏览器";
    if (/MQQBrowser|QQBrowser/i.test(ua)) return "QQ 浏览器";
    if (/HuaweiBrowser|HarmonyOS|HBPC/i.test(ua)) return "华为浏览器";
    if (/MiuiBrowser/i.test(ua)) return "小米浏览器";
    if (/VivoBrowser/i.test(ua)) return "vivo 浏览器";
    if (/HeyTapBrowser|OppoBrowser/i.test(ua)) return "OPPO 浏览器";
    if (/Edg\//.test(ua)) return "Microsoft Edge";
    if (/OPR\//.test(ua)) return "Opera";
    if (/Firefox\//.test(ua)) return "Firefox";
    if (/Chrome\//.test(ua)) return "Chrome 内核浏览器（Chrome / 360 / QQ 等）";
    if (/Safari\//.test(ua)) return "Safari";
    return "未知浏览器";
  }

  function runTtsDiag() {
    const box = document.querySelector("#ttsDiag");
    if (!box) return;
    ttsDiagActive = true;
    const paint = function (html) {
      const b = document.querySelector("#ttsDiag");
      if (b) b.innerHTML = html;
    };
    paint('<p class="mini-note">正在检测……最多几秒。</p>');
    if (!("speechSynthesis" in window)) {
      ttsDiagActive = false;
      paint('<p class="mini-note">检测结果：此浏览器不支持系统语音合成。单词会用有道真人发音、整句用百度在线人声（均需联网），断网时用离线机械音。</p>');
      return;
    }
    const synth = window.speechSynthesis;
    const list = englishVoices();
    const naturalCount = list.filter(function (v) { return /natural|neural|online/i.test(v.name || ""); }).length;
    const top = [];
    for (let i = 0; i < list.length && top.length < 3; i++) {
      if (!deadVoices.has(list[i].name)) top.push(list[i]);
    }
    const results = [];
    const finish = function () {
      const lines = [];
      lines.push("版本：" + APP_BUILD);
      lines.push("浏览器：" + ttsBrowserName());
      lines.push("设备：" + (IS_MOBILE ? "移动端" : "桌面") + (IS_IOS ? "（iOS）" : "") + " · 触屏 " + (IS_TOUCH ? "是" : "否"));
      lines.push("英文系统语音：" + list.length + " 个（其中神经网络音 " + naturalCount + " 个）");
      const chosen = resolveVoice();
      lines.push("朗读方式：" + ((state && state.ttsMode) || "auto") + "；自动首选：" + (chosen ? chosen.name : "无系统英文语音"));
      lines.push("联网：" + (navigator.onLine === false ? "否" : "是") + "；在线音频已解锁：" + (onlineAudioUnlocked ? "是" : "否"));
      for (const r of results) {
        lines.push((r.ok ? "✓ " : "✗ ") + r.name + (r.ok ? "，出声用时 " + (r.ms / 1000).toFixed(1) + " 秒" : "，" + r.note));
      }
      let verdict;
      if (!list.length) {
        verdict = "当前浏览器提供不了英文语音：单词自动用有道真人发音、整句自动用百度在线人声（均需联网），断网时用离线机械音。";
      } else if (!naturalCount) {
        verdict = "你的英文语音都是传统合成音，天生偏机械。单词已自动切到有道真人发音，整句已自动切到百度在线人声（需联网）。";
      } else if (results.some(function (r) { return r.ok; })) {
        verdict = "神经网络音能正常出声。若刚才听到的仍是机械音，请把上方「朗读方式」切回「自动」，再点「试听一句」。";
      } else {
        verdict = "检测到神经网络音但都没能出声：单词会用有道真人发音、整句会用百度在线人声兜底（需联网）；也可检查 Windows 设置 → 隐私和安全性 → 语音 →「在线语音识别」。";
      }
      lines.push(verdict);
      ttsDiagActive = false;
      lastTtsDiag = lines.join("\n");
      paint(lines.map(function (t) { return '<p class="mini-note">' + esc(t) + "</p>"; }).join("")
        + '<p class="mini-note"><button class="text-link" data-action="copy-tts-diag">复制诊断信息</button></p>');
    };
    const probeOne = function (i) {
      if (i >= top.length) { finish(); return; }
      const v = top[i];
      let done = false;
      const t0 = Date.now();
      const end = function (ok, note) {
        if (done) return;
        done = true;
        clearTimeout(to);
        try { synth.cancel(); } catch (err) {}
        results.push({ name: v.name, ok: ok, ms: Date.now() - t0, note: note || "" });
        setTimeout(function () { probeOne(i + 1); }, 250);
      };
      const to = setTimeout(function () { end(false, "8 秒内没出声"); }, 8000);
      try {
        const u = new SpeechSynthesisUtterance("Hello, this is a test.");
        u.voice = v;
        u.lang = v.lang || "en-US";
        u.rate = 1;
        u.volume = 0.05;
        u.onstart = function () { end(true, ""); };
        u.onerror = function (e) { end(false, (e && e.error) || "报错"); };
        synth.speak(u);
      } catch (err) {
        end(false, "调用异常");
      }
    };
    probeOne(0);
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
      ttsMarkSpeaking(true);
      builtinActive = true;
      // 分小段链播：一次性合成整篇会先卡住界面再开口；小段生成快、句间也顺
      const parts = speechChunks(text, 240);
      let i = 0;
      const playNext = function () {
        if (i >= parts.length) {
          builtinActive = false;
          ttsMarkSpeaking(false);
          return;
        }
        const part = parts[i++];
        let advanced = false;
        const step = function () {
          if (advanced) return;
          advanced = true;
          playNext();
        };
        // 回调之外的兜底：个别环境不回调播放完成，用估算时长接力，避免只读第一段
        const guard = setTimeout(step, Math.max(1800, Math.round(part.length * 85) + 900));
        meSpeak.speak(part, { speed: 150, amplitude: 100, wordgap: 10 }, function (ok) {
          clearTimeout(guard);
          if (ok) { step(); return; }
          builtinActive = false;
          ttsMarkSpeaking(false);
          toast("发音失败，请再点一次");
        });
      };
      playNext();
      return true;
    } catch (err) {
      builtinActive = false;
      ttsMarkSpeaking(false);
      toast("发音失败：" + (err.message || "未知错误"));
      return false;
    }
  }

  // 长文本按句切分后依次入队播放，避免单条超长语音开头延迟大、中途卡顿。
  // 在线神经网络音分块过大/过碎都会在衔接处露缝，默认 480 字符；离线合成音用 240。
  function speechChunks(text, limit) {
    limit = limit || 480;
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return [];
    if (clean.length <= limit) return [clean];
    const parts = [];
    let buf = "";
    const flush = function () {
      const t = buf.trim();
      if (t) parts.push(t);
      buf = "";
    };
    const segs = clean.split(/(?<=[.!?;:])\s+/);
    for (const raw of segs) {
      let s = raw.trim();
      if (!s) continue;
      // 单句超长时按空格硬切，保证每一段都不超过上限（移动端长 utterance 会被引擎截断）
      while (s.length > limit) {
        flush();
        let cut = s.lastIndexOf(" ", limit);
        if (cut < Math.floor(limit * 0.55)) cut = limit;
        parts.push(s.slice(0, cut).trim());
        s = s.slice(cut).trim();
      }
      if (!s) continue;
      if (buf && buf.length + 1 + s.length > limit) flush();
      buf = buf ? buf + " " + s : s;
    }
    flush();
    return parts;
  }

  let speakDelay = null;
  let ttsWatch = null;
  let nativeFailNoted = false;

  /* 朗读状态：页面上方浮出「停止朗读」按钮 */
  function ttsMarkSpeaking(on) {
    try { document.body.classList.toggle("tts-speaking", !!on); } catch (err) {}
  }

  /* 内置离线语音播放中的标记（它不走 speechSynthesis，引擎标志对不上） */
  let builtinActive = false;

  /* 每秒对齐一次朗读标记：个别引擎正常播完却不回调 onend，标志会一直挂着 */
  setInterval(function () {
    if (!document.body.classList.contains("tts-speaking")) return;
    if (builtinActive) return;
    if (onlineActive) return;
    if (ttsWatch != null) return;   // 看守挂起中（启动缓冲/换声间隔），不要在空档里误判
    let idle = false;
    try { idle = !(window.speechSynthesis.speaking || window.speechSynthesis.pending); } catch (err) {}
    if (idle) ttsMarkSpeaking(false);
  }, 1000);

  function ttsStop() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (err) {}
    try { if (window.meSpeak && meSpeak.stop) meSpeak.stop(); } catch (err) {}
    nativeRunToken++;
    onlineToken++;
    onlineActive = false;
    clearOnlineAudio();
    builtinActive = false;
    if (speakDelay) { clearTimeout(speakDelay); speakDelay = null; }
    if (ttsWatch) { clearTimeout(ttsWatch); ttsWatch = null; }
    ttsMarkSpeaking(false);
  }

  /* 切后台/锁屏时清掉朗读：移动端语音引擎在后台会挂起，
     回来后残留的 speaking 状态会让下一次朗读哑掉。 */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) ttsStop();
  });
  window.addEventListener("pagehide", function () { ttsStop(); }, false);

  /* 首次触摸：唤醒系统语音列表，并预加载离线语音。
     移动端系统语音列表常常首帧为空；离线音走 Web Audio，也需要手势解锁。 */
  let ttsGestureReady = false;
  function ttsFirstGesture() {
    if (ttsGestureReady) return;
    ttsGestureReady = true;
    try { unlockOnlineAudio(); } catch (err) {}
    try { refreshNativeVoices(); } catch (err) {}
    try {
      if ("speechSynthesis" in window && window.speechSynthesis.paused) window.speechSynthesis.resume();
    } catch (err) {}
    try { if (IS_MOBILE) initBuiltinTts(); } catch (err) {}
  }
  document.addEventListener("touchstart", ttsFirstGesture, { passive: true });
  document.addEventListener("pointerdown", ttsFirstGesture, { passive: true });
  document.addEventListener("keydown", ttsFirstGesture);

  function speakNative(text) {
    if (!("speechSynthesis" in window)) return false;
    try { refreshNativeVoices(); } catch (err) {}
    const candidates = voiceCandidates();
    if (!candidates.length) return false;
    const synth = window.speechSynthesis;
    let busy = false;
    try { busy = !!(synth.speaking || synth.pending); } catch (err) {}
    if (speakDelay) { clearTimeout(speakDelay); speakDelay = null; }
    if (ttsWatch) { clearTimeout(ttsWatch); ttsWatch = null; }

    const runId = ++nativeRunToken;
    // 移动端单段更短：iOS 对超长 utterance 有中途截断的老问题，短段串播更稳
    const chunks = speechChunks(text, IS_MOBILE ? 200 : 480);
    let voiceIdx = 0;
    let chunkIdx = 0;

    const finish = function () {
      if (runId !== nativeRunToken) return;
      ttsMarkSpeaking(false);
    };

    // 所有候选系统语音都失败后的兜底层：单词在线真人音 / 整句在线人声 / 离线音。
    // 如果已经读了一部分，只把「还没读的」交出去，绝不从开头重来。
    const fallback = function () {
      if (runId !== nativeRunToken) return;
      ttsMarkSpeaking(false);
      const rest = chunkIdx > 0 ? chunks.slice(chunkIdx).join(" ") : text;
      if (!rest) { finish(); return; }
      if (rest !== onlineFailedText && isWordLike(rest) && speakOnline(rest, function () { speakBuiltin(rest); })) {
        if (!nativeFailNoted) {
          nativeFailNoted = true;
          toast("系统语音没出声，单词改用在线真人发音");
        }
        return;
      }
      if (!isWordLike(rest) && speakOnlineSentence(rest, function (more) { speakBuiltin(more || rest); })) {
        if (!nativeFailNoted) {
          nativeFailNoted = true;
          toast(chunkIdx > 0 ? "系统语音中断，剩下的改用在线人声接着读" : "系统语音没出声，整句改用在线人声");
        }
        return;
      }
      if (!nativeFailNoted) {
        nativeFailNoted = true;
        toast(IS_MOBILE
          ? "系统语音没能读出声，暂用离线机械音。想要自然人声：在系统设置里安装英文语音包，或改用 Edge 手机版打开"
          : "系统语音没能读出声，暂用离线机械音。想要自然人声：用 Microsoft Edge 打开本页");
      }
      speakBuiltin(rest);
    };

    const markDead = function (voice) {
      try { deadVoices.add(voice.name || voice.voiceURI || "?"); } catch (err) {}
    };

    let speakChunk = null;
    let voiceRetries = 0;

    const failVoice = function (note) {
      if (runId !== nativeRunToken) return;
      if (ttsWatch) { clearTimeout(ttsWatch); ttsWatch = null; }
      try { synth.cancel(); } catch (err) {}
      try { if (IS_IOS && synth.resume) synth.resume(); } catch (err) {}
      // 同一条语音先原地重试一次：移动端偶发 interrupted / 启动超时很常见，
      // 一次失败就换声会把本来自然的声音过早换成机械音
      if (voiceRetries < 1) {
        voiceRetries++;
        speakDelay = setTimeout(function () {
          if (runId === nativeRunToken) speakChunk();
        }, IS_MOBILE ? 220 : 100);
        return;
      }
      voiceRetries = 0;
      if (candidates[voiceIdx]) markDead(candidates[voiceIdx]);
      voiceIdx++;
      // 已经读过一部分时保留当前位置，换声后接着读，不回头重读
      if (voiceIdx >= candidates.length) { fallback(); return; }
      if (note && !nativeFailNoted) { nativeFailNoted = true; toast(note); }
      speakDelay = setTimeout(function () {
        if (runId === nativeRunToken) speakChunk();
      }, IS_MOBILE ? 80 : 80);
    };

    const finishChunk = function () {
      if (ttsWatch) { clearTimeout(ttsWatch); ttsWatch = null; }
      if (runId !== nativeRunToken) return;
      chunkIdx++;
      if (chunkIdx >= chunks.length) { finish(); return; }
      // 一段一段排队，避免移动端引擎吞并或漏读长队列
      speakDelay = setTimeout(function () {
        if (runId === nativeRunToken) speakChunk();
      }, IS_MOBILE ? 30 : 0);
    };

    speakChunk = function () {
      if (runId !== nativeRunToken) return;
      if (chunkIdx >= chunks.length) { finish(); return; }
      const part = chunks[chunkIdx];
      const voice = candidates[voiceIdx];
      let settled = false;
      let started = false;
      const startAt = Date.now();
      let u;
      try {
        u = new SpeechSynthesisUtterance(part);
        u.voice = voice;
        u.lang = voice.lang || "en-US";
        u.rate = rateBase(part.length);
        u.pitch = 1;
        u.volume = 1;
      } catch (err) {
        // 个别浏览器会拒绝“非本引擎创建”的 voice 对象；退回只设语言再试一次
        try {
          u = new SpeechSynthesisUtterance(part);
          u.lang = (voice && voice.lang) || "en-US";
          u.rate = rateBase(part.length);
          u.pitch = 1;
          u.volume = 1;
        } catch (err2) { failVoice(""); return; }
      }

      const ok = function () {
        if (settled) return;
        settled = true;
        finishChunk();
      };
      const bad = function (note) {
        if (settled) return;
        settled = true;
        failVoice(note || "");
      };

      u.onstart = function () {
        if (settled) return;
        started = true;
        if (ttsWatch) { clearTimeout(ttsWatch); ttsWatch = null; }
        // 开始后仍看守：个别移动端引擎会中途停住且不回调 onend
        const stallCheck = function () {
          if (settled || runId !== nativeRunToken) return;
          let alive = false;
          try { alive = !!(synth.speaking || synth.pending); } catch (err) {}
          if (alive) { ttsWatch = setTimeout(stallCheck, 4000); return; }
          ok();
        };
        ttsWatch = setTimeout(stallCheck, Math.max(6000, Math.round(part.length * 95)));
      };
      u.onend = function () { ok(); };
      u.onerror = function (e) {
        const code = e && e.error ? String(e.error) : "";
        const soft = code === "interrupted" || code === "canceled";
        bad(soft ? "" : "当前朗读声音中断，已换其他语音接着读");
      };

      try { synth.speak(u); } catch (err) { bad(""); return; }
      ttsMarkSpeaking(true);
      // 启动看门狗：首段冷启动慢一些；后续段正常应在两秒内接上
      const firstWait = chunkIdx === 0
        ? (IS_MOBILE ? 7000 : 4800)
        : (IS_MOBILE ? 3500 : 3000);
      const limit = IS_MOBILE ? 15000 : 10000;
      const watchTick = function () {
        if (settled || runId !== nativeRunToken) return;
        if (started) return;
        let alive = false;
        try { alive = !!(synth.speaking || synth.pending); } catch (err) {}
        if (alive && Date.now() - startAt < limit) {
          ttsWatch = setTimeout(watchTick, 2500);
          return;
        }
        bad(IS_MOBILE ? "系统语音启动超时，已换其他语音" : "当前朗读声音没能读出声，已换其他系统语音");
      };
      if (ttsWatch) clearTimeout(ttsWatch);
      ttsWatch = setTimeout(watchTick, firstWait);
    };

    // 先清理上一段；iOS 在 cancel 后立刻 speak 容易丢音，恢复一次引擎并留一小拍
    if (busy) {
      try { synth.cancel(); if (synth.resume) synth.resume(); } catch (err) {}
    }
    const begin = function () {
      if (runId !== nativeRunToken) return;
      chunkIdx = 0;
      speakChunk();
    };
    if (busy) speakDelay = setTimeout(begin, IS_MOBILE ? 60 : 80);
    else begin();
    return true;
  }

  // 朗读前的文本清洗：词条里的 “affect / effect”“and/or” 这类斜杠是给人看的，
  // 交给语音引擎会被读成 “slash”。统一换成逗号停顿，两个词仍分得开。
  // 全角斜杠、分数线也一并处理；其余标点保留，避免改变原句语气。
  function speechText(text) {
    return String(text || "")
      .replace(/\s*[\/／⁄]\s*/g, ", ")
      .replace(/[ \t]+/g, " ")
      .replace(/\s*,\s*,\s*/g, ", ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();
  }

  function speak(text) {
    text = speechText(text);
    if (!text) return;
    // 新的一次朗读先掐掉上一段在线音频，避免两段声音叠在一起；
    // 但保留这个音频元素本身，手机端后续分段还要靠它继续播放
    clearOnlineAudio();
    onlineToken++;
    onlineActive = false;
    try { refreshNativeVoices(); } catch (err) {}
    const mode = (state && TTS_MODES.indexOf(state.ttsMode) !== -1) ? state.ttsMode : "auto";
    const nativeThenBuiltin = function (rest) {
      const remain = (typeof rest === "string" && rest) ? rest : text;
      if (!speakNative(remain)) speakBuiltin(remain);
    };
    if (mode === "builtin") {
      speakBuiltin(text);
      return;
    }
    if (mode === "native") {
      nativeThenBuiltin();
      return;
    }
    // 移动端：系统语音最稳，有英文语音就直接用；只有完全没有系统语音时
    // 才先走在线人声，避免移动网络下每次点读都先等在线首包。
    if (IS_MOBILE && voiceCandidates().length) {
      nativeThenBuiltin();
      return;
    }
    // 自动：没有自然音的环境（360/Chrome/安卓常见）：单词走有道真人，整句/整段走百度在线人声；
    // 都失败再落到系统语音 → 离线音
    if (!hasNaturalVoice()) {
      if (isWordLike(text)) {
        if (speakOnline(text, nativeThenBuiltin)) return;
      } else if (speakOnlineSentence(text, nativeThenBuiltin)) {
        return;
      }
    }
    nativeThenBuiltin();
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

  function mockPapers() {
    return (window.MOCK_PAPERS || []).slice();
  }

  function mockPaper(id) {
    return mockPapers().find(function (p) { return p.id === String(id); }) || null;
  }

  function mockType(key) {
    const types = window.MOCK_TYPES || {};
    return types[key] || types.en2 || {
      key: "en2", label: "英语二", short: "英二", translation: 15,
      writingA: 10, writingB: 15, summary: "", writingWords: "150 以上"
    };
  }

  function emptyExamSelf() {
    return {
      translationPoints: [false, false, false, false, false],
      translationSentences: [0, 0, 0, 0, 0],
      writingA: { content: 0, format: 0, language: 0, accuracy: 0 },
      writingB: { content: 0, structure: 0, language: 0, accuracy: 0 },
      done: false
    };
  }

  function defaultState() {
    return {
      version: 1,
      examDate: defaultExamDate(),
      dailyWords: 30,
      ttsMode: "auto",
      ttsVoice: "",
      ttsRate: "normal",
      cardAutoplay: false,
      lastExportAt: "",
      words: {},
      srs: {},
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
      transSelf: {},
      draftSelf: {},
      trapStats: {},
      examType: "en2",
      examActive: null,
      exams: []
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
    merged.transSelf = plain(raw.transSelf) ? raw.transSelf : {};
    merged.draftSelf = plain(raw.draftSelf) ? raw.draftSelf : {};
    merged.examType = ["en1", "en2"].indexOf(raw.examType) !== -1 ? raw.examType : "en2";
    merged.exams = (Array.isArray(raw.exams) ? raw.exams : []).map(normalizeExamRecord).filter(Boolean).slice(0, 30);
    merged.examActive = normalizeExamActive(raw.examActive);
    // 间隔复习：老版本只存 known/fuzzy，没有到期时间。这里给旧标记补一条
    // “今天到期”，第一次复习后就会按 1/2/4/7/15/30 天进入正常节奏。
    merged.srs = {};
    const rawSrs = plain(raw.srs) ? raw.srs : {};
    Object.keys(rawSrs).forEach(function (w) {
      const src = rawSrs[w];
      if (!plain(src)) return;
      const box = Math.min(6, Math.max(0, Math.floor(Number(src.box) || 0)));
      const due = /^\d{4}-\d{2}-\d{2}$/.test(src.due) ? src.due : todayKey();
      merged.srs[w] = {
        box: box,
        due: due,
        last: /^\d{4}-\d{2}-\d{2}$/.test(src.last) ? src.last : "",
        seen: Math.max(0, Math.floor(Number(src.seen) || 0)),
        ok: Math.max(0, Math.floor(Number(src.ok) || 0))
      };
    });
    Object.keys(merged.words).forEach(function (w) {
      if (merged.srs[w] || !WORD_MAP.has(w)) return;
      if (merged.words[w] !== "known" && merged.words[w] !== "fuzzy") return;
      merged.srs[w] = { box: 0, due: todayKey(), last: "", seen: 0, ok: 0 };
    });
    merged.notebook.forEach(function (w) {
      if (merged.srs[w] || !WORD_MAP.has(w)) return;
      merged.srs[w] = { box: 0, due: todayKey(), last: "", seen: 0, ok: 0 };
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
    merged.ttsVoice = typeof merged.ttsVoice === "string" ? merged.ttsVoice.slice(0, 160) : "";
    merged.ttsRate = ["slow", "normal", "fast"].indexOf(merged.ttsRate) !== -1 ? merged.ttsRate : "normal";
    merged.cardAutoplay = !!merged.cardAutoplay;
    merged.lastExportAt = typeof raw.lastExportAt === "string" && isFinite(Date.parse(raw.lastExportAt))
      ? new Date(raw.lastExportAt).toISOString()
      : "";
    return merged;
  }

  function loadState() {
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (err) { raw = null; }
    return normalizeState(raw);
  }

  /* Exam constants must exist before the first normalizeState() call. */
  const EXAM_TIME = 180 * 60;
  const EXAM_CLOZE_COUNT = 20;
  const EXAM_READING_COUNT = 20;
  const EXAM_NEWTYPE_COUNT = 5;
  const EXAM_OBJECTIVE_COUNT = EXAM_CLOZE_COUNT + EXAM_READING_COUNT + EXAM_NEWTYPE_COUNT;

  const WRITING_A_DIMS = [
    { key: "content", label: "内容与信息点", max: 5, hint: "称呼、目的、细节、请求是否齐全" },
    { key: "format", label: "格式与语气", max: 2, hint: "称呼、结尾、署名；语气是否得体" },
    { key: "language", label: "语言与句式", max: 2, hint: "句子是否通顺，是否有可读的复杂句" },
    { key: "accuracy", label: "语法与拼写", max: 1, hint: "主谓一致、时态、拼写" }
  ];

  const state = loadState();
  let deferredInstallPrompt = null;

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
  });
  window.addEventListener("appinstalled", function () {
    deferredInstallPrompt = null;
    toast("已安装到桌面");
  });

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

  /* 间隔复习（Leitner 简化版）：认识一次升一档，模糊回到底档明天再见，
     不认识留在今天。档位对应 1 / 2 / 4 / 7 / 15 / 30 天，足够覆盖考研周期，
     又不会像 SM-2 那样让参数和界面变得难懂。 */
  const SRS_INTERVALS = [1, 2, 4, 7, 15, 30];

  function srsOf(w) {
    return state.srs && state.srs[w] ? state.srs[w] : null;
  }

  function srsDue(w) {
    const e = srsOf(w);
    return !!(e && e.due && e.due <= todayKey());
  }

  function dueWords() {
    return ALL_WORDS.filter(function (w) { return srsDue(w.w); }).sort(function (a, b) {
      const ea = srsOf(a.w), eb = srsOf(b.w);
      return String(ea.due).localeCompare(String(eb.due))
        || (Number(ea.box) || 0) - (Number(eb.box) || 0)
        || a.w.localeCompare(b.w);
    });
  }

  function dueCount() {
    return dueWords().length;
  }

  function srsNextText(w) {
    const e = srsOf(w);
    if (!e || !e.due) return "";
    const d = daysUntil(e.due);
    if (d <= 0) return "今天到期";
    if (d === 1) return "明天复习";
    return d + " 天后复习";
  }

  function srsGrade(w, status) {
    if (!state.srs) state.srs = {};
    const e = state.srs[w] || { box: 0, due: todayKey(), last: "", seen: 0, ok: 0 };
    e.seen = (Number(e.seen) || 0) + 1;
    e.last = todayKey();
    if (status === "known") {
      e.ok = (Number(e.ok) || 0) + 1;
      e.box = Math.min(SRS_INTERVALS.length, (Number(e.box) || 0) + 1);
      e.due = ymd(addDays(new Date(), SRS_INTERVALS[e.box - 1]));
    } else if (status === "fuzzy") {
      e.box = 0;
      e.due = ymd(addDays(new Date(), 1));
    } else {
      e.box = 0;
      e.due = todayKey();
    }
    state.srs[w] = e;
  }

  function wordStatus(w) {
    if (state.words[w] === "known") return { key: "known", label: "已掌握", cls: "known" };
    if (state.words[w] === "fuzzy") return { key: "fuzzy", label: "待巩固", cls: "fuzzy" };
    if (state.notebook.indexOf(w) !== -1) return { key: "new", label: "生词", cls: "new" };
    return { key: "", label: "", cls: "" };
  }

  function setWordStatus(w, status) {
    if (status) {
      state.words[w] = status;
      srsGrade(w, status);
    } else {
      delete state.words[w];
    }
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
      if (!state.srs[w]) state.srs[w] = { box: 0, due: todayKey(), last: "", seen: 0, ok: 0 };
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
    if (ui.vocabTag === "待复习") {
      list = dueWords();
    } else if (ui.vocabTag === "生词本") {
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
    reviewDeck: null,
    spell: null,
    listen: null,
    dictation: null,
    drawerWord: null,
    drawerList: [],
    drawerReturnFocus: null,
    drawerFocusPending: false,
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
    transPassage: 1,
    meTab: "summary",
    redo: {},
    reviewed: {},
    searchTimer: null,
    examSection: "cloze",
    examReading: 0,
    examJumpQ: null,
    examSubmitting: false,
    examReviewAll: false,
    examResultSection: "cloze"
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
    return `<p class="footer-note"><span>研墨 · 考研英语 · v${APP_BUILD}</span><span>篇目与例句为原创仿真材料，供备考练习使用</span></p>`;
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
    exam: "全真模考", plan: "真题与规划", me: "我的记录"
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
    const due = dueCount();
    const done = day.tasks.filter(Boolean).length;
    const phase = phaseInfo();
    const quote = (window.SENTENCES && SENTENCES.length) ? SENTENCES[(Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)) % SENTENCES.length] : null;
    const week = weekSeries();
    const maxMin = Math.max(1, Math.max.apply(null, week.map(function (x) { return x.minutes; })));
    const weekTotal = week.reduce(function (s, x) { return s + x.minutes; }, 0);

    const taskRows = TASKS.map(function (t, i) {
      const isDone = !!day.tasks[i];
      const label = t.key === "vocab" ? "词汇 " + state.dailyWords + " 个" : t.t;
      const sub = t.key === "vocab"
        ? (due ? due + " 词到期，先复习再背新词" : "先过一遍词表，再逐张标记")
        : t.s;
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
              <a class="quick-item" href="#/vocab"><span>复习到期词</span><span>${due ? due + " 词 →" : "已清空 →"}</span></a>
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

          ${homeFocusPanel()}

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
      else if (t.v === "待复习") count = dueCount();
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
    const due = dueCount();
    const detailed = ALL_WORDS.filter(function (w) { return hasDetail(w); }).length;
    const detailReady = !!window.VOCAB_DETAIL;
    return `
      ${pageHead("02", "词汇", "词汇", "大纲词很多，真正反复考的只是一部分。先把高频义项和搭配吃透，再谈遍数。")}

      <div class="stat-strip">
        <div class="stat"><p class="k">词库</p><p class="v">${ALL_WORDS.length}<small>词</small></p><p class="s">${!detailReady ? "词条详解加载中" : (detailed === ALL_WORDS.length ? "全部带用法卡" : detailed + " 精讲 · " + (ALL_WORDS.length - detailed) + " 待补")}</p></div>
        <div class="stat"><p class="k">已掌握</p><p class="v">${knownCount()}<small>词</small></p><p class="s">标记为“认识”</p></div>
        <div class="stat"><p class="k">生词本</p><p class="v">${state.notebook.length}<small>词</small></p><p class="s">${due ? due + " 词今日到期" : "今天没有到期词"}</p></div>
        <div class="stat"><p class="k">今日已过</p><p class="v">${day.words}<small>/ ${state.dailyWords}</small></p><p class="s">目标 ${state.dailyWords} 词</p></div>
      </div>

      <div class="review-banner ${due ? "" : "quiet"}">
        <div class="review-copy">
          <p class="label">间隔复习</p>
          <p>${due
            ? `<b>${due} 词</b>今天到期。按 1 / 2 / 4 / 7 / 15 / 30 天递进：认识就往后推，模糊明天再来，不认识留在今天。`
            : "今天到期的词已经清空。按节奏复习，比一次背很多更有用。"}</p>
        </div>
        ${due ? `<button class="btn btn-solid" data-action="start-review">开始复习</button>` : ""}
      </div>

      ${reviewForecastLine()}

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
          <button class="${ui.vocabMode === "listen" ? "on" : ""}" data-action="set-mode" data-mode="listen">听音</button>
          <button class="${ui.vocabMode === "dictation" ? "on" : ""}" data-action="set-mode" data-mode="dictation">听写</button>
        </div>
      </div>

      <div id="vocabBody">${vocabBody(list)}</div>`;
  }

  // 复习模式用一份固定牌堆：给词打分后到期时间会变，如果每次都重新过滤，
  // 刚评完的词会从列表里消失，下一张就会被跳过。每轮最多 30 词，做完可再来一轮。
  function cardList() {
    if (ui.vocabTag !== "待复习") return filteredWords();
    if (!ui.reviewDeck) ui.reviewDeck = dueWords().slice(0, 30);
    return ui.reviewDeck;
  }

  function vocabBody(list) {
    if (ui.vocabMode === "card") return cardBody(cardList());
    if (ui.vocabMode === "spell") return spellBody();
    if (ui.vocabMode === "listen") return listenBody();
    if (ui.vocabMode === "dictation") return dictateBody();
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
      const isReview = ui.vocabTag === "待复习";
      const remain = dueCount();
      return `<div class="study-wrap">
        <div class="summary">
          <p class="eyebrow" style="justify-content:center">本轮完成</p>
          <p class="big">${s.graded}</p>
          <h2>${isReview ? "这组复习完成" : "这一轮过完了"}</h2>
          <p>认识 ${s.known} · 模糊 ${s.fuzzy} · 不认识 ${s.unknown}</p>
          <p>${isReview
            ? (remain ? `今天还有 ${remain} 词到期，可以再来一组。` : "今天到期的词已经全部过完。")
            : "卡片分组会按 1 / 2 / 4 / 7 / 15 / 30 天的节奏安排下次复习。"}</p>
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
      <p class="flash-tips">${st.label ? "当前标记：" + st.label + " · " : ""}${srsNextText(w.w) ? "下次复习：" + srsNextText(w.w) + " · " : ""}键盘：空格翻面，1 / 2 / 3 选择</p>
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

  /* 听音选义：先听发音，再从四个释义里选一个 */
  function buildListen() {
    const pool = filteredWords().filter(function (w) { return w.tag !== "易混" && String(w.cn || "").trim(); });
    const deck = pool.slice();
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    const items = deck.slice(0, Math.min(10, deck.length)).map(function (w) {
      const own = String(w.cn).trim();
      const opts = [{ cn: own, w: w.w }];
      let guard = 0;
      while (opts.length < 4 && guard < 400 && pool.length > 4) {
        guard++;
        const cand = pool[Math.floor(Math.random() * pool.length)];
        const cn = String(cand.cn || "").trim();
        if (!cn || cn === own) continue;
        if (opts.some(function (o) { return o.cn === cn; })) continue;
        opts.push({ cn: cn, w: cand.w });
      }
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
      return { word: w, options: opts, picked: -1, ok: false };
    });
    ui.listen = { items: items, i: 0, score: 0 };
  }

  function listenBody() {
    if (!ui.listen) buildListen();
    const ls = ui.listen;
    if (!ls || !ls.items.length) {
      return `<div class="empty"><p class="mark">空</p><p>这个分类里没有可听的词条，换个分类试试。</p><div class="actions"><button class="btn btn-quiet" data-action="set-mode" data-mode="list">返回词表</button></div></div>`;
    }
    if (ls.i >= ls.items.length) {
      const total = ls.items.length;
      return `<div class="study-wrap"><div class="summary">
        <p class="eyebrow" style="justify-content:center">听音选义</p>
        <p class="big">${ls.score} <small style="font-size:18px;color:var(--muted)">/ ${total}</small></p>
        <h2>${ls.score >= Math.ceil(total * 0.8) ? "耳朵跟得上" : "再听一组"}</h2>
        <p>选错的词已记为“模糊”并加入生词本，回去再看一眼词条。</p>
        <div class="actions"><button class="btn btn-solid" data-action="listen-restart">再来一组</button><button class="btn btn-quiet" data-action="set-mode" data-mode="list">回到词表</button></div>
      </div></div>`;
    }
    const it = ls.items[ls.i];
    const w = it.word;
    const answered = it.picked >= 0;
    return `<div class="study-wrap">
      <div class="study-top">
        <span>听音选义</span>
        <div class="progress"><span style="width:${Math.round((ls.i + 1) / ls.items.length * 100)}%"></span></div>
        <span>${ls.i + 1} / ${ls.items.length}</span>
      </div>
      <div class="listen-card">
        <p class="eyebrow" style="justify-content:center">先听发音，再选最接近的释义</p>
        <button class="btn btn-solid listen-play" data-action="listen-play">${answered ? "再听一遍" : "播放发音"}</button>
        <div class="listen-options">
          ${it.options.map(function (o, oi) {
            let cls = "";
            if (answered) cls = o.w === w.w ? " ok" : (oi === it.picked ? " no" : "");
            return `<button class="listen-option${cls}" data-action="listen-pick" data-i="${oi}" ${answered ? "disabled" : ""}>${esc(o.cn)}</button>`;
          }).join("")}
        </div>
        ${answered ? `<div class="listen-answer ${it.ok ? "ok" : "no"}">${it.ok ? "正确" : "正确答案"}：<b>${esc(w.w)}</b>${detailPh(w) ? " /" + esc(detailPh(w)) + "/" : ""} · ${esc(w.cn)}</div>` : ""}
      </div>
      <div class="flash-actions">
        ${answered ? `<button class="btn btn-solid" data-action="listen-next">${ls.i + 1 >= ls.items.length ? "查看结果" : "下一题"}</button>` : ""}
      </div>
      <p class="flash-tips">选错会自动记为“模糊”并进生词本。空格键可以重听。</p>
    </div>`;
  }

  /* 听写：听发音，写出单词，逐字母标出差异 */
  function buildDictation() {
    const pool = filteredWords().filter(function (w) {
      return w.tag !== "易混" && /^[A-Za-z][A-Za-z'’-]*$/.test(String(w.w || "").trim());
    });
    const deck = pool.slice();
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    ui.dictation = {
      items: deck.slice(0, Math.min(10, deck.length)),
      i: 0,
      value: "",
      checked: false,
      ok: false,
      score: 0
    };
  }

  function dictationDiff(typed, answer) {
    const a = String(answer || "").split("");
    const t = String(typed || "").split("");
    const max = Math.max(a.length, t.length);
    let answerHtml = "";
    let typedHtml = "";
    for (let i = 0; i < max; i++) {
      const ac = a[i];
      const tc = t[i];
      const same = ac != null && tc != null && tc.toLowerCase() === ac.toLowerCase();
      if (ac != null) answerHtml += `<span class="dch ${same ? "ok" : "no"}">${esc(ac)}</span>`;
      if (tc != null) typedHtml += `<span class="dch ${same ? "ok" : "no"}">${esc(tc)}</span>`;
    }
    return { answerHtml: answerHtml, typedHtml: typedHtml };
  }

  function dictateBody() {
    if (!ui.dictation) buildDictation();
    const dt = ui.dictation;
    if (!dt.items.length) {
      return `<div class="empty"><p class="mark">空</p><p>这个分类里没有可听写的单词（词组与易混词不参与听写）。</p><div class="actions"><button class="btn btn-quiet" data-action="set-mode" data-mode="list">返回词表</button></div></div>`;
    }
    if (dt.i >= dt.items.length) {
      return `<div class="study-wrap"><div class="summary">
        <p class="eyebrow" style="justify-content:center">听写测试</p>
        <p class="big">${dt.score} <small style="font-size:18px;color:var(--muted)">/ ${dt.items.length}</small></p>
        <h2>${dt.score >= Math.ceil(dt.items.length * 0.8) ? "拼得很稳" : "再听一组"}</h2>
        <p>写错的词已记为“模糊”并进生词本，听音时再回来过一遍。</p>
        <div class="actions"><button class="btn btn-solid" data-action="dictate-restart">再来一组</button><button class="btn btn-quiet" data-action="set-mode" data-mode="list">回到词表</button></div>
      </div></div>`;
    }
    const w = dt.items[dt.i];
    const diff = dt.checked && !dt.ok ? dictationDiff(dt.value, w.w) : null;
    return `<div class="study-wrap"><div class="spell-card dictate-card">
      <div class="study-top"><span>听写测试</span><span>${dt.i + 1} / ${dt.items.length}</span><span>得分 ${dt.score}</span></div>
      <p class="eyebrow" style="margin-top:22px">先听发音，再写出单词</p>
      <div class="dictate-play-row">
        <button class="btn btn-solid dictate-play" data-action="dictate-play">${dt.checked ? "再听一遍" : "播放发音"}</button>
      </div>
      <p class="spell-meta">${esc(w.pos || "")}${dt.checked ? " · " + esc(w.cn) : ""}</p>
      <input class="spell-input" id="dictateInput" data-dictate-input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" value="${esc(dt.value)}" placeholder="输入英文" ${dt.checked ? "disabled" : ""}>
      <div class="spell-actions">
        ${dt.checked
          ? `<button class="btn btn-solid" data-action="dictate-next">${dt.i + 1 >= dt.items.length ? "查看结果" : "下一题"}</button>`
          : `<button class="btn btn-solid" data-action="dictate-check">检查</button><button class="btn btn-quiet" data-action="dictate-reveal">不会，看答案</button>`}
      </div>
      <div class="spell-feedback ${dt.checked ? (dt.ok ? "ok" : "no") : ""}">
        ${dt.checked ? (dt.ok ? "正确。" : "还差一点。") : ""}
      </div>
      ${diff ? `<div class="dictation-diff">
        <div class="diff-row"><span class="diff-k">你的</span><span class="diff-letters">${diff.typedHtml}</span></div>
        <div class="diff-row"><span class="diff-k">正确</span><span class="diff-letters">${diff.answerHtml}</span></div>
      </div>` : ""}
      ${dt.checked && w.ex ? `<p class="flash-ex" style="margin-top:6px">${esc(w.ex)}<small>${esc(w.exCn || "")}</small></p>` : ""}
    </div>
    <p class="flash-tips">听不清就按“再听一遍”；检查后错处会逐字母标出。回车检查 / 下一题。</p></div>`;
  }

  function focusDictation() {
    if (getRoute().name !== "vocab" || ui.vocabMode !== "dictation" || ui.drawerWord) return;
    const el = $("#dictateInput");
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
          <h2 id="drawerTitle" class="${longClass}">${esc(w.w)}</h2>
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
        ${ex ? `<div class="drawer-ex"><p class="block-k">例句</p><p class="en">${esc(ex)} <button class="text-link" data-action="speak" data-text="${esc(ex)}">朗读例句</button></p><p class="cn">${esc(exCn || "")}</p></div>` : ""}
        ${syn.length ? `<div class="drawer-block"><p class="block-k">近义</p><p class="drawer-syn">${syn.map(function (s) { return `<span>${esc(s)}</span>`; }).join("")}</p></div>` : ""}
        ${family.length ? `<div class="drawer-block"><p class="block-k">词族</p><p class="drawer-syn">${family.map(function (s) { return `<span>${esc(s)}</span>`; }).join("")}</p></div>` : ""}
        ${memo ? `<div class="drawer-block"><p class="block-k">记忆</p><p class="block-text">${esc(memo)}</p></div>` : ""}
        ${deep ? `<div class="drawer-block drawer-deep"><p class="block-k">辨析</p><p class="block-text">${esc(deep)}</p></div>` : ""}
        <dl class="drawer-facts">
          <div class="row"><dt>状态</dt><dd>${st.label || "尚未标记"}${inBook ? " · 已在生词本" : ""}</dd></div>
          ${srsNextText(w.w) ? `<div class="row"><dt>下次复习</dt><dd>${srsNextText(w.w)}</dd></div>` : ""}
        </dl>
        <button class="btn btn-sm ${inBook ? "btn-quiet" : "btn-accent"}" data-action="word-toggle-notebook" data-w="${esc(w.w)}" style="margin-top:18px">${inBook ? "移出生词本" : "加入生词本"}</button>
        <p class="drawer-status">${inBook ? "生词本会自动收录“不认识”和“模糊”的词。" : ""}</p>
        <div class="drawer-nav">
          <button class="btn btn-sm btn-quiet" data-action="drawer-prev" ${idx <= 0 ? "disabled" : ""}>上一条</button>
          <button class="btn btn-sm btn-quiet" data-action="drawer-next" ${idx === -1 || idx >= ui.drawerList.length - 1 ? "disabled" : ""}>下一条</button>
        </div>
      </div>`;
    drawer.classList.add("open");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", "drawerTitle");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    drawer.scrollTop = 0;
    if (ui.drawerFocusPending) {
      ui.drawerFocusPending = false;
      const close = drawer.querySelector('[data-action="close-drawer"]');
      if (close) {
        try { close.focus({ preventScroll: true }); } catch (err) { close.focus(); }
      }
    }
  }

  function openWord(word) {
    if (!WORD_MAP.has(word)) return;
    if (!ui.drawerWord) {
      const active = document.activeElement;
      ui.drawerReturnFocus = active && active !== document.body ? active : null;
      ui.drawerFocusPending = true;
    }
    ui.drawerWord = word;
    const route = getRoute();
    if (route.name === "me") ui.drawerList = notebookWords();
    else if (route.name === "vocab") ui.drawerList = filteredWords();
    else ui.drawerList = ALL_WORDS;
    if (!ui.drawerList.some(function (x) { return x.w === word; })) ui.drawerList = ALL_WORDS;
    renderDrawer();
  }

  function closeDrawer(restoreFocus) {
    const drawer = $("#drawer");
    const backdrop = $("#backdrop");
    const returnFocus = ui.drawerReturnFocus;
    ui.drawerWord = null;
    ui.drawerReturnFocus = null;
    ui.drawerFocusPending = false;
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      drawer.setAttribute("aria-modal", "false");
    }
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = "";
    if (restoreFocus !== false && returnFocus && returnFocus.isConnected) {
      setTimeout(function () {
        try { returnFocus.focus({ preventScroll: true }); } catch (err) { returnFocus.focus(); }
      }, 0);
    }
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
      case "exam":
        if (route.param === "run") html = pageExamRun();
        else if (route.param === "result") html = pageExamResult(route.sub);
        else html = pageExam();
        break;
      case "plan": html = pagePlan(); break;
      case "me": html = pageMe(); break;
      default: html = pageHome();
    }

    $("#main").innerHTML = html + footerNote();
    document.body.classList.toggle("exam-run-mode", route.name === "exam" && route.param === "run");
    $$("[data-nav]").forEach(function (a) {
      const on = a.getAttribute("data-nav") === route.name;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const mobileMore = document.querySelector(".mobile-more");
    if (mobileMore) {
      const moreOn = ["sentences", "cloze", "translation", "writing", "plan"].indexOf(route.name) !== -1;
      mobileMore.open = false;
      mobileMore.classList.toggle("active", moreOn);
      const summary = mobileMore.querySelector("summary");
      if (summary) {
        if (moreOn) summary.setAttribute("aria-current", "page");
        else summary.removeAttribute("aria-current");
      }
    }
    updateSidebar();
    document.title = (PAGE_TITLES[route.name] || "研墨") + " · 研墨";

    if (opt.keepScroll) window.scrollTo(0, scrollY);
    else window.scrollTo(0, 0);

    if (opt.routeChange) {
      const main = $("#main");
      if (main) {
        try { main.focus({ preventScroll: true }); } catch (err) { main.focus(); }
      }
    }
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
    if (route.name === "vocab" && ui.vocabMode === "dictation") {
      setTimeout(focusDictation, 30);
    }
    if (route.name === "exam" && route.param === "run" && state.examActive) {
      if (examRemaining() <= 0) {
        setTimeout(function () { finishExam(true); }, 30);
      } else if (ui.examJumpQ != null) {
        const target = document.getElementById("exam-q-" + ui.examJumpQ);
        ui.examJumpQ = null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("focus-question");
          setTimeout(function () { target.classList.remove("focus-question"); }, 1800);
        }
      }
    }
    if (route.name === "me") refreshStorageInfo();
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

  /* ------------------------------------------------------------------
     learning loop 2.0：诊断 / 掌握度 / 自适应任务 / 复习排期
  ------------------------------------------------------------------ */

  function masteryNum(v) {
    if (v == null || !Number.isFinite(Number(v))) return "—";
    const n = Math.max(0, Math.min(100, Number(v)));
    if (n > 0 && n < 1) return "<1";
    return String(Math.round(n));
  }

  function masteryStatus(v) {
    if (v == null) return { label: "待建立", cls: "empty" };
    if (v >= 80) return { label: "稳定", cls: "solid" };
    if (v >= 65) return { label: "接近稳定", cls: "steady" };
    if (v >= 45) return { label: "建立中", cls: "building" };
    return { label: "薄弱", cls: "weak" };
  }

  function learningModule(key, label, weight, mastery, samples, reliable, evidence, advice, href, extra) {
    const value = mastery == null ? null : Math.max(0, Math.min(100, Number(mastery)));
    const status = masteryStatus(value);
    return {
      key: key,
      label: label,
      weight: weight,
      mastery: value,
      samples: Math.max(0, Number(samples) || 0),
      reliable: !!reliable,
      evidence: evidence || "",
      advice: advice || "",
      href: href || "#/home",
      assessed: value != null,
      status: status.label,
      cls: status.cls,
      extra: extra || {}
    };
  }

  function readingFocusInfo(rd) {
    const focus = rd.focus;
    const target = rd.target;
    let kicker = "保持手感";
    let title = "限时阅读一篇";
    let copy = "题型正确率与依据定位都稳定。下一步限时做一篇，把速度压到 18 分钟内。";
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
    return {
      kicker: kicker,
      title: title,
      copy: copy,
      href: target ? "#/reading/" + target.r.id + "/" + (target.qi + 1) : "#/reading",
      target: target
    };
  }

  function learningDiagnosis() {
    const modules = [];
    const due = dueCount();
    const doneExams = (state.exams || []).filter(function (r) { return r.self && r.self.done; });

    /* 词汇：掌握度按“已掌握词 / 词库总量”计算，避免把“背过”误当成“掌握”。
       复习准确率与到期量放在依据里，帮助判断是覆盖不足还是遗忘太多。 */
    const vocabTracked = Object.keys(state.srs || {}).filter(function (w) { return WORD_MAP.has(w); }).length;
    const vocabKnown = knownCount();
    const vocabFuzzy = Object.keys(state.words || {}).filter(function (w) { return state.words[w] === "fuzzy"; }).length;
    const vocabAssessed = vocabTracked > 0 || vocabKnown > 0 || vocabFuzzy > 0;
    const vocabMastery = vocabAssessed ? vocabKnown / Math.max(1, ALL_WORDS.length) * 100 : null;
    modules.push(learningModule(
      "vocab", "词汇", 20, vocabMastery, vocabTracked, vocabTracked >= 10,
      vocabAssessed
        ? "已掌握 " + vocabKnown + " / " + ALL_WORDS.length + " · 待巩固 " + vocabFuzzy + " · 到期 " + due
        : "还没有词汇标记",
      due
        ? "今天有 " + due + " 个词到期，先清复习再背新词。"
        : "今天没有到期词，可以推进新词，并优先标记模糊词。",
      "#/vocab",
      { known: vocabKnown, fuzzy: vocabFuzzy, due: due }
    ));

    /* 阅读：正确率、依据定位、真会比例三项加权。没有依据数据时只看正确率，
       并降低“真会”的权重，避免把蒙对算成掌握。 */
    const rd = readingDiagnosis();
    if (rd.answered) {
      const accuracy = rd.correct / rd.answered;
      const quality = rd.quality.trueMastery / rd.answered;
      const locate = rd.locateRate == null ? null : rd.locateRate / 100;
      const score = locate == null
        ? accuracy * 0.75 + quality * 0.25
        : accuracy * 0.55 + locate * 0.25 + quality * 0.20;
      const focus = readingFocusInfo(rd);
      modules.push(learningModule(
        "reading", "阅读", 24, score * 100, rd.answered, rd.answered >= 5,
        rd.submitted + " 篇 · " + rd.correct + "/" + rd.answered + " 题 · 依据 " + (rd.locateRate == null ? "未标" : rd.locateRate + "%") + (rd.answered < 5 ? " · 样本少" : ""),
        focus.copy,
        focus.href,
        { focusKicker: focus.kicker, focusTitle: focus.title, focusCopy: focus.copy }
      ));
    } else {
      modules.push(learningModule(
        "reading", "阅读", 24, null, 0, false, "还没有提交阅读",
        "先做一篇阅读，提交后建立题型与依据诊断。", "#/reading/1",
        { focusKicker: "建立基线", focusTitle: "先做一篇阅读", focusCopy: "提交后这里会给出题型、用时与依据定位诊断。" }
      ));
    }

    /* 完形：按已提交套数的总空数合并，避免只做一套就波动。 */
    let clozeDone = 0;
    let clozeRight = 0;
    let clozeTotal = 0;
    clozeSets().forEach(function (set, i) {
      const st = state.clozes && state.clozes[i];
      if (!st || !st.submitted) return;
      const total = set.items.length;
      clozeDone++;
      clozeTotal += total;
      clozeRight += Math.max(0, Math.min(total, Number(st.score) || 0));
    });
    const clozeMastery = clozeTotal ? clozeRight / clozeTotal * 100 : null;
    modules.push(learningModule(
      "cloze", "完形", 10, clozeMastery, clozeTotal, clozeDone >= 2,
      clozeTotal ? clozeDone + " 套 · " + clozeRight + "/" + clozeTotal + " 空" : "还没有提交完形",
      clozeMastery == null
        ? "先做一套完形，提交后建立正确率基线。"
        : (clozeMastery < 60
          ? "错空多集中在搭配和逻辑关系。先回看错题空的前后句，再重做一套。"
          : "正确率稳定，保持每套限时 15 分钟，重点看逻辑衔接。"),
      "#/cloze/cloze",
      { done: clozeDone }
    ));

    /* 新题型：七选五、排序、小标题合并统计，同时找出最弱一类。 */
    const ntGroups = [
      { key: "seven", label: "七选五", sets: sevenSets(), states: state.sevens, href: "#/cloze/seven" },
      { key: "order", label: "排序", sets: orderSets(), states: state.orders, href: "#/cloze/order" },
      { key: "heading", label: "小标题", sets: headingSets(), states: state.headings, href: "#/cloze/heading" }
    ];
    let ntDone = 0;
    let ntRight = 0;
    let ntTotal = 0;
    const ntRates = [];
    ntGroups.forEach(function (g) {
      let gd = 0;
      let gr = 0;
      let gt = 0;
      g.sets.forEach(function (set, i) {
        const st = g.states && g.states[i];
        if (!st || !st.submitted) return;
        const total = set.answers.length;
        gd++;
        gt += total;
        gr += Math.max(0, Math.min(total, Number(st.score) || 0));
      });
      if (gt) {
        ntRates.push({ key: g.key, label: g.label, href: g.href, done: gd, right: gr, total: gt, rate: gr / gt });
        ntDone += gd;
        ntRight += gr;
        ntTotal += gt;
      }
    });
    ntRates.sort(function (a, b) { return a.rate - b.rate || b.total - a.total; });
    const ntWeak = ntRates[0] || null;
    const ntMastery = ntTotal ? ntRight / ntTotal * 100 : null;
    modules.push(learningModule(
      "newtype", "新题型", 10, ntMastery, ntTotal, ntDone >= 2,
      ntTotal ? ntDone + " 套 · " + ntRight + "/" + ntTotal + " 题" + (ntWeak ? " · 最弱 " + ntWeak.label : "") : "还没有提交新题型",
      ntMastery == null
        ? "先做一套七选五，提交后建立新题型基线。"
        : (ntWeak
          ? ntWeak.label + "正确率 " + Math.round(ntWeak.rate * 100) + "%，先练这一类。"
          : "新题型正确率稳定，保持每套限时 12 分钟。"),
      ntWeak ? ntWeak.href : "#/cloze/seven",
      { weakLabel: ntWeak ? ntWeak.label : "", weakRate: ntWeak ? ntWeak.rate : null }
    ));

    /* 翻译：只认采分点自评与模考翻译分，不用“写了多少字”冒充掌握度。 */
    let transSamples = 0;
    let transRatio = 0;
    let transPoints = 0;
    let transPointsRight = 0;
    let transPractice = 0;
    let transExam = 0;
    Object.keys(state.transSelf || {}).forEach(function (key) {
      const entry = transEntryByKey(key);
      const points = (entry && entry.points) || [];
      const checks = state.transSelf[key];
      if (!points.length || !Array.isArray(checks)) return;
      const right = checks.filter(Boolean).length;
      if (!right) return;
      transSamples++;
      transPractice++;
      transRatio += right / points.length;
      transPoints += points.length;
      transPointsRight += right;
    });
    doneExams.forEach(function (rec) {
      const paper = mockPaper(rec.paperId);
      if (!paper) return;
      const max = Number(mockType(paper.type).translation) || 0;
      if (!max) return;
      const value = Math.max(0, Math.min(max, Number(rec.sections && rec.sections.translation) || 0));
      transSamples++;
      transExam++;
      transRatio += value / max;
    });
    const transMastery = transSamples ? transRatio / transSamples * 100 : null;
    const transHref = state.examType === "en1" ? "#/translation/sentence" : "#/translation/passage";
    modules.push(learningModule(
      "translation", "翻译", 12, transMastery, transSamples, transSamples >= 2,
      transSamples
        ? transSamples + " 次自评" + (transPractice ? " · 采分点 " + transPointsRight + "/" + transPoints : "") + (transExam ? " · 含模考 " + transExam + " 次" : "")
        : "还没有翻译自评",
      transMastery == null
        ? "先译一段并勾选采分点，系统才能建立翻译诊断。"
        : (transMastery < 60
          ? "采分点覆盖不足。先自己译，再逐点核对，最后对照参考译文。"
          : "采分点覆盖稳定，下一步压缩表达，避免逐词硬译。"),
      transHref,
      { practice: transPractice, exam: transExam, points: transPoints, pointsRight: transPointsRight }
    ));

    /* 写作：练习自评与模考写作分合并，未自评的草稿单独提示。 */
    let writingSamples = 0;
    let writingRatio = 0;
    let writingPractice = 0;
    let writingExam = 0;
    Object.keys(state.draftSelf || {}).forEach(function (key) {
      const src = state.draftSelf[key];
      if (!src || typeof src !== "object") return;
      const kind = key.indexOf("small-") === 0 ? "small" : "big";
      const dims = draftSelfDims(kind);
      const max = dims.reduce(function (s, d) { return s + d.max; }, 0);
      const got = dims.reduce(function (s, d) {
        return s + Math.max(0, Math.min(d.max, Number(src[d.key]) || 0));
      }, 0);
      if (!got) return;
      writingSamples++;
      writingPractice++;
      writingRatio += got / max;
    });
    doneExams.forEach(function (rec) {
      const paper = mockPaper(rec.paperId);
      if (!paper) return;
      const aMax = 10;
      const bDims = writingBDims(paper);
      const bMax = bDims.reduce(function (s, d) { return s + d.max; }, 0);
      const a = Math.max(0, Math.min(aMax, Number(rec.sections && rec.sections.writingA) || 0));
      const b = Math.max(0, Math.min(bMax, Number(rec.sections && rec.sections.writingB) || 0));
      if (!a && !b) return;
      writingSamples++;
      writingExam++;
      writingRatio += (a + b) / (aMax + bMax);
    });
    const draftCount = Object.keys(state.drafts || {}).length;
    const writingUnscored = Math.max(0, draftCount - writingPractice);
    const writingMastery = writingSamples ? writingRatio / writingSamples * 100 : null;
    modules.push(learningModule(
      "writing", "写作", 12, writingMastery, writingSamples, writingSamples >= 2,
      writingSamples
        ? writingSamples + " 次自评" + (writingPractice ? " · 练习 " + writingPractice + " 篇" : "") + (writingExam ? " · 含模考 " + writingExam + " 次" : "") + (writingUnscored ? " · " + writingUnscored + " 篇未自评" : "")
        : (draftCount ? "有 " + draftCount + " 篇草稿，尚未自评" : "还没有写作自评"),
      writingMastery == null
        ? "先写一篇小作文并自评，系统才能建立写作诊断。"
        : (writingMastery < 60
          ? "先保结构与信息点，再改语言。写完后按维度自评，不要凭感觉给分。"
          : "自评稳定，下一步换题重写，重点压缩模板句。"),
      "#/writing/small",
      { unscored: writingUnscored }
    ));

    /* 模考：只统计已完成自评的场次；未自评的客观题分不当作总分。 */
    const mockAvg = doneExams.length
      ? doneExams.reduce(function (s, r) { return s + (Number(r.total) || 0); }, 0) / doneExams.length
      : null;
    const lastExam = doneExams.length
      ? doneExams.reduce(function (m, r) { return Math.max(m, Number(r.submittedAt) || 0); }, 0)
      : 0;
    const daysSinceExam = lastExam ? Math.max(0, Math.floor((Date.now() - lastExam) / 86400000)) : null;
    modules.push(learningModule(
      "mock", "模考", 12, mockAvg, doneExams.length, doneExams.length >= 1,
      doneExams.length
        ? doneExams.length + " 次 · 平均 " + examScoreText(mockAvg) + " / 100" + (daysSinceExam != null ? " · 最近 " + daysSinceExam + " 天前" : "")
        : "还没有完成自评的模考",
      mockAvg == null
        ? "先完整走一遍 180 分钟模考，再按维度自评。"
        : (mockAvg < 60
          ? "总分还没过线。先看分模块得分，优先补阅读与新题型。"
          : "总分已过线，下一步按分模块找短板，保持每周一次限时。"),
      "#/exam",
      { lastAt: lastExam, daysSince: daysSinceExam, avg: mockAvg }
    ));

    const assessed = modules.filter(function (m) { return m.assessed; });
    const missing = modules.filter(function (m) { return !m.assessed; });
    const assessedWeight = assessed.reduce(function (s, m) { return s + m.weight; }, 0);
    const overall = assessedWeight
      ? assessed.reduce(function (s, m) { return s + m.mastery * m.weight; }, 0) / assessedWeight
      : null;
    const coverage = assessedWeight;
    const weakest = assessed.slice().sort(function (a, b) {
      return a.mastery - b.mastery || b.weight - a.weight;
    })[0] || null;
    const weak = assessed.filter(function (m) { return m.mastery < 70; }).sort(function (a, b) {
      return a.mastery - b.mastery || b.weight - a.weight;
    });
    const readingModule = modules.find(function (m) { return m.key === "reading"; });

    let narrative = "";
    if (!assessed.length) {
      narrative = "还没有足够记录。先做一篇阅读、背一组词、译一段，诊断会自动建立。";
    } else {
      const low = weak[0] || null;
      const bits = [];
      bits.push(low
        ? low.label + " " + masteryNum(low.mastery) + " 分，是当前最需要补的模块。"
        : "已评估模块整体稳定，下一步保持限时与复盘。");
      if (readingModule && readingModule.assessed && readingModule.extra.focusCopy) {
        bits.push(readingModule.extra.focusCopy);
      } else if (missing.length) {
        bits.push("还有 " + missing.length + " 个模块没有样本：" + missing.map(function (m) { return m.label; }).join("、") + "。");
      }
      if (due) bits.push("今天 " + due + " 个词到期，先清复习账。");
      narrative = bits.slice(0, 2).join("");
    }

    return {
      modules: modules,
      assessed: assessed,
      missing: missing,
      overall: overall,
      overallLabel: overall == null ? "样本不足" : (coverage < 40 ? "样本不足" : masteryStatus(overall).label),
      coverage: coverage,
      weakest: weakest,
      weak: weak,
      narrative: narrative
    };
  }

  function reviewForecast(days) {
    const n = Math.max(1, Math.min(14, Number(days) || 7));
    const today = todayKey();
    const out = [];
    const names = "日一二三四五六";
    for (let i = 0; i < n; i++) {
      const date = addDays(new Date(), i);
      const key = ymd(date);
      const count = ALL_WORDS.filter(function (w) {
        const e = srsOf(w.w);
        if (!e || !e.due) return false;
        if (i === 0) return e.due <= today;
        return e.due === key;
      }).length;
      out.push({
        key: key,
        label: i === 0 ? "今天" : (i === 1 ? "明天" : "周" + names[date.getDay()]),
        count: count
      });
    }
    return out;
  }

  function reviewForecastLine() {
    if (!Object.keys(state.srs || {}).length) return "";
    const rows = reviewForecast(7);
    const total = rows.reduce(function (s, r) { return s + r.count; }, 0);
    return `<p class="review-forecast-line"><b>未来 7 天</b> ${rows.map(function (r) {
      return r.label + " " + r.count;
    }).join(" · ")}<span>共 ${total} 词</span></p>`;
  }

  function reviewForecastBars() {
    const rows = reviewForecast(7);
    const total = rows.reduce(function (s, r) { return s + r.count; }, 0);
    const max = Math.max(1, Math.max.apply(null, rows.map(function (r) { return r.count; })));
    return `
      <div class="forecast">
        <div class="forecast-head"><span>未来 7 天复习</span><span>${total} 词</span></div>
        <div class="forecast-bars">
          ${rows.map(function (r, i) {
            const h = r.count ? Math.max(6, Math.round(r.count / max * 100)) : 0;
            return `<div class="forecast-col ${i === 0 ? "today" : ""} ${r.count ? "has" : ""}" title="${r.key} · ${r.count} 词">
              <span class="forecast-count">${r.count || ""}</span>
              <span class="forecast-bar"><i style="height:${h}%"></i></span>
              <span class="forecast-label">${r.label}</span>
            </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  function focusTaskHtml(task, variant) {
    const cls = "focus-item" + (variant === "wide" ? " wide" : "");
    const inner = `
      <span class="focus-kicker">${esc(task.kicker)}</span>
      <span class="focus-title">${esc(task.title)}</span>
      <span class="focus-copy">${esc(task.copy)}</span>
      <span class="focus-foot"><span>${esc(task.meta || "")}</span><span class="focus-arrow">→</span></span>`;
    if (task.action) {
      return `<button class="${cls}" data-action="${esc(task.action)}">${inner}</button>`;
    }
    return `<a class="${cls}" href="${esc(task.href)}">${inner}</a>`;
  }

  function adaptiveTasks(diag) {
    const d = diag || learningDiagnosis();
    const map = {};
    d.modules.forEach(function (m) { map[m.key] = m; });
    const due = dueCount();
    const doneExams = (state.exams || []).filter(function (r) { return r.self && r.self.done; });
    const lastExam = doneExams.length
      ? doneExams.reduce(function (m, r) { return Math.max(m, Number(r.submittedAt) || 0); }, 0)
      : 0;
    const daysSinceExam = lastExam ? Math.max(0, Math.floor((Date.now() - lastExam) / 86400000)) : null;
    const daysLeft = Math.max(0, daysUntil(state.examDate));
    const candidates = [];
    const push = function (module, priority, task) {
      candidates.push(Object.assign({ module: module, priority: priority }, task));
    };

    if (due > 0) {
      push("vocab", 120 + Math.min(30, due), {
        kicker: "复习到期",
        title: "清掉 " + due + " 个到期词",
        copy: "间隔复习已到期。先清旧账，再背新词；模糊词会回到明天。",
        href: "#/vocab",
        action: "start-review",
        meta: "约 " + Math.max(5, Math.min(25, Math.ceil(due / 4))) + " 分钟"
      });
    } else if (map.vocab && map.vocab.assessed) {
      push("vocab", 30, {
        kicker: "推进词库",
        title: "再推进 20 个新词",
        copy: "今天没有到期词。推进新词，顺手把模糊词标出来。",
        href: "#/vocab",
        meta: "约 15 分钟"
      });
    } else {
      push("vocab", 88, {
        kicker: "建立基线",
        title: "先背 20 个高频词",
        copy: "先建立词汇样本。认识、模糊、不认识都要如实标记。",
        href: "#/vocab",
        meta: "约 15 分钟"
      });
    }

    const rm = map.reading;
    if (!rm || !rm.assessed) {
      push("reading", 92, {
        kicker: "建立基线",
        title: "先做一篇阅读",
        copy: "提交后会自动诊断题型、用时和依据定位。",
        href: "#/reading/1",
        meta: "18 分钟"
      });
    } else if (!rm.reliable) {
      push("reading", 72, {
        kicker: "补样本",
        title: "再做一篇阅读",
        copy: "当前只有 " + rm.samples + " 题样本，再做一篇才能判断稳定弱项。",
        href: "#/reading",
        meta: "18 分钟"
      });
    } else if (rm.mastery < 70) {
      push("reading", 65 + (70 - rm.mastery) * 0.6, {
        kicker: rm.extra.focusKicker || "优先补",
        title: rm.extra.focusTitle || ("阅读 " + masteryNum(rm.mastery) + " 分"),
        copy: rm.extra.focusCopy || rm.advice,
        href: rm.href,
        meta: "约 18 分钟"
      });
    } else {
      push("reading", 34, {
        kicker: "保持手感",
        title: "限时阅读一篇",
        copy: "正确率与依据定位稳定，保持 18 分钟限时。",
        href: "#/reading",
        meta: "18 分钟"
      });
    }

    const cm = map.cloze;
    if (!cm || !cm.assessed) {
      push("cloze", 55, {
        kicker: "建立基线",
        title: "做一套完形填空",
        copy: "先通读定调，再逐空找搭配与逻辑。",
        href: "#/cloze/cloze",
        meta: "15 分钟"
      });
    } else if (!cm.reliable) {
      push("cloze", 54, {
        kicker: "补样本",
        title: "再做一套完形",
        copy: "已做完 " + cm.samples + " 空，再做一套看稳定性。",
        href: "#/cloze/cloze",
        meta: "15 分钟"
      });
    } else if (cm.mastery < 70) {
      push("cloze", 58 + (70 - cm.mastery) * 0.35, {
        kicker: "优先补",
        title: "完形 · 正确率 " + masteryNum(cm.mastery) + "%",
        copy: cm.advice,
        href: "#/cloze/cloze",
        meta: "15 分钟"
      });
    } else {
      push("cloze", 22, {
        kicker: "保持",
        title: "完形保持一套",
        copy: "正确率稳定，重点看逻辑衔接与固定搭配。",
        href: "#/cloze/cloze",
        meta: "15 分钟"
      });
    }

    const nm = map.newtype;
    if (!nm || !nm.assessed) {
      push("newtype", 53, {
        kicker: "建立基线",
        title: "做一套七选五",
        copy: "先看选项里的代词和连接词，再回空白前后找线索。",
        href: "#/cloze/seven",
        meta: "12 分钟"
      });
    } else if (!nm.reliable) {
      push("newtype", 52, {
        kicker: "补样本",
        title: "再做一套新题型",
        copy: "已做完 " + nm.samples + " 题，再做一套看稳定性。",
        href: nm.href,
        meta: "12 分钟"
      });
    } else if (nm.mastery < 70) {
      push("newtype", 57 + (70 - nm.mastery) * 0.35, {
        kicker: "优先补",
        title: "新题型 · " + (nm.extra.weakLabel || "正确率 " + masteryNum(nm.mastery) + "%"),
        copy: nm.advice,
        href: nm.href,
        meta: "12 分钟"
      });
    } else {
      push("newtype", 20, {
        kicker: "保持",
        title: "新题型保持一套",
        copy: "三类新题型轮换做，别只练顺手的那一类。",
        href: nm.href,
        meta: "12 分钟"
      });
    }

    const tm = map.translation;
    if (!tm || !tm.assessed) {
      push("translation", 68, {
        kicker: "建立基线",
        title: "译一段并勾采分点",
        copy: "翻译诊断来自采分点自评，不来自字数。",
        href: tm ? tm.href : "#/translation",
        meta: "15 分钟"
      });
    } else if (!tm.reliable) {
      push("translation", 60, {
        kicker: "补样本",
        title: "再译一段",
        copy: "已有 1 次自评，再做一段才能看稳定性。",
        href: tm.href,
        meta: "15 分钟"
      });
    } else if (tm.mastery < 70) {
      push("translation", 62 + (70 - tm.mastery) * 0.35, {
        kicker: "优先补",
        title: "翻译 · 采分点 " + masteryNum(tm.mastery) + "%",
        copy: tm.advice,
        href: tm.href,
        meta: "15 分钟"
      });
    } else {
      push("translation", 24, {
        kicker: "保持",
        title: "翻译保持一段",
        copy: "先读懂，再说人话。译完对照参考译文，只改三处。",
        href: tm.href,
        meta: "15 分钟"
      });
    }

    const wm = map.writing;
    if (!wm || !wm.assessed) {
      push("writing", 66, {
        kicker: "建立基线",
        title: "写一篇小作文并自评",
        copy: "先保格式与信息点，再按维度给分。",
        href: "#/writing/small",
        meta: "20 分钟"
      });
    } else if (!wm.reliable) {
      push("writing", 58, {
        kicker: "补样本",
        title: "再写一篇并自评",
        copy: "已有 1 次自评，再写一篇才能看稳定性。",
        href: "#/writing/big",
        meta: "25 分钟"
      });
    } else if (wm.mastery < 70) {
      push("writing", 60 + (70 - wm.mastery) * 0.35, {
        kicker: "优先补",
        title: "写作 · 自评 " + masteryNum(wm.mastery) + " 分",
        copy: wm.advice,
        href: "#/writing/big",
        meta: "25 分钟"
      });
    } else {
      push("writing", 23, {
        kicker: "保持",
        title: "换题写一段",
        copy: "不整篇背范文。换主题，改结构，写出自己的版本。",
        href: "#/writing/big",
        meta: "20 分钟"
      });
    }

    if (!doneExams.length) {
      const baselineReady = d.assessed.length >= 4;
      push("mock", baselineReady ? (daysLeft <= 60 ? 96 : 48) : 38, {
        kicker: "全真演练",
        title: "完成一次 180 分钟模考",
        copy: baselineReady
          ? "先走完整流程，再按维度自评。客观题与主观题分开看。"
          : "先建立阅读、词汇、翻译或写作基线，再做整卷更能看出问题。",
        href: "#/exam",
        meta: "180 分钟"
      });
    } else if (daysSinceExam != null && daysSinceExam >= 14) {
      push("mock", daysLeft <= 60 ? 94 : 42, {
        kicker: "限时演练",
        title: "距离上次模考 " + daysSinceExam + " 天",
        copy: "重新按 180 分钟走一遍，重点看分模块得分有没有变化。",
        href: "#/exam",
        meta: "180 分钟"
      });
    } else {
      push("mock", 18, {
        kicker: "保持",
        title: "回看模考分模块得分",
        copy: "不重做整卷，只看最弱模块和错题归因。",
        href: "#/exam",
        meta: "10 分钟"
      });
    }

    if (state.mistakes.length) {
      push("review", 40 + Math.min(20, state.mistakes.length), {
        kicker: "错题复盘",
        title: "复盘 " + Math.min(5, state.mistakes.length) + " 道错题",
        copy: "先遮答案重做，再回看解析。移出错题本前，要能说清为什么错。",
        href: "#/me/mistakes",
        meta: "10 分钟"
      });
    }

    push("sentence", 16, {
      kicker: "每日基本功",
      title: "拆两句长难句",
      copy: "先找主干，再把从句、分词和插入语挂回去。",
      href: "#/sentences",
      meta: "12 分钟"
    });
    if (state.notebook.length) {
      push("notebook", 14, {
        kicker: "生词回看",
        title: "回看生词本 " + state.notebook.length + " 词",
        copy: "只看还不认识的词，能说出核心义项就移出。",
        href: "#/me/notebook",
        meta: "8 分钟"
      });
    }
    push("plan", 8, {
      kicker: "阶段校准",
      title: "核对当前阶段规划",
      copy: "规划不是排满每天，而是知道这一阶段该解决什么。",
      href: "#/plan",
      meta: "5 分钟"
    });

    candidates.sort(function (a, b) {
      return b.priority - a.priority || String(a.module).localeCompare(String(b.module));
    });
    const selected = [];
    const used = {};
    candidates.forEach(function (task) {
      if (selected.length >= 3 || used[task.module]) return;
      used[task.module] = true;
      selected.push(task);
    });
    return selected;
  }

  function homeFocusPanel() {
    const d = learningDiagnosis();
    const tasks = adaptiveTasks(d).slice(0, 3);
    return `
      <section class="rail-block rail-focus">
        <div class="rail-head"><h3>今日重点</h3><span>${d.overall == null ? "先建立诊断" : "掌握度 " + masteryNum(d.overall)}</span></div>
        <div class="focus-list">${tasks.map(function (t) { return focusTaskHtml(t, "rail"); }).join("")}</div>
        <a class="text-link" href="#/me/summary">看完整诊断 →</a>
      </section>`;
  }

  function adaptiveSection() {
    const d = learningDiagnosis();
    const tasks = adaptiveTasks(d).slice(0, 3);
    return `
      <section class="section focus-section">
        <div class="section-head"><h2>当前优先</h2><span class="section-note">${d.overall == null ? "先建立诊断" : "掌握度 " + masteryNum(d.overall) + " / 100"} · 随作答更新</span></div>
        <div class="focus-grid">${tasks.map(function (t) { return focusTaskHtml(t, "wide"); }).join("")}</div>
        <p class="mini-note">建议由最近作答、到期复习和自评记录实时生成，只决定先后，不替代阶段规划。</p>
      </section>`;
  }

  function learningDiagnosisPanel() {
    const d = learningDiagnosis();
    const tasks = adaptiveTasks(d).slice(0, 3);
    const rows = d.modules.map(function (m) {
      const value = m.assessed ? masteryNum(m.mastery) + "<small>/100</small>" : "待建立";
      const width = m.assessed ? Math.max(2, Math.round(m.mastery)) : 0;
      return `
        <div class="mastery-row ${m.cls}">
          <div class="mastery-label"><b>${esc(m.label)}</b><span>权重 ${m.weight}%${m.reliable ? "" : " · 样本少"}</span></div>
          <div class="mastery-bar"><i style="width:${width}%"></i></div>
          <div class="mastery-value">${value}</div>
          <div class="mastery-evidence">${esc(m.evidence)}</div>
        </div>`;
    }).join("");
    return `
      <section class="learning-diag">
        <div class="learning-diag-head">
          <div class="learning-diag-copy">
            <p class="eyebrow">学习诊断</p>
            <h2>当前掌握度 <b>${d.overall == null ? "—" : masteryNum(d.overall)}</b><small>/100</small></h2>
            <p>${esc(d.narrative)}</p>
          </div>
          <div class="learning-diag-figures">
            <div><span>已评估</span><b>${d.assessed.length}<small>/7</small></b><em>模块</em></div>
            <div><span>证据覆盖</span><b>${Math.round(d.coverage)}<small>%</small></b><em>按权重</em></div>
            <div><span>最弱</span><b class="diag-weak">${d.weakest ? esc(d.weakest.label) : "—"}</b><em>${d.weakest ? masteryNum(d.weakest.mastery) + " 分" : "先做题"}</em></div>
          </div>
        </div>
        <div class="learning-diag-grid">
          <div class="mastery-list">
            <div class="mastery-head"><span>模块</span><span>掌握度</span><span>依据</span></div>
            ${rows}
          </div>
          <aside class="diag-side">
            <div class="diag-side-head"><span>接下来</span><span>${tasks.length} 件</span></div>
            <div class="focus-list compact">${tasks.map(function (t) { return focusTaskHtml(t, "rail"); }).join("")}</div>
            ${reviewForecastBars()}
          </aside>
        </div>
        <p class="learning-diag-note">掌握度由已提交练习、采分点自评和模考成绩折算，只统计有证据的模块；不是分数预测。样本少的模块会标注。</p>
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

      <div class="passage-bar">
        <button class="chip" data-action="speak" data-text="${esc(r.paragraphs.join(" "))}">朗读全文</button>
        <span class="count-line">开始朗读后，右上角随时可以停止</span>
      </div>

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
    const route = getRoute();
    const routeTab = route.name === "cloze" && ["cloze", "seven", "order", "heading"].indexOf(route.param) !== -1 ? route.param : null;
    const tab = routeTab || (["cloze", "seven", "order", "heading"].indexOf(ui.clozeTab) !== -1 ? ui.clozeTab : "cloze");
    ui.clozeTab = tab;
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
    const fixedLabels = [set.first, set.last].map(String);
    const letters = (set.paragraphs || [])
      .map(function (p) { return String(p.label); })
      .filter(function (lab) { return fixedLabels.indexOf(lab) === -1; });
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
    if (/^p\d+$/.test(key)) {
      const id = Number(String(key).slice(1));
      const hit = (window.TRANS_PASSAGES || []).find(function (p) { return p.id === id; });
      return hit || null;
    }
    if (key === "p") return window.TRANSLATIONS.passage;
    const id = Number(String(key).replace(/^s/, ""));
    return window.TRANSLATIONS.sentences.find(function (s) { return s.id === id; });
  }

  function passageSets() {
    const out = [{ id: 1, title: "共享经济", entry: window.TRANSLATIONS.passage }];
    (window.TRANS_PASSAGES || []).forEach(function (p) {
      if (p && p.id && p.en) out.push({ id: p.id, title: p.title || ("段落 " + p.id), entry: p });
    });
    return out;
  }

  function transValue(key) {
    return typeof state.translations[key] === "string" ? state.translations[key] : "";
  }

  function countChars(text) {
    return String(text || "").replace(/\s/g, "").length;
  }

  function transCheckBox(key) {
    return `<div class="check-box trans-check">
      <div class="check-bar">
        <span class="label">自动检查</span>
        <span class="check-hint">术语与完整度初检 · 不替代参考译文</span>
        <button class="text-link" data-action="check-trans" data-key="${esc(key)}">检查译文</button>
      </div>
      <div class="check-result" data-trans-result="${esc(key)}" aria-live="polite"></div>
    </div>`;
  }

  function pageTranslation() {
    const route = getRoute();
    if (route.name === "translation" && (route.param === "sentence" || route.param === "passage")) {
      ui.transTab = route.param;
    }
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
          ${transCheckBox(key)}
          ${open ? transRefPanel(entry, key) : ""}
        </article>`;
    }).join("")}</div>`;
  }

  function translationPassage() {
    const sets = passageSets();
    const cur = sets.find(function (p) { return p.id === ui.transPassage; }) || sets[0];
    const key = cur.id === 1 ? "p" : ("p" + cur.id);
    const entry = cur.entry;
    const open = ui.transOpen[key] === true;
    const value = transValue(key);
    const paragraphs = String(entry.en).split(/\n{2,}/).map(function (p) { return `<p>${esc(p)}</p>`; }).join("");
    const picker = sets.length > 1 ? `<div class="chips" style="margin-bottom:14px">${sets.map(function (p) {
      return `<button class="chip ${p.id === cur.id ? "on" : ""}" data-action="trans-passage" data-id="${p.id}">${esc(p.title)}</button>`;
    }).join("")}</div>` : "";
    return `
      <div class="trans-passage-head">
        ${picker}
        <article class="trans-item passage-trans">
          <div class="trans-head">
            <span class="label">英语二 · 段落翻译 · 第 ${cur.id} 篇</span>
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
          ${transCheckBox(key)}
          ${open ? transRefPanel(entry, key) : ""}
        </article>
      </div>`;
  }

  function transSelfPanel(entry, key) {
    const points = (entry && entry.points) || [];
    if (!points.length) return "";
    const checks = Array.isArray(state.transSelf[key]) ? state.transSelf[key] : [];
    const n = points.filter(function (_, i) { return !!checks[i]; }).length;
    const isPassage = String(key).charAt(0) === "p";
    const scaled = isPassage ? Math.round(n / points.length * 15 * 2) / 2 : null;
    return `
      <div class="trans-self" data-trans-self="${esc(key)}">
        <p class="label" style="margin-top:16px">得分点 · 自评</p>
        <ul class="point-list">
          ${points.map(function (p, i) {
            const on = !!checks[i];
            return `<li><button class="point-check ${on ? "on" : ""}" data-action="trans-point" data-key="${esc(key)}" data-i="${i}" aria-pressed="${on}"><i>${on ? "✓" : ""}</i><span>${esc(p)}</span></button></li>`;
          }).join("")}
        </ul>
        <p class="self-score-line">已译出 <b data-trans-self-score>${n} / ${points.length}</b> 个采分点${isPassage ? " · 按英语二 15 分制折算 <b>" + examScoreText(scaled) + " / 15</b>" : ""}</p>
      </div>`;
  }

  function transRefPanel(entry, key) {
    if (!entry) return "";
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
        ${transSelfPanel(entry, key)}
        ${chunks ? `<div class="chunks"><p class="label" style="margin-top:16px">意群切分</p>${chunks}</div>` : ""}
        ${words ? `<div class="word-pairs">${words}</div>` : ""}
      </div>`;
  }

  function updateTransSelfDom(key) {
    const root = document.querySelector('[data-trans-self="' + key + '"]');
    if (!root) return;
    const entry = transEntryByKey(key);
    const points = (entry && entry.points) || [];
    const checks = Array.isArray(state.transSelf[key]) ? state.transSelf[key] : [];
    const btns = root.querySelectorAll(".point-check");
    btns.forEach(function (btn) {
      const i = Number(btn.getAttribute("data-i"));
      const on = !!checks[i];
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", String(on));
      const mark = btn.querySelector("i");
      if (mark) mark.textContent = on ? "✓" : "";
    });
    const n = points.filter(function (_, i) { return !!checks[i]; }).length;
    const score = root.querySelector("[data-trans-self-score]");
    if (score) score.textContent = n + " / " + points.length;
    const scaled = String(key).charAt(0) === "p" && points.length ? Math.round(n / points.length * 15 * 2) / 2 : null;
    const line = root.querySelector(".self-score-line");
    if (line) {
      line.innerHTML = "已译出 <b data-trans-self-score>" + n + " / " + points.length + "</b> 个采分点" +
        (scaled != null ? " · 按英语二 15 分制折算 <b>" + examScoreText(scaled) + " / 15</b>" : "");
    }
  }

  /* ------------------------------------------------------------------
     writing
  ------------------------------------------------------------------ */

  function pageWriting() {
    const route = getRoute();
    if (route.name === "writing" && ["small", "big", "patterns"].indexOf(route.param) !== -1) {
      ui.writingTab = route.param;
    }
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

  function draftSelfDims(kind) {
    return kind === "small" ? WRITING_A_DIMS : writingBDims({ type: "en1" });
  }

  function updateDraftSelfDom(key) {
    const root = document.querySelector('[data-draft-self="' + key + '"]');
    if (!root) return;
    const kind = key.indexOf("small-") === 0 ? "small" : "big";
    const dims = draftSelfDims(kind);
    const src = state.draftSelf[key] || {};
    let got = 0;
    dims.forEach(function (d) {
      const cur = Math.max(0, Math.min(d.max, Number(src[d.key]) || 0));
      got += cur;
      root.querySelectorAll('.rubric-score[data-dim="' + d.key + '"]').forEach(function (btn) {
        btn.classList.toggle("on", Number(btn.getAttribute("data-score")) === cur);
      });
    });
    const score = root.querySelector("[data-draft-self-score]");
    if (score) score.textContent = got + " / " + (kind === "small" ? 10 : 20);
  }

  function draftBlock(w, kind, i, target) {
    const key = kind + "-" + i;
    const value = typeof state.drafts[key] === "string" ? state.drafts[key] : "";
    const dims = draftSelfDims(kind);
    const src = state.draftSelf[key] || {};
    const got = dims.reduce(function (s, d) { return s + Math.max(0, Math.min(d.max, Number(src[d.key]) || 0)); }, 0);
    const max = kind === "small" ? 10 : 20;
    const rows = dims.map(function (d) {
      const cur = Math.max(0, Math.min(d.max, Number(src[d.key]) || 0));
      let buttons = "";
      for (let n = 0; n <= d.max; n++) {
        buttons += `<button class="rubric-score ${cur === n ? "on" : ""}" data-action="draft-self" data-key="${key}" data-dim="${d.key}" data-score="${n}" aria-label="${esc(d.label)} ${n} 分">${n}</button>`;
      }
      return `<div class="rubric-row">
        <div class="rubric-copy"><b>${esc(d.label)}</b><span>${esc(d.hint)}</span></div>
        <div class="rubric-scores">${buttons}</div>
        <span class="rubric-max">${cur} / ${d.max}</span>
      </div>`;
    }).join("");
    return `
      <div class="draft-box">
        <div class="draft-head"><span class="label">写作练习</span><span class="score-note">目标 ${target} 词左右</span></div>
        <textarea data-draft="${key}" placeholder="先列提纲，再写。写完对照范文，只改三处：结构、语法、重复用词。">${esc(value)}</textarea>
        <div class="draft-foot"><span data-draft-count="${key}">${wordCount(value)} 词</span><span>内容仅保存在本机</span></div>
        <div class="check-box draft-check">
          <div class="check-bar">
            <span class="label">自动检查</span>
            <span class="check-hint">离线初检 · 不替代老师</span>
            <button class="text-link" data-action="check-draft" data-key="${key}" data-kind="${kind}" data-i="${i}">检查这篇</button>
          </div>
          <div class="check-result" data-draft-result="${key}" aria-live="polite"></div>
        </div>
        <details class="draft-self-box" data-draft-self="${key}">
          <summary><span>写完后自评</span><b data-draft-self-score="${key}">${got} / ${max}</b></summary>
          <div class="draft-self-body">
            <div class="rubric-box no-border">
              <div class="rubric-head"><h3>自评维度</h3><span>${got} / ${max}</span></div>
              ${rows}
            </div>
            <p class="mini-note">按维度给分，不按感觉给分。${kind === "big" ? "英语二考生可按 15 分制折算。" : ""}自评只保存在本机，不影响其他记录。</p>
          </div>
        </details>
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
     offline subjective feedback
     写作 / 翻译的离线初检：只判断可计算、可解释的表面特征，
     内容深度与逻辑仍以对照范文、参考译文和自评为准。
  ------------------------------------------------------------------ */

  const FB_STOP = new Set(("a an the and or but if while because as of to in on at for from with without by about into over under between among through during before after above below up down out off again further then once here there when where why how all any both each few more most other some such no nor not only own same so than too very can could may might must shall should will would do does did have has had be is are was were being been i me my we our you your he him his she her it its they them their this that these those what which who whom whose".split(" ")));
  const FB_CONNECTIVES = ["however", "therefore", "moreover", "furthermore", "in addition", "for example", "for instance", "as a result", "on the other hand", "while", "although", "because", "since", "thus", "consequently", "nevertheless", "in conclusion", "to begin with", "first", "second", "finally", "by contrast", "meanwhile", "if", "when", "whenever", "after", "before", "so that", "in order to", "instead", "besides", "at present", "in this way", "for this reason", "but", "yet", "also", "rather than"];
  const FB_COMPLEX = ["because", "although", "while", "which", "that", "who", "whom", "whose", "if", "unless", "when", "whether", "since", "as", "despite", "whereas", "not only", "rather than", "even though"];
  const FB_ANALYSIS = ["because", "therefore", "as a result", "lead to", "leads to", "result in", "results in", "cause", "causes", "reason", "due to", "by contrast", "however", "while", "the problem", "the result"];
  const FB_SUGGESTION = ["should", "can", "could", "need to", "recommend", "suggest", "it is advisable", "would be", "might"];
  const FB_DESCRIPTION = ["shows", "show", "depicts", "illustrates", "figure", "chart", "graph", "caption", "in the picture", "in the drawing", "the drawing", "the photo"];
  const FB_CLICHES = ["with the development of society", "with the development of the economy", "every coin has two sides", "more and more", "a lot of", "lots of", "last but not least", "as we all know", "it is well known that", "in modern society", "play an important role"];
  const FB_CONTRACTIONS = ["don't", "doesn't", "didn't", "can't", "couldn't", "won't", "wouldn't", "shouldn't", "isn't", "aren't", "wasn't", "weren't", "it's", "i'm", "i've", "i'd", "i'll", "they're", "we're", "you're", "that's", "there's"];
  const FB_MISSPELL = {
    recieve: "receive", seperate: "separate", definately: "definitely", enviroment: "environment",
    goverment: "government", developement: "development", benifit: "benefit", neccessary: "necessary",
    accomodate: "accommodate", arguement: "argument", calender: "calendar", comming: "coming",
    concious: "conscious", embarass: "embarrass", existance: "existence", foriegn: "foreign",
    freind: "friend", happend: "happened", immediatly: "immediately", knowlege: "knowledge",
    occured: "occurred", oppurtunity: "opportunity", prefered: "preferred", priviledge: "privilege",
    publically: "publicly", recomend: "recommend", refered: "referred", responsability: "responsibility",
    succesful: "successful", suprise: "surprise", thier: "their", tommorow: "tomorrow",
    untill: "until", wich: "which", wierd: "weird"
  };
  const SMALL_TYPE_CUES = {
    "建议信": ["suggest", "recommend", "propose", "advice", "would be grateful", "consider", "at present"],
    "感谢信": ["thank", "grateful", "appreciate", "help", "return", "comments", "patience", "generosity"],
    "投诉信": ["complain", "complaint", "problem", "dissatisfied", "expect", "solve", "refund", "ordered", "delivery", "reply"],
    "通知": ["notice", "conference", "volunteers", "training", "certificate", "available", "organizing committee", "by"],
    "邀请信": ["invite", "invitation", "forum", "speak", "convenient", "travel", "annual"],
    "道歉信": ["apologize", "apologise", "apology", "sorry", "inconvenience", "replacement", "make up", "appointment", "outline"],
    "申请信": ["apply", "application", "position", "program", "programme", "qualification", "interview", "tutoring", "references"],
    "咨询信": ["inquire", "enquire", "information", "details", "question", "reply", "further", "workshop", "register", "deadline"],
    "祝贺信": ["congratulate", "congratulations", "achievement", "success", "wish", "admitted", "graduate", "celebrate"],
    "推荐信": ["recommend", "candidate", "strength", "qualified", "support", "supervisor", "persistence", "exchange"],
    "倡议信": ["propose", "phone-free", "trial", "signs", "support", "students' union"],
    "回复信": ["invitation", "accept", "seminar", "materials", "arrange", "grateful"]
  };
  const SMALL_TYPE_HINTS = {
    "建议信": "说明现状与理由，提出具体建议，再请求考虑",
    "感谢信": "感谢具体帮助，说明它带来的影响，再表达回报意愿",
    "投诉信": "说明问题与影响，提出合理诉求，语气克制",
    "通知": "写清事由、时间、地点、参与对象和截止时间",
    "邀请信": "说明活动、时间、地点、安排，并请对方回复",
    "道歉信": "说明原因、表达歉意、给出补救办法",
    "申请信": "说明申请目标、相关经历与能力、请求面试",
    "咨询信": "说明想了解的信息，问题具体，留下联系方式",
    "祝贺信": "点明祝贺事由，肯定对方努力，表达祝愿",
    "推荐信": "说明关系、推荐理由、具体能力与支持态度"
  };

  const feedbackCache = Object.create(null);

  function fbReEscape(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function fbHas(text, phrase) {
    const t = String(text || "").toLowerCase();
    const p = String(phrase || "").toLowerCase();
    if (!p) return false;
    if (/^[a-z][a-z'-]*$/.test(p)) {
      return new RegExp("\\b" + fbReEscape(p) + "\\b", "i").test(t);
    }
    return t.indexOf(p) !== -1;
  }

  function fbWords(text) {
    return (String(text || "").match(/[A-Za-z][A-Za-z'-]*/g) || []).map(function (w) { return w.toLowerCase(); });
  }

  function fbSentences(text) {
    const protectedText = String(text || "")
      .replace(/\b(?:Mr|Mrs|Ms|Dr|Prof|St|vs|etc|e\.g|i\.e|a\.m|p\.m)\./gi, function (m) { return m.replace(/\./g, "\u0001"); })
      .replace(/\s+/g, " ");
    return protectedText.split(/[.!?]+(?:\s+|$)/).map(function (s) { return s.replace(/\u0001/g, ".").trim(); }).filter(Boolean);
  }

  function fbParagraphs(text) {
    let parts = String(text || "").split(/\n{2,}/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (parts.length <= 1) {
      const lines = String(text || "").split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (lines.length > 1) parts = lines;
    }
    return parts;
  }

  function fbWordSet(text) {
    const set = new Set();
    fbWords(text).forEach(function (w) {
      set.add(w);
      if (w.length > 3 && /s$/.test(w)) set.add(w.slice(0, -1));
      else set.add(w + "s");
    });
    return set;
  }

  function fbTopContent(text, limit) {
    const counts = Object.create(null);
    fbWords(text).forEach(function (w) {
      if (w.length < 4 || FB_STOP.has(w)) return;
      counts[w] = (counts[w] || 0) + 1;
    });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); }).slice(0, limit || 40);
  }

  function fbCoverage(text, sample) {
    const base = fbTopContent(sample, 40);
    if (!base.length) return 0;
    const set = fbWordSet(text);
    let hit = 0;
    base.forEach(function (w) { if (set.has(w)) hit++; });
    return hit / base.length;
  }

  function fbRepeats(words) {
    const counts = Object.create(null);
    words.forEach(function (w) {
      if (w.length < 4 || FB_STOP.has(w)) return;
      counts[w] = (counts[w] || 0) + 1;
    });
    return Object.keys(counts).filter(function (w) {
      return counts[w] >= 5 && counts[w] / Math.max(1, words.length) >= 0.035;
    }).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 4).map(function (w) {
      return { word: w, count: counts[w] };
    });
  }

  function fbStats(text) {
    const words = fbWords(text);
    const sents = fbSentences(text);
    const lens = sents.map(function (s) { return fbWords(s).length; }).filter(function (n) { return n > 0; });
    const totalLen = lens.reduce(function (a, b) { return a + b; }, 0);
    const avgSent = lens.length ? totalLen / lens.length : 0;
    const longRatio = lens.length ? lens.filter(function (n) { return n >= 28; }).length / lens.length : 0;
    const shortRatio = lens.length ? lens.filter(function (n) { return n <= 7; }).length / lens.length : 0;
    const uniqueRatio = words.length ? new Set(words).size / words.length : 0;
    return {
      wc: wordCount(text),
      paras: fbParagraphs(text),
      sents: sents,
      words: words,
      avgSent: avgSent,
      longRatio: longRatio,
      shortRatio: shortRatio,
      uniqueRatio: uniqueRatio,
      connectives: FB_CONNECTIVES.filter(function (c) { return fbHas(text, c); }),
      complexCount: sents.filter(function (s) {
        return FB_COMPLEX.some(function (c) { return fbHas(s, c); });
      }).length,
      repeats: fbRepeats(words),
      cliches: FB_CLICHES.filter(function (c) { return fbHas(text, c); }),
      contractions: FB_CONTRACTIONS.filter(function (c) { return fbHas(text, c); }),
      chinese: (String(text || "").match(/[\u4e00-\u9fa5]/g) || []).length
    };
  }

  function fbParagraphBalance(text) {
    const paras = fbParagraphs(text);
    const counts = paras.map(function (p) { return wordCount(p); });
    const total = counts.reduce(function (a, b) { return a + b; }, 0);
    return total ? Math.max.apply(null, counts) / total : 1;
  }

  function fbFormatChecks(text, item, kind) {
    const lines = String(text || "").split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    const first = lines[0] || "";
    const last = lines[lines.length - 1] || "";
    const type = String((item && item.type) || "");
    const isNotice = /通知/.test(type);
    const orgSignature = /^(?:the\s+)?(?:students?'?|student)\s+union$|^(?:the\s+)?organizing committee$/i.test(last);
    const purposeByType = {
      "建议信": /\b(suggest|recommend|propose)\b/i,
      "感谢信": /\b(thank|grateful|appreciate)\b/i,
      "投诉信": /\b(ordered|complaint|concern|refund|delivery|not arrived)\b/i,
      "通知": /\b(will host|is scheduled|will be held|we are looking for|notice)\b/i,
      "邀请信": /\b(invite|invitation)\b/i,
      "道歉信": /\b(apolog|sorry|regret)\b/i,
      "申请信": /\b(apply|application)\b/i,
      "咨询信": /\b(enquire|inquire|question|clarify)\b/i,
      "祝贺信": /\b(congratulat|delighted to hear|admitted)\b/i,
      "推荐信": /\b(recommend)\b/i,
      "倡议信": /\b(propose|call on|we are writing)\b/i,
      "回复信": /\b(thank you for your invitation|glad to accept|accept)\b/i
    };
    const typePurpose = purposeByType[type] ? purposeByType[type].test(text) : false;
    return {
      isNotice: isNotice,
      orgSignature: orgSignature,
      hasDear: /^(dear\b|to whom it may concern)/i.test(first),
      hasClosing: /\b(yours sincerely|yours faithfully|sincerely|best regards|warm regards|warmest regards|best wishes|all the best|regards)\b/i.test(text),
      hasSignature: !!last && (orgSignature || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}$/.test(last) || /\b(li ming|student union|students' union|committee)\b/i.test(last)),
      hasPolite: /\b(please|grateful|thank|appreciate|sorry|regret|kindly|could you|would you|would be glad|would appreciate|look forward)\b/i.test(text),
      hasPurpose: typePurpose || /\b(i am writing|we are writing|i write|i would like to|this is to|we are pleased|is scheduled|i am applying)\b/i.test(text),
      hasNoticeHeading: /^\s*(notice|notification)\b/i.test(first) || /\bnotice\b/i.test(first),
      hasDate: /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i.test(text),
      hasDetails: /\b\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?\b|\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|week|month|room|floor|library|campus|online)\b/i.test(text),
      first: first,
      last: last,
      kind: kind
    };
  }

  function fbIssue(level, tag, title, detail, excerpt) {
    return { level: level, tag: tag, title: title, detail: detail, excerpt: excerpt || "" };
  }

  function fbExcerpt(text, match, len) {
    if (!match) return "";
    const s = String(text || "");
    const i = s.indexOf(match);
    if (i < 0) return String(match).slice(0, len || 72);
    const start = Math.max(0, i - 18);
    const end = Math.min(s.length, i + String(match).length + 24);
    const body = s.slice(start, end).replace(/\s+/g, " ").trim();
    return (start > 0 ? "…" : "") + body.slice(0, len || 72) + (end < s.length ? "…" : "");
  }

  function fbTail(text, len) {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    const n = len || 56;
    return (s.length > n ? "…" : "") + s.slice(Math.max(0, s.length - n));
  }

  function fbSpellingIssues(text) {
    const out = [];
    Object.keys(FB_MISSPELL).forEach(function (wrong) {
      if (!fbHas(text, wrong)) return;
      out.push(fbIssue("mid", "规范", "拼写错误", wrong + " → " + FB_MISSPELL[wrong], fbExcerpt(text, wrong, 56)));
    });
    return out;
  }

  function fbGrammarIssues(text) {
    const rules = [
      { re: /\b(?:i am|i'm) agree\b/i, title: "I agree 前不用 am", detail: "改为 I agree，而不是 I am agree。" },
      { re: /\bdiscuss about\b/i, title: "discuss 后不加 about", detail: "discuss the issue，不说 discuss about the issue。" },
      { re: /\bemphasi[sz]e on\b/i, title: "emphasize 后不加 on", detail: "emphasize the importance，不说 emphasize on。" },
      { re: /\baccording to my opinion\b/i, title: "according to 后接来源", detail: "改为 in my opinion 或 according to the survey。" },
      { re: /\bin the other hand\b/i, title: "固定搭配", detail: "改为 on the other hand。" },
      { re: /\bon one hand\b/i, title: "固定搭配", detail: "改为 on the one hand。" },
      { re: /\bmore better\b/i, title: "比较级重复", detail: "改为 better。" },
      { re: /\bmost easiest\b/i, title: "最高级重复", detail: "改为 easiest。" },
      { re: /\bcan be able to\b/i, title: "情态动词重复", detail: "改为 can 或 be able to。" },
      { re: /\bthere have\b/i, title: "there be 句型", detail: "改为 there are / there is，不用 there have。" },
      { re: /\bpeople (?:is|was|has)\b/i, title: "主谓一致", detail: "people 作复数，用 people are / were / have。" },
      { re: /\b(?:students|they) has\b/i, title: "主谓一致", detail: "复数主语用 have。" },
      { re: /\b(?:he|she|it) (?:go|have|do|make|take|need|want)\b/i, title: "主谓一致", detail: "第三人称单数动词要加 -s。" },
      { re: /\balthough\b[^.!?]{0,160}\bbut\b/i, title: "although 与 but 不连用", detail: "保留 although 或 but 其中一个。" },
      { re: /\bbecause\b[^.!?]{0,160}\bso\b/i, title: "because 与 so 不连用", detail: "保留 because 或 so 其中一个。" },
      { re: /\bthe reason is because\b/i, title: "reason 后接 that", detail: "改为 the reason is that。" },
      { re: /\bin nowadays\b/i, title: "nowadays 前不加 in", detail: "直接用 nowadays。" },
      { re: /\ba (?:apple|orange|egg|idea|issue|answer|example|effect|advantage|opportunity|important|interesting|easy|old|hour|honest)\b/i, title: "冠词", detail: "元音音素前用 an。" },
      { re: /\ban (?:book|car|student|person|problem|reason|way|good|bad|large|small)\b/i, title: "冠词", detail: "辅音音素前用 a。" }
    ];
    const out = [];
    rules.forEach(function (r) {
      const m = String(text || "").match(r.re);
      if (!m) return;
      out.push(fbIssue("mid", "语言", r.title, r.detail, fbExcerpt(text, m[0], 64)));
    });
    // 句子开头小写：只报一次，避免每句都刷屏
    const lower = fbSentences(text).find(function (s) {
      const m = s.match(/^[^A-Za-z]*([a-z])/);
      return !!m;
    });
    if (lower) out.push(fbIssue("mid", "规范", "句首字母小写", "每句第一个单词首字母大写。", fbExcerpt(text, lower, 60)));
    return out;
  }

  function fbMechanicsIssues(text, opts) {
    const out = [];
    const t = String(text || "");
    if (/[\u4e00-\u9fa5]/.test(t)) {
      out.push(fbIssue("high", "规范", "混入中文", "英文写作中不要出现中文；专有名词除外。", fbExcerpt(t, (t.match(/[\u4e00-\u9fa5]+/) || [""])[0], 48)));
    }
    if (/\S {2,}\S/.test(t)) out.push(fbIssue("low", "规范", "多余空格", "单词之间保留一个空格即可。", ""));
    if (/[A-Za-z]\s+[,.;:!?]/.test(t)) out.push(fbIssue("low", "规范", "标点前多空格", "逗号、句号前不要留空格。", ""));
    const missingSpace = (t.match(/[a-z][,.;:!?][A-Za-z]/g) || []).filter(function (m) {
      return !/^(?:p|a)\.m$|^(?:e\.g|i\.e|u\.s|u\.k)$/i.test(m);
    });
    if (missingSpace.length && !/https?:\/\/|[\w.+-]+@[\w.-]+\.\w+/i.test(t)) {
      out.push(fbIssue("low", "规范", "标点后缺空格", "逗号、句号后接下一句时加一个空格。", ""));
    }
    if (/\([^)]*$/.test(t) || /^[^(]*\)/.test(t)) out.push(fbIssue("low", "规范", "括号不配对", "检查左右括号是否成对。", ""));
    const lines = t.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    const last = lines[lines.length - 1] || "";
    const skipFinal = !!(opts && opts.skipFinal);
    if (!skipFinal && last && !/[.!?…:;"'”’)]$/.test(last) && !/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}$/.test(last)) {
      out.push(fbIssue("low", "规范", "结尾缺标点", "最后一句补上句号。", fbExcerpt(t, last, 48)));
    }
    return out;
  }

  function fbSortIssues(issues) {
    const rank = { high: 0, mid: 1, low: 2, good: 3 };
    return issues.slice().sort(function (a, b) { return (rank[a.level] || 0) - (rank[b.level] || 0); });
  }

  function fbPct(n) {
    return Math.round(Math.max(0, Math.min(1, n)) * 100) + "%";
  }

  function fbDimReason(key, stats, coverage, cues, cueHits, spelling, grammar, mechanics) {
    if (key === "content") {
      return "词数 " + stats.wc + "；段落 " + stats.paras.length + "；主题词覆盖 " + fbPct(coverage) +
        (cues.length ? "；信息点命中 " + cueHits.length + " / " + cues.length : "");
    }
    if (key === "format") {
      return "称呼、结尾、署名、语气按项检查";
    }
    if (key === "structure") {
      return "段落 " + stats.paras.length + "；连接词 " + stats.connectives.length + " 类；段长占比 " + fbPct(fbParagraphBalance(stats.text || ""));
    }
    if (key === "language") {
      return "平均句长 " + stats.avgSent.toFixed(1) + "；复杂句 " + stats.complexCount + "；词汇多样性 " + fbPct(stats.uniqueRatio);
    }
    if (key === "accuracy") {
      return "拼写/语法/规范问题 " + (spelling.length + grammar.length + mechanics.length) + " 处";
    }
    return "";
  }

  function writingFeedback(text, opts) {
    const kind = opts.kind || "small";
    const item = opts.item || {};
    const dims = opts.dims || [];
    const max = opts.max || dims.reduce(function (s, d) { return s + d.max; }, 0);
    const target = opts.target || (kind === "small" ? 100 : 160);
    const stats = fbStats(text);
    stats.text = text;
    const coverage = fbCoverage(text, item.sample || "");
    const format = fbFormatChecks(text, item, kind);
    const cues = SMALL_TYPE_CUES[item.type] || [];
    const cueHits = cues.filter(function (c) { return fbHas(text, c); });
    const analysisHits = FB_ANALYSIS.filter(function (c) { return fbHas(text, c); }).length;
    const suggestionHits = FB_SUGGESTION.filter(function (c) { return fbHas(text, c); }).length;
    const descriptionHits = FB_DESCRIPTION.filter(function (c) { return fbHas(text, c); }).length;
    const spelling = fbSpellingIssues(text);
    const grammar = fbGrammarIssues(text);
    const mechanics = fbMechanicsIssues(text, { skipFinal: kind === "small" && format.hasSignature });
    const issues = [];
    const scores = {};
    const politeRequired = ["建议信", "感谢信", "投诉信", "邀请信", "道歉信", "申请信", "咨询信", "推荐信", "回复信"].indexOf(item.type) !== -1;
    const dim = function (key) { return dims.find(function (d) { return d.key === key; }) || { max: 0 }; };

    if (!String(text || "").trim()) {
      dims.forEach(function (d) { scores[d.key] = 0; });
      issues.push(fbIssue("high", "内容", "还没有写", "先写一版，再让检查器给出结构和语言问题。", ""));
    } else {
      // 内容
      let content = 0;
      if (stats.wc >= target * 0.8) content += 2;
      else if (stats.wc >= target * 0.6) content += 1.5;
      else if (stats.wc >= target * 0.4) content += 1;
      else content += 0.5;
      if (kind === "small") {
        if (cueHits.length >= 3) content += 2;
        else if (cueHits.length === 2) content += 1.5;
        else if (cueHits.length === 1) content += 1;
        if (format.hasDetails) content += 1;
        if (coverage >= 0.3) content += 1;
        else if (coverage >= 0.15) content += 0.5;
      } else {
        if (stats.paras.length >= 3) content += 1;
        else if (stats.paras.length === 2) content += 0.5;
        if (coverage >= 0.4) content += 1.5;
        else if (coverage >= 0.25) content += 1;
        else if (coverage >= 0.15) content += 0.5;
        if (analysisHits >= 3) content += 1;
        else if (analysisHits >= 1) content += 0.5;
        if (suggestionHits >= 2) content += 0.5;
        else if (suggestionHits >= 1) content += 0.25;
        if (descriptionHits >= 1) content += 0.5;
      }
      scores.content = Math.min(dim("content").max, Math.round(content));
      if (stats.wc < target * 0.4) scores.content = Math.min(scores.content, Math.max(1, Math.round(dim("content").max * 0.4)));

      // 格式（小作文）
      if (dim("format").max) {
        let f = 0;
        if (format.isNotice) {
          if (format.hasNoticeHeading) f += 0.75;
          if (format.hasSignature || format.hasDate) f += 0.5;
          if (format.hasPurpose) f += 0.75;
        } else {
          if (format.hasDear) f += 0.5;
          if (format.hasClosing) f += 0.5;
          if (format.hasSignature) f += 0.5;
          if (format.hasPolite) f += 0.5;
          if (format.orgSignature) f += 0.5;
        }
        scores.format = Math.max(0, Math.min(dim("format").max, Math.round(f)));
      }

      // 结构（大作文）
      if (dim("structure").max) {
        let s = 0;
        if (stats.paras.length >= 3) s += 3;
        else if (stats.paras.length === 2) s += 2;
        else s += 1;
        if (stats.connectives.length >= 5) s += 1.5;
        else if (stats.connectives.length >= 3) s += 1;
        else if (stats.connectives.length >= 1) s += 0.5;
        if (stats.paras.length >= 2 && fbParagraphBalance(text) <= 0.65) s += 0.5;
        scores.structure = Math.max(0, Math.min(dim("structure").max, Math.round(s)));
      }

      // 语言
      let language = 1;
      if (stats.avgSent >= 10 && stats.avgSent <= 24) language += 0.75;
      else if (stats.avgSent >= 8 && stats.avgSent <= 30) language += 0.4;
      if (stats.longRatio >= 0.1 && stats.longRatio <= 0.5) language += 0.5;
      if (stats.shortRatio >= 0.1 && stats.shortRatio <= 0.6) language += 0.5;
      if (stats.complexCount >= 3) language += 1;
      else if (stats.complexCount >= 2) language += 0.75;
      else if (stats.complexCount >= 1) language += 0.4;
      if (stats.uniqueRatio >= 0.45) language += 0.5;
      else if (stats.uniqueRatio >= 0.35) language += 0.25;
      if (stats.connectives.length >= 3) language += 0.5;
      else if (stats.connectives.length >= 2) language += 0.25;
      if (stats.cliches.length) language -= 0.5;
      if (stats.contractions.length) language -= 0.5;
      if (stats.repeats.length) language -= 0.25;
      if (stats.chinese) language -= 0.5;
      if (stats.wc < target * 0.4) language = Math.min(language, 1);
      if (stats.avgSent < 8 && stats.complexCount === 0) language = Math.min(language, 1);
      scores.language = Math.max(0, Math.min(dim("language").max, Math.round(language)));

      // 语法与拼写
      const high = spelling.length + grammar.filter(function (g) { return g.level === "high"; }).length + mechanics.filter(function (m) { return m.level === "high"; }).length;
      const mid = grammar.filter(function (g) { return g.level === "mid"; }).length + mechanics.filter(function (m) { return m.level === "mid"; }).length;
      const low = mechanics.filter(function (m) { return m.level === "low"; }).length;
      const quality = Math.max(0, 1 - Math.min(1, high * 0.28 + mid * 0.12 + low * 0.05 + (stats.chinese ? 0.5 : 0)));
      scores.accuracy = Math.max(0, Math.min(dim("accuracy").max, Math.round(dim("accuracy").max * quality)));

      // 问题清单
      if (stats.wc < target * 0.7) issues.push(fbIssue("high", "内容", "字数偏少", "目标约 " + target + " 词，当前 " + stats.wc + " 词。先补足信息点，再润色语言。", ""));
      else if (stats.wc > target * 1.5) issues.push(fbIssue("mid", "内容", "篇幅偏长", "当前 " + stats.wc + " 词，目标约 " + target + " 词。检查是否有重复解释。", ""));

      if (kind === "small") {
        if (!format.isNotice && !format.hasDear) issues.push(fbIssue("high", "格式", "缺少称呼", "书信开头用 Dear ...；不知道姓名时用 Dear Sir or Madam。", fbExcerpt(text, format.first, 56)));
        if (!format.isNotice && !format.hasClosing && !format.orgSignature) issues.push(fbIssue("high", "格式", "缺少结尾敬语", "根据收信人使用 Yours sincerely / Yours faithfully。", fbTail(text, 56)));
        if (!format.isNotice && !format.hasSignature) issues.push(fbIssue("mid", "格式", "缺少署名", "结尾另起一行写 Li Ming 或题目指定姓名。", fbTail(text, 56)));
        if (format.isNotice && !format.hasNoticeHeading) issues.push(fbIssue("high", "格式", "缺少 NOTICE 标题", "通知通常以 NOTICE 居中开头，再写正文。", fbExcerpt(text, format.first, 56)));
        if (!format.hasPurpose) issues.push(fbIssue("mid", "内容", "写信目的不够明确", "开头直接说明为什么写这封信，不要绕背景。", ""));
        if (politeRequired && !format.hasPolite) issues.push(fbIssue("mid", "语气", "语气偏直接", "加入 I would be grateful / Could you please 等礼貌表达。", ""));
        if (cueHits.length < 2 && coverage < 0.25) {
          issues.push(fbIssue("mid", "内容", "信息点可能不完整", (SMALL_TYPE_HINTS[item.type] || "按题目要求补齐时间、地点、原因、请求等细节") + "。", ""));
        }
      } else {
        if (stats.paras.length < 3) issues.push(fbIssue("high", "结构", "段落层次不足", "大作文建议三段：描述/分析/建议。当前 " + stats.paras.length + " 段。", ""));
        if (coverage < 0.15 && stats.wc >= 60) issues.push(fbIssue("mid", "内容", "主题词覆盖偏低", "与范文主题词重合较少，检查是否偏题；如果你用了同义改写，可忽略此条。", ""));
      }

      if (kind !== "small" && stats.connectives.length < 3) issues.push(fbIssue("mid", "结构", "逻辑连接偏少", "尝试用 however / therefore / while 等把句子关系说清楚，不要每句都加。", ""));
      if (kind !== "small" && stats.complexCount === 0) issues.push(fbIssue("mid", "语言", "句式偏单一", "加入一个定语从句、状语从句或非谓语结构，但不要冒险写没把握的句子。", ""));
      if (stats.avgSent > 30) issues.push(fbIssue("mid", "语言", "长句偏多", "平均句长 " + stats.avgSent.toFixed(1) + " 词，适当拆成短句，考场上更稳。", ""));
      if (stats.repeats.length) {
        issues.push(fbIssue("mid", "语言", "高频词重复", stats.repeats.map(function (r) { return r.word + " ×" + r.count; }).join("；") + "。换用同义表达或代词。", ""));
      }
      if (stats.cliches.length) issues.push(fbIssue("mid", "语言", "模板化表达", stats.cliches.slice(0, 3).join("；") + "。换成具体背景或具体动作。", ""));
      if (stats.contractions.length) issues.push(fbIssue("mid", "语言", "正式写作避免缩写", stats.contractions.slice(0, 3).join("；") + "。写成完整形式。", ""));

      spelling.slice(0, 3).forEach(function (x) { issues.push(x); });
      grammar.slice(0, 3).forEach(function (x) { issues.push(x); });
      mechanics.slice(0, 3).forEach(function (x) { issues.push(x); });
    }

    const good = [];
    if (String(text || "").trim()) {
      if (stats.wc >= target * 0.8 && stats.wc <= target * 1.5) good.push(fbIssue("good", "内容", "字数在目标范围", "当前 " + stats.wc + " 词，符合 " + target + " 词左右的要求。", ""));
      if (kind === "big" && stats.paras.length >= 3) good.push(fbIssue("good", "结构", "段落层次清楚", "已经分成 " + stats.paras.length + " 段，便于展开描述、分析和建议。", ""));
      if (kind === "small" && stats.paras.length >= 2) good.push(fbIssue("good", "结构", "分段清楚", "正文没有挤成一段，读者更容易抓住信息点。", ""));
      if (stats.connectives.length >= 4) good.push(fbIssue("good", "结构", "逻辑连接有变化", "使用了 " + stats.connectives.length + " 类连接表达，句间关系比较清楚。", ""));
      if (stats.complexCount >= 2) good.push(fbIssue("good", "语言", "有复杂句尝试", "出现了 " + stats.complexCount + " 个含从句或复杂结构的句子。", ""));
      if (coverage >= 0.3) good.push(fbIssue("good", "内容", "主题词覆盖较好", "与范文主题词覆盖 " + fbPct(coverage) + "，偏题风险较低。", ""));
    }
    if (!issues.length && good.length === 0) good.push(fbIssue("good", "整体", "没有发现明显的表面问题", "继续对照范文检查内容深度、论证和逻辑。", ""));

    const dimRows = dims.map(function (d) {
      return {
        key: d.key,
        label: d.label,
        max: d.max,
        score: Math.max(0, Math.min(d.max, Number(scores[d.key]) || 0)),
        reason: fbDimReason(d.key, stats, coverage, cues, cueHits, spelling, grammar, mechanics)
      };
    });
    const total = dimRows.reduce(function (s, d) { return s + d.score; }, 0);
    const highCount = issues.filter(function (x) { return x.level === "high"; }).length;
    const midCount = issues.filter(function (x) { return x.level === "mid"; }).length;
    const report = {
      id: opts.id || "draft:" + (opts.key || ""),
      key: opts.key || "",
      kind: kind,
      title: kind === "small" ? "小作文自动检查" : "大作文自动检查",
      total: total,
      max: max,
      dims: dimRows,
      stats: {
        wc: stats.wc,
        paras: stats.paras.length,
        sents: stats.sents.length,
        avgSent: stats.avgSent,
        connectives: stats.connectives.length,
        coverage: coverage,
        uniqueRatio: stats.uniqueRatio,
        errors: spelling.length + grammar.length + mechanics.length
      },
      issues: fbSortIssues(issues).slice(0, 10),
      good: good.slice(0, 3),
      highCount: highCount,
      midCount: midCount,
      suggested: dimRows.reduce(function (o, d) { o[d.key] = d.score; return o; }, {})
    };
    const plain = [];
    plain.push("研墨 · " + report.title);
    plain.push("建议分：" + total + " / " + max);
    plain.push("词数：" + stats.wc + "；段落：" + stats.paras.length + "；平均句长：" + stats.avgSent.toFixed(1) + "；主题词覆盖：" + fbPct(coverage));
    dimRows.forEach(function (d) { plain.push(d.label + "：" + d.score + " / " + d.max + "（" + d.reason + "）"); });
    if (report.good.length) {
      plain.push("做得好的地方：");
      report.good.forEach(function (x) { plain.push("- " + x.title + "：" + x.detail); });
    }
    if (report.issues.length) {
      plain.push("需要处理：");
      report.issues.forEach(function (x) { plain.push("- [" + x.level + "] " + x.title + "：" + x.detail + (x.excerpt ? "（" + x.excerpt + "）" : "")); });
    }
    plain.push("说明：离线初检只判断字数、结构、连接、拼写等可计算特征；内容深度和逻辑仍以老师/自评为准。");
    report.plain = plain.join("\n");
    return report;
  }

  function fbTermHit(text, cn) {
    const t = String(text || "").replace(/\s/g, "");
    const clean = String(cn || "").replace(/[（(][^）)]*[）)]/g, "").replace(/[“”"'‘’]/g, "").trim();
    if (!clean) return false;
    if (t.indexOf(clean) !== -1) return true;
    const parts = clean.split(/[\/、；;，,]/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length >= 2; });
    if (parts.some(function (p) { return t.indexOf(p) !== -1; })) return true;
    if (clean.length >= 3) {
      if (t.indexOf(clean.slice(0, 2)) !== -1) return true;
      if (t.indexOf(clean.slice(-2)) !== -1) return true;
    }
    return false;
  }

  function fbChineseBigrams(text) {
    const chars = Array.from(String(text || "").replace(/[^\u4e00-\u9fa5]/g, ""));
    const set = new Set();
    for (let i = 0; i < chars.length - 1; i++) set.add(chars[i] + chars[i + 1]);
    return set;
  }

  function fbDice(a, b) {
    const A = fbChineseBigrams(a);
    const B = fbChineseBigrams(b);
    if (!A.size || !B.size) return 0;
    let inter = 0;
    A.forEach(function (x) { if (B.has(x)) inter++; });
    return 2 * inter / (A.size + B.size);
  }

  function fbPunctuationIssues(text) {
    const out = [];
    const t = String(text || "");
    if (/[\u4e00-\u9fa5][,;:][\u4e00-\u9fa5]/.test(t)) out.push(fbIssue("mid", "规范", "中文之间用了英文标点", "逗号、分号、冒号改成中文标点。", fbExcerpt(t, (t.match(/[\u4e00-\u9fa5][,;:][\u4e00-\u9fa5]/) || [""])[0], 40)));
    if (/[\u4e00-\u9fa5]\.(?:\s|$)/.test(t)) out.push(fbIssue("mid", "规范", "中文句末用了英文句号", "句号改成“。”。", ""));
    if (countChars(t) > 30 && !/[。！？；]/.test(t)) out.push(fbIssue("mid", "规范", "缺少中文断句", "长译文没有句号或分号，读起来容易喘不过气。", ""));
    if (/[\u4e00-\u9fa5]\s+[\u4e00-\u9fa5]/.test(t)) out.push(fbIssue("low", "规范", "汉字之间多了空格", "中文正文不需要在字与字之间加空格。", ""));
    if ((t.match(/\(/g) || []).length !== (t.match(/\)/g) || []).length) out.push(fbIssue("low", "规范", "括号不配对", "检查左右括号是否成对。", ""));
    return out;
  }

  function fbTranslationIssues(text, stats, terms, coverage, overlap) {
    const issues = [];
    if (!String(text || "").trim()) {
      issues.push(fbIssue("high", "内容", "还没有写译文", "先自己译一遍，再对照参考译文检查。", ""));
      return issues;
    }
    if (stats.english.length) {
      issues.push(fbIssue("high", "内容", "还有英文未译", stats.english.slice(0, 4).join("、") + "。确认是否为有意保留的术语；否则译成中文。", ""));
    }
    if (stats.cnChars === 0) issues.push(fbIssue("high", "内容", "译文里没有中文", "这段练习要求译成中文，不是英文复述。", ""));
    if (stats.ratio < 0.5) issues.push(fbIssue("high", "内容", "译文明显偏短", "当前 " + stats.chars + " 字，参考约 " + stats.refChars + " 字，可能漏译。", ""));
    else if (stats.ratio > 1.8) issues.push(fbIssue("mid", "内容", "译文明显偏长", "当前 " + stats.chars + " 字，参考约 " + stats.refChars + " 字，检查是否重复解释。", ""));
    if (terms.length && coverage < 1) {
      const miss = terms.filter(function (t) { return !t.hit; });
      issues.push(fbIssue(coverage < 0.5 ? "high" : "mid", "内容", "可能漏译的术语", miss.slice(0, 5).map(function (t) { return t.en + "（" + t.cn + "）"; }).join("；") + "。同义改写可忽略。", ""));
    }
    if (stats.sents.length < Math.max(1, stats.refSents * 0.6)) {
      issues.push(fbIssue("mid", "语言", "断句偏少", "当前 " + stats.sents.length + " 句，参考约 " + stats.refSents + " 句。适当拆句，避免一句到底。", ""));
    }
    if (stats.maxSent > 100) issues.push(fbIssue("mid", "语言", "单句过长", "最长一句约 " + stats.maxSent + " 字，中文里适当断开。", ""));
    if (stats.deRatio > 0.14 && stats.cnChars > 40) issues.push(fbIssue("low", "语言", "“的”字偏多", "“的”字密度约 " + fbPct(stats.deRatio) + "，试着把名词化结构改成动词或短句。", ""));
    if (stats.repeated.length) issues.push(fbIssue("low", "规范", "连续重复字", stats.repeated.slice(0, 4).join("、") + "。检查是否笔误或表达啰嗦。", ""));
    fbPunctuationIssues(text).forEach(function (x) { issues.push(x); });
    if (coverage < 0.5 && overlap < 0.15) issues.push(fbIssue("low", "内容", "与参考表达重合较低", "可能是同义改写，也可能是漏掉了关键结构；对照参考译文再确认。", ""));
    return issues;
  }

  function translationFeedback(text, entry, key) {
    const isPassage = String(key || "").charAt(0) === "p";
    const ref = (entry && entry.ref) || "";
    const t = String(text || "");
    const chars = countChars(t);
    const refChars = countChars(ref);
    const cnChars = (t.match(/[\u4e00-\u9fa5]/g) || []).length;
    const sents = t.split(/[。！？!?；;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    const refSents = ref.split(/[。！？!?；;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    const english = Array.from(new Set((t.match(/[A-Za-z]{4,}/g) || []).map(function (w) { return w; })));
    const maxSent = sents.length ? Math.max.apply(null, sents.map(function (s) { return countChars(s); })) : 0;
    const deRatio = cnChars ? (t.match(/的/g) || []).length / cnChars : 0;
    const repeated = Array.from(new Set((t.match(/([\u4e00-\u9fa5])\1{2,}/g) || [])));
    const stats = {
      chars: chars,
      refChars: refChars,
      cnChars: cnChars,
      ratio: refChars ? chars / refChars : 0,
      sents: sents,
      refSents: refSents.length,
      maxSent: maxSent,
      deRatio: deRatio,
      repeated: repeated,
      english: english
    };
    // 词表是提示，不是官方采分点。只把参考译文里确实出现的表达计入覆盖率，
    // 避免参考译文本身被同义改写误判为“漏译”。
    const terms = ((entry && entry.words) || []).map(function (w) {
      return { en: w[0], cn: w[1], hit: fbTermHit(t, w[1]), required: fbTermHit(ref, w[1]) };
    }).filter(function (x) { return x.required; });
    const coverage = terms.length ? terms.filter(function (x) { return x.hit; }).length / terms.length : 1;
    const overlap = fbDice(t, ref);
    let lengthQuality = 1;
    if (stats.ratio < 0.35 || stats.ratio > 2.2) lengthQuality = 0.15;
    else if (stats.ratio < 0.5 || stats.ratio > 1.8) lengthQuality = 0.45;
    else if (stats.ratio < 0.7 || stats.ratio > 1.5) lengthQuality = 0.7;
    else if (stats.ratio < 0.8 || stats.ratio > 1.35) lengthQuality = 0.85;
    let accuracyQuality = 1;
    if (english.length) accuracyQuality -= Math.min(0.5, english.length * 0.15);
    if (cnChars === 0 && t.trim()) accuracyQuality = 0;
    const punct = fbPunctuationIssues(t);
    accuracyQuality -= punct.filter(function (x) { return x.level === "mid"; }).length * 0.07;
    accuracyQuality -= punct.filter(function (x) { return x.level === "low"; }).length * 0.03;
    accuracyQuality -= repeated.length * 0.04;
    if (maxSent > 100) accuracyQuality -= 0.1;
    accuracyQuality = Math.max(0, Math.min(1, accuracyQuality));
    const quality = coverage * 0.55 + lengthQuality * 0.2 + accuracyQuality * 0.25;
    let suggested = isPassage ? Math.round(quality * 15 * 2) / 2 : null;
    if (isPassage) {
      if (cnChars === 0 && t.trim()) suggested = 0;
      if (english.length) suggested = Math.min(suggested, 8);
      if (stats.ratio < 0.35) suggested = Math.min(suggested, 2);
      else if (stats.ratio < 0.5) suggested = Math.min(suggested, 5);
    }
    const issues = fbTranslationIssues(t, stats, terms, coverage, overlap);
    const hasHigh = issues.some(function (x) { return x.level === "high"; });
    const good = [];
    if (t.trim()) {
      if (terms.length && coverage >= 0.8) good.push(fbIssue("good", "内容", "术语覆盖较好", "参考术语命中 " + terms.filter(function (x) { return x.hit; }).length + " / " + terms.length + "。", ""));
      if (!hasHigh && stats.ratio >= 0.7 && stats.ratio <= 1.4) good.push(fbIssue("good", "内容", "篇幅接近参考", "当前 " + chars + " 字，参考约 " + refChars + " 字。", ""));
      if (!english.length && cnChars > 0) good.push(fbIssue("good", "内容", "没有残留英文", "译文完整使用中文表达。", ""));
      if (!hasHigh && stats.sents.length >= Math.max(1, stats.refSents * 0.7)) good.push(fbIssue("good", "语言", "断句基本合理", "当前 " + stats.sents.length + " 句，参考约 " + stats.refSents + " 句。", ""));
      if (!hasHigh && coverage >= 0.6 && overlap >= 0.4) good.push(fbIssue("good", "语言", "参考表达重合较高", "与参考译文的用词和结构接近。", ""));
    }
    if (!issues.length && !good.length) good.push(fbIssue("good", "整体", "没有发现明显的表面问题", "继续对照参考译文检查语气和细节。", ""));
    const report = {
      id: "trans:" + key,
      key: key,
      isPassage: isPassage,
      title: isPassage ? "段落翻译自动检查" : "句子翻译自动检查",
      suggested: suggested,
      max: isPassage ? 15 : null,
      terms: terms,
      coverage: coverage,
      overlap: overlap,
      stats: stats,
      issues: fbSortIssues(issues).slice(0, 10),
      good: good.slice(0, 3),
      highCount: issues.filter(function (x) { return x.level === "high"; }).length,
      midCount: issues.filter(function (x) { return x.level === "mid"; }).length
    };
    const plain = [];
    plain.push("研墨 · " + report.title);
    if (isPassage) plain.push("机器建议分：" + suggested + " / 15");
    plain.push("字数：" + chars + "；参考：" + refChars + " 字；句数：" + sents.length + "；参考句数：" + refSents.length);
    plain.push(terms.length ? "术语覆盖：" + terms.filter(function (x) { return x.hit; }).length + " / " + terms.length + "；参考表达重合：" + fbPct(overlap) : "术语表：参考译文没有可直接核对的词对；参考表达重合：" + fbPct(overlap));
    if (terms.length) plain.push("术语：" + terms.map(function (x) { return x.en + "（" + x.cn + "）" + (x.hit ? "已覆盖" : "可能漏译"); }).join("；"));
    if (report.good.length) {
      plain.push("做得好的地方：");
      report.good.forEach(function (x) { plain.push("- " + x.title + "：" + x.detail); });
    }
    if (report.issues.length) {
      plain.push("需要处理：");
      report.issues.forEach(function (x) { plain.push("- [" + x.level + "] " + x.title + "：" + x.detail + (x.excerpt ? "（" + x.excerpt + "）" : "")); });
    }
    plain.push("说明：机器只检查术语、完整度、断句和标点，语义准确度仍需对照参考译文。");
    report.plain = plain.join("\n");
    return report;
  }

  function feedbackIssuesHtml(report) {
    const items = [];
    report.issues.forEach(function (x) {
      items.push('<div class="check-issue ' + x.level + '"><span class="check-tag">' + (x.level === "high" ? "高" : x.level === "mid" ? "中" : "低") + '</span><div><b>' + esc(x.title) + '</b><p>' + esc(x.detail) + (x.excerpt ? '<em>“' + esc(x.excerpt) + '”</em>' : "") + '</p></div></div>');
    });
    report.good.forEach(function (x) {
      items.push('<div class="check-issue good"><span class="check-tag">好</span><div><b>' + esc(x.title) + '</b><p>' + esc(x.detail) + '</p></div></div>');
    });
    return items.join("");
  }

  function feedbackStatsHtml(items) {
    return '<div class="check-stats">' + items.map(function (x) {
      return '<div class="check-stat"><b>' + esc(x[1]) + '</b><span>' + esc(x[0]) + '</span></div>';
    }).join("") + '</div>';
  }

  function writingFeedbackHtml(report, opts) {
    const allowApply = !opts || opts.apply !== false;
    const dims = report.dims.map(function (d) {
      const pct = d.max ? Math.round(d.score / d.max * 100) : 0;
      return '<div class="check-dim" title="' + esc(d.reason) + '"><span>' + esc(d.label) + '</span><span class="check-bar"><i style="width:' + pct + '%"></i></span><b>' + d.score + ' / ' + d.max + '</b></div>';
    }).join("");
    const summary = report.highCount
      ? "先处理 " + report.highCount + " 个高优先级问题"
      : (report.midCount ? "再优化 " + report.midCount + " 个中优先级问题" : "表面问题较少，继续打磨内容");
    return '<div class="check-summary"><div><span>机器建议分</span><b>' + report.total + ' / ' + report.max + '</b></div><span>' + esc(summary) + '</span></div>' +
      feedbackStatsHtml([
        ["词数", String(report.stats.wc)],
        ["段落", String(report.stats.paras)],
        ["平均句长", report.stats.avgSent.toFixed(1)],
        ["主题覆盖", fbPct(report.stats.coverage)]
      ]) +
      '<div class="check-dims">' + dims + '</div>' +
      '<div class="check-issues">' + feedbackIssuesHtml(report) + '</div>' +
      '<div class="check-actions">' + (allowApply ? '<button class="text-link" data-action="apply-draft-score" data-id="' + esc(report.id) + '">把建议分填入自评</button>' : '') + '<button class="text-link muted" data-action="copy-feedback" data-id="' + esc(report.id) + '">复制报告</button></div>' +
      '<p class="check-note">离线初检只判断字数、结构、连接、拼写等可计算特征；内容深度和逻辑仍以老师/自评为准。</p>';
  }

  function translationFeedbackHtml(report) {
    const terms = report.terms.map(function (t) {
      return '<span class="check-term ' + (t.hit ? "on" : "off") + '">' + esc(t.en) + ' · ' + esc(t.cn) + '</span>';
    }).join("");
    const summary = report.isPassage
      ? '<div class="check-summary"><div><span>机器建议分</span><b>' + report.suggested + ' / 15</b></div><span>' + esc(report.highCount ? "先处理 " + report.highCount + " 个高优先级问题" : (report.midCount ? "再优化 " + report.midCount + " 个中优先级问题" : "完整度与术语覆盖较好")) + '</span></div>'
      : '<div class="check-summary"><div><span>术语覆盖</span><b>' + (report.terms.length ? Math.round(report.coverage * 100) + "%" : "—") + '</b></div><span>' + esc(report.highCount ? "先处理 " + report.highCount + " 个高优先级问题" : "继续对照参考译文") + '</span></div>';
    return summary +
      feedbackStatsHtml([
        ["字数", String(report.stats.chars)],
        ["参考字数", String(report.stats.refChars)],
        ["句数", String(report.stats.sents.length)],
        ["参考重合", fbPct(report.overlap)]
      ]) +
      (terms ? '<div class="check-terms">' + terms + '</div>' : "") +
      '<div class="check-issues">' + feedbackIssuesHtml(report) + '</div>' +
      '<div class="check-actions"><button class="text-link muted" data-action="copy-feedback" data-id="' + esc(report.id) + '">复制报告</button></div>' +
      '<p class="check-note">机器只检查术语、完整度、断句和标点；语义准确度仍需对照参考译文。</p>';
  }

  function runDraftFeedback(key, kind, i) {
    const ta = document.querySelector('[data-draft="' + key + '"]');
    const text = ta ? ta.value : (state.drafts[key] || "");
    const item = (window.WRITING[kind] || [])[i] || {};
    const dims = draftSelfDims(kind);
    const max = dims.reduce(function (s, d) { return s + d.max; }, 0);
    const target = kind === "small" ? 100 : 160;
    const report = writingFeedback(text, { kind: kind, item: item, dims: dims, max: max, target: target, key: key, id: "draft:" + key });
    feedbackCache[report.id] = report;
    const box = document.querySelector('[data-draft-result="' + key + '"]');
    if (box) {
      box.classList.remove("stale");
      box.innerHTML = writingFeedbackHtml(report);
    }
  }

  function runTransFeedback(key) {
    const ta = document.querySelector('[data-trans-input="' + key + '"]');
    const text = ta ? ta.value : transValue(key);
    const entry = transEntryByKey(key);
    if (!entry) return;
    const report = translationFeedback(text, entry, key);
    feedbackCache[report.id] = report;
    const box = document.querySelector('[data-trans-result="' + key + '"]');
    if (box) {
      box.classList.remove("stale");
      box.innerHTML = translationFeedbackHtml(report);
    }
  }

  function markCheckStale(selector) {
    const box = document.querySelector(selector);
    if (box && String(box.innerHTML || "").trim()) box.classList.add("stale");
  }

  function runExamWritingFeedback(recId, kind) {
    const rec = state.exams.find(function (r) { return String(r.id) === String(recId); });
    if (!rec) return;
    const paper = mockPaper(rec.paperId);
    if (!paper) return;
    const type = mockType(paper.type);
    const isA = kind === "wa";
    const item = isA ? (window.WRITING.small || [])[paper.writing.small] : (window.WRITING.big || [])[paper.writing.big];
    const text = isA ? rec.answers.writingA : rec.answers.writingB;
    const dims = isA ? WRITING_A_DIMS : writingBDims(paper);
    const max = isA ? type.writingA : type.writingB;
    const target = isA ? 100 : (parseInt(type.writingWords, 10) || 160);
    const report = writingFeedback(text, {
      kind: isA ? "small" : "big",
      item: item || {},
      dims: dims,
      max: max,
      target: target,
      key: rec.id + "-" + kind,
      id: "exam:" + rec.id + ":" + kind
    });
    feedbackCache[report.id] = report;
    const box = document.querySelector('[data-exam-writing-result="' + rec.id + "-" + kind + '"]');
    if (box) box.innerHTML = writingFeedbackHtml(report, { apply: false });
  }

  function runExamTransFeedback(recId, which) {
    const rec = state.exams.find(function (r) { return String(r.id) === String(recId); });
    if (!rec) return;
    const paper = mockPaper(rec.paperId);
    if (!paper) return;
    let entry = null;
    let text = "";
    let key = "";
    let boxKey = "";
    if (which === "p") {
      entry = transEntryByKey("p" + paper.translation.id);
      text = rec.answers.translation || "";
      key = "p" + paper.translation.id + "@" + rec.id;
      boxKey = rec.id + "-p";
    } else {
      const i = Number(which);
      const id = (paper.translation.ids || [])[i];
      entry = (window.TRANSLATIONS.sentences || []).find(function (s) { return s.id === Number(id); });
      text = (rec.answers.translationS || [])[i] || "";
      key = "s" + id + "@" + rec.id;
      boxKey = rec.id + "-s" + i;
    }
    if (!entry) return;
    const report = translationFeedback(text, entry, key);
    feedbackCache[report.id] = report;
    const box = document.querySelector('[data-exam-trans-result="' + boxKey + '"]');
    if (box) box.innerHTML = translationFeedbackHtml(report);
  }

  /* ------------------------------------------------------------------
     mock exam
  ------------------------------------------------------------------ */

  function writingBDims(paper) {
    const en1 = paper && paper.type === "en1";
    return [
      { key: "content", label: "内容与切题", max: en1 ? 6 : 5, hint: "描述准确、分析有因果、结论回应题目" },
      { key: "structure", label: "结构与连贯", max: en1 ? 5 : 4, hint: "三段清晰，段内有层次，衔接自然" },
      { key: "language", label: "语言与句式", max: en1 ? 5 : 4, hint: "用词准确，句式有变化，不堆模板" },
      { key: "accuracy", label: "语法与拼写", max: en1 ? 4 : 2, hint: "错误是否影响理解" }
    ];
  }

  function emptyExamAnswers(paper) {
    const reading = {};
    (paper ? paper.readings : []).forEach(function (id) {
      reading[String(id)] = [null, null, null, null, null];
    });
    return {
      cloze: new Array(EXAM_CLOZE_COUNT).fill(null),
      reading: reading,
      newtype: new Array(EXAM_NEWTYPE_COUNT).fill(null),
      translation: "",
      translationS: ["", "", "", "", ""],
      writingA: "",
      writingB: ""
    };
  }

  function normalizeExamAnswers(raw, paper) {
    const base = emptyExamAnswers(paper);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;
    const cloze = Array.isArray(raw.cloze) ? raw.cloze : [];
    for (let i = 0; i < EXAM_CLOZE_COUNT; i++) {
      const rawV = cloze[i];
      const v = rawV == null || rawV === "" ? NaN : Number(rawV);
      base.cloze[i] = Number.isInteger(v) && v >= 0 && v <= 3 ? v : null;
    }
    if (raw.reading && typeof raw.reading === "object" && !Array.isArray(raw.reading)) {
      Object.keys(base.reading).forEach(function (id) {
        const src = Array.isArray(raw.reading[id]) ? raw.reading[id] : [];
        base.reading[id] = base.reading[id].map(function (_, i) {
          const rawV = src[i];
          const v = rawV == null || rawV === "" ? NaN : Number(rawV);
          return Number.isInteger(v) && v >= 0 && v <= 3 ? v : null;
        });
      });
    }
    const nt = Array.isArray(raw.newtype) ? raw.newtype : [];
    const ntKind = paper.newtype && paper.newtype.kind;
    for (let i = 0; i < EXAM_NEWTYPE_COUNT; i++) {
      let value = nt[i] == null || nt[i] === "" ? null : nt[i];
      if (value != null) {
        if (ntKind === "heading") {
          if (/^\d+$/.test(String(value))) value = letter(Number(value));
          value = String(value);
        } else if (ntKind === "seven") {
          const num = Number(value);
          if (Number.isInteger(num)) value = num;
        } else if (ntKind === "order") {
          value = String(value);
        }
      }
      base.newtype[i] = value;
    }
    base.translation = typeof raw.translation === "string" ? raw.translation : "";
    const ts = Array.isArray(raw.translationS) ? raw.translationS : [];
    for (let i = 0; i < 5; i++) base.translationS[i] = typeof ts[i] === "string" ? ts[i] : "";
    base.writingA = typeof raw.writingA === "string" ? raw.writingA : "";
    base.writingB = typeof raw.writingB === "string" ? raw.writingB : "";
    return base;
  }

  function normalizeExamActive(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const paper = mockPaper(raw.paperId);
    if (!paper) return null;
    const startedAt = Number(raw.startedAt);
    let endAt = Number(raw.endAt);
    if (!Number.isFinite(startedAt) || !Number.isFinite(endAt)) return null;
    // 设备时钟向前跳变时把结束时间钳制到合法上限；endAt 早于开始或已过期的情况
    // 保持原值，让“剩余 ≤ 0 → 自动交卷”走正常回收路径，避免把已超时的场次“复活”。
    const maxEnd = startedAt + EXAM_TIME * 1000;
    if (endAt > maxEnd) endAt = maxEnd;
    const answers = normalizeExamAnswers(raw.answers, paper);
    const flags = (Array.isArray(raw.flags) ? raw.flags : []).map(Number).filter(function (q) {
      return Number.isInteger(q) && q >= 0 && q < EXAM_OBJECTIVE_COUNT;
    });
    return {
      paperId: paper.id,
      startedAt: startedAt,
      endAt: endAt,
      answers: answers,
      flags: Array.from(new Set(flags)),
      startedLabel: typeof raw.startedLabel === "string" ? raw.startedLabel : ""
    };
  }

  function normalizeExamRecord(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw) || typeof raw.id !== "string") return null;
    const paper = mockPaper(raw.paperId);
    if (!paper) return null;
    const rec = Object.assign({}, raw);
    rec.answers = normalizeExamAnswers(raw.answers, paper);
    rec.flags = (Array.isArray(raw.flags) ? raw.flags : []).map(Number).filter(function (q) {
      return Number.isInteger(q) && q >= 0 && q < EXAM_OBJECTIVE_COUNT;
    });
    rec.self = raw.self && typeof raw.self === "object" ? Object.assign(emptyExamSelf(), raw.self) : emptyExamSelf();
    rec.self.translationPoints = Array.isArray(rec.self.translationPoints)
      ? rec.self.translationPoints.slice(0, 5).map(Boolean)
      : [false, false, false, false, false];
    while (rec.self.translationPoints.length < 5) rec.self.translationPoints.push(false);
    rec.self.translationSentences = Array.isArray(rec.self.translationSentences)
      ? rec.self.translationSentences.slice(0, 5).map(function (x) { return Math.max(0, Math.min(2, Number(x) || 0)); })
      : [0, 0, 0, 0, 0];
    while (rec.self.translationSentences.length < 5) rec.self.translationSentences.push(0);
    rec.submittedAt = Number(rec.submittedAt) || Date.now();
    rec.usedSec = Math.max(0, Math.min(EXAM_TIME, Number(rec.usedSec) || 0));
    rec.objective = Math.max(0, Math.min(60, Number(rec.objective) || 0));
    examRecalc(rec);
    return rec;
  }

  function examRemaining() {
    if (!state.examActive) return 0;
    return Math.max(0, Math.ceil((state.examActive.endAt - Date.now()) / 1000));
  }

  function examUsed(active) {
    const a = active || state.examActive;
    if (!a) return 0;
    return Math.max(0, Math.min(EXAM_TIME, Math.round((Date.now() - a.startedAt) / 1000)));
  }

  function examClock(sec) {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }

  function examQInfo(q) {
    if (q < 20) return { sec: "cloze", index: q, label: "完形" };
    if (q < 40) return { sec: "reading", ri: Math.floor((q - 20) / 5), qi: (q - 20) % 5, label: "阅读" };
    return { sec: "newtype", index: q - 40, label: "新题型" };
  }

  function examAnswerAt(paper, answers, q) {
    const info = examQInfo(q);
    if (info.sec === "cloze") return answers.cloze[q];
    if (info.sec === "newtype") return answers.newtype[info.index];
    const rid = paper.readings[info.ri];
    const arr = answers.reading[String(rid)] || [];
    return arr[info.qi];
  }

  function examSetAnswer(paper, answers, q, value) {
    const info = examQInfo(q);
    if (info.sec === "cloze") { answers.cloze[q] = value; return; }
    if (info.sec === "newtype") { answers.newtype[info.index] = value; return; }
    const rid = paper.readings[info.ri];
    if (!Array.isArray(answers.reading[String(rid)])) answers.reading[String(rid)] = [null, null, null, null, null];
    answers.reading[String(rid)][info.qi] = value;
  }

  function examAnsweredCount(paper, answers) {
    let n = 0;
    for (let q = 0; q < EXAM_OBJECTIVE_COUNT; q++) {
      if (examAnswerAt(paper, answers, q) != null) n++;
    }
    return n;
  }

  function examNewtypeSet(paper) {
    const spec = paper.newtype || {};
    const list = spec.kind === "order" ? orderSets() : (spec.kind === "heading" ? headingSets() : sevenSets());
    const index = Math.min(Math.max(Number(spec.index) || 0, 0), Math.max(0, list.length - 1));
    const set = list[index];
    return set ? { kind: spec.kind || "seven", set: set, index: index } : null;
  }

  function examNewtypeCorrect(paper, i) {
    const nt = examNewtypeSet(paper);
    if (!nt) return null;
    const answer = nt.set.answers[i];
    if (answer == null) return null;
    return nt.kind === "heading" ? letter(answer) : answer;
  }

  function examNewtypeRight(paper, answers, i) {
    const correct = examNewtypeCorrect(paper, i);
    const picked = answers.newtype[i];
    if (picked == null || correct == null) return false;
    return String(picked) === String(correct);
  }

  function examGrade(paper, answers) {
    const out = {
      cloze: { right: 0, total: 20, max: 10, score: 0 },
      reading: { right: 0, total: 20, max: 40, score: 0 },
      newtype: { right: 0, total: 5, max: 10, score: 0 },
      objective: 0, subjective: 0, total: 0
    };
    paper.cloze.forEach(function (ci, pi) {
      const set = clozeSets()[ci];
      if (!set) return;
      set.items.forEach(function (item, ii) {
        const v = answers.cloze[pi * 10 + ii];
        if (v != null && Number(v) === Number(item.answer)) out.cloze.right++;
      });
    });
    paper.readings.forEach(function (rid) {
      const r = (window.READINGS || []).find(function (x) { return x.id === Number(rid); });
      const arr = answers.reading[String(rid)] || [];
      if (!r) return;
      r.questions.forEach(function (q, qi) {
        if (arr[qi] != null && Number(arr[qi]) === Number(q.answer)) out.reading.right++;
      });
    });
    for (let i = 0; i < 5; i++) {
      if (examNewtypeRight(paper, answers, i)) out.newtype.right++;
    }
    out.cloze.score = out.cloze.right * 0.5;
    out.reading.score = out.reading.right * 2;
    out.newtype.score = out.newtype.right * 2;
    out.objective = out.cloze.score + out.reading.score + out.newtype.score;
    return out;
  }

  function examSelfScore(rec, paper) {
    const type = mockType(paper.type);
    const self = rec.self || emptyExamSelf();
    let trans = 0;
    if (paper.translation.kind === "sentences") {
      trans = (self.translationSentences || []).reduce(function (s, x) { return s + Math.max(0, Math.min(2, Number(x) || 0)); }, 0);
    } else {
      const points = (transEntryByKey(paperKeyTranslation(paper)) || {}).points || [];
      const checked = (self.translationPoints || []).filter(Boolean).length;
      trans = points.length ? Math.round(checked / points.length * type.translation * 2) / 2 : 0;
    }
    const sumDims = function (dims, src) {
      return dims.reduce(function (s, d) {
        return s + Math.max(0, Math.min(d.max, Number((src || {})[d.key]) || 0));
      }, 0);
    };
    const wa = sumDims(WRITING_A_DIMS, self.writingA);
    const wb = sumDims(writingBDims(paper), self.writingB);
    return { translation: trans, writingA: wa, writingB: wb, subjective: trans + wa + wb };
  }

  // 自评防误判：某个题目实际没写，却给了分 → 列出来提醒再锁定成绩
  function examSelfIssues(rec, paper) {
    const issues = [];
    const ta = rec.answers, sf = rec.self || {};
    const sumDims = function (dims, src) {
      return dims.reduce(function (s, d) {
        return s + Math.max(0, Math.min(d.max, Number((src || {})[d.key]) || 0));
      }, 0);
    };
    if (paper.translation.kind === "sentences") {
      (sf.translationSentences || []).forEach(function (s, i) {
        if ((Number(s) || 0) > 0 && !String(ta.translationS[i] || "").trim()) issues.push("第 " + (i + 1) + " 句翻译没写却给了分");
      });
    } else if ((sf.translationPoints || []).filter(Boolean).length > 0 && !String(ta.translation || "").trim()) {
      issues.push("整段翻译没写却勾选了采分点");
    }
    if (sumDims(WRITING_A_DIMS, sf.writingA) > 0 && !String(ta.writingA || "").trim()) issues.push("小作文没写却给小作文打了分");
    if (sumDims(writingBDims(paper), sf.writingB) > 0 && !String(ta.writingB || "").trim()) issues.push("大作文没写却给大作文打了分");
    return issues;
  }

  function paperKeyTranslation(paper) {
    return paper.translation.kind === "passage" ? "p" + paper.translation.id : "";
  }

  function examRecalc(rec) {
    const paper = mockPaper(rec.paperId);
    if (!paper) return rec;
    const grade = examGrade(paper, rec.answers);
    const selfScore = examSelfScore(rec, paper);
    rec.objective = grade.objective;
    rec.subjective = selfScore.subjective;
    rec.total = Math.round((rec.objective + rec.subjective) * 10) / 10;
    rec.sections = {
      cloze: grade.cloze.score,
      reading: grade.reading.score,
      newtype: grade.newtype.score,
      translation: selfScore.translation,
      writingA: selfScore.writingA,
      writingB: selfScore.writingB
    };
    rec.rightCounts = { cloze: grade.cloze.right, reading: grade.reading.right, newtype: grade.newtype.right };
    return rec;
  }

  function examScoreText(n) {
    const v = Math.round(Number(n) * 10) / 10;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }

  function examDateText(ts) {
    const d = new Date(Number(ts) || Date.now());
    return ymd(d) + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function examFullLabel(paper) {
    return mockType(paper.type).label + " · " + paper.label + " " + paper.name;
  }

  function examRecordsOf(paperId) {
    return state.exams.filter(function (r) { return r.paperId === paperId; });
  }

  function pageExam() {
    const active = state.examActive ? normalizeExamActive(state.examActive) : null;
    const activePaper = active ? mockPaper(active.paperId) : null;
    const typeKey = state.examType === "en1" ? "en1" : "en2";
    const type = mockType(typeKey);
    const papers = mockPapers().filter(function (p) { return p.type === typeKey; });

    const typeChips = Object.keys(window.MOCK_TYPES || {}).map(function (k) {
      const t = mockType(k);
      return `<button class="chip ${typeKey === k ? "on" : ""}" data-action="exam-type" data-type="${k}">${esc(t.label)}<span class="n">${k === "en1" ? "10+10+20" : "15+10+15"}</span></button>`;
    }).join("");

    const activeBanner = active && activePaper ? `
      <section class="exam-active-banner">
        <div class="exam-active-copy">
          <p class="eyebrow">未交卷</p>
          <h2>${esc(examFullLabel(activePaper))}</h2>
          <p>已进行 ${mmss(examUsed(active))}，${examRemaining() > 0 ? "剩余 " + examClock(examRemaining()) : "已超过考试时间"}。答案保存在本机，刷新页面不会丢失。</p>
        </div>
        <div class="exam-active-actions">
          <a class="btn btn-solid" href="#/exam/run">${examRemaining() > 0 ? "继续答题" : "结束并查看"}</a>
          <button class="text-link muted" data-action="exam-discard" data-id="${esc(active.paperId)}">放弃本次</button>
        </div>
      </section>` : "";

    const cards = papers.map(function (p) {
      const t = mockType(p.type);
      const readings = p.readings.map(function (id) {
        const r = (window.READINGS || []).find(function (x) { return x.id === Number(id); });
        return r ? r.title : "";
      }).filter(Boolean);
      const records = examRecordsOf(p.id);
      const scored = records.filter(function (r) { return r.self && r.self.done; });
      const best = scored.length ? Math.max.apply(null, scored.map(function (r) { return Number(r.total) || 0; })) : null;
      const last = records.length ? records[0] : null;
      const lastDone = !!(last && last.self && last.self.done);
      const lastScore = last ? (lastDone ? last.total : last.objective) : null;
      const nt = p.newtype.kind === "order" ? "排序" : (p.newtype.kind === "heading" ? "小标题" : "七选五");
      return `
        <article class="exam-paper">
          <div class="exam-paper-top">
            <span class="tag hot">${esc(t.label)}</span>
            <span class="exam-paper-no">${esc(p.label)}</span>
          </div>
          <h3>${esc(p.name)}</h3>
          <p class="exam-paper-note">${esc(p.note)}</p>
          <dl class="exam-paper-facts">
            <div><dt>完形</dt><dd>2 篇 · 20 空</dd></div>
            <div><dt>阅读</dt><dd>4 篇 · 20 题</dd></div>
            <div><dt>新题型</dt><dd>${esc(nt)} · 5 题</dd></div>
            <div><dt>翻译</dt><dd>${p.translation.kind === "sentences" ? "5 句" : "1 段"} · ${t.translation} 分</dd></div>
            <div><dt>写作</dt><dd>小 ${t.writingA} + 大 ${t.writingB}</dd></div>
          </dl>
          <p class="exam-paper-readings">${readings.map(esc).join(" / ")}</p>
          <div class="exam-paper-foot">
            <span class="exam-paper-best">${best != null ? "最好 " + examScoreText(best) + " 分" : (last ? "上次 " + examScoreText(lastScore) + " 分" + (lastDone ? "" : "（客观）") : "尚未做过")}</span>
            <button class="btn btn-sm btn-solid" data-action="exam-start" data-id="${esc(p.id)}" ${active ? "disabled" : ""}>${active ? "先完成当前模考" : "开始 180 分钟"}</button>
          </div>
        </article>`;
    }).join("");

    const records = state.exams.slice(0, 10);
    const scored = state.exams.filter(function (r) { return r.self && r.self.done; });
    const bestAll = scored.length ? Math.max.apply(null, scored.map(function (r) { return Number(r.total) || 0; })) : null;
    const recordRows = records.map(function (r) {
      const paper = mockPaper(r.paperId);
      if (!paper) return "";
      return `<tr>
        <td class="num">${esc(examDateText(r.submittedAt).slice(5))}</td>
        <td>${esc(mockType(paper.type).short + " · " + paper.label)}</td>
        <td class="num">${examScoreText(r.objective)} / 60</td>
        <td class="num">${r.self && r.self.done ? examScoreText(r.subjective) + " / 40" : "待自评"}</td>
        <td class="num"><b>${r.self && r.self.done ? examScoreText(r.total) : examScoreText(r.objective)}</b></td>
        <td class="num">${mmss(r.usedSec)}</td>
        <td><a class="text-link" href="#/exam/result/${esc(r.id)}">${r.self && r.self.done ? "看解析" : "去自评"}</a></td>
      </tr>`;
    }).join("");
    const recordBlock = records.length ? `
      <div class="table-wrap">
        <table class="data exam-history-table">
          <thead><tr><th>日期</th><th>卷别</th><th>客观</th><th>主观</th><th>总分</th><th>用时</th><th></th></tr></thead>
          <tbody>${recordRows}</tbody>
        </table>
      </div>
      <p class="mini-note">总分先按客观题计算；完成翻译与写作自评后才是最终成绩。记录只保存在本机浏览器。</p>` : `
      <div class="empty"><p class="mark">卷</p><p>还没有模考记录。选一份卷子，按 180 分钟完整走一遍。</p></div>`;

    return `
      ${pageHead("08", "模考", "全真模考", "一次做完，一次看明白。180 分钟、45 道客观题、翻译与写作自评，成绩与错题都留在本机。")}
      ${activeBanner}

      <section class="exam-intro-panel">
        <div>
          <p class="eyebrow">原创仿真卷</p>
          <h2>按考场顺序，把时间用对</h2>
          <p>完形 15–18 分钟，阅读 65–75 分钟，新题型 15 分钟，翻译 20 分钟，写作 50–55 分钟。中途离开不会暂停计时，交卷前请预留 5 分钟检查答题卡。</p>
        </div>
        <div class="exam-intro-stats">
          <div><b>180</b><span>分钟</span></div>
          <div><b>45</b><span>客观题</span></div>
          <div><b>100</b><span>分制</span></div>
        </div>
      </section>

      <div class="toolbar exam-type-bar">
        <div class="chips">${typeChips}</div>
        <span class="count-line">${esc(type.summary)}</span>
      </div>
      <div class="exam-paper-grid">${cards}</div>

      <details class="acc exam-rules">
        <summary><span class="acc-no">!</span><span class="acc-title">考试规则与答题说明</span><span class="acc-sub">开始前看一遍</span><span class="acc-plus"></span></summary>
        <div class="acc-body">
          <ul class="exam-rule-list">
            <li><b>计时</b>开始后连续计时 180 分钟，时间到自动交卷；刷新、切页、关掉标签页都不会暂停。</li>
            <li><b>客观题</b>完形 20 题（每题 0.5 分）、阅读 20 题（每题 2 分）、新题型 5 题（每题 2 分），共 60 分，交卷即出分。</li>
            <li><b>主观题</b>翻译与写作按采分点、评分维度自评，满分 40 分；自评完成后生成最终总分。</li>
            <li><b>答题卡</b>右侧答题卡可直接跳题；拿不准的题点“标记”，交卷前集中回看。手机上答题卡在页面底部。</li>
            <li><b>材料</b>卷面文章均为原创仿真材料，不冒充历年真题；考试中不提供范文与参考译文。</li>
          </ul>
        </div>
      </details>

      <section class="section">
        <div class="section-head"><h2>模考记录</h2><span class="section-note">${state.exams.length} 次${bestAll != null ? " · 最高 " + examScoreText(bestAll) + " 分" : ""}</span></div>
        ${recordBlock}
      </section>`;
  }


  function examCorrectAt(paper, q) {
    const info = examQInfo(q);
    if (info.sec === "cloze") {
      const pi = Math.floor(q / 10);
      const set = clozeSets()[paper.cloze[pi]];
      const item = set && set.items[q % 10];
      return item ? Number(item.answer) : null;
    }
    if (info.sec === "newtype") return examNewtypeCorrect(paper, info.index);
    const r = (window.READINGS || []).find(function (x) { return x.id === Number(paper.readings[info.ri]); });
    const item = r && r.questions[info.qi];
    return item ? Number(item.answer) : null;
  }

  function examExplainAt(paper, q) {
    const info = examQInfo(q);
    if (info.sec === "cloze") {
      const pi = Math.floor(q / 10);
      const set = clozeSets()[paper.cloze[pi]];
      const item = set && set.items[q % 10];
      return item ? { text: item.explain || "", loc: "第 " + (q + 1) + " 空" } : { text: "", loc: "" };
    }
    if (info.sec === "newtype") {
      const nt = examNewtypeSet(paper);
      if (!nt) return { text: "", loc: "" };
      return { text: (nt.set.explain || [])[info.index] || "", loc: "新题型 第 " + (info.index + 1) + " 题" };
    }
    const r = (window.READINGS || []).find(function (x) { return x.id === Number(paper.readings[info.ri]); });
    const item = r && r.questions[info.qi];
    if (!item) return { text: "", loc: "" };
    const ev = readingEvidence(r.id, info.qi);
    return {
      text: item.explain || "",
      loc: item.loc || "",
      evidence: ev || null,
      rid: r.id,
      qi: info.qi
    };
  }

  function examAnswerText(paper, q, value) {
    if (value == null) return "—";
    const info = examQInfo(q);
    if (info.sec === "newtype") {
      const nt = examNewtypeSet(paper);
      if (nt && nt.kind !== "seven") return String(value);
      return letter(Number(value));
    }
    return letter(Number(value));
  }

  function examQuestionBlock(paper, answers, q, submitted, flags) {
    const info = examQInfo(q);
    const picked = examAnswerAt(paper, answers, q);
    const correct = examCorrectAt(paper, q);
    const flagged = (flags || []).indexOf(q) !== -1;
    const options = (function () {
      let list = [];
      if (info.sec === "reading") {
        const r = (window.READINGS || []).find(function (x) { return x.id === Number(paper.readings[info.ri]); });
        const item = r && r.questions[info.qi];
        list = item ? item.options : [];
      } else if (info.sec === "cloze") {
        const pi = Math.floor(q / 10);
        const set = clozeSets()[paper.cloze[pi]];
        const item = set && set.items[q % 10];
        list = item ? item.options : [];
      }
      return list.map(function (opt, oi) {
        let cls = "option";
        if (submitted) {
          if (Number(oi) === Number(correct)) cls += " correct";
          else if (picked != null && Number(oi) === Number(picked)) cls += " wrong";
          else cls += " dim";
        } else if (picked != null && Number(oi) === Number(picked)) {
          cls += " sel";
        }
        return `<button class="${cls}" data-action="exam-pick" data-q="${q}" data-oi="${oi}" ${submitted ? "disabled" : ""}><i>${letter(oi)}</i><span>${esc(opt)}</span></button>`;
      }).join("");
    })();
    const exp = submitted ? examExplainAt(paper, q) : null;
    const ev = exp && exp.evidence ? `
      <div class="evidence-chain compact">
        <div class="evidence-head"><span>题眼句</span><span>${esc(exp.loc || "")}</span></div>
        <blockquote>${esc(exp.evidence.evidence || "")}</blockquote>
        ${readingEvidenceCn(exp.rid, exp.qi) ? `<p class="evidence-cn"><b>句意</b> ${esc(readingEvidenceCn(exp.rid, exp.qi))}</p>` : ""}
        ${exp.evidence.paraphrase ? `<p class="paraphrase"><b>同义替换</b> ${esc(exp.evidence.paraphrase)}</p>` : ""}
      </div>` : "";
    return `
      <article class="exam-q" id="exam-q-${q}" data-q="${q}">
        <div class="exam-q-head">
          <span class="q-no">${String(q + 1).padStart(2, "0")}</span>
          <span class="q-type">${esc(info.label)}</span>
          ${submitted ? `<span class="exam-q-result ${picked != null && String(picked) === String(correct) ? "ok" : "no"}">${picked == null ? "未答" : (String(picked) === String(correct) ? "正确" : "错误")}</span>` : `<button class="exam-flag ${flagged ? "on" : ""}" data-action="exam-flag" data-q="${q}" aria-pressed="${flagged}">${flagged ? "已标记" : "标记"}</button>`}
        </div>
        ${options ? `<div class="options exam-options ${info.sec === "cloze" ? "compact" : ""}">${options}</div>` : ""}
        ${submitted ? `<div class="exam-answer-line"><span class="${picked != null && String(picked) === String(correct) ? "good" : "bad"}">你的答案 ${picked != null ? examAnswerText(paper, q, picked) : "—"}</span><span class="good">正确答案 ${correct != null ? examAnswerText(paper, q, correct) : "—"}</span></div>` : ""}
        ${submitted && exp && exp.text ? `<div class="q-explain"><span class="loc">${esc(exp.loc || "")}</span>${esc(exp.text)}</div>` : ""}
        ${ev}
      </article>`;
  }

  function examNewtypeReviewBlock(paper, answers, q, flags) {
    const nt = examNewtypeSet(paper);
    const i = q - 40;
    if (!nt || i < 0 || i >= EXAM_NEWTYPE_COUNT) return "";
    const set = nt.set;
    const picked = answers.newtype[i];
    const correct = examNewtypeCorrect(paper, i);
    const ok = picked != null && correct != null && String(picked) === String(correct);
    const snip = function (t) {
      const s = String(t || "").replace(/\s+/g, " ").trim();
      return s.length > 90 ? s.slice(0, 90) + "…" : s;
    };
    const row = (function () {
      if (nt.kind === "seven") {
        const pickIdx = picked == null ? -1 : Number(picked);
        const corIdx = correct == null ? -1 : Number(correct);
        const pickText = set.options[pickIdx] ? snip(set.options[pickIdx]) : "";
        const correctText = set.options[corIdx] ? snip(set.options[corIdx]) : "";
        return `
          <div class="nt-review-ctx">
            ${pickText ? `<p class="nt-pick"><span>你选</span><b>${letter(pickIdx)}</b>${esc(pickText)}</p>` : ""}
            ${correctText ? `<p class="nt-correct"><span>答案</span><b>${letter(corIdx)}</b>${esc(correctText)}</p>` : ""}
          </div>`;
      }
      if (nt.kind === "heading") {
        const idxOf = function (x) {
          return typeof x === "string" && /^[A-Z]$/.test(x) ? x.charCodeAt(0) - 65 : -1;
        };
        const pi = idxOf(picked), ci = idxOf(correct);
        const pickText = pi >= 0 && set.options[pi] ? snip(set.options[pi]) : "";
        const correctText = ci >= 0 && set.options[ci] ? snip(set.options[ci]) : "";
        const stem = set.sections && set.sections[i] ? snip(set.sections[i]) : "";
        return `
          <div class="nt-review-ctx">
            ${stem ? `<p class="nt-stem"><span>段落</span>${esc(stem)}</p>` : ""}
            ${pickText ? `<p class="nt-pick"><span>你选</span><b>${esc(picked)}</b>${esc(pickText)}</p>` : ""}
            ${correctText ? `<p class="nt-correct"><span>答案</span><b>${esc(correct)}</b>${esc(correctText)}</p>` : ""}
          </div>`;
      }
      const byLabel = function (lab) {
        if (lab == null) return null;
        const p = (set.paragraphs || []).find(function (x) { return String(x.label) === String(lab); });
        return p ? snip(p.text) : null;
      };
      const pickText = byLabel(picked);
      const correctText = byLabel(correct);
      return `
        <div class="nt-review-ctx">
          ${pickText ? `<p class="nt-pick"><span>你选</span><b>${esc(picked)}</b>${esc(pickText)}</p>` : ""}
          ${correctText ? `<p class="nt-correct"><span>答案</span><b>${esc(correct)}</b>${esc(correctText)}</p>` : ""}
        </div>`;
    })();
    const kindName = nt.kind === "seven" ? "七选五" : nt.kind === "order" ? "排序" : "小标题";
    return `
      <article class="exam-q review-nt" id="exam-q-${q}" data-q="${q}">
        <div class="exam-q-head">
          <span class="q-no">${String(q + 1).padStart(2, "0")}</span>
          <span class="q-type">新题型 · ${kindName}</span>
          <span class="exam-q-result ${ok ? "ok" : "no"}">${picked == null ? "未答" : (ok ? "正确" : "错误")}</span>
        </div>
        ${row}
        <div class="exam-answer-line">
          <span class="${ok ? "good" : "bad"}">你的答案 ${picked != null ? examAnswerText(paper, q, picked) : "—"}</span>
          <span class="good">正确答案 ${correct != null ? examAnswerText(paper, q, correct) : "—"}</span>
        </div>
      </article>`;
  }

  function examClozeParagraph(text, answers, start) {
    return String(text).split(/(\{\{\d+\}\})/).map(function (part) {
      const m = part.match(/^\{\{(\d+)\}\}$/);
      if (!m) return esc(part);
      const n = Number(m[1]);
      const q = start + n - 1;
      const v = answers.cloze[q];
      return `<button class="exam-blank ${v != null ? "filled" : ""}" data-action="exam-jump" data-q="${q}" aria-label="第 ${q + 1} 空">${n}${v != null ? " " + letter(v) : ""}</button>`;
    }).join("");
  }

  function examClozeSection(paper, answers, flags) {
    let q = 0;
    return paper.cloze.map(function (ci, pi) {
      const set = clozeSets()[ci];
      if (!set) return "";
      const start = q;
      q += 10;
      const paragraphs = set.paragraphs.map(function (p) {
        return `<p>${examClozeParagraph(p, answers, start)}</p>`;
      }).join("");
      const items = set.items.map(function (_, ii) {
        return examQuestionBlock(paper, answers, start + ii, false, flags);
      }).join("");
      return `
        <section class="exam-part">
          <div class="exam-part-head">
            <p class="eyebrow">Part A · 完形 ${pi + 1} / 2</p>
            <h2>${esc(set.title || "完形填空")}</h2>
            <p class="exam-part-note">${esc(set.intro || "")}</p>
          </div>
          <div class="exam-passage cloze-passage">${paragraphs}</div>
          <div class="exam-question-list">${items}</div>
        </section>`;
    }).join("");
  }

  function examReadingSection(paper, answers, flags) {
    const rid = paper.readings[ui.examReading] || paper.readings[0];
    const r = (window.READINGS || []).find(function (x) { return x.id === Number(rid); });
    if (!r) return `<div class="empty"><p class="mark">空</p><p>这篇阅读暂时不可用。</p></div>`;
    const tabs = paper.readings.map(function (id, i) {
      const item = (window.READINGS || []).find(function (x) { return x.id === Number(id); });
      return `<button class="chip ${i === ui.examReading ? "on" : ""}" data-action="exam-reading" data-ri="${i}">阅读 ${i + 1}<span class="n">${item ? item.questions.length : 0}</span></button>`;
    }).join("");
    const paragraphs = r.paragraphs.map(function (p, i) {
      return `<p><span class="para">${i + 1}</span>${esc(p)}</p>`;
    }).join("");
    const questions = r.questions.map(function (_, qi) {
      return examQuestionBlock(paper, answers, 20 + ui.examReading * 5 + qi, false, flags);
    }).join("");
    return `
      <section class="exam-part">
        <div class="exam-part-head">
          <p class="eyebrow">Part A · 阅读 ${ui.examReading + 1} / 4</p>
          <h2>${esc(r.title)}</h2>
          <p class="exam-part-note">${esc(r.topic)} · 建议 ${r.minutes} 分钟 · 5 题</p>
        </div>
        <div class="chips exam-reading-tabs">${tabs}</div>
        <div class="exam-passage reading-passage">${paragraphs}</div>
        <div class="exam-question-list">${questions}</div>
      </section>`;
  }

  function examSevenParagraph(text, answers, start) {
    return String(text).split(/(\{\{\d+\}\})/).map(function (part) {
      const m = part.match(/^\{\{(\d+)\}\}$/);
      if (!m) return esc(part);
      const i = Number(m[1]) - 1;
      const v = answers.newtype[i];
      return `<span class="exam-inline-slot ${v != null ? "filled" : ""}">${v != null ? letter(Number(v)) : i + 1}</span>`;
    }).join("");
  }

  function examNewtypeSection(paper, answers, flags) {
    const nt = examNewtypeSet(paper);
    if (!nt) return `<div class="empty"><p class="mark">空</p><p>这份卷子的新题型暂时不可用。</p></div>`;
    const set = nt.set;
    if (nt.kind === "seven") {
      const paragraphs = set.paragraphs.map(function (p) {
        return `<p>${examSevenParagraph(p, answers, 0)}</p>`;
      }).join("");
      const options = set.options.map(function (opt, oi) {
        const used = answers.newtype.indexOf(oi) !== -1;
        return `<div class="seven-option ${used ? "used" : ""}"><i>${letter(oi)}</i><span class="en">${esc(opt)}</span></div>`;
      }).join("");
      const slots = answers.newtype.map(function (picked, i) {
        const picks = set.options.map(function (_, oi) {
          return `<button class="slot-pick ${picked === oi ? "on" : ""} ${answers.newtype.indexOf(oi) !== -1 && picked !== oi ? "used" : ""}" data-action="exam-npick" data-i="${i}" data-val="${oi}">${letter(oi)}</button>`;
        }).join("");
        return `<div class="seven-slot" id="exam-q-${40 + i}" data-q="${40 + i}"><label>第 ${i + 1} 空</label><div class="slot-options">${picks}</div></div>`;
      }).join("");
      return `
        <section class="exam-part">
          <div class="exam-part-head">
            <p class="eyebrow">Part B · 新题型 · 七选五</p>
            <h2>${esc(set.title || "七选五")}</h2>
            <p class="exam-part-note">${esc(set.intro || "")}</p>
          </div>
          <div class="exam-passage seven-passage">${paragraphs}</div>
          <div class="seven-options"><p class="label">选项</p>${options}</div>
          <div class="seven-selects">${slots}</div>
        </section>`;
    }
    if (nt.kind === "order") {
      const paragraphs = set.paragraphs.map(function (p) {
        const fixed = p.label === set.first || p.label === set.last;
        return `<p class="order-para"><span class="order-tag">${esc(p.label)}</span>${fixed ? `<span class="tag">${p.label === set.first ? "首段" : "末段"}</span>` : ""}${esc(p.text)}</p>`;
      }).join("");
      const fixedLabels = [set.first, set.last].map(String);
      const letters = (set.paragraphs || [])
        .map(function (p) { return String(p.label); })
        .filter(function (lab) { return fixedLabels.indexOf(lab) === -1; });
      const slots = answers.newtype.map(function (picked, i) {
        const picks = letters.map(function (lab) {
          const used = answers.newtype.indexOf(lab) !== -1 && picked !== lab;
          return `<button class="slot-pick ${picked === lab ? "on" : ""} ${used ? "used" : ""}" data-action="exam-npick" data-i="${i}" data-val="${lab}">${lab}</button>`;
        }).join("");
        return `<div class="seven-slot" id="exam-q-${40 + i}" data-q="${40 + i}"><label>第 ${i + 1} 段</label><div class="slot-options">${picks}</div></div>`;
      }).join("");
      return `
        <section class="exam-part">
          <div class="exam-part-head">
            <p class="eyebrow">Part B · 新题型 · 排序</p>
            <h2>${esc(set.title || "排序")}</h2>
            <p class="exam-part-note">${esc(set.intro || "")}</p>
          </div>
          <div class="exam-passage order-passage">${paragraphs}</div>
          <div class="seven-selects">${slots}</div>
        </section>`;
    }
    const options = set.options.map(function (opt, oi) {
      const used = answers.newtype.indexOf(letter(oi)) !== -1;
      return `<div class="seven-option ${used ? "used" : ""}"><i>${letter(oi)}</i><span class="en">${esc(opt)}</span></div>`;
    }).join("");
    const sections = set.sections.map(function (text, i) {
      const picked = answers.newtype[i];
      const picks = set.options.map(function (_, oi) {
        const lab = letter(oi);
        const used = answers.newtype.indexOf(lab) !== -1 && picked !== lab;
        return `<button class="slot-pick ${picked === lab ? "on" : ""} ${used ? "used" : ""}" data-action="exam-npick" data-i="${i}" data-val="${lab}">${lab}</button>`;
      }).join("");
      return `<div class="heading-item" id="exam-q-${40 + i}" data-q="${40 + i}"><div class="heading-text"><span class="tag">第 ${i + 1} 段</span><p>${esc(text)}</p></div><div class="seven-slot"><label>选择标题</label><div class="slot-options">${picks}</div></div></div>`;
    }).join("");
    return `
      <section class="exam-part">
        <div class="exam-part-head">
          <p class="eyebrow">Part B · 新题型 · 小标题</p>
          <h2>${esc(set.title || "小标题匹配")}</h2>
          <p class="exam-part-note">${esc(set.intro || "")}</p>
        </div>
        <div class="seven-options heading-options"><p class="label">标题选项</p>${options}</div>
        <div class="heading-list">${sections}</div>
      </section>`;
  }

  function examTranslationSection(paper, answers) {
    const type = mockType(paper.type);
    if (paper.translation.kind === "sentences") {
      const ids = paper.translation.ids || [];
      const items = ids.map(function (id, i) {
        const s = (window.TRANSLATIONS.sentences || []).find(function (x) { return x.id === Number(id); });
        const value = answers.translationS[i] || "";
        return `
          <article class="exam-trans-sentence">
            <div class="trans-head"><span class="label">句子 ${i + 1}</span><span class="tag">2 分</span></div>
            <p class="trans-en">${esc(s ? s.en : "")}</p>
            <textarea class="trans-input" data-exam-input="trans-s${i}" placeholder="译成中文，注意句子结构和指代。">${esc(value)}</textarea>
            <div class="trans-count"><span data-exam-count="trans-s${i}">已写 ${countChars(value)} 字</span><span>参考译文在交卷后出现</span></div>
          </article>`;
      }).join("");
      return `
        <section class="exam-part">
          <div class="exam-part-head">
            <p class="eyebrow">Part C · 翻译</p>
            <h2>英译汉 · 5 句</h2>
            <p class="exam-part-note">共 ${type.translation} 分。先抓主干，再处理修饰；每句写完留半分钟回读。</p>
          </div>
          <div class="exam-trans-list">${items}</div>
        </section>`;
    }
    const entry = transEntryByKey("p" + paper.translation.id);
    const value = answers.translation || "";
    const paragraphs = entry ? String(entry.en).split(/\n{2,}/).map(function (p) { return `<p>${esc(p)}</p>`; }).join("") : "";
    return `
      <section class="exam-part">
        <div class="exam-part-head">
          <p class="eyebrow">Part C · 翻译</p>
          <h2>${esc(entry ? entry.title : "英译汉")}</h2>
          <p class="exam-part-note">共 ${type.translation} 分。译成连贯的中文，不要逐词硬译；参考译文与采分点在交卷后出现。</p>
        </div>
        <div class="exam-passage passage-en">${paragraphs}</div>
        <textarea class="trans-input trans-input-lg" data-exam-input="trans" placeholder="按段落翻译，注意句间衔接。">${esc(value)}</textarea>
        <div class="trans-count"><span data-exam-count="trans">已写 ${countChars(value)} 字</span><span>参考译文约 ${entry ? countChars(entry.ref) : 0} 字</span></div>
      </section>`;
  }

  function examWritingSection(paper, answers) {
    const type = mockType(paper.type);
    const small = (window.WRITING.small || [])[paper.writing.small];
    const big = (window.WRITING.big || [])[paper.writing.big];
    const wa = answers.writingA || "";
    const wb = answers.writingB || "";
    return `
      <section class="exam-part">
        <div class="exam-part-head">
          <p class="eyebrow">Part D · 写作</p>
          <h2>两篇作文</h2>
          <p class="exam-part-note">小作文 ${type.writingA} 分，大作文 ${type.writingB} 分。先列提纲，再落笔；交卷后按维度自评。</p>
        </div>
        <article class="exam-writing-block">
          <div class="trans-head"><span class="label">Part A · 小作文 · ${type.writingA} 分</span><span class="tag">约 100 词</span></div>
          <div class="prompt-box"><span class="label">题目</span><p>${esc(small ? small.scene : "")}</p></div>
          <textarea class="trans-input trans-input-lg" data-exam-input="wa" placeholder="Write your letter here.">${esc(wa)}</textarea>
          <div class="trans-count"><span data-exam-count="wa">${wordCount(wa)} 词</span><span>目标约 100 词</span></div>
        </article>
        <article class="exam-writing-block">
          <div class="trans-head"><span class="label">Part B · 大作文 · ${type.writingB} 分</span><span class="tag">${type.writingWords} 词</span></div>
          <div class="prompt-box"><span class="label">题目</span><p>${esc(big ? big.kind + " · " + big.topic + "。" + big.prompt : "")}</p></div>
          <textarea class="trans-input trans-input-lg exam-wb" data-exam-input="wb" placeholder="Write your essay here.">${esc(wb)}</textarea>
          <div class="trans-count"><span data-exam-count="wb">${wordCount(wb)} 词</span><span>目标 ${type.writingWords} 词</span></div>
        </article>
      </section>`;
  }

  function examSheet(paper, answers, flags, submitted) {
    const clozeAnswered = answers.cloze.filter(function (x) { return x != null; }).length;
    const readingAnswered = paper.readings.reduce(function (s, id) {
      return s + (answers.reading[String(id)] || []).filter(function (x) { return x != null; }).length;
    }, 0);
    const ntAnswered = answers.newtype.filter(function (x) { return x != null; }).length;
    const answered = examAnsweredCount(paper, answers);
    const grid = function (from, to, sec) {
      let out = "";
      for (let q = from; q < to; q++) {
        const on = examAnswerAt(paper, answers, q) != null;
        const flag = (flags || []).indexOf(q) !== -1;
        out += `<button class="sheet-q ${on ? "on" : ""} ${flag ? "flag" : ""}" data-action="exam-jump" data-q="${q}" aria-label="第 ${q + 1} 题${on ? "，已答" : "，未答"}">${q + 1}</button>`;
      }
      return out;
    };
    const transDone = paper.translation.kind === "sentences"
      ? answers.translationS.filter(function (x) { return String(x).trim(); }).length + " / 5 句"
      : (String(answers.translation).trim() ? "已写 " + countChars(answers.translation) + " 字" : "未写");
    const waDone = answers.writingA.trim() ? wordCount(answers.writingA) + " 词" : "未写";
    const wbDone = answers.writingB.trim() ? wordCount(answers.writingB) + " 词" : "未写";
    return `
      <aside class="exam-sheet-col" id="examSheet">
        <div class="exam-sheet">
          <div class="sheet-head"><h3>答题卡</h3><span>${answered} / 45</span></div>
          <div class="sheet-group"><div class="sheet-label">完形 <span>${clozeAnswered} / 20</span></div><div class="sheet-grid">${grid(0, 20, "cloze")}</div></div>
          <div class="sheet-group"><div class="sheet-label">阅读 <span>${readingAnswered} / 20</span></div><div class="sheet-grid">${grid(20, 40, "reading")}</div></div>
          <div class="sheet-group"><div class="sheet-label">新题型 <span>${ntAnswered} / 5</span></div><div class="sheet-grid five">${grid(40, 45, "newtype")}</div></div>
          <div class="sheet-subjective">
            <div><span>翻译</span><b data-sheet-sub="trans" class="${String(transDone).indexOf("未") === -1 ? "done" : ""}">${esc(transDone)}</b></div>
            <div><span>小作文</span><b data-sheet-sub="wa" class="${waDone === "未写" ? "" : "done"}">${esc(waDone)}</b></div>
            <div><span>大作文</span><b data-sheet-sub="wb" class="${wbDone === "未写" ? "" : "done"}">${esc(wbDone)}</b></div>
          </div>
          <div class="sheet-legend"><span><i class="lg-on"></i>已答</span><span><i class="lg-flag"></i>标记</span></div>
          ${submitted ? "" : `<button class="btn btn-accent exam-submit-btn" data-action="exam-submit">交卷并计分</button>`}
          <p class="mini-note">时间到会自动交卷。交卷后客观题立即出分，主观题进入自评。</p>
          <button class="text-link muted exam-sheet-back" data-action="exam-sheet-back">回到题目</button>
        </div>
      </aside>`;
  }

  function examSectionTabs(paper, answers) {
    const counts = {};
    counts.cloze = answers.cloze.filter(function (x) { return x != null; }).length;
    counts.reading = paper.readings.reduce(function (s, id) {
      return s + (answers.reading[String(id)] || []).filter(function (x) { return x != null; }).length;
    }, 0);
    counts.newtype = answers.newtype.filter(function (x) { return x != null; }).length;
    counts.translation = paper.translation.kind === "sentences"
      ? answers.translationS.filter(function (x) { return String(x).trim(); }).length
      : (String(answers.translation).trim() ? 1 : 0);
    counts.writing = [answers.writingA, answers.writingB].filter(function (x) { return String(x).trim(); }).length;
    const transTotal = paper.translation.kind === "sentences" ? 5 : 1;
    const tabs = [
      ["cloze", "完形", 20, counts.cloze],
      ["reading", "阅读", 20, counts.reading],
      ["newtype", "新题型", 5, counts.newtype],
      ["translation", "翻译", transTotal, counts.translation],
      ["writing", "写作", 2, counts.writing]
    ];
    return tabs.map(function (t) {
      return `<button class="${ui.examSection === t[0] ? "on" : ""}" data-action="exam-section" data-sec="${t[0]}">${t[1]}<span class="n">${t[3]} / ${t[2]}</span></button>`;
    }).join("");
  }

  function updateExamTabCount(sec, done, total) {
    const n = document.querySelector('[data-action="exam-section"][data-sec="' + sec + '"] .n');
    if (n) n.textContent = done + " / " + total;
  }

  function examPager() {
    const order = ["cloze", "reading", "newtype", "translation", "writing"];
    const i = order.indexOf(ui.examSection);
    return `
      <div class="exam-pager">
        <button class="btn btn-quiet btn-sm" data-action="exam-prev" ${i <= 0 ? "disabled" : ""}>← 上一部分</button>
        <button class="text-link muted" data-action="exam-sheet-jump">答题卡</button>
        <button class="btn btn-quiet btn-sm" data-action="exam-next" ${i >= order.length - 1 ? "disabled" : ""}>下一部分 →</button>
      </div>`;
  }

  function pageExamRun() {
    const active = normalizeExamActive(state.examActive);
    if (!active) {
      return `${pageHead("08", "模考", "没有进行中的模考", "先选一份卷子，再从 180 分钟计时开始。")}
        <div class="empty"><p class="mark">卷</p><p>当前没有未交卷的模考。</p><div class="actions"><a class="btn btn-solid" href="#/exam">去选卷子</a></div></div>`;
    }
    state.examActive = active;
    const paper = mockPaper(active.paperId);
    if (!paper) {
      return `<div class="empty"><p class="mark">空</p><p>这份卷子的配置已经失效，请回到模考首页。</p><div class="actions"><a class="btn btn-solid" href="#/exam">返回</a></div></div>`;
    }
    const valid = ["cloze", "reading", "newtype", "translation", "writing"];
    if (valid.indexOf(ui.examSection) === -1) ui.examSection = "cloze";
    if (ui.examSection === "reading" && ui.examReading >= paper.readings.length) ui.examReading = 0;
    if (ui.examSection === "reading") {
      const rid = paper.readings[ui.examReading];
      const startQ = 20 + ui.examReading * 5;
      if (active.answers.reading[String(rid)] && active.answers.reading[String(rid)].some(function (x, i) {
        return x == null && (active.flags || []).indexOf(startQ + i) !== -1;
      })) {
        // flags are independent of answers; nothing to do, kept for readability
      }
    }
    const answered = examAnsweredCount(paper, active.answers);
    const remain = examRemaining();
    const urgent = remain <= 300;
    const body = ui.examSection === "cloze" ? examClozeSection(paper, active.answers, active.flags)
      : ui.examSection === "reading" ? examReadingSection(paper, active.answers, active.flags)
      : ui.examSection === "newtype" ? examNewtypeSection(paper, active.answers, active.flags)
      : ui.examSection === "translation" ? examTranslationSection(paper, active.answers)
      : examWritingSection(paper, active.answers);

    return `
      <div class="exam-run-head">
        <div class="exam-bar">
          <div class="exam-bar-id">
            <span class="tag hot">${esc(mockType(paper.type).label)}</span>
            <div><b>${esc(paper.label)} · ${esc(paper.name)}</b><span>${esc(paper.note)}</span></div>
          </div>
          <div class="exam-clock ${urgent ? "urgent" : ""}" id="examClock" aria-label="剩余时间">${examClock(remain)}</div>
          <div class="exam-bar-actions">
            <span class="exam-progress" id="examAnswered">已答 ${answered} / 45</span>
            <button class="text-link muted exam-sheet-link" data-action="exam-sheet-jump">答题卡</button>
            <button class="text-link muted exam-leave-link" data-action="exam-leave" aria-label="暂离考场，计时继续">暂离</button>
            <button class="btn btn-sm btn-accent" data-action="exam-submit">交卷</button>
          </div>
        </div>
        <div class="subnav exam-subnav">${examSectionTabs(paper, active.answers)}</div>
      </div>
      <div class="exam-layout">
        <div class="exam-content">
          ${body}
          ${examPager()}
        </div>
        ${examSheet(paper, active.answers, active.flags, false)}
      </div>`;
  }

  function examSelfWritingBlock(rec, paper, kind) {
    const type = mockType(paper.type);
    const isA = kind === "wa";
    const item = isA ? (window.WRITING.small || [])[paper.writing.small] : (window.WRITING.big || [])[paper.writing.big];
    const text = isA ? rec.answers.writingA : rec.answers.writingB;
    const target = isA ? "约 100 词" : type.writingWords + " 词";
    const dims = isA ? WRITING_A_DIMS : writingBDims(paper);
    const src = rec.self[kind] || {};
    const max = isA ? type.writingA : type.writingB;
    const got = dims.reduce(function (s, d) { return s + Math.max(0, Math.min(d.max, Number(src[d.key]) || 0)); }, 0);
    const rows = dims.map(function (d) {
      const cur = Math.max(0, Math.min(d.max, Number(src[d.key]) || 0));
      let buttons = "";
      for (let n = 0; n <= d.max; n++) {
        buttons += `<button class="rubric-score ${cur === n ? "on" : ""}" data-action="exam-self-writing" data-id="${esc(rec.id)}" data-kind="${kind}" data-dim="${d.key}" data-score="${n}" aria-label="${esc(d.label)} ${n} 分">${n}</button>`;
      }
      return `<div class="rubric-row">
        <div class="rubric-copy"><b>${esc(d.label)}</b><span>${esc(d.hint)}</span></div>
        <div class="rubric-scores">${buttons}</div>
        <span class="rubric-max">${cur} / ${d.max}</span>
      </div>`;
    }).join("");
    const sample = item ? String(item.sample).split(/\n{2,}/).map(function (p) { return `<p>${esc(p)}</p>`; }).join("") : "";
    const notes = item && item.notes ? item.notes.map(function (n) { return `<li>${esc(n)}</li>`; }).join("") : "";
    return `
      <article class="exam-self-writing">
        <div class="trans-head">
          <span class="label">${isA ? "Part A · 小作文" : "Part B · 大作文"} · ${max} 分</span>
          <span class="tag">${wordCount(text)} 词 · 目标 ${target}</span>
        </div>
        <div class="prompt-box"><span class="label">题目</span><p>${esc(item ? (isA ? item.scene : item.kind + " · " + item.topic + "。" + item.prompt) : "")}</p></div>
        <div class="exam-user-text">${text.trim() ? esc(text) : "<span class=\"muted\">这次没有写这一篇。</span>"}</div>
        <div class="check-box">
          <div class="check-bar">
            <span class="label">自动检查</span>
            <span class="check-hint">离线初检 · 不替代老师</span>
            <button class="text-link" data-action="check-exam-writing" data-id="${esc(rec.id)}" data-kind="${kind}">检查这篇</button>
          </div>
          <div class="check-result" data-exam-writing-result="${esc(rec.id)}-${kind}" aria-live="polite"></div>
        </div>
        <div class="rubric-box">
          <div class="rubric-head"><h3>自评维度</h3><span>自评 ${got} / ${max}</span></div>
          ${rows}
        </div>
        <details class="acc exam-sample-acc">
          <summary><span class="acc-no">范</span><span class="acc-title">对照范文与注意点</span><span class="acc-sub">自评后再看</span><span class="acc-plus"></span></summary>
          <div class="acc-body">
            <div class="sample"><div class="sample-en">${sample}</div>${notes ? `<div class="sample-note"><ul class="sample-notes">${notes}</ul></div>` : ""}</div>
          </div>
        </details>
      </article>`;
  }

  function examSelfTranslation(rec, paper) {
    const type = mockType(paper.type);
    const self = rec.self;
    if (paper.translation.kind === "sentences") {
      const ids = paper.translation.ids || [];
      const items = ids.map(function (id, i) {
        const s = (window.TRANSLATIONS.sentences || []).find(function (x) { return x.id === Number(id); });
        const user = rec.answers.translationS[i] || "";
        const score = Math.max(0, Math.min(2, Number(self.translationSentences[i]) || 0));
        const pick = [0, 1, 2].map(function (n) {
          return `<button class="rubric-score ${score === n ? "on" : ""}" data-action="exam-self-sentence" data-id="${esc(rec.id)}" data-i="${i}" data-score="${n}">${n}</button>`;
        }).join("");
        return `
          <article class="exam-self-trans-sentence">
            <div class="trans-head"><span class="label">句子 ${i + 1}</span><span class="tag">2 分</span></div>
            <p class="trans-en">${esc(s ? s.en : "")}</p>
            <div class="exam-user-text">${user.trim() ? esc(user) : "<span class=\"muted\">未作答。</span>"}</div>
            <div class="self-ref"><b>参考</b><p>${esc(s ? s.ref : "")}</p></div>
            <div class="check-box">
              <div class="check-bar">
                <span class="label">自动检查</span>
                <span class="check-hint">术语与完整度初检</span>
                <button class="text-link" data-action="check-exam-trans-sentence" data-id="${esc(rec.id)}" data-i="${i}">检查译文</button>
              </div>
              <div class="check-result" data-exam-trans-result="${esc(rec.id)}-s${i}" aria-live="polite"></div>
            </div>
            <div class="rubric-inline"><span>逐句自评</span>${pick}<em>${score} / 2</em></div>
          </article>`;
      }).join("");
      return `
        <div class="exam-self-block">
          <div class="self-block-head"><h3>翻译自评 · ${type.translation} 分</h3><span>逐句给分：0 = 意思错或漏译，1 = 基本达意但有明显问题，2 = 准确通顺</span></div>
          ${items}
        </div>`;
    }
    const entry = transEntryByKey("p" + paper.translation.id);
    const value = rec.answers.translation || "";
    const points = (entry && entry.points) || [];
    const checks = points.map(function (p, i) {
      const on = !!self.translationPoints[i];
      return `<li><button class="point-check ${on ? "on" : ""}" data-action="exam-trans-point" data-id="${esc(rec.id)}" data-i="${i}" aria-pressed="${on}"><i>${on ? "✓" : ""}</i><span>${esc(p)}</span></button></li>`;
    }).join("");
    const checked = self.translationPoints.filter(Boolean).length;
    const score = Math.round(checked / Math.max(1, points.length) * type.translation * 2) / 2;
    return `
      <div class="exam-self-block">
        <div class="self-block-head"><h3>翻译自评 · ${type.translation} 分</h3><span>对照参考译文，逐条勾选真正译出的采分点</span></div>
        <div class="prompt-box"><span class="label">你的译文</span><p class="exam-user-text inline">${value.trim() ? esc(value) : "<span class=\"muted\">未作答。</span>"}</p></div>
        <div class="self-ref"><b>参考译文</b><p>${esc(entry ? entry.ref : "")}</p></div>
        <div class="check-box">
          <div class="check-bar">
            <span class="label">自动检查</span>
            <span class="check-hint">术语与完整度初检 · 不替代参考译文</span>
            <button class="text-link" data-action="check-exam-trans-passage" data-id="${esc(rec.id)}">检查译文</button>
          </div>
          <div class="check-result" data-exam-trans-result="${esc(rec.id)}-p" aria-live="polite"></div>
        </div>
        <ul class="point-list">${checks}</ul>
        <p class="self-score-line">已勾选 <b>${checked}</b> / ${points.length} 个采分点 · 自评 <b>${examScoreText(score)}</b> / ${type.translation} 分</p>
      </div>`;
  }

  function examSelfPanel(rec, paper) {
    const selfScore = examSelfScore(rec, paper);
    const type = mockType(paper.type);
    const issues = examSelfIssues(rec, paper);
    return `
      <section class="section exam-self-section" id="examSelf">
        <div class="section-head">
          <h2>主观题自评</h2>
          <span class="section-note">${selfScore.subjective} / 40 分${rec.self.done ? " · 已完成" : " · 未完成"}</span>
        </div>
        <p class="section-sub">客观题机器合分，主观题必须自己面对。先对照参考与维度打分，再点“完成自评”锁定本次成绩；之后仍可回来修改。</p>
        ${examSelfTranslation(rec, paper)}
        ${examSelfWritingBlock(rec, paper, "wa")}
        ${examSelfWritingBlock(rec, paper, "wb")}
        ${issues.length ? `<p class="self-warn-note">评分与作答不一致，交卷时会再确认：${esc(issues.slice(0, 4).join("；"))}${issues.length > 4 ? " 等" : ""}</p>` : ""}
        <div class="exam-self-finish">
          <div><b>主观题合计 ${selfScore.subjective} / 40</b><span>翻译 ${examScoreText(selfScore.translation)} / ${type.translation} · 小作文 ${selfScore.writingA} / ${type.writingA} · 大作文 ${selfScore.writingB} / ${type.writingB}</span></div>
          ${rec.self.done ? `<span class="tag green">已完成自评</span>` : `<button class="btn btn-solid" data-action="exam-self-done" data-id="${esc(rec.id)}">完成自评并记入成绩</button>`}
        </div>
      </section>`;
  }

  function examObjectiveReview(rec, paper) {
    const tabs = [["cloze", "完形"], ["reading", "阅读"], ["newtype", "新题型"]];
    const current = tabs.some(function (t) { return t[0] === ui.examResultSection; }) ? ui.examResultSection : "cloze";
    ui.examResultSection = current;
    const range = current === "cloze" ? [0, 20] : current === "reading" ? [20, 40] : [40, 45];
    const all = [];
    for (let q = range[0]; q < range[1]; q++) all.push(q);
    const isRight = function (q) {
      const picked = examAnswerAt(paper, rec.answers, q);
      const correct = examCorrectAt(paper, q);
      return picked != null && String(picked) === String(correct);
    };
    const wrong = all.filter(function (q) { return !isRight(q); });
    const list = ui.examReviewAll ? all : wrong;
    const tabButtons = tabs.map(function (t) {
      const rang = t[0] === "cloze" ? [0, 20] : t[0] === "reading" ? [20, 40] : [40, 45];
      let right = 0;
      for (let q = rang[0]; q < rang[1]; q++) if (isRight(q)) right++;
      return `<button class="chip ${current === t[0] ? "on" : ""}" data-action="exam-review-section" data-sec="${t[0]}">${t[1]}<span class="n">${right} / ${rang[1] - rang[0]}</span></button>`;
    }).join("");
    const blocks = list.map(function (q) {
      if (current === "newtype") return examNewtypeReviewBlock(paper, rec.answers, q, rec.flags);
      return examQuestionBlock(paper, rec.answers, q, true, rec.flags);
    }).join("");
    return `
      <section class="section exam-review-section">
        <div class="section-head"><h2>客观题解析</h2><span class="section-note">${wrong.length ? wrong.length + " 道需要回看" : "这部分全部正确"}</span></div>
        <div class="toolbar exam-review-toolbar">
          <div class="chips">${tabButtons}</div>
          <button class="text-link muted" data-action="exam-review-all">${ui.examReviewAll ? "只看错题" : "显示全部题目"}</button>
        </div>
        ${list.length ? `<div class="exam-question-list review-list">${blocks}</div>` : `<div class="exam-all-right"><b>这部分全对。</b><span>可以切到其他部分，或回看主观题自评。</span></div>`}
      </section>`;
  }

  function pageExamResult(id) {
    const rec = state.exams.find(function (r) { return String(r.id) === String(id); });
    if (!rec) {
      return `${pageHead("08", "模考", "没有这份成绩", "记录可能已被清空，或者链接不完整。")}
        <div class="empty"><p class="mark">空</p><p>找不到这次模考记录。</p><div class="actions"><a class="btn btn-solid" href="#/exam">回到模考</a></div></div>`;
    }
    const paper = mockPaper(rec.paperId);
    if (!paper) {
      return `${pageHead("08", "模考", "试卷配置失效", "这份卷子的题目配置已经不在当前版本中。")}`;
    }
    const type = mockType(paper.type);
    examRecalc(rec);
    const selfScore = examSelfScore(rec, paper);
    const grade = examGrade(paper, rec.answers);
    const total = rec.self.done ? rec.total : rec.objective;
    const passed = total >= 60;
    const usedSec = Number(rec.usedSec) || 0;
    const transDoneText = paper.translation.kind === "sentences"
      ? rec.answers.translationS.filter(function (x) { return String(x).trim(); }).length + " / 5 句"
      : (String(rec.answers.translation).trim() ? "已写 " + countChars(rec.answers.translation) + " 字" : "未写");
    const sectionRows = [
      ["完形填空", "正答 " + grade.cloze.right + " / 20", grade.cloze.score + " / 10"],
      ["阅读理解", "正答 " + grade.reading.right + " / 20", grade.reading.score + " / 40"],
      ["新题型", "正答 " + grade.newtype.right + " / 5", grade.newtype.score + " / 10"],
      ["翻译", transDoneText, examScoreText(selfScore.translation) + " / " + type.translation],
      ["小作文", wordCount(rec.answers.writingA) + " 词", selfScore.writingA + " / " + type.writingA],
      ["大作文", wordCount(rec.answers.writingB) + " 词", selfScore.writingB + " / " + type.writingB]
    ].map(function (row) {
      return `<tr><td>${esc(row[0])}</td><td class="num">${esc(row[1])}</td><td class="num"><b>${esc(row[2])}</b></td></tr>`;
    }).join("");

    return `
      ${pageHead("08", "模考", "模考成绩", examFullLabel(paper) + " · " + examDateText(rec.submittedAt) + " · 用时 " + mmss(usedSec))}
      <section class="exam-result-banner ${rec.self.done ? (passed ? "pass" : "fail") : "pending"}">
        <div class="exam-result-main">
          <div class="exam-result-score"><span class="k">${rec.self.done ? "总分" : "客观题"}</span><b>${examScoreText(total)}</b><em>/ ${rec.self.done ? 100 : 60}</em></div>
          <div class="exam-result-copy">
            <p class="eyebrow">${esc(mockType(paper.type).label)} · ${esc(paper.label)} ${esc(paper.name)}</p>
            <h2>${rec.self.done ? (total >= 80 ? "分数已经站上高分段，接下来拼的是稳定。" : (total >= 60 ? "过线不代表稳，最弱项才决定上限。" : "先把能拿的分拿稳，再谈技巧。")) : "客观题已出分，主观题还等你自评。"}</h2>
            <p>客观 ${examScoreText(rec.objective)} / 60 · 主观 ${examScoreText(rec.subjective)} / 40 · ${rec.self.done ? "自评已完成" : "自评未完成"}</p>
          </div>
        </div>
        <div class="exam-result-actions">
          <a class="btn btn-sm btn-quiet" href="#/exam">模考首页</a>
          ${rec.self.done ? "" : `<button class="btn btn-sm btn-solid" data-action="exam-self-jump">开始自评</button>`}
          <button class="btn btn-sm ${rec.self.done ? "btn-solid" : "btn-quiet"}" data-action="exam-retake" data-id="${esc(paper.id)}">再考一次</button>
        </div>
      </section>

      <div class="exam-result-grid">
        <section>
          <div class="section-head"><h2>分项得分</h2><span class="section-note">客观题自动合分，主观题按自评</span></div>
          <div class="table-wrap"><table class="data exam-score-table"><thead><tr><th>部分</th><th>作答情况</th><th>得分</th></tr></thead><tbody>${sectionRows}</tbody></table></div>
          <p class="mini-note">${rec.self.done ? "成绩已记入本机模考记录。" : "完成下方主观题自评后，总分才会记入模考记录。"}</p>
        </section>
        <aside class="exam-result-note">
          <h3>这次先看三件事</h3>
          <ol>
            <li><b>错题原因</b>是没定位到、看错选项，还是时间不够。</li>
            <li><b>主观题</b>对照采分点和维度，不凭感觉给分。</li>
            <li><b>下一次</b>只改一个最影响分数的问题。</li>
          </ol>
          <a class="text-link" href="#/me/mistakes">去错题本复盘 →</a>
        </aside>
      </div>

      ${examSelfPanel(rec, paper)}
      ${examObjectiveReview(rec, paper)}`;
  }

  function createExamRecord(active) {
    const paper = mockPaper(active.paperId);
    if (!paper) return null;
    const now = Date.now();
    const rec = {
      id: "x" + now.toString(36) + Math.random().toString(36).slice(2, 6),
      paperId: paper.id,
      startedAt: active.startedAt,
      submittedAt: now,
      usedSec: Math.max(0, Math.min(EXAM_TIME, Math.round((now - active.startedAt) / 1000))),
      answers: normalizeExamAnswers(JSON.parse(JSON.stringify(active.answers)), paper),
      flags: (active.flags || []).slice(),
      self: emptyExamSelf()
    };
    examRecalc(rec);
    return rec;
  }

  function finishExam(auto) {
    if (!state.examActive || ui.examSubmitting) return;
    const paper = mockPaper(state.examActive.paperId);
    if (!paper) { state.examActive = null; save(); return; }
    const unanswered = EXAM_OBJECTIVE_COUNT - examAnsweredCount(paper, state.examActive.answers);
    if (!auto && examRemaining() > 0 && unanswered > 0) {
      if (!window.confirm("还有 " + unanswered + " 道客观题未答，确定现在交卷？")) return;
    }
    ui.examSubmitting = true;
    const rec = createExamRecord(state.examActive);
    if (!rec) { ui.examSubmitting = false; return; }
    state.exams.unshift(rec);
    state.exams = state.exams.slice(0, 30);
    state.examActive = null;
    save();
    ui.examSubmitting = false;
    toast(auto ? "时间到，已自动交卷" : "已交卷 · 客观题 " + examScoreText(rec.objective) + " / 60");
    if (getRoute().name === "exam") location.hash = "#/exam/result/" + rec.id;
    else render();
  }

  function startExam(id) {
    const paper = mockPaper(id);
    if (!paper) { toast("这份卷子暂时不可用"); return; }
    const old = normalizeExamActive(state.examActive);
    if (old) {
      if (examRemaining() > 0) { toast("已有未交卷的模考，先完成或放弃它"); return; }
      const rec = createExamRecord(old);
      if (rec) {
        state.exams.unshift(rec);
        state.exams = state.exams.slice(0, 30);
      }
      state.examActive = null;
      save();
      toast("上次模考已超时，成绩已记入记录");
    }
    const now = Date.now();
    state.examActive = {
      paperId: paper.id,
      startedAt: now,
      endAt: now + EXAM_TIME * 1000,
      answers: emptyExamAnswers(paper),
      flags: [],
      startedLabel: examDateText(now)
    };
    state.examType = paper.type;
    ui.examSection = "cloze";
    ui.examReading = 0;
    ui.examJumpQ = null;
    ui.examReviewAll = false;
    ui.examResultSection = "cloze";
    save();
    location.hash = "#/exam/run";
    toast("计时开始 · 180 分钟");
  }

  function examTick() {
    if (!state.examActive) return;
    const remain = examRemaining();
    const el = document.getElementById("examClock");
    if (el) {
      el.textContent = examClock(remain);
      el.classList.toggle("urgent", remain <= 300);
    }
    if (remain <= 0 && !ui.examSubmitting) {
      finishExam(true);
    }
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
      ${pageHead("09", "真题与规划", "真题与规划", "规划不是把每天排满，而是知道每个阶段该解决什么问题。真题要反复做，但每一遍要有不同任务。")}
      <div class="plan-hero">
        <div>
          <p class="big">${d}<small>天</small></p>
          <p class="sub">距 ${examYear()} 考研初试 · ${fmtShort(state.examDate)} · 当前为${esc(phase.name)}</p>
        </div>
        <div class="head-actions"><button class="btn btn-sm btn-quiet" data-action="print">打印这份规划</button></div>
      </div>

      ${adaptiveSection()}

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
    if (route.param === "summary" || route.param === "notebook" || route.param === "mistakes" || route.param === "records") {
      ui.meTab = route.param;
    }
    const tab = ui.meTab;
    return `
      ${pageHead("10", "我的记录", "我的记录", "记录不是为了好看。生词要回看，错题要重做，时间要能解释清楚。")}
      <div class="stat-strip">
        <div class="stat"><p class="k">连续学习</p><p class="v">${streakDays()}<small>天</small></p><p class="s">今天也算在内</p></div>
        <div class="stat"><p class="k">累计专注</p><p class="v">${totalMinutes()}<small>分钟</small></p><p class="s">完整专注时段</p></div>
        <div class="stat"><p class="k">已掌握</p><p class="v">${knownCount()}<small>词</small></p><p class="s">标记为“认识”</p></div>
        <div class="stat"><p class="k">错题</p><p class="v">${state.mistakes.length}<small>道</small></p><p class="s">阅读 · 完形 · 新题型</p></div>
      </div>

      <div class="subnav">
        <button class="${tab === "summary" ? "on" : ""}" data-action="me-tab" data-tab="summary">学习记录</button>
        <button class="${tab === "notebook" ? "on" : ""}" data-action="me-tab" data-tab="notebook">生词本</button>
        <button class="${tab === "mistakes" ? "on" : ""}" data-action="me-tab" data-tab="mistakes">错题本</button>
        <button class="${tab === "records" ? "on" : ""}" data-action="me-tab" data-tab="records">记录与设置</button>
      </div>

      ${tab === "notebook" ? meNotebook() : (tab === "mistakes" ? meMistakes() : (tab === "summary" ? meSummary() : meRecords()))}`;
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

  function refreshStorageInfo() {
    const status = $("#storageStatus");
    const btn = $("#persistStorageBtn");
    if (!status && !btn) return;
    const setStatus = function (text) { if (status) status.textContent = text; };
    const canPersist = !!(navigator.storage && navigator.storage.persist);
    if (!navigator.storage || !navigator.storage.persisted) {
      setStatus("当前浏览器不支持持久存储；请定期导出备份。");
      if (btn) btn.classList.add("hidden");
      return;
    }
    navigator.storage.persisted().then(function (persisted) {
      let base = persisted
        ? "本机存储：持久。浏览器不会在空间不足时自动清理学习记录。"
        : "本机存储：普通。空间不足时可能被清理，建议申请持久存储并定期导出。";
      if (!persisted && !canPersist) base = "本机存储：普通。当前浏览器不支持申请持久存储，请定期导出备份。";
      setStatus(base);
      if (btn) btn.classList.toggle("hidden", persisted || !canPersist);
      if (navigator.storage.estimate) {
        navigator.storage.estimate().then(function (est) {
          if (est && est.usage > 0) setStatus(base + " 当前约用 " + formatBytes(est.usage) + "。");
        }).catch(function () { /* 估算失败不影响状态显示 */ });
      }
    }).catch(function () {
      setStatus("无法读取本机存储状态；建议定期导出备份。");
      if (btn) btn.classList.add("hidden");
    });
  }

  function meRecords() {
    const trapLine = trapLifetimeLine();
    const offlineReady = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
    const offlineText = location.protocol === "file:"
      ? "当前是离线单文件版，无需联网。"
      : (offlineReady ? "已就绪，断网也能打开。" : "首次打开后自动准备；如果一直没就绪，刷新一次。");
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
            <label>安装到手机桌面</label>
            <p class="mini-note">安装后从桌面直接打开，离线也能用。iPhone 用 Safari 的“分享 → 添加到主屏幕”。</p>
            <button class="btn btn-sm btn-quiet btn-install" data-action="install-app">安装 / 添加到桌面</button>
          </div>
          <div class="field">
            <label>朗读方式</label>
            <div class="chips">
              <button class="chip ${state.ttsMode === "auto" ? "on" : ""}" data-action="set-tts" data-mode="auto">自动</button>
              <button class="chip ${state.ttsMode === "native" ? "on" : ""}" data-action="set-tts" data-mode="native">系统语音</button>
              <button class="chip ${state.ttsMode === "builtin" ? "on" : ""}" data-action="set-tts" data-mode="builtin">内置语音</button>
            </div>
            ${ttsVoiceField()}
            <div class="chips">
              <button class="chip ${state.ttsRate === "slow" ? "on" : ""}" data-action="set-rate" data-rate="slow">语速 慢</button>
              <button class="chip ${state.ttsRate === "normal" ? "on" : ""}" data-action="set-rate" data-rate="normal">语速 正常</button>
              <button class="chip ${state.ttsRate === "fast" ? "on" : ""}" data-action="set-rate" data-rate="fast">语速 快</button>
            </div>
            <div class="chips">
              <button class="chip ${state.cardAutoplay ? "on" : ""}" data-action="toggle-card-autoplay">卡片切换后自动发音</button>
            </div>
            <p class="mini-note">自动：优先系统神经语音（Aria/Jenny 等）；浏览器只有机械音或没有英文语音时，单词自动用有道真人发音，整句/整段自动用百度在线人声（需联网），断网再回落到系统语音与离线音。改语速或换声音后会自动试读一句。</p>
            <button class="text-link" data-action="test-tts">试听一句</button>
            <button class="text-link" data-action="tts-diag">语音自检</button>
            <div id="ttsDiag"></div>
          </div>
          <div class="field">
            <label>干扰项归因</label>
            <p class="mini-note">${trapLine || "还没有训练记录。完成一组后，这里会保留累计正确率与最弱类型。"}</p>
            <a class="text-link" href="#/reading/traps">${trapLine ? "再练一组 →" : "去练一组 →"}</a>
          </div>
          <div class="settings-actions">
            <button class="btn btn-sm btn-quiet" data-action="print">打印规划</button>
            <button class="btn btn-sm btn-quiet danger" data-action="reset-data">清空记录</button>
          </div>
          <div class="field">
            <label>数据安全</label>
            <p class="mini-note" id="backupStatus">${backupLine()} ${backupHint()}</p>
            <div class="settings-actions">
              <button class="btn btn-sm ${backupDue() ? "btn-accent" : "btn-quiet"}" data-action="export-data">导出记录</button>
              <button class="btn btn-sm btn-quiet" data-action="import-data">导入记录</button>
            </div>
            <p class="mini-note" id="storageStatus">正在检查本机存储…</p>
            <button class="btn btn-sm btn-quiet hidden" id="persistStorageBtn" data-action="persist-storage">申请持久存储</button>
          </div>
          <div class="field">
            <label>离线与更新</label>
            <p class="mini-note">离线缓存：${offlineText}</p>
            <button class="btn btn-sm btn-quiet" data-action="check-update">检查更新</button>
          </div>
        </aside>
      </div>`;
  }

  /* ------------------------------------------------------------------
     me summary（学习记录汇总）
  ------------------------------------------------------------------ */

  function meSummary() {
    const day = state.days[todayKey()];
    const todayTasks = day && Array.isArray(day.tasks) ? day.tasks.filter(Boolean).length : 0;
    const activeDays = Object.keys(state.days).filter(function (k) { return isActiveDay(state.days[k]); }).length;

    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      const key = ymd(d);
      const rec = state.days[key];
      const on = !!(rec && isActiveDay(rec));
      const tasks = rec && Array.isArray(rec.tasks) ? rec.tasks.filter(Boolean).length : 0;
      week.push(`<button class="me-week-day ${on ? "on" : ""}" title="${key} · 任务 ${tasks} / 5"><i></i><span>${key.slice(key.length - 2)}</span></button>`);
    }

    const known = knownCount();
    const fuzzy = Object.keys(state.words).filter(function (w) { return state.words[w] === "fuzzy"; }).length;
    const due = dueWords().length;

    const readRecs = Object.keys(state.reading).map(function (k) { return state.reading[k]; }).filter(Boolean);
    const readDone = readRecs.filter(function (r) { return r.submitted; });
    const readRight = readDone.reduce(function (s, r) { return s + (Number(r.score) || 0); }, 0);
    const readPct = readDone.length ? Math.round(readRight / (readDone.length * 5) * 100) : 0;

    const practiceTotal = (state.clozes || []).length + (state.sevens || []).length + (state.orders || []).length + (state.headings || []).length;
    const practiceDone = [state.clozes, state.sevens, state.orders, state.headings].reduce(function (s, arr) {
      return s + (Array.isArray(arr) ? arr.filter(function (x) { return x && x.submitted; }).length : 0);
    }, 0);

    const one = function (src, denom) {
      const arr = Array.isArray(src) ? src : [];
      const doneN = arr.filter(function (x) { return x && x.submitted; }).length;
      const right = arr.reduce(function (s, x) { return s + (x && x.submitted ? Number(x.score) || 0 : 0); }, 0);
      return { done: doneN, right: right, denom: denom };
    };
    const practiceRows = [
      ["完形填空", one(state.clozes, 20)],
      ["七选五", one(state.sevens, 5)],
      ["排序", one(state.orders, 5)],
      ["小标题", one(state.headings, 5)]
    ].map(function (row) {
      const st = row[1];
      return `<tr><td>${row[0]}</td><td class="num">${st.done} 篇</td><td class="num">${st.done ? st.right + " / " + st.done * st.denom : "—"}</td></tr>`;
    }).join("");

    const transCount = Object.keys(state.translations).length;
    const draftCount = Object.keys(state.drafts).length;

    const exams = state.exams || [];
    const doneExams = exams.filter(function (r) { return r.self && r.self.done; });
    const avgScore = doneExams.length ? (doneExams.reduce(function (s, r) { return s + (Number(r.total) || 0); }, 0) / doneExams.length) : 0;
    const bestScore = doneExams.length ? doneExams.reduce(function (s, r) { return Math.max(s, Number(r.total) || 0); }, 0) : 0;
    const passN = doneExams.filter(function (r) { return Number(r.total) >= 60; }).length;

    const mistakeTypes = ["阅读", "完形", "七选五", "排序", "小标题"].map(function (t) {
      const n = state.mistakes.filter(function (m) { return m.type === t; }).length;
      return n ? t + " " + n + " 道" : "";
    }).filter(Boolean).join(" · ");

    const smooth = function (n, d) { return d ? (Math.round(n / d * 10) / 10) : 0; };

    return `
      ${learningDiagnosisPanel()}

      <section class="me-summary-block">
        <div class="section-head"><h2>打卡与节奏</h2><span class="section-note">今天 ${todayTasks} / 5 项任务 · 最近 7 天</span></div>
        <div class="sum-cards">
          <div class="sum-card"><p class="k">连续打卡</p><p class="v">${streakDays()}<small>天</small></p></div>
          <div class="sum-card"><p class="k">累计学习</p><p class="v">${activeDays}<small>天</small></p></div>
          <div class="sum-card"><p class="k">累计专注</p><p class="v">${totalMinutes()}<small>分钟</small></p></div>
          <div class="sum-card"><p class="k">练习完成</p><p class="v">${practiceDone}<small> / ${practiceTotal} 篇</small></p></div>
        </div>
        <div class="me-week">${week.join("")}</div>
        <p class="mini-note">圆点为有学习痕迹的日期；数字为当天完成的清单任务数。学习时长不含中途暂停。</p>
      </section>

      <div class="me-summary-grid">
        <section>
          <div class="section-head"><h2>词汇</h2><span class="section-note">共 ${ALL_WORDS.length} 词 · 今日待复习 ${due} 词</span></div>
          <table class="data history-table">
            <tbody>
              <tr><td>已掌握（认识）</td><td class="num"><b>${known}</b> 词</td></tr>
              <tr><td>待巩固（模糊）</td><td class="num"><b>${fuzzy}</b> 词</td></tr>
              <tr><td>生词本</td><td class="num"><b>${state.notebook.length}</b> 词</td></tr>
              <tr><td>今日到期</td><td class="num"><b>${due}</b> 词 <a class="text-link" href="#/vocab">去复习 →</a></td></tr>
            </tbody>
          </table>
          <div class="section-head" style="margin-top:26px"><h2>翻译与写作</h2></div>
          <table class="data history-table">
            <tbody>
              <tr><td>翻译练习草稿</td><td class="num"><b>${transCount}</b> 篇</td></tr>
              <tr><td>写作草稿</td><td class="num"><b>${draftCount}</b> 篇</td></tr>
            </tbody>
          </table>
          <div class="section-head" style="margin-top:26px"><h2>错题分布</h2><span class="section-note">共 ${state.mistakes.length} 道</span></div>
          <p class="sum-line">${mistakeTypes || "还没有错题。练习时答错的题会自动进入错题本。"}</p>
        </section>

        <section>
          <div class="section-head"><h2>阅读</h2><span class="section-note">${readDone.length} 篇已提交</span></div>
          <table class="data history-table">
            <tbody>
              <tr><td>提交篇数</td><td class="num"><b>${readDone.length}</b> / ${Object.keys(state.reading).length} 练过</td></tr>
              <tr><td>平均正确</td><td class="num"><b>${smooth(readRight, readDone.length)}</b> / 5 题 · ${readPct}%</td></tr>
            </tbody>
          </table>
          <div class="section-head" style="margin-top:26px"><h2>完形与新题型</h2></div>
          <div class="table-wrap"><table class="data history-table">
            <thead><tr><th>题型</th><th>完成</th><th>累计答对 / 题量</th></tr></thead>
            <tbody>${practiceRows}</tbody>
          </table></div>
          <div class="section-head" style="margin-top:26px"><h2>全真模考</h2><span class="section-note">共 ${exams.length} 次 · 已自评 ${doneExams.length}</span></div>
          <table class="data history-table">
            <tbody>
              <tr><td>平均总分</td><td class="num"><b>${doneExams.length ? examScoreText(avgScore) : "—"}</b> / 100</td></tr>
              <tr><td>最佳总分</td><td class="num"><b>${doneExams.length ? examScoreText(bestScore) : "—"}</b> / 100</td></tr>
              <tr><td>过线次数（≥60）</td><td class="num"><b>${passN}</b> 次</td></tr>
            </tbody>
          </table>
          <a class="text-link" href="#/exam">查看全部模考记录 →</a>
        </section>
      </div>

      <section class="sum-backup">
        <div class="section-head"><h2>记录备份与恢复</h2><span class="section-note">数据只保存在本机浏览器</span></div>
        <p class="sum-line" id="backupStatus">${backupLine()} ${backupHint()}</p>
        <p class="mini-note" id="storageStatus">正在检查本机存储…</p>
        <div class="settings-actions">
          <button class="btn btn-sm ${backupDue() ? "btn-accent" : "btn-quiet"}" data-action="export-data">导出记录</button>
          <button class="btn btn-sm btn-quiet" data-action="import-data">导入记录</button>
        </div>
        <button class="btn btn-sm btn-quiet hidden" id="persistStorageBtn" data-action="persist-storage">申请持久存储</button>
      </section>`;
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
    const list = cardList();
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
    const next = list[ui.cardIndex];
    save();
    if (state.cardAutoplay && next) speak(next.w);
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
      case "exam-type":
        state.examType = data.type === "en1" ? "en1" : "en2";
        save();
        render();
        break;
      case "exam-start":
        startExam(data.id);
        break;
      case "exam-discard": {
        const paper = mockPaper(data.id);
        if (!window.confirm("放弃本次模考？当前答案不会记入成绩。")) break;
        state.examActive = null;
        save();
        render();
        toast("已放弃本次模考" + (paper ? "" : ""));
        break;
      }
      case "exam-section":
        ui.examSection = data.sec;
        render();
        break;
      case "exam-reading":
        ui.examSection = "reading";
        ui.examReading = Number(data.ri) || 0;
        ui.examJumpQ = 20 + ui.examReading * 5;
        render();
        break;
      case "exam-jump": {
        const q = Number(data.q);
        if (!Number.isInteger(q) || q < 0 || q >= EXAM_OBJECTIVE_COUNT) break;
        const info = examQInfo(q);
        ui.examSection = info.sec;
        if (info.sec === "reading") ui.examReading = info.ri;
        ui.examJumpQ = q;
        render();
        break;
      }
      case "exam-sheet-jump": {
        const sheet = document.getElementById("examSheet");
        if (sheet) sheet.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "exam-sheet-back": {
        const content = document.querySelector(".exam-content");
        if (content) content.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "exam-leave":
        location.hash = "#/exam";
        toast("已暂离考场，计时仍在继续");
        break;
      case "exam-self-jump": {
        const el = document.getElementById("examSelf");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "exam-pick": {
        const active = state.examActive;
        const paper = active && mockPaper(active.paperId);
        if (!paper) break;
        const q = Number(data.q);
        const oi = Number(data.oi);
        const info = examQInfo(q);
        if (info.sec === "newtype") break;
        examSetAnswer(paper, active.answers, q, oi);
        touch();
        save();
        rerender();
        break;
      }
      case "exam-flag": {
        const active = state.examActive;
        if (!active) break;
        const q = Number(data.q);
        if (!Number.isInteger(q) || q < 0 || q >= EXAM_OBJECTIVE_COUNT) break;
        const i = active.flags.indexOf(q);
        if (i === -1) active.flags.push(q);
        else active.flags.splice(i, 1);
        save();
        rerender();
        break;
      }
      case "exam-npick": {
        const active = state.examActive;
        const paper = active && mockPaper(active.paperId);
        if (!paper) break;
        const nt = examNewtypeSet(paper);
        if (!nt) break;
        const i = Number(data.i);
        if (!Number.isInteger(i) || i < 0 || i >= 5) break;
        const val = nt.kind === "seven" ? Number(data.val) : String(data.val);
        active.answers.newtype.forEach(function (x, j) {
          if (j !== i && String(x) === String(val)) active.answers.newtype[j] = null;
        });
        active.answers.newtype[i] = val;
        touch();
        save();
        rerender();
        break;
      }
      case "exam-prev":
      case "exam-next": {
        const order = ["cloze", "reading", "newtype", "translation", "writing"];
        const cur = order.indexOf(ui.examSection);
        const next = cur + (action === "exam-next" ? 1 : -1);
        if (next < 0 || next >= order.length) break;
        ui.examSection = order[next];
        render();
        break;
      }
      case "exam-submit":
        finishExam(false);
        break;
      case "exam-review-section":
        ui.examResultSection = data.sec;
        rerender();
        break;
      case "exam-review-all":
        ui.examReviewAll = !ui.examReviewAll;
        rerender();
        break;
      case "exam-trans-point": {
        const rec = state.exams.find(function (r) { return String(r.id) === String(data.id); });
        if (!rec) break;
        const i = Number(data.i);
        if (!Number.isInteger(i) || i < 0 || i >= 5) break;
        if (!rec.self.translationPoints[i] && rec.self.translationPoints.filter(Boolean).length >= 5) break;
        rec.self.translationPoints[i] = !rec.self.translationPoints[i];
        examRecalc(rec);
        save();
        rerender();
        break;
      }
      case "exam-self-sentence": {
        const rec = state.exams.find(function (r) { return String(r.id) === String(data.id); });
        if (!rec) break;
        const i = Number(data.i);
        if (!Number.isInteger(i) || i < 0 || i >= 5) break;
        rec.self.translationSentences[i] = Math.max(0, Math.min(2, Number(data.score) || 0));
        examRecalc(rec);
        save();
        rerender();
        break;
      }
      case "exam-self-writing": {
        const rec = state.exams.find(function (r) { return String(r.id) === String(data.id); });
        if (!rec) break;
        const kind = data.kind === "wb" ? "writingB" : "writingA";
        const paper = mockPaper(rec.paperId);
        if (!paper) break;
        const dims = kind === "writingA" ? WRITING_A_DIMS : writingBDims(paper);
        const dim = dims.find(function (d) { return d.key === data.dim; });
        if (!dim) break;
        rec.self[kind][data.dim] = Math.max(0, Math.min(dim.max, Number(data.score) || 0));
        examRecalc(rec);
        save();
        rerender();
        break;
      }
      case "exam-self-done": {
        const rec = state.exams.find(function (r) { return String(r.id) === String(data.id); });
        if (!rec) break;
        const paper = mockPaper(rec.paperId);
        const issues = paper ? examSelfIssues(rec, paper) : [];
        if (issues.length) {
          const head = "有几处评分与作答不一致，确定照此记入成绩？";
          const body = issues.slice(0, 4).join("；") + (issues.length > 4 ? " 等" : "") + "。";
          if (!window.confirm(head + "\n" + body)) break;
        }
        rec.self.done = true;
        examRecalc(rec);
        save();
        rerender();
        toast("自评已完成 · 总分 " + examScoreText(rec.total));
        break;
      }
      case "exam-retake":
        startExam(data.id);
        break;
      case "set-tag": {
        ui.vocabTag = data.tag;
        ui.vocabLimit = 60;
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        ui.reviewDeck = null;
        ui.spell = null;
        ui.listen = null;
        ui.dictation = null;
        rerender();
        break;
      }
      case "start-review": {
        const deck = dueWords().slice(0, 30);
        if (!deck.length) { toast("今天没有到期词"); break; }
        ui.vocabTag = "待复习";
        ui.vocabMode = "card";
        ui.reviewDeck = deck;
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        ui.spell = null;
        ui.listen = null;
        ui.dictation = null;
        if (getRoute().name !== "vocab") location.hash = "#/vocab";
        else rerender();
        break;
      }
      case "set-mode": {
        const mode = data.mode;
        ui.vocabMode = mode;
        ui.cardIndex = 0;
        ui.cardFlipped = false;
        ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
        ui.reviewDeck = null;
        ui.spell = null;
        ui.listen = null;
        ui.dictation = null;
        if (mode === "spell") buildSpell();
        if (mode === "listen") buildListen();
        if (mode === "dictation") buildDictation();
        render();
        if (mode === "listen" && ui.listen && ui.listen.items[0]) speak(ui.listen.items[0].word.w);
        if (mode === "dictation" && ui.dictation && ui.dictation.items[0]) speak(ui.dictation.items[0].w);
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
      case "stop-speak":
        ttsStop();
        break;
      case "toggle-card-autoplay": {
        state.cardAutoplay = !state.cardAutoplay;
        save();
        rerender();
        toast(state.cardAutoplay ? "已开启：切换卡片后自动朗读单词" : "已关闭卡片自动发音");
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
      case "tts-diag":
        runTtsDiag();
        break;
      case "copy-tts-diag":
        if (!lastTtsDiag) { toast("请先点「语音自检」"); break; }
        copyText(lastTtsDiag).then(function () {
          toast("诊断信息已复制，可直接发给我");
        }).catch(function () {
          toast("复制失败，请长按上方文字选择复制");
        });
        break;
      case "set-rate": {
        if (["slow", "normal", "fast"].indexOf(data.rate) !== -1) {
          state.ttsRate = data.rate;
          save();
          rerender();
          speak("Reading is not a race.");
          toast("语速已调整，正在试读");
        }
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
        if (ui.vocabTag === "待复习") {
          const nextDeck = dueWords().slice(0, 30);
          if (!nextDeck.length) { toast("今天到期的词已经全部过完"); break; }
          ui.reviewDeck = nextDeck;
        }
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
      case "listen-play": {
        const ls = ui.listen;
        if (ls && ls.items[ls.i]) speak(ls.items[ls.i].word.w);
        break;
      }
      case "listen-pick": {
        const ls = ui.listen;
        if (!ls || !ls.items[ls.i]) break;
        const it = ls.items[ls.i];
        if (it.picked >= 0) break;
        it.picked = Number(data.i);
        const chosen = it.options[it.picked];
        it.ok = !!(chosen && chosen.w === it.word.w);
        if (it.ok) ls.score++;
        else setWordStatus(it.word.w, "fuzzy");
        rerender();
        break;
      }
      case "listen-next": {
        const ls = ui.listen;
        if (!ls) break;
        ls.i++;
        rerender();
        if (ls.i < ls.items.length) {
          const nx = ls.items[ls.i];
          if (nx) speak(nx.word.w);
        }
        break;
      }
      case "listen-restart":
        buildListen();
        rerender();
        if (ui.listen.items[0]) speak(ui.listen.items[0].word.w);
        break;
      case "dictate-play": {
        const dt = ui.dictation;
        if (dt && dt.items[dt.i]) speak(dt.items[dt.i].w);
        break;
      }
      case "dictate-check": {
        const dt = ui.dictation;
        if (!dt || dt.checked || dt.i >= dt.items.length) break;
        const w = dt.items[dt.i];
        const given = String(dt.value || "").trim().toLowerCase();
        const expect = String(w.w || "").trim().toLowerCase();
        dt.checked = true;
        dt.ok = given === expect;
        if (dt.ok) dt.score++;
        else setWordStatus(w.w, "fuzzy");
        rerender();
        break;
      }
      case "dictate-reveal": {
        const dt = ui.dictation;
        if (!dt || dt.checked || dt.i >= dt.items.length) break;
        dt.checked = true;
        dt.ok = false;
        setWordStatus(dt.items[dt.i].w, "fuzzy");
        rerender();
        break;
      }
      case "dictate-next": {
        const dt = ui.dictation;
        if (!dt) break;
        dt.i++;
        dt.value = "";
        dt.checked = false;
        dt.ok = false;
        rerender();
        if (dt.i < dt.items.length) speak(dt.items[dt.i].w);
        break;
      }
      case "dictate-restart":
        buildDictation();
        rerender();
        if (ui.dictation.items[0]) speak(ui.dictation.items[0].w);
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
      case "cloze-tab": {
        if (["cloze", "seven", "order", "heading"].indexOf(data.tab) === -1) break;
        ui.clozeTab = data.tab;
        const target = "#/cloze/" + data.tab;
        if (location.hash !== target) location.hash = target;
        else render();
        break;
      }
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
      case "trans-tab": {
        if (data.tab !== "sentence" && data.tab !== "passage") break;
        ui.transTab = data.tab;
        const target = "#/translation/" + data.tab;
        if (location.hash !== target) location.hash = target;
        else render();
        break;
      }
      case "trans-point": {
        const key = data.key;
        const entry = transEntryByKey(key);
        if (!entry) break;
        const total = (entry.points || []).length;
        const i = Number(data.i);
        if (!Number.isInteger(i) || i < 0 || i >= total) break;
        const arr = Array.isArray(state.transSelf[key]) ? state.transSelf[key].slice() : [];
        while (arr.length < total) arr.push(false);
        arr[i] = !arr[i];
        state.transSelf[key] = arr;
        save();
        updateTransSelfDom(key);
        break;
      }
      case "draft-self": {
        const key = data.key;
        if (!key) break;
        const kind = key.indexOf("small-") === 0 ? "small" : "big";
        const dims = draftSelfDims(kind);
        const dim = dims.find(function (d) { return d.key === data.dim; });
        if (!dim) break;
        const src = state.draftSelf[key] && typeof state.draftSelf[key] === "object" ? state.draftSelf[key] : {};
        src[data.dim] = Math.max(0, Math.min(dim.max, Number(data.score) || 0));
        state.draftSelf[key] = src;
        save();
        updateDraftSelfDom(key);
        markTask(3, true);
        break;
      }
      case "check-trans": {
        if (data.key) runTransFeedback(data.key);
        break;
      }
      case "check-draft": {
        const key = data.key;
        if (!key) break;
        const kind = data.kind || (key.indexOf("small-") === 0 ? "small" : "big");
        const i = Number.isInteger(Number(data.i)) ? Number(data.i) : Number(String(key).split("-").pop());
        runDraftFeedback(key, kind, i);
        break;
      }
      case "check-exam-writing": {
        if (data.id && data.kind) runExamWritingFeedback(data.id, data.kind);
        break;
      }
      case "check-exam-trans-sentence": {
        if (data.id) runExamTransFeedback(data.id, data.i);
        break;
      }
      case "check-exam-trans-passage": {
        if (data.id) runExamTransFeedback(data.id, "p");
        break;
      }
      case "copy-feedback": {
        const report = feedbackCache[data.id];
        if (report) copyThen(report.plain, "检查报告已复制");
        break;
      }
      case "apply-draft-score": {
        const report = feedbackCache[data.id];
        if (!report || !report.suggested || !report.key) break;
        state.draftSelf[report.key] = Object.assign({}, report.suggested);
        save();
        updateDraftSelfDom(report.key);
        markTask(3, true);
        toast("已填入建议分，可再调整");
        break;
      }
      case "trans-passage": {
        const id = Number(data.id);
        if (id) { ui.transPassage = id; rerender(); }
        break;
      }
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
      case "writing-tab": {
        if (["small", "big", "patterns"].indexOf(data.tab) === -1) break;
        ui.writingTab = data.tab;
        const target = "#/writing/" + data.tab;
        if (location.hash !== target) location.hash = target;
        else render();
        break;
      }
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
      case "install-app": {
        if (!deferredInstallPrompt) {
          toast("请用浏览器菜单“安装应用”或“添加到主屏幕”");
          break;
        }
        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;
        try {
          promptEvent.prompt();
          promptEvent.userChoice.then(function (choice) {
            if (choice && choice.outcome === "accepted") toast("正在安装到桌面");
          }).catch(function () { /* 用户取消或浏览器不支持 */ });
        } catch (err) {
          toast("请用浏览器菜单“安装应用”或“添加到主屏幕”");
        }
        break;
      }
      case "import-data": {
        const input = $("#importFile");
        if (input) input.click();
        break;
      }
      case "export-data": {
        const exportedAt = new Date().toISOString();
        state.lastExportAt = exportedAt;
        save();
        const payload = Object.assign({}, state, {
          app: "研墨 · 考研英语",
          format: "yanmo-kaoyan-backup-v1",
          build: APP_BUILD,
          exportedAt: exportedAt
        });
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
        rerender();
        break;
      }
      case "persist-storage": {
        if (!navigator.storage || !navigator.storage.persist) {
          toast("当前浏览器不支持持久存储，请定期导出备份");
          break;
        }
        navigator.storage.persist().then(function (granted) {
          toast(granted ? "已开启持久存储" : "浏览器暂未授予；建议定期导出备份");
          refreshStorageInfo();
        }).catch(function () {
          toast("申请失败；建议定期导出备份");
        });
        break;
      }
      case "check-update": {
        if (location.protocol === "file:") {
          toast("当前是离线单文件版；在线版会自动检查更新");
          break;
        }
        if (!("serviceWorker" in navigator)) {
          toast("当前浏览器不支持离线更新");
          break;
        }
        navigator.serviceWorker.getRegistration().then(function (reg) {
          if (!reg) {
            toast("离线缓存尚未注册，请刷新页面后再试");
            return null;
          }
          return reg.update().then(function () {
            if (reg.waiting) toast("发现新版本，刷新页面即可更新");
            else if (reg.installing) toast("正在下载新版本，稍后刷新");
            else toast("当前已是最新版本");
          });
        }).catch(function () {
          toast("检查更新失败，请稍后再试");
        });
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
        ui.reviewDeck = null;
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
        closeDrawer(false);
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

    // 手机底部“更多”菜单：点链接后收起，点空白处也收起。
    document.addEventListener("click", function (e) {
      const link = e.target.closest(".mobile-more-menu a");
      if (link) {
        const box = link.closest("details");
        if (box) box.open = false;
        return;
      }
      const open = document.querySelector(".mobile-more[open]");
      if (open && !open.contains(e.target)) open.open = false;
    });

    // 任何第一次触摸都尝试给在线神经网络音暖场（函数内部自会去重）
    document.addEventListener("pointerdown", warmNativeVoice, { passive: true });

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

      if (t.id === "dictateInput") {
        if (ui.dictation) ui.dictation.value = t.value;
        return;
      }

      if (t.hasAttribute("data-exam-input")) {
        const active = state.examActive;
        if (!active) return;
        const key = t.getAttribute("data-exam-input");
        if (key === "trans") {
          active.answers.translation = t.value;
          save();
          const counter = document.querySelector('[data-exam-count="trans"]');
          if (counter) counter.textContent = "已写 " + countChars(t.value) + " 字";
          const sheet = document.querySelector('[data-sheet-sub="trans"]');
          if (sheet) {
            sheet.textContent = t.value.trim() ? "已写 " + countChars(t.value) + " 字" : "未写";
            sheet.classList.toggle("done", !!t.value.trim());
          }
          updateExamTabCount("translation", t.value.trim() ? 1 : 0, 1);
          return;
        }
        if (/^trans-s\d$/.test(key)) {
          const i = Number(key.slice(-1));
          active.answers.translationS[i] = t.value;
          save();
          const counter = document.querySelector('[data-exam-count="' + key + '"]');
          if (counter) counter.textContent = "已写 " + countChars(t.value) + " 字";
          const sheet = document.querySelector('[data-sheet-sub="trans"]');
          const n = active.answers.translationS.filter(function (x) { return String(x).trim(); }).length;
          if (sheet) {
            sheet.textContent = n + " / 5 句";
            sheet.classList.toggle("done", n > 0);
          }
          updateExamTabCount("translation", n, 5);
          return;
        }
        if (key === "wa" || key === "wb") {
          if (key === "wa") active.answers.writingA = t.value;
          else active.answers.writingB = t.value;
          save();
          const counter = document.querySelector('[data-exam-count="' + key + '"]');
          if (counter) counter.textContent = wordCount(t.value) + " 词";
          const sheet = document.querySelector('[data-sheet-sub="' + key + '"]');
          if (sheet) {
            sheet.textContent = t.value.trim() ? wordCount(t.value) + " 词" : "未写";
            sheet.classList.toggle("done", !!t.value.trim());
          }
          const writtenNow = [active.answers.writingA, active.answers.writingB].filter(function (x) { return String(x).trim(); }).length;
          updateExamTabCount("writing", writtenNow, 2);
          if (wordCount(t.value) >= 50) markTask(3, true);
          return;
        }
        return;
      }

      if (t.hasAttribute("data-trans-input")) {
        const key = t.getAttribute("data-trans-input");
        state.translations[key] = t.value;
        save();
        const counter = document.querySelector('[data-trans-count="' + key + '"]');
        if (counter) counter.textContent = "已写 " + countChars(t.value) + " 字";
        markCheckStale('[data-trans-result="' + key + '"]');
        return;
      }

      if (t.hasAttribute("data-draft")) {
        const key = t.getAttribute("data-draft");
        state.drafts[key] = t.value;
        save();
        const counter = document.querySelector('[data-draft-count="' + key + '"]');
        const n = wordCount(t.value);
        if (counter) counter.textContent = n + " 词";
        markCheckStale('[data-draft-result="' + key + '"]');
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
      if (t.id === "ttsVoiceSelect") {
        state.ttsVoice = t.value || "";
        save();
        rerender();
        toast(state.ttsVoice ? "已选定朗读声音并试读" : "已恢复自动选择声音");
        speak("This is the voice you have chosen.");
      }
      if (t.id === "importFile") {
        const file = t.files && t.files[0];
        t.value = "";
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const raw = JSON.parse(String(reader.result));
            if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("bad");
            if (raw.format && raw.format !== "yanmo-kaoyan-backup-v1") throw new Error("format");
            const known = [
              "words", "srs", "notebook", "mistakes", "days", "reading",
              "clozes", "sevens", "orders", "headings", "cloze", "seven",
              "translations", "drafts", "transSelf", "draftSelf", "trapStats",
              "exams", "examActive"
            ];
            const hasKnown = known.some(function (k) {
              return Object.prototype.hasOwnProperty.call(raw, k);
            });
            if (!hasKnown) throw new Error("empty");
            const next = normalizeState(raw);
            const exported = raw.exportedAt || raw.lastExportAt;
            const exportedTime = exported ? Date.parse(exported) : NaN;
            if (isFinite(exportedTime)) next.lastExportAt = new Date(exportedTime).toISOString();
            const summary = backupSummary(next);
            const when = isFinite(exportedTime)
              ? new Date(exportedTime).toLocaleString("zh-CN", { hour12: false })
              : "未注明";
            if (!window.confirm("导入会覆盖当前记录。\n\n备份时间：" + when + "\n\n备份内容：" + summary + "\n\n确定继续？")) return;
            Object.keys(state).forEach(function (k) { delete state[k]; });
            Object.assign(state, next);
            ui.cardIndex = 0;
            ui.cardFlipped = false;
            ui.cardSession = { known: 0, fuzzy: 0, unknown: 0, graded: 0 };
            ui.reviewDeck = null;
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
            closeDrawer(false);
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
        const more = document.querySelector(".mobile-more[open]");
        if (more) {
          more.open = false;
          const summary = more.querySelector("summary");
          if (summary) summary.focus();
          return;
        }
        if (ui.drawerWord) closeDrawer();
        return;
      }
      if (ui.drawerWord) {
        if (e.key === "Tab") {
          const drawer = $("#drawer");
          if (drawer) {
            const focusables = $$('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer);
            if (!focusables.length) {
              e.preventDefault();
              drawer.focus();
              return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
              e.preventDefault();
              first.focus();
            }
          }
        }
        return;
      }
      const tag = document.activeElement ? document.activeElement.tagName : "";
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const route = getRoute();

      if (route.name === "vocab" && ui.vocabMode === "spell" && e.key === "Enter" && document.activeElement && document.activeElement.id === "spellInput") {
        e.preventDefault();
        if (ui.spell && ui.spell.checked) spellNext();
        else spellCheck(false);
        return;
      }

      if (route.name === "vocab" && ui.vocabMode === "dictation" && e.key === "Enter" && document.activeElement && document.activeElement.id === "dictateInput") {
        e.preventDefault();
        const dt = ui.dictation;
        if (!dt) return;
        if (dt.checked) {
          const nb = document.querySelector('[data-action="dictate-next"]');
          if (nb) nb.click();
        } else {
          const cb = document.querySelector('[data-action="dictate-check"]');
          if (cb) cb.click();
        }
        return;
      }

      if (typing) return;
      if (route.name === "vocab" && ui.vocabMode === "listen") {
        const curIt = ui.listen && ui.listen.items[ui.listen.i];
        if ((e.key === "Enter" || e.key === " " || e.code === "Space") && curIt && curIt.picked >= 0) {
          e.preventDefault();
          const nb = document.querySelector('[data-action="listen-next"]');
          if (nb) nb.click();
          return;
        }
        if (e.key === " " || e.code === "Space") {
          e.preventDefault();
          const b = document.querySelector('[data-action="listen-play"]');
          if (b) b.click();
          return;
        }
      }
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
      closeDrawer(false);
      render({ routeChange: true });
    });
  }

  /* ------------------------------------------------------------------
     boot
  ------------------------------------------------------------------ */

  // 在线版首次打开后把核心文件放进 Cache Storage，断网也能重新打开。
  // file:// 打开单文件版时不注册（浏览器不允许），不影响本地使用。
  function registerOfflineCache() {
    if (!("serviceWorker" in navigator)) return;
    const secure = location.protocol === "https:"
      || location.hostname === "localhost"
      || location.hostname === "127.0.0.1";
    if (!secure) return;
    const hadController = typeof window.__yanmoHadController === "boolean"
      ? window.__yanmoHadController
      : !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (hadController) {
        window.__yanmoUpdated = false;
        toast("已更新到新版本，刷新页面后生效");
      } else if (getRoute().name === "me") {
        rerender();
      }
    });
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js?v=" + encodeURIComponent(APP_BUILD)).catch(function () { /* 离线增强失败不影响主功能 */ });
    });
  }

  bindEvents();
  registerOfflineCache();
  setInterval(timerTick, 250);
  setInterval(readingTick, 1000);
  setInterval(examTick, 500);
  render();
  if (window.__yanmoUpdated) {
    window.__yanmoUpdated = false;
    setTimeout(function () { toast("已更新到新版本，刷新页面后生效"); }, 600);
  }

})();
