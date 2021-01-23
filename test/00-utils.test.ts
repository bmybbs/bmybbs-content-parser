import {
	escapeHtml,
} from "../src/utils"

describe("Utils Test", () => {
	test("escape html unsafe chars", () => {
		const str = "<>&\"'";
		expect(escapeHtml(str)).toBe("&lt;&gt;&amp;&quot;&#039;");
	});
});

