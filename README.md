# markdown-it-prism-backticks

MarkdownIt plugin for highlighting inline code snippets using Prism.

## Installation

```
npm install markdown-it-prism-backticks
```

Prism is a peer dependency for this plugin and must be installed as well:

```
npm install prismjs
```

## Usage

```js
const md = require("markdown-it")();
const prismBackticks = require("markdown-it-prism-backticks");

md.use(prismBackticks);
```

## Acknowledgements

The basic approach to parsing inline backticks comes from the [default parser in the MarkdownIt repository](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_inline/backticks.js).

The structure of the repository comes from the [markdown-it-prism](https://github.com/jGleitz/markdown-it-prism) project.
