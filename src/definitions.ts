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

export type LineParser = (line: string, states: ParseStates, attaches?: Map<string, Attach>) => Promise<string | string[]>;

export type BMYParser = (content: BMYContent) => Promise<string>;
