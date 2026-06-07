<!---
component: true
component-name: timeline-script
raw: true
--->
<script>
(function () {
  // Add cssanimations class — modern browsers all support CSS animations
  document.documentElement.classList.add('cssanimations');

  // Intersection Observer replaces jQuery scroll detection
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var block = entry.target;
      block.querySelectorAll('.cd-timeline-img, .cd-timeline-content').forEach(function (el) {
        el.classList.remove('is-hidden');
        el.classList.add('bounce-in');
      });
      observer.unobserve(block);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.cd-timeline-block').forEach(function (block) {
    block.querySelectorAll('.cd-timeline-img, .cd-timeline-content').forEach(function (el) {
      el.classList.add('is-hidden');
    });
    observer.observe(block);
  });

  // Read more / read less accordion
  document.querySelectorAll('.readMore').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var container = btn.previousElementSibling;
      var expanded = btn.textContent.trim() === 'Read less';
      btn.textContent = expanded ? 'Read more' : 'Read less';
      if (container) container.style.display = expanded ? 'none' : 'block';
    });
  });
}());
</script>
