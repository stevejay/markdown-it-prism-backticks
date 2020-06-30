import loadLanguages from "prismjs/components/index.js";

var LANGUAGE_REGEXP = /^{lang=([\w_-]+)}/;
var BACKTICK_CHAR_CODE = 0x60;

function loadPrismLang(lang) {
  if (!lang) {
    return null;
  }

  // The global Prism object needs to be used here. If I import Prism
  // then the Prism initialization code runs again and a new Prism
  // object is created. On subsequently loading languages, the languages
  // will be loaded into the old Prism object and will not be found
  // by the loading code below.

  if (!Prism) {
    throw new Error(
      "markdown-it-prism-backticks says: " +
        "You need to import 'prismjs' to make the global Prism object available to this plugin"
    );
  }

  let prismLanguage = Prism.languages[lang];

  if (!prismLanguage) {
    loadLanguages(lang);
    prismLanguage = Prism.languages[lang];

    if (!prismLanguage) {
      throw new Error(
        `markdown-it-prism-backticks says: I loaded the language '${lang}' into Prism but I cannot find it. ` +
          "The Prism global object has probably been initialized more than once."
      );
    }
  }

  return prismLanguage;
}

function backticksHandler(state, silent) {
  let pos = state.pos;

  if (state.src.charCodeAt(pos) !== BACKTICK_CHAR_CODE) {
    return false;
  }

  const start = pos;
  pos++;
  const max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === BACKTICK_CHAR_CODE) {
    pos++;
  }

  var marker = state.src.slice(start, pos);
  let matchStart = pos;
  let matchEnd = pos;

  while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (
      matchEnd < max &&
      state.src.charCodeAt(matchEnd) === BACKTICK_CHAR_CODE
    ) {
      matchEnd++;
    }

    if (matchEnd - matchStart === marker.length) {
      // The language to use is indicated by content in curly braces
      // that appears directly after the backticks and that has
      // the form '{lang=some-lang}'.
      const possibleLanguage = state.src.slice(matchEnd);
      const languageMatch = possibleLanguage.match(LANGUAGE_REGEXP);
      const language = languageMatch ? languageMatch[1] : null;
      const prismLanguage = loadPrismLang(language);

      if (language) {
        matchEnd = matchEnd + languageMatch[0].length;
      }

      if (!silent) {
        const content = state.src
          .slice(pos, matchStart)
          .replace(/\n/g, " ")
          .replace(/^ (.+) $/, "$1");

        // Start the inline code block with an opening code tag.
        let token = state.push("code_inline_open", "code", 1);
        if (language) {
          token.attrs = [["class", `language-${language}`]];
        }
        token.markup = marker;

        // Use Prism to format the backticks content.
        token = state.push("html_block", "", 0);
        token.content = prismLanguage
          ? Prism.highlight(content, prismLanguage)
          : state.md.utils.escapeHtml(content);

        // End the inline code block with a closing code tag.
        token = state.push("code_inline_close", "code", -1);
        token.markup = marker;
      }

      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) {
    state.pending += marker;
  }

  state.pos += marker.length;
  return true;
}

export default function prismBackticksPlugin(md) {
  md.inline.ruler.at("backticks", backticksHandler);
}
