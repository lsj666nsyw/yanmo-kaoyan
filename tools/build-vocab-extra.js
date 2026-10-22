/* 从公开考研词库补充 300 个未收录词条。运行：node tools/build-vocab-extra.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SRC = "C:\\Users\\21821\\AppData\\Local\\Temp\\opencode\\kaoyan-full.jsonl";

function loadVocab() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ["vocab.js", "vocab-rare.js", "vocab-supplement.js", "vocab-more.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, "data", f), "utf8"), ctx, { filename: f });
  }
  return ctx.window.VOCAB || [];
}

function clean(s) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
}

function posLabel(pos) {
  const p = clean(pos).toLowerCase();
  if (/^vt|^vi|^v/.test(p)) return "v.";
  if (/^n/.test(p)) return "n.";
  if (/^adj|^a/.test(p)) return "a.";
  if (/^adv|^ad/.test(p)) return "ad.";
  if (/^prep/.test(p)) return "prep.";
  if (/^conj/.test(p)) return "conj.";
  return p ? p + "." : "";
}

const existing = new Set(loadVocab().map(function (w) { return String(w.w).toLowerCase(); }));
const rows = [];
for (const line of fs.readFileSync(SRC, "utf8").split(/\r?\n/).filter(Boolean)) {
  try {
    const j = JSON.parse(line);
    const w = clean(j.headWord);
    if (!w || existing.has(w.toLowerCase())) continue;
    if (!/^[a-zA-Z][a-zA-Z'-]*$/.test(w)) continue;
    if (w.length < 3 || w.length > 24) continue;
    const c = j.content && j.content.word && j.content.word.content;
    if (!c || !Array.isArray(c.trans) || !c.trans.length) continue;
    const trans = c.trans.filter(function (t) { return clean(t.tranCn); });
    if (!trans.length) continue;
    const cn = trans.slice(0, 2).map(function (t) { return clean(t.tranCn); }).join("；");
    const pos = posLabel(trans[0].pos);
    const ph = clean(c.ukphone || c.usphone || "");
    const sent = (c.sentence && c.sentence.sentences && c.sentence.sentences[0]) || null;
    const phr = (c.phrase && c.phrase.phrases && c.phrase.phrases[0]) || null;
    rows.push({
      rank: Number(j.wordRank) || 999999,
      w: w,
      ph: ph,
      pos: pos,
      cn: cn,
      ex: sent ? clean(sent.sContent) : "",
      exCn: sent ? clean(sent.sCn) : "",
      tag: "补充",
      note: phr ? clean(phr.pContent) + " " + clean(phr.pCn) : ""
    });
  } catch (e) {}
}
rows.sort(function (a, b) { return a.rank - b.rank; });
const picked = rows.slice(0, 300).map(function (x) {
  const out = { w: x.w, pos: x.pos, cn: x.cn, tag: x.tag };
  if (x.ph) out.ph = x.ph;
  if (x.ex) { out.ex = x.ex; out.exCn = x.exCn; }
  if (x.note) out.note = x.note;
  return out;
});
const header = `/* 从 KyleBing/english-vocabulary（BSD-3-Clause）补充的考研词条；仅用于个人学习。 */\n`;
fs.writeFileSync(path.join(ROOT, "data", "vocab-extra2.js"), header + "window.VOCAB=(window.VOCAB||[]).concat(" + JSON.stringify(picked, null, 2) + ");\n", "utf8");
console.log(JSON.stringify({ candidates: rows.length, added: picked.length, first: picked.slice(0, 12).map(function (x) { return x.w; }) }, null, 2));