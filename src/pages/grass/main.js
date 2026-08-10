import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import testVertexShader from './shaders/vertex.vert'
import testFragmentShader from './shaders/fragment.frag'
import { Uniform } from 'three/webgpu';

/**
 * gui
 */
const gui = new GUI();

/**
 * texture loader
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/images/flag/india-flag.png");

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * scene setup
 */
const scene = new THREE.Scene();

/**
 * camera setup
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 3, 8)
scene.add(camera)

/**
 * renderer setup
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

/**
 * controls setup
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * group
 */
const group = new THREE.Group();
scene.add( group );

/**
 * GRASS
 */
const segments = 5;
const height = 1;
const width = 0.12;

const positions = new Float32Array((segments + 1) * 6);

for (let i = 0; i <= segments; i++) {

    const i6 = i * 6;

    const y = (i / segments) * height;

    // Width becomes smaller toward the tip
    const currentWidth = width * (1 - i / segments);

    // Left vertex
    positions[i6 + 0] = -currentWidth;
    positions[i6 + 1] = y;
    positions[i6 + 2] = 0;

    // Right vertex
    positions[i6 + 3] = currentWidth;
    positions[i6 + 4] = y;
    positions[i6 + 5] = 0;
}

const indices = [];

for (let i = 0; i < segments; i++) {

    const row = i * 2;

    const leftBottom = row;
    const rightBottom = row + 1;

    const leftTop = row + 2;
    const rightTop = row + 3;

    // First triangle
    indices.push(
        leftBottom,
        rightBottom,
        leftTop,
        rightBottom,
        rightTop,
        leftTop
    );
}

const grassGeo = new THREE.BufferGeometry();

grassGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);
const posArr = new Float32Array(grassGeo.attributes.position.count);
for (let i = 0; i < grassGeo.attributes.position.count; i++) {
    posArr[i] = Math.random();
}
grassGeo.setAttribute(
    'aRandom',
    new THREE.BufferAttribute(posArr, 1)
);

grassGeo.setIndex(indices);

grassGeo.computeVertexNormals();
console.log(grassGeo);


// const grassMaterial = new THREE.MeshPhysicalMaterial({
//     color: "#ffffff",
//     side: THREE.DoubleSide
// });
const uniforms = {
    uHeight: new THREE.Uniform(1),
    uWidth: new THREE.Uniform(0.5),
    uBend: new THREE.Uniform(0.1),

    uTime : new THREE.Uniform(0),
    uWindStrength: new THREE.Uniform(0.3),
    uWindSpeed: new THREE.Uniform(0.5),
    uWindScale: new THREE.Uniform(0.5),
};

gui.add(uniforms.uHeight, 'value', 0 , 3, 0.01).name("Height");
gui.add(uniforms.uWidth, 'value', 0 , 3, 0.01).name("Width");
gui.add(uniforms.uBend, 'value', -0.5 , 0.5, 0.01).name("Bend");

gui.add(uniforms.uWindStrength, 'value', 0 , 1, 0.01).name("uWindStrength");
gui.add(uniforms.uWindSpeed, 'value',  0 , 1, 0.01).name("uWindSpeed");
gui.add(uniforms.uWindScale, 'value',  0 , 5, 0.01).name("uWindScale");

const grassMaterial = new CustomShaderMaterial({
     baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: uniforms
})

// const grassMesh = new THREE.Mesh(
//     geometry,
//     grassMaterial
// );

const count = 10000;
const area = 30;
const grassMesh = new THREE.InstancedMesh(
    grassGeo,
    grassMaterial,
    count
)

const dummy = new THREE.Object3D();
console.log(dummy);
for (let i = 0; i < count; i++) {
    dummy.position.set(
        (Math.random() - 0.5) * area,
        0,
        (Math.random() - 0.5) * area
    );
    dummy.scale.set(
        1,
        Math.random() * 1 + 0.7,
        1
    );
    
    dummy.updateMatrix();
    grassMesh.setMatrixAt(i, dummy.matrix);
}
grassMesh.instanceMatrix.needsUpdate = true;
scene.add(grassMesh);

/**
 * Light
 */
const amibiantLight = new THREE.AmbientLight("#fff", 2);
scene.add(amibiantLight);


/**
 * animation loop
 */
const clock = new THREE.Clock();
function animate() {

    const elapsedTime = clock.getElapsedTime();
    
    //update uTime
    uniforms.uTime.value = elapsedTime;

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

/**
 * handle window resize
 */
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