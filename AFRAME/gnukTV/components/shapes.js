// @author Mugen87

let camera, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-100, 0, 200);
  camera.lookAt(-100, 0, 0);

  scene = new THREE.Scene();

  const smiley = getSmileyShape();
  const heart = getHeartShape();

  const geometry = new THREE.ExtrudeBufferGeometry([smiley, heart], {
    curveSegments: 24,
    steps: 6,
    amount: 12,
    bevelEnabled: false,
  });
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = Math.PI;
  mesh.position.set(45, 45, 0);
  scene.add(mesh);

  //

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", resize, false);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function getHeartShape() {
  const x = 200,
    y = 0;

  const heartShape = new THREE.Shape();

  heartShape.moveTo(x + 25, y + 25);
  heartShape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
  heartShape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
  heartShape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
  heartShape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
  heartShape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
  heartShape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

  return heartShape;
}

function getSmileyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(80, 40);
  shape.absarc(40, 40, 40, 0, Math.PI * 2, false);

  const smileyEye1Path = new THREE.Path();
  smileyEye1Path.moveTo(35, 20);
  smileyEye1Path.absellipse(25, 20, 10, 10, 0, Math.PI * 2, true);
  shape.holes.push(smileyEye1Path);

  const smileyEye2Path = new THREE.Path();
  smileyEye2Path.moveTo(65, 20);
  smileyEye2Path.absarc(55, 20, 10, 0, Math.PI * 2, true);
  shape.holes.push(smileyEye2Path);

  const smileyMouthPath = new THREE.Path();
  smileyMouthPath.moveTo(20, 40);
  smileyMouthPath.quadraticCurveTo(40, 60, 60, 40);
  smileyMouthPath.bezierCurveTo(70, 45, 70, 50, 60, 60);
  smileyMouthPath.quadraticCurveTo(40, 80, 20, 60);
  smileyMouthPath.quadraticCurveTo(5, 50, 20, 40);
  shape.holes.push(smileyMouthPath);

  return shape;
}
