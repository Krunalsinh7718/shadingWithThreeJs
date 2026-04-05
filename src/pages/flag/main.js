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
camera.position.set(0.5, 1, 1)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 132, 132);
const count = geometry.attributes.position.count;
const randoms1 = new Float32Array(count);
const randoms2 = new Float32Array(count);
const randoms3 = new Float32Array(count);

for (let i = 0; i < count; i++) {
    randoms1[i] = Math.random();
    randoms2[i] = Math.random();
    randoms3[i] = Math.random();
}
geometry.setAttribute('aRandom1', new THREE.BufferAttribute(randoms1, 1))
geometry.setAttribute('aRandom2', new THREE.BufferAttribute(randoms2, 1))
geometry.setAttribute('aRandom3', new THREE.BufferAttribute(randoms3, 1))
// console.log(geometry);



// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
     transparent: true,
     uniforms : {
        uFrequency : {value : new THREE.Vector2(10,5)},
       
        
        uTime : {value: 0},
        uColor: {value: new THREE.Color('orange')},
        uTexture : {value : flagTexture}
     }
});
// console.log(material);

gui.add(material.uniforms.uFrequency.value, "x").max(50).min(0).step(1).name("Frequency X");
gui.add(material.uniforms.uFrequency.value, "y").max(50).min(0).step(1).name("Frequency Y");



// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
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