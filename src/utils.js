const escapeHtml = function(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

const isObject = function(o) {
	return ((o != null) && (typeof o === "object"));
};

const isText = function(s) {
	return (typeof s === "string" || s instanceof String);
};

// TODO ref: https://prismjs.com/#supported-languages
const langFallback = "markup";
const langSets = new Set();
langSets.add("markup");
langSets.add("html");

export {
	escapeHtml,
	isObject,
	isText,
	langSets,
	langFallback,
};

