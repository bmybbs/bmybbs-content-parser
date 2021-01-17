const isObject = function(o) {
	return (o != null && typeof object === "object");
}

const isText = function(s) {
	return (typeof s === "string" || s instanceof String);
}

export { isObject, isText };

