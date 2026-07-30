import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.vert';
import earthFragmentShader from './shaders/earth/fragment.frag';

import starsVertexShader from './shaders/stars/vertex.vert';
import starsFragmentShader from './shaders/stars/fragment.frag';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

import { getMeshesByName, applyMaterialByMeshName, applyMaterialByMaterialName, logSceneStructure } from "../../common-utility/common-functions.js";

import gsap from 'gsap';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

//gui
const gui = new GUI();
const parameters = {};

//loaders
const textureLoader = new THREE.TextureLoader();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

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
camera.position.x = 0
camera.position.y = 2
camera.position.z = 4

// camera.position.x = 0
// camera.position.y = 3
// camera.position.z = 0
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

const earthUniforms = {
    uSliceStart: new THREE.Uniform(0),
    uSliceArc: new THREE.Uniform(0),
};
gui.add(earthUniforms.uSliceStart, 'value', - Math.PI, Math.PI, 0.001).name('eart uSliceStart')
gui.add(earthUniforms.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('eart uSliceArc')

const mantleUniform = {
    uSliceStart: new THREE.Uniform(0),
    uSliceArc: new THREE.Uniform(0),
};
gui.add(mantleUniform.uSliceStart, 'value', - Math.PI, Math.PI, 0.001).name('mantle uSliceStart')
gui.add(mantleUniform.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('mantle uSliceArc')


const outerCoreUniform = {
    uSliceStart: new THREE.Uniform(0),
    uSliceArc: new THREE.Uniform(0),
};
gui.add(outerCoreUniform.uSliceStart, 'value', - Math.PI, Math.PI, 0.001).name('outer core uSliceStart')
gui.add(outerCoreUniform.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('outer core uSliceArc')


// Model
let model = null, crust = null, mantle = null, outerCore = null, innerCore = null;
gltfLoader.load('/models/earth/earth.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.25, 0.25, 0.25);

    model.traverse((child) => {
        if (child.isMesh) {
            console.log(child.name);


            if (child.name === 'crust') {
                crust = child;
                const patchMap = {
                    csm_Slice:
                    {
                        '#include <colorspace_fragment>':
                            `
                            #include <colorspace_fragment>
                            if(!gl_FrontFacing)
                                gl_FragColor = vec4(0.3, 0.2, 0.2, 1.0);
                            `
                    }
                };

                const originalMaterial = child.material;

                const slicedMaterial = new CustomShaderMaterial({
                    // CSM
                    baseMaterial: THREE.MeshStandardMaterial,
                    vertexShader: earthVertexShader,
                    fragmentShader: earthFragmentShader,

                    map: originalMaterial.map,
                    normalMap: originalMaterial.normalMap,
                    roughnessMap: originalMaterial.roughnessMap,
                    metalnessMap: originalMaterial.metalnessMap,
                    side: THREE.DoubleSide,

                    uniforms: earthUniforms,

                    patchMap: patchMap,

                })

                const slicedDepthMaterial = new CustomShaderMaterial({
                    // CSM
                    baseMaterial: THREE.MeshDepthMaterial,
                    vertexShader: earthVertexShader,
                    fragmentShader: earthFragmentShader,
                    uniforms: earthUniforms,
                    patchMap: patchMap,

                    // MeshDepthMaterial
                    depthPacking: THREE.RGBADepthPacking


                })
                child.material = slicedMaterial
                child.customDepthMaterial = slicedDepthMaterial
            }
            if (child.name === 'mantle') {
                mantle = child;
                const patchMap = {
                    csm_Slice:
                    {
                        '#include <colorspace_fragment>':
                            `
                            #include <colorspace_fragment>
                            if(!gl_FrontFacing)
                                gl_FragColor = vec4(0.3, 0.2, 0.2, 1.0);
                            `
                    }
                };

                const originalMaterial = child.material;
                console.log(originalMaterial);


                const slicedMaterial = new CustomShaderMaterial({
                    // CSM
                    baseMaterial: THREE.MeshStandardMaterial,
                    vertexShader: earthVertexShader,
                    fragmentShader: earthFragmentShader,

                    color: originalMaterial.color,
                    map: originalMaterial.map,
                    normalMap: originalMaterial.normalMap,
                    roughnessMap: originalMaterial.roughnessMap,
                    metalnessMap: originalMaterial.metalnessMap,
                    side: THREE.DoubleSide,

                    uniforms: mantleUniform,

                    patchMap: patchMap,

                })

                const slicedDepthMaterial = new CustomShaderMaterial({
                    // CSM
                    baseMaterial: THREE.MeshDepthMaterial,
                    vertexShader: earthVertexShader,
                    fragmentShader: earthFragmentShader,
                    uniforms: earthUniforms,
                    patchMap: patchMap,

                    // MeshDepthMaterial
                    depthPacking: THREE.RGBADepthPacking


                })
                child.material = slicedMaterial
                child.customDepthMaterial = slicedDepthMaterial
            }
            if (child.name === 'outerCore') {
                outerCore = child;
                const patchMap = {
                    csm_Slice:
                    {
                        '#include <colorspace_fragment>':
                            `
                            #include <colorspace_fragment>
                            if(!gl_FrontFacing)
                                gl_FragColor = vec4(0.3, 0.2, 0.2, 1.0);
                            `
                    }
                };

                const originalMaterial = child.material;
                console.log(originalMaterial);


                const slicedMaterial = new CustomShaderMaterial({
                    // CSM
                    baseMaterial: THREE.MeshStandardMaterial,
                    vertexShader: earthVertexShader,
                    fragmentShader: earthFragmentShader,

                    color: originalMaterial.color,
                    map: originalMaterial.map,
                    normalMap: originalMaterial.normalMap,
                    roughnessMap: originalMaterial.roughnessMap,
                    metalnessMap: originalMaterial.metalnessMap,
                    side: THREE.DoubleSide,

                    uniforms: outerCoreUniform,

                    patchMap: patchMap,

                })

                const slicedDepthMaterial = new CustomShaderMaterial({
                    // CSM
                    baseMaterial: THREE.MeshDepthMaterial,
                    vertexShader: earthVertexShader,
                    fragmentShader: earthFragmentShader,
                    uniforms: earthUniforms,
                    patchMap: patchMap,

                    // MeshDepthMaterial
                    depthPacking: THREE.RGBADepthPacking


                })
                child.material = slicedMaterial
                child.customDepthMaterial = slicedDepthMaterial
            }
            if (child.name == 'innerCore') {
                innerCore = child;
            }


            child.castShadow = true
            child.receiveShadow = true
        }
    })
    scene.add(model)

    // console.log("mantle", mantle);
    // mantle.position.y = 10;


    let tl = gsap.timeline({})
    tl.to(earthUniforms.uSliceArc,
        { value: 3.14, duration: 1, ease: 'linear' }
    ).to(mantleUniform.uSliceArc,
        { value: 3.14, duration: 1, ease: 'linear' }
    ).to(mantle.position,
        { y: 1, duration: 1, ease: 'linear' }
    ).to(outerCore.position,
        { y: 1, duration: 1, ease: 'linear' },
        "<"
    ).to(innerCore.position,
        { y: 1, duration: 1, ease: 'linear' },
        "<"
    ).to(outerCoreUniform.uSliceArc,
        { value: 3.14, duration: 1, ease: 'linear' }
    ).to(outerCore.position,
        { y: 2.5, duration: 1, ease: 'linear' },
    ).to(innerCore.position,
        { y: 2.5, duration: 1, ease: 'linear' },
        "<"
    ).to(innerCore.position,
        { y: 3.5, duration: 1, ease: 'linear' },
    )
})


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

    pointsColorArr[i3] = 0.1 * radius;
    pointsColorArr[i3 + 1] = 1.0;
    pointsColorArr[i3 + 2] = 0.5 * radius;

    scalesArr[i] = Math.random();
}
// console.log(starsGeomatry);

const starsGeomatry = new THREE.BufferGeometry();
starsGeomatry.setAttribute('position', new THREE.BufferAttribute(starPosAttrArr, 3));
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
        uSize: new THREE.Uniform(30 * renderer.getPixelRatio())
    }
});
const stars = new THREE.Points(starsGeomatry, starsMaterial);
scene.add(stars);

