uniform float uBigWaveElevation;
uniform vec2 uBigWaveFrequency;
uniform float uBigWaveSpeed;
uniform float uTime;

uniform float uSmallWaveElevation;
uniform float uSmallWaveFrequency;
uniform float uSmallWaveSpeed;
uniform float uSmallWaveIteration;

uniform float uNormalShift;

varying float vElevation;
varying vec3 vPosition;
varying vec3 vNormal;

#include ../../includes/perlinnoise3d.glsl

float waveEleveation(vec3 position){
     float elevation = sin(position.x * uBigWaveFrequency.x + uTime * uBigWaveSpeed) * 
                      cos(position.z * uBigWaveFrequency.y + uTime * uBigWaveSpeed) * 
                      uBigWaveElevation;

    for(float i = 0.0; i < uSmallWaveIteration; i++){
        elevation -= abs(perlinClass3D(vec3(position.xz * uSmallWaveFrequency * i, uTime * uSmallWaveSpeed)) * uSmallWaveElevation);
    }
    return elevation;
}

void main(){
    //base position
    float shift = uNormalShift;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

    //elevation
    float elevation = waveEleveation(modelPosition.xyz);
    modelPosition.y += elevation;
    modelPositionA.y +=  waveEleveation(modelPositionA);
    modelPositionB.y +=  waveEleveation(modelPositionB);

    //compute normal
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computeNormal = cross(toA, toB);

    //final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;


    //varyings
    vElevation = elevation;
    vPosition = modelPosition.xyz;
    vNormal = computeNormal;
}


