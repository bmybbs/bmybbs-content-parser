import parser from "../src/index"
import { BMYContent } from "../src/definitions"

describe("Attachment Parser Test", () => {
	test("video attach", () => {
		const content = {
			text: "#attach foo.mp4",
			attaches: [{
				name: "foo.mp4",
				link: "http://example.com",
				signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D],
			}]
		}, result = [
			"<article>",
			"<video controls src=\"http://example.com\" />",
			"</article>",
		].join("");

		expect(parser(content)).toBe(result);

		content.text = "#attach foo.webm";
		content.attaches[0].name = "foo.webm";
		content.attaches[0].signature = [0x1a, 0x45, 0xdf, 0xa3, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1f, 0x42, 0x86, 0x81, 0x01];
		expect(parser(content)).toBe(result);
	});

	test("no attach", () => {
		const content = {
			text: "#attach foo.mp4",
			attaches: []
		}, result = [
			"<article>",
			"<p>",
			"#attach foo.mp4",
			"</p>",
			"</article>",
		].join("");

		expect(parser(content)).toBe(result);
	});

	test("img attach", () => {
		// jpg
		const content = {
			text: "#attach foo.jpg",
			attaches: [{
				name: "foo.jpg",
				link: "http://example.com",
				signature: [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01],
			}]
		},
		result = [
			"<article>",
			"<img src=\"http://example.com\">",
			"</article>"
		].join("");

		expect(parser(content)).toBe(result);

		// bmp
		content.attaches[0].signature = [0x42, 0x4d, 0x3a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x00, 0x00, 0x00, 0x28, 0x00];
		expect(parser(content)).toBe(result);
		// gif
		content.attaches[0].signature = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0xf7, 0x00, 0x00, 0x00, 0x00, 0x00];
		expect(parser(content)).toBe(result);
		// png
		content.attaches[0].signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52];
		expect(parser(content)).toBe(result);
		// webp
		content.attaches[0].signature = [0x52, 0x49, 0x46, 0x46, 0x1a, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x4c];
		expect(parser(content)).toBe(result);
	});

	test("audio attach", () => {
		const content = {
			text: "#attach foo.mp3",
			attaches: [{
				name: "foo.mp3",
				link: "http://example.com",
				signature: [0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x11, 0x30, 0x54, 0x49, 0x54, 0x32, 0x00, 0x00],
			}]
		}, result = [
			"<article>",
			"<audio controls src=\"http://example.com\" />",
			"</article>",
		].join("");

		expect(parser(content)).toBe(result);

		// wav
		content.attaches[0].signature = [0x52, 0x49, 0x46, 0x46, 0x3a, 0x60, 0x10, 0x00, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20];
		expect(parser(content)).toBe(result);

		// ogg
		content.text = "#attach foo.ogg";
		content.attaches[0].name = "foo.ogg";
		content.attaches[0].signature = [0x4f, 0x67, 0x67, 0x53, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x53, 0xbc];
		expect(parser(content)).toBe(result);
	});

	test("attach icon", () => {
		let filename: string;
		let content: BMYContent;

		const result = [
			"<article>",
			"<div class=\"bmy-attach\">",
			null,
			null,
			"</div>",
			"</article>"
		];

		filename = "01.ppt"
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"powerpoint-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "01.pptx";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00, 0x08, 0x00, 0x00, 0x00, 0x21, 0x00, 0xfc, 0x83],
			}]
		};
		result[2] = "<span class=\"powerpoint-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "02.xls";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"excel-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "02.xlsx";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x21, 0x00, 0x6f, 0xbe],
			}]
		};
		result[2] = "<span class=\"excel-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "03.doc";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"word-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "03.docx";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00, 0x08, 0x00, 0x00, 0x00, 0x21, 0x00, 0x09, 0x24],
			}]
		};
		result[2] = "<span class=\"word-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "typescript.epub";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x08, 0x00, 0x08, 0x00, 0xc0, 0x61, 0x95, 0x51, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"pdf-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "04.pdf";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35, 0x0d, 0x0a, 0x25, 0xb5, 0xb5, 0xb5, 0xb5, 0x0d],
			}]
		};
		result[2] = "<span class=\"pdf-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "08.apk";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x08, 0x08, 0x08, 0x00, 0x5d, 0x78, 0x4d, 0x45, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"android-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "09.ipa";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x2a, 0x49, 0x90, 0x47, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"apple-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "10.7z";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c, 0x00, 0x04, 0x62, 0x6e, 0x91, 0xf8, 0x1e, 0x00, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"zip-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "10.gz";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x1f, 0x8b, 0x08, 0x08, 0xe2, 0x59, 0x19, 0x60, 0x04, 0x00, 0x31, 0x30, 0x2e, 0x37, 0x7a, 0x00],
			}]
		};
		result[2] = "<span class=\"zip-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "10.xz";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00, 0x00, 0x01, 0x69, 0x22, 0xde, 0x36, 0x02, 0x00, 0x21, 0x01],
			}]
		};
		result[2] = "<span class=\"zip-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "10.zip";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0xae, 0x42, 0x52, 0xc5, 0x7a],
			}]
		};
		result[2] = "<span class=\"zip-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "rc.local";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x23, 0x21, 0x2f, 0x62, 0x69, 0x6e, 0x2f, 0x73, 0x68, 0x20, 0x2d, 0x65, 0x0a, 0x23, 0x0a, 0x23],
			}]
		};
		result[2] = "<span class=\"terminal-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "setup.exe";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"windows-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "mscorlib.dll";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"windows-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "libc.so";
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"binary-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "influxdb.rpm"
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0xed, 0xab, 0xee, 0xdb, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01, 0x69, 0x6e, 0x66, 0x6c, 0x75, 0x78],
			}]
		};
		result[2] = "<span class=\"red-hat-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "vscode.deb"
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x21, 0x3c, 0x61, 0x72, 0x63, 0x68, 0x3e, 0x0a, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6e, 0x2d, 0x62],
			}]
		};
		result[2] = "<span class=\"debian-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "foo.class"
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0xca, 0xfe, 0xba, 0xbe, 0x00, 0x00, 0x00, 0x33, 0x01, 0x12, 0x0a, 0x00, 0x39, 0x00, 0x8d, 0x0b],
			}]
		};
		result[2] = "<span class=\"java-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));

		filename = "spring-core.jar"
		content = {
			text: `#attach ${filename}`,
			attaches: [{
				name: filename,
				link: "foo",
				signature: [0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x08, 0x08, 0x00, 0x23, 0x0c, 0xff, 0x46, 0x00, 0x00],
			}]
		};
		result[2] = "<span class=\"java-icon\"></span>";
		result[3] = `<a href=\"foo\" target=\"_blank\">${filename}</a>`;
		expect(parser(content)).toBe(result.join(""));
	});
});

