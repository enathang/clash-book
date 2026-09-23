(function () {
    function wrapTitles() {
        document.querySelectorAll(".chapter li.chapter-item > a:not(.toggle)").forEach(function (a) {
            if (a.querySelector(".chapter-title-text")) return; // already wrapped
            var strong = a.firstElementChild;
            if (!strong || strong.tagName !== "STRONG") return;
            var span = document.createElement("span");
            span.className = "chapter-title-text";
            while (strong.nextSibling) {
                span.appendChild(strong.nextSibling);
            }
            if (span.firstChild && span.firstChild.nodeType === Node.TEXT_NODE) {
                span.firstChild.textContent = span.firstChild.textContent.replace(/^\s+/, "");
            }
            a.appendChild(span);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wrapTitles);
    } else {
        wrapTitles();
    }
})();
