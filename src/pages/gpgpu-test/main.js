import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import gpgpuParticlesShader from "./shaders/gpgpu/particles.glsl";
import particlesVertexShader from './shaders/particles/vertex.vert'
import particlesFragmentShader from './shaders/particles/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { getMeshesByName, applyMaterialByMeshName, applyMaterialByMaterialName, logSceneStructure } from "../../common-utility/common-functions.js";
import { isEmptyObject } from '../../common-utility/common-functions.js';

//gui
const gui = new GUI();
const parameters = {};
const gpgpu = {}
const debugObject = {};


//loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

//handle window resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Materials
    particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio)

});

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(20, 10, 20)
scene.add(camera)

//renderer setup
const clock = new THREE.Clock();
let previousTime = 0;
debugObject.clearColor = '#29191f'

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(debugObject.clearColor)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * Load model
 */
// let model = null;
// gltfLoader.load("/models/house/house.glb", gltf => {
//     model = gltf.scene;
//     console.log(model);
//     model.scale.set(0.1, 0.1, 0.1);
//     scene.add(model);
// })

const gltf = await gltfLoader.loadAsync('/models/house/house.glb');
gltf.scene.scale.set(0.001, 0.001, 0.001);


const houseBaseModal = getMeshesByName(gltf.scene, "test_house_walls_1_test_house_0")[0];
const houseRoofModal = getMeshesByName(gltf.scene, "test_house_walls_1_test_house_0001")[0];
scene.add(houseBaseModal)


/**
 * Base geometry
 */
const baseGeometry = {}
baseGeometry.instance = houseRoofModal.geometry;
baseGeometry.count = baseGeometry.instance.attributes.position.count

// console.log(baseGeometry.instance);

/**
 * GPU Compute
 */
// Setup	
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count))
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer)
// console.log(gpgpu.computation);



/**
 * Particles
*/
const particles = {};
particles.geometry = new THREE.BufferGeometry();
particles.geometry.setDrawRange(0, baseGeometry.count);




// Base particles
const baseParticleTexture = gpgpu.computation.createTexture()

for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    baseParticleTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0];
    baseParticleTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1];
    baseParticleTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2];
    baseParticleTexture.image.data[i4 + 3] = 0;
}
const particlesUvArray = new Float32Array(baseGeometry.count * 2)
const sizesArray = new Float32Array(baseGeometry.count);


for (let y = 0; y < gpgpu.size; y++) {
    for (let x = 0; x < gpgpu.size; x++) {
        const i = (y * gpgpu.size + x)
        const i2 = i * 2

        // Particles UV
        const uvX = (x + 0.5) / gpgpu.size
        const uvY = (y + 0.5) / gpgpu.size

        particlesUvArray[i2 + 0] = uvX;
        particlesUvArray[i2 + 1] = uvY;

        //size
        sizesArray[i] = Math.random();
    }
}

// Geometry
particles.geometry = new THREE.SphereGeometry(3)
particles.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2));
particles.geometry.setAttribute('aColor', baseGeometry.instance.attributes.color)
particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1));


// Particles variable
gpgpu.particlesVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticlesShader, baseParticleTexture)
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [gpgpu.particlesVariable])

// Init
gpgpu.computation.init()

// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms:
    {
        uSize: new THREE.Uniform(0.01),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio))
    }
})

// Points
particles.points = new THREE.Points(baseGeometry.instance, particles.material)
scene.add(particles.points)

/**
 * Debug
 */
gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
        map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
    })
)
gpgpu.debug.position.x = 3
scene.add(gpgpu.debug)
/**
 * Tweaks
 */
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
gui.add(particles.material.uniforms.uSize, 'value').min(0).max(5).step(0.001).name('uSize')


const ambiantLight = new THREE.AmbientLight("#fff", 1);
scene.add(ambiantLight);


//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime;

    if (gpgpu && !isEmptyObject(gpgpu)) {

        // GPGPU Update
        gpgpu.computation.compute()
    }



    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

