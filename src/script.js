import "./CSS/normalize.css";
import "./CSS/style.scss";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();

function init() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  // Sizes
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
  directionalLight.position.set(1.5, 4, 2);

  // Light helper
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1
  );

  scene.add(
    directionalLight
    //  ,directionalLightHelper
  );

  /**
   * objects
   */
  // Floor
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f0f5 });
  planeMaterial.metalness = 0;
  planeMaterial.roughness = 0.1;

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    planeMaterial
  );
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -0.501;
  plane.material.side = THREE.DoubleSide; // Render both sides
  scene.add(plane);

  // Cube
  const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  scene.add(cube);

  /**
   * Add your objects here...
   */

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(
    65,
    sizes.width / sizes.height,
    0.1,
    500
  );
  camera.position.set(-3, 2, 4);

  /**
   * Renderer
   */
  const canvas = document.querySelector("#webgl");

  const renderer = new THREE.WebGL1Renderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  /**
   * Controls
   */
  const controls = new OrbitControls(camera, canvas);
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
   * Shadows
   */
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  plane.receiveShadow = true;

  cube.castShadow = true;
  cube.receiveShadow = true;

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  // Optimize shadows
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 9;

  /**
   * rendering frames
   */
  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();
    // cameraHelper.update()

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }
  animate();
}
