/* eslint-env mocha */

import chai, { expect } from "chai";
import chaiString from "chai-string";
import "prismjs"; // Ensure the Prism global object is defined.
import markdownit from "markdown-it";
import markdownItPrismBackticks from "./index";

chai.use(chaiString);

describe("markdown-it-prism-backticks", () => {
  it("highlights inline backticks with language specification using Prism", () => {
    expect(
      markdownit()
        .use(markdownItPrismBackticks)
        .render("Before `$0000`{lang=asm6502} after.")
    ).to.equalIgnoreSpaces(
      '<p>Before <code class="language-asm6502"><span class="token hexnumber string">$0000</span></code> after.</p>'
    );
  });

  it("highlights solitary inline backticks with language specification using Prism", () => {
    expect(
      markdownit().use(markdownItPrismBackticks).render("`$0000`{lang=asm6502}")
    ).to.equalIgnoreSpaces(
      '<p><code class="language-asm6502"><span class="token hexnumber string">$0000</span></code></p>'
    );
  });

  it("highlights inline backticks with no language specification using Prism", () => {
    expect(
      markdownit().use(markdownItPrismBackticks).render("Before `$0000` after.")
    ).to.equalIgnoreSpaces("<p>Before <code>$0000</code> after.</p>");
  });

  it("handles no inline backticks", () => {
    expect(
      markdownit().use(markdownItPrismBackticks).render("This is plain text.")
    ).to.equalIgnoreSpaces("<p>This is plain text.</p>");
  });

  it("ignores unknown language content when highlighting inline backticks using Prism", () => {
    expect(
      markdownit()
        .use(markdownItPrismBackticks)
        .render("Before `$0000`{.asm6502} after.")
    ).to.equalIgnoreSpaces("<p>Before <code>$0000</code>{.asm6502} after.</p>");
  });

  it("keeps extra curly braces when highlighting inline backticks using Prism", () => {
    expect(
      markdownit()
        .use(markdownItPrismBackticks)
        .render("Before `$0000`{lang=asm6502}{.someClass} after.")
    ).to.equalIgnoreSpaces(
      '<p>Before <code class="language-asm6502"><span class="token hexnumber string">$0000</span></code>{.someClass} after.</p>'
    );
  });

  it("handles whitespace in the same way as the built-in inline backticks processor", () => {
    expect(
      markdownit()
        .use(markdownItPrismBackticks)
        .render("Before ` $0000 ` after.")
    ).to.equalIgnoreSpaces("<p>Before <code>$0000</code> after.</p>");
  });
});
