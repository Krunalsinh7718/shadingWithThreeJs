import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'

//gui
const gui = new GUI({width: 340});
const debugObject = {};
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

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
const geometry = new THREE.PlaneGeometry(10, 10, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    transparent: true,
    uniforms: {
        uBigWaveElevation : { value : 0.2},
        uBigWaveFrequency : { value : new THREE.Vector2(4, 1.5)},
        uTime: {value : 0},
        uBigWaveSpeed: {value: 0.75},
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 5},
        uSmallWaveElevation: {value : 0.15},
        uSmallWaveFrequency : {value : 3.0},
        uSmallWaveSpeed: {value : 0.2},
        uSmallWaveIteration: {value : 3.0},
    }
    
});


gui.add(waterMaterial.uniforms.uBigWaveElevation, 'value').min(0).max(1).name("Big wave elevation");
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x').min(0).max(50).name("Big wave frequency x");
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y').min(0).max(50).name("Big wave frequency y");
gui.add(waterMaterial.uniforms.uBigWaveSpeed, 'value').min(0).max(50).name("Big wave speed");

gui.addColor(debugObject,'depthColor').onChange(e => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)});
gui.addColor(debugObject,'surfaceColor').onChange(e => {waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)});

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')


gui.add(waterMaterial.uniforms.uSmallWaveElevation, 'value').min(0).max(1).step(0.001).name('uSmallWaveElevation')
gui.add(waterMaterial.uniforms.uSmallWaveFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWaveFrequency')
gui.add(waterMaterial.uniforms.uSmallWaveSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWaveSpeed')
gui.add(waterMaterial.uniforms.uSmallWaveIteration, 'value').min(0).max(5).step(1).name('uSmallWaveIteration')

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