(function () {
  var DEFAULT_API_URL = "https://adrian3.com/galleries/gallery-api.php";
  var requestCache = {};
  var modal = null;
  var activeImages = [];
  var activeIndex = 0;
  var lastFocus = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function encodeFolderParam(folder) {
    return encodeURIComponent(String(folder || ""));
  }

  function buildApiUrl(api, folder) {
    var endpoint = api || DEFAULT_API_URL;
    var separator = endpoint.indexOf("?") === -1 ? "?" : "&";
    return endpoint + separator + "folder=" + encodeFolderParam(folder);
  }

  function stripExtension(name) {
    return String(name || "").replace(/\.[^.]+$/, "");
  }

  function normalizeImage(item) {
    var name = item.name || item.fileName || item.title || item.label || "";
    var thumbUrl = item.thumbUrl || item.thumbnailUrl || item.thumb || item.url || "";
    var fullUrl = item.fullUrl || item.full || item.url || thumbUrl;
    var kind = item.kind || item.type || (fullUrl && /\.mov(\?|$)/i.test(fullUrl) ? "video" : "image");
    var label = item.alt || item.caption || item.title || stripExtension(name) || stripExtension((fullUrl.split("/").pop() || "")) || "Image";

    return {
      name: name,
      thumbUrl: thumbUrl,
      fullUrl: fullUrl,
      kind: kind,
      label: label,
      width: item.width || item.w || 0,
      height: item.height || item.h || 0,
    };
  }

  function normalizeResponse(payload) {
    var folder = payload && payload.folder ? payload.folder : payload;
    var images = folder && folder.images ? folder.images : [];
    return {
      title: (folder && (folder.title || folder.path)) || "",
      path: (folder && folder.path) || "",
      images: images.map(normalizeImage).filter(function (img) {
        return img.thumbUrl && img.fullUrl;
      }),
    };
  }

  function setStatus(root, message, isError) {
    var status = root.querySelector(".gallery-embed__status");
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.style.color = isError ? "var(--ade-primary)" : "";
  }

  function renderGalleryGrid(root, images) {
    var grid = root.querySelector(".gallery-embed__grid");
    if (!grid) return;

    grid.innerHTML = images.map(function (item, index) {
      var caption = escapeHtml(item.label);
      var thumb = escapeHtml(item.thumbUrl);
      var full = escapeHtml(item.fullUrl);
      var kindClass = item.kind === "video" ? " gallery-embed__item--video" : "";
      return [
        '<a class="gallery-embed__item' + kindClass + '" href="' + full + '" data-index="' + index + '" data-kind="' + escapeHtml(item.kind) + '">',
          '<figure class="gallery-embed__figure">',
            '<img loading="lazy" src="' + thumb + '" alt="' + caption + '">',
            '<figcaption class="gallery-embed__caption">' + caption + '</figcaption>',
          '</figure>',
        '</a>'
      ].join("");
    }).join("");

    grid.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest(".gallery-embed__item") : null;
      if (!link || !grid.contains(link)) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return;
      event.preventDefault();
      openModal(images, Number(link.getAttribute("data-index") || "0"));
    });
  }

  function loadGallery(root) {
    var folder = root.getAttribute("data-gallery-folder");
    if (!folder) {
      setStatus(root, "Gallery folder is missing.", true);
      return;
    }

    var api = root.getAttribute("data-gallery-api") || DEFAULT_API_URL;
    var url = buildApiUrl(api, folder);

    if (!requestCache[url]) {
      requestCache[url] = fetch(url, { credentials: "omit" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Gallery API returned " + response.status);
          }
          return response.json();
        });
    }

    requestCache[url]
      .then(function (payload) {
        var data = normalizeResponse(payload);
        if (!data.images.length) {
          setStatus(root, data.title ? data.title + " has no images." : "No images found.", true);
          return;
        }

        root.dataset.galleryTitle = data.title;
        renderGalleryGrid(root, data.images);
        var status = root.querySelector(".gallery-embed__status");
        if (status) status.hidden = true;
      })
      .catch(function (error) {
        setStatus(root, "Unable to load gallery.", true);
        console.error("[gallery]", error);
      });
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "gallery-modal";
    modal.hidden = true;
    modal.innerHTML = [
      '<div class="gallery-modal__backdrop" data-gallery-close></div>',
      '<div class="gallery-modal__dialog" role="dialog" aria-modal="true" aria-label="Image gallery">',
        '<button type="button" class="gallery-modal__prev" data-gallery-prev aria-label="Previous image">‹</button>',
        '<div class="gallery-modal__stage">',
          '<button type="button" class="gallery-modal__close" data-gallery-close aria-label="Close gallery">×</button>',
          '<div class="gallery-modal__media-wrap" data-gallery-media></div>',
          '<div class="gallery-modal__caption" data-gallery-caption></div>',
        '</div>',
        '<button type="button" class="gallery-modal__next" data-gallery-next aria-label="Next image">›</button>',
      '</div>',
    ].join("");

    modal.addEventListener("click", function (event) {
      var target = event.target;
      if (!target) return;
      if (target.hasAttribute("data-gallery-close")) {
        closeModal();
        return;
      }
      if (target.hasAttribute("data-gallery-prev")) {
        goTo(activeIndex - 1);
        return;
      }
      if (target.hasAttribute("data-gallery-next")) {
        goTo(activeIndex + 1);
      }
    });

    document.body.appendChild(modal);
    document.addEventListener("keydown", onKeydown);
    return modal;
  }

  function renderModalMedia(item) {
    var mediaWrap = modal.querySelector("[data-gallery-media]");
    var caption = modal.querySelector("[data-gallery-caption]");
    if (!mediaWrap || !caption) return;

    mediaWrap.innerHTML = "";

    if (item.kind === "video") {
      var video = document.createElement("video");
      video.className = "gallery-modal__media";
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = item.fullUrl;
      mediaWrap.appendChild(video);
    } else {
      var img = document.createElement("img");
      img.className = "gallery-modal__media";
      img.src = item.fullUrl;
      img.alt = item.label || "Gallery image";
      mediaWrap.appendChild(img);
    }

    caption.textContent = item.label || "";
    var prev = modal.querySelector("[data-gallery-prev]");
    var next = modal.querySelector("[data-gallery-next]");
    if (prev) prev.disabled = activeImages.length < 2;
    if (next) next.disabled = activeImages.length < 2;

    if (item.kind !== "video") {
      var prefetchNext = activeImages[(activeIndex + 1) % activeImages.length];
      if (prefetchNext && prefetchNext.kind !== "video") {
        var preload = new Image();
        preload.src = prefetchNext.fullUrl;
      }
    }
  }

  function goTo(index) {
    if (!activeImages.length) return;
    activeIndex = (index + activeImages.length) % activeImages.length;
    renderModalMedia(activeImages[activeIndex]);
  }

  function openModal(images, index) {
    activeImages = images.slice();
    activeIndex = Math.max(0, Math.min(index || 0, activeImages.length - 1));
    lastFocus = document.activeElement;
    ensureModal();
    renderModalMedia(activeImages[activeIndex]);
    modal.hidden = false;
    document.body.classList.add("gallery-modal-open");
    var closeButton = modal.querySelector(".gallery-modal__close");
    if (closeButton) closeButton.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("gallery-modal-open");
    var mediaWrap = modal.querySelector("[data-gallery-media]");
    if (mediaWrap) mediaWrap.innerHTML = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function onKeydown(event) {
    if (!modal || modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  }

  function init() {
    var roots = document.querySelectorAll(".gallery-embed[data-gallery-folder]");
    if (!roots.length) return;
    Array.prototype.forEach.call(roots, function (root) {
      loadGallery(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
