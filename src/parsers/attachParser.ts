import FileType from "file-type";
import { LineParser } from "../definitions"
import plainTextParser from "./plainTextParser"

const attachParser: LineParser = async (line, config) => {
	const attachname = line.substring(8);
	if (attachname === "" || !config.attaches.has(attachname)) {
		return await plainTextParser(line, config);
	}

	const attach = config.attaches.get(attachname);
	const data = await FileType.fromBuffer(attach.signature);

	if (data.mime === "video/mp4") {
		return `<video controls src="${attach.link}" />`;
	} else if (data.mime.startsWith("image/")) {
		return `<img src="${attach.link}">`;
	} else {
		return `<a href="${attach.link}" target="_blank">${attach.name}</a>`;
	}
}

export default attachParser;

