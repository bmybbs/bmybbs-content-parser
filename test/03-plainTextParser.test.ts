import parser from "../src/index"

const CLASS_PREFIX = "bmybbs-ansi"

describe("Plain Text Parser Test", () => {
	test("plain text", async () => {
		const content = { text: "", attaches: [] },
			result = "<article></article>";

		expect(await parser(content)).toBe(result);
	});

	test("ansi formats", async () => {
		const content = { text: "", attaches: [] },
			result = [ "<article>", null, "</article>"];

		// front
		for (let i = 0; i < 8; i++) {
			content.text = `\x1b[3${i}m\x1b[0m`;
			result[1] = `<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-fc${i}"></span>`;
			expect(await parser(content)).toBe(result.join(""));
		}

		// background
		for (let i = 0; i < 8; i++) {
			content.text = `\x1b[4${i}m\x1b[0m`;
			result[1] = `<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-bg${i}"></span>`;
			expect(await parser(content)).toBe(result.join(""));
		}

		// italic
		content.text = "\x1b[3m\x1b[0m";
		result[1] = `<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-italic"></span>`
		expect(await parser(content)).toBe(result.join(""));
		// underline
		content.text = "\x1b[4m\x1b[0m";
		result[1] = `<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-underline"></span>`
		expect(await parser(content)).toBe(result.join(""));
		// blink
		content.text = "\x1b[5m\x1b[0m";
		result[1] = `<span class="${CLASS_PREFIX} ${CLASS_PREFIX}-blink"></span>`
		expect(await parser(content)).toBe(result.join(""));
	});
});

