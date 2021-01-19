import assert from "assert"
import parser from "../src/index.js"

// 以 parser 为入口，针对 code block 单一功能点的测试
describe("Code Block Parser Test", () => {
	it("empty code block", async () => {
		let content = {
			text: "```\n```",
			attaches: []
		}, result = [
			"<article>",
			"<pre><code class=\"language-markup\">",
			"</code></pre>",
			"</article>"
		].join("");
		assert.strictEqual(await parser(content), result);
	});

	// TODO
});

