import parser from "../src/index"

const CLASS_PREFIX = "bmybbs-ansi"

describe("Plain Text Parser Test", () => {
	test("plain text", () => {
		const content = { text: "", attaches: [] },
			result = "<article><p></p></article>";

		expect(parser(content)).toBe(result);
	});

	test("ansi formats", () => {
		const content = { text: "", attaches: [] },
			result = [ "<article>", null, "</article>"];

		// front
		for (let i = 0; i < 8; i++) {
			content.text = `\x1b[3${i}m\x1b[0m`;
			result[1] = `<p><span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc${i}"></span></p>`;
			expect(parser(content)).toBe(result.join(""));
		}

		// background
		for (let i = 0; i < 8; i++) {
			content.text = `\x1b[4${i}m\x1b[0m`;
			result[1] = `<p><span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bg${i}"></span></p>`;
			expect(parser(content)).toBe(result.join(""));
		}

		// italic
		content.text = "\x1b[3m\x1b[0m";
		result[1] = `<p><span class="${CLASS_PREFIX} ${CLASS_PREFIX}-italic"></span></p>`;
		expect(parser(content)).toBe(result.join(""));
		// underline
		content.text = "\x1b[4m\x1b[0m";
		result[1] = `<p><span class="${CLASS_PREFIX} ${CLASS_PREFIX}-underline"></span></p>`;
		expect(parser(content)).toBe(result.join(""));
		// blink
		content.text = "\x1b[5m\x1b[0m";
		result[1] = `<p><span class="${CLASS_PREFIX} ${CLASS_PREFIX}-blink"></span></p>`;
		expect(parser(content)).toBe(result.join(""));
	});

	test("ansi groups", () => {
		let content = { text: "\x1b[1;31;41mfoobar\x1b[0m", attaches: [] },
			result = [
			"<article>",
			"<p>",
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bold">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc1">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bg1">`,
			"foobar",
			"</span></span></span>",
			"</p>",
			"</article>"
		];
		expect(parser(content)).toBe(result.join(""));

		content = { text: "\x1b[1;31;41;32mfoobar\x1b[0m", attaches: [] };
		result = [
			"<article>",
			"<p>",
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bold">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc1">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bg1">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc2">`,
			"foobar",
			"</span></span></span></span>",
			"</p>",
			"</article>"
		];
		expect(parser(content)).toBe(result.join(""));
	});

	test("ansi half open", () => {
		let content = { text: "\x1b[1;31;41mfoobar", attaches: [] },
			result = [
			"<article>",
			"<p>",
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bold">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc1">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bg1">`,
			"foobar",
			"</span></span></span>",
			"</p>",
			"</article>"
		];
		expect(parser(content)).toBe(result.join(""));

		content = { text: "\x1b[1;31;41;32mfoobar\x1b[0m", attaches: [] };
		result = [
			"<article>",
			"<p>",
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bold">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc1">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bg1">`,
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc2">`,
			"foobar",
			"</span></span></span></span>",
			"</p>",
			"</article>"
		];
		expect(parser(content)).toBe(result.join(""));
	});

	test("ansi with line break", () => {
		const content = { text: "\x1b[31mfoo\nbar\x1b[0m", attaches: [] },
			result = [
			"<article>",
			"<p>",
			`<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc1">foo</span>`,
			"</p>",
			"<p>",
			`bar`,
			"</p>",
			"</article>"
		];
		expect(parser(content)).toBe(result.join(""));
	});
});

