/* 把 app.js 之前的数据脚本合并成一个 all-data.js，减少线上请求数。
   运行：node tools/build-bundle.js
   新增数据文件时，把它加入 FILES（顺序与原先的 index.html 一致）。 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILES = [
  "vocab.js", "vocab-rare.js", "vocab-supplement.js", "vocab-more.js", "vocab-extra2.js", "vocab-extra3.js",
  "sentences.js", "sentences-extra.js", "sentences-more.js",
  "reading.js", "reading-extra.js", "reading-more.js", "reading-extra2.js",
  "evidence.js", "evidence-extra.js", "evidence-more.js", "evidence-extra2.js",
  "traps.js", "traps-more.js",
  "exercises.js", "exercises-extra.js", "exercises-more.js",
  "newtypes.js", "newtypes-more.js",
  "translation.js", "translation-extra.js", "translation-more.js", "translation-extra2.js", "translation-passages.js",
  "writing.js", "writing-more.js", "writing-phrases.js",
  "plan.js"
];

const header = "/* 数据包：由 tools/build-bundle.js 合并生成；源文件仍保存在 data/ 下。 */\n";
let out = header;
for (const f of FILES) {
  const p = path.join(ROOT, "data", f);
  if (!fs.existsSync(p)) throw new Error("missing " + f);
  const js = fs.readFileSync(p, "utf8");
  if (js.indexOf("</script") !== -1) throw new Error("unsafe </script in " + f);
  out += "\n/* ---- " + f + " ---- */\n" + js + "\n";
}
fs.writeFileSync(path.join(ROOT, "data", "all-data.js"), out, "utf8");

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
// 幂等替换：无论此前是 data/vocab.js 行还是 data/all-data.js 行，都归并为单行 all-data（保留 defer）
const re = /<script src="data\/(?:all-data|vocab)\.js"[^>]*><\/script>\n?/;
if (!re.test(html)) throw new Error("script block not found");
html = html.replace(re, "<script src=\"data/all-data.js\" defer></script>\n");
fs.writeFileSync(path.join(ROOT, "index.html"), html, "utf8");
console.log("bundle", (fs.statSync(path.join(ROOT, "data", "all-data.js")).size / 1024).toFixed(0) + " KB", "files", FILES.length);