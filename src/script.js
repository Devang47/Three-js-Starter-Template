import "./style.scss";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const sizes = {
  width: innerWidth,
  height: innerHeight,
};

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2.5, 5, 3);

// Lights helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);

directionalLight.castShadow = true; // Shadows
directionalLight.shadow.mapSize.width = 1024; // Shadows
directionalLight.shadow.mapSize.height = 1024; // Shadows
scene.add(directionalLight, directionalLightHelper);

/**
 * objects
 */
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f0f5 });
planeMaterial.metalness = 0.2;
planeMaterial.roughness = 0.8;

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(5, 5),
  planeMaterial
);
plane.rotation.x = Math.PI / 2;
plane.position.y = -0.501;
plane.material.side = THREE.DoubleSide; // Render both sides
plane.receiveShadow = true; // Shadows
scene.add(plane);

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
cube.castShadow = true; // Shadows
cube.receiveShadow = true; // Shadows
scene.add(cube);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.set(-3, 2, 4);

/**
 * Renderer
 */
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Shadows

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement

/**
 * Update Canvas on Resize
 */
addEventListener("resize", () => {
  sizes.height = innerHeight;
  sizes.width = innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

/**
 * rendering frames
 */
document.body.appendChild(renderer.domElement); // add canvas to scene

function animate() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}
animate();
