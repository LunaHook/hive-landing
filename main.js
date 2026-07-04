/* ============================================================
   HIVE landing — vanilla JS
   Starfield, scroll reveals, and abstract (non-screenshot) data viz.
   All motion respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: solidify on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal-on-scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up numbers ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = el.getAttribute('data-float') === '1';
    if (reduceMotion) {
      el.textContent = (isFloat ? target.toFixed(1) : Math.round(target)) + suffix;
      return;
    }
    var dur = 1300, start = performance.now();
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = target * eased;
      el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Gauges (stroke-dashoffset arc) ---------- */
  function animateGauge(circle, pct) {
    var CIRC = 314; // 2πr, r=50
    var off = CIRC * (1 - Math.max(0, Math.min(100, pct)) / 100);
    if (reduceMotion) { circle.style.transition = 'none'; }
    // Force layout, then set offset so the CSS transition runs.
    circle.getBoundingClientRect();
    circle.style.strokeDashoffset = String(off);
  }

  /* Trigger count-ups + gauges when their section scrolls in. */
  function whenVisible(el, cb) {
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var o = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { cb(); o.disconnect(); }
      });
    }, { threshold: 0.4 });
    o.observe(el);
  }

  document.querySelectorAll('[data-count]').forEach(function (el) {
    whenVisible(el, function () { animateCount(el); });
  });

  var arcCyan = document.querySelector('.arc-cyan');
  var arcViolet = document.querySelector('.arc-violet');
  var insights = document.getElementById('insights');
  if (insights && (arcCyan || arcViolet)) {
    whenVisible(insights, function () {
      if (arcCyan) animateGauge(arcCyan, 41);
      if (arcViolet) animateGauge(arcViolet, 58);
    });
  }

  /* ---------- Activity heatmap (abstract) ---------- */
  var heat = document.querySelector('.heatmap');
  if (heat) {
    var COLS = 17, ROWS = 6, cells = COLS * ROWS;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < cells; i++) {
      var cell = document.createElement('i');
      // Weighted-random intensity, occasional bright "active" days.
      var r = Math.random();
      var intensity = r < 0.45 ? 0.05 : 0.12 + Math.pow(r, 2) * 0.85;
      var mixViolet = Math.random() < 0.3;
      var color = mixViolet
        ? 'rgba(176,96,255,' + intensity.toFixed(2) + ')'
        : 'rgba(34,224,255,' + intensity.toFixed(2) + ')';
      cell.style.background = color;
      frag.appendChild(cell);
    }
    heat.appendChild(frag);
  }

  /* ---------- Hero live chart (abstract line + area) ---------- */
  var chart = document.querySelector('.viz-chart');
  if (chart) {
    var W = 320, H = 150;
    var lineCyan = chart.querySelector('.line-cyan');
    var areaCyan = chart.querySelector('.area-cyan');
    var lineViolet = chart.querySelector('.line-violet');
    var areaViolet = chart.querySelector('.area-violet');
    var SAMPLES = 44;

    function wave(phase, base, amp, jitterSeed) {
      // Build sampled points as a blend of two sines + gentle noise.
      var pts = [];
      for (var i = 0; i <= SAMPLES; i++) {
        var x = (i / SAMPLES) * W;
        var t = i / SAMPLES;
        var y = base
          + Math.sin(t * 6.2 + phase) * amp
          + Math.sin(t * 13.5 + phase * 1.7 + jitterSeed) * (amp * 0.35);
        pts.push([x, y]);
      }
      return pts;
    }
    function toLine(pts) {
      var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) d += ' L' + pts[i][0].toFixed(1) + ',' + pts[i][1].toFixed(1);
      return d;
    }
    function toArea(pts) {
      return toLine(pts) + ' L' + W + ',' + H + ' L0,' + H + ' Z';
    }
    function draw(phase) {
      var c = wave(phase, 66, 26, 0.0);
      var v = wave(phase * 0.8 + 1.4, 104, 15, 2.1);
      lineCyan.setAttribute('d', toLine(c));
      areaCyan.setAttribute('d', toArea(c));
      lineViolet.setAttribute('d', toLine(v));
      areaViolet.setAttribute('d', toArea(v));
    }

    draw(0);
    if (!reduceMotion) {
      var phase = 0, last = 0;
      function loop(now) {
        // Throttle to ~24fps — enough to feel "live", easy on the CPU.
        if (now - last > 42) { phase += 0.05; draw(phase); last = now; }
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }
  }

  /* ---------- Starfield (deep-space backdrop) ---------- */
  var canvas = document.getElementById('starfield');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [];
    var w, h;

    function resize() {
      w = canvas.clientWidth = window.innerWidth;
      h = canvas.clientHeight = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(150, Math.floor((w * h) / 12000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.9 + 0.1,          // depth → size + speed
          tw: Math.random() * Math.PI * 2,        // twinkle phase
          hue: Math.random() < 0.5 ? '34,224,255' : '176,96,255'
        });
      }
    }

    var t = 0;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      t += 0.01;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.y += s.z * 0.12;                        // slow downward drift
        if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
        var alpha = (0.35 + 0.45 * Math.sin(s.tw + t * 2)) * s.z;
        var size = s.z * 1.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + s.hue + ',' + alpha.toFixed(2) + ')';
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(frame);
  }
})();
