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

  function formatTagLabel(value) {
    var smallWords = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to"];
    var acronyms = {
      ai: "AI",
      api: "API",
      it: "IT",
      rv: "RV",
      ui: "UI",
      ux: "UX"
    };
    var words = String(value || "").split(" ");

    return words.map(function (word, index) {
      var lowerWord = word.toLowerCase();
      if (acronyms[lowerWord]) return acronyms[lowerWord];
      if (index > 0 && smallWords.indexOf(lowerWord) !== -1) return lowerWord;
      return word.replace(/[A-Za-z]+/g, function (part) {
        var lowerPart = part.toLowerCase();
        if (acronyms[lowerPart]) return acronyms[lowerPart];
        return lowerPart.charAt(0).toUpperCase() + lowerPart.slice(1);
      });
    }).join(" ");
  }

  function getValidTag(value, allTags, fallbackTag) {
    var requestedTag = String(value || "").trim().toLowerCase();
    if (!requestedTag) return fallbackTag;
    if (requestedTag === "all") return "all";
    return allTags.find(function (tag) {
      return tag.toLowerCase() === requestedTag;
    }) || fallbackTag;
  }

  function getUrlTag(allTags, fallbackTag) {
    var params = new URLSearchParams(window.location.search);
    return getValidTag(params.get("category"), allTags, fallbackTag);
  }

  function updateUrlTag(tag) {
    if (!window.history || !window.history.pushState) return;
    var url = new URL(window.location.href);
    if (!tag || tag === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", tag);
    }
    if (url.href !== window.location.href) {
      window.history.pushState({ caseStudyTag: tag }, "", url.href);
    }
  }

  function normalizePost(post) {
    return {
      title: post.title || "",
      url: post.url || "",
      template: post.template || "",
      description: post.description || "",
      subtitle: post.subtitle || "",
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
    var summary = post.description
      ? '<p class="case-study-card-summary">' + escapeHtml(post.description) + "</p>"
      : "";

    var subtitle = post.subtitle
      ? '<p class="case-study-card-subtitle">' + escapeHtml(post.subtitle) + "</p>"
      : "";

    var image = post.thumbnail
      ? '<a class="case-study-card-media" href="' + escapeHtml(post.url) + '"><img class="case-study-card-image" src="' + escapeHtml(post.thumbnail) + '" alt="' + escapeHtml(post.thumbnailAlt) + '"></a>'
      : "";

    return [
      '<article class="case-study-card" data-tags="' + escapeHtml(post.categories.join("|")) + '">',
      image,
      '<div class="case-study-card-body">',
      '<h3 class="case-study-card-title"><a href="' + escapeHtml(post.url) + '">' + escapeHtml(post.title) + "</a></h3>",
      subtitle,
      summary,
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
    statusEl.textContent = "Showing " + filteredCount + " of " + totalCount + ' case studies tagged "' + formatTagLabel(activeTag) + '".';
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

        var allTags = [];
        posts.forEach(function (post) {
          post.categories.forEach(function (tag) {
            if (allTags.indexOf(tag) === -1) allTags.push(tag);
          });
        });
        allTags.sort(function (a, b) { return a.localeCompare(b); });
        if (allTags.indexOf("featured") !== -1) {
          allTags.splice(allTags.indexOf("featured"), 1);
          allTags.unshift("featured");
        }
        var defaultTag = allTags[0] === "featured" ? "featured" : "all";
        var activeTag = getUrlTag(allTags, defaultTag);

        function renderFilters() {
          if (!filterEl) return;
          var buttons = [];
          allTags.forEach(function (tag) {
            var isActive = tag === activeTag;
            buttons.push('<button type="button" class="case-study-filter-chip' + (isActive ? " is-active" : "") + '" data-filter="' + escapeHtml(tag) + '" aria-pressed="' + (isActive ? "true" : "false") + '">' + escapeHtml(formatTagLabel(tag)) + "</button>");
          });
          buttons.push('<button type="button" class="case-study-filter-chip' + (activeTag === "all" ? " is-active" : "") + '" data-filter="all" aria-pressed="' + (activeTag === "all" ? "true" : "false") + '">All</button>');
          filterEl.innerHTML = buttons.join("");
        }

        function syncFilterButtons() {
          if (!filterEl) return;
          Array.from(filterEl.querySelectorAll("[data-filter]")).forEach(function (node) {
            var isActive = node.getAttribute("data-filter") === activeTag;
            node.classList.toggle("is-active", isActive);
            node.setAttribute("aria-pressed", isActive ? "true" : "false");
          });
        }

        function renderGrid() {
          var filtered = posts.filter(function (post) {
            return activeTag === "all" || post.categories.indexOf(activeTag) !== -1;
          });
          listEl.innerHTML = filtered.map(renderCard).join("");
          updateStatus(statusEl, filtered.length, posts.length, activeTag);
        }

        function setActiveTag(tag, shouldUpdateUrl) {
          activeTag = getValidTag(tag, allTags, defaultTag);
          syncFilterButtons();
          renderGrid();
          if (shouldUpdateUrl) updateUrlTag(activeTag);
        }

        renderFilters();
        renderGrid();

        if (filterEl) {
          filterEl.addEventListener("click", function (event) {
            var button = event.target.closest("[data-filter]");
            if (!button) return;
            setActiveTag(button.getAttribute("data-filter") || "all", true);
          });
        }

        window.addEventListener("popstate", function () {
          setActiveTag(getUrlTag(allTags, defaultTag), false);
        });
      })
      .catch(function () {
        if (statusEl) statusEl.textContent = "Unable to load case studies.";
      });
  }

  document.addEventListener("DOMContentLoaded", initCaseStudies);
}());
