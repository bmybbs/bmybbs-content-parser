const escapeHtml = function(unsafe: string) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

// TODO ref: https://prismjs.com/#supported-languages
const langFallback = "markup";
const langSets = new Set();
langSets.add("markup");
langSets.add("html");

export {
	escapeHtml,
	langSets,
	langFallback,
};

