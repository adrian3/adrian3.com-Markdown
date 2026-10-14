<!---
component: true
component-name: design-nav
raw: true
notes: Sub-nav for the /design pages. The order here sets the sub-nav order and the "Next" band at the bottom of each section page. When you reorder, also reorder the slides in design/index.md. data-title is the page name shown in the Next band. data-position is where the Next band crops that page's hero image.
--->
<nav class="pf-subnav" aria-label="Design sections">
  <div class="pf-sn-inner">
    <a class="pf-sn-home" href="/design/">Overview</a>
    <ol class="pf-sn-list">
      <li><a class="pf-sn-item" href="/design/principles.html" data-hero="creative-practice" data-title="Design Principles" data-position="50% 30%"><span class="pf-sn-num">00</span> <span class="pf-sn-label">Principles</span><span class="pf-sn-bar" aria-hidden="true"><i></i></span></a></li>
      <li><a class="pf-sn-item" href="/design/fitness.html" data-hero="fitness" data-title="Human Performance" data-position="50% 85%"><span class="pf-sn-num">01</span> <span class="pf-sn-label">Fitness Tech</span><span class="pf-sn-bar" aria-hidden="true"><i></i></span></a></li>
      <li><a class="pf-sn-item" href="/design/agriculture.html" data-hero="agriculture" data-title="Agriculture" data-position="50% 50%"><span class="pf-sn-num">02</span> <span class="pf-sn-label">Ag Tech</span><span class="pf-sn-bar" aria-hidden="true"><i></i></span></a></li>
      <li><a class="pf-sn-item" href="/design/emerging-tech.html" data-hero="emerging-tech2" data-title="Emerging Tech" data-position="50% 35%"><span class="pf-sn-num">03</span> <span class="pf-sn-label">Emerging Tech</span><span class="pf-sn-bar" aria-hidden="true"><i></i></span></a></li>
    </ol>
    <ul class="pf-sn-extra"><li><a href="/design/resume.html">Resume</a></li></ul>
  </div>
</nav>
<script>
(function () {
  /* Mark the page you are on, and fill its progress segment */
  var here = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.pf-subnav a').forEach(function (a) {
    if (a.pathname.replace(/index\.html$/, '') !== here) return;
    a.setAttribute('aria-current', 'page');
    if (a.classList.contains('pf-sn-item')) a.style.setProperty('--p', 1);
  });
}());
</script>
