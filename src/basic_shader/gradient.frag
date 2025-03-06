precision mediump float; // set precision to float

varying vec2 pos; // get xy position from vertex shader

// 1D GRADIENT
// main() {
//   vec4 c1 = vec4(0.5, 0.1, 0.9, 1.);
//   vec4 c2 = vec4(0.1, 0.8, 0.7, 1.);
//   vec4 c = mix(c1, c2, pos.x);

//   gl_fragColor = c;
// }

// 2D GRADIENT
// main() {
//   vec4 tl = vec4(0.5, 0.1, 0.9, 1.);
//   vec4 tr = vec4(0.6, 0.3, 0.1, 1.);
//   vec4 bl = vec4(0.1, 0.7, 0.3, 1.);
//   vec4 br = vec4(0.9, 0.2, 0.2, 1.);
  
  
//   vec4 top = mix(tl, tr, pos.x);
//   vec4 bottom = mix(bl,br, pos.x);

  
//   vec4 c = mix(top, bottom, pos.y);
//   gl_fragColor = c;
// }

// REPEATING PATTERN
// main() {
//   // fract() returns decimal from number
//   vec2 newPos = fract(pos * 10); // mult pos by n for n repeats;
//   gl_fragColor = vec4(newPos, 1., 1.);
// }

// ANIMATED SINE WAVE
// have to set the uniforms to pass in time ("millis") by passing
// the milliseconds from js to fragment shader in a draw or update function.
// P5 uses exampleShader.setUniform("millis", millis()); to do this.
// uniform float millis;
// main() {
//   float c = (sin(pos.x * 16. + millis/1000.) + 1. )/2.; // divide millis by 1000 to put into seconds, slowing down the scroll
//   gl_fragColor = vec4(c, 0., 1., 1.);
// }

// LOADING AND MANIPULATING AN IMAGE
uniform sampler2D background;

main() {
  vec2 newPos = pos;
  newPos.y = 1. - newPos.y; // have to invert because image loads upside-down (because of canvas origin coord difference?)
  vec4 col = texture2D(background, newPos);

  gl_fragColor = vec4(col);

  // Grayscale Image
  // float avg = (col.r + col.g + col.b) / 3.;
  // gl_fragColor = vec4(avg, avg, avg, 1.);

}