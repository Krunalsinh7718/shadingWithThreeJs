import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import particlesVertexShader from './shaders/vertex.vert'
import particlesFragmentShader from './shaders/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import gsap from 'gsap';

//gui
const gui = new GUI();
const debugObject = {}

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
camera.position.set(0, 0, 8 * 2)
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

gltfLoader.load("/models/particle-models/models.glb", gltf => {

    particles.index = 0;

    const positions = gltf.scene.children.map(child => child.geometry.attributes.position);
    particles.maxCount = 0;

    for (const position of positions) {
        if (position.count > particles.maxCount) {
            particles.maxCount = position.count;
        }
    }

    particles.positions = [];
    for (const position of positions) {
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

    particles.geometry = new THREE.BufferGeometry(3);
    particles.geometry.setAttribute('position', particles.positions[1]);
    particles.geometry.setAttribute('aPositionTarget', particles.positions[3]);
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
            uSize: new THREE.Uniform(0.1),
            uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
            uProgress: new THREE.Uniform(0),
            uColorA: new THREE.Uniform(new THREE.Color(particles.uColorA)),
            uColorB: new THREE.Uniform(new THREE.Color(particles.uColorB)),
        }
    })
    gui.addColor(particles, 'uColorA').onChange( e => {
        particles.material.uniforms.uColorA.value.set(particles.uColorA);
    })
    gui.addColor(particles, 'uColorB').onChange( e => {
        particles.material.uniforms.uColorB.value.set(particles.uColorB);
    })

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material);
    particles.points.frustumCulled = false;
    scene.add(particles.points);

    //method
    particles.morph = (index) => {
        //update attributes
        particles.geometry.attributes.position = particles.positions[index];
        particles.geometry.attributes.aPositionTarget = particles.positions[
           index > 2 ? 0 :  index+1
        ];

        //animate uProgress
        gsap.fromTo(particles.material.uniforms.uProgress, 
            { value: 0 }, 
            { value: 1, duration: 3, ease : 'linear' }
        )

        //save index
        // particles.index = index;

    }
    particles.morph0 = () => {particles.morph(0)}
    particles.morph1 = () => {particles.morph(1)}
    particles.morph2 = () => {particles.morph(2)}
    particles.morph3 = () => {particles.morph(3)}

    gui.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001).listen();

    gui.add(particles, 'morph0');
    gui.add(particles, 'morph1');
    gui.add(particles, 'morph2');
    gui.add(particles, 'morph3');

})

//animation loop
function animate() {

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}
