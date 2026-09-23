(function () {
    function initImageZoom() {
        var overlay = document.createElement("div");
        overlay.className = "image-zoom-overlay";
        var overlayImg = document.createElement("img");
        overlay.appendChild(overlayImg);
        document.body.appendChild(overlay);

        function close() {
            overlay.classList.remove("active");
        }

        overlay.addEventListener("click", close);
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") close();
        });

        document.querySelectorAll(".content img").forEach(function (img) {
            img.addEventListener("click", function () {
                overlayImg.src = img.currentSrc || img.src;
                overlayImg.alt = img.alt;
                overlay.classList.add("active");
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initImageZoom);
    } else {
        initImageZoom();
    }
})();
