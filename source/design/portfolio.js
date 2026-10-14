/* Interactions for the /design overview and section pages. No dependencies.
   The sub-nav itself (components/design-nav.md) marks the current page; this file adds
   the scroll story, parallax, reveal, the case study cards and the Next band. */
(function () {
  var root = document.documentElement;
  root.classList.add('pf-js', 'pf-ready');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('pf-reduce');
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function each(sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); }
  var arrow = '<svg class="pf-arrow" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function heroSrcset(name) {
    return ['960', '1440', '2880'].map(function (w) { return '/imgs/design/hero-' + name + '-' + w + '.jpg ' + w + 'w'; }).join(', ');
  }

  var scrolly = document.querySelector('[data-scrolly]');

  /* Old links to the case study filters (/design/?category=...) now go to the full list */
  if (scrolly && /[?&]category=/.test(location.search)) {
    location.replace('case-studies.html' + location.search);
    return;
  }

  /* Sub-nav height feeds the sticky stage on the overview. --pf-vw is the window width
     without the scrollbar, for edge-to-edge images (100vw includes the scrollbar). */
  var subnav = document.querySelector('.pf-subnav');
  function measure() {
    if (subnav) root.style.setProperty('--sn-h', subnav.offsetHeight + 'px');
    root.style.setProperty('--pf-vw', root.clientWidth + 'px');
  }
  measure();

  /* Supporting images (<design-image type="…"> in the page markdown): each image, plus the
     line of text under it, becomes a figure with a caption. A linked image stays linked, and a
     link in a caption gets an arrow. */
  var figTypes = ['inline', 'wide', 'right-float', 'left-float', 'trio'];
  each('.pf-figs', function (box) {
    var type = box.getAttribute('data-figs');
    if (figTypes.indexOf(type) === -1) {
      if (window.console) console.warn('design-image: unknown type "' + type + '". Use ' + figTypes.join(', ') + '.');
      box.className = 'pf-figs pf-figs-inline';
    }
    var nodes = [];
    Array.prototype.forEach.call(box.childNodes, function (n) {
      if (n.nodeName === 'P') Array.prototype.forEach.call(n.childNodes, function (c) { nodes.push(c); });
      else nodes.push(n);
    });
    var figs = [], cur = null;
    nodes.forEach(function (n) {
      var isImg = n.nodeName === 'IMG' || (n.nodeName === 'A' && n.querySelector && n.querySelector('img') && !n.textContent.trim());
      if (isImg) {
        var fig = document.createElement('figure');
        fig.className = 'pf-fig';
        var frame;
        if (n.nodeName === 'A') { frame = n; frame.classList.add('pf-fig-frame'); }
        else { frame = document.createElement('span'); frame.className = 'pf-fig-frame'; frame.appendChild(n); }
        var img = frame.querySelector('img');
        if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
        img.loading = 'lazy'; img.decoding = 'async';
        fig.appendChild(frame);
        figs.push(fig); cur = fig;
        return;
      }
      if (n.nodeName === 'BR' || !cur || (n.nodeType === 3 && !n.textContent.trim())) return;
      var cap = cur.querySelector('figcaption');
      if (!cap) { cap = document.createElement('figcaption'); cur.appendChild(cap); }
      cap.appendChild(n);
    });
    box.innerHTML = '';
    figs.forEach(function (f) {
      box.appendChild(f);
      // A link in a caption gets an arrow that nudges right on hover, like the case study cards
      each('figcaption a[href]', function (a) { if (!a.querySelector('.pf-arrow')) a.insertAdjacentHTML('beforeend', arrow); }, f);
    });
  });

  /* Each type crops to a set shape (inline 16:9, wide 21:9 or 16:9 on phones, floats and trios
     4:3). If an image's own shape is more than 3% off, mark it so the CSS shows all of it. */
  var narrow = window.matchMedia ? window.matchMedia('(max-width: 40rem)') : null;
  function fitFigure(img) {
    var fig = img.closest('.pf-fig'), box = img.closest('.pf-figs');
    if (!fig || !box || !img.naturalWidth) return;
    var type = box.getAttribute('data-figs');
    var target = type === 'inline' ? 16 / 9
      : type === 'wide' ? (narrow && narrow.matches ? 16 / 9 : 21 / 9)
      : 4 / 3;
    var ratio = img.naturalWidth / img.naturalHeight;
    fig.classList.toggle('is-natural', Math.abs(ratio / target - 1) > 0.03);
  }
  function fitAll() { each('.pf-figs .pf-fig img', fitFigure); }
  each('.pf-figs .pf-fig img', function (img) {
    if (img.complete) fitFigure(img);
    img.addEventListener('load', function () { fitFigure(img); });
  });
  if (narrow && narrow.addEventListener) narrow.addEventListener('change', fitAll);
  var navItems = subnav ? Array.prototype.slice.call(subnav.querySelectorAll('.pf-sn-item')) : [];

  /* Next band: the section after this one in the sub-nav order (wraps to the first) */
  var next = document.querySelector('[data-next]');
  if (next && navItems.length) {
    var here = -1;
    navItems.forEach(function (a, i) { if (a.pathname === location.pathname) here = i; });
    if (here !== -1) {
      var nx = navItems[(here + 1) % navItems.length];
      var img = next.querySelector('img');
      next.href = nx.getAttribute('href');
      next.querySelector('.pf-title').textContent = nx.getAttribute('data-title');
      img.src = '/imgs/design/hero-' + nx.getAttribute('data-hero') + '-1440.jpg';
      img.srcset = heroSrcset(nx.getAttribute('data-hero'));
      img.sizes = '100vw';
      img.style.objectPosition = nx.getAttribute('data-position') || '50% 50%';
      next.hidden = false;
    }
  }

  /* Reveal on scroll */
  var io = ('IntersectionObserver' in window && !reduce) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 }) : null;
  function reveal(el) { if (io) io.observe(el); else el.classList.add('is-in'); }
  each('.pf-reveal', reveal);

  /* Case study cards: each link inside <design-cards> becomes a card, using the title,
     subtitle and thumbnail from posts.json. The first card on each page is the featured one
     (double width), whatever its categories say. The plain list stays if posts.json can't
     be read. */
  each('[data-design-cards]', function (box) {
    var links = Array.prototype.slice.call(box.querySelectorAll('a[href]'));
    if (!links.length || !window.fetch) return;
    fetch('/posts.json').then(function (r) { return r.json(); }).then(function (data) {
      var byUrl = {};
      (data.posts || []).forEach(function (p) { byUrl[p.url] = p; });
      var grid = document.createElement('div');
      grid.className = 'pf-card-grid';
      links.forEach(function (a, i) {
        var p = byUrl[a.pathname] || {};
        var featured = i === 0;
        var card = document.createElement('article');
        card.className = 'pf-card pf-reveal' + (featured ? ' is-featured' : '');
        var link = document.createElement('a');
        link.className = 'pf-card-link';
        link.href = a.getAttribute('href');
        var media = document.createElement('span');
        media.className = 'pf-card-media';
        if (p.thumbnail) {
          var im = document.createElement('img');
          im.src = p.thumbnail; im.alt = ''; im.loading = 'lazy';
          media.appendChild(im);
        }
        var body = document.createElement('span');
        body.className = 'pf-card-body';
        function line(cls, text) { var s = document.createElement('span'); s.className = cls; s.textContent = text; body.appendChild(s); }
        if (featured) line('pf-card-tag', 'Featured');
        line('pf-card-title', p.title || a.textContent);
        if (p.subtitle) line('pf-card-sub', p.subtitle);
        var more = document.createElement('span');
        more.className = 'pf-card-more';
        more.innerHTML = 'Read the case study ' + arrow;
        body.appendChild(more);
        link.appendChild(media); link.appendChild(body); card.appendChild(link);
        grid.appendChild(card);
      });
      box.innerHTML = '';
      box.appendChild(grid);
      each('.pf-reveal', reveal, grid);
    }).catch(function () {});
  });

  /* Parallax: images drift slower than the page; header images also follow the pointer */
  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
    var host = el.closest('[data-pointer]');
    return { el: el, img: el.querySelector('img'), host: host, tx: 0, ty: 0, x: 0, y: 0 };
  });
  layers.forEach(function (l) {
    if (!l.host || !canHover || reduce) return;
    l.host.addEventListener('mousemove', function (e) {
      var r = l.host.getBoundingClientRect();
      l.tx = ((e.clientX - r.left) / r.width - 0.5) * -24;
      l.ty = ((e.clientY - r.top) / r.height - 0.5) * -14;
      kick();
    });
    l.host.addEventListener('mouseleave', function () { l.tx = 0; l.ty = 0; kick(); });
  });

  function parallax() {
    var vh = window.innerHeight, moving = false;
    layers.forEach(function (l) {
      if (!l.img) return;
      var r = l.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var scrollY = clamp((r.top + r.height / 2 - vh / 2) * -0.1, -r.height * 0.065, r.height * 0.065);
      l.x += (l.tx - l.x) * 0.08;
      l.y += (l.ty - l.y) * 0.08;
      if (Math.abs(l.tx - l.x) > 0.05 || Math.abs(l.ty - l.y) > 0.05) moving = true;
      l.img.style.transform = 'translate3d(' + l.x.toFixed(2) + 'px,' + (scrollY + l.y).toFixed(2) + 'px,0)';
    });
    return moving;
  }

  /* Overview: sticky stage that wipes from one hero to the next */
  var stage = scrolly && scrolly.querySelector('.pf-stage');
  var stageLayers = scrolly ? Array.prototype.slice.call(scrolly.querySelectorAll('[data-layer]')) : [];
  var steps = stageLayers.length;
  if (scrolly) {
    scrolly.style.setProperty('--steps', steps);
    stageLayers.forEach(function (layer, i) {
      layer.setAttribute('data-layer', i);
      var im = layer.querySelector('img');
      if (im) im.setAttribute(i === 0 ? 'fetchpriority' : 'loading', i === 0 ? 'high' : 'lazy');
    });
  }
  function travel() { return scrolly.offsetHeight - stage.offsetHeight; }
  function stepTop(i) {
    var snh = subnav ? subnav.offsetHeight : 0;
    return scrolly.getBoundingClientRect().top + window.scrollY - snh + travel() * (i / Math.max(1, steps - 1));
  }
  // On the overview, the sub-nav shows progress through the story; its links still go to the pages
  var storyItems = scrolly ? navItems : [];
  var storyOn = !!scrolly && !reduce && steps > 1;
  // Keyboard: tabbing to a slide that isn't showing yet scrolls the story to it
  stageLayers.forEach(function (layer, i) {
    layer.addEventListener('focusin', function () {
      if (!storyOn || layer.classList.contains('is-current')) return;
      window.scrollTo({ top: stepTop(i), behavior: 'instant' });
      frame();
    });
  });
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function story() {
    if (!scrolly || reduce || steps < 2) return;
    var snh = subnav ? subnav.offsetHeight : 0;
    var r = scrolly.getBoundingClientRect();
    var p = clamp((snh - r.top) / travel(), 0, 1) * (steps - 1);
    var current = 0;
    stageLayers.forEach(function (layer, i) {
      if (i === 0) return;
      var t = clamp((p - (i - 1)) * 1.25, 0, 1);
      layer.style.setProperty('--t', ease(t).toFixed(4));
      if (t > 0.6) current = i;
    });
    stageLayers.forEach(function (layer, i) { layer.classList.toggle('is-current', i === current); });
    storyItems.forEach(function (a, i) {
      var fill = i === 0 ? 1 : clamp((p - (i - 1)) * 1.25, 0, 1);
      a.style.setProperty('--p', fill.toFixed(3));
      a.classList.toggle('is-current', i === current);
    });
    root.classList.toggle('pf-scrolled', p > 0.05);
  }

  var ticking = false;
  function frame() {
    ticking = false;
    var moving = reduce ? false : parallax();
    story();
    if (moving) kick();
  }
  function kick() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
  }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', function () { measure(); kick(); });
  frame();
  if (reduce || steps < 2) stageLayers.forEach(function (l) { l.classList.add('is-current'); });

  /* Keep the current section visible in the sub-nav on small screens */
  var cur = document.querySelector('.pf-sn-item[aria-current]');
  if (cur && cur.scrollIntoView && window.innerWidth < 640) cur.scrollIntoView({ block: 'nearest', inline: 'center' });

  measure();
}());
