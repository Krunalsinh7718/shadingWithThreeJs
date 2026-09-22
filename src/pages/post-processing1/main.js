import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import GUI from 'lil-gui'

import gridVertexShader from './shaders/grid/vertex.vert'
import gridFragmentShader from './shaders/grid/fragment.frag'


import { vec3 } from 'three/tsl';
import { getMeshesByName } from "../../common-utility/common-functions.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'


//gui
const gui = new GUI({ width: 340 });
const debugObject = {};

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//handle window resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update effect composer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

//scene setup
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const rgbeLoader = new RGBELoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
rgbeLoader.load('/hdr/urban_alley_01_1k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.backgroundBlurriness = 0.8
    scene.environment = environmentMap
})


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

const ambiantLight = new THREE.AmbientLight('white', 5.0);
scene.add(ambiantLight);

// Model
let model = null
gltfLoader.load('/models/DamagedHelmet/DamagedHelmet.gltf', (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
        model.scale.set(1, 1, 1)
        model.position.set(0,0.6,0);
        model.rotation.y = Math.PI * 0.5
        scene.add(model)

        updateAllMaterials()
    })
    
    scene.add(model)
})


/**
 * Plane
 */

const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    transparent: true,
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(1, 0.2, 0.1) },
        uColorEnd: { value: new THREE.Color(0.1, 0.4, 1) }
    }
});
const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
planeMesh.rotation.set(Math.PI * 0.4, Math.PI * 0.9, Math.PI * 0.55);
planeMesh.position.set(0,-0.5,0.5);
// planeMesh.rotateZ = 0;
scene.add(planeMesh);



//camera setup
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.AddOperation
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * Post processing
 */
const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        samples: renderer.getPixelRatio() === 1 ? 2 : 0
    }
)

//effect composer
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//1) render pass ------------------------
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);


//10) displacement pass 2------------------------
const DisplacementShader1 = {
    uniforms:
    {
        tDiffuse: { value: null },
        uTime: { value: null },
        uNormalMap: { value: null },
        uResolution: {
            value: new THREE.Vector2(
                sizes.width * Math.min(window.devicePixelRatio, 2),
                sizes.height * Math.min(window.devicePixelRatio, 2)
            )
        }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader:/*glsl*/ `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        varying vec2 vUv;
        uniform vec2 uResolution;

        void main()
        {

            //1) input color
            vec4 inputColor = texture2D(tDiffuse, vUv);

            //2) wave frame pattern 
            vec2 newUv1 = vec2(
                vUv.x,
                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            );

            float strenth = smoothstep(0.3, 0.51, 1.0 - distance(newUv1, vec2(0.5))) ;
            vec4 patternColor = vec4(vec3(strenth) , 1.0);

            //3) dot pattern
            float aspect = uResolution.x / uResolution.y;

            float gridSize = 80.0;
            vec2 st = vUv * vec2(gridSize * aspect, gridSize);

            st = fract(st);

            vec2 p = st - 0.5;

            float d = distance(st, vec2(0.5));

            float radius = 0.21;

            float dot = 1.0 - step(radius - (strenth * 0.2), d);
            vec3 dotColor1 = vec3(1.0, 0.9, 0.2);
            vec3 dotColor2 = vec3(1.0, 0.0, 0.0);
            vec3 dotColorMix = mix(dotColor1, dotColor2, strenth);
            vec3 dotColorMixFinal = dotColorMix * dot;

            vec4 patternColor1 = vec4(dotColorMixFinal  , 1.0);

            //3) color mix between input and pattern
            // vec4 color = mix(patternColor1, inputColor,  patternColor.b );
            vec4 color = inputColor + patternColor1;

            gl_FragColor = color;
        }
    `
}

const displacementPass1 = new ShaderPass(DisplacementShader1);

displacementPass1.enabled = true;
displacementPass1.material.uniforms.uTime.value = 0
effectComposer.addPass(displacementPass1)



//animation loop
const clock = new THREE.Clock();
function animate() {

    const elapsedTime = clock.getElapsedTime();

    displacementPass1.uniforms.uTime.value = elapsedTime;
    planeMaterial.uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();


    //render
    effectComposer.render();
}

