// ---------------------------------------------------------------------------
// chart.js — curriculum dependency chart (chart.html only)
// Renders the 8-term course board, draws prerequisite wires between nodes,
// and highlights related courses on hover/focus. Course nodes that map to
// an existing page under resources/ are clickable links; the rest render
// as plain (non-clickable) info boxes rather than linking to a page that
// doesn't exist yet.
// ---------------------------------------------------------------------------

/* =========================================================
   1) DATA — courses, grouped by term
   ========================================================= */
const TERMS = [
  { n: 1, credits: 17 },
  { n: 2, credits: 18 },
  { n: 3, credits: 18 },
  { n: 4, credits: 17 },
  { n: 5, credits: 18 },
  { n: 6, credits: 19 },
  { n: 7, credits: 16 },
  { n: 8, credits: 18 },
];

// category: general | basic | core | special
const NODES = [
  // Term 1
  { id: 'mabani-ce', term: 1, label: 'مبانی کامپیوتر و برنامه‌سازی', credit: 3, cat: 'basic' },
  { id: 'karg-mabani', term: 1, label: 'کارگاه مبانی کامپیوتر و برنامه‌سازی', credit: 1, cat: 'basic' },
  { id: 'riazi1', term: 1, label: 'ریاضی عمومی ۱', credit: 3, cat: 'basic' },
  { id: 'fizik1', term: 1, label: 'فیزیک ۱', credit: 3, cat: 'basic' },
  { id: 'farsi', term: 1, label: 'زبان فارسی', credit: 3, cat: 'general' },
  { id: 'english1', term: 1, label: 'زبان انگلیسی ۱', credit: 1, cat: 'general' },
  { id: 'karg-omumi', term: 1, label: 'کارگاه عمومی یا کارگاه برق', credit: 1, cat: 'general' },
  { id: 'khanevadeh', term: 1, label: 'دانش خانواده و جمعیت', credit: 2, cat: 'general' },

  // Term 2
  { id: 'barnameh-pishrafte', term: 2, label: 'برنامه‌سازی پیشرفته', credit: 3, cat: 'core', href: 'resources/advanced-programming.html' },
  { id: 'karg-barnameh-pishrafte', term: 2, label: 'کارگاه برنامه‌نویسی پیشرفته', credit: 1, cat: 'core' },
  { id: 'riaziyat-gosaste', term: 2, label: 'ریاضیات گسسته', credit: 3, cat: 'basic' },
  { id: 'riazi2', term: 2, label: 'ریاضی عمومی ۲', credit: 3, cat: 'basic' },
  { id: 'fizik2', term: 2, label: 'فیزیک ۲', credit: 3, cat: 'basic' },
  { id: 'tarbiat1', term: 2, label: 'تربیت بدنی ۱', credit: 1, cat: 'general' },
  { id: 'english2', term: 2, label: 'زبان انگلیسی ۲', credit: 2, cat: 'core' },
  { id: 'omumi1', term: 2, label: 'درس عمومی', credit: 2, cat: 'general' },

  // Term 3
  { id: 'madar-mantighi', term: 3, label: 'مدارهای منطقی', credit: 3, cat: 'basic' },
  { id: 'az-madar-mantighi', term: 3, label: 'آزمایشگاه مدارهای منطقی', credit: 1, cat: 'basic' },
  { id: 'sakhteman-dade', term: 3, label: 'ساختمان داده‌ها و الگوریتم‌ها', credit: 3, cat: 'core', href: 'resources/data-structures.html' },
  { id: 'moadelat', term: 3, label: 'معادلات دیفرانسیل', credit: 3, cat: 'basic' },
  { id: 'madar-electriki', term: 3, label: 'مدارهای الکتریکی و الکترونیکی', credit: 3, cat: 'core' },
  { id: 'az-madar-electriki', term: 3, label: 'آز مدارهای الکتریکی و الکترونیکی', credit: 1, cat: 'core' },
  { id: 'tarbiat2', term: 3, label: 'تربیت بدنی ۲', credit: 1, cat: 'general' },
  { id: 'amar', term: 3, label: 'آمار و احتمال مهندسی', credit: 3, cat: 'core' },

  // Term 4
  { id: 'jabre-khatti', term: 4, label: 'جبر خطی کاربردی', credit: 3, cat: 'core' },
  { id: 'nazariye-zaban', term: 4, label: 'نظریه زبان‌ها و ماشین‌ها', credit: 3, cat: 'core' },
  { id: 'tarahi-algoritm', term: 4, label: 'طراحی الگوریتم‌ها', credit: 3, cat: 'special', href: 'resources/algorithms.html' },
  { id: 'memari-computer', term: 4, label: 'معماری کامپیوتر', credit: 3, cat: 'core' },
  { id: 'az-memari', term: 4, label: 'آزمایشگاه معماری کامپیوتر', credit: 1, cat: 'core' },
  { id: 'omumi2', term: 4, label: 'درس عمومی', credit: 2, cat: 'general' },
  { id: 'omumi3', term: 4, label: 'درس عمومی', credit: 2, cat: 'general' },

  // Term 5
  { id: 'sistem-amel', term: 5, label: 'سیستم‌های عامل', credit: 3, cat: 'core', href: 'resources/operating-systems.html' },
  { id: 'osoul-compiler', term: 5, label: 'اصول طراحی کامپایلر', credit: 3, cat: 'special' },
  { id: 'signal-system', term: 5, label: 'سیگنال‌ها و سیستم‌ها', credit: 3, cat: 'core' },
  { id: 'narmafzar1', term: 5, label: 'مهندسی نرم‌افزار ۱', credit: 3, cat: 'special' },
  { id: 'ravesh-pazhouhesh', term: 5, label: 'روش پژوهش و ارائه', credit: 2, cat: 'core' },
  { id: 'omumi4', term: 5, label: 'درس عمومی', credit: 2, cat: 'general' },
  { id: 'omumi5', term: 5, label: 'درس عمومی', credit: 2, cat: 'general' },

  // Term 6
  { id: 'shabakeh', term: 6, label: 'شبکه‌های کامپیوتری', credit: 3, cat: 'core', href: 'resources/computer-networks.html' },
  { id: 'az-shabakeh', term: 6, label: 'آزمایشگاه شبکه‌های کامپیوتری', credit: 1, cat: 'core' },
  { id: 'rizpardazande', term: 6, label: 'ریزپردازنده و زبان اسمبلی', credit: 3, cat: 'core' },
  { id: 'az-rizpardazande', term: 6, label: 'آز ریزپردازنده', credit: 1, cat: 'core' },
  { id: 'mabani-hoosh', term: 6, label: 'مبانی و کاربردهای هوش مصنوعی', credit: 3, cat: 'special', href: 'resources/artificial-intelligence.html' },
  { id: 'osoul-payegah', term: 6, label: 'اصول طراحی پایگاه داده‌ها', credit: 3, cat: 'special', href: 'resources/databases.html' },
  { id: 'az-sistem-amel', term: 6, label: 'آزمایشگاه سیستم‌های عامل', credit: 1, cat: 'core' },
  { id: 'zaban-takhassosi', term: 6, label: 'زبان تخصصی', credit: 2, cat: 'core' },
  { id: 'omumi6', term: 6, label: 'درس عمومی', credit: 2, cat: 'general' },

  // Term 7
  { id: 'zabanhaye-barnamesazi', term: 7, label: 'زبان‌های برنامه‌سازی', credit: 3, cat: 'special' },
  { id: 'barnameh-web', term: 7, label: 'برنامه‌نویسی وب', credit: 3, cat: 'special', href: 'resources/web-programming.html' },
  { id: 'narmafzar2', term: 7, label: 'مهندسی نرم‌افزار ۲', credit: 3, cat: 'special' },
  { id: 'bazyabi-etelaat', term: 7, label: 'بازیابی اطلاعات', credit: 3, cat: 'special' },
  { id: 'enteghal-dade', term: 7, label: 'انتقال داده‌ها', credit: 3, cat: 'special' },
  { id: 'karamouzi', term: 7, label: 'کارآموزی تابستان', credit: 1, cat: 'general' },

  // Term 8
  { id: 'pruzhe-payani', term: 8, label: 'پروژه پایانی', credit: 3, cat: 'special' },
  { id: 'internet-ashya', term: 8, label: 'مبانی اینترنت اشیاء', credit: 3, cat: 'special' },
  { id: 'barnameh-mobile', term: 8, label: 'برنامه‌نویسی دستگاه‌های سیار', credit: 3, cat: 'special' },
  { id: 'hoosh-mohasebati', term: 8, label: 'مبانی هوش محاسباتی', credit: 3, cat: 'special' },
  { id: 'dade-kavi', term: 8, label: 'داده‌کاوی', credit: 3, cat: 'special' },
  { id: 'tarahi-digital', term: 8, label: 'طراحی سیستم‌های دیجیتال برنامه‌پذیر', credit: 3, cat: 'special', href: 'resources/information-security.html' },
];

