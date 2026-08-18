import GUI from 'lil-gui'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
// import slicedVertexShader from './shaders/sliced/vertex.vert'
// import slicedFragmentShader from './shaders/sliced/fragment.frag'



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

/**
 * Textures
 */
const bakedTexture = textureLoader.load('/images/portal/baked.jpg');
bakedTexture.flipY = false

/**
 * Materials
 */

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Model
let model = null
gltfLoader.load('/models/portal/portal.glb', (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
        // gltf.scene.scale.set(2, 2, 2)
        // gltf.scene.rotation.y = Math.PI * 0.5
        // scene.add(gltf.scene)
        child.material = bakedMaterial

    })
    scene.add(model)
})

//camera setup
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 4)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;



//animation loop
const clock = new THREE.Clock();
function animate() {
    
    const elapsedTime = clock.getElapsedTime();

    //update controls
    controls.update();


    // Render
    renderer.render(scene, camera)
}

