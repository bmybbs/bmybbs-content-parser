import { LineParser } from "../definitions"
import codeBlockParser from "./codeblockParser"
import plainTextParser from "./plainTextParser"
import attachParser    from "./attachParser"

const BLOCKQUOTE_STR = "<blockquote>";
const BLOCKQUOTE_CLOSE_STR = "</blockquote>";

const lineParser: LineParser = (line, config) => {
	// 优先处理引言方式
	if (line.startsWith(": ")) {
		if (!config.states.isInBlockQuote) {
			config.states.isInBlockQuote = true;

			const subResult = plainTextParser(line.substring(2), config);
			if (Array.isArray(subResult)) {
				subResult.unshift(BLOCKQUOTE_STR);
				return subResult;
			} else {
				return [BLOCKQUOTE_STR, subResult];
			}
		} else {
			return plainTextParser(line.substring(2), config);
		}
	}

	if (config.states.isInBlockQuote) {
		config.states.isInBlockQuote = false;
		// 变更状态后递归调用
		const subResult = lineParser(line,config);
		if (Array.isArray(subResult)) {
			subResult.unshift(BLOCKQUOTE_CLOSE_STR);
			return subResult;
		} else {
			return [BLOCKQUOTE_CLOSE_STR, subResult];
		}
	}

	// markdown 方式的代码块
	// 有关 codeBlock 的格式处理，其中状态改变也交给 codeBlockParser 维护
	if (config.states.isInCodeBlock || line.startsWith("```")) {
		return codeBlockParser(line, config);
	}

	// 如果行首以 "#attach " 开头，即 "#attach attachname" 的格式，用 attachParser
	// 这里可能 attachname 不存在，内部切换为普通文本
	if (line.startsWith("#attach ")) {
		return attachParser(line, config);
	}

	return plainTextParser(line, config);
}

export default lineParser;