// prerequisite arrows: [from, to]  (from = prerequisite, to = course that needs it)
const EDGES = [
  ['mabani-ce', 'barnameh-pishrafte'],
  ['riazi1', 'riazi2'],
  ['fizik1', 'fizik2'],
  ['riazi2', 'moadelat'],
  ['riazi2', 'jabre-khatti'],
  ['riazi2', 'amar'],
  ['barnameh-pishrafte', 'sakhteman-dade'],
  ['riaziyat-gosaste', 'sakhteman-dade'],
  ['riaziyat-gosaste', 'nazariye-zaban'],
  ['sakhteman-dade', 'tarahi-algoritm'],
  ['sakhteman-dade', 'osoul-payegah'],
  ['sakhteman-dade', 'osoul-compiler'],
  ['nazariye-zaban', 'osoul-compiler'],
  ['madar-mantighi', 'memari-computer'],
  ['madar-mantighi', 'rizpardazande'],
  ['memari-computer', 'sistem-amel'],
  ['madar-electriki', 'signal-system'],
  ['tarahi-algoritm', 'mabani-hoosh'],
  ['jabre-khatti', 'mabani-hoosh'],
  ['sistem-amel', 'shabakeh'],
  ['sistem-amel', 'az-sistem-amel'],
  ['signal-system', 'enteghal-dade'],
  ['shabakeh', 'az-shabakeh'],
  ['shabakeh', 'barnameh-web'],
  ['shabakeh', 'internet-ashya'],
  ['osoul-payegah', 'bazyabi-etelaat'],
  ['osoul-payegah', 'dade-kavi'],
  ['mabani-hoosh', 'hoosh-mohasebati'],
  ['narmafzar1', 'narmafzar2'],
  ['zabanhaye-barnamesazi', 'barnameh-mobile'],
  ['ravesh-pazhouhesh', 'pruzhe-payani'],
];

