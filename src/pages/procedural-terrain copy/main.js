import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import surfaceVertexShader from './shaders/surface/vertex.vert'
import surfaceFragmentShader from './shaders/surface/fragment.frag'
import cloudVertexShader from './shaders/cloud/vertex.vert'
import cloudFragmentShader from './shaders/cloud/fragment.frag'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

//gui
const gui = new GUI();



//texture loader
const textureLoader = new THREE.TextureLoader();
const rgbeLoader = new RGBELoader();

/**
 * Environment map
 */
rgbeLoader.load('/hdr/spruit_sunrise.hdr', (environmentMap) =>
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
camera.position.set(0, 5, 8);
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);

geometry.rotateX(Math.PI / -2);
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

const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: surfaceVertexShader,
    fragmentShader: surfaceFragmentShader,
    uniforms: uniforms,
     // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.5,
    color: '#85d534'

});

const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: surfaceVertexShader,
    uniforms: uniforms,

    // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking,
})

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.customDepthMaterial = depthMaterial;
mesh.receiveShadow = true;
mesh.castShadow = true;
scene.add(mesh);

//water
const water = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.3
    })
)
water.rotation.x = - Math.PI * 0.5
water.position.y = - 0.1
scene.add(water)


gui.add(water.material, 'metalness', 0, 1, 0.001)
gui.add(water.material, 'roughness', 0, 1, 0.001)
gui.add(water.material, 'transmission', 0, 1, 0.001)
gui.add(water.material, 'ior', 0, 10, 0.001)
gui.add(water.material, 'thickness', 0, 10, 0.001)

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

    const elapsedTime = clock.getElapsedTime();

    //update light position
    // pointLight.position.set(
    //     Math.sin(elapsedTime * 0.1) * 10, 
    //     2 ,
    //     Math.cos(elapsedTime * 0.1) * 10
    // );

    //update uTime material
    uniforms.uTime.value = elapsedTime;

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