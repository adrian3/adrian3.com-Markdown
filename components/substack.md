<!---
component: true
component-name: substack
raw: true
class: substack
--->
<ul class="substack-list" id="substack-list">
  <li class="substack-loading">Loading recent posts…</li>
</ul>
<script>
(function () {
  fetch('https://adrian3.com/api/substack.php')
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      var ul = document.getElementById('substack-list');
      if (!posts.length) { ul.innerHTML = '<li>No posts found.</li>'; return; }
      ul.innerHTML = posts.map(function (p) {
        var date = p.date ? new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';
        var img = p.image ? '<img src="' + p.image + '" alt="" class="substack-thumb">' : '';
        var desc = p.description ? '<span class="substack-desc">' + p.description + '</span>' : '';
        return '<li>'
          + (img ? '<a href="' + p.link + '" target="_blank" rel="noreferrer" class="substack-thumb-link">' + img + '</a>' : '')
          + '<div class="substack-body">'
          + '<a href="' + p.link + '" target="_blank" rel="noreferrer" class="substack-title">' + p.title + '</a>'
          + desc
          + (date ? '<span class="substack-date">' + date + '</span>' : '')
          + '</div>'
          + '</li>';
      }).join('');
    })
    .catch(function () {
      document.getElementById('substack-list').innerHTML = '<li>Unable to load recent posts.</li>';
    });
}());
</script>
