import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color().setHex(0xff35a5);

const fov = 60;
const aspect = 1920 / 1080;
const near = 1;
const far = 10000.0;
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// camera.position.set(0, 0, 0);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// let light = new THREE.DirectionalLight(0xffffff, 1.0); // create new Directional Light object
// scene.add(light);

let ambLight = new THREE.AmbientLight(0xffffff); // create new ambient lighting object
scene.add(ambLight); // attach ambient lighting object to scene

// Video Texture
const video = document.createElement("video");
video.src = "./src/Max_No_Audio.mp4"; // Replace with your video path
video.loop = true; // Optional: Loop the video
video.muted = true; // Optional: Mute the video

// Important: Add event listeners to handle video loading and playback
video.addEventListener("loadeddata", () => {
  console.log("Video Loaded");
  video.play(); // Autoplay after video is loaded
});

video.addEventListener("error", (error) => {
  console.error("Error loading video:", error);
});

const vidTexture = new THREE.VideoTexture(video);
vidTexture.colorSpace = THREE.SRGBColorSpace;

// Plane Geometry and Material
const geometry = new THREE.PlaneGeometry(8, 6); // Adjust size to match video aspect ratio (example: 16:9)
const material = new THREE.MeshBasicMaterial({ map: vidTexture }); // Use MeshBasicMaterial for unlit video
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// GIF Texture
// const smiGif = document.createElement("video");
// smiGif.src = "./src/cloudSmiles.gif";
// smiGif.loop = true;

// // Important: Add event listeners to handle video loading and playback
// smiGif.addEventListener("loadeddata", () => {
//   smiGif.play(); // Autoplay after smiGif is loaded
// });

// smiGif.addEventListener("error", (error) => {
//   console.error("Error loading smiGif:", error);
// });

// const gifTexture = new THREE.VideoTexture(smiGif);
// gifTexture.colorSpace = THREE.SRGBColorSpace;

// const tetGeometry = new THREE.Mesh(
//   new THREE.TetrahedronGeometry(25, 1),
//   new THREE.MeshBasicMaterial(0x0f0f0f)
// );

// tetGeometry.position.set(0, 10, 0);

// scene.add(tetGeometry);

const box = new THREE.Mesh( // create a Mesh object to hold Box primative object
  new THREE.BoxGeometry(2, 2, 2), // set the size of the Box (X, Y, Z)
  new THREE.MeshStandardMaterial({
    color: 0xffffff, // Set the color to white
  })
);
box.position.set(5, 0, 0); // set the starting position of the Box object
// box.castShadow = true; // allow boxes to cast shadows
// box.receiveShadow = true; // all shadows to be projected onto the box
scene.add(box); // add the box object to the scene

const controls = new OrbitControls(camera, renderer.domElement); // create new Orbit Controls object
controls.target.set(0, 0, 0);
controls.object.position.set(0, 0, 10);
controls.keys = {
  LEFT: "KeyA",
  UP: "KeyW",
  RIGHT: "KeyD",
  BOTTOM: "KeyS",
};
controls.update(); // update controls for each move

// Position the camera
camera.position.z = 25; // Adjust as needed

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  plane.rotation.x += 0.0001;
  plane.rotation.y += 0.0001;

  box.rotation.x += 0.001;
  box.rotation.y += 0.001;

  box.position.x -= 0.000001;
  box.position.y -= 0.000001;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
