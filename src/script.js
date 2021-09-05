import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

//Loading
const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load('/textures/NormalMap.png');

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  normalMap: normalTexture,
  color: new THREE.Color(0x292929),
});

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// Lights

//Light1
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(0, 2, -1.75);
pointLight.intensity = 2.6;
scene.add(pointLight);

//White Red
const pointLight2 = new THREE.PointLight(0xff0000, 2);
pointLight2.position.set(0, -2, -1.75);
pointLight2.intensity = 1.5;
scene.add(pointLight2);

const light1 = gui.addFolder('Light1');
light1.add(pointLight.position, 'x').min(-5).max(5).step(0.01);
light1.add(pointLight.position, 'y').min(-5).max(5).step(0.01);
light1.add(pointLight.position, 'z').min(-5).max(5).step(0.01);
light1.add(pointLight, 'intensity').min(0).max(5).step(0.01);

const light2 = gui.addFolder('Light2');
light2.add(pointLight2.position, 'x').min(-5).max(5).step(0.01);
light2.add(pointLight2.position, 'y').min(-5).max(5).step(0.01);
light2.add(pointLight2.position, 'z').min(-5).max(5).step(0.01);
light2.add(pointLight2, 'intensity').min(0).max(5).step(0.01);

// LIGHT HELPERS INTEGRATION
const pointLightHelper2 = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper2);
const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);
scene.add(pointLightHelper);

//LIGHT COLOR INT

const light1Color = {
  color: 0xff0000,
};
light1.addColor(light1Color, 'color').onChange(() => {
  pointLight.color.set(light1Color.color);
});

const light2Color = {
  color: 0xffffff,
};
light2.addColor(light2Color, 'color').onChange(() => {
  pointLight2.color.set(light2Color.color);
});
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove);
document.addEventListener('scroll', updateSphere);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
}

function updateSphere(event) {
  sphere.position.y = window.scrollY * 0.015;
}

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
  sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
  sphere.position.z += -0.05 * (targetY - sphere.rotation.x);

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
