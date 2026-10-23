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
  { file: "kaoyan-high.jsonl", url: "https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/full_line_jsonl/full/%E6%AD%A3%E5%BA%8F/%E9%AB%98%E4%B8%AD.jsonl" },
  { file: "kaoyan-cet4.jsonl", url: "https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/full_line_jsonl/full/%E6%AD%A3%E5%BA%8F/%E5%9B%9B%E7%BA%A7.jsonl" },
  { file: "kaoyan-ielts.jsonl", url: "https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/full_line_jsonl/full/%E6%AD%A3%E5%BA%8F/%E9%9B%85%E6%80%9D.jsonl" }
];

function loadVocab() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ["vocab.js", "vocab-rare.js", "vocab-supplement.js", "vocab-more.js", "vocab-extra2.js", "vocab-extra3.js"]) {
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

// 源词典 pCn 有时夹带超长注解或第三个义项（多为词条外内容），压缩为前两段
function phraseCn(cn) {
  let t = clean(cn);
  if (!t) return "";
  t = t.replace(/（[^）]{12,}）/g, "").replace(/\([^)]{12,}\)/g, "").trim();
  const segs = t.split(/[；;]/).map(clean).filter(Boolean);
  return clean(segs.slice(0, 2).join("；"));
}

function collectPhrases(w, c) {
  const out = [];
  if (c && c.phrase && Array.isArray(c.phrase.phrases)) {
    for (const p of c.phrase.phrases) {
      const en = clean(p.pContent);
      const cn = phraseCn(p.pCn);
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

// 记忆方法（Kyle 词库 remMethod，词根词缀/联想记忆）→ drawer「记忆」区块
function collectMemo(c) {
  if (!c || !c.remMethod) return "";
  let t = clean(typeof c.remMethod === "string" ? c.remMethod : c.remMethod.val);
  if (!t) return "";
  t = t.replace(/^记[:：\s]*/, "");
  if (t.length > 180) {
    const cut = t.slice(0, 180);
    const stop = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("；"), cut.lastIndexOf("！"), cut.lastIndexOf("？"));
    t = (stop > 60 ? cut.slice(0, stop + 1) : cut) + "…";
  }
  return t;
}

/* Kyle 词表覆盖不到的词条音标（易混词组与个别无源词），手写补充。 */
const PH_FIX = {
  "apprehend": "ˌæprɪˈhend",
  "candid": "ˈkændɪd",
  "contingent": "kənˈtɪndʒənt",
  "endowment": "ɪnˈdaʊmənt",
  "enumerate": "ɪˈnjuːməreɪt",
  "institutional": "ˌɪnstɪˈtjuːʃənl",
  "niche": "ˈniːʃ",
  "quarantine": "ˈkwɒrəntiːn",
  "serene": "səˈriːn",
  "sibling": "ˈsɪblɪŋ",
  "disparity": "dɪˈspærəti",
  "resilient": "rɪˈzɪliənt",
  "inclined": "ɪnˈklaɪnd",
  "deter": "dɪˈtɜː",
  "affect / effect": "əˈfekt · ɪˈfekt",
  "adapt / adopt / adept": "əˈdæpt · əˈdɒpt · əˈdept",
  "principal / principle": "ˈprɪnsəpl · ˈprɪnsəpl",
  "complement / compliment": "ˈkɒmplɪment · ˈkɒmplɪmənt",
  "ensure / assure / insure": "ɪnˈʃʊə · əˈʃʊə · ɪnˈʃʊə",
  "rise / raise / arise": "raɪz · reɪz · əˈraɪz",
  "lie / lay": "laɪ · leɪ",
  "economic / economical": "ˌiːkəˈnɒmɪk · ˌiːkəˈnɒmɪkl",
  "historic / historical": "hɪˈstɒrɪk · hɪˈstɒrɪkl",
  "sensible / sensitive": "ˈsensəbl · ˈsensətɪv",
  "continual / continuous": "kənˈtɪnjuəl · kənˈtɪnjuəs",
  "alternate / alternative": "ˈɔːltəneɪt · ɔːlˈtɜːnətɪv",
  "imaginary / imaginative / imaginable": "ɪˈmædʒɪnəri · ɪˈmædʒɪnətɪv · ɪˈmædʒɪnəbl",
  "respectable / respectful / respective": "rɪˈspektəbl · rɪˈspektfl · rɪˈspektɪv",
  "beside / besides": "bɪˈsaɪd · bɪˈsaɪdz",
  "farther / further": "ˈfɑːðə · ˈfɜːðə",
  "later / latter": "ˈleɪtə · ˈlætə",
  "moral / morale": "ˈmɒrəl · məˈrɑːl",
  "personal / personnel": "ˈpɜːsənl · ˌpɜːsəˈnel",
  "precede / proceed": "prɪˈsiːd · prəˈsiːd",
  "stationary / stationery": "ˈsteɪʃənri · ˈsteɪʃənri",
  "statue / status / statute": "ˈstætjuː · ˈsteɪtəs · ˈstætjuːt",
  "confirm / conform": "kənˈfɜːm · kənˈfɔːm",
  "elicit / illicit": "ɪˈlɪsɪt · ɪˈlɪsɪt",
  "device / devise": "dɪˈvaɪs · dɪˈvaɪz"
};

const DET = new Set("a an the this that these those its their his her our your my".split(/\s+/));
const BREAK = new Set(("it they he she we you i who whom whose which what when where why how and or but nor so yet " +
  "if because while although though since until unless whether than as is are was were be been being am do does did have has had " +
  "can could may might will would shall should must not no").split(/\s+/));
const PREP = new Set("to of in on at by with from into through during before after above below between among against about up down out off over under".split(/\s+/));
const POSS = new Set("this that these those its their his her our your my".split(/\s+/));
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

// zhMap 查找带最小的屈折还原（复数/分词/动名词）
function zlookup(zhMap, low) {
  if (zhMap.has(low)) return zhMap.get(low);
  const tries = [];
  const s = low.replace(/(?:ies|es|s)$/, "");
  if (s !== low) tries.push(s);
  const y = low.replace(/ies$/, "y");
  if (y !== low) tries.push(y);
  const g1 = low.replace(/ing$/, "");
  if (g1 !== low) tries.push(g1);
  const g2 = low.replace(/ing$/, "e");
  if (g2 !== low) tries.push(g2);
  const e1 = low.replace(/ed$/, "");
  if (e1 !== low) tries.push(e1);
  const e2 = low.replace(/ed$/, "e");
  if (e2 !== low) tries.push(e2);
  for (const t of tries) if (t.length > 2 && zhMap.has(t)) return zhMap.get(t);
  return "";
}

// 短语 gloss：动词短语按「动宾」取前两个译义；名词 of 结构按「Y的X」倒装；
// 信息不足时退回「（本词义）」。
function glossOf(tokens, w, zhMap) {
  const forms = wordForms(w.w);
  const targetCn = firstCn(w.cn) || "";
  const cns = [];
  const isVerb = /^(v|vt|vi)/.test(String(w.pos || "").toLowerCase());
  for (const tok of tokens) {
    const low = tok.toLowerCase();
    if (STOP.has(low) || low === "of") continue;
    if (forms.some(function (f) { return low === f || low.indexOf(f) === 0; })) {
      if (targetCn && cns.indexOf(targetCn) === -1) cns.push(targetCn);
      continue;
    }
    const z = zlookup(zhMap, low);
    if (z && cns.indexOf(z) === -1) cns.push(z);
  }
  if (cns.length >= 2) {
    if (isVerb) return cns.slice(0, 2).join("");
    if (tokens.some(function (t) { return t.toLowerCase() === "of"; })) return cns[1] + "的" + cns[0];
    return cns.slice(0, 2).join("");
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
  const isVerbPattern = /^(v|vt|vi)/.test(pos);
  const out = [];
  for (const i of idxs.slice(0, 3)) {
    const chunk = [];
    if (isVerbPattern) {
      chunk.push(tokens[i]);
      for (let j = i + 1; j < tokens.length && chunk.length < 5; j++) {
        const low = tokens[j].toLowerCase();
        if (BREAK.has(low)) break;
        if (DET.has(low)) { chunk.push(tokens[j]); continue; }
        if (PREP.has(low)) { chunk.push(tokens[j]); continue; }
        if (POSS.has(low)) break; // 物主/指示词开头的宾语（如 your grandmother）不是通用搭配，截断
        chunk.push(tokens[j]);
        if (chunk.length >= 3 && !DET.has(tokens[j - 1].toLowerCase()) && !PREP.has(tokens[j - 1].toLowerCase())) break;
      }
      // 去掉栈里已带入的 POSS 词及其后缀
      const pi = chunk.findIndex(function (t, x) { return x > 0 && POSS.has(t.toLowerCase()); });
      if (pi > 0) chunk.length = pi;
    } else if (/^(a|adj)/.test(pos)) {
      chunk.push(tokens[i]);
      if (tokens[i + 1] && !BREAK.has(tokens[i + 1].toLowerCase()) && !DET.has(tokens[i + 1].toLowerCase())) chunk.push(tokens[i + 1]);
    } else {
      // 前邻是专名（大写开头）时是「Knicks versus」类片段，跳过
      if (i > 0 && /^[A-Z]/.test(tokens[i - 1])) continue;
      if (tokens[i - 1] && !BREAK.has(tokens[i - 1].toLowerCase()) && !DET.has(tokens[i - 1].toLowerCase()) && !PREP.has(tokens[i - 1].toLowerCase())) chunk.push(tokens[i - 1]);
      chunk.push(tokens[i]);
      if (tokens[i + 1] && tokens[i + 1].toLowerCase() === "of" && tokens[i + 2]) {
        chunk.push("of");
        if (!DET.has(tokens[i + 2].toLowerCase())) chunk.push(tokens[i + 2]);
      }
    }
    const gloss = glossOf(chunk, w, zhMap);
    if (chunk.length >= 2) out.push(chunk.join(" ") + " " + gloss);
    // wider context: keeps prepositions and one or two surrounding words, still a real fragment
    let a = Math.max(0, i - 2);
    let b = Math.min(tokens.length, i + 4);
    while (a < i && (BREAK.has(tokens[a].toLowerCase()) || DET.has(tokens[a].toLowerCase()))) a++;
    const wide = tokens.slice(a, b);
    // 末尾的连接词/冠词（如 …and / …the）是截断噪声，剪掉
    while (wide.length && (BREAK.has(wide[wide.length - 1].toLowerCase()) || DET.has(wide[wide.length - 1].toLowerCase()) || POSS.has(wide[wide.length - 1].toLowerCase()))) wide.pop();
    // 片段里出现 2 个以上专名（如 New York Knicks versus the LA Lakers）则为专有场景，跳过
    let caps = 0;
    for (let t = 1; t < wide.length; t++) if (/^[A-Z]/.test(wide[t])) caps++;
    if (caps >= 2) continue;
    if (wide.length > chunk.length + 1 && wide.length >= 3 && !DET.has(wide[0].toLowerCase()) && !BREAK.has(wide[0].toLowerCase())) {
      // gloss 从关键词起翻译；关键词前的主语/中心词有译义时以「X：」标出
      let wg = glossOf(wide.slice(i - a), w, zhMap);
      const head = (i - a > 0 && wg && wg.indexOf("（") !== 0) ? zlookup(zhMap, wide[0].toLowerCase()) : "";
      if (head) wg = head + "：" + wg;
      out.push(wide.join(" ") + " " + (wg || gloss));
    }
    // short particle pattern for verbs: "adhere to", "allege that"
    if (chunk.length === 1 && tokens[i + 1] && (PREP.has(tokens[i + 1].toLowerCase()) || tokens[i + 1].toLowerCase() === "that")) {
      out.push(tokens[i] + " " + tokens[i + 1] + " " + gloss);
    }
  }
  return unique(out);
}

// 抽干作拼结果按英文去重：同一搭配只保留第一条（源词典优先）
function enKey(p) {
  const m = /^(.*?)(?:\s*[\u4e00-\u9fff（(]|$)/.exec(String(p));
  return m[1].replace(/\s+/g, " ").trim().toLowerCase();
}

function dedupePhr(list) {
  const seen = new Set();
  return (list || []).filter(function (p) {
    const k = enKey(p);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// 例句要完整、有信息量：优先 25～160 字符、带译文的句子，长度越接近 90 越好
function pickEx(list) {
  if (!list || !list.length) return null;
  const good = list.filter(function (s) { return s && s.en && s.cn && s.en.length >= 25 && s.en.length <= 160; });
  if (!good.length) return list[0] || null;
  good.sort(function (x, y) { return Math.abs(x.en.length - 90) - Math.abs(y.en.length - 90); });
  return good[0];
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
  const stats = { total: vocab.length, fromSource: 0, fromBase: 0, missing: [], incomplete: [], curated: 0, memo: 0, phMissing: [] };
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
      const ex = pickEx(sents) || { en: base.ex, cn: base.exCn };
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
    if (Array.isArray(entry.phr)) entry.phr = dedupePhr(entry.phr);
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
    const ph = clean(w.ph) || (c && (clean(c.ukphone) || clean(c.usphone) || clean(c.phone))) || clean(PH_FIX[w.w]) || "";
    if (ph) entry.ph = ph; else stats.phMissing.push(w.w);
    if (old && old.memo) { entry.memo = old.memo; stats.memo++; }
    else {
      let m = collectMemo(c);
      if (!m) {
        // 易混词组条目：从组分词聚合各自的记忆方法
        const parts = String(w.w).split("/").map(clean).filter(function (x) { return x && !/[\u4e00-\u9fa5]/.test(x); });
        if (parts.length > 1) {
          const got = [];
          for (const p of parts) {
            const pm = collectMemo(srcContent(p, map));
            if (pm) got.push(p + "：" + pm);
          }
          if (got.length >= 2) m = got.join("；");
        }
      }
      if (m) { entry.memo = m; stats.memo++; }
    }
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
    memo: stats.memo,
    phMissing: stats.phMissing.length,
    phMissingSample: stats.phMissing.slice(0, 20),
    incomplete: stats.incomplete.length,
    missingSample: stats.incomplete.slice(0, 20)
  }, null, 2));
}

main().catch(function (e) { console.error(e); process.exit(1); });