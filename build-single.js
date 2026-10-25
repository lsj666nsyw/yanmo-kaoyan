/* 单文件打包脚本
   把 CSS 与全部数据/逻辑脚本内联进一个 HTML，生成《研墨-考研英语.html》。
   用途：方便发到手机上直接打开，无需服务器、无需联网。
   用法：node build-single.js
   说明：源文件仍是 index.html + assets + data + js；改内容后重新运行本脚本即可。 */

const fs = require("fs");
const path = require("path");

const root = __dirname;
const outFile = path.join(root, "研墨-考研英语.html");
const mobileFile = path.join(root, "yanmo-kaoyan-mobile.html");

let html = fs.readFileSync(path.join(root, "index.html"), "utf8");

// 内联样式表
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, function (m, href) {
  const css = fs.readFileSync(path.join(root, href), "utf8");
  return "<style>\n" + css + "\n</style>";
});

// 内联脚本（按 index.html 中的顺序）
html = html.replace(/<script src="([^"]+)"(?:\s+defer)?><\/script>/g, function (m, src) {
  const js = fs.readFileSync(path.join(root, src), "utf8");
  if (js.indexOf("</script") !== -1) {
    throw new Error("脚本内含 </script，需转义后再内联：" + src);
  }
  return "<script>\n" + js + "\n</script>";
});

const note = "<!-- 研墨 · 考研英语（单文件版）｜由 build-single.js 生成，请勿直接编辑；改内容请改源文件后重新打包 -->\n";
html = html.replace("<!doctype html>\n", "<!doctype html>\n" + note);

fs.writeFileSync(outFile, html, "utf8");
fs.writeFileSync(mobileFile, html, "utf8");
console.log("已生成", outFile, (fs.statSync(outFile).size / 1024).toFixed(0) + " KB");
console.log("手机版", mobileFile, (fs.statSync(mobileFile).size / 1024).toFixed(0) + " KB");
