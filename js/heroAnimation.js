(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 3;

  const geometry = new THREE.BufferGeometry();
  const count = 1800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 4;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ size: 0.018, color: 0x2563eb });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    scrollVelocity = Math.min(delta * 0.002, 0.04);
    lastScrollY = window.scrollY;
  });

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (w === 0 || h === 0) return; // espera a que el layout esté listo
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);

  window.addEventListener("resize", resize);
  // Espera al paint completo antes del primer resize
  window.addEventListener("load", () => setTimeout(resize, 50));
  resize();

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.001 + scrollVelocity;
    points.rotation.x += 0.0005 + scrollVelocity * 0.3;
    scrollVelocity *= 0.92;
    renderer.render(scene, camera);
  }
  animate();

  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    material.color.set(isDark ? 0x60a5fa : 0x2563eb);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();