// Adds an optional header-bar link to mdbook-admonish blocks.
//
// mdbook-admonish's own fence-line syntax (```admonish note title="...")
// is parsed and rendered by its compiled Rust binary, which we can't
// patch from here. Instead, this reads a small marker left in the block's
// *body* content and moves it into the title bar at render time, giving
// the same visual result without touching mdbook-admonish itself.
//
// Usage: put a line like this anywhere in the admonish block's content
// (it will not be shown - it's an HTML comment, invisible until this
// script processes it):
//
//   <!-- admonish-link href="https://example.com" text="See docs" -->
//
// ```admonish note title="My Note"
// <!-- admonish-link href="https://example.com" text="See docs" -->
// The rest of the block's content goes here as usual.
// ```
(function () {
  function addAdmonishLinks(root) {
    root.querySelectorAll(".admonition").forEach(function (block) {
      var walker = document.createTreeWalker(block, NodeFilter.SHOW_COMMENT);
      var node;
      while ((node = walker.nextNode())) {
        var match = node.data.match(
          /^\s*admonish-link\s+href="([^"]*)"\s+text="([^"]*)"\s*$/
        );
        if (!match) continue;

        var href = match[1];
        var text = match[2];
        var titleBar = block.querySelector(
          ":scope > .admonition-title, :scope > summary.admonition-title"
        );
        if (titleBar && !titleBar.querySelector(".admonish-header-link")) {
          var link = document.createElement("a");
          link.href = href;
          link.textContent = text;
          link.className = "admonish-header-link";
          titleBar.appendChild(link);
        }

        node.parentNode.removeChild(node);
        break;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      addAdmonishLinks(document);
    });
  } else {
    addAdmonishLinks(document);
  }
})();
