import parser from "../src/index"

describe("Attachment Parser Test", () => {
	test("mp4 attach", () => {
		const content = {
			text: "#attach foo.mp4",
			attaches: [{
				name: "foo.mp4",
				link: "http://example.com",
				signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D],
			}]
		}, result = [
			"<article>",
			"<video controls src=\"http://example.com\" />",
			"</article>",
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("no attach", () => {
		const content = {
			text: "#attach foo.mp4",
			attaches: []
		}, result = [
			"<article>",
			"<p>",
			"#attach foo.mp4",
			"</p>",
			"</article>",
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("img attach", () => {
		const content = {
			text: "#attach foo.jpg",
			attaches: [{
				name: "foo.jpg",
				link: "http://example.com",
				signature: [0xFF, 0xD8, 0xFF, 0xDB],
			}]
		},
		result = [
			"<article>",
			"<img src=\"http://example.com\">",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});
});

