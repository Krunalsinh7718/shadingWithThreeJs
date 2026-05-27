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

    //update uResolution uniform
    material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

});

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

//renderer setup
const rendererParameters = {}
rendererParameters.clearColor = '#26132f'
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() => {
        renderer.setClearColor(rendererParameters.clearColor)
    })

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//material setup
const materialParameters = {}
materialParameters.color = '#ff794d';
materialParameters.shadowColor = '#8e19b8';
materialParameters.lightColor = '#e5ffe0';

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        uShadeColor: new THREE.Uniform(new THREE.Color(materialParameters.shadeColor)),
        uResolution : new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uRepetation: new THREE.Uniform(50),
        uShadowColor : new THREE.Uniform(new THREE.Color(materialParameters.shadowColor)),
        uLightRepetation: new THREE.Uniform(50),
        uLightColor : new THREE.Uniform(new THREE.Color(materialParameters.lightColor)),
    }
});
gui
    .addColor(materialParameters, 'color')
    .onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color)
    })

gui
    .addColor(materialParameters, 'shadowColor')
    .onChange(() => {
        material.uniforms.uShadowColor.value.set(materialParameters.shadowColor)
    })
gui
    .add(material.uniforms.uRepetation, 'value').min(10).max(200).step(1).name("Shadow Repetation");

gui
    .addColor(materialParameters, 'lightColor')
    .onChange(() => {
        material.uniforms.uLightColor.value.set(materialParameters.lightColor)
    })
gui
    .add(material.uniforms.uLightRepetation, 'value').min(10).max(200).step(1).name("Light Repetation");

//model
let model = null;
gltfLoader.load("/models/suzanne/suzanne.glb", gltf => {
    model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh)
            child.material = material
    })
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





//animation loop
const clock = new THREE.Clock();

function animate() {

    const elapsedTime = clock.getElapsedTime();

    if (model) {
        model.rotation.x = - elapsedTime * 0.1
        model.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

