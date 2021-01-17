import { isObject, isText } from "./utils.js"
import plainTextParser from "./parsers/plainTextParser.js"
import codeBlockParser from "./parsers/codeblockParser.js"
import attachParser    from "./parsers/attachParser.js"
import equationParser  from "./parsers/equationParser.js"

const lineParser = function(line, states, attaches) {
	// markdown 方式的代码块
	// 有关 codeBlock 的格式处理，其中状态改变也交给 codeBlockParser 维护
	if (states.isInCodeBlock || line.startsWith("```")) {
		return codeBlockParser(line, states);
	}

	// 如果不是在代码块中，且第一个字符不是 "#"，作为普通文本行处理
	if (line[0] != "#") {
		return plainTextParser(line, states);
	}

	// 如果行首以 "#attach " 开头，即 "#attach attachname" 的格式，用 attachParser
	// 这里可能 attachname 不存在，内部切换为普通文本
	if (line.startsWith("#attach ")) {
		return attachParser(line, states, attaches);
	}

	// 暂定格式为 #equation equation_content
	// 和附件一样，失败情况也转换为普通文本
	if (line.startsWith("#equation ")) {
		return equationParser(line, states);
	}
};

export default function(content) {
	let html = [],
		attaches = new Map(),
		states = {
			isInCodeBlock: false,
		};
	html.push("<article>");

	if (isObject(content)) {
		if (Array.isArray(content.attaches)) {
			content.attaches.forEach(attach => {
				if (isObject(attach) && isText(attach.name) && isText(attach.link)) {
					attaches.set(attach.name, attach.link);
				}
			});
		}

		if (isText(content.text)) {
			content.text.split("\n").forEach(line => {
				let line_html = lineParser(line, states, attaches);
				if (line_html != null) {
					if (Array.isArray(line_html))
						html.concat(line_html);
					else
						html.push(line_html);
				}
			});
		}
	}

	html.push("</article>");
	return html.join("");
};

