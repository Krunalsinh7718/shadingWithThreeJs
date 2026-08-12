import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

import grassVertexShader from './shaders/grass/vertex.vert'
import grassFragmentShader from './shaders/grass/fragment.frag'

import surfaceVertexShader from './shaders/surface/vertex.vert'
import surfaceFragmentShader from './shaders/surface/fragment.frag'

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
console.log("grassGeo.attributes.position.count", grassGeo.attributes.position.count);

const posArr = new Float32Array(grassGeo.attributes.position.count);
for (let i = 0; i < grassGeo.attributes.position.count; i++) {
    posArr[i] = Math.random() * 10;
}
grassGeo.setAttribute(
    'aRandom',
    new THREE.BufferAttribute(posArr, 1)
);

grassGeo.setIndex(indices);

grassGeo.computeVertexNormals();


// const grassMaterial = new THREE.MeshPhysicalMaterial({
//     color: "#ffffff",
//     side: THREE.DoubleSide
// });

const grassColor = {
    colorTop : "#aed100",
    colorBottom : "#227c19",
}
const uniforms = {
    uHeight: new THREE.Uniform(1),
    uWidth: new THREE.Uniform(0.5),
    uBend: new THREE.Uniform(0.1),

    uTime : new THREE.Uniform(0),
    uWindStrength: new THREE.Uniform(0.3),
    uWindSpeed: new THREE.Uniform(0.5),
    uWindScale: new THREE.Uniform(0.5),

    uGrassRotation: new THREE.Uniform(0),

    uGrassColorTop : new THREE.Uniform(new THREE.Color(grassColor.colorTop)),
    uGrassColorBottom : new THREE.Uniform(new THREE.Color(grassColor.colorBottom)),

};

gui.add(uniforms.uHeight, 'value', 0 , 3, 0.01).name("Height");
gui.add(uniforms.uWidth, 'value', 0 , 3, 0.01).name("Width");
gui.add(uniforms.uBend, 'value', -0.5 , 0.5, 0.01).name("Bend");

gui.add(uniforms.uWindStrength, 'value', 0 , 1, 0.01).name("uWindStrength");
gui.add(uniforms.uWindSpeed, 'value',  0 , 1, 0.01).name("uWindSpeed");
gui.add(uniforms.uWindScale, 'value',  0 , 5, 0.01).name("uWindScale");

gui.add(uniforms.uGrassRotation, 'value',  -Math.PI * 2 , Math.PI * 2, 0.1).name("uGrassRotation").listen();


gui.addColor(grassColor, 'colorTop').onChange(e => {
    uniforms.uGrassColorTop.value.set(grassColor.colorTop);
})
gui.addColor(grassColor, 'colorBottom').onChange(e => {
    uniforms.uGrassColorBottom.value.set(grassColor.colorBottom);
})

const grassMaterial = new CustomShaderMaterial({
     baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: grassVertexShader,
    fragmentShader: grassFragmentShader,
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
for (let i = 0; i < count; i++) {
    dummy.position.set(
        (Math.random() - 0.5) * area,
        Math.random() * 0.5,
        (Math.random() - 0.5) * area
    );
     const scale = 0.8 + Math.random() * 0.4;
    dummy.scale.set(scale, scale, scale);
    
    dummy.updateMatrix();
    grassMesh.setMatrixAt(i, dummy.matrix);
}
console.log(grassMesh);
grassMesh.instanceMatrix.needsUpdate = true;
scene.add(grassMesh);

/**
 * Terrain
 */
// Geometry
const terrainGeo = new THREE.PlaneGeometry(30, 30, 500, 500);
terrainGeo.rotateX(Math.PI / -2);

// Material


const uniforms_surface = {
    uPositionFrequency: new THREE.Uniform(0.2),
    uStrength: new THREE.Uniform(2.94),
    uWarpFrequency: new THREE.Uniform(5.0),
    uWarpStrength: new THREE.Uniform(0.16),
    uTime: new THREE.Uniform(0),
    uTimeFrequency: new THREE.Uniform(0.2),
    
}


gui.add(uniforms_surface.uPositionFrequency, 'value', 0, 1, 0.001).name('uPositionFrequency')
gui.add(uniforms_surface.uStrength, 'value', 0, 10, 0.001).name('uStrength')
gui.add(uniforms_surface.uWarpFrequency, 'value', 0, 10, 0.001).name('uWarpFrequency')
gui.add(uniforms_surface.uWarpStrength, 'value', 0, 1, 0.001).name('uWarpStrength')
gui.add(uniforms_surface.uTimeFrequency, 'value', 0, 1, 0.001).name('uTimeFrequency')



const terrainMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: surfaceVertexShader,
    fragmentShader: surfaceFragmentShader,
    uniforms: uniforms_surface,
     // MeshPhysicalMaterial
    metalness: 0,
    roughness: 0.9,
    color: '#490419'

});

const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: surfaceVertexShader,
    uniforms: uniforms_surface,

    // MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking,
})

// Mesh
const mesh = new THREE.Mesh(terrainGeo, terrainMaterial);
mesh.customDepthMaterial = depthMaterial;
mesh.receiveShadow = true;
mesh.castShadow = true;
scene.add(mesh);


/**
 * Light
 */
const amibiantLight = new THREE.AmbientLight("#fff", 2);
scene.add(amibiantLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * animation loop
 */
const clock = new THREE.Clock();
function animate() {

    const elapsedTime = clock.getElapsedTime();
    
    //update uTime
    uniforms.uTime.value = elapsedTime;

    //update grass angle

    const cameraDirection = new THREE.Vector3();

camera.getWorldDirection(cameraDirection);

const cameraAngle = Math.atan2(
    cameraDirection.x,
    cameraDirection.z
);

grassMaterial.uniforms.uGrassRotation.value = cameraAngle;

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