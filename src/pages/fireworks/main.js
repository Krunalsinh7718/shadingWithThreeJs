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

//fireworks
const textures = [
    textureLoader.load('/images/particles/1.png'),
    textureLoader.load('/images/particles/2.png'),
    textureLoader.load('/images/particles/3.png'),
    textureLoader.load('/images/particles/4.png'),
    textureLoader.load('/images/particles/5.png'),
    textureLoader.load('/images/particles/6.png'),
    textureLoader.load('/images/particles/7.png'),
    textureLoader.load('/images/particles/8.png')
]
const createFireworks = (counts, position, size, texture, radius, color) => {
    //geometry
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(counts * 3);
    const sizeArray = new Float32Array(counts);
    const timeMultiplyerArray = new Float32Array(counts);
    for (let i = 0; i < counts; i++) {

        
        const spherecal = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
        )
        const particlePosition = new THREE.Vector3();
        particlePosition.setFromSpherical(spherecal);


        const i3 = i * 3;
        positionArray[i3] = particlePosition.x;
        positionArray[i3 + 1] = particlePosition.y;
        positionArray[i3 + 2] = particlePosition.z;
        
        sizeArray[i] = Math.random();

        timeMultiplyerArray[i] = 1 + Math.random();
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizeArray, 3))
    geometry.setAttribute('atimeMultiplyer', new THREE.BufferAttribute(timeMultiplyerArray, 3))
    
    //material
    texture.flipY = false;
    const material = new THREE.ShaderMaterial({
        vertexShader: appVertexShader,
        fragmentShader: appFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uSize : new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture : new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        }
    });

    //mesh
    const mesh = new THREE.Points(geometry, material);  
    mesh.position.copy(position);  
    scene.add(mesh)

    const distroyFirework = () => {
        scene.remove(mesh);
        geometry.dispose();
        material.dispose();
    }

    gsap.to(material.uniforms.uProgress,{
        value : 1,
        duration: 3,
        ease: 'linear',
        onComplete: distroyFirework
    })
    
}
const createRandomFirework = () => {
    const counts = Math.round(Math.random() * 1000 + 400) ;
    const position = new THREE.Vector3(
        Math.random() * 1.5,
        Math.random() ,
        Math.random() * 1.5
    );
    const size = Math.random() * 0.3 + 0.1;
    const texture = textures[Math.floor(Math.random() * 7)];
    const radius = Math.random() * 1.3 + 1;
    const color = new THREE.Color();
    color.setHSL(Math.random(), 0.5, 0.7);
    createFireworks(
        counts,
        position,
       size,
        texture,        
        radius,
        color
    )
}
window.addEventListener('click', e => {
    createRandomFirework()
})

// sky
const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

const sun = new THREE.Vector3();

/// GUI

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );

}


gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

guiChanged();

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

