import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import GUI from 'lil-gui'
import gpgpuParticlesShader  from "./shaders/gpgpu/particles.glsl";
import particleVertexShader from './shaders/particles/vertex.vert';
import particleFragmentShader from './shaders/particles/fragment.frag';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { isEmptyObject } from '../../common-utility/common-functions.js';


//gui
const gui = new GUI();
const parameters = {};
const gpgpu = {}

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
camera.position.set(4.5, 4, 11)
scene.add(camera)

//renderer setup
const clock = new THREE.Clock();
let previousTime = 0;
const debugObject = {};
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
const gltf = await gltfLoader.loadAsync('/models/ship/model.glb')
console.log(gltf);


/**
 * Base geometry
 */
const baseGeometry = {}
baseGeometry.instance = gltf.scene.children[0].geometry;
baseGeometry.count = baseGeometry.instance.attributes.position.count;

/**
 * GPU Compute
 */
// Setup
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer);

// Base particles
const baseParticleTexture = gpgpu.computation.createTexture();

for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    baseParticleTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0];
    baseParticleTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1];
    baseParticleTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2];
    baseParticleTexture.image.data[i4 + 3] = Math.random();
}

// Particles variable
gpgpu.particleVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticlesShader, baseParticleTexture);
gpgpu.computation.setVariableDependencies(gpgpu.particleVariable, [gpgpu.particleVariable]);

//uniforms
gpgpu.particleVariable.material.uniforms.uTime = new THREE.Uniform(0);
gpgpu.particleVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
gpgpu.particleVariable.material.uniforms.uBase = new THREE.Uniform(baseParticleTexture);
gpgpu.particleVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5);


//init
gpgpu.computation.init();

// Debug
gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
        map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particleVariable).texture
    })
)
gpgpu.debug.position.x = 3
scene.add(gpgpu.debug)

/**
 * Particles
 */
const particles = {};
particles.geometry = new THREE.BufferGeometry();
// console.log(baseGeometry.count);

particles.geometry.setDrawRange(0, baseGeometry.count);
// console.log(particles.geometry);

const particlesUvArray = new Float32Array(baseGeometry.count * 2)
const sizesArray = new Float32Array(baseGeometry.count)

for(let y = 0; y < gpgpu.size; y++)
{
    for(let x = 0; x < gpgpu.size; x++)
    {
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

particles.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2));
particles.geometry.setAttribute('aColor', baseGeometry.instance.attributes.color)
particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1));

// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms:
    {
        uSize: new THREE.Uniform(0.07),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uParticleTexture : new THREE.Uniform(),
    }
})

// Points
particles.points = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.points)

/**
 * Tweaks
 */
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
gui.add(particles.material.uniforms.uSize, 'value').min(0).max(0.2).step(0.001).name('uSize')
gui.add(gpgpu.particleVariable.material.uniforms.uFlowFieldInfluence, 'value').min(0).max(1).name("Flow Field Influance")




//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime;
    
    
    
    
    //update controls
    controls.update();
    
    if(gpgpu && !isEmptyObject(gpgpu)){
        
        //update uTime of particles
        gpgpu.particleVariable.material.uniforms.uTime.value = elapsedTime;
        
        //delta time
        gpgpu.particleVariable.material.uniforms.uDeltaTime.value = deltaTime;
        
        // GPGPU Update
        gpgpu.computation.compute();
    
        //update particle material uniform
        if(particles && !isEmptyObject(gpgpu)){
            particles.material.uniforms.uParticleTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particleVariable).texture;
        }
    }


    //render
    renderer.render(scene, camera);
}

