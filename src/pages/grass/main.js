import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert?raw'
import testFragmentShader from './shaders/fragment.frag?raw'

/**
 * gui
 */
const gui = new GUI();

/**
 * texture loader
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/images/flag/india-flag.png");

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * scene setup
 */
const scene = new THREE.Scene();

/**
 * camera setup
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1.5, 4)
scene.add(camera)

/**
 * renderer setup
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

/**
 * controls setup
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * group
 */
const group = new THREE.Group();
scene.add( group );

/**
 * helper
 */
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

/**
 * grass field
 */
grassField = new GrassField();
scene.add( grassField );

/**
 * animation loop
 */
const clock = new THREE.Clock();
function animate() {

    const elapsedTime = clock.getElapsedTime();

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

/**
 * handle window resize
 */
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