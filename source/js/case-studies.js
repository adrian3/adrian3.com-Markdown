(function () {
  function splitCategories(value) {
    return String(value || "")
      .split(",")
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('\"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizePost(post) {
    return {
      title: post.title || "",
      url: post.url || "",
      template: post.template || "",
      description: post.description || "",
      thumbnail: post.thumbnail || "",
      thumbnailAlt: post.thumbnailAlt || post.title || "",
      categories: splitCategories(post.categories),
      unlisted: post.unlisted === true,
    };
  }

  function sortPosts(posts) {
    return posts.slice().sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  function renderCard(post) {
    var tags = post.categories.map(function (tag) {
      return '<span class="case-study-card-tag">' + escapeHtml(tag) + "</span>";
    }).join("");

    var summary = post.description
      ? '<p class="case-study-card-summary">' + escapeHtml(post.description) + "</p>"
      : "";

    var image = post.thumbnail
      ? '<a class="case-study-card-media" href="' + escapeHtml(post.url) + '"><img class="case-study-card-image" src="' + escapeHtml(post.thumbnail) + '" alt="' + escapeHtml(post.thumbnailAlt) + '"></a>'
      : "";

    return [
      '<article class="case-study-card" data-tags="' + escapeHtml(post.categories.join("|")) + '">',
      image,
      '<div class="case-study-card-body">',
      '<h3 class="case-study-card-title"><a href="' + escapeHtml(post.url) + '">' + escapeHtml(post.title) + "</a></h3>",
      summary,
      tags ? '<div class="case-study-card-tags">' + tags + "</div>" : "",
      "</div>",
      "</article>"
    ].join("");
  }

  function updateStatus(statusEl, filteredCount, totalCount, activeTag) {
    if (!statusEl) return;
    if (!totalCount) {
      statusEl.textContent = "No case studies found.";
      return;
    }
    if (!activeTag || activeTag === "all") {
      statusEl.textContent = "Showing all " + totalCount + " case studies.";
      return;
    }
    statusEl.textContent = "Showing " + filteredCount + " of " + totalCount + ' case studies tagged "' + activeTag + '".';
  }

  function initCaseStudies() {
    var gridShell = document.querySelector("[data-case-study-grid]");
    if (!gridShell) return;

    var listEl = gridShell.querySelector("[data-case-study-list]");
    var statusEl = gridShell.querySelector("[data-case-study-status]");
    var filterEl = document.querySelector("[data-case-study-filters]");
    var source = gridShell.getAttribute("data-source") || "/posts.json";
    var pathPrefix = gridShell.getAttribute("data-path-prefix") || "/case-studies/";

    fetch(source)
      .then(function (response) { return response.json(); })
      .then(function (payload) {
        var posts = sortPosts((payload.posts || []).map(normalizePost).filter(function (post) {
          return post.url.indexOf(pathPrefix) === 0 && post.template === "case-study";
        }));

        var activeTag = "all";
        var allTags = [];
        posts.forEach(function (post) {
          post.categories.forEach(function (tag) {
            if (allTags.indexOf(tag) === -1) allTags.push(tag);
          });
        });
        allTags.sort(function (a, b) { return a.localeCompare(b); });

        function renderFilters() {
          if (!filterEl) return;
          var buttons = ['<button type="button" class="case-study-filter-chip is-active" data-filter="all" aria-pressed="true">All</button>'];
          allTags.forEach(function (tag) {
            buttons.push('<button type="button" class="case-study-filter-chip" data-filter="' + escapeHtml(tag) + '" aria-pressed="false">' + escapeHtml(tag) + "</button>");
          });
          filterEl.innerHTML = buttons.join("");
        }

        function renderGrid() {
          var filtered = posts.filter(function (post) {
            return activeTag === "all" || post.categories.indexOf(activeTag) !== -1;
          });
          listEl.innerHTML = filtered.map(renderCard).join("");
          updateStatus(statusEl, filtered.length, posts.length, activeTag);
        }

        renderFilters();
        renderGrid();

        if (filterEl) {
          filterEl.addEventListener("click", function (event) {
            var button = event.target.closest("[data-filter]");
            if (!button) return;
            activeTag = button.getAttribute("data-filter") || "all";
            Array.from(filterEl.querySelectorAll("[data-filter]")).forEach(function (node) {
              var isActive = node === button;
              node.classList.toggle("is-active", isActive);
              node.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
            renderGrid();
          });
        }
      })
      .catch(function () {
        if (statusEl) statusEl.textContent = "Unable to load case studies.";
      });
  }

  document.addEventListener("DOMContentLoaded", initCaseStudies);
}());
