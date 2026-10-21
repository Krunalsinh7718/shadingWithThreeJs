attribute float aRandom1;
attribute float arandomVec2;
attribute float aRandom3;

varying vec3 vRandom;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

uniform vec2 uFrequency;
uniform float uTime;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    //elevation
    float elevation = sin(modelPosition.x * uFrequency.x - uTime * 5.0) * 0.1;
    elevation += cos(modelPosition.y * uFrequency.y - uTime * 5.0) * 0.1;

    // modelPosition.z += aRandom * 0.1;
    modelPosition.z +=  elevation * uv.x ;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = vec3(aRandom1, arandomVec2, aRandom3);
    vUv = uv;
    vElevation = elevation;
    vNormal = normalize(normalMatrix * normal);

}


