import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui';
import targetVertexShader from './shaders/target-shaders/vertex.vert';
import targetFragmentShader from './shaders/target-shaders/fragment.frag';
import lightVertexShader from './shaders/light-shaders/vertex.vert';
import lightFragmentShader from './shaders/light-shaders/fragment.frag';
import gsap from 'gsap';


//gui
const gui = new GUI({ width: 340 });

//loaders
const textureLoader = new THREE.TextureLoader();

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height);

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//target
const targetGeo = new THREE.SphereGeometry(1, 128, 128);
const targetMat = new THREE.ShaderMaterial({
    vertexShader: targetVertexShader,
    fragmentShader: targetFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
        uLightPosition: new THREE.Uniform(new THREE.Vector3(0,0,0)),
        uTime: new THREE.Uniform(0)
    }
})
const targetMesh = new THREE.Mesh(targetGeo, targetMat);
scene.add(targetMesh);

//light
const lightGeo = new THREE.SphereGeometry(0.2, 64, 64);
const lightMat = new THREE.ShaderMaterial({
    vertexShader: lightVertexShader,
    fragmentShader: lightFragmentShader,
   
})
const lightMesh = new THREE.Mesh(lightGeo, lightMat);
lightMesh.position.set(3,0,0);
scene.add(lightMesh);

//animation loop
const clock = new THREE.Clock();
function animate() {
    
    const elapsedTime = clock.getElapsedTime();

    //update light position
    targetMat.uniforms.uLightPosition.value.set(...lightMesh.position);
    targetMat.uniforms.uTime.value = elapsedTime * 0.5;

    // targetMesh.rotation.y = elapsedTime * -0.5;

    // targetMesh.position.set(Math.sin(-elapsedTime * 0.5) * 1, 0, Math.cos(-elapsedTime * 0.5) * 1);
    lightMesh.position.set(Math.sin(elapsedTime * 0.5) * 4, 0, Math.cos(elapsedTime * 0.5) * 4);
    

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

//handle window resize
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)


    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})
//generate firework on click

