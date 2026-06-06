import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import imageVertexShader from './shaders/vertex.vert';
import imageFragmentShader from './shaders/fragment.frag';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';




//gui
const gui = new GUI();
const parameters = {};

//loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

//handle window resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio)

    // Materials
    imageMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

});

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8)
scene.add(camera)

//renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor('#111')
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;




/**
 * Displacement
 */
const displacement = {};

//2D canvas
displacement.canvas = document.createElement('canvas');
displacement.canvas.width = 128;
displacement.canvas.height = 128;
displacement.canvas.style.cssText = "position: fixed; top: 0; left: 0; z-index: 10; width : 256px; height: 256px;";
document.body.append(displacement.canvas);

//context
displacement.context = displacement.canvas.getContext('2d');
displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

displacement.glowImage = new Image();
displacement.glowImage.src = '/images/grayscale/glow.png';


// Interactive plane
displacement.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })
)
scene.add(displacement.interactivePlane);
displacement.interactivePlane.visible = false;

//raycaster
displacement.raycaster = new THREE.Raycaster();

//cordinate
displacement.screenCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

window.addEventListener('pointermove', (event) => {
    displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
    displacement.screenCursor.y = -1 * (event.clientY / sizes.height * 2 - 1);
})

//Textures

displacement.texture = new THREE.CanvasTexture(displacement.canvas);

const imagePlane = new THREE.PlaneGeometry(10, 10, 128, 128);
imagePlane.setIndex(null);
imagePlane.deleteAttribute('normal');
const intensitiesArray = new Float32Array(imagePlane.attributes.position.count);
const anglesArray = new Float32Array(imagePlane.attributes.position.count);

for(let i = 0; i < imagePlane.attributes.position.count; i++)
{
    intensitiesArray[i] = Math.random();
    anglesArray[i] = Math.random() * Math.PI * 2;
}
imagePlane.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1));
imagePlane.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))

const imageMaterial = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: imageVertexShader,
    fragmentShader: imageFragmentShader,
    uniforms: {
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uImage: new THREE.Uniform(textureLoader.load('/images/grayscale/lion.png')),
        uDisplacementTexture: new THREE.Uniform(displacement.texture),
        uTime : new THREE.Uniform(0)
    }
})
const particles = new THREE.Points(imagePlane, imageMaterial);
scene.add(particles);


//animation loop
const clock = new THREE.Clock();

function animate() {

    const elapsedTime = clock.getElapsedTime();

    //uTime
    imageMaterial.uniforms.uTime.value = elapsedTime;

    //raycaster
    displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
    const intersection = displacement.raycaster.intersectObject(displacement.interactivePlane);

    /**
      * Displacement
     **/
    if (intersection.length) {
        const uv = intersection[0].uv;
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
        // console.log(uv.y);
    }

    // Fade out
    displacement.context.globalCompositeOperation = 'source-over';
    displacement.context.globalAlpha = 0.02;
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

    // Speed alpha
    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor);
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
    const alpha = cursorDistance * 0.1;

    // Draw glow
    const glowSize = displacement.canvas.width * 0.25;
    displacement.context.globalCompositeOperation = "lighten";
    displacement.context.globalAlpha = alpha;
    displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
    );

    //canvas texture
    displacement.texture.needsUpdate = true;

    //update controls
    controls.update();

    //render
    renderer.render(scene, camera);
}

