import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'

//gui
const gui = new GUI({width: 340});


//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//GLTF loader
const gltfLoader = new GLTFLoader();

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

//light
const light = new THREE.AmbientLight("#fff", 10);
scene.add(light);

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//load model
gltfLoader.load("/models/car/scene.gltf", e => {
    const car = e.scenes[0];
    car.scale.set(0.3,0.3,0.3);
    console.log(car);
    
    scene.add(car);
})


//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

   

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