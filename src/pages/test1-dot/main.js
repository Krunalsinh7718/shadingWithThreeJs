import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
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
const circularPath = new THREE.Spherical(2.25, 1.4, 5.91);

gui.add(circularPath, 'radius', 1.16, 4, 0.01).name('Radius').onChange(e => {
    targetMat.uniforms.uLightIntensity.value = calculateLightIntensity(circularPath.radius);
});
gui.add(circularPath, 'phi', 0, Math.PI, 0.01).name('Phi');
gui.add(circularPath, 'theta', 0, Math.PI * 2, 0.01).name('theta');

//light
function calculateLightIntensity(input) {
    if (input <= 1.5) {
        return 1;
    }
    if (input >= 5){
        return 0;
    }    
    return 2 - (input - 2) / 2;
}
const lightProps = {color: "#fff"}  
const lightMesh= new THREE.Mesh(new THREE.SphereGeometry(0.2,10,10), new THREE.MeshBasicMaterial({color: lightProps.color}));
scene.add(lightMesh);
gui.addColor(lightProps,'color').onChange(e => {
    lightMesh.material.color.set(lightProps.color)
    targetMat.uniforms.uLightColor.value.set(lightProps.color)
});


//target 
const earthDayTexture = textureLoader.load("/images/earth/2k_earth_daymap.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;

const earthNightTexture = textureLoader.load("/images/earth/2k_earth_nightmap.jpg");
earthNightTexture.colorSpace = THREE.SRGBColorSpace;

const earthSpecularCloudsTexture = textureLoader.load("/images/earth/specularClouds.jpg");
earthSpecularCloudsTexture.wrapS = THREE.RepeatWrapping;
earthSpecularCloudsTexture.wrapT = THREE.RepeatWrapping;

const earthCloudsTexture = textureLoader.load("/images/earth/2k_earth_clouds.jpg");
earthCloudsTexture.wrapS = THREE.RepeatWrapping;
earthCloudsTexture.wrapT = THREE.RepeatWrapping;


const targetGeo = new THREE.SphereGeometry(1, 25, 25);
const targetMat = new THREE.ShaderMaterial({
    vertexShader: appVertexShader,
    fragmentShader: appFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uLightPosition: new THREE.Uniform(lightMesh.position),
        uLightColor : new THREE.Uniform(lightMesh.material.color),
        uAtmosphereDayColor : new THREE.Uniform(new THREE.Color("#309af1")),
        uAtmosphereTwilightColor : new THREE.Uniform(new THREE.Color("#e4505c")),
        uLightIntensity: new THREE.Uniform(calculateLightIntensity(circularPath.radius)),
        uDayTexture : new  THREE.Uniform(earthDayTexture),
        uNightTexture : new  THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture : new THREE.Uniform(earthSpecularCloudsTexture),
        uCloudsTexture: new THREE.Uniform(earthCloudsTexture),
    }
})
const targetMesh = new THREE.Mesh(targetGeo, targetMat);
scene.add(targetMesh);

// Draw the normals as red lines.
const normalHelper = new VertexNormalsHelper(
    targetMesh,
    0.3,
    0xff0000
);

scene.add(normalHelper);

//animation loop
const clock = new THREE.Clock();
function animate() {
    
    const elapsedTime = clock.getElapsedTime();

    //update uTime
    targetMat.uniforms.uTime.value = elapsedTime * 0.1;

    //update light position
    lightMesh.position.setFromSpherical(circularPath);
    targetMat.uniforms.uLightPosition.value.set(...lightMesh.position);

    //target rotation
    targetMesh.rotation.set(elapsedTime * 0.1, 0, 0);

    //target move
    targetMesh.position.set(Math.sin(elapsedTime * 0.5) * 3, 0, Math.cos(elapsedTime * 0.5) * 3);
    normalHelper.update();
    

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

