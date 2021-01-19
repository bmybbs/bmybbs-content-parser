import assert from "assert"
import parser from "../src/index.js"

describe("BMYBBS Content Parser Test", () => {
	it("Null content should return empty <article />", async () => {
		assert.strictEqual(await parser(null), "<article></article>");
	});
});

