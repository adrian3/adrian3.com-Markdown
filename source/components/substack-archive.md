<!---
component: true
component-name: substack-archive
raw: true
class: substack-archive
--->
<div id="substack-archive"><p class="substack-loading">Loading archive…</p></div>
<script>
(function () {
  fetch('https://adrian3.com/api/substack-archive.php')
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      var container = document.getElementById('substack-archive');
      if (!posts.length) { container.innerHTML = '<p>No posts found.</p>'; return; }

      // Group by year
      var byYear = {};
      posts.forEach(function (p) {
        var year = p.date ? new Date(p.date).getFullYear() : 'Unknown';
        if (!byYear[year]) byYear[year] = [];
        byYear[year].push(p);
      });

      var html = '';
      Object.keys(byYear).sort(function (a, b) { return b - a; }).forEach(function (year) {
        html += '<section class="substack-year">';
        html += '<h3 class="substack-year-heading">' + year + ' <span class="substack-year-count">' + byYear[year].length + '</span></h3>';
        html += '<ul>';
        byYear[year].forEach(function (p) {
          var d = p.date ? new Date(p.date) : null;
          var dateStr = d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          var paid = p.audience === 'only_paid';
          html += '<li class="' + (paid ? 'substack-paid' : '') + '">'
            + '<span class="substack-archive-date">' + dateStr + '</span>'
            + '<div class="substack-archive-body">'
            + '<a href="' + p.url + '" target="_blank" rel="noreferrer">' + p.title + '</a>'
            + (p.subtitle ? '<span class="substack-archive-subtitle">' + p.subtitle + '</span>' : '')
            + '</div>'
            + (paid ? '<span class="substack-archive-badge">Subscribers</span>' : '')
            + '</li>';
        });
        html += '</ul></section>';
      });

      container.innerHTML = html;
    })
    .catch(function () {
      document.getElementById('substack-archive').innerHTML = '<p>Unable to load archive.</p>';
    });
}());
</script>
