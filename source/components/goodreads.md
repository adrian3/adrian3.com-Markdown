<!---
component: true
component-name: goodreads
raw: true
class: goodreads
--->
<ul id="goodreads-shelf">
  <li class="goodreads-loading">Loading reading list…</li>
</ul>
<script>
(function () {
  fetch('https://adrian3.com/api/goodreads.php?shelf=read&per_page=200')
    .then(function (r) { return r.json(); })
    .then(function (books) {
      var shelf = document.getElementById('goodreads-shelf');
      if (!books || !books.length) {
        shelf.innerHTML = '<li>No books found.</li>';
        return;
      }
      shelf.innerHTML = books.map(function (b) {
        var rating = parseInt(b.rating, 10);
        var stars  = rating > 0 ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';
        return '<li>'
          + (b.image
              ? '<a href="' + b.link + '" target="_blank" rel="noreferrer" class="goodreads-thumb-link">'
                + '<img src="' + b.image + '" alt="' + b.title + '" class="goodreads-cover">'
                + '</a>'
              : '')
          + '<div class="goodreads-meta">'
          + '<a href="' + b.link + '" target="_blank" rel="noreferrer" class="goodreads-title">' + b.title + '</a>'
          + (b.author ? '<span class="goodreads-author">by ' + b.author + '</span>' : '')
          + (stars    ? '<span class="goodreads-stars">'  + stars        + '</span>' : '')
          + (b.date   ? '<span class="goodreads-date">'   + b.date       + '</span>' : '')
          + '</div>'
          + '</li>';
      }).join('');
    })
    .catch(function () {
      document.getElementById('goodreads-shelf').innerHTML = '<li>Unable to load reading list.</li>';
    });
}());
</script>
