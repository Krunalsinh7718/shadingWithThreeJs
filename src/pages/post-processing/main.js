import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import GUI from 'lil-gui'
import slicedVertexShader from './shaders/sliced/vertex.vert'
import slicedFragmentShader from './shaders/sliced/fragment.frag'
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
    // scene.backgroundBlurriness = 0.5
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

// Model
let model = null
gltfLoader.load('/models/DamagedHelmet/DamagedHelmet.gltf', (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    })
    scene.add(model)
})

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
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

//2) dot screen pass ------------------------
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

//3) glitch pass ------------------------
const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);
// gui.add(glitchPass.uniforms.amount, 'value', 0, 0.004, 0.000001).name("glitch pass amount");

//4) rgb shift pass ------------------------
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass)

//5) gamma correction pass ------------------------
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
// gammaCorrectionPass.enabled = false;
effectComposer.addPass(gammaCorrectionPass)
// console.log(gammaCorrectionPass);

//6) SMAA pass ------------------------
if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2)
{
const smaaPass = new SMAAPass()
effectComposer.addPass(smaaPass)
console.log('Using SMAA')
}

//7) unreal bloom pass ------------------------
const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.enabled = false;
effectComposer.addPass(unrealBloomPass)
// console.log(unrealBloomPass);

// unrealBloomPass.strength = 1
// unrealBloomPass.radius = 1
// unrealBloomPass.threshold = 0.5

// gui.add(unrealBloomPass, 'enabled')
// gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
// gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
// gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)


//8) tint pass ------------------------
const TintShader = {
    uniforms:
    {
        tDiffuse: { value: null },
        uTint: { value: null }
    },
    vertexShader: `
          varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform vec3 uTint;

        void main()
        {
            vec4 textureImg = texture(tDiffuse, vUv);
            textureImg.rgb += uTint;

            gl_FragColor = textureImg;
        }
    `
}
const tintPass = new ShaderPass(TintShader);
tintPass.enabled = false;
tintPass.material.uniforms.uTint.value = new THREE.Vector3();
effectComposer.addPass(tintPass)

// gui.add(tintPass.material.uniforms.uTint.value, 'x').min(- 1).max(1).step(0.001).name('red')
// gui.add(tintPass.material.uniforms.uTint.value, 'y').min(- 1).max(1).step(0.001).name('green')
// gui.add(tintPass.material.uniforms.uTint.value, 'z').min(- 1).max(1).step(0.001).name('blue')

//9) displacement pass ------------------------
const DisplacementShader = {
    uniforms:
    {
        tDiffuse: { value: null },
         uTime: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        varying vec2 vUv;

        void main()
        {

             vec2 newUv = vec2(
                vUv.x,
                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            );
            vec4 color = texture2D(tDiffuse, newUv);

            gl_FragColor = color;
        }
    `
}

const displacementPass = new ShaderPass(DisplacementShader)
displacementPass.enabled = false;
displacementPass.material.uniforms.uTime.value = 0
effectComposer.addPass(displacementPass)


//10) displacement pass 2------------------------
const DisplacementShader1 = {
    uniforms:
    {
        tDiffuse: { value: null },
         uTime: { value: null },
         uNormalMap: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        varying vec2 vUv;

        void main()
        {

             vec2 newUv = vec2(
                vUv.x,
                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            );
            vec4 color = texture2D(tDiffuse, newUv);

            gl_FragColor = color;
        }
    `
}

const displacementPass1 = new ShaderPass(DisplacementShader1);

displacementPass1.enabled = false;
displacementPass1.material.uniforms.uTime.value = 0
effectComposer.addPass(displacementPass1)


//11) displacement pass 3------------------------
const DisplacementShader2 = {
    uniforms:
    {
        tDiffuse: { value: null },
         uTime: { value: null },
         uNormalMap: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
     fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main()
        {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
        }
    `
}

const displacementPass2 = new ShaderPass(DisplacementShader2);
displacementPass2.material.uniforms.uNormalMap.value = textureLoader.load('/images/floor/cracked_concrete_nor_gl_1k.png')

displacementPass2.enabled = true;
displacementPass2.material.uniforms.uTime.value = 0
effectComposer.addPass(displacementPass2)



//animation loop
const clock = new THREE.Clock();
function animate() {
    
    const elapsedTime = clock.getElapsedTime();

    displacementPass1.uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();


    //render
    effectComposer.render();
}

