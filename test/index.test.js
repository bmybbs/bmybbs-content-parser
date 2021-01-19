import parser from "../src/index.js"

describe("BMYBBS Content Parser Test", () => {
	test("Null content should return empty <article />", async () => {
		expect(await parser(null)).toBe("<article></article>");
	});
});

