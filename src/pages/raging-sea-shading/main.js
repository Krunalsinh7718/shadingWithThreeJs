import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'

//gui
const gui = new GUI({width: 340});
const debugObject = {};

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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//mesh setup
// Geometry
const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);
geometry.deleteAttribute('normal');
geometry.deleteAttribute('uv');

// Material
debugObject.depthColor = "#ff4000";
debugObject.surfaceColor = "#151c37";
debugObject.dirLightRadius = 3.5;
debugObject.pointLightRadius = 1.5

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    transparent: true,
    uniforms: {
        uTime: {value : 0},

        uBigWaveElevation : { value : 0.2},
        uBigWaveFrequency : { value : new THREE.Vector2(4, 1.5)},
        uBigWaveSpeed: {value: 0.75},

        uSmallWaveElevation: {value : 0.15},
        uSmallWaveFrequency : {value : 3},
        uSmallWaveSpeed: {value : 0.2},
        uSmallWaveIteration: {value : 4},

        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.925},
        uColorMultiplier: {value: 1},

        uDirLightPosition : {value : new THREE.Vector3( debugObject.dirLightRadius, debugObject.dirLightRadius, 0)},
        uPointLightPosition : {value : new THREE.Vector3(0, debugObject.pointLightRadius, 0)},

        uDirLightIntensity: {value: 5},
        uPointLightIntensity: {value: 10},

        uNormalShift : {value: 0.01}
    }
    
});

gui.addColor(debugObject,'depthColor').onChange(e => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)});
gui.addColor(debugObject,'surfaceColor').onChange(e => {waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)});

gui.add(waterMaterial.uniforms.uBigWaveElevation, 'value').min(0).max(1).name("Big wave elevation");
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x').min(0).max(50).name("Big wave frequency x");
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y').min(0).max(50).name("Big wave frequency y");
gui.add(waterMaterial.uniforms.uBigWaveSpeed, 'value').min(0).max(50).name("Big wave speed");

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

gui.add(waterMaterial.uniforms.uSmallWaveElevation, 'value').min(0).max(1).step(0.001).name('uSmallWaveElevation')
gui.add(waterMaterial.uniforms.uSmallWaveFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWaveFrequency')
gui.add(waterMaterial.uniforms.uSmallWaveSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWaveSpeed')
gui.add(waterMaterial.uniforms.uSmallWaveIteration, 'value').min(0).max(5).step(1).name('uSmallWaveIteration')

gui.add(waterMaterial.uniforms.uSmallWaveIteration, 'value').min(0).max(5).step(1).name('uSmallWaveIteration')

gui.add(waterMaterial.uniforms.uNormalShift, 'value').min(0).max(1).step(0.001).name('Normal shift')

gui.add(debugObject, 'dirLightRadius').min(0).max(6).step(0.1).name('Directional Light Radius')
gui.add(waterMaterial.uniforms.uDirLightIntensity, 'value').min(0).max(20).step(0.1).name('Directional Light Intensity')
gui.add(debugObject, 'pointLightRadius').min(0).max(6).step(0.1).name('Point Light Radius')
gui.add(waterMaterial.uniforms.uPointLightIntensity, 'value').min(0).max(20).step(0.1).name('Point Light Intensity')


// Mesh
const mesh = new THREE.Mesh(geometry, waterMaterial);
mesh.rotation.x = - Math.PI * 0.5;
scene.add(mesh);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//light helpers
const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
)
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.set(-1.0, 3.5, 0.0)
scene.add(directionalLightHelper)


const pointLightHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial()
)
pointLightHelper.material.color.setRGB(1.0, 0.1, 0.1);
pointLightHelper.position.set(0.0, 0.25, 0.0);
scene.add(pointLightHelper);

function animateDirectionLight(time){
    directionalLightHelper.position.set(
        Math.sin(time * 0.1) * debugObject.dirLightRadius,
        Math.cos(time * 0.1) * debugObject.dirLightRadius,
        0
    )
    directionalLightHelper.lookAt(new THREE.Vector3(0));
    waterMaterial.uniforms.uDirLightPosition.value = directionalLightHelper.position;
}

function animatePointLight(time){
    pointLightHelper.position.set(
        0,
        -Math.sin(time * 0.5) * debugObject.pointLightRadius,
        0
    )
    waterMaterial.uniforms.uPointLightPosition.value = pointLightHelper.position;
}

//axis helper
const axisHelper = new THREE.AxesHelper();
axisHelper.position.y += 0.25;
scene.add(axisHelper);

const clock = new THREE.Clock();

//animation loop


function animate() {

    const elapsedTime = clock.getElapsedTime();

    waterMaterial.uniforms.uTime.value = elapsedTime;

    //animate light
    animateDirectionLight(elapsedTime)
    animatePointLight(elapsedTime)

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