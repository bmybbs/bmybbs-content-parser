import { LineParser } from "../definitions";
import { escapeHtml } from "../utils"

const plainTextParser: LineParser = async (line, states) => {
	states;
	return escapeHtml(line);
}

export default plainTextParser;

