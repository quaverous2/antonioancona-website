import * as THREE from 'three';
import fragmentShader from './fragment.glsl?raw';
import vertexShader from './vertex.glsl?raw';

const MAX_PIXEL_RATIO = 1.5;

export class BackgroundController {
  constructor(canvas) {
    this.canvas = canvas;
    this.animationFrame = null;
    this.isVisible = !document.hidden;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    this.handleResize = this.handleResize.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.render = this.render.bind(this);
  }

  start() {
    if (!this.canvas || this.reduceMotion.matches) {
      return;
    }

    try {
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        canvas: this.canvas,
        powerPreference: 'high-performance',
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.clock = new THREE.Clock();
      this.uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
      };

      this.material = new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false,
        fragmentShader,
        vertexShader,
        uniforms: this.uniforms,
      });
      this.geometry = new THREE.PlaneGeometry(2, 2);
      this.scene.add(new THREE.Mesh(this.geometry, this.material));

      this.handleResize();
      window.addEventListener('resize', this.handleResize, { passive: true });
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      this.render();
    } catch (error) {
      // The CSS fallback remains visible if WebGL cannot initialize.
      this.destroy();
      console.warn('WebGL background disabled; using CSS fallback.', error);
    }
  }

  handleResize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const { width, height } = this.canvas.getBoundingClientRect();

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
  }

  handleVisibilityChange() {
    this.isVisible = !document.hidden;

    if (this.isVisible && this.animationFrame === null) {
      this.clock.start();
      this.render();
    }
  }

  render() {
    if (!this.isVisible) {
      this.animationFrame = null;
      return;
    }

    this.uniforms.uTime.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = window.requestAnimationFrame(this.render);
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.geometry?.dispose();
    this.material?.dispose();
    this.renderer?.dispose();
    this.animationFrame = null;
  }
}
