import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.vert'
import earthFragmentShader from './shaders/earth/fragment.frag'
import atmosphereVertexShader from './shaders/atmosphere/vertex.vert'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { getMeshesByName, applyMaterialByMeshName, applyMaterialByMaterialName, logSceneStructure } from "../../common-utility/common-functions.js";

//gui
const gui = new GUI();
const parameters = {};

//loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

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
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor('#111')
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * Earth
 */
//texture
const earthDayTexture = textureLoader.load("/images/earth/2k_earth_daymap.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;
const earthNightTexture = textureLoader.load("/images/earth/2k_earth_nightmap.jpg");
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;
const specularCloudTexture = textureLoader.load("/images/earth/specularClouds.jpg");
specularCloudTexture.colorSpace = THREE.SRGBColorSpace;

// Sphere
const debugParameters = {};
debugParameters.atmosphereDayColor = "#0084ff";
debugParameters.atmosphereTwilightColor = "#ff7b00";

const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms : {
        uEarthDayTexture : new THREE.Uniform(earthDayTexture),
        uEarthNightTexture : new THREE.Uniform(earthNightTexture),
        uSpecularCloudTexture : new THREE.Uniform(specularCloudTexture),
        uSunDirection : new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
        uCloudDensity: new THREE.Uniform(0),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(debugParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(debugParameters.atmosphereTwilightColor))
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

gui.add(earthMaterial.uniforms.uCloudDensity, 'value').min(0).max(0.6).step(0.01).name('Cloud Density');
gui.addColor(debugParameters, 'atmosphereDayColor').onChange( e => earthMaterial.uniforms.uAtmosphereDayColor.value.set(debugParameters.atmosphereDayColor));
gui.addColor(debugParameters, 'atmosphereTwilightColor').onChange( e => earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(debugParameters.atmosphereTwilightColor));

//sun
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.2),
    new THREE.MeshBasicMaterial()
)
scene.add(sun);
const sunPosition = new THREE.Vector3(0,0,0);
const sunDirection = new THREE.Spherical(1, Math.PI * 0.5, 0);

const updateSun = () => {
    //update sun position
    sunPosition.setFromSpherical(sunDirection);

    //update debug sun
    sun.position.copy(sunPosition).multiplyScalar(4);

    //update material
    earthMaterial.uniforms.uSunDirection.value.copy(sunPosition);
    console.log(earthMaterial.uniforms.uSunDirection.value);
    
}

updateSun();

gui.add(sunDirection, 'phi').min(0).max(Math.PI).onChange(updateSun);
gui.add(sunDirection, 'theta').min(-Math.PI).max(Math.PI).onChange(updateSun);

//animation loop
const clock = new THREE.Clock();

function animate() {

    const elapsedTime = clock.getElapsedTime();

    earth.rotation.y = elapsedTime * 0.5;

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

