import {
	escapeHtml,
} from "../src/utils.js"

describe("Utils Test", () => {
	test("escape html unsafe chars", () => {
		let str = "<>&\"'";
		expect(escapeHtml(str)).toBe("&lt;&gt;&amp;&quot;&#039;");
	});
});

