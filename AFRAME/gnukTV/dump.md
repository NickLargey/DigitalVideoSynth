## UNUSED FROM 3D GALLERY

```html
<audio
  crossorigin="anonymous"
  id="click-sound"
  src="https://cdn.aframe.io/360-image-gallery-boilerplate/audio/click.ogg"
></audio>

<img
  crossorigin="anonymous"
  id="sechelt"
  src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg"
/>
<img
  crossorigin="anonymous"
  id="sechelt-thumb"
  src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/thumb-sechelt.jpg"
/>
<script id="link" type="text/html">
  <a-entity
    class="link"
    geometry="primitive: plane; height: 1; width: 1"
    material="shader: flat; src: ${thumb}"
    sound="on: click; src: #click-sound"
    event-set__mouseenter="scale: 1.2 1.2 1"
    event-set__mouseleave="scale: 1 1 1"
    event-set__click="_target: #image-360; _delay: 300; material.src: ${src}"
    proxy-event="event: click; to: #image-360; as: fade"
  ></a-entity>
</script>

<!-- 360-degree image. -->
<a-sky
  id="image-360"
  radius="10"
  src="#sechelt"
  animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
  animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade"
></a-sky>

<!-- Link template we will build. -->
<a-entity class="link"></a-entity>
<a-entity id="links" layout="type: line; margin: 1.5" position="-1.5 1.5 -4">
  <a-entity
    template="src: #link"
    data-src="#sechelt"
    data-thumb="#sechelt-thumb"
  ></a-entity>
</a-entity>
<!-- Basic plane. -->
<a-plane color="#CCC" height="20" width="20"></a-plane>

<!-- Interior -->
<a-cubemap id="reflection">
  <img src="./assets/tile 9.png" />
  <img src="./assets/tile 9.png" />
  <img src="./assets/tile 9.png" />
  <img src="./assets/tile 9.png" />
  <img src="./assets/tile 9.png" />
  <img src="./assets/tile 9.png" />
</a-cubemap>

<!-- Collider -->
<script>
  AFRAME.registerComponent("collider-check", {
    dependencies: ["raycaster"],

    init: function () {
      this.el.addEventListener("raycaster-intersection", function () {
        console.log("Player hit something!");
      });
    },
  });
</script>

animation__fade="property: components.material.material.color; type: color;
from: #FFF; to: #000; dur: 300; startEvents: fade"
animation__fadeback="property: components.material.material.color; type: color;
from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade"
```
