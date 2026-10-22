import * as THREE from '../assets/three/three.module.js';
import { GLTFLoader } from '../assets/three/GLTFLoader.js';

const host = document.getElementById('wrap');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
const turntable = new THREE.Group();
scene.add(turntable);
scene.add(new THREE.HemisphereLight(0xffffff, 0x786759, 2.2));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(3, 5, 7);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
fillLight.position.set(-4, 2, -5);
scene.add(fillLight);

let frame;
let model;
let radius;
let verticalRadius;
let renderer;
let failed = false;
let pointerId;
let lastX;

function draw() {
  if (model && frame?.isConnected) renderer.render(scene, camera);
}

function fit() {
  if (!model || !frame) return;
  const width = frame.clientWidth;
  const height = frame.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  const vertical = THREE.MathUtils.degToRad(camera.fov);
  const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
  const distance = Math.max(2.8, 0.5 / Math.sin(horizontal / 2)) * 1.08;
  const focusY = verticalRadius - 0.75;
  camera.position.set(0, focusY, distance);
  camera.lookAt(0, focusY, 0);
  camera.near = Math.max(0.01, distance - radius * 1.5);
  camera.far = distance + radius * 1.5;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  draw();
}

const resize = new ResizeObserver(fit);

function connect() {
  const next = host.querySelector('.kb-empty-frame');
  if (!next || next === frame) return;
  resize.disconnect();
  frame = next;
  if (failed) {
    frame.dataset.lolaFailed = '';
    return;
  }
  frame.removeAttribute('aria-hidden');
  frame.setAttribute('role', 'region');
  frame.setAttribute('aria-label', '롤라 3D 모델, 좌우로 드래그하거나 방향키로 회전');
  frame.tabIndex = 0;
  frame.addEventListener('keydown', event => {
    if (!model || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    turntable.rotation.y += event.key === 'ArrowRight' ? Math.PI / 12 : -Math.PI / 12;
    draw();
  });
  frame.prepend(renderer.domElement);
  if (model) frame.dataset.lolaReady = '';
  resize.observe(frame);
  fit();
}

try {
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', event => {
    if (!model || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointerId = event.pointerId;
    lastX = event.clientX;
    canvas.setPointerCapture(pointerId);
    frame.focus({ preventScroll: true });
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerId !== pointerId) return;
    turntable.rotation.y += (event.clientX - lastX) / frame.clientWidth * Math.PI * 2;
    lastX = event.clientX;
    draw();
  });
  const endDrag = event => {
    if (event.pointerId === pointerId) pointerId = undefined;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    failed = true;
    frame?.removeAttribute('data-lola-ready');
    if (frame) frame.dataset.lolaFailed = '';
    canvas.remove();
  });

  connect();
  new MutationObserver(connect).observe(host, { childList: true });
  new GLTFLoader().load(new URL('../assets/three/lola.glb', import.meta.url).href, gltf => {
    try {
      model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      if (bounds.isEmpty()) throw new Error('Empty Lola model');
      const size = bounds.getSize(new THREE.Vector3());
      radius = size.length() / 2;
      verticalRadius = size.y / 2;
      if (!radius) throw new Error('Zero-size Lola model');
      const center = bounds.getCenter(new THREE.Vector3());
      const mannequin = model.getObjectByName('CC0_Realistic_Male_Display_Mannequin');
      if (!mannequin) throw new Error('Missing Lola mannequin');
      const bodyBounds = new THREE.Box3().setFromObject(mannequin);
      center.z = bodyBounds.getCenter(new THREE.Vector3()).z;
      model.position.sub(center);
      turntable.add(model);
      model.traverse(part => {
        if (!/^HUMAN_R1_SHORTS_[LR]_Continuous_Leg$/.test(part.name)) return;
        part.geometry.computeBoundingBox();
        const box = part.geometry.boundingBox;
        const hemY = (box.min.y + (box.max.y - box.min.y) * 0.085).toFixed(6);
        part.material.onBeforeCompile = shader => {
          shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying float vHemY;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvHemY = position.y;');
          shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vHemY;').replace('#include <color_fragment>', `#include <color_fragment>\nif (vHemY < ${hemY}) diffuseColor.rgb = vec3(0.64448, 0.0185, 0.0356);`);
        };
      });
      connect();
      fit();
      if (frame) frame.dataset.lolaReady = '';
    } catch (error) {
      failed = true;
      if (frame) frame.dataset.lolaFailed = '';
      canvas.remove();
      console.error('Lola 3D viewer:', error);
    }
  }, undefined, error => {
    failed = true;
    if (frame) frame.dataset.lolaFailed = '';
    canvas.remove();
    console.error('Lola 3D viewer:', error);
  });
} catch (error) {
  failed = true;
  host.querySelector('.kb-empty-frame')?.setAttribute('data-lola-failed', '');
  console.error('Lola 3D viewer:', error);
}
