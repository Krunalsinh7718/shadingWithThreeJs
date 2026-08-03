import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

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
camera.position.set(0, 5, 8);
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 600, 600);
geometry.rotateX(Math.PI / 2);
// Material

const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
     transparent: true,
    
});

const depthMaterial = new CustomShaderMaterial({
    // CSM
       baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,

     // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking


})



// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.customDepthMaterial = depthMaterial;

scene.add(mesh);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#fff", 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 200, 200);
pointLight.position.set(0, 2 ,2);
scene.add(pointLight);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();


    pointLight.position.set(
        Math.sin(elapsedTime * 0.1) * 10, 
        2 ,
        Math.cos(elapsedTime * 0.1) * 10);
    // mesh.position.x += elapsedTime * 0.0001;

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