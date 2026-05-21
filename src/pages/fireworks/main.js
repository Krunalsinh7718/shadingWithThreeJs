import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

//scene setup
const scene = new THREE.Scene();

//camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

//fireworks

const textures = [
    textureLoader.load("/images/particles/1.png"),
    textureLoader.load("/images/particles/2.png"),
    textureLoader.load("/images/particles/3.png"),
    textureLoader.load("/images/particles/4.png"),
    textureLoader.load("/images/particles/5.png"),
    textureLoader.load("/images/particles/6.png"),
    textureLoader.load("/images/particles/7.png"),
    textureLoader.load("/images/particles/8.png"),
]
const createFireworks = (count, position, size, texture, radius, color) => {
    const particlePosArray = new Float32Array(count * 3);
    const particleRandomSizes = new Float32Array(count);


    for (let i = 0; i < count; i++) {
        const spherePos = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI, //PHI (bottom to top ,, vertical position)
            Math.random() * Math.PI * 2 //Theta (horixontal position,, cover whole circle)
        )
        const particlePosition = new THREE.Vector3();
        particlePosition.setFromSpherical(spherePos);

        const i3 = i * 3;
        particlePosArray[i3] = particlePosition.x;
        particlePosArray[i3 + 1] = particlePosition.y;
        particlePosArray[i3 + 2] = particlePosition.z;

        particleRandomSizes[i] = Math.random();
    }
    const geomarty = new THREE.BufferGeometry();
    geomarty.setAttribute('position', new THREE.Float32BufferAttribute(particlePosArray, 3));
    geomarty.setAttribute('aSize', new THREE.Float32BufferAttribute(particleRandomSizes, 1));

    //material
    texture.flipY = false;
    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: appVertexShader,
        fragmentShader: appFragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        }
    });

    //points
    const fireworks = new THREE.Points(geomarty, material);
    fireworks.position.copy(position);
    scene.add(fireworks);

    //distroy
    const distroy = () => {
        scene.remove(fireworks);
        geomarty.dispose();
        material.dispose();

    }

    //animate
    gsap.to(
        material.uniforms.uProgress,
        {
            value: 1,
            duration: 3,
            ease: 'linear',
            onComplete: distroy
        }
    )
}


//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const clock = new THREE.Clock();

//animation loop
function animate() {

    const elapsedTime = clock.getElapsedTime();

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

    sizes

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update resolution
    sizes.resolution.set(sizes.width, sizes.height);

    //update pixel ratio
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
});

//generate firework on click
window.addEventListener('click', e => {
    createFireworks(
        100,                    //count
        new THREE.Vector3(),    //position
        0.5,                    //size
        textures[7],            //texture
        1,                      //radius
        new THREE.Color("blue") //color
    );
})