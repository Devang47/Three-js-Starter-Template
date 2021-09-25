import "./CSS/normalize.css";
import "./CSS/style.scss";
import * as CANNON from "cannon-es";
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

  const directionalLight = new THREE.PointLight(0xffffff, 10);
  directionalLight.position.set(1.5, 15, 10);

  const secondLight = new THREE.DirectionalLight(0xffffff, 4);
  secondLight.position.set(3, 15, -9);

  // Light helper
  // const directionalLightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  //   1
  // );

  scene.add(
    directionalLight
    //  ,directionalLightHelper
  );

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
  });

  const concreteMat = new CANNON.Material("concrete");
  const plasticMat = new CANNON.Material("plastic");

  const contactMaterial = new CANNON.ContactMaterial(concreteMat, plasticMat, {
    friction: 0.2,
    restitution: 0.7,
  });

  world.addContactMaterial(contactMaterial);
  world.defaultContactMaterial = contactMaterial;
  world.allowSleep = true;
  world.broadphase = new CANNON.SAPBroadphase(world);

  let cubePhysics = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  });
  cubePhysics.position.set(0.5, 1, 0);
  world.addBody(cubePhysics);

  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

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
  plane.position.y = 0;
  plane.material.side = THREE.DoubleSide; // Render both sides
  scene.add(plane);

  const boxObject = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
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

  // Objects

  function addObject(radius, position) {
    let sphereBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(radius),
    });
    sphereBody.position.copy(position);

    world.addBody(sphereBody);

    // Object
    const object = new THREE.Mesh(
      new THREE.SphereBufferGeometry(radius, 50, 50),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    object.position.copy(position)
    object.material.metalness = 0.5;
    object.material.roughness = 0.6;
    scene.add(object);
  }

  addObject(2, { x: 0, y: 10, z: 0 });

  /**
   * rendering frames
   */

  const clock = new THREE.Clock();
  let lastFrame = 0;

  function animate() {
    const elapsedTime = clock.getElapsedTime();
    lastFrame = elapsedTime - lastFrame;

    world.step(1 / 60, lastFrame);
    lastFrame = elapsedTime;

    controls.update();

    boxObject.position.copy(cubePhysics.position);
    boxObject.quaternion.copy(cubePhysics.quaternion);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
