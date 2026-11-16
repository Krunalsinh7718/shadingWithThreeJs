import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'

//gui
const gui = new GUI({width: 340});
const debugObject = {};

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(5, 5, 512, 512);
// Material
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {value : 0},

        
    }
    
});


// Mesh
const mesh = new THREE.Mesh(geometry, waterMaterial);
mesh.rotation.x = - Math.PI * 0.5;
scene.add(mesh);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    waterMaterial.uniforms.uTime.value = elapsedTime;

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