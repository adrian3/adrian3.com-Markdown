<!---
component: true
component-name: header
raw: true
class: nav
--->
<div class="nav-inner">
  <a class="nav-logo" href="/index.html" aria-label="Home">
    <svg id="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" xml:space="preserve" aria-hidden="true">
      <g id="logo2">
        <path class="d"        fill="#fff" d="M56.51,6.43h14.38c13.31,0,21.03,7.67,21.03,18.42v0.1c0,10.76-7.83,18.74-21.24,18.74H56.51V6.43z M71.04,34.54c6.18,0,10.27-3.41,10.27-9.42v-0.1c0-5.96-4.1-9.42-10.27-9.42h-4.21v18.95L71.04,34.54L71.04,34.54z"/>
        <path class="a"        fill="#fff" d="M52.77,11.14h7.47l11.91,28.17h-8.31l-2.03-4.99H51.02l-2,4.99h-8.16L52.77,11.14z M59.57,28.28l-3.12-7.95l-3.16,7.95C53.29,28.28,59.57,28.28,59.57,28.28z"/>
        <path class="e"        fill="#fff" d="M77.03,29.58h-7.34v-2.15h4.84v-1.38h-4.38v-1.99h4.38v-1.45h-4.9v-2.15h7.41L77.03,29.58L77.03,29.58z"/>
        <path class="outlineD" d="M56.51,6.43h14.38c13.31,0,21.03,7.67,21.03,18.42v0.1c0,10.76-7.83,18.74-21.24,18.74H56.51V6.43z M71.04,34.54c6.18,0,10.27-3.41,10.27-9.42v-0.1c0-5.96-4.1-9.42-10.27-9.42h-4.21v18.95L71.04,34.54L71.04,34.54z"/>
        <path class="outlineA" d="M52.77,11.14h7.47l11.91,28.17h-8.31l-2.03-4.99H51.02l-2,4.99h-8.16L52.77,11.14z M59.57,28.28l-3.12-7.95l-3.16,7.95C53.29,28.28,59.57,28.28,59.57,28.28z"/>
        <path class="outlineE" d="M77.03,29.58h-7.34v-2.15h4.84v-1.38h-4.38v-1.99h4.38v-1.45h-4.9v-2.15h7.41L77.03,29.58L77.03,29.58z"/>
        <path class="d2"       fill="#7a7a7a" d="M56.34,19.14h4.57c4.23,0,6.68,2.44,6.68,5.85v0.03c0,3.42-2.49,5.95-6.75,5.95h-4.5V19.14z M60.96,28.08c1.96,0,3.26-1.08,3.26-2.99v-0.03c0-1.9-1.3-3-3.26-3h-1.34v6.02H60.96L60.96,28.08z"/>
        <path class="a2"       fill="#7a7a7a" d="M47.9,19.47h3.06l4.87,11.52h-3.4l-0.83-2.04h-4.41l-0.82,2.04h-3.34L47.9,19.47z M50.68,26.46l-1.27-3.25l-1.29,3.25H50.68z"/>
        <path class="e2"       fill="#7a7a7a" d="M68.56,19.14H78v2.77h-6.22v1.78h5.64v2.57h-5.64v1.86h6.3v2.77h-9.53V19.14H68.56z"/>
      </g>
    </svg>
  </a>
  <nav>
    <a href="/index.html">home</a>
    <a href="/dashboard.html">dashboard</a>
    <a href="/art.html">art</a>
    <a href="/writing.html">writing</a>
    <a href="/projects.html">projects</a>
    <a href="/kitchen-sink/index.html">kitchen sink</a>
  </nav>
