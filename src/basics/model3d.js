import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

const clock = new THREE.Clock();
let uniforms;

// SCENE, CAMERA AND RENDERER OBJECT INIT
const scene = new THREE.Scene();
scene.background = new THREE.Color().setHex(0xff35a5);

const fov = 60;
const aspect = 1920 / 1080;
const near = 1;
const far = 10000.0;
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// HANDLE WINDOW RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// LIGHTS
let ambLight = new THREE.AmbientLight(0xffffff); // create new ambient lighting object
scene.add(ambLight); // attach ambient lighting object to scene

// CUSTOM SHADER
// function setMaterialsOnGLTF(object3D) {
//   if (object3D.material) {
//     const newMaterial = new THREE.MeshPhongMaterial({
//       map: object3D.material.map,
//     });
//     object3D.material = newMaterial;
//   }
//   if (!object3D.children) {
//     return;
//   }
//   for (let i = 0; i < object3D.children.length; i++) {
//     Utilities.setMaterialsOnGLTF(object3D.children[i]);
//   }
// }

// MODEL LOADER
const loader = new GLTFLoader();
let mixer;

loader.load(
  // "../DVS/assets/blue_whale/blue_whale_-_textured.glb",
  "../DVS/assets/blue_whale/scene.gltf",
  // "../DVS/assets/phantom_reaper/phantom_reaper_-_textured.glb",
  // "../DVS/assets/manta/manta.glb",

  (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer(model);

    const action = mixer.clipAction(animations[0]); // play the first animation
    action.play();

    gltf.parser.getDependencies("material").then((materials) => {
      console.log(materials);
    });

    // setMaterialsOnGLTF(gltf.scene);
    scene.add(gltf.scene);
    gltf.scene.scale.set(0.01, 0.01, 0.01);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// CAMERA CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.object.position.set(0, 0, 10);
controls.update();

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
