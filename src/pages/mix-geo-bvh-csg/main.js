import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import { Brush, Evaluator,
ADDITION,              // A ∪ B
SUBTRACTION,           // A - B
REVERSE_SUBTRACTION,   // B - A
DIFFERENCE,            // A ⊕ B
INTERSECTION           // A ∩ B
} from 'three-bvh-csg';
import cloud1VertexShader from './shaders/cloud/vertex.vert'
import cloud2VertexShader from './shaders/cloud2/vertex.vert'
import cloud1FragmentShader from './shaders/cloud/fragment.frag'
import cloud2FragmentShader from './shaders/cloud2/fragment.frag'


import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

//gui
const gui = new GUI();

//texture loader
const textureLoader = new THREE.TextureLoader();
const hdrLoader = new HDRLoader();

/**
 * Environment map
 */
hdrLoader.load('/hdr/spruit_sunrise.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.backgroundBlurriness = 0.5
    scene.environment = environmentMap
})

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 7.53, 12.05);
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

/**
 * Mix geomatry -----------------------------------------
 */


// Material
const debugObject = {
    waterSurfaceColor : "#e65656",
    waterDeepColor : "#e1ff00",
    sandColor: "#a781fd",
    grassColor: "#a9d0f9",
    rockColor: "#930173",
    snowColor: "#01f45e"
}

const uniforms = {
    uPositionFrequency: new THREE.Uniform(0.2),
    uStrength: new THREE.Uniform(2.0),
    uWarpFrequency: new THREE.Uniform(5.0),
    uWarpStrength: new THREE.Uniform(0.5),
    uTime: new THREE.Uniform(0),
    uTimeFrequency: new THREE.Uniform(0.2),
    
    uWaterSurfaceColor: new THREE.Uniform(new THREE.Color(debugObject.waterSurfaceColor)),
    uWaterDeepColor: new THREE.Uniform(new THREE.Color(debugObject.waterDeepColor)),
    uSandColor: new THREE.Uniform(new THREE.Color(debugObject.sandColor)),
    uGrassColor: new THREE.Uniform(new THREE.Color(debugObject.grassColor)),
    uRockColor: new THREE.Uniform(new THREE.Color(debugObject.rockColor)),
    uSnowColor: new THREE.Uniform(new THREE.Color(debugObject.snowColor)),
}

gui.add(uniforms.uPositionFrequency, 'value', 0, 1, 0.001).name('uPositionFrequency')
gui.add(uniforms.uStrength, 'value', 0, 10, 0.001).name('uStrength')
gui.add(uniforms.uWarpFrequency, 'value', 0, 10, 0.001).name('uWarpFrequency')
gui.add(uniforms.uWarpStrength, 'value', 0, 1, 0.001).name('uWarpStrength')
gui.add(uniforms.uTimeFrequency, 'value', 0, 1, 0.001).name('uTimeFrequency')

gui.addColor(debugObject, 'waterSurfaceColor').name('uWaterSurfaceColor').onChange(e => {
    uniforms.uWaterSurfaceColor.value.set(debugObject.waterSurfaceColor);
});
gui.addColor(debugObject, 'waterDeepColor').name('uWaterDeepColor').onChange(e => {
    uniforms.uWaterDeepColor.value.set(debugObject.waterDeepColor);
});
gui.addColor(debugObject, 'sandColor').name('uSandColor').onChange(e => {
    uniforms.uSandColor.value.set(debugObject.sandColor);
});
gui.addColor(debugObject, 'grassColor').name('uGrassColor').onChange(e => {
    uniforms.uGrassColor.value.set(debugObject.grassColor);
});
gui.addColor(debugObject, 'rockColor').name('uRockColor').onChange(e => {
    uniforms.uRockColor.value.set(debugObject.rockColor);
});
gui.addColor(debugObject, 'snowColor').name('uSnowColor').onChange(e => {
    uniforms.uSnowColor.value.set(debugObject.snowColor);
});



const uniformsCloud = {
    uPositionFrequency: new THREE.Uniform(0.263),
    uStrength: new THREE.Uniform(1.273),
    uWarpFrequency: new THREE.Uniform(2.011),
    uWarpStrength: new THREE.Uniform(0.078),
    uTime: new THREE.Uniform(0),
    uTimeFrequency: new THREE.Uniform(0.2),
    
    uWaterSurfaceColor: new THREE.Uniform(new THREE.Color(debugObject.waterSurfaceColor)),
    uWaterDeepColor: new THREE.Uniform(new THREE.Color(debugObject.waterDeepColor)),
    uSandColor: new THREE.Uniform(new THREE.Color(debugObject.sandColor)),
    uGrassColor: new THREE.Uniform(new THREE.Color(debugObject.grassColor)),
    uRockColor: new THREE.Uniform(new THREE.Color(debugObject.rockColor)),
    uSnowColor: new THREE.Uniform(new THREE.Color(debugObject.snowColor)),
}

const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: cloud1VertexShader,
    fragmentShader: cloud1FragmentShader,
    uniforms: uniformsCloud,
    side: THREE.DoubleSide,
     // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#85d534'

});

const material2 = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: cloud2VertexShader,
    fragmentShader: cloud2FragmentShader,
    uniforms: uniformsCloud,
    side: THREE.DoubleSide,
     // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#85d534'

});

const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: cloud1VertexShader,
    uniforms: uniformsCloud,

    // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking,
})


// Brushes
const plane = new THREE.PlaneGeometry(10, 10, 500, 500);
const plane1 = new THREE.PlaneGeometry(10, 10, 500, 500);
plane.rotateX(Math.PI * -0.5);
plane1.rotateX(Math.PI * 0.5);
// plane1.updateProjectionMatrix();
// const plane2 = new THREE.BoxGeometry(10, 2, 10, 20, 20, 20);

const mesh = new THREE.Mesh(plane, material);
const mesh1 = new THREE.Mesh(plane1, material2);
mesh.receiveShadow = true;
mesh1.receiveShadow = true;
mesh.castShadow = true;
mesh1.castShadow = true;
mesh.depthMaterial = depthMaterial;
mesh1.depthMaterial = depthMaterial;

scene.add(mesh, mesh1);
mesh1.position.y = 5;

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight("#fff", 0.5);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(2048, 2048)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {
    // console.log(camera.position);
    
    const elapsedTime = clock.getElapsedTime();

   uniforms.uTime.value = elapsedTime;
   uniformsCloud.uTime.value = elapsedTime;

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