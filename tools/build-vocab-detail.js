/* 从公开词库生成完整词条卡：用法、义项、搭配、例句、近义、词族、辨析。
   运行：node tools/build-vocab-detail.js
   数据源：KyleBing/english-vocabulary（BSD-3-Clause）与 NETEMVocabulary（CC BY-NC-SA 4.0）。
   仅用于个人学习，非商业分发。 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const TMP = "C:\\Users\\21821\\AppData\\Local\\Temp\\opencode";
const SOURCES = [
  { file: "kaoyan-full.jsonl", url: "https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/full_line_jsonl/full/%E6%AD%A3%E5%BA%8F/%E8%80%83%E7%A0%94.jsonl" },
  { file: "kaoyan-cet6.jsonl", url: "https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/full_line_jsonl/full/%E6%AD%A3%E5%BA%8F/%E5%85%AD%E7%BA%A7.jsonl" },
  { file: "kaoyan-high.jsonl", url: "https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/full_line_jsonl/full/%E6%AD%A3%E5%BA%8F/%E9%AB%98%E4%B8%AD.jsonl" }
];

function loadVocab() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ["vocab.js", "vocab-rare.js", "vocab-supplement.js", "vocab-more.js", "vocab-extra2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, "data", f), "utf8"), ctx, { filename: f });
  }
  const seen = new Set();
  return (ctx.window.VOCAB || []).filter(function (w) {
    const k = String(w.w || "").toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function ensureSource(src) {
  const p = path.join(TMP, src.file);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) return p;
  fs.mkdirSync(TMP, { recursive: true });
  const r = await fetch(src.url, { headers: { "User-Agent": "yanmo-kaoyan/1.0" } });
  if (!r.ok) throw new Error("download " + src.file + " " + r.status);
  fs.writeFileSync(p, await r.text(), "utf8");
  return p;
}

async function loadSourceMap() {
  const map = new Map();
  const sentenceMap = new Map();
  for (const src of SOURCES) {
    const p = await ensureSource(src);
    const lines = fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      try {
        const j = JSON.parse(line);
        const k = String(j.headWord || "").toLowerCase();
        if (!k) continue;
        if (!map.has(k)) map.set(k, j);
        const c = j.content && j.content.word && j.content.word.content;
        const list = (c && c.sentence && c.sentence.sentences) || [];
        if (list.length) {
          const arr = sentenceMap.get(k) || [];
          for (const s of list) {
            if (s && s.sContent && !arr.some(function (x) { return x.sContent === s.sContent; })) arr.push(s);
          }
          sentenceMap.set(k, arr);
        }
      } catch (e) {}
    }
  }
  return { map: map, sentenceMap: sentenceMap };
}

function uniqueSentences(list) {
  const seen = new Set();
  const out = [];
  for (const s of list || []) {
    const en = clean(s && s.sContent);
    if (!en || seen.has(en)) continue;
    seen.add(en);
    out.push({ en: en, cn: clean(s.sCn) });
  }
  return out;
}

function loadExisting() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  const files = ["vocab-detail.js"];
  for (const f of files) {
    const p = path.join(ROOT, "data", f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f });
  }
  const out = Object.assign({}, ctx.window.VOCAB_DETAIL || {});
  const batchDir = path.join(ROOT, "data", "vocab-detail", "batches");
  if (fs.existsSync(batchDir)) {
    for (const f of fs.readdirSync(batchDir)) {
      if (!/^batch-.*\.json$/.test(f)) continue;
      try {
        const obj = JSON.parse(fs.readFileSync(path.join(batchDir, f), "utf8"));
        for (const k of Object.keys(obj)) out[k] = obj[k];
      } catch (e) {}
    }
  }
  for (const name of ["vocab-detail-extra.js", "vocab-detail-confusions.js", "vocab-detail-phrases.js"]) {
    const p = path.join(ROOT, "data", name);
    if (fs.existsSync(p)) {
      try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: name }); } catch (e) { console.warn(name + " load failed", e.message); }
    }
  }
  return Object.assign(out, ctx.window.VOCAB_DETAIL || {});
}

function clean(s) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
}

function unique(arr) {
  const seen = new Set();
  return arr.filter(function (x) {
    const k = clean(x).toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function srcContent(word, map) {
  const j = map.get(String(word).toLowerCase());
  return j && j.content && j.content.word && j.content.word.content ? j.content.word.content : null;
}

function collectDefs(c) {
  const out = [];
  if (c && Array.isArray(c.trans)) {
    for (const t of c.trans) {
      const cn = clean(t.tranCn);
      if (!cn) continue;
      out.push({ pos: clean(t.pos), cn: cn, en: clean(t.tranOther) });
    }
  }
  return out;
}

function collectPhrases(w, c) {
  const out = [];
  if (c && c.phrase && Array.isArray(c.phrase.phrases)) {
    for (const p of c.phrase.phrases) {
      const en = clean(p.pContent);
      const cn = clean(p.pCn);
      if (!en || !cn) continue;
      out.push(en + " " + cn);
    }
  }
  const base = String(w.note || "").split(/[；;、]/).map(clean).filter(Boolean);
  for (const b of base) out.push(b);
  return unique(out).slice(0, 5);
}

function collectSentences(c) {
  const out = [];
  if (c && c.sentence && Array.isArray(c.sentence.sentences)) {
    for (const s of c.sentence.sentences) {
      const en = clean(s.sContent);
      const cn = clean(s.sCn);
      if (en && cn) out.push({ en: en, cn: cn });
    }
  }
  return out;
}

function posSet(pos) {
  const p = String(pos || "").toLowerCase();
  const out = [];
  if (/(^|[^a-z])v(t|i)?([^a-z]|$)/.test(p) || /^v\./.test(p)) out.push("v");
  if (/(^|[^a-z])n([^a-z]|$)/.test(p) || /^n\./.test(p)) out.push("n");
  if (/(^|[^a-z])(a|adj)([^a-z]|$)/.test(p) || /^a\./.test(p)) out.push("a");
  if (/(^|[^a-z])ad(v)?([^a-z]|$)/.test(p) || /^ad\./.test(p)) out.push("ad");
  return out;
}

function posMatch(groupPos, bases) {
  if (!bases.length) return true;
  const g = String(groupPos || "").toLowerCase().replace(/[^a-z]/g, "");
  return bases.some(function (b) {
    if (b === "v") return /^(v|vt|vi)$/.test(g);
    if (b === "n") return g === "n";
    if (b === "a") return g === "a" || g === "adj";
    if (b === "ad") return g === "ad" || g === "adv";
    return false;
  });
}

function collectSyns(w, c) {
  const bases = posSet(w.pos);
  const all = [];
  const matched = [];
  if (c && c.syno && Array.isArray(c.syno.synos)) {
    for (const group of c.syno.synos) {
      if (Array.isArray(group.hwds)) {
        for (const h of group.hwds) {
          const s = clean(h.w);
          if (!s || s.toLowerCase() === String(w.w).toLowerCase() || s.length > 32) continue;
          all.push(s);
          if (posMatch(group.pos, bases)) matched.push(s);
        }
      }
    }
  }
  return unique(matched.length ? matched : all).slice(0, 4);
}

function collectFamily(c) {
  const out = [];
  const seen = new Set();
  if (c && c.relWord && Array.isArray(c.relWord.rels)) {
    for (const g of c.relWord.rels) {
      if (Array.isArray(g.words)) {
        for (const x of g.words) {
          const h = clean(x.hwd);
          if (!h || seen.has(h.toLowerCase())) continue;
          seen.add(h.toLowerCase());
          let t = clean(x.tran).replace(/[；;].*$/, "");
          if (t.length > 26) t = t.slice(0, 26) + "…";
          out.push(t ? h + "（" + t + "）" : h);
        }
      }
    }
  }
  return out.slice(0, 6);
}

const DET = new Set("a an the this that these those its their his her our your my".split(/\s+/));
const BREAK = new Set(("it they he she we you i who whom whose which what when where why how and or but nor so yet " +
  "if because while although though since until unless whether than as is are was were be been being am do does did have has had " +
  "can could may might will would shall should must not no").split(/\s+/));
const PREP = new Set("to of in on at by with from into through during before after above below between among against about up down out off over under".split(/\s+/));
const STOP = new Set(("a an the this that these those it its their his her our your my we they he she you i " +
  "is are was were be been being am do does did have has had can could may might will would shall should must " +
  "not no as than so such very more most less least also just only even still yet already often sometimes always never ever " +
  "both each either neither all any some many much few little other another same own " +
  "up down out off over under again then once here there when where why how if because while although though since until unless whether " +
  "or and but nor for to of in on at by with from into through during before after above below between among against about " +
  "more than less than as well as rather than").split(/\s+/));

function firstCn(s) {
  let t = clean(s);
  t = t.replace(/\[[^\]]*\]/g, "").replace(/\([^)]*\)/g, "").replace(/（[^）]*）/g, "");
  t = t.split(/[；;，,、/]/)[0].replace(/^[a-zA-Z]+\.\s*/, "").trim();
  return t.slice(0, 16);
}

