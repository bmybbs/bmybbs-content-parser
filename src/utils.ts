const escapeHtml = function(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

const langFallback = "markup";
const langSets = new Set();
langSets.add("markup");
langSets.add("html");
langSets.add("xml");
langSets.add("svg");
langSets.add("bash");
langSets.add("shell");
langSets.add("batch");
langSets.add("c");
langSets.add("csharp");
langSets.add("cs");
langSets.add("dotnet");
langSets.add("cmake");
langSets.add("css");
langSets.add("diff");
langSets.add("docker");
langSets.add("dockerfile");
langSets.add("erlang");
langSets.add("fortran");
langSets.add("go");
langSets.add("graphql");
langSets.add("groovy");
langSets.add("haskell");
langSets.add("hs");
langSets.add("ini");
langSets.add("java");
langSets.add("javascript");
langSets.add("js");
langSets.add("json");
langSets.add("latex");
langSets.add("tex");
langSets.add("context");
langSets.add("less");
langSets.add("lilypond");
langSets.add("ly");
langSets.add("lisp");
langSets.add("emacs");
langSets.add("lua");
langSets.add("makefile");
langSets.add("markdown");
langSets.add("md");
langSets.add("matlab");
langSets.add("nasm");
langSets.add("nginx");
langSets.add("objc");
langSets.add("opencl");
langSets.add("perl");
langSets.add("php");
langSets.add("prolog");
langSets.add("python");
langSets.add("py");
langSets.add("r");
langSets.add("jsx");
langSets.add("tsx");
langSets.add("regex");
langSets.add("rest");
langSets.add("ruby");
langSets.add("rb");
langSets.add("rust");
langSets.add("sass");
langSets.add("scss");
langSets.add("scala");
langSets.add("scheme");
langSets.add("sql");
langSets.add("tcl");
langSets.add("typescript");
langSets.add("ts");
langSets.add("unrealscript");
langSets.add("uscript");
langSets.add("uc");
langSets.add("verilog");
langSets.add("vhdl");
langSets.add("vim");
langSets.add("wasm");
langSets.add("wiki");
langSets.add("yaml");
langSets.add("yml");

export {
	escapeHtml,
	langSets,
	langFallback,
};

