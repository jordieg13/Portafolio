(function () {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
  
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3;
  
    // Esfera de partículas
    const geometry = new THREE.BufferGeometry();
    const count = 1800;
    const positions = new Float32Array(count * 3);
  
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  
    const material = new THREE.PointsMaterial({
      size: 0.018,
      color: 0x2563eb, // usa tu --accent azul
    });
  
    const points = new THREE.Points(geometry, material);
    scene.add(points);
  
    // Velocidad de rotación ligada al scroll
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
  
    window.addEventListener("scroll", () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.002, 0.04); // limita la velocidad máxima
      lastScrollY = window.scrollY;
    });
  
    function resize() {
      const { clientWidth, clientHeight } = canvas.parentElement;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
  
    window.addEventListener("resize", resize);
    resize();
  
    function animate() {
      requestAnimationFrame(animate);
  
      // Rotación base + velocidad extra por scroll
      points.rotation.y += 0.001 + scrollVelocity;
      points.rotation.x += 0.0005 + scrollVelocity * 0.3;
  
      // La velocidad decae suavemente
      scrollVelocity *= 0.92;
  
      renderer.render(scene, camera);
    }
  
    animate();
  
    // Adapta el color al tema oscuro/claro
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      material.color.set(isDark ? 0x60a5fa : 0x2563eb);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  })();