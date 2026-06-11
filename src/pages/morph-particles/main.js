import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import particlesVertexShader from './shaders/vertex.vert'
import particlesFragmentShader from './shaders/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import gsap from 'gsap';
import { getMeshesByName } from '../../common-utility/common-functions';

//gui
const gui = new GUI();
const debugObject = {}

//loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    if (particles)
        particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2.0943266285053173, 0.36571717305067314, 1.0602807802484266)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#160920';
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * Particles
 */
let particles = {};

gltfLoader.load("/models/frog-prince/frog-prince.glb", gltf => {
    
    particles.index = 0;
    particles.translate = -1;
    console.log(particles.translate);
    
    
    const modelWorld = gltf.scene;
    scene.add(modelWorld);
    modelWorld.translateY(particles.translate);
    
    particles.frog = getMeshesByName(modelWorld, 'frog')[0];
    particles.frog.visible = false;
    particles.frogPosition = particles.frog.geometry.attributes.position;
    particles.base = getMeshesByName(modelWorld, 'base')[0];
    particles.prince = getMeshesByName(modelWorld, 'prince')[0];
    particles.prince.visible = false;
    particles.princePosition = particles.prince.geometry.attributes.position;
    
    particles.maxCount = 0;
    
    for (const position of [particles.frogPosition, particles.princePosition]) {
        if (position.count > particles.maxCount) {
            particles.maxCount = position.count;
        }
    }
    particles.positions = [];
    for (const position of [particles.frogPosition, particles.princePosition]) {
        const originalArray = position.array;
        const newArray = new Float32Array(particles.maxCount * 3);

        for (let i = 0; i < particles.maxCount; i++) {
            const i3 = i * 3;

            if (i3 < originalArray.length) {
                newArray[i3 + 0] = originalArray[i3 + 0];
                newArray[i3 + 1] = originalArray[i3 + 1];
                newArray[i3 + 2] = originalArray[i3 + 2];
            } else {
                const randomIndex = Math.floor(position.count * Math.random()) * 3;
                newArray[i3 + 0] = originalArray[randomIndex + 0];
                newArray[i3 + 1] = originalArray[randomIndex + 1];
                newArray[i3 + 2] = originalArray[randomIndex + 2];
            }
        }
        particles.positions.push(new THREE.BufferAttribute(newArray, 3));
    }
    const sizesArray = new Float32Array(particles.maxCount);
    for (let i = 0; i < particles.maxCount; i++) {
        sizesArray[i] = Math.random();
        
    }
    console.log("particle pos", particles.positions);
    

    particles.geometry = new THREE.BufferGeometry(3);
    particles.geometry.setAttribute('position', particles.positions[0]);
    particles.geometry.setAttribute('aPositionTarget', particles.positions[1]);
    particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1));
    particles.geometry.setIndex(null);

    // Material
    particles.uColorA = "#f00505";
    particles.uColorB = "#0a17d1";
    particles.material = new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms:
        {
            uSize: new THREE.Uniform(0.01),
            uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
            uProgress: new THREE.Uniform(0),
            uColorA: new THREE.Uniform(new THREE.Color(particles.uColorA)),
            uColorB: new THREE.Uniform(new THREE.Color(particles.uColorB)),
        }
    })

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material)
    particles.points.translateY(particles.translate);
    particles.points.frustumCulled = false
    scene.add(particles.points)

    gui.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001).name('uProgress').listen()



   


})

window.addEventListener('mousemove', e => {
    // console.log(camera.position);
    
})
const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 5);
dir.position.set(5, 5, 5);
// scene.add(dir);

//animation loop
function animate() {

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}
