import "./CSS/normalize.css";
import "./CSS/style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();

function init() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

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
  directionalLight.position.set(10, 15, -9);

  // Lighthelper;
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1
  );

  scene.add(directionalLight, directionalLightHelper);

  /**
   * objects
   */
  // Floor
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  planeMaterial.metalness = 0.1;
  planeMaterial.roughness = 0.3;

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    planeMaterial
  );
  plane.rotation.x = Math.PI / 2;
  plane.position.y = 0;
  plane.material.side = THREE.DoubleSide; // Render both sides
  scene.add(plane);

  const boxObject = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  boxObject.position.y = 1;
  scene.add(boxObject);

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    500
  );
  camera.position.set(-3, 4, 15);

  /**
   * Renderer
   */
  const canvas = document.querySelector("#webgl");

  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

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

  boxObject.castShadow = true;
  boxObject.receiveShadow = true;

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.lookAt(new THREE.Vector3());

  /**
   * rendering frames
   */

  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    directionalLight.position.x = 10 * Math.sin(elapsedTime * 0.5);
    directionalLight.position.z = 10 * Math.cos(elapsedTime * 0.5);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
