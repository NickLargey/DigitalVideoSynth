"use strict";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.set(150, 100, 0);
// camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.AmbientLight(0x101010); // create new ambient lighting object
scene.add(light); // attach ambient lighting object to scene

// 1. Load Video/GIF Texture
const video = document.createElement("video");
video.src = "./src/Max_No_Audio.mp4"; // Or GIF path
video.loop = true;
video.autoplay = true; // Important for video textures

// Important: Add event listeners to handle video loading and playback
video.addEventListener("loadeddata", () => {
  video.play(); // Autoplay after video is loaded
});

video.addEventListener("error", (error) => {
  console.error("Error loading video:", error);
});

const texture = new THREE.VideoTexture(video);

// 2. Geometry (Quad)
const geometry = new THREE.PlaneGeometry(16, 9); // Adjust size as needed

// 3. Shader Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    u_texture: { value: texture },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    }, // Pass resolution
    u_matrix: { value: new THREE.Matrix4() }, // Will be set in render loop
  },
  vertexShader: `
precision mediump float;

attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat4 u_matrix;

varying vec2 v_uv;

void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_uv = a_uv;
}`,
  fragmentShader: `
precision mediump float;

uniform sampler2D u_texture; // Video/GIF texture
uniform vec2 u_resolution; // Canvas resolution

varying vec2 v_uv;

void main() {
    vec4 color = texture2D(u_texture, v_uv);

    // gl_FragColor = color;

    // Example 2: Modify color based on pixel location (screen coordinates)
    vec2 screenCoord = gl_FragCoord.xy;
    // Example: Add a red tint based on x-coordinate
    // gl_FragColor = vec4(color.r + screenCoord.x / u_resolution.x, color.g, color.b, color.a);

    // Example 3: Modify color based on UV coordinates
    // float redAmount = sin(v_uv.x * 10.0); // Example: Sine wave for red
    // gl_FragColor = vec4(color.r * redAmount, color.g, color.b, color.a);

    // Example 4:  Grayscale
    // float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    // gl_FragColor = vec4(gray, gray, gray, color.a);

    // Example 5: Invert colors
    gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
}`,
});

// 4. Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 5;

// 5. Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update resolution uniform on resize:
  material.uniforms.u_resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );

  // Important: Update the video texture if it's a video:
  if (texture.image.readyState >= 2) {
    texture.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
