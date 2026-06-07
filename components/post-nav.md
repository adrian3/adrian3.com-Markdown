<!---
component: true
component-name: post-nav
raw: true
class: post-nav reading-column
--->
<nav class="post-nav-inner" id="post-nav-inner">
  <a href="/writing.html" class="post-nav-all">All writing</a>
</nav>
<script>
(function () {
  fetch('/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var current = window.location.pathname.replace(/\/$/, '');

      var posts = (data.posts || [])
        .filter(function (p) { return p.url.indexOf('/blog/') === 0 && p.title && p.date && !p.unlisted; })
        .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

      var idx = posts.findIndex(function (p) {
        return p.url === current || p.url.replace(/\.html$/, '') === current;
      });

      if (idx === -1) return; // not a blog post — keep default All writing link

      var prev = idx > 0             ? posts[idx - 1] : null;
      var next = idx < posts.length - 1 ? posts[idx + 1] : null;

      var nav = document.getElementById('post-nav-inner');
      nav.innerHTML =
        (prev
          ? '<a href="' + prev.url + '" class="post-nav-prev">← ' + prev.title + '</a>'
          : '<span class="post-nav-placeholder"></span>')
        + '<a href="/writing.html" class="post-nav-all">All writing</a>'
        + (next
          ? '<a href="' + next.url + '" class="post-nav-next">' + next.title + ' →</a>'
          : '<span class="post-nav-placeholder"></span>');
    })
    .catch(function () { /* keep default link on error */ });
}());
</script>
