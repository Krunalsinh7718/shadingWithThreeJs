import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.vert';
import earthFragmentShader from './shaders/earth/fragment.frag';

import starsVertexShader from './shaders/stars/vertex.vert';
import starsFragmentShader from './shaders/stars/fragment.frag';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

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
camera.position.x = 3.5
camera.position.y = 2
camera.position.z = 2
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
//Textures
const earthDayTexture = textureLoader.load("/images/earth/2k_earth_daymap.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;

const earthSpecularCloudTexture = textureLoader.load("/images/earth/specularClouds.jpg");
earthSpecularCloudTexture.anisotropy = 8;

// Sphere
const debugParameters = {};
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uSpecularCloudTexture: new THREE.Uniform(earthSpecularCloudTexture),
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)


//stars 
const starCounts = 50000;
const radius = 5;
const starPosAttrArr = new Float32Array(starCounts * 3);
const scalesArr = new Float32Array(starCounts * 1);
const pointsColorArr = new Float32Array(starCounts * 3);

for (let i = 0; i < starCounts; i++) {
    const i3 = i * 3;
    starPosAttrArr[i3] = (Math.random() - 0.5) * (200 + 150);
    starPosAttrArr[i3 + 1] = (Math.random() - 0.5) * (200 + 150);
    starPosAttrArr[i3 + 2] = (Math.random() - 0.5) * (200 + 150);

    pointsColorArr[i3    ] = 0.1 * radius;
    pointsColorArr[i3 + 1] = 1.0;
    pointsColorArr[i3 + 2] = 0.5 * radius;
    
    scalesArr[i] = Math.random();
}
// console.log(starsGeomatry);

const starsGeomatry = new THREE.BufferGeometry();
starsGeomatry.setAttribute('position',new THREE.BufferAttribute(starPosAttrArr, 3));
starsGeomatry.setAttribute('color', new THREE.BufferAttribute(pointsColorArr, 3));
starsGeomatry.setAttribute('scales', new THREE.BufferAttribute(scalesArr, 1));


const starsMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    vertexShader: starsVertexShader,
    fragmentShader: starsFragmentShader,
    uniforms: {
        uSize : new THREE.Uniform(30 * renderer.getPixelRatio())
    }
});
const stars = new THREE.Points(starsGeomatry, starsMaterial);
scene.add(stars);




//animation loop
const clock = new THREE.Clock();

function animate() {

    const elapsedTime = clock.getElapsedTime();

    // earth.rotation.y = elapsedTime * 0.1;

    stars.rotation.x = elapsedTime * 0.0005;
   

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

