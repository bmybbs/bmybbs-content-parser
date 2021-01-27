// ref: https://github.com/rburns/ansi-to-html/
import { LineParser } from "../definitions";
import { escapeHtml } from "../utils"

const CLASS_PREFIX = "bmybbs-ansi";

enum TokenType {
	TOKEN_TEXT,
	TOKEN_DISPLAY,
	TOKEN_XTERM256,
	TOKEN_RGB,
}

// used as replacer
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
type HandlerFunction = (m: string, g1: string) => string;

type Handler = {
	pattern: RegExp,
	sub: HandlerFunction
};

type TokenizeCallback = (token: TokenType, data: string) => void;

const pushText = (text: string): string => {
	return escapeHtml(text);
}

const pushTag = (stack: string[], tag: string, classname?: string): string => {
	stack.push(tag);

	return classname ? `<${tag} class="${classname}">` : `<${tag}>`;
}

const pushSpanWithClass = (stack: string[], classname: string): string => {
	return pushTag(stack, "span", classname);
}

/*const closeTag = (stack: string[], tag: string): string => {
	let last: string = null;

	if (stack.slice(-1)[0] === tag) {
		last = stack.pop();
	}

	return (last) ? `</${tag}>` : null;
}*/

const tokenize = (text: string, callback: TokenizeCallback): number[] => {
	let ansiMatch = false;
	const ansiHandler = 3;

	const remove: HandlerFunction = (_, __) => "", // eslint-disable-line @typescript-eslint/no-unused-vars
	/*removeXterm256: HandlerFunction = (_, g1) => { // eslint-disable-line @typescript-eslint/no-unused-vars
		callback(TokenType.TOKEN_XTERM256, g1);
		return "";
	},
	newline: HandlerFunction = (m, _) => { // eslint-disable-line @typescript-eslint/no-unused-vars
		callback(TokenType.TOKEN_TEXT, m);
		return "";
	},*/
	ansiMess: HandlerFunction = (_, g1) => {
		ansiMatch = true;
		if (g1.trim().length === 0) {
			g1 = "0";
		}

		const arr = g1.trimRight().split(";");

		for (const g of arr) {
			callback(TokenType.TOKEN_DISPLAY, g);
		}

		return "";
	},
	realText: HandlerFunction = (m, _) => { // eslint-disable-line @typescript-eslint/no-unused-vars
		callback(TokenType.TOKEN_TEXT, m);
		return "";
	}/*,
	rgb: HandlerFunction = (m, _) => { // eslint-disable-line @typescript-eslint/no-unused-vars
		callback(TokenType.TOKEN_RGB, m);
		return "";
	}*/;

	const tokens: Handler[] = [{
		pattern: /^\x08+/,
		sub: remove
	}, {
		pattern: /^\x1b\[[012]?K/,
		sub: remove
	}, {
		pattern: /^\x1b\[\(B/,
		sub: remove
	}, {
		pattern: /^\x1b\[[34]8;2;\d+;\d+;\d+m/,
		sub: remove // rgb
	}, {
		pattern: /^\x1b\[38;5;(\d+)m/,
		sub: remove // removeXterm256
	}, {
		/*pattern: /^\n/,
		sub: newline
	},{
		pattern: /^\r+\n/,
		sub: newline
	}, {*/
		pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
		sub: ansiMess
	}, {
		// CSI n J
		// ED - Erase in Display Clears part of the screen.
		// If n is 0 (or missing), clear from cursor to end of screen.
		// If n is 1, clear from cursor to beginning of the screen.
		// If n is 2, clear entire screen (and moves cursor to upper left on DOS ANSI.SYS).
		// If n is 3, clear entire screen and delete all lines saved in the scrollback buffer
		//   (this feature was added for xterm and is supported by other terminal applications).
		pattern: /^\x1b\[\d?J/,
		sub: remove
	}, {
		// CSI n ; m f
		// HVP - Horizontal Vertical Position Same as CUP
		pattern: /^\x1b\[\d{0,3};\d{0,3}f/,
		sub: remove
	}, {
		// catch-all for CSI sequences?
		pattern: /^\x1b\[?[\d;]{0,3}/,
		sub: remove
	}, {
		/**
		* extracts real text - not containing:
		* - `\x1b' - ESC - escape (Ascii 27)
		* - '\x08' - BS - backspace (Ascii 8)
		* - `\n` - Newline - linefeed (LF) (ascii 10)
		* - `\r` - Windows Carriage Return (CR)
		*/
		pattern: /^(([^\x1b\x08\r\n])+)/,
		sub: realText
	}];

	const process = (handler: Handler, i: number) => {
		if (i > ansiHandler && ansiMatch) {
			return;
		}

		ansiMatch = false;

		text = text.replace(handler.pattern, handler.sub);
	}

	const results1 = [];
	let length = text.length;

	outer:
	while (length > 0) {
		for (let i = 0, o = 0, len = tokens.length; o < len; i = ++o) {
			const handler = tokens[i];
			process(handler, i);

			if (text.length !== length) {
				length = text.length;
				continue outer;
			}
		}

		if (text.length === length) {
			break;
		}

		results1.push(0);
		length = text.length;
	}

	return results1;
}

const resetStyles = (stack: string[]): string => {
	const stackClone = stack.slice(0);

	stack.length = 0;

	return stackClone.reverse().map((tag) => {
		return `</${tag}>`;
	}).join("");
}

const handleDisplay = (stack: string[], codeStr: string): string => {
	const code = parseInt(codeStr, 10);
	const codeMap: Map<number, () => string> = new Map();
	//codeMap.set(-1, () => "<br />");
	codeMap.set(0, () => stack.length && resetStyles(stack));
	codeMap.set(1, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-bold`));
	codeMap.set(3, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-italic`));
	codeMap.set(4, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-underline`));
	//codeMap.set(8, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-none`));
	//codeMap.set(9, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-strike`));
	//codeMap.set(22, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-normal`));
	//codeMap.set(23, () => closeTag(stack, "span"));
	//codeMap.set(24, () => closeTag(stack, "span"));
	// codeMap.set(39, () => ""); // TODO
	// codeMap.set(49, () => ""); // TODO
	//codeMap.set(53, () => pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-overline`));

	let result: string, color: number;
	if (codeMap.has(code)) {
		/*if (code == 23 || code == 24) {
			console.log("gotcha");
		}*/
		result = codeMap.get(code)();
	} else if (4 < code && code < 7) {
		result = pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-blink`);
	} else if (29 < code && code < 38) {
		color = code - 30;
		result = pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-fc${color}`);
	} else if (39 < code && code < 48) {
		color = code - 40;
		result = pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-bg${color}`);
	}/* else if (89 < code && code < 98) {
		color = code - 80;
		result = pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-fc${color}`);
	} else if (99 < code && code < 108) {
		color = code - 100;
		result = pushSpanWithClass(stack, `${CLASS_PREFIX} ${CLASS_PREFIX}-bg${color}`);
	}*/

	return result
}

const generateOutput = (stack: string[], token: TokenType, data: string): string => {
	let result: string;

	if (token === TokenType.TOKEN_TEXT) {
		result = pushText(data);
	} else if (token === TokenType.TOKEN_DISPLAY) {
		result = handleDisplay(stack, data);
	}/* else if (token === TokenType.TOKEN_XTERM256) {
		result = ""; // TODO
	} else if (token === TokenType.TOKEN_RGB) {
		result = ""; // TODO
	}*/

	return result;
}

const plainTextParser: LineParser = async (line, _) => {
	const stack: string[] = [];
	const buf: string[] = ["<p>"];
	tokenize(line, (token, data) => {
		const output = generateOutput(stack, token, data);

		if (output) {
			buf.push(output);
		}
	});

	if (stack.length) {
		buf.push(resetStyles(stack));
	}
	buf.push("</p>");
	return buf;
}

export default plainTextParser;

