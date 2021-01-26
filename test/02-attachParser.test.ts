import parser from "../src/index"

describe("Attachment Parser Test", () => {
	test("mp4 attach", async () => {
		const signature = [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D];
		const content = {
			text: "#attach foo.mp4",
			attaches: [{
				name: "foo.mp4",
				link: "http://example.com",
				signature: new Uint8Array(signature),
			}]
		}, result = [
			"<article>",
			"<video controls src=\"http://example.com\" />",
			"</article>",
		].join("");

		expect(await parser(content)).toBe(result);
	});

	test("no attach", async () => {
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

		expect(await parser(content)).toBe(result);
	});
});

