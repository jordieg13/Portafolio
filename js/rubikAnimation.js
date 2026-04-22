(function () {
    const container = document.getElementById("rubikContainer");
    if (!container) return;
  
    const canvas = document.createElement("canvas");
    canvas.id = "rubikCanvas";
    container.appendChild(canvas);
  
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);
  
    // Colores clásicos del cubo Rubik
    const COLORS = {
      U: 0xffffff, // blanco  - top
      D: 0xffff00, // amarillo - bottom
      F: 0xff0000, // rojo    - front
      B: 0xff8c00, // naranja - back
      L: 0x0000ff, // azul    - left
      R: 0x00aa00, // verde   - right
      inner: 0x111111
    };
  
    const faceColorMap = [COLORS.R, COLORS.L, COLORS.U, COLORS.D, COLORS.F, COLORS.B];
    const cubelets = [];
    const gap = 1.05;
  
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
  
          // Colorea cada cara según su posición
          const materials = [
            new THREE.MeshLambertMaterial({ color: x ===  1 ? COLORS.R : COLORS.inner }),
            new THREE.MeshLambertMaterial({ color: x === -1 ? COLORS.L : COLORS.inner }),
            new THREE.MeshLambertMaterial({ color: y ===  1 ? COLORS.U : COLORS.inner }),
            new THREE.MeshLambertMaterial({ color: y === -1 ? COLORS.D : COLORS.inner }),
            new THREE.MeshLambertMaterial({ color: z ===  1 ? COLORS.F : COLORS.inner }),
            new THREE.MeshLambertMaterial({ color: z === -1 ? COLORS.B : COLORS.inner }),
          ];
  
          const cubelet = new THREE.Mesh(geometry, materials);
          cubelet.position.set(x * gap, y * gap, z * gap);
          scene.add(cubelet);
          cubelets.push(cubelet);
        }
      }
    }
  
    // Iluminación
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
  
    // Grupo raíz para rotar todo el cubo
    const rubikGroup = new THREE.Group();
    cubelets.forEach(c => {
      scene.remove(c);
      rubikGroup.add(c);
    });
    scene.add(rubikGroup);
  
    // Rotación ligada al scroll
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
  
    window.addEventListener("scroll", () => {
      const delta = window.scrollY - lastScrollY;
      scrollVelocity = delta * 0.003;
      lastScrollY = window.scrollY;
    });
  
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
  
    let baseRotY = 0;
    let baseRotX = 0.4;
  
    function animate() {
      requestAnimationFrame(animate);
  
      baseRotY += 0.004 + scrollVelocity;
      scrollVelocity *= 0.9;
  
      rubikGroup.rotation.y = baseRotY;
      rubikGroup.rotation.x = baseRotX;
  
      renderer.render(scene, camera);
    }
  
    animate();
  })();