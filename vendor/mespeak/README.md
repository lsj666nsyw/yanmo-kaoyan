# meSpeak 离线语音

本目录内的 `mespeak.js`、`mespeak-core.js` 与 `voice-en-us.js` 来自 meSpeak（eSpeak 的 JavaScript 移植），用于在浏览器没有可用英文语音时提供离线发音兜底。

- 项目主页：https://www.masswerk.at/mespeak/
- 上游代码：https://github.com/kripken/speak.js / eSpeak
- 许可证：GNU General Public License（见 `LICENSE.txt`）
- 本目录文件未做算法修改；`mespeak.js` 仅强制关闭 Web Worker，并在核心已加载时跳过动态注入，以兼容 `file://` 与单文件版。

应用运行时不访问网络；语音数据已内嵌在 `voice-en-us.js`。
