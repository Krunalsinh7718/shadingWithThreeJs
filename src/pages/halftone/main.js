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
rendererParameters.clearColor = '#023047'
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
const backgroundFolder = gui.addFolder('Background');
backgroundFolder
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
materialParameters.color = '#219ebc';
materialParameters.shadowColor = '#ffb703';

materialParameters.lightColor = '#fb8500';

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        uShadeColor: new THREE.Uniform(new THREE.Color(materialParameters.shadeColor)),
        uResolution : new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uRepetation: new THREE.Uniform(110),
        uShadowColor : new THREE.Uniform(new THREE.Color(materialParameters.shadowColor)),
        uShadowLow : new THREE.Uniform(0.5),
        uShadowHigh : new THREE.Uniform(1.5),
        uShadowPattern : new THREE.Uniform(1),

        uLightRepetation: new THREE.Uniform(50),
        uLightColor : new THREE.Uniform(new THREE.Color(materialParameters.lightColor)),
        uLightLow : new THREE.Uniform(-0.8),
        uLightHigh : new THREE.Uniform(1.5),
        uLightPattern : new THREE.Uniform(2),
         
    }
});

//model folder
const modelFolder = gui.addFolder('Model');
modelFolder
.addColor(materialParameters, 'color')
.onChange(() => {
    material.uniforms.uColor.value.set(materialParameters.color)
})

//shadow folder
const shadowFolder = gui.addFolder('Shadow');

shadowFolder
.addColor(materialParameters, 'shadowColor')
.onChange(() => {
    material.uniforms.uShadowColor.value.set(materialParameters.shadowColor)
})
shadowFolder
.add(material.uniforms.uRepetation, 'value').min(10).max(200).step(1).name("Shadow Repetation");
shadowFolder
    .add(material.uniforms.uShadowLow, 'value').min(0).max(1).step(0.01).name("Shadow Low");
shadowFolder
    .add(material.uniforms.uShadowHigh, 'value').min(1).max(2).step(0.01).name("Shadow High");
shadowFolder.add( material.uniforms.uShadowPattern, 'value', { pattern1: 1, pattern2: 2, pattern3: 3, pattern4: 4 }).name("Pattern").onChange( value => {
		console.log( material.uniforms.uShadowPattern.value );
	} );

//light folder
const lightFolder = gui.addFolder('Light');
lightFolder
    .addColor(materialParameters, 'lightColor')
    .onChange(() => {
        material.uniforms.uLightColor.value.set(materialParameters.lightColor)
    })
lightFolder
    .add(material.uniforms.uLightRepetation, 'value').min(10).max(200).step(1).name("Light Repetation");
lightFolder
    .add(material.uniforms.uLightLow, 'value').min(-0.1).max(0.5).step(0.01).name("Light Low");
lightFolder
    .add(material.uniforms.uLightHigh, 'value').min(0).max(2).step(0.01).name("Light High");
lightFolder.add( material.uniforms.uLightPattern, 'value', { pattern1: 1, pattern2: 2, pattern3: 3, pattern4: 4 }).name("Pattern").onChange( value => {
		console.log( material.uniforms.uLightPattern.value );
	} );

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