/* =========================================================
   2) RENDER
   ========================================================= */
const board = document.getElementById('board');

function goToCourse(href) {
  if (!href) return;
  window.location.href = href;
}

TERMS.forEach(t => {
  const col = document.createElement('div');
  col.className = 'chart-col';
  col.dataset.term = t.n;

  const head = document.createElement('div');
  head.className = 'chart-col-head';
  head.innerHTML = `ترم ${t.n}<small>${t.credits} واحد</small>`;
  col.appendChild(head);

  NODES.filter(n => n.term === t.n).forEach(n => {
    const el = document.createElement('div');
    el.className = 'chart-node cat-' + n.cat;
    el.dataset.id = n.id;
    el.innerHTML = `<span>${n.label}</span><span class="chart-credit">${n.credit} واحد</span>`;

    if (n.href) {
      el.tabIndex = 0;
      el.setAttribute('role', 'link');
      el.addEventListener('click', () => goToCourse(n.href));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToCourse(n.href); }
      });
    }
    el.addEventListener('mouseenter', () => highlight(n.id));
    el.addEventListener('mouseleave', clearHighlight);
    el.addEventListener('focus', () => highlight(n.id));
    el.addEventListener('blur', clearHighlight);
    col.appendChild(el);
  });

  board.appendChild(col);
});

/* =========================================================
   3) WIRES — draw prerequisite arrows between boxes
   ========================================================= */
const svg = document.getElementById('wires');
const boardWrap = document.getElementById('boardWrap');

function wireColor() {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--wire-color').trim();
  return `rgb(${val.split(/\s+/).join(',')})`;
}

function buildDefs() {
  svg.innerHTML = `
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L7,3 Z" fill="${wireColor()}"></path>
      </marker>
    </defs>
  `;
}

function nodeEl(id) { return board.querySelector('.chart-node[data-id="' + id + '"]'); }

function drawWires() {
  buildDefs();
  const boardRect = board.getBoundingClientRect();
  svg.setAttribute('width', board.scrollWidth);
  svg.setAttribute('height', board.scrollHeight);
  const color = wireColor();

  EDGES.forEach(([fromId, toId]) => {
    const a = nodeEl(fromId), b = nodeEl(toId);
    if (!a || !b) return;
    const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();

    // RTL layout: earlier term is on the right, later term on the left.
    const x1 = ar.left - boardRect.left;
    const y1 = ar.top - boardRect.top + ar.height / 2;
    const x2 = br.right - boardRect.left;
    const y2 = br.top - boardRect.top + br.height / 2;

    const dx = Math.max(30, (x1 - x2) * 0.4);
    const c1x = x1 - dx, c1y = y1;
    const c2x = x2 + dx, c2y = y2;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'wire');
    path.setAttribute('d', `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2 + 9} ${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-opacity', '0.5');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.dataset.from = fromId;
    path.dataset.to = toId;
    svg.appendChild(path);
  });
}

function highlight(id) {
  const related = new Set([id]);
  EDGES.forEach(([f, t]) => { if (f === id) related.add(t); if (t === id) related.add(f); });

  board.querySelectorAll('.chart-node').forEach(el => {
    if (related.has(el.dataset.id)) {
      el.classList.remove('hl-dim');
      if (el.dataset.id === id) el.classList.add('hl-active');
    } else {
      el.classList.add('hl-dim');
    }
  });

  svg.querySelectorAll('path.wire').forEach(p => {
    const on = p.dataset.from === id || p.dataset.to === id;
    p.setAttribute('stroke-opacity', on ? '0.95' : '0.08');
    p.setAttribute('stroke-width', on ? '2.2' : '1.6');
  });
}

function clearHighlight() {
  board.querySelectorAll('.chart-node').forEach(el => {
    el.classList.remove('hl-dim', 'hl-active');
  });
  svg.querySelectorAll('path.wire').forEach(p => {
    p.setAttribute('stroke-opacity', '0.5');
    p.setAttribute('stroke-width', '1.6');
  });
}

window.addEventListener('load', () => { drawWires(); });
window.addEventListener('resize', () => { clearTimeout(window._crt); window._crt = setTimeout(drawWires, 120); });

// Redraw when the theme toggle flips (wire/arrowhead color depends on the
// --wire-color custom property, which changes value under html.dark).
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) themeBtn.addEventListener('click', () => setTimeout(drawWires, 60));

// Redraw once webfont is applied (label widths can shift slightly)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => setTimeout(drawWires, 50));
}
