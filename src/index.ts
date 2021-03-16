import { BMYParser, ParseStates, Attach } from "./definitions"
import lineParser from "./parsers/lineParser"

const bmyParser: BMYParser = (content) => {
	const html = [],
		attaches: Map<string, Attach> = new Map(),
		states: ParseStates = {
			isInBlockQuote: false,
			isInCodeBlock: false
		};
	html.push("<article>");

	content.attaches.forEach(attach => {
		attaches.set(attach.name, attach);
	});

	const line_array = content.text.split("\n");
	const config = { states, attaches };

	for (const line of line_array) {
		const result = lineParser(line, config);
		if (Array.isArray(result)) {
			result.forEach((el) => {
				html.push(el);
			});
		} else {
			html.push(result);
		}
	}

	if (config.states.isInBlockQuote) {
		html.push("</blockquote>");
	}

	html.push("</article>");
	return html.join("");
}

export default bmyParser;

