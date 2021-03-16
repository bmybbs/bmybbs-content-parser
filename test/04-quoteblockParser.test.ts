import parser from "../src/index"

describe("Blockquote Parser Test", () => {
	test("text with quotes", () => {
		const content = {
			text: "aaa\n: foo\n: bar\nbbb",
			attaches: []
		}, result = [
			"<article>",
			"<p>aaa</p>",
			"<blockquote>",
			"<p>foo</p>",
			"<p>bar</p>",
			"</blockquote>",
			"<p>bbb</p>",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("end with quotes", () => {
		const content = {
			text: "aaa\n: foo",
			attaches: []
		}, result = [
			"<article>",
			"<p>aaa</p>",
			"<blockquote>",
			"<p>foo</p>",
			"</blockquote>",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});
});

