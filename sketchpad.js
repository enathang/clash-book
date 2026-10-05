/*
 * Freehand drawing boxes. Put this in any chapter's markdown:
 *
 *   <div class="sketchpad"></div>
 *
 * Optional attributes (all optional):
 *   data-width="600"    maximum width in px (the box shrinks to fit narrow pages)
 *   data-height="300"   height in px at full width (the aspect ratio is kept)
 *   data-persist="id"   remember the drawing in this browser (localStorage),
 *                       keyed by page + id. Omit to start blank on every load.
 *
 * Works with mouse, touch and pen (Pointer Events). The pen uses the page's
 * current text color, so it stays visible in every mdBook theme, and strokes
 * are re-colored if the reader switches theme.
 */
(function () {
    var PEN_WIDTH = 2.5;

    function storageKey(id) {
        return "sketchpad:" + location.pathname + ":" + id;
    }

    function loadStrokes(id) {
        try {
            var raw = localStorage.getItem(storageKey(id));
            var parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function saveStrokes(id, strokes) {
        try {
            localStorage.setItem(storageKey(id), JSON.stringify(strokes));
        } catch (e) { /* storage blocked or full: drawing just won't persist */ }
    }

    function makeButton(label, onClick) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "sketchpad-button";
        b.textContent = label;
        b.addEventListener("click", onClick);
        return b;
    }

    function initSketchpad(host) {
        if (host.dataset.sketchpadReady) return;
        host.dataset.sketchpadReady = "1";

        var W = parseInt(host.dataset.width, 10) || 600;
        var H = parseInt(host.dataset.height, 10) || 300;
        var persistId = host.dataset.persist || "";

        var strokes = persistId ? loadStrokes(persistId) : [];
        var current = null;

        var canvas = document.createElement("canvas");
        canvas.className = "sketchpad-canvas";
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", "Drawing area: draw with mouse, finger or pen.");
        canvas.style.maxWidth = W + "px";
        canvas.style.aspectRatio = W + " / " + H;

        var dpr = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        var ctx = canvas.getContext("2d");

        function drawStroke(stroke) {
            var pts = stroke;
            if (!pts.length) return;
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            if (pts.length === 1) {
                ctx.lineTo(pts[0][0] + 0.01, pts[0][1]); // a dot
            } else {
                for (var i = 1; i < pts.length - 1; i++) {
                    var mx = (pts[i][0] + pts[i + 1][0]) / 2;
                    var my = (pts[i][1] + pts[i + 1][1]) / 2;
                    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
                }
                var last = pts[pts.length - 1];
                ctx.lineTo(last[0], last[1]);
            }
            ctx.stroke();
        }

        function redraw() {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = PEN_WIDTH;
            ctx.strokeStyle = getComputedStyle(canvas).color;
            strokes.forEach(drawStroke);
            if (current) drawStroke(current);
        }

        function pointFromEvent(e) {
            var r = canvas.getBoundingClientRect();
            var x = ((e.clientX - r.left) / r.width) * W;
            var y = ((e.clientY - r.top) / r.height) * H;
            return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
        }

        canvas.addEventListener("pointerdown", function (e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            e.preventDefault();
            canvas.setPointerCapture(e.pointerId);
            current = [pointFromEvent(e)];
            redraw();
        });
        canvas.addEventListener("pointermove", function (e) {
            if (!current) return;
            current.push(pointFromEvent(e));
            redraw();
        });
        function endStroke() {
            if (!current) return;
            strokes.push(current);
            current = null;
            if (persistId) saveStrokes(persistId, strokes);
            redraw();
        }
        canvas.addEventListener("pointerup", endStroke);
        canvas.addEventListener("pointercancel", endStroke);

        var toolbar = document.createElement("div");
        toolbar.className = "sketchpad-toolbar";
        toolbar.appendChild(makeButton("Undo", function () {
            strokes.pop();
            if (persistId) saveStrokes(persistId, strokes);
            redraw();
        }));
        toolbar.appendChild(makeButton("Clear", function () {
            strokes = [];
            if (persistId) saveStrokes(persistId, strokes);
            redraw();
        }));

        host.classList.add("sketchpad-ready");
        host.appendChild(canvas);
        host.appendChild(toolbar);
        redraw();

        // Re-color the pen when the reader switches mdBook theme.
        new MutationObserver(redraw).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    function initAll() {
        document.querySelectorAll(".sketchpad").forEach(initSketchpad);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
