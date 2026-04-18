import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'

import { getMeshesByName, applyMaterialByMeshName, applyMaterialByMaterialName, logSceneStructure } from "../../common-utility/common-functions.js";

//gui
const gui = new GUI({ width: 340 });


//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//texture loader
const textureloader = new THREE.TextureLoader();

//GLTF loader
const gltfLoader = new GLTFLoader();

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

//light
const light = new THREE.AmbientLight("#fff", 1);
scene.add(light);

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
// scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

const spotLight = new THREE.SpotLight("#fff", 10, 5, Math.PI * 0.02, 0.1, 0.1)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true;
scene.add(spotLight)
// spotLight.target.position.x = 0
// scene.add(spotLight.target)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true

//plane
const planeGeo = new THREE.PlaneGeometry();
const planeMaterial = new THREE.MeshStandardMaterial({color: "#666"});
const plane = new THREE.Mesh(planeGeo, planeMaterial);
plane.receiveShadow  = true;
plane.rotation.x = - Math.PI / 2;
scene.add(plane);

//material
// const appleTexture = textureloader.load("/models/apple/textures/Material_35_baseColor.png");
// appleTexture.flipY = false;
// appleTexture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshStandardMaterial({
    color: "#599949",
    roughness : 0.1,
    metalness : 0.5
});
const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})
const customUniforms = {
    uTime: { value: 0 }
}
material.onBeforeCompile = (shader) => {
    // console.log(shader)
    shader.uniforms.uTime = customUniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace("#include <common>", `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle){
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
        }   
    `);

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        float angle = (sin(position.y + uTime)) * 1.0;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        transformed.xz = rotateMatrix * transformed.xz;

        // transformed.xz = vec2(
        //     transformed.x +  (sin(position.y + uTime * 4.0) * (position.y + 1.0) * 0.4) , 
        //     transformed.z +  (cos(position.y + uTime * 4.0) * (position.y + 1.0) * 0.4)
        // );

        
    `   
    )
}
depthMaterial.onBeforeCompile = (shader) => {
    // console.log(shader)
    shader.uniforms.uTime = customUniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace("#include <common>", `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle){
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
        }   
    `);
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
            #include <beginnormal_vertex>

            float angle = (sin(position.y + uTime)) * 1.0;
            mat2 rotateMatrix = get2dRotateMatrix(angle);
            objectNormal.xz = rotateMatrix * objectNormal.xz;

            // objectNormal.xz = vec2(
            //     objectNormal.x +  (sin(position.y + uTime * 4.0) * (position.y + 1.0) * 0.4) , 
            //     objectNormal.z +  (cos(position.y + uTime * 4.0) * (position.y + 1.0) * 0.4)
            // );
        `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        float angle = (sin(position.y + uTime)) * 1.0;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        transformed.xz = rotateMatrix * transformed.xz;

        // transformed.xz = vec2(
        //     transformed.x + sin(position.y + uTime * 4.0) * (position.y + 1.0) * 0.4,
        //     transformed.z + cos(position.y + uTime * 4.0) * (position.y + 1.0) * 0.4
        // );
        `
    )
  
}
//load model
gltfLoader.load("/models/cactus/cactus2.glb", e => {
    const model = e.scene;
    logSceneStructure(model);

    // applyMaterialByMeshName("apple_low_obj_Material_#35_0")
    const meshes = getMeshesByName(model, "cactus");
    // console.log(meshes);
    const mesh = meshes[0];
        mesh.material = material;
        mesh.customDepthMaterial = depthMaterial;
    mesh.castShadow = true;
    
    // applyMaterialByMeshName(model, "apple_low_obj_Material_#35_0", material);
    model.scale.set(0.01, 0.01, 0.01);
    // console.log(e);
    scene.add(model);

    const meshes1 = getMeshesByName(model, "Cylinder004");
    meshes1.forEach(e => {e.castShadow = true;})
    

})


//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

     customUniforms.uTime.value = elapsedTime;

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