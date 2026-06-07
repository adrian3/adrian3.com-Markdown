(function () {
  var current = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.pathname === current) {
      a.setAttribute('aria-current', 'page');
    }
  });
}());
