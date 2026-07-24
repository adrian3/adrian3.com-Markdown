(function () {
  function normalizePath(path) {
    return path.replace(/\/index\.html$/, "/").replace(/\/$/, "/");
  }

  function sectionRoot(path) {
    var normalized = normalizePath(path);
    var parts = normalized.split("/").filter(Boolean);
    return parts.length ? "/" + parts[0] + "/" : "/";
  }

  var current = normalizePath(window.location.pathname);
  var currentSection = sectionRoot(current);

  document.querySelectorAll('.nav a').forEach(function (a) {
    var linkPath = normalizePath(a.pathname);
    var linkSection = sectionRoot(linkPath);
    var isHome = linkPath === "/";
    var isActive = isHome ? current === "/" : linkSection === currentSection;

    if (isActive) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}());
