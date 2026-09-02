// Lets you highlight (sharpie/marker-style) specific text inside a code
// block by wrapping it with `<!--hl-->...<!--/hl-->` in your markdown fence,
// e.g.:
//
// ```haskell
// f a b = <!--hl-->mod a b<!--/hl--> + 1
// ```
//
// mdBook's own highlight.js pass (in book.js) already ran by the time this
// script executes (it's loaded after book.js in book.toml's additional-js
// list), which means our delimiter text may have been split across several
// `<span class="hljs-...">` elements. Rather than reimplement cross-element
// text matching, we reuse mark.js - it's already bundled by mdBook for its
// own search-result highlighting (see searcher.js) and is specifically
// built to find and wrap text that spans multiple DOM nodes.
//
// mark.js wraps the *entire* regex match (delimiters included) in a
// <mark>; we then strip the literal `<!--hl-->`/`<!--/hl-->` text back out
// of the block afterwards (including from inside that new <mark>), leaving
// just the highlighted content visible.
(function () {
  var HL_REGEXP = /<!--hl-->([\s\S]*?)<!--\/hl-->/g;
  var START = '<!--hl-->';
  var END = '<!--/hl-->';

  function stripDelimiterText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    var toRemove = [];
    while ((node = walker.nextNode())) {
      if (node.data.indexOf(START) !== -1 || node.data.indexOf(END) !== -1) {
        node.data = node.data.split(START).join('').split(END).join('');
        if (node.data === '') {
          toRemove.push(node);
        }
      }
    }
    toRemove.forEach(function (node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function highlightCodeBlocks(scope) {
    if (typeof Mark === 'undefined') return;

    scope.querySelectorAll('code').forEach(function (block) {
      HL_REGEXP.lastIndex = 0;
      if (!HL_REGEXP.test(block.textContent)) return;

      var instance = new Mark(block);
      // No ignoreGroups here - mark.js's ignoreGroups option is 1-indexed
      // in a way that skips group 1 entirely (0 => whole match, 1 => group
      // 2, 2 => group 3, ...), so it can't target "group 1" directly when
      // that's the only group in the regex. Simplest correct fix: let it
      // wrap the *whole* match (delimiters included), then let
      // stripDelimiterText (which walks the whole block afterwards) remove
      // the literal delimiter text from wherever it landed, including from
      // inside the <mark> this creates.
      instance.markRegExp(new RegExp(HL_REGEXP.source, 'g'), {
        element: 'mark',
        className: 'hl-code',
        acrossElements: true,
        done: function () {
          stripDelimiterText(block);
        },
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      highlightCodeBlocks(document);
    });
  } else {
    highlightCodeBlocks(document);
  }
})();
