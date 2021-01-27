export interface ParseStates {
	isInCodeBlock: boolean;
}

export interface Attach {
	name: string;
	link: string;
	signature: Uint8Array;
}

export interface BMYContent {
	text: string;
	attaches: Attach[];
}

export interface BMYParserConfig {
	states: ParseStates;
	attaches: Map<string, Attach>;
}

export type LineParser = (line: string, config: BMYParserConfig) => Promise<string | string[]>;

export type BMYParser = (content: BMYContent) => Promise<string>;