/**
 * Lights
 */
// const ambiantLight = new THREE.AmbientLight("#fff", 10);
// scene.add(ambiantLight);


const directionalLight = new THREE.DirectionalLight('#ffffff', 10)
directionalLight.position.set(0, 2, 4)

scene.add(directionalLight)

// LABEL RENDERER
const labelRenderer = new CSS2DRenderer();

labelRenderer.setSize(
    window.innerWidth,
    window.innerHeight
);

labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';

document.body.appendChild(labelRenderer.domElement);

// HOTSPOTS
const hotspot1 = createHotspot({
    position: new THREE.Vector3(-0.69, -0.24, 1.82),
    label: 'Crust'
});

gui.add(hotspot1.position, 'x').min(-3).max(3).step(0.01).name('Crust x');
gui.add(hotspot1.position, 'y').min(-3).max(3).step(0.01).name('Crust y');
gui.add(hotspot1.position, 'z').min(-3).max(3).step(0.01).name('Crust z');

const hotspot2 = createHotspot({
    position: new THREE.Vector3(0, 0, 1.5),
    label: 'Mantle'
});

const hotspot3 = createHotspot({
    position: new THREE.Vector3(1.16, 0.35, 0.49),
    label: 'Outer Core'
});

const hotspot4 = createHotspot({
    position: new THREE.Vector3(0, 1.53, 0),
    label: 'Inner Core'
});

console.log("hotspot1", hotspot1);



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
    labelRenderer.render(scene, camera);
}

// -----------------------------------
// HOTSPOT FUNCTION
// -----------------------------------

function createHotspot({
    position,
    label
}) {

    const wrapper = document.createElement('div');
    wrapper.className = 'hotspot-wrapper';

    const text = document.createElement('span');
    text.className = 'label';
    text.textContent = label;

    wrapper.appendChild(text);

    const hotspot = new CSS2DObject(wrapper);

    hotspot.position.copy(position);

    scene.add(hotspot);

    return hotspot;
}
