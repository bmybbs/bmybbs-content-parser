import parser from "../src/index"

// 以 parser 为入口，针对 code block 单一功能点的测试
describe("Code Block Parser Test", () => {
	test("empty code block", () => {
		const content = {
			text: "```\n```",
			attaches: []
		}, result = [
			"<article>",
			"<pre><code class=\"language-markup\">",
			"</code></pre>",
			"</article>"
		].join("");
		expect(parser(content)).toBe(result);
	});

	test("code block with lines", () => {
		const content = { text: "```\nvar i = 42;\n```", attaches: [] },
			result = [
			"<article>",
			"<pre><code class=\"language-markup\">",
			"var i = 42;\n",
			"</code></pre>",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("code block with lines", () => {
		const content = { text: "```c\n#include <stdio.h>\n```", attaches: [] },
			result = [
			"<article>",
			"<pre><code class=\"language-c\">",
			"#include &lt;stdio.h&gt;\n",
			"</code></pre>",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("code block without close tag", () => {
		const content = { text: "```c\n#include <stdio.h>", attaches: [] },
			result = [
			"<article>",
			"<pre><code class=\"language-c\">",
			"#include &lt;stdio.h&gt;\n",
			"</code></pre>",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);
	});
	// TODO
});

