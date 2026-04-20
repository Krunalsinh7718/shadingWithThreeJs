import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { getMeshesByName, applyMaterialByMeshName, applyMaterialByMaterialName, logSceneStructure } from "../../common-utility/common-functions.js";

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



//material setup
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uTime : new THREE.Uniform(0)
    },
    transparent: true,
    // side: THREE.DoubleSide,
    // depthWrite: false,
    // blending: THREE.AdditiveBlending,
});

//model
let model = null;
gltfLoader.load("/models/cactus/cactus2.glb", gltf => {
    model = gltf.scene;
    model.scale.set(0.25, 0.25, 0.25);
    // logSceneStructure(model);

    //  const meshes = [getMeshesByName(model, "cactus") ,  getMeshesByName(model, "Cylinder004")];
    //  console.log(meshes);
     //"Material.001"

     applyMaterialByMaterialName(model, "Material.001", material);
     applyMaterialByMaterialName(model, "Material.002", material);
     applyMaterialByMaterialName(model, "Material.003", material);
    
    scene.add(model);
})

// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

//light
const light = new THREE.AmbientLight("#fff", 1);
scene.add(light);




//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    //update uTime uniform
    material.uniforms.uTime.value = elapsedTime


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