import FileType from "file-type";
import plainTextParser from "./plainTextParser.js"

export default async (line, states, attaches) => {
	// TODO remove param placeholders
	line;
	states;
	attaches;

	const attachname = line.substring(8); // e.g. "#attach foo.ext"
	if (attachname === "" || !attaches.has(attachname)) {
		return await plainTextParser(line, states);
	}

	const attach = attaches.get(attachname);
	const data = await FileType.fromBuffer(new Uint8Array(attach.signature));

	if (data.mime === "video/mp4") {
		return `<video controls src="${attach.link}" />`;
	} else if (data.mime.startsWith("image/")) {
		return `<img src="${attach.link}">`;
	} else {
		return `<a href="${attach.link}" target="_blank">${attach.name}</a>`;
	}
};

