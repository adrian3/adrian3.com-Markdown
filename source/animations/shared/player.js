// Standalone extraction of dynamic-screenshot-generator's Dashboard demo.
import * as THREE from './vendor/three/three.module.js';
import { OrbitControls } from './vendor/three/OrbitControls.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';
import { createLaptop, SCREEN_WIDTH } from './laptop.js';

export async function createPlayer(viewport, configURL) {
  const response = await fetch(configURL);
  if (!response.ok) throw new Error('Could not load animation settings.');
  const settings = await response.json();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = settings.canvas.shadows;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  viewport.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(settings.scene.perspective, 1, .05, 60);
  const target = new THREE.Vector3(0, 1.05, .05);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enablePan = false;
  controls.enableZoom = false; // Leave wheel scrolling to the case-study page.
  controls.enableDamping = false;
  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  controls.minPolarAngle = THREE.MathUtils.degToRad(20);
  controls.maxPolarAngle = Math.PI / 2;
  renderer.domElement.style.touchAction = 'pan-y';
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .04);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = .9;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#ffffff', '#bbc7d0', 1.4));

  const keyLight = new THREE.DirectionalLight('#fff7ed', 3.4);
  keyLight.position.set(-3.5, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.radius = 18;
  keyLight.shadow.blurSamples = 16;
  Object.assign(keyLight.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .1, far: 20 });
  keyLight.shadow.bias = -.0003;
  keyLight.shadow.normalBias = .01;
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight('#dcecff', 2);
  fillLight.position.set(5, 3, 1);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight('#ffffff', 2);
  rimLight.position.set(1, 5, -5);
  scene.add(rimLight);

  const laptop = createLaptop();
  laptop.update(settings.laptop);
  scene.add(laptop.group);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .14 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -.015;
  ground.receiveShadow = true;
  ground.visible = settings.canvas.shadows;
  scene.add(ground);
  const grid = new THREE.GridHelper(16, 64, '#a8bbc0', '#d9e2e5');
  grid.position.y = -.012;
  grid.material.transparent = true;
  grid.material.opacity = .26;
  grid.material.depthWrite = false;
  grid.visible = settings.canvas.grid;
  scene.add(grid);
  const shade = Math.round(255 - settings.canvas.background * 2.55);
  viewport.style.background = `rgb(${shade}, ${shade}, ${shade})`;

  let elapsed = settings.animation.time || 0;
  let phaseStart = 0;
  let interacting = false;
  let applyingCamera = false;
  let resizeObserver;

  function readCamera() {
    const offset = camera.position.clone().sub(target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    settings.scene.rotateX = THREE.MathUtils.clamp(90 - THREE.MathUtils.radToDeg(spherical.phi), 0, 70);
    settings.scene.rotateY = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(spherical.theta), -90, 90);
    settings.scene.scale = 8 * Math.max(1, 1 / camera.aspect) / spherical.radius;
  }

  function render(time = elapsed) {
    elapsed = time;
    if (!interacting) {
      const motion = settings.animation;
      const wave = Math.sin((time - phaseStart) / motion.speed * Math.PI * 2) * motion.angle;
      const elevation = THREE.MathUtils.clamp(settings.scene.rotateX + (motion.axis === 'x' ? wave : 0), 0, 70);
      const yaw = THREE.MathUtils.clamp(settings.scene.rotateY + (motion.axis === 'y' ? wave : 0), -90, 90);
      const distance = 8 / settings.scene.scale * Math.max(1, 1 / camera.aspect);
      camera.position.setFromSpherical(new THREE.Spherical(
        distance, THREE.MathUtils.degToRad(90 - elevation), THREE.MathUtils.degToRad(yaw)
      )).add(target);
      applyingCamera = true;
      controls.update();
      applyingCamera = false;
      camera.rotateZ(THREE.MathUtils.degToRad(settings.scene.rotateZ + (motion.axis === 'z' ? wave : 0)));
    }
    renderer.render(scene, camera);
  }

  controls.addEventListener('start', () => {
    interacting = true;
    readCamera();
    viewport.classList.add('is-dragging');
  });
  controls.addEventListener('change', () => {
    if (applyingCamera) return;
    camera.rotateZ(THREE.MathUtils.degToRad(settings.scene.rotateZ));
    readCamera();
    renderer.render(scene, camera);
  });
  controls.addEventListener('end', () => {
    readCamera();
    interacting = false;
    phaseStart = elapsed;
    viewport.classList.remove('is-dragging');
    render();
  });

  function resize() {
    const { width, height } = viewport.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, settings.canvas.highQuality ? 2 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  }

  function dispose() {
    resizeObserver?.disconnect();
    controls.dispose();
    const geometries = new Set(), materials = new Set(), textures = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of [object.material].flat().filter(Boolean)) {
        materials.add(material);
        if (material.map) textures.add(material.map);
      }
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    textures.forEach(texture => texture.dispose());
    environmentTarget.dispose();
    keyLight.shadow.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  try {
    // Rasterize the tiny SVGs once, rather than rebuilding textures each frame.
    // Sequential loading also makes partial failures straightforward to dispose.
    for (const [index, layer] of Object.values(settings.layers).entries()) {
      const image = new Image();
      image.src = new URL(layer.file, configURL).href;
      await image.decode();
      const scale = Math.min(1, Math.min(1920, renderer.capabilities.maxTextureSize) / image.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const material = new THREE.MeshBasicMaterial({
        map: texture, transparent: true, depthWrite: false, alphaTest: .005,
        side: THREE.FrontSide, toneMapped: false, opacity: layer.opacity / 100
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_WIDTH * image.naturalHeight / image.naturalWidth), material);
      mesh.renderOrder = index + 2;
      mesh.position.set(layer.x, layer.y, .003 + index * .0005 + layer.z * settings.animation.depth);
      mesh.rotation.set(...[layer.rotateX, layer.rotateY, layer.rotateZ].map(THREE.MathUtils.degToRad));
      mesh.scale.setScalar(layer.scale);
      laptop.screenAnchor.add(mesh);
    }
    renderer.shadowMap.needsUpdate = settings.canvas.shadows;
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    return { render, dispose, canvas: renderer.domElement, initialTime: elapsed };
  } catch (error) {
    dispose();
    throw error;
  }
}
