import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'

//gui
const gui = new GUI();

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
const planeSize = { width: 2, height: 1 };
const geometry = new THREE.PlaneGeometry(planeSize.width, planeSize.height, 600, 600);
const count = geometry.attributes.position.count;
const randoms1 = new Float32Array(count);
const randoms2 = new Float32Array(count);
const randoms3 = new Float32Array(count);

for (let i = 0; i < count; i++) {
    randoms1[i] = Math.random();
    randoms2[i] = Math.random();
    randoms3[i] = Math.random();
}
geometry.setAttribute('aRandom1', new THREE.BufferAttribute(randoms1, 1))
geometry.setAttribute('arandomVec2', new THREE.BufferAttribute(randoms2, 1))
geometry.setAttribute('aRandom3', new THREE.BufferAttribute(randoms3, 1))
// console.log(geometry);



// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    transparent: true,
    uniforms: {
        uResolution: new THREE.Uniform(new THREE.Vector2(
            planeSize.width,
            planeSize.height
        )),
        uMouse: new THREE.Uniform(new THREE.Vector2(
            0,
            0
        )),
        wavelengthX: { value: 30 },
        wavelengthY: { value: 30 },
        vCtrl1: { value: 0.05 },
        vCtrl2: { value: 0.018 },
        vCtrl3: { value: 0.034 },
        uTime: { value: 0 }
    }
});
// console.log(material);

gui.add(material.uniforms.wavelengthX, "value").max(50).min(0).step(1).name("wave length X");
gui.add(material.uniforms.wavelengthY, "value").max(50).min(0).step(1).name("wave length Y");
gui.add(material.uniforms.vCtrl1, "value").max(1).min(0).step(0.001).name("wave height");
gui.add(material.uniforms.vCtrl2, "value").max(0.05).min(0).step(0.0001).name("wave variation x");
gui.add(material.uniforms.vCtrl3, "value").max(0.05).min(0).step(0.0001).name("wave variation y");



// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = - Math.PI * 0.5;
scene.add(mesh);

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
    const intersects = raycaster.intersectObjects([mesh]);

    if (intersects.length > 0) {
        material.uniforms.uMouse.value.copy(intersects[0].uv);
    }
    
    //update uniform
    material.uniforms.uTime.value = elapsedTime;

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


//handle window resize
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});