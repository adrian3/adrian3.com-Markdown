const viewport = document.querySelector('.scene');
const status = document.querySelector('[role="status"]');
const toggle = document.querySelector('.motion-toggle');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let playing = !motionPreference.matches;
let visible = false;
let player;
let loading = false;
let failed = false;
let frame;
let elapsed = 0;
let previous = 0;

function tick(now) {
  // 30 fps is enough for this slow pivot and halves the rendering work.
  if (now - previous >= 1000 / 30) {
    elapsed += Math.min(now - previous, 100);
    previous = now;
    player.render(elapsed);
  }
  frame = requestAnimationFrame(tick);
}

async function sync() {
  cancelAnimationFrame(frame);
  if (toggle) {
    toggle.hidden = !player || failed || motionPreference.matches;
    toggle.textContent = playing ? 'Pause animation' : 'Play animation';
  }
  viewport.dataset.state = playing ? 'idle' : 'paused';
  if (!playing || !visible || document.hidden || failed) return;
  if (!player) {
    if (loading) return;
    loading = true;
    try {
      const { createPlayer } = await import('./player.js');
      player = await createPlayer(viewport, new URL('demo.json', document.baseURI));
      elapsed = player.initialTime;
      viewport.dataset.ready = '';
      player.canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        showPoster();
      });
    } catch (error) {
      console.warn('Animation unavailable; showing its still image.', error);
      showPoster();
    } finally {
      loading = false;
    }
    return sync();
  }
  viewport.dataset.state = 'playing';
  previous = performance.now();
  frame = requestAnimationFrame(tick);
}

function showPoster() {
  failed = true;
  playing = false;
  cancelAnimationFrame(frame);
  delete viewport.dataset.ready;
  viewport.dataset.state = 'paused';
  status.textContent = 'Still image shown. Animation is unavailable.';
  if (toggle) toggle.hidden = true;
  player?.dispose();
}

toggle?.addEventListener('click', () => {
  playing = !playing;
  sync();
});

motionPreference.addEventListener('change', event => {
  playing = !event.matches;
  if (player) {
    if (event.matches) delete viewport.dataset.ready;
    else viewport.dataset.ready = '';
  }
  sync();
});
document.addEventListener('visibilitychange', sync);
new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  sync();
}).observe(viewport);
// Reduced motion uses the poster without downloading Three.js or creating WebGL.
