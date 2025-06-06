// Question Reference: discourse.threejs.org/t/clip-exceeding-parts-of-object-groups/19692

let camera, scene, renderer, controls, mesh;

const createWorld = () => {
  const houseGroup = new THREE.Group();
  const house = new THREE.Object3D();

  houseGroup.add(house);
  scene.add(houseGroup);

  // Draw front and back walls (with angled edges)
  const tiltWallShape = new THREE.Shape();
  tiltWallShape.moveTo(0, 0);
  tiltWallShape.lineTo(1, 0);
  tiltWallShape.lineTo(1, 0.75);
  tiltWallShape.lineTo(0, 1);
  tiltWallShape.lineTo(0, 0);
  const tiltWallGeometry = new THREE.ExtrudeBufferGeometry([tiltWallShape], {
    steps: 1,
    depth: 0.2,
    bevelEnabled: false,
    curveSegments: 32,
  });
  const tiltWallA = new THREE.Mesh(
    tiltWallGeometry,
    new THREE.MeshStandardMaterial({ color: 0xff9999 })
  );
  house.add(tiltWallA);

  const tiltWallB = tiltWallA.clone();
  tiltWallB.translateZ(0.2);
  tiltWallB.rotateY(Math.PI);
  house.add(tiltWallB);

  const tiltWallC = tiltWallA.clone();
  tiltWallC.translateZ(1.2);
  house.add(tiltWallC);

  const tiltWallD = tiltWallA.clone();
  tiltWallD.translateZ(1.4);
  tiltWallD.rotateY(Math.PI);
  house.add(tiltWallD);

  // Draw side walls
  const wallShape = new THREE.Shape();
  wallShape.moveTo(0, 0);
  wallShape.lineTo(1.4, 0);
  wallShape.lineTo(1.4, 0.75);
  wallShape.lineTo(0, 0.75);
  wallShape.lineTo(0, 0);
  const wallGeometry = new THREE.ExtrudeBufferGeometry([wallShape], {
    steps: 1,
    depth: 0.2,
    bevelEnabled: false,
    curveSegments: 32,
  });
  const wallA = new THREE.Mesh(
    wallGeometry,
    new THREE.MeshStandardMaterial({ color: 0xff9999 })
  );
  wallA.rotateY(-Math.PI / 2);
  wallA.translateZ(0.8);
  house.add(wallA);

  const wallB = wallA.clone();
  wallB.translateZ(-1.8);
  house.add(wallB);

  // Draw roof
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.2, 0);
  roofShape.lineTo(1.6, 0);
  roofShape.lineTo(1.6, 1.2);
  roofShape.lineTo(-0.2, 1.2);
  roofShape.lineTo(-0.2, 0);
  const roofGeometry = new THREE.ExtrudeBufferGeometry([roofShape], {
    steps: 1,
    depth: 0.2,
    bevelEnabled: false,
    curveSegments: 32,
  });
  const roofA = new THREE.Mesh(
    roofGeometry,
    new THREE.MeshStandardMaterial({ color: 0x9999ff })
  );
  roofA.rotateY(-Math.PI / 2);
  roofA.rotateX(-Math.PI / 2 - 0.25);
  roofA.translateZ(1);
  roofA.translateY(-0.4);
  house.add(roofA);

  const roofB = roofA.clone();
  roofB.rotateZ(Math.PI);
  roofB.rotateX(-0.5);
  roofB.translateY(-0.2);
  roofB.translateZ(-0.05);
  roofB.translateX(-1.4);
  house.add(roofB);

  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xffff99 })
  );
  ground.rotateX(-Math.PI / 2);
  ground.translateX(-0.5);
  ground.translateY(-0.5);
  houseGroup.add(ground);

  house.translateX(-0.5);
  house.translateZ(-0.5);

  house.traverse((mesh) => (mesh !== house ? (mesh.visible = false) : null));

  mesh = [houseGroup, house];

  camera.lookAt(houseGroup.position);

  let step = 0;

  setInterval(() => {
    step = (step + 1) % (house.children.length + 1);

    house.children.forEach((mesh, index) => (mesh.visible = index < step));
  }, 500);
};

const init = () => {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000.0
  );
  camera.position.set(-5, 5, 7);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  scene.add(new THREE.HemisphereLight(0xffffcc, 0x19bbdc, 1));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  createWorld();
};

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  mesh[0].rotateY(0.01);
};

init();
animate();

