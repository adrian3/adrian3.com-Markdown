<!---
component: true
component-name: blog-recent
raw: true
class: blog-recent
--->
<ul id="blog-recent-list"><li class="blog-loading">Loading posts…</li></ul>
<script>
(function () {
  var COUNT = 5;
  fetch('/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var posts = (data.posts || [])
        .filter(function (p) { return p.url.indexOf('/blog/') === 0 && p.title && !p.unlisted; })
        .sort(function (a, b) {
          return new Date(b.date || 0) - new Date(a.date || 0);
        })
        .slice(0, COUNT);
      var el = document.getElementById('blog-recent-list');
      if (!posts.length) { el.innerHTML = '<li>No posts found.</li>'; return; }
      el.innerHTML = posts.map(function (p) {
        return '<li>'
          + '<a href="' + p.url + '" class="blog-recent-title">' + p.title + '</a>'
          + (p.date ? '<span class="blog-recent-date">' + p.date + '</span>' : '')
          + (p.description ? '<span class="blog-recent-desc">' + p.description + '</span>' : '')
          + '</li>';
      }).join('');
    })
    .catch(function () {
      document.getElementById('blog-recent-list').innerHTML = '<li>Unable to load posts.</li>';
    });
}());
</script>
