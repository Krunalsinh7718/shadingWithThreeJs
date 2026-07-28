import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import GUI from 'lil-gui'
import wobbleVertexShader from './shaders/custom-material/vertex.vert'
import wobbleFragmentShader from './shaders/custom-material/fragment.frag'
import wobblePointsVertexShader from './shaders/points-material/vertex.vert'
import wobblePointsFragmentShader from './shaders/points-material/fragment.frag'
import { vec3 } from 'three/tsl';
import { getMeshesByName } from "../../common-utility/common-functions.js";

//gui
const gui = new GUI({ width: 340 });
const debugObject = {};

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
const rgbeLoader = new RGBELoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Environment map
 */
rgbeLoader.load('/hdr/urban_alley_01_1k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.backgroundBlurriness = 0.5
    scene.environment = environmentMap
})

/**
 * Sliced model
 */
// Geometry
const geometry = new THREE.IcosahedronGeometry(2.5, 5)

// Material
const material = new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: '#858080'
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Plane
 */
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
)
plane.receiveShadow = true
plane.position.x = - 4
plane.position.y = - 3
plane.position.z = - 4
plane.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(plane)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.normalBias = 0.05
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)



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



//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

  
    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

