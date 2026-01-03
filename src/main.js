import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* SCENE */
const scene = new THREE.Scene();

/* CAMERA */
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.6, 6);
camera.lookAt(0, 0.8, 0);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

/* LIGHTS */
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const keyLight = new THREE.SpotLight(0xffffff, 2.1, 25, Math.PI / 6, 0.6);
keyLight.position.set(3, 6, 4);
scene.add(keyLight);

const purpleLight = new THREE.PointLight(0xff00ff, 3.2, 15);
purpleLight.position.set(1.6, -1.4, 0);
scene.add(purpleLight);

/* GLOW */
const glow = new THREE.Mesh(
  new THREE.CircleGeometry(0.9, 64),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.25,
  })
);
glow.rotation.x = -Math.PI / 2;
glow.position.set(1.6, -1.55, 0);
scene.add(glow);

/* ROBOT */
let robot;
const loader = new GLTFLoader();

loader.load("/robot.glb", (gltf) => {
  robot = gltf.scene;
  robot.scale.set(0.5, 0.5, 0.5);
  robot.position.set(1.6, -0.55, 0);
  scene.add(robot);
});

/* INTERACTION */
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.9;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.7;
});

/* ANIMATION */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  purpleLight.intensity = 3 + Math.sin(t * 2) * 0.6;
  glow.material.opacity = 0.22 + Math.sin(t * 2) * 0.08;

  if (robot) {
    if (window.panelOpen) {
      robot.rotation.y += (-0.6 - robot.rotation.y) * 0.08;
    } else {
      robot.rotation.y += (mouseX - robot.rotation.y) * 0.08;
    }

    robot.rotation.x += (mouseY - robot.rotation.x) * 0.08;
    robot.rotation.z = mouseX * 0.15;
    robot.position.y = -0.55 + Math.sin(t * 0.9) * 0.05;
  }

  renderer.render(scene, camera);
}

animate();

/* RESIZE */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
