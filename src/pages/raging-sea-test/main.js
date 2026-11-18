import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { getMeshesByName } from '../../common-utility/common-functions';

//gui
const gui = new GUI({width: 340});
const debugObject = {};

//loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/models/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//raycaster
const raycaster = new THREE.Raycaster();

//mouse
const mouse = { x: 0, y: 0 };

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const planeSize = { width: 8, height: 8 };
const geometry = new THREE.PlaneGeometry(planeSize.width, planeSize.height, 512, 512);

// Material
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

const bigWaveAmplitude = 0.1;
const bigWaveFrequancy = 2.0;
const bigWaveSpeed = 0.8;

const smallWaveAmplitude = 0.1;
const smallWaveFrequancy = 3.0;
const smallWaveSpeed = 0.2;
const smallWaveIteration = 3.0;

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        uTime:                { value : 0  },
        uBigWaveAmplitude :   { value: 0.1 },
        uBigWaveFrequancy :   { value: 2.0 },
        uBigWaveSpeed :       { value: 0.8 },
        uSmallWaveAmplitude : { value: 0.1 },
        uSmallWaveFrequancy : { value: 3.0 },
        uSmallWaveSpeed :     { value: 0.2 },
        uSmallWaveIteration : { value: 3.0 } 
    }
    
});


// Mesh
const waterMesh = new THREE.Mesh(geometry, waterMaterial);
waterMesh.rotation.x = - Math.PI * 0.5;
scene.add(waterMesh);

//boat
let boatModel = null;
gltfLoader.load("/models/boat/boat.glb", gltf => {
    // console.log(gltf);
    boatModel = getMeshesByName(gltf.scene,"boat")[0];
    boatModel.position.y = 0.02;
    boatModel.scale.set(0.25, 0.25, 0.25);
    applyGPUFloating(boatModel.material, waterMaterial.uniforms);
    scene.add(boatModel);
})

//lights
const directionLight = new THREE.DirectionalLight("#fff",1);
directionLight.position.set(0, 5, 0);
scene.add(directionLight);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

      // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    //Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([waterMesh]);
    console.log(intersects[0]);
    
    if(boatModel && intersects[0]){
       boatModel.position.x = intersects[0].point.x;
       boatModel.position.z = intersects[0].point.z;
    }

    // if (intersects.length > 0) {
    //     material.uniforms.uMouse.value.copy(intersects[0].uv);
    // }
    

    waterMaterial.uniforms.uTime.value = elapsedTime;

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

let isDragging = false;

//handle window resize
window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

function applyGPUFloating(material, waterUniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = waterUniforms.uTime;
    shader.uniforms.uBigWaveAmplitude = waterUniforms.uBigWaveAmplitude;
    shader.uniforms.uBigWaveFrequancy = waterUniforms.uBigWaveFrequancy;
    shader.uniforms.uBigWaveSpeed = waterUniforms.uBigWaveSpeed;
    shader.uniforms.uSmallWaveAmplitude = waterUniforms.uSmallWaveAmplitude;
    shader.uniforms.uSmallWaveFrequancy = waterUniforms.uSmallWaveFrequancy;
    shader.uniforms.uSmallWaveSpeed = waterUniforms.uSmallWaveSpeed;
    shader.uniforms.uSmallWaveIteration = waterUniforms.uSmallWaveIteration;


    // uBigWaveAmplitude :   { value: 0.1 },
    //     uBigWaveFrequancy :   { value: 2.0 },
    //     uBigWaveSpeed :       { value: 0.8 },
    //     uSmallWaveAmplitude : { value: 0.1 },
    //     uSmallWaveFrequancy : { value: 3.0 },
    //     uSmallWaveSpeed :     { value: 0.2 },
    //     uSmallWaveIteration : { value: 3.0 } 
    // }
    shader.vertexShader = `
      uniform float uTime;
      uniform float uBigWaveAmplitude;
      uniform float uBigWaveFrequancy;
      uniform float uBigWaveSpeed;

      uniform float uSmallWaveAmplitude;
      uniform float uSmallWaveFrequancy;
      uniform float uSmallWaveSpeed;
      uniform float uSmallWaveIteration;

      float getWaveHeight(vec2 pos) {
        float bigWave = sin(pos.x * uBigWaveFrequancy + uTime * uBigWaveSpeed) * 
                        cos(pos.y * uBigWaveFrequancy + uTime * uBigWaveSpeed) * uBigWaveAmplitude;
        return bigWave;
      }
    ` + shader.vertexShader;

    // 1. Rotate vertex normals so lighting/reflections tilt with the mesh
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
      #include <beginnormal_vertex>

      vec3 worldOrigin = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
      float offset = 0.2;

      float hCenter = getWaveHeight(worldOrigin.xz);
      float hFront  = getWaveHeight(worldOrigin.xz + vec2(0.0, offset));
      float hRight  = getWaveHeight(worldOrigin.xz + vec2(offset, 0.0));

      vec3 vFront = vec3(0.0, hFront - hCenter, offset);
      vec3 vRight = vec3(offset, hRight - hCenter, 0.0);

      vec3 waveUp      = normalize(cross(vFront, vRight));
      vec3 waveRight   = normalize(cross(waveUp, vec3(0.0, 0.0, 1.0)));
      vec3 waveForward = cross(waveRight, waveUp);

      mat3 buoyancyRot = mat3(waveRight, waveUp, waveForward);
      objectNormal = buoyancyRot * objectNormal;
      `
    );

    // 2. Apply rigid tilt and vertical heave to vertex positions
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      transformed = buoyancyRot * transformed;
      transformed.y += hCenter;
      `
    );
  };
}