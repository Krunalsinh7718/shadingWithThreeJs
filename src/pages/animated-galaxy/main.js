import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import appVertexShader from './shaders/vertex.vert'
import appFragmentShader from './shaders/fragment.frag'

//gui
const gui = new GUI({width: 340});

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//galaxy
const parameters = {};
parameters.count = 2000;
parameters.pointSize = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.innerColor = "red";
parameters.outerColor = "blue";

let pointGeometry = null;
let pointMaterial = null;
let points = null;

const generateGalaxy = () => {
    if(points !== null){
        pointGeometry.dispose();
        pointMaterial.dispose();
        scene.remove(points);
    }

    const pointsPositionArr = new Float32Array(parameters.count * 3);
    const pointsColorArr = new Float32Array(parameters.count * 3);
    const randomness = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count * 1);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1) * radius * parameters.randomness;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1) * radius * parameters.randomness;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1) * radius * parameters.randomness;

        pointsPositionArr[i3    ] = Math.cos(branchAngle) * radius;
        pointsPositionArr[i3 + 1] = randomY;
        pointsPositionArr[i3 + 2] = Math.sin(branchAngle) * radius;


        randomness[i3    ] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;

        pointsColorArr[i3    ] = 0.1 * radius;
        pointsColorArr[i3 + 1] = 1.0;
        pointsColorArr[i3 + 2] = 0.5 * radius;

        scales[i] = Math.random();


        
    }

    pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositionArr, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(pointsColorArr, 3));
    pointGeometry.setAttribute('randomness', new THREE.BufferAttribute(randomness, 3));
    pointGeometry.setAttribute('scales', new THREE.BufferAttribute(scales, 1));
    // pointMaterial = new THREE.PointsMaterial({
    //     size : parameters.pointSize,
    //     sizeAttenuation: true,
    //     depthWrite: false,
    //     blending: THREE.AdditiveBlending,
    //     vertexColors: true
    // })
    pointMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: appVertexShader,
        fragmentShader: appFragmentShader,
        transparent: true,
        uniforms : {
            uSize : {value : 30 * renderer.getPixelRatio() },
            uTime : {value: 0 }
        }
        
        
    })

    points = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(points);
}
generateGalaxy();

gui.add(pointMaterial.uniforms.uSize, 'value').min(10).max(50).onChange(e => {
    // console.log(e);

    pointMaterial.uniforms.uSize.value = e * renderer.getPixelRatio();
    
})


//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

    //update uniform
    pointMaterial.uniforms.uTime.value = elapsedTime;
 
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