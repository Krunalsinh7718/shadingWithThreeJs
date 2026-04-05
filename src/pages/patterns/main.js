import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert?raw'
import testFragmentShader from './shaders/fragment.frag?raw'

//gui
const gui = new GUI();

//texture loader
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/images/flag/india-flag.png");

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 1)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 132, 132);

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
     transparent: true,
     uniforms : {
        uTime : {value: 0},
        uCtrl1 : {value : 0.4},
        uCtrl2 : {value : 0.8},
        uCtrl3 : {value : 0.2},
     
     }
});

gui.add(material.uniforms.uCtrl1, "value").min(0).max(1).step(0.01).name("ctrl1");
gui.add(material.uniforms.uCtrl2, "value").min(0).max(1).step(0.01).name("ctrl2");
gui.add(material.uniforms.uCtrl3, "value").min(0).max(1).step(0.01).name("ctrl3");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    //update uniform
    material.uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});