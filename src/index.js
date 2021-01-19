import { isObject, isText } from "./utils.js"
import plainTextParser from "./parsers/plainTextParser.js"
import codeBlockParser from "./parsers/codeblockParser.js"
import attachParser    from "./parsers/attachParser.js"

const lineParser = (line, states, attaches) => {
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
};

export default async (content) => {
	let html = [],
		attaches = new Map(),
		states = {
			isInCodeBlock: false,
		};
	html.push("<article>");

	if (isObject(content)) {
		if (Array.isArray(content.attaches)) {
			content.attaches.forEach(attach => {
				// attach: { name: String, link: String, signature: Array }
				if (isObject(attach) && isText(attach.name) && isText(attach.link) && Array.isArray(attach.signature)) {
					attaches.set(attach.name, attach);
				}
			});
		}

		if (isText(content.text)) {
			const line_array = content.text.split("\n");
			for (const line of line_array) {
				const result = await lineParser(line, states, attaches);

				if (result != null) {
					if (Array.isArray(result)) {
						result.forEach((el) => {
							html.push(el);
						});
					} else if (isText(result)) {
						html.push(result);
					}
				}
			}
		}
	}

	html.push("</article>");
	return html.join("");
};

