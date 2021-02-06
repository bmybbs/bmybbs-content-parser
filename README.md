# BMYBBS Content Parser

![BMYBBS Content Parser CI](https://github.com/bmybbs/bmybbs-content-parser/workflows/BMYBBS%20Content%20Parser%20CI/badge.svg?branch=main) [![Coverage Status](https://coveralls.io/repos/github/bmybbs/bmybbs-content-parser/badge.svg?branch=main)](https://coveralls.io/github/bmybbs/bmybbs-content-parser?branch=main) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=bmybbs_bmybbs-content-parser&metric=bugs)](https://sonarcloud.io/dashboard?id=bmybbs_bmybbs-content-parser) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=bmybbs_bmybbs-content-parser&metric=code_smells)](https://sonarcloud.io/dashboard?id=bmybbs_bmybbs-content-parser) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=bmybbs_bmybbs-content-parser&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=bmybbs_bmybbs-content-parser)

这是一个将 [BMYBBS](https://github.com/bmybbs/bmybbs) 文章内容转换为 HTML 的库。

## 背景

传统 [BBS](https://en.wikipedia.org/wiki/Bulletin_board_system) 最早只提供了终端界面，并且通过 [ANSI 转义序列](https://en.wikipedia.org/wiki/ANSI_escape_code) 提供了例如前景色、背景色、下划线、闪烁等指令，丰富了内容显示，推动了 [ANSI 艺术](https://en.wikipedia.org/wiki/ANSI_art) 的流行。这些指令使用不可见字符 `\033` 以及其他可见字符插入到文本中。

随着 web 的发展，传统 BBS 也陆续提供了网页界面，NJU 09 就是一个在中国大陆高校 BBS 广泛使用的实现。Web 实现除了需要对应转换为 html 格式，还给文章带来了新的元素：附件的上传、展示。NJU09 的实现存在一些不足：

* 样式转换不完全（例如下划线、闪烁）
* web 方式几乎不适合使用转义序列编辑、预览
* 附件中只有图片会被转换使用 `<img>` 标签显示。其实还有 Flash 格式，只不过已经越来越少被使用了。相反随着技术发展，`<video>` 和 `<audio>` 多媒体技术早已广泛使用，而 NJU 09 中一直没有实现。
* 同样对于未来可能需要引入新的“语法”，例如类似 Markdown 的代码块 (**WIP**)、链接。

因此，本项目的目标在于使用 JavaScript 实现一套 BMYBBS 内容“语法”的转换实现。

## 安装

```bash
npm install --save git://github.com/bmybbs/bmybbs-content-parser.git
```

## 使用

```javascript
import BMYParser from "@bmybbs/bmybbs-content-parser"

(() => {
  let content = {
    text: [
      "#attach bmybbs.png",
      "```javascript",
      "var foo = 42;",
      "```",
      "\x1b[1;31mhello world\x1b[0m"
    ].join("\n"),
    attaches: [{
      name: "bmybbs.png",
      link: "http://example.com",
      signature: [0xFF, 0xD8, 0xFF, 0xD8]
    }]
  }; // 通常由接口返回，也可以在浏览器内生成，以便预览

  console.log(BMYParser(content));
})();
```

其中 `signature` 是用来标识文件格式的 Magic Number（而非通过文件后缀名）。完整的列表参见 [List of file signatures](https://en.wikipedia.org/wiki/List_of_file_signatures)，BMYBBS Content Parser 使用 [file-type](https://github.com/sindresorhus/file-type) 解析。

## 输出结果

并不完全一致，此处为了便于阅读增加了换行和缩进。

```html
<article>
  <img src="http://example.com" alt="bmybbs.png">
  <pre>
    <code class="language-javascript">
    var foo = 42;
    </code>
  </pre>
  <p>
    <span class="bmybbs-ansi bmybbs-ansi-red">hello world</span>
  </p>
</article>
```

样式转换的结果是文本使用 `span.bmybbs-ansi.bmybbs-ansi-*` 包裹，仅提供类的约定，实际的显示需要使用者自行决定。其中，`.bmybbs-ansi` 是一个空的类，便于显示、移除样式，例如：

```css
span.bmybbs-ansi.bmybbs-ansi-red {
  color: red;
}
```

```javascript
const bmybbs_spans = [].slice.call(document.querySelectorAll("span.bmybbs-ansi"));

// 所有元素移除 ANSI 样式
bmybbs_spans.forEach(el => el.classList.remove("bmybbs-ansi"));

// 所有元素恢复 ANSI 样式
bmybbs_spans.forEach(el => el.classList.add("bmybbs-ansi"));
```

## 约定样式列表

TBD

## 色彩高亮支持的语言列表

可以使用 [PrismJS](https://github.com/PrismJS/prism) 渲染，Webpack 需要借助 [babel-plugin-prismjs](https://github.com/mAAdhaTTah/babel-plugin-prismjs) 打包。

* 标注类: `markup`(默认)、`html`、`xml`、`svg`
* Bash - `bash`、`shell`
* Batch - `batch`
* C - `c`
* C# - `csharp`、`cs`、`dotnet`
* C++ - `cpp`
* CMake - `cmake`
* CSS - `css`
* Diff - `diff`
* Docker - `docker`、`dockerfile`
* Erlang - `erlang`
* Fortran - `fortran`
* Go - `go`
* GraphQL - `graphql`
* Groovy - `groovy`
* Haskell - `haskell`、`hs`
* Ini - `ini`
* Java - `java`
* JavaScript - `javascript`、`js`
* JSON - `json`
* LaTeX - `latex`、`tex`、`context`
* Less - `less`
* LilyPond - `lilypond`、`ly`
* Lisp - `lisp`、`emacs`
* Lua - `lua`
* Makefile - `makefile`
* Markdown - `markdown`、`md`
* MATLAB - `matlab`
* NASM - `nasm`
* nginx - `nginx`
* Objective-C - `objc`
* OpenCL - `opencl`
* Perl - `perl`
* PHP - `php`
* Prolog - `prolog`
* Python - `python`、`py`
* R - `r`
* React - `jsx`、`tsx`
* Regex - `regex`
* reST(reStructuredText) - `rest`
* Ruby - `ruby`、`rb`
* Rust - `rust`
* Sass(Sass) - `sass`
* Sass(Scss) - `scss`
* Scala - `scala`
* Scheme - `scheme`
* SQL - `sql`
* Tcl - `tcl`
* TypeScript - `typescript`、`ts`
* UnrealScript - `unrealscript`、`uscript`、`uc`
* Verilog - `verilog`
* VHDL - `vhdl`
* vim - `vim`
* WebAssembly - `wasm`
* Wiki - `wiki`
* YAML - `yaml`、`yml`

## License

MIT
