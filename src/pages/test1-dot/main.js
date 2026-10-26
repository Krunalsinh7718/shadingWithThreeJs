import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui';
import appVertexShader from './shaders/vertex.vert';
import appFragmentShader from './shaders/fragment.frag';
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

//spherical
const circularPath = new THREE.Spherical(2,0,0);

gui.add(circularPath, 'radius', 0, 4, 0.01).name('Radius');
gui.add(circularPath, 'phi', 0, Math.PI, 0.01).name('Phi');
gui.add(circularPath, 'theta', 0, Math.PI * 2, 0.01).name('theta');

//target point
const lightMesh= new THREE.Mesh(new THREE.SphereGeometry(0.2,10,10), new THREE.MeshBasicMaterial({color: "#b40c0c"}));
scene.add(lightMesh);

//ball
const targetGeo = new THREE.SphereGeometry(1, 64, 64);
const targetMat = new THREE.ShaderMaterial({
    vertexShader: appVertexShader,
    fragmentShader: appFragmentShader,
    uniforms: {
        lightPosition: new THREE.Uniform(lightMesh.position)
    }
})
const targetMesh = new THREE.Mesh(targetGeo, targetMat);
scene.add(targetMesh);






//animation loop
const clock = new THREE.Clock();
function animate() {
    
    const elapsedTime = clock.getElapsedTime();

    //update light position
    lightMesh.position.setFromSpherical(circularPath);
    targetMat.uniforms.lightPosition.value.set(...lightMesh.position);

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

