

uniform float uTime;

uniform float uBigWaveAmplitude;
uniform float uBigWaveFrequancy;
uniform float uBigWaveSpeed;

uniform float uSmallWaveAmplitude;
uniform float uSmallWaveFrequancy;
uniform float uSmallWaveSpeed;
uniform float uSmallWaveIteration;

varying float vElevation;
varying vec2 vUv;

#include ../../includes/perlinnoise3d.glsl


void main(){
   

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin( modelPosition.x * uBigWaveFrequancy + uTime * uBigWaveSpeed) * 
                     cos( modelPosition.z * uBigWaveFrequancy + uTime * uBigWaveSpeed) *
                     uBigWaveAmplitude;

    for(float i = 0.0; i < uSmallWaveIteration; i++){
        elevation -= abs(perlinClass3D(vec3(modelPosition.xz * uSmallWaveFrequancy  * i , uTime * uSmallWaveSpeed * i ))) * uSmallWaveAmplitude;
    }

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    vElevation = modelPosition.y;
}


