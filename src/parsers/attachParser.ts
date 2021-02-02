import { LineParser } from "../definitions"
import plainTextParser from "./plainTextParser"

enum AttachCategory {
	FILE,     ///< 普通文件
	AUDIO,    ///< 音频
	IMAGE,    ///< 图片
	PROGRAM,  ///< 程序
	VIDEO,    ///< 视频
}

enum AttachType {
	FILE,
	ANDROID,
	BMP,
	COMPRESSION,
	CHM,
	DEB,
	DLL,
	ELF,
	EPUB,
	EXE,
	GIF,
	IOS,
	JAVA,
	JPG,
	MP3,
	MP4,
	MSDOCX,
	MSPPTX,
	MSXLSX,
	OGG,
	PDF,
	PNG,
	RPM,
	SHELL,
	WAV,
	WEBM,
	WEBP,
}

interface AttachClass {
	category: AttachCategory,
	type: AttachType,
}

const isArrayEqual = (signature: number[], start_from: number, target: number[]): boolean => {
	if (signature.length <= start_from)
		return false;

	for (let i = 0, l_s = signature.length, l_t = target.length; (i < l_t) && (i + start_from < l_s); i++) {
		if (signature[i + start_from] != target[i]) {
			return false;
		}
	}

	return true;
}

const getFileType = (signature: number[], filename: string): AttachClass => {
	const file_type: AttachClass = {
		category: AttachCategory.FILE,
		type: AttachType.FILE,
	};
	// signature 姑且认定为是一个具有 { 10 } 个元素的数组
	switch (signature[0]) {
	case 0x00:
		if (isArrayEqual(signature, 1, [0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73])) {
				file_type.category = AttachCategory.VIDEO;
				file_type.type = AttachType.MP4;
			}
		break;
	case 0x04:
		if (isArrayEqual(signature, 1, [0x22, 0x4D, 0x18])) { // lz4
			file_type.category = AttachCategory.FILE;
			file_type.type = AttachType.COMPRESSION;
		}
		break;
	case 0x1A:
		if (isArrayEqual(signature, 1, [0x45, 0xDF, 0xA3])) {
			if (filename.endsWith(".webm")) {
				file_type.category = AttachCategory.VIDEO;
				file_type.type = AttachType.WEBM;
			}
		}
		break;
	case 0x1F:
		if (signature[1] == 0x8B) { // gz/tar.gz
			file_type.type = AttachType.COMPRESSION;
		}
		break;
	case 0x21:
		if (isArrayEqual(signature, 1, [0x3C, 0x61, 0x72])) {
			file_type.category = AttachCategory.PROGRAM;
			file_type.type = AttachType.DEB;
		}
		break;
	case 0x23:
		if (signature[1] == 0x21) {
			file_type.category = AttachCategory.PROGRAM;
			file_type.type = AttachType.SHELL;
		}
		break;
	case 0x25:
		if (isArrayEqual(signature, 1, [0x50, 0x44, 0x46])) {
			file_type.category = AttachCategory.FILE;
			file_type.type = AttachType.PDF;
		}
		break;
	case 0x37:
		if (isArrayEqual(signature, 1, [0x7A, 0xBC, 0xAF])) { // 7z
			file_type.type = AttachType.COMPRESSION;
		}
		break;
	case 0x42:
		if (signature[1] == 0x4d) {
			file_type.category = AttachCategory.IMAGE;
			file_type.type = AttachType.BMP;
		}
		break;
	case 0x47:
		if (isArrayEqual(signature, 1, [0x49, 0x46, 0x37])) {
			file_type.category = AttachCategory.IMAGE;
			file_type.type = AttachType.GIF;
		}
		break;
	case 0x49:
		if (isArrayEqual(signature, 1, [0x44, 0x33])) {
			file_type.category = AttachCategory.AUDIO;
			file_type.type = AttachType.MP3;
		} else if (isArrayEqual(signature, 1, [0x54, 0x53, 0x46])) {
			file_type.type = AttachType.CHM;
		}
		break;
	case 0x4D:
		if (signature[1] == 0x5A) {
			file_type.category = AttachCategory.PROGRAM;
			file_type.type = filename.endsWith(".exe") ? AttachType.EXE : AttachType.DLL;
		}
		break;
	case 0x4F:
		if (isArrayEqual(signature, 1, [0x67, 0x67, 0x53])) {
			if (filename.endsWith(".ogg") || filename.endsWith(".oga")) {
				file_type.category = AttachCategory.AUDIO;
				file_type.type = AttachType.OGG;
			} else if (filename.endsWith(".ogv")) {
				file_type.category = AttachCategory.VIDEO;
				file_type.type = AttachType.OGG;
			}
		}
		break;
	case 0x50:
		if (isArrayEqual(signature, 1, [0x4B, 0x03, 0x04])
			|| isArrayEqual(signature, 1, [0x4B, 0x05, 0x06])
			|| isArrayEqual(signature, 1, [0x4B, 0x07, 0x08])) {
			let arr = filename.split("."),
				ext = arr[arr.length - 1];
			switch(ext) {
			case "zip":
				file_type.type = AttachType.COMPRESSION;
				break;
			case "aar":
			case "apk":
				file_type.category = AttachCategory.PROGRAM;
				file_type.type = AttachType.ANDROID;
				break;
			case "docx":
				file_type.type = AttachType.MSDOCX;
				break;
			case "epub":
				file_type.type = AttachType.EPUB;
				break;
			case "ipa":
				file_type.category = AttachCategory.PROGRAM;
				file_type.type = AttachType.IOS;
				break;
			case "jar":
				file_type.category = AttachCategory.PROGRAM;
				file_type.type = AttachType.JAVA;
				break;
			case "pptx":
				file_type.type = AttachType.MSPPTX;
				break;
			case "xlsx":
				file_type.type = AttachType.MSXLSX;
				break;
			}
		}
		break;
	case 0x52:
		if (isArrayEqual(signature, 1, [0x61, 0x72, 0x21])) { // rar
			file_type.type = AttachType.COMPRESSION;
		} else if (isArrayEqual(signature, 1, [0x49, 0x46, 0x46])) {
			if (isArrayEqual(signature, 8, [0x57, 0x41])) {
				file_type.category = AttachCategory.AUDIO;
				file_type.type = AttachType.WAV;
			} else if (isArrayEqual(signature, 8, [0x57, 0x45])) {
				file_type.category = AttachCategory.IMAGE;
				file_type.type = AttachType.WEBP;
			}
		}
		break;
	case 0x7F:
		if (isArrayEqual(signature, 1, [0x45, 0x4C, 0x46])) {
			file_type.category = AttachCategory.PROGRAM;
			file_type.type = AttachType.ELF;
		}
		break;
	case 0x89:
		if (isArrayEqual(signature, 1, [0x50, 0x4E, 0x47])) {
			file_type.category = AttachCategory.IMAGE;
			file_type.type = AttachType.PNG;
		}
		break;
	case 0xCA:
		if (isArrayEqual(signature, 1, [0xFE, 0xBA, 0xBE])) {
			file_type.category = AttachCategory.PROGRAM;
			file_type.type = AttachType.JAVA;
		}
		break;
	case 0xD0:
		if (isArrayEqual(signature, 1, [0xCF, 0x11, 0xE0])) {
			if (filename.endsWith(".doc")) {
				file_type.type = AttachType.MSDOCX;
			} else if (filename.endsWith(".xls")) {
				file_type.type = AttachType.MSXLSX;
			} else if (filename.endsWith(".ppt")) {
				file_type.type = AttachType.MSPPTX;
			}
		}
		break;
	case 0xED:
		if (isArrayEqual(signature, 1, [0xAB, 0xEE, 0xDB])) {
			file_type.category = AttachCategory.PROGRAM;
			file_type.type = AttachType.RPM;
		}
		break;
	case 0xFD:
		if (isArrayEqual(signature, 1, [0x37, 0x7a, 0x58])) {
			file_type.type = AttachType.COMPRESSION;
		}
		break;
	case 0xFF:
		if (signature[1] == 0xFB || signature[1] == 0xF3 || signature[1] == 0xF2) {
			file_type.category = AttachCategory.AUDIO;
			file_type.type = AttachType.MP3;
		} else if (isArrayEqual(signature, 1, [0xD8, 0xFF, 0xDB])
			|| isArrayEqual(signature, 1, [0xD8, 0xFF, 0xE0])
			|| isArrayEqual(signature, 1, [0xD8, 0xFF, 0xEE])
			|| isArrayEqual(signature, 1, [0xD8, 0xFF, 0xE1])) {
			file_type.category = AttachCategory.IMAGE;
			file_type.type = AttachType.JPG;
		}
		break;
	}

	return file_type;
}

const attachParser: LineParser = (line, config) => {
	const attachname = line.substring(8);
	if (attachname === "" || !config.attaches.has(attachname)) {
		return plainTextParser(line, config);
	}

	const attach = config.attaches.get(attachname);
	const attach_type = getFileType(attach.signature, attach.name);

	if (attach_type.category === AttachCategory.VIDEO) {
		return `<video controls src="${attach.link}" />`;
	} else if (attach_type.category === AttachCategory.IMAGE) {
		return `<img src="${attach.link}">`;
	} else {
		return `<a href="${attach.link}" target="_blank">${attach.name}</a>`;
	}
}

export default attachParser;

