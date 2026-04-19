import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

//gui
const gui = new GUI();
const parameters = {};
parameters.smokeColor = 'rgb(255,141,10)';

//loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(8, 10, 12)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//model

gltfLoader.load("/models/table-coffee-mug/bakedModel.glb", gltf => {
    console.log( gltf.scene.getObjectByName('baked'));
     gltf.scene.getObjectByName('baked').material.map.anisotropy = 8;
   
    scene.add(gltf.scene);
    
})

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);
geometry.translate(0,0.5,0);
geometry.scale(1.5,6,1.5);


// Material
const perlinNoiceTexture = textureLoader.load('/images/perlin-noice/perlin.png');
perlinNoiceTexture.wrapS = THREE.RepeatWrapping;
perlinNoiceTexture.wrapT = THREE.RepeatWrapping;
const material = new THREE.ShaderMaterial({
    color: 'cyan',
    transparent: true,
    // wireframe: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uPerlinTexture : new THREE.Uniform(perlinNoiceTexture),
        uTime: new THREE.Uniform(0),
        uSmokeIntensity : new THREE.Uniform(0.4),
        uSmokeColor : new THREE.Uniform(new THREE.Color(parameters.smokeColor)),
        uSmokeSpeedY : new THREE.Uniform(0.005),
        uSmokeSpeedXZ : new THREE.Uniform(0.01),
        uSmokeRadiusXZ : new THREE.Uniform(10),
        uTwistRandomness : new THREE.Uniform(0.2),
    }
    
});
gui.add(material.uniforms.uSmokeIntensity,"value").min(0.2).max(0.8).step(0.01).name("Smoke Intensity");
gui.add(material.uniforms.uSmokeSpeedY,"value").min(0.0005).max(0.05).step(0.0001).name("Smoke Speed Y");
gui.add(material.uniforms.uSmokeSpeedXZ,"value").min(0.005).max(0.06).step(0.001).name("Smoke Speed XZ");
gui.add(material.uniforms.uSmokeRadiusXZ,"value").min(5).max(20).step(0.001).name("Smoke Radius XZ");
gui.add(material.uniforms.uTwistRandomness,"value").min(0.05).max(0.9).step(0.001).name("Smoke Random Twist");
gui.addColor(parameters, 'smokeColor').name("Smoke Color").onChange(color => {
    material.uniforms.uSmokeColor.value.set(parameters.smokeColor);
})

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 1.83;
scene.add(mesh);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    //uTime
    material.uniforms.uTime.value = elapsedTime;

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