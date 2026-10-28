/* comments.js — Giscus loader, shared by every resource page.
   Setup (once): enable Discussions on your GitHub repo, install the giscus app,
   then open https://giscus.app/fa, fill in your repo and copy the 4 values below. */
(function () {
  var G = {
    repo: "USERNAME/REPO",        // e.g. "ali/compmate"
    repoId: "",                   // data-repo-id
    category: "Resource Comments",// the Discussions category name
    categoryId: ""                // data-category-id
  };
  var box = document.getElementById("giscus-box");
  if (!box) return;
  var theme = function () { return document.documentElement.classList.contains("dark") ? "dark" : "light"; };

  if (!G.repoId || !G.categoryId) {
    box.innerHTML = '<div class="ds-gnote"><b>بخش نظرات هنوز راه‌اندازی نشده است.</b>' +
      '<p>مقادیر Giscus را در فایل <bdi dir="ltr">assets/js/comments.js</bdi> وارد کنید.</p></div>';
    return;
  }
  var s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  var a = {
    "data-repo": G.repo, "data-repo-id": G.repoId,
    "data-category": G.category, "data-category-id": G.categoryId,
    "data-mapping": "pathname",          // one thread per resource page
    "data-strict": "0", "data-reactions-enabled": "1", "data-emit-metadata": "0",
    "data-input-position": "top", "data-theme": theme(), "data-lang": "fa", "data-loading": "lazy"
  };
  for (var k in a) s.setAttribute(k, a[k]);
  box.appendChild(s);

  // keep the widget in sync with the site's dark-mode toggle
  new MutationObserver(function () {
    var f = document.querySelector("iframe.giscus-frame");
    if (f) f.contentWindow.postMessage({ giscus: { setConfig: { theme: theme() } } }, "https://giscus.app");
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})();