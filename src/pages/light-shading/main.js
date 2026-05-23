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

});

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 4, 4)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//material setup
const materialParameters = {}
materialParameters.color = '#ffffff'
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
       uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
       uDirLightPosition : new THREE.Uniform(new THREE.Vector3(0))
    }
});


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

//light helper
const dirLightRadius = 6;
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
)
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.set(0, 0, dirLightRadius)
scene.add(directionalLightHelper)


const pointLightHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial()
)
pointLightHelper.material.color.setRGB(1.0, 0.1, 0.1);
pointLightHelper.position.set(0, 2.5, 0);
scene.add(pointLightHelper);






const clock = new THREE.Clock();

//animation loop
function animateDirectionLight(time){
    directionalLightHelper.position.set(
        Math.sin(time * 0.1) * dirLightRadius,
        0,
        Math.cos(time * 0.1) * dirLightRadius
    )
    material.uniforms.uDirLightPosition.value.set(directionalLightHelper.position);
    // console.log(directionalLightHelper.position);
    
}
function animate() {

    const elapsedTime = clock.getElapsedTime();

    if(model)
    {
        model.rotation.x = - elapsedTime * 0.1
        model.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2


    animateDirectionLight(elapsedTime)



    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