function buildZhMap(map) {
  const zh = new Map();
  for (const [k, j] of map) {
    const c = j && j.content && j.content.word && j.content.word.content;
    if (c && Array.isArray(c.trans) && c.trans[0]) {
      const z = firstCn(c.trans[0].tranCn);
      if (z) zh.set(k, z);
    }
  }
  return zh;
}

function wordForms(w) {
  const b = String(w).toLowerCase();
  const f = [b, b + "s", b + "es", b + "ed", b + "d", b + "ing"];
  if (b.endsWith("e")) f.push(b.slice(0, -1) + "ing", b.slice(0, -1) + "ed");
  if (b.endsWith("y")) f.push(b.slice(0, -1) + "ies", b.slice(0, -1) + "ied");
  return f;
}

function translateChunk(chunk, w, zhMap) {
  const forms = wordForms(w.w);
  const targetCn = firstCn(w.cn) || "";
  const cns = [];
  for (const tok of chunk) {
    const low = tok.toLowerCase();
    if (STOP.has(low)) continue;
    if (forms.some(function (f) { return low === f || low.indexOf(f) === 0; })) {
      if (targetCn) cns.push(targetCn);
      continue;
    }
    const z = zhMap.get(low);
    if (z) cns.push(z);
  }
  if (cns.length >= 2) {
    if (chunk.indexOf("of") !== -1 && !/^(v|vt|vi)/.test(String(w.pos || "").toLowerCase())) {
      return cns.slice(1).join("") + "的" + cns[0];
    }
    return cns.join("");
  }
  return targetCn ? "（" + targetCn + "）" : "";
}

