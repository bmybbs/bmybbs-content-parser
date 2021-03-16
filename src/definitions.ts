export interface ParseStates {
	isInCodeBlock: boolean;
	isInBlockQuote?: boolean;
}

export interface Attach {
	name: string;
	link: string;
	size: number;
	signature: number[];
}

export interface BMYContent {
	text: string;
	attaches: Attach[];
}

export interface BMYParserConfig {
	states: ParseStates;
	attaches: Map<string, Attach>;
}

export type LineParser = (line: string, config: BMYParserConfig) => string | string[];

export type BMYParser = (content: BMYContent) => string;
