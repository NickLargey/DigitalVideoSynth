# RENDERING

## START: WebGPU Renderer

```html
<script type="importmap">
  {
    "imports": {
      "three": "../build/three.webgpu.js",
      "three/webgpu": "../build/three.webgpu.js",
      "three/tsl": "../build/three.tsl.js",
      "three/addons/": "./jsm/"
    }
  }
</script>
```

```javascript
import * as THREE from "../../three.js/build/three.webgpu.min.js";

const renderer = new THREE.WebGPURenderer(/*{ forceWebGL: true }*/);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
```

# BASIC VIDEO PLAYBACK MATERIAL

## START: Use MeshBasicMaterial for unlit video

```JavaScript
const material = new THREE.MeshBasicMaterial({ map: vidTexture });
```

# EXTRA OBJECTS AND TEXTURES

```javascript
// GIF Texture
const smiGif = document.createElement("video");
smiGif.src = "./src/cloudSmiles.gif";
smiGif.loop = true;

// Important: Add event listeners to handle video loading and playback
smiGif.addEventListener("loadeddata", () => {
smiGif.play(); // Autoplay after smiGif is loaded
});

smiGif.addEventListener("error", (error) => {
console.error("Error loading smiGif:", error);
});

const gifTexture = new THREE.VideoTexture(smiGif);
gifTexture.colorSpace = THREE.SRGBColorSpace;

const tetGeometry = new THREE.Mesh(
new THREE.TetrahedronGeometry(25, 1),
new THREE.MeshBasicMaterial(0x0f0f0f)
);

tetGeometry.position.set(0, 10, 0);

scene.add(tetGeometry);

// Basic Box
const box = new THREE.Mesh( // create a Mesh object to hold Box primative object
new THREE.BoxGeometry(2, 2, 2), set the size of the Box (X, Y, Z)
new THREE.MeshStandardMaterial({
      color: 0xffffff, // Set the color to white
      })
  );
box.position.set(5, 0, 0); // set the starting position of the Box object
box.castShadow = true; // allow boxes to cast shadows
box.receiveShadow = true; // all shadows to be projected onto the box
scene.add(box); // add the box object to the scene
```

# SHADERS

## START: Basic shader from [3JS Examples](https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/BasicShader.js)

```javascript
const BasicShader = {
  name: "BasicShader",
  uniforms: {},
  vertexShader: /* glsl */ `
		void main() {
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
		void main() {
			gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );
		}`,
};
```

```javascript
var vFragmentShader = `
precision mediump float;

     uniform sampler2D u_texture;  Video/GIF texture
     uniform vec2 u_resolution;  Canvas resolution

     varying vec2 v_uv;

     void main() {
         vec4 color = texture2D(u_texture, v_uv);

          Example 1: Pass through the original color
          gl_FragColor = color;

          Example 2: Modify color based on pixel location (screen coordinates)

         vec2 screenCoord = gl_FragCoord.xy;
          Example: Add a red tint based on x-coordinate
          gl_FragColor = vec4(color.r + screenCoord.x / u_resolution.x, color.g, color.b, color.a);

          Example 3: Modify color based on UV coordinates
         float redAmount = sin(v_uv.x * 10.0);  Example: Sine wave for red
         gl_FragColor = vec4(color.r * redAmount, color.g, color.b, color.a);

          Example 4:  Grayscale
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = vec4(gray, gray, gray, color.a);

          Example 5: Invert colors
          gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);

         gl_FragColor = color;  Output the modified color

}`;

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

var vertexShader = `#version 300 es
                precision mediump float;
                
                attribute vec3 a_position;
                attribute vec2 a_uv;
                
                uniform mat4 u_matrix;
                
                varying vec2 v_uv;
                
                void main() {
                  gl_Position = u_matrix * vec4(a_position, 1.0);
                  v_uv = a_uv;
          }`;
var fragmentShader = `#version 300 es
                  precision mediump float;
                  
                  uniform sampler2D u_texture; // Video/GIF texture
                  uniform vec2 u_resolution; // Canvas resolution
                  
                  varying vec2 v_uv;
                  
                  void main() {
                      vec4 color = texture2D(u_texture, v_uv);
                  
                      // Example 1: Pass through the original color
                      gl_FragColor = color;
                  
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
                      // gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
}`;
```

## Start: From [Mr. Doob 3JS webgl example](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_buffergeometry_custom_attributes_particles.html)

```javascript
<script type="x-shader/x-vertex" id="vertexshader">
      attribute float size;
      varying vec3 vColor;
      void main() {
      	vColor = color;
      	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      	gl_PointSize = size * ( 300.0 / -mvPosition.z );
      	gl_Position = projectionMatrix * mvPosition;
      }
</script>

<script type="x-shader/x-fragment" id="fragmentshader">
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
      	gl_FragColor = vec4( vColor, 1.0 );
      	gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      }
</script>

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
// ====== End



// ====== START
 const material = new THREE.ShaderMaterial({
   glslVersion: THREE.GLSL3,
   uniforms: {
     u_texture: { value: vidTexture },
     u_resolution: {
       value: new THREE.Vector2(1920, 1080),
     },  // Pass resolution
     u_matrix: { value: new THREE.Matrix4() }, //  Will be set in render loop
   },
   vertexShader: vVertexShader,
   fragmentShader: vFragmentShader,
 });
```

# ANIMATION LOOPS

## Start: Basic animation loop to update controls and rotate video

```javascript
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  plane.rotation.x += 0.0001;
  plane.rotation.y += 0.0001;

  renderer.render(scene, camera);
}
```

## START:

```javascript
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
// ====== END
```

## START:

### Loading .frag and .vert files

```javascript
async function init() {
  fragmentShader = await (await fetch("../shaders/basic.frag")).text();
  vertexShader = await (await fetch("../shaders/basic.vert")).text();

  return fragmentShader, vertexShader;
}
init();
```