</div>
<script>
(function () {
  var svg = document.getElementById('logo');
  if (!svg) return;

  var s = {
    a: svg.querySelector('.a'), d: svg.querySelector('.d'), e: svg.querySelector('.e'),
    a2: svg.querySelector('.a2'), d2: svg.querySelector('.d2'), e2: svg.querySelector('.e2'),
    outA: svg.querySelector('.outlineA'), outD: svg.querySelector('.outlineD'), outE: svg.querySelector('.outlineE')
  };

  var count = 0, timer;
  // e2 rotation is cumulative — SVG.js rotate() adds to current angle.
  // init: 180° (upside down), scramble: +180 = 360° (right-side up, ADE visible),
  // restore: +180 = 540° (upside down again), and so on.
  var e2Rot = 0;

  function rHex()   { return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'); }
  function rAlpha() { return (Math.floor(Math.random() * 100) + 1) / 100; }
  function rScale() { return (Math.random() * 2 + 1).toFixed(2); }
  function rRot()   { return [0, 90, 180, 270][Math.floor(Math.random() * 4)]; }

  function init() {
    // Disable transitions so the initial state snaps in without a white flash
    Object.values(s).forEach(function (el) { el.style.transition = 'none'; });

    s.a.style.opacity = 1; s.a.style.fill = rHex(); s.a.style.transform = 'scale(1) rotate(0deg)';
    s.d.style.opacity = 1; s.d.style.fill = rHex(); s.d.style.transform = 'scale(1) rotate(0deg)';
    s.e.style.opacity = 1; s.e.style.fill = rHex(); s.e.style.transform = 'scale(1) rotate(0deg)';
    s.a2.style.opacity = 0; s.a2.style.transform = 'scale(2)';
    s.d2.style.opacity = 0; s.d2.style.transform = 'scale(2)';
    // Start e2 upside-down and hidden
    e2Rot = 180;
    s.e2.style.opacity = 0; s.e2.style.transform = 'rotate(' + e2Rot + 'deg)';
    // Outlines hidden from the start
    s.outA.style.opacity = 0; s.outD.style.opacity = 0; s.outE.style.opacity = 0;

    requestAnimationFrame(function () {
      Object.values(s).forEach(function (el) { el.style.transition = ''; });
    });
  }

  function scramble() {
    count++;
    s.a.style.opacity = rAlpha(); s.a.style.fill = rHex();
    s.a.style.transform = 'scale(' + rScale() + ') rotate(-90deg)';
    s.d.style.opacity = rAlpha(); s.d.style.fill = rHex();
    s.d.style.transform = 'scale(' + rScale() + ') rotate(' + rRot() + 'deg)';
    s.e.style.opacity = rAlpha(); s.e.style.fill = '#cc3300';
    s.e.style.transform = 'scale(' + (rScale() * 3) + ') rotate(' + rRot() + 'deg)';
    s.a2.style.opacity = 1; s.a2.style.transform = 'scale(1)';
    s.d2.style.opacity = 1; s.d2.style.transform = 'scale(1)';
    // Rotate e2 another 180° — it lands right-side up (ADE visible)
    e2Rot += 180;
    s.e2.style.opacity = 1; s.e2.style.transform = 'rotate(' + e2Rot + 'deg)';
  }

  function restore() {
    var r = rRot();
    s.a.style.opacity = 1; s.a.style.fill = rHex(); s.a.style.transform = 'scale(1) rotate(0deg)';
    s.d.style.opacity = 1; s.d.style.fill = rHex(); s.d.style.transform = 'scale(1) rotate(0deg)';
    s.e.style.opacity = 1; s.e.style.fill = rHex(); s.e.style.transform = 'scale(1) rotate(0deg)';
    s.a2.style.opacity = 0; s.a2.style.transform = 'scale(2) rotate(-90deg)';
    s.d2.style.opacity = 0; s.d2.style.transform = 'scale(2) rotate(' + r + 'deg)';
    // Rotate e2 another 180° — back to upside-down and hidden
    e2Rot += 180;
    s.e2.style.opacity = 0; s.e2.style.transform = 'rotate(' + e2Rot + 'deg)';
  }

  function tick() {
    scramble();
    if (count > 5) clearInterval(timer);
    setTimeout(restore, 3000);
  }

  init();
  timer = setInterval(tick, 6000);
  svg.addEventListener('mouseenter', function () { scramble(); clearInterval(timer); });
  svg.addEventListener('mouseleave', restore);
}());
</script>
