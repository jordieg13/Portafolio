(function () {
  const container = document.getElementById("rubikContainer");
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "rubikCanvas";
  canvas.style.cssText = "cursor:grab; touch-action:none;";
  container.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(4, 4, 6);
  camera.lookAt(0, 0, 0);

  const COLORS = {
    R: 0x009B48, L: 0x0045AD, U: 0xFFFFFF,
    D: 0xFFD500, F: 0xB71234, B: 0xFF5800, X: 0x111111
  };
  const GAP = 1.05;
  const rubikGroup = new THREE.Group();

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        const mats = [
          new THREE.MeshLambertMaterial({ color: x ===  1 ? COLORS.R : COLORS.X }),
          new THREE.MeshLambertMaterial({ color: x === -1 ? COLORS.L : COLORS.X }),
          new THREE.MeshLambertMaterial({ color: y ===  1 ? COLORS.U : COLORS.X }),
          new THREE.MeshLambertMaterial({ color: y === -1 ? COLORS.D : COLORS.X }),
          new THREE.MeshLambertMaterial({ color: z ===  1 ? COLORS.F : COLORS.X }),
          new THREE.MeshLambertMaterial({ color: z === -1 ? COLORS.B : COLORS.X }),
        ];
        const mesh = new THREE.Mesh(geo, mats);
        mesh.position.set(x * GAP, y * GAP, z * GAP);
        rubikGroup.add(mesh);
      }
    }
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(5, 10, 7);
  scene.add(dl);
  scene.add(rubikGroup);

  let rotX = 0.4, rotY = 0.5;
  let dragging = false, hovering = false;
  let lx = 0, ly = 0, vx = 0, vy = 0;
  let scrollVel = 0, lastScrollY = window.scrollY;

  // Pointer events — setPointerCapture evita que el drag se rompa
  // si el ratón sale del canvas mientras se arrastra
  canvas.addEventListener("pointerdown", e => {
    canvas.setPointerCapture(e.pointerId);
    dragging = true;
    lx = e.clientX; ly = e.clientY;
    vx = 0; vy = 0;
    canvas.style.cursor = "grabbing";
  });

  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    vx = (e.clientY - ly) * 0.012;
    vy = (e.clientX - lx) * 0.012;
    rotX += vx; rotY += vy;
    lx = e.clientX; ly = e.clientY;
  });

  canvas.addEventListener("pointerup", () => {
    dragging = false;
    canvas.style.cursor = "grab";
    // vx/vy conservan la inercia del último movimiento
  });

  canvas.addEventListener("pointercancel", () => {
    dragging = false;
    canvas.style.cursor = "grab";
  });

  // Hover — pausa la auto-rotación
  canvas.addEventListener("mouseenter", () => { hovering = true; });
  canvas.addEventListener("mouseleave", () => { hovering = false; });

  // Scroll
  window.addEventListener("scroll", () => {
    scrollVel = (window.scrollY - lastScrollY) * 0.003;
    lastScrollY = window.scrollY;
  }, { passive: true });

  // Resize
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (h <= 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Loop
  function animate() {
    requestAnimationFrame(animate);

    if (dragging) {
      // rotX/rotY se actualizan en pointermove, nada que hacer aquí
    } else if (hovering) {
      // Solo inercia del drag, sin auto-rotación
      vx *= 0.90; vy *= 0.90;
      rotX += vx; rotY += vy;
    } else {
      // Auto-rotación + scroll, frenar inercia previa
      vx *= 0.85; vy *= 0.85;
      rotY += 0.004 + scrollVel;
      scrollVel *= 0.9;
    }

    rubikGroup.rotation.x = rotX;
    rubikGroup.rotation.y = rotY;
    renderer.render(scene, camera);
  }
  animate();
})();