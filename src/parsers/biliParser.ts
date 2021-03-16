import { LineParser } from "../definitions"

const biliParser: LineParser = (line, _) => { // eslint-disable-line @typescript-eslint/no-unused-vars
	const bvid = encodeURIComponent(line.substring(10));
	return `<iframe src="https://player.bilibili.com/player.html?bvid=${bvid}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style=" width: 100%; height: 400px;"></iframe>`;
}

export default biliParser;

