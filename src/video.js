import * as THREE from "../../three.js/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

// VER AND FRAG SHADERS
const vVertexShader = `
    precision mediump float;

    attribute vec3 a_position;
    attribute vec2 a_uv;

    uniform mat4 u_matrix;

    varying vec2 v_uv;

    void main() {
      gl_Position = u_matrix * vec4(a_position, 1.0);
      v_uv = a_uv;
    }`;

const vFragmentShader = `
    precision mediump float;

    uniform sampler2D u_texture; 
    varying vec2 v_uv;

    void main() {
        gl_FragColor = texture2D(u_texture, v_uv); 
    }`;

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

// VIDEO TEXTURE
const video = document.createElement("video");
video.src = "./assets/Max_No_Audio.mp4"; // Replace with your video path
video.loop = true; // Optional: Loop the video
// video.muted = true; // Optional: Mute the video

// Important: Add event listeners to handle video loading and playback
video.addEventListener("loadeddata", () => {
  console.log("%s Video Loaded", video.src);
  video.play(); // Autoplay after video is loaded
});

video.addEventListener("error", (error) => {
  console.error("Error loading video:", error);
});

const vidTexture = new THREE.VideoTexture(video);
vidTexture.colorSpace = THREE.LinearSRGBColorSpace;

// PLANE GEOMETRY AND MATERIAL
const geometry = new THREE.PlaneGeometry(4, 3); // Adjust size to match video aspect ratio (example: 16:9)

// const material = new THREE.ShaderMaterial({
//   glslVersion: THREE.GLSL3,
//   uniforms: {
//     u_texture: { value: vidTexture },
//     u_resolution: {
//       value: new THREE.Vector2(1920, 1080),
//     }, // Pass resolution
//     u_matrix: { value: new THREE.Matrix4() }, // Will be set in render loop
//   },
//   vertexShader: vVertexShader,
//   fragmentShader: vFragmentShader,
// });
let uniforms = {
  u_texture: { value: vidTexture },
  u_resolution: {
    value: new THREE.Vector2(1920, 1080),
  },
};
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: document.getElementById("vertexshader").textContent,
  fragmentShader: document.getElementById("fragmentshader").textContent,

  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
  vertexColors: true,
});
const plane = new THREE.Mesh(geometry, material);

scene.add(plane);

console.log(material.uniforms);

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

// ADDED MOVEMENT CONTROLS
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

// ANIMATION LOOP
function render() {
  // Update resolution uniform on resize:
  material.uniforms.u_resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
  // material.uniforms.u_matrix.value = plane.matrixWorld; // Update u_matrix
  // Important: Update the video texture if it's a video:
  if (vidTexture.image.readyState >= 2) {
    // Check if video is playing
    vidTexture.needsUpdate = true;
  }
  // console.log(vidTexture.image.readyState);
  controls.update();
  renderer.render(scene, camera);
  renderer.setAnimationLoop(render);
  requestAnimationFrame(render);
  // console.log(material.uniforms.u_matrix);
}
// requestAnimationFrame(render);
renderer.setAnimationLoop(render);
console.log(material.uniforms);

// BASIC VIDEO PLAYBACK MATERIAL
// const material = new THREE.MeshBasicMaterial({ map: vidTexture }); // Use MeshBasicMaterial for unlit video

// ANIMATION LOOP
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();

//   // plane.rotation.x += 0.0001;
//   // plane.rotation.y += 0.0001;

//   renderer.render(scene, camera);
// }

// EXTRA OBJECTS AND TEXTURES
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

// const box = new THREE.Mesh( // create a Mesh object to hold Box primative object
//   new THREE.BoxGeometry(2, 2, 2), // set the size of the Box (X, Y, Z)
//   new THREE.MeshStandardMaterial({
//     color: 0xffffff, // Set the color to white
//   })
// );
// box.position.set(5, 0, 0); // set the starting position of the Box object
// // box.castShadow = true; // allow boxes to cast shadows
// // box.receiveShadow = true; // all shadows to be projected onto the box
// scene.add(box); // add the box object to the scene

// SHADERS
// var vFragmentShader = `
//     precision mediump float;

//     uniform sampler2D u_texture; // Video/GIF texture
//     uniform vec2 u_resolution; // Canvas resolution

//     varying vec2 v_uv;

//     void main() {
//         vec4 color = texture2D(u_texture, v_uv);

//         // Example 1: Pass through the original color
//         // gl_FragColor = color;

//         // Example 2: Modify color based on pixel location (screen coordinates)

//         vec2 screenCoord = gl_FragCoord.xy;
//         // Example: Add a red tint based on x-coordinate
//         // gl_FragColor = vec4(color.r + screenCoord.x / u_resolution.x, color.g, color.b, color.a);

//         // Example 3: Modify color based on UV coordinates
//         float redAmount = sin(v_uv.x * 10.0); // Example: Sine wave for red
//         gl_FragColor = vec4(color.r * redAmount, color.g, color.b, color.a);

//         // Example 4:  Grayscale
//         // float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
//         // gl_FragColor = vec4(gray, gray, gray, color.a);

//         // Example 5: Invert colors
//         // gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);

//         gl_FragColor = color; // Output the modified color
// }`;
