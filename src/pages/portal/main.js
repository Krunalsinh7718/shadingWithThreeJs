import GUI from 'lil-gui'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.vert'
import firefliesFragmentShader from './shaders/fireflies/fragment.frag'



//gui
const gui = new GUI({ width: 400 });

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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

//scene setup
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)


//camera setup
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 4)
scene.add(camera)

//renderer setup
const rendererParameters = { color : "#241100"}
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(rendererParameters.color);
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);
gui.addColor(rendererParameters, 'color').onChange( e => {
    renderer.setClearColor(rendererParameters.color);
})

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


/**
 * Textures
 */
// const bakedTexture = textureLoader.load('/images/portal/baked.jpg');
const bakedTexture = textureLoader.load('/images/house/baked-house.jpg');
bakedTexture.colorSpace = THREE.SRGBColorSpace;
bakedTexture.flipY = false

/**
 * Materials
 */

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
//light materials
//lamp light #FF9F4CFF
//house out light #FF4E00FF
//house in light #D7FF0BFF
//house door light #D7FF0BFF
//inset light #FF4900FF
const lampLightMaterial = new THREE.MeshBasicMaterial({ color: "#FF9F4CFF" });
const houseInLightMaterial = new THREE.MeshBasicMaterial({ color: "#D7FF0BFF" });
const houseOutLightMaterial = new THREE.MeshBasicMaterial({ color: "#FF4E00FF" });
const houseDoorLightMaterial = new THREE.MeshBasicMaterial({ color: "#D7FF0BFF" });
const insectLightMaterial = new THREE.MeshBasicMaterial({ color: "#FF4900FF" });

// Model
let model = null
// gltfLoader.load('/models/portal/portal.glb', (gltf) => {
gltfLoader.load('/models/house/house.glb', (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
        // gltf.scene.scale.set(2, 2, 2)
        // gltf.scene.rotation.y = Math.PI * 0.5
        // scene.add(gltf.scene)
        child.material = bakedMaterial

    })
    const lampLight1 = model.children.find(child => child.name === "lampLight1");
    const lampLight2 = model.children.find(child => child.name === "lampLight2");
    const houseInLight = model.children.find(child => child.name === "houseInLight");
    const houseOutLight = model.children.find(child => child.name === "houseOutLight");
    const doorLight = model.children.find(child => child.name === "doorLight");
    const insectLight1 = model.children.find(child => child.name === "insectLight1");
    const insectLight2 = model.children.find(child => child.name === "insectLight2");
    const insectLight3 = model.children.find(child => child.name === "insectLight3");
    const insectLight4 = model.children.find(child => child.name === "insectLight4");
    const insectLight5 = model.children.find(child => child.name === "insectLight5");
    const house = model.children.find(child => child.name === "house");
    console.log(house);


    lampLight1.material = lampLightMaterial;
    lampLight2.material = lampLightMaterial;
    houseInLight.material = houseInLightMaterial;
    houseOutLight.material = houseOutLightMaterial;
    doorLight.material = houseDoorLightMaterial;
    insectLight1.material = insectLightMaterial;
    insectLight2.material = insectLightMaterial;
    insectLight3.material = insectLightMaterial;
    insectLight4.material = insectLightMaterial;
    insectLight5.material = insectLightMaterial;
    house.material.side = THREE.DoubleSide;

    scene.add(model)
})
//firee flies
const firefliesCount = 30;
let firefliesArr = new Float32Array(firefliesCount * 3);
let fireRandSizeArr = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
    const i3 = i * 3;

    firefliesArr[i3 + 0] = (Math.random() - 0.1) * 2;
    firefliesArr[i3 + 1] = Math.random() * 1.5 + 0.1;
    firefliesArr[i3 + 2] = (Math.random() - 0.5) * 2;

    fireRandSizeArr[i] = Math.random();
}

const fireFliesGeo = new THREE.BufferGeometry();
fireFliesGeo.setAttribute('position', new THREE.BufferAttribute(firefliesArr, 3));
fireFliesGeo.setAttribute('aSize', new THREE.BufferAttribute(fireRandSizeArr, 1));

const fireFliesMaterial = new THREE.ShaderMaterial({
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    uniforms: {
        uSize: new THREE.Uniform(30 * renderer.getPixelRatio()),
        uTime: new THREE.Uniform(0)
    }
})
const firefliesMesh = new THREE.Points(fireFliesGeo, fireFliesMaterial);
scene.add(firefliesMesh)

gui.add(fireFliesMaterial.uniforms.uSize, 'value').min(10).max(50).onChange(e => {
    fireFliesMaterial.uniforms.uSize.value = e * renderer.getPixelRatio();
})

//animation loop
const clock = new THREE.Clock();
function animate() {

    const elapsedTime = clock.getElapsedTime();

    fireFliesMaterial.uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();


    // Render
    renderer.render(scene, camera)
}

