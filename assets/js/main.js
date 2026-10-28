// ---------------------------------------------------------------------------
// Interactive behavior ONLY. All page content is baked directly into the
// HTML — this file never renders content, so the site works with JS
// disabled (menus/accordions just show in their default open/closed state).
// ---------------------------------------------------------------------------

// ---------- Icons (used only for the dark/light toggle icon swap) ----------
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  chev: '<path d="m6 9 6 6 6-6"/>'
};
function icon(name, size = 20) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

function initLayout() {
  const themeBtn = document.getElementById("themeToggle");
  const applyTheme = (dark, animate) => {
    document.documentElement.classList.toggle("dark", dark);
    if (themeBtn) {
      themeBtn.innerHTML = icon(dark ? "sun" : "moon", 18);
      if (animate) {
        themeBtn.classList.remove("icon-pop");
        void themeBtn.offsetWidth;
        themeBtn.classList.add("icon-pop");
      }
    }
    try { localStorage.setItem("ce-theme", dark ? "dark" : "light"); } catch (e) {}
  };
  let isDark = false;
  try { isDark = localStorage.getItem("ce-theme") === "dark"; } catch (e) {}
  applyTheme(isDark, false);
  if (themeBtn) themeBtn.addEventListener("click", () => applyTheme(!document.documentElement.classList.contains("dark"), true));

  const menuBtn = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    const setMenu = (opening) => {
      menuBtn.classList.toggle("open", opening);
      menuBtn.setAttribute("aria-expanded", String(opening));
      if (opening) {
        mobileMenu.classList.add("open");
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
      } else {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
        requestAnimationFrame(() => {
          mobileMenu.classList.remove("open");
          mobileMenu.style.maxHeight = "0px";
        });
      }
    };
    menuBtn.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
    mobileMenu.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
  }

  // Header shadow + back-to-top button on scroll
  const header = document.querySelector(".site-header");
  if (header) {
    let backBtn = document.querySelector(".back-to-top");
    if (!backBtn) {
      backBtn = document.createElement("button");
      backBtn.className = "back-to-top";
      backBtn.setAttribute("aria-label", "بازگشت به بالا");
      backBtn.innerHTML = `<span style="display:inline-flex;transform:rotate(180deg)">${icon("chev", 20)}</span>`;
      backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
      document.body.appendChild(backBtn);
    }
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
      backBtn.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

function initAccordions(root = document) {
  root.querySelectorAll(".acc-item").forEach(item => {
    const trigger = item.querySelector(".acc-trigger");
    const body = item.querySelector(".acc-body");
    if (!trigger || !body) return;
    if (item.classList.contains("open")) body.style.maxHeight = "none";
    trigger.addEventListener("click", () => {
      const opening = !item.classList.contains("open");
      if (opening) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
        const onEnd = (e) => {
          if (e.propertyName === "max-height") {
            if (item.classList.contains("open")) body.style.maxHeight = "none";
            body.removeEventListener("transitionend", onEnd);
          }
        };
        body.addEventListener("transitionend", onEnd);
      } else {
        body.style.maxHeight = body.scrollHeight + "px";
        requestAnimationFrame(() => {
          item.classList.remove("open");
          body.style.maxHeight = "0px";
        });
      }
    });
  });
}

// Lightweight ripple feedback for icon buttons, filter chips and accordion triggers
document.addEventListener("click", (e) => {
  const el = e.target.closest(".icon-btn, .filter-chip, .acc-trigger");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.4;
  const span = document.createElement("span");
  span.className = "ripple";
  span.style.width = span.style.height = size + "px";
  span.style.left = (e.clientX - rect.left - size / 2) + "px";
  span.style.top = (e.clientY - rect.top - size / 2) + "px";
  el.appendChild(span);
  span.addEventListener("animationend", () => span.remove());
});

function initStatCounters(root = document) {
  const stats = root.querySelectorAll(".stat .num[data-count]");
  if (!stats.length) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const valueEl = el.querySelector(".num-value");
    if (!valueEl) return;
    if (reduceMotion || target <= 1) {
      valueEl.textContent = target.toLocaleString("fa-IR");
      return;
    }
    // Fixed duration regardless of target, and linear timing: for small
    // counts (4, 6...) an eased curve front-loads almost the whole count
    // into the first frames and then crawls, which reads as choppy rather
    // than smooth. Linear spacing keeps each integer tick evenly paced.
    const duration = 1400;
    const start = performance.now();
    let lastValue = -1;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(progress * target);
      if (value !== lastValue) {
        valueEl.textContent = value.toLocaleString("fa-IR");
        lastValue = value;
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (lastValue !== target) {
        valueEl.textContent = target.toLocaleString("fa-IR");
      }
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  stats.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  initAccordions();
  initStatCounters();
});