function derivePhrases(w, ex, zhMap) {
  if (!ex) return [];
  const tokens = [];
  const re = /[A-Za-z][A-Za-z'-]*/g;
  let m;
  while ((m = re.exec(ex))) tokens.push(m[0]);
  if (!tokens.length) return [];
  const forms = wordForms(w.w);
  const idxs = [];
  for (let i = 0; i < tokens.length; i++) {
    const low = tokens[i].toLowerCase();
    if (forms.some(function (f) { return low === f || low.indexOf(f) === 0; })) idxs.push(i);
  }
  const pos = String(w.pos || "").toLowerCase();
  const out = [];
  for (const i of idxs.slice(0, 3)) {
    const chunk = [];
    if (/^(v|vt|vi)/.test(pos)) {
      chunk.push(tokens[i]);
      for (let j = i + 1; j < tokens.length && chunk.length < 5; j++) {
        const low = tokens[j].toLowerCase();
        if (BREAK.has(low)) break;
        if (DET.has(low)) { chunk.push(tokens[j]); continue; }
        if (PREP.has(low)) { chunk.push(tokens[j]); continue; }
        chunk.push(tokens[j]);
        if (chunk.length >= 3 && !DET.has(tokens[j - 1].toLowerCase()) && !PREP.has(tokens[j - 1].toLowerCase())) break;
      }
    } else if (/^(a|adj)/.test(pos)) {
      chunk.push(tokens[i]);
      if (tokens[i + 1] && !BREAK.has(tokens[i + 1].toLowerCase()) && !DET.has(tokens[i + 1].toLowerCase())) chunk.push(tokens[i + 1]);
    } else {
      if (tokens[i - 1] && !BREAK.has(tokens[i - 1].toLowerCase()) && !DET.has(tokens[i - 1].toLowerCase()) && !PREP.has(tokens[i - 1].toLowerCase())) chunk.push(tokens[i - 1]);
      chunk.push(tokens[i]);
      if (tokens[i + 1] && tokens[i + 1].toLowerCase() === "of" && tokens[i + 2]) {
        chunk.push("of");
        if (!DET.has(tokens[i + 2].toLowerCase())) chunk.push(tokens[i + 2]);
      }
    }
    const targetCn = firstCn(w.cn);
    const gloss = targetCn ? "（" + targetCn + "）" : "";
    if (chunk.length >= 2) out.push(chunk.join(" ") + " " + gloss);
    // wider context: keeps prepositions and one or two surrounding words, still a real fragment
    let a = Math.max(0, i - 2);
    let b = Math.min(tokens.length, i + 4);
    while (a < i && (BREAK.has(tokens[a].toLowerCase()) || DET.has(tokens[a].toLowerCase()))) a++;
    const wide = tokens.slice(a, b);
    if (wide.length > chunk.length + 1 && wide.length >= 3 && !DET.has(wide[0].toLowerCase())) {
      out.push(wide.join(" ") + " " + gloss);
    }
    // short particle pattern for verbs: "adhere to", "allege that"
    if (chunk.length === 1 && tokens[i + 1] && (PREP.has(tokens[i + 1].toLowerCase()) || tokens[i + 1].toLowerCase() === "that")) {
      out.push(tokens[i] + " " + tokens[i + 1] + " " + gloss);
    }
  }
  return unique(out);
}

function firstPos(w, defs) {
  const base = clean(w.pos);
  if (base) return base;
  const ps = unique(defs.map(function (d) { return d.pos; }).filter(Boolean));
  return ps.join("/");
}

function buildUse(w, c, defs, phr) {
  const rawPos = firstPos(w, defs).replace(/[。]+$/, "").trim();
  const posLabel = rawPos ? (/[.]$/.test(rawPos) ? rawPos : rawPos + ".") : "";
  let s = posLabel ? posLabel + " " : "";
  if (defs[0]) {
    s += defs[0].cn + (defs[0].en ? "（" + defs[0].en + "）" : "") + "。";
  } else {
    s += clean(w.cn) + "。";
  }
  if (defs.length > 1) {
    s += "其他义项：" + defs.slice(1, 3).map(function (d) { return d.cn; }).join("；") + "。";
  }
  if (phr[0]) s += "常见搭配：" + phr[0] + "。";
  return s.slice(0, 320);
}

function buildDeep(w, c, defs, phr, syns) {
  const parts = [];
  if (syns.length) {
    parts.push("近义表达有 " + syns.slice(0, 5).join("、") + "；它们并非完全可替换，做题时要看搭配、程度和语域。");
  }
  if (defs.length > 1) {
    parts.push("该词有多个义项（" + defs.slice(0, 3).map(function (d) { return d.cn; }).join("；") + "），阅读时先根据句法位置和搭配确定词义。");
  }
  const word = String(w.w);
  const phrasal = phr.find(function (p) {
    return new RegExp("^" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s+(to|on|in|with|for|of|up|out|off|into|through|against|upon|about|from)\\b", "i").test(p);
  });
  if (phrasal) parts.push("注意 " + phrasal + " 是短语搭配，整体义与单词本义不同，不能逐字直译。");
  if (w.tag === "熟词僻义") parts.push("这是熟词僻义，不能只按最常见的中文义理解。");
  if (!parts.length) {
    parts.push("例句展示了它在真实语境中的搭配；写作时优先复用这一搭配，避免逐字直译。");
  }
  return parts.join("").slice(0, 360);
}

function mergePartial(entry, old) {
  if (!old) return entry;
  if (old.use) entry.use = old.use;
  if (Array.isArray(old.phr) && old.phr.length) entry.phr = unique(old.phr.concat(entry.phr || []));
  if (old.ex) {
    entry.ex = old.ex;
    if (old.exCn) entry.exCn = old.exCn;
  }
  if (old.deep) entry.deep = old.deep;
  return entry;
}

function fallbackEntry(w, existing) {
  const pos = clean(w.pos);
  const cn = clean(w.cn);
  const note = clean(w.note);
  const phr = note ? note.split(/[；;、]/).map(clean).filter(Boolean) : [];
  const ex = clean(w.ex);
  const exCn = clean(w.exCn);
  const posLabel = pos ? (/[.]$/.test(pos) ? pos : pos + ".") : "";
  const use = (posLabel ? posLabel + " " : "") + cn + "。" + (phr[0] ? "常见搭配：" + phr[0] + "。" : "");
  const deep = ex
    ? "例句给出了它在真实语境中的用法；注意 " + (phr[0] || "它的常见搭配") + "，不要只背中文义。"
    : "";
  return {
    use: use,
    phr: phr.length ? phr : [],
    ex: ex,
    exCn: exCn,
    deep: deep
  };
}

async function main() {
  const vocab = loadVocab();
  const sourceInfo = await loadSourceMap();
  const map = sourceInfo.map;
  const sentenceMap = sourceInfo.sentenceMap;
  const zhMap = buildZhMap(map);
  const existing = loadExisting();
  const out = {};
  const stats = { total: vocab.length, fromSource: 0, fromBase: 0, missing: [], incomplete: [], curated: 0 };
  for (const w of vocab) {
    const old = existing[w.w];
    const c = srcContent(w.w, map);
    const defs = collectDefs(c);
    const sents = uniqueSentences(collectSentences(c).concat(sentenceMap.get(String(w.w).toLowerCase()) || []));
    let phr = collectPhrases(w, c);
    for (const s of sents) phr = phr.concat(derivePhrases(w, s.en, zhMap));
    phr = unique(phr).slice(0, 5);
    const syns = collectSyns(w, c);
    const family = collectFamily(c);
    const base = fallbackEntry(w, old);
    let entry;
    if (old && old.use && Array.isArray(old.phr) && old.phr.length && old.ex && old.exCn && old.deep) {
      entry = {
        use: old.use,
        phr: old.phr,
        ex: old.ex,
        exCn: old.exCn,
        deep: old.deep
      };
      stats.curated++;
    } else if (c) {
      const ex = sents[0] || { en: base.ex, cn: base.exCn };
      entry = {
        use: buildUse(w, c, defs, phr),
        phr: phr,
        ex: ex.en,
        exCn: ex.cn,
        deep: buildDeep(w, c, defs, phr, syns)
      };
      stats.fromSource++;
    } else {
      entry = base;
      stats.fromBase++;
    }
    entry = mergePartial(entry, old);
    // fill missing fields from base / source without overwriting curated content
    if (!entry.use) entry.use = base.use;
    if (!Array.isArray(entry.phr) || !entry.phr.length) entry.phr = base.phr;
    if (!entry.ex) entry.ex = base.ex;
    if (!entry.exCn) entry.exCn = base.exCn;
    if (!entry.deep) entry.deep = base.deep;
    if (entry.ex && !entry.exCn) entry.exCn = "参考译文暂缺。";
    if (!Array.isArray(entry.phr)) entry.phr = [];
    if (defs.length) entry.defs = defs.slice(0, 6);
    if (syns.length) entry.syn = syns;
    if (family.length) entry.family = family;
    const ph = clean(w.ph) || (c && (clean(c.ukphone) || clean(c.usphone))) || "";
    if (ph) entry.ph = ph;
    out[w.w] = entry;
    const bad = [];
    if (!entry.use) bad.push("use");
    if (!Array.isArray(entry.phr) || entry.phr.length < 2) bad.push("phr");
    if (!entry.ex) bad.push("ex");
    if (!entry.exCn || entry.exCn === "参考译文暂缺。") bad.push("exCn");
    if (!entry.deep) bad.push("deep");
    if (bad.length) stats.incomplete.push({ w: w.w, bad: bad, phraseCount: (entry.phr || []).length });
  }
  const keys = Object.keys(out).sort(function (a, b) { return a.localeCompare(b); });
  const sorted = {};
  for (const k of keys) sorted[k] = out[k];
  const header = `/* 自动生成，勿手改。数据源：KyleBing/english-vocabulary（BSD-3-Clause）与 NETEMVocabulary（CC BY-NC-SA 4.0）。仅用于个人学习，非商业分发。 */\n`;
  fs.writeFileSync(path.join(ROOT, "data", "vocab-detail-data.js"), header + "window.VOCAB_DETAIL=Object.assign(window.VOCAB_DETAIL||{}," + JSON.stringify(sorted) + ");\n" + "if(typeof window.dispatchEvent===\"function\"&&typeof Event!==\"undefined\"){window.dispatchEvent(new Event(\"vocabdetailready\"));}\n", "utf8");
  fs.writeFileSync(path.join(ROOT, "data", "vocab-detail-stats.json"), JSON.stringify(stats, null, 2), "utf8");
  console.log(JSON.stringify({
    total: stats.total,
    fromSource: stats.fromSource,
    fromBase: stats.fromBase,
    curated: stats.curated,
    incomplete: stats.incomplete.length,
    missingSample: stats.incomplete.slice(0, 20)
  }, null, 2));
}

main().catch(function (e) { console.error(e); process.exit(1); });