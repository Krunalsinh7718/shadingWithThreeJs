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

//axis helper

const axisHelper = new THREE.AxesHelper(10);
scene.add(axisHelper);


//points
const shapeData = {};
shapeData.pointsCount = 10;

const sphericalShape = new THREE.Spherical(1, Math.PI, Math.PI * 2);
const testVector = new THREE.Vector3();

const pointGeo = new THREE.BufferGeometry();
const pointsArray = new Float32Array(shapeData.pointsCount * 3);
const aSizeArray = new Float32Array(shapeData.pointsCount);
const aIndexArray = new Float32Array(shapeData.pointsCount);
for (let i = 0; i < shapeData.pointsCount; i++) {

    sphericalShape.set(
        Math.min(Math.random() , Math.random()), 
        Math.random() * Math.PI, 
        Math.random() * Math.PI * 2
    );
    testVector.setFromSpherical(sphericalShape);
    
    const i3 = i * 3;
    pointsArray[i3 + 0] = testVector.x;
    pointsArray[i3 + 1] = testVector.y;
    pointsArray[i3 + 2] = testVector.z;

    aSizeArray[i3] = Math.random();
    aIndexArray[i3] = i3 / shapeData.pointsCount;

    
}
pointGeo.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3));
pointGeo.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1));
pointGeo.setAttribute('aIndex', new THREE.BufferAttribute(aIndexArray, 1));
console.log(aIndexArray);


const pointMaterial = new THREE.ShaderMaterial({
    vertexShader: appVertexShader,
    fragmentShader: appFragmentShader,
    uniforms: {
        uTime : new THREE.Uniform(0),
        uPointSize : new THREE.Uniform(100),
    }
})
const points = new THREE.Points(pointGeo, pointMaterial);
scene.add(points)


const clock = new THREE.Clock();

//animation loop
function animate() {
    
    const elapsedTime = clock.getElapsedTime();

    pointMaterial.uniforms.uTime.value = elapsedTime;

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

