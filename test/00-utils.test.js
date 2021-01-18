import assert from "assert"
import {
	escapeHtml,
} from "../src/utils.js"

describe("Utils Test", () => {
	it("escape html unsafe chars", () => {
		let str = "<>&\"'";
		assert.strictEqual(escapeHtml(str), "&lt;&gt;&amp;&quot;&#039;");
	});
});

