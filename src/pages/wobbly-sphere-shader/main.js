import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import GUI from 'lil-gui'
import wobbleVertexShader from './shaders/vertex.vert'
import wobbleFragmentShader from './shaders/fragment.frag'
import { vec3 } from 'three/tsl';

//gui
const gui = new GUI({ width: 340 });
const debugObject = {};
debugObject.rotating = true;
gui.add(debugObject, 'rotating').name("rotating")

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const rgbeLoader = new RGBELoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Environment map
 */
// rgbeLoader.load('/hdr/urban_alley_01_1k.hdr', (environmentMap) =>
// {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     scene.background = environmentMap
//     scene.environment = environmentMap
// })

//skybox
textureLoader.load(
    '/images/space-ship/space-ship-skymap.png',
    (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping =
            THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
    }
);


//camera setup
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(13, - 3, - 5)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

/**
 * Wobble
 */

//materials
debugObject.colorA = "#7a7cc9";
debugObject.colorB = "#ff00d0";
const uniforms = {
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.5),
    uTimeFrequency: new THREE.Uniform(0.4),
    uStrenth: new THREE.Uniform(0.3),

    uWarpPositionFrequency: new THREE.Uniform(0.38),
    uWarpTimeFrequency: new THREE.Uniform(0.12),
    uWarpStrenth: new THREE.Uniform(1.7),

    uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),
    uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB)),
}
// Material
const material = new CustomShaderMaterial({
    //CSM
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: wobbleVertexShader,
    fragmentShader: wobbleFragmentShader,
    uniforms: uniforms,
    silent: true,
    //MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false
})

const depthMaterial = new CustomShaderMaterial({
    //CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: wobbleVertexShader,
    uniforms: uniforms,
    silent: true,

    //mesh depth packing
    depthPacking: THREE.RGBADepthPacking
})

const audioInfluance = {
    PositionFrequency: 0.005,
    Strenth: 0.01,
    WarpPositionFrequency: 0.005,
    WarpStrenth: 0.05
}


// Tweaks
gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency')
gui.add(uniforms.uWarpTimeFrequency, 'value', 0, 2, 0.001).name('uWarpTimeFrequency')

gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency')
gui.add(uniforms.uStrenth, 'value', 0, 2, 0.001).name('uStrenth')

gui.add(uniforms.uWarpPositionFrequency, 'value', 0, 2, 0.001).name('uWarpPositionFrequency')
gui.add(uniforms.uWarpStrenth, 'value', 0, 2, 0.001).name('uWarpStrenth')


gui.add(audioInfluance, 'PositionFrequency', 0, 0.009, 0.0001).name('uPositionFrequency Audio')
gui.add(audioInfluance, 'Strenth', 0, 0.05, 0.0001).name('uStrenth Audio')

gui.add(audioInfluance, 'WarpPositionFrequency', 0, 2, 0.001).name('uWarpPositionFrequency Audio')
gui.add(audioInfluance, 'WarpStrenth', 0, 2, 0.001).name('uWarpStrenth Audio')



gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(material, 'roughness', 0, 1, 0.001)
gui.add(material, 'transmission', 0, 1, 0.001)
gui.add(material, 'ior', 0, 10, 0.001)
gui.add(material, 'thickness', 0, 10, 0.001)

gui.addColor(debugObject, 'colorA').name('colorA').onChange(e => {
    uniforms.uColorA.value.set(debugObject.colorA);
})
gui.addColor(debugObject, 'colorB').name('colorB').onChange(e => {
    uniforms.uColorB.value.set(debugObject.colorB);
})


// Geometry
let geometry = new THREE.IcosahedronGeometry(2.5, 50);
geometry = mergeVertices(geometry);
geometry.computeTangents();
console.log(geometry);


// Mesh
const wobble = new THREE.Mesh(geometry, material);
wobble.customDepthMaterial = depthMaterial;
wobble.receiveShadow = true
wobble.castShadow = true
scene.add(wobble)


//model
let model = null;
gltfLoader.load("/models/glass-container/glass-bottle.glb", gltf => {
    console.log(gltf.scene);

    model = gltf.scene;
    model.position.set(8.5, -8.5, 3.5);
    model.rotation.x = 0.049;
    model.rotation.y = 0.48;
    model.rotation.z = 0;

    model.traverse((child) => {
        // if (child.isMesh)

        // child.geometry = mergeVertices(child.geometry);
        // child.receiveShadow = true
        // child.castShadow = true
        // child.material = material;
        // child.customDepthMaterial = depthMaterial;
    })
    scene.add(model);
    // gui.add(model.position, 'x').min(-20).max(20).step(0.5);
    // gui.add(model.position, 'y').min(-20).max(20).step(0.5);
    // gui.add(model.position, 'z').min(-20).max(20).step(0.5);
    // gui.add(model.rotation, 'x').min(-3.14).max(3.14).step(0.01);
    // gui.add(model.rotation, 'y').min(-3.14).max(3.14).step(0.01);
    // gui.add(model.rotation, 'z').min(-3.14).max(3.14).step(0.01);
})


/**
 * Plane
 */
// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(30, 15, 15),
//     new THREE.MeshStandardMaterial()
// )
// plane.receiveShadow = true
// plane.rotation.y = Math.PI
// plane.position.y = - 3
// plane.position.z = 5
// plane.position.x = 5
// scene.add(plane)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)


const directionalLight1 = new THREE.DirectionalLight('#ffffff', 3)
directionalLight1.castShadow = true
directionalLight1.shadow.mapSize.set(1024, 1024)
directionalLight1.shadow.camera.far = 15
directionalLight1.shadow.normalBias = 0.05
directionalLight1.position.set(8, 2, -2.25)
directionalLight1.target.position.set(10, -10, 10);
scene.add(directionalLight1)
scene.add(directionalLight1.target)


// const shadowCameraHelper = new THREE.CameraHelper(directionalLight1.shadow.camera);
// scene.add(shadowCameraHelper);


/**
 * audio
 */
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);
// create an Audio source
const sound = new THREE.Audio(listener);
 const audioContext = THREE.AudioContext.getContext();
console.log(audioContext);

const soundCTrl = {
    playPause: function () {
        console.log("check play pause", sound);
        if (!sound.isPlaying) {
            sound.play();
        } else {
            
            sound.pause();
        }
    }
}

gui.add(soundCTrl, 'playPause');

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/audio/audio1/audio3.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
});
// create an AudioAnalyser, passing in the sound and desired fftSize
const analyser = new THREE.AudioAnalyser(sound, 32);
// get the average frequency of the sound
const data = analyser.getAverageFrequency();


//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    uniforms.uTime.value = elapsedTime;

    // console.log(analyser.getAverageFrequency());
    // console.log("is playing", sound.isPlaying);
    // console.log("sound duration", sound.duration);
    
    if (sound.isPlaying  && audioContext.state !== "suspended") {

        uniforms.uPositionFrequency.value = analyser.getAverageFrequency() * audioInfluance.PositionFrequency;
        uniforms.uStrenth.value = analyser.getAverageFrequency() * audioInfluance.Strenth;
        uniforms.uWarpPositionFrequency.value = analyser.getAverageFrequency() * audioInfluance.WarpPositionFrequency;
        uniforms.uWarpStrenth = analyser.getAverageFrequency() * audioInfluance.WarpStrenth;

    }

    //rotate camera
    if(debugObject.rotating){
        camera.position.set(
            Math.sin(elapsedTime * 0.05) * 26,
            -3,
            Math.cos(elapsedTime * 0.05) * 26,
        )
        camera.lookAt(wobble.position);
    }

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
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});