<!---
component: true
component-name: gallery-loader-panel
raw: true
--->
<h1 id="gallery-loader-title">Gallery Loader</h1>

<p id="gallery-loader-path">Add a <code>?folder=</code> value to this page URL to load a gallery.</p>

<div id="gallery-loader-embed" class="gallery-embed" data-gallery-api="https://adrian3.com/galleries/gallery-api.php" hidden>
  <div class="gallery-embed__status" role="status" aria-live="polite">Loading gallery...</div>
  <div class="gallery-embed__grid" aria-live="polite"></div>
  <noscript>
    <p class="gallery-embed__noscript">This gallery needs JavaScript to load its images.</p>
  </noscript>
</div>

<script>
(function () {
  var title = document.getElementById("gallery-loader-title");
  var pathNote = document.getElementById("gallery-loader-path");
  var embed = document.getElementById("gallery-loader-embed");
  if (!title || !pathNote || !embed) return;

  var params = new URLSearchParams(window.location.search);
  var folder = (params.get("folder") || "").trim();

  folder = folder.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!folder) {
    title.textContent = "Gallery Loader";
    pathNote.innerHTML = 'Add a <code>?folder=</code> value to this page URL to load a gallery. Example: <code>?folder=postcards%2Fcamera</code>';
    return;
  }

  var label = folder
    .split("/")
    .filter(Boolean)
    .map(function (part) {
      return part
        .split(/[\s-]+/)
        .filter(Boolean)
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    })
    .join(" / ");

  title.textContent = label;
  pathNote.innerHTML = "Folder: <code>" +
    folder
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;") +
    "</code>";
  document.title = label + " — Adrian Hanft";
  embed.setAttribute("data-gallery-folder", folder);
  embed.hidden = false;
}());
</script>
