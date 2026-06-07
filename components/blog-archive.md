<!---
component: true
component-name: blog-archive
raw: true
class: blog-archive
--->
<div id="blog-archive-filters" class="blog-archive-filters"></div>
<div id="blog-archive-list"></div>
<script>
(function () {
  fetch('/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var posts = (data.posts || [])
        .filter(function (p) { return p.url.indexOf('/blog/') === 0 && p.title && !p.unlisted; })
        .sort(function (a, b) {
          return new Date(b.date || 0) - new Date(a.date || 0);
        });

      if (!posts.length) {
        document.getElementById('blog-archive-list').innerHTML = '<p>No posts found.</p>';
        return;
      }

      // Build unique category set
      var cats = {};
      posts.forEach(function (p) {
        if (!p.categories) return;
        p.categories.split(',').forEach(function (c) {
          var t = c.trim();
          if (t) cats[t] = (cats[t] || 0) + 1;
        });
      });

      // Render filter buttons
      var filterEl = document.getElementById('blog-archive-filters');
      var allCats = Object.keys(cats).sort();
      filterEl.innerHTML = '<button class="blog-filter-btn active" data-cat="">All (' + posts.length + ')</button>'
        + allCats.map(function (c) {
          return '<button class="blog-filter-btn" data-cat="' + c + '">' + c + ' (' + cats[c] + ')</button>';
        }).join('');

      filterEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.blog-filter-btn');
        if (!btn) return;
        filterEl.querySelectorAll('.blog-filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(btn.dataset.cat);
      });

      // Group posts by year
      var byYear = {};
      posts.forEach(function (p) {
        var yr = p.date ? new Date(p.date).getFullYear() : 'Undated';
        if (!byYear[yr]) byYear[yr] = [];
        byYear[yr].push(p);
      });

      var listEl = document.getElementById('blog-archive-list');
      var html = '';
      Object.keys(byYear).sort(function (a, b) { return b - a; }).forEach(function (yr) {
        html += '<section class="blog-archive-year" data-year="' + yr + '">';
        html += '<h3 class="blog-archive-year-heading">' + yr + '</h3><ul>';
        byYear[yr].forEach(function (p) {
          var cats = p.categories || '';
          html += '<li class="blog-archive-item" data-categories="' + cats + '">'
            + '<a href="' + p.url + '">' + p.title + '</a>'
            + (p.date ? '<span class="blog-archive-date">' + p.date + '</span>' : '')
            + (p.description ? '<span class="blog-archive-desc">' + p.description + '</span>' : '')
            + '</li>';
        });
        html += '</ul></section>';
      });
      listEl.innerHTML = html;

      function applyFilter(cat) {
        document.querySelectorAll('.blog-archive-item').forEach(function (item) {
          var c = item.dataset.categories || '';
          item.style.display = (!cat || c.indexOf(cat) !== -1) ? '' : 'none';
        });
        document.querySelectorAll('.blog-archive-year').forEach(function (yr) {
          var visible = Array.from(yr.querySelectorAll('.blog-archive-item'))
            .some(function (i) { return i.style.display !== 'none'; });
          yr.style.display = visible ? '' : 'none';
        });
      }
    })
    .catch(function () {
      document.getElementById('blog-archive-list').innerHTML = '<p>Unable to load archive.</p>';
    });
}());
</script>
