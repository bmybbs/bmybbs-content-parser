import parser from "../src/index"

describe("Bilibili Parser Test", () => {
	test("general video id", () => {
		const content = {
			text: "#bilibili abc",
			attaches: []
		}, result = [
			"<article>",
			'<iframe src="https://player.bilibili.com/player.html?bvid=abc" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style=" width: 100%; height: 400px;"></iframe>',
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("video id with illegal chars", () => {
		const content = {
			text: "#bilibili a\"& ",
			attaches: []
		}, result = [
			"<article>",
			'<iframe src="https://player.bilibili.com/player.html?bvid=a%22%26%20" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style=" width: 100%; height: 400px;"></iframe>',
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	})
});

