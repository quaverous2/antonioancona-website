precision highp float;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 curve = local * local * (3.0 - 2.0 * local);

  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), curve.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), curve.x),
    curve.y
  );
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int octave = 0; octave < 4; octave++) {
    value += amplitude * noise(point);
    point = point * 2.03 + vec2(17.2, 9.4);
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 point = (vUv - 0.5) * aspect;
  float time = uTime * 0.07;

  float field = fbm(point * 2.6 + vec2(time * 1.6, -time * 0.75));
  float wave = sin(point.x * 3.0 + time * 4.0) * 0.08;
  float light = smoothstep(0.18, 0.82, field + wave);
  vec3 color = mix(vec3(0.01, 0.055, 0.04), vec3(0.12, 0.48, 0.34), pow(light, 1.25));

  float grain = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.07;
  gl_FragColor = vec4(color + grain, 0.68);
}
