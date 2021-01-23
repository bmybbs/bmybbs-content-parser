import { LineParser } from "../definitions"
import { escapeHtml, langSets, langFallback } from "../utils"

const codeblockParser: LineParser = async (line, states) => {
	if (line.startsWith("```")) {
		// 处理起始、终止
		if (states.isInCodeBlock) {
			states.isInCodeBlock = false;

			// TODO 恢复之前的状态
			return "</code></pre>";
		} else {
			// TODO 终止之前的状态

			states.isInCodeBlock = true;
			const lang = line.substring(4).toLowerCase();
			const langstr = langSets.has(lang) ? lang : langFallback;

			return `<pre><code class="language-${langstr}">`;
		}
	} else {
		// 一般情况则追加原始行以及换行符到 states.code.source 中
		return [escapeHtml(line), "\n"];
	}
}

export default codeblockParser;

