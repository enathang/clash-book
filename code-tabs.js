// Turns a run of fenced code blocks into a click-to-switch tabbed panel.
//
// Usage: put a marker comment right before the code blocks you want
// grouped, with one `|`-separated label per block (the blocks must
// appear immediately after the marker, one per label, in order, with
// nothing else in between):
//
//   <!-- tabs: Clash | VHDL | Verilog | SystemVerilog -->
//   ```haskell
//   ...
//   ```
//   ```vhdl
//   ...
//   ```
//   ```verilog
//   ...
//   ```
//   ```systemverilog
//   ...
//   ```
//
// mdBook's own highlight.js pass (in book.js) already ran by the time this
// script executes (it's loaded after book.js in book.toml's additional-js
// list), so each block keeps whatever syntax highlighting it already got -
// this script only rearranges the already-rendered `<pre>` elements, it
// doesn't touch their contents.
(function () {
  function findMarkers(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
    var markers = [];
    var node;
    while ((node = walker.nextNode())) {
      var match = node.data.match(/^\s*tabs:\s*(.+?)\s*$/);
      if (match) {
        markers.push({
          node: node,
          labels: match[1].split('|').map(function (s) { return s.trim(); }),
        });
      }
    }
    return markers;
  }

  function collectPanels(marker) {
    var panels = [];
    var cursor = marker.node.nextSibling;
    while (panels.length < marker.labels.length && cursor) {
      var next = cursor.nextSibling;
      if (cursor.nodeType === 1 && cursor.tagName === 'PRE') {
        panels.push(cursor);
      } else if (cursor.nodeType === 1) {
        // hit something that isn't a code block - the markup doesn't match
        // what this marker expects, so bail out rather than guess
        break;
      }
      cursor = next;
    }
    return panels;
  }

  function buildTabs(root) {
    findMarkers(root).forEach(function (marker) {
      var panels = collectPanels(marker);
      if (panels.length !== marker.labels.length) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-tabs';

      var nav = document.createElement('div');
      nav.className = 'code-tabs-nav';
      nav.setAttribute('role', 'tablist');

      var panelHost = document.createElement('div');
      panelHost.className = 'code-tabs-panels';

      panels.forEach(function (pre, i) {
        var panel = document.createElement('div');
        panel.className = 'code-tabs-panel';
        panel.hidden = i !== 0;
        panel.appendChild(pre);
        panelHost.appendChild(panel);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-tabs-tab' + (i === 0 ? ' is-active' : '');
        btn.textContent = marker.labels[i];
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.addEventListener('click', function () {
          Array.prototype.forEach.call(nav.children, function (b, j) {
            b.classList.toggle('is-active', j === i);
            b.setAttribute('aria-selected', j === i ? 'true' : 'false');
          });
          Array.prototype.forEach.call(panelHost.children, function (p, j) {
            p.hidden = j !== i;
          });
        });
        nav.appendChild(btn);
      });

      wrapper.appendChild(nav);
      wrapper.appendChild(panelHost);
      marker.node.parentNode.replaceChild(wrapper, marker.node);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { buildTabs(document); });
  } else {
    buildTabs(document);
  }
})();
