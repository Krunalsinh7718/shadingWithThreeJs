uniform float uBigWaveElevation;
uniform vec2 uBigWaveFrequency;
uniform float uBigWaveSpeed;
uniform float uTime;

uniform float uSmallWaveElevation;
uniform float uSmallWaveFrequency;
uniform float uSmallWaveSpeed;
uniform float uSmallWaveIteration;

varying float vElevation;
varying vec2 vUv;

#include ../../includes/perlinnoise3d.glsl


void main(){
    float bigWaveAmplitude = 0.3;
    float bigWaveFrequancy = 2.0;
    float bigWaveSpeed = 0.8;

    float smallWaveAmplitude = 0.1;
    float smallWaveFrequancy = 3.0;
    float smallWaveSpeed = 0.2;

   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
   float elevation = sin( modelPosition.x * bigWaveFrequancy + uTime * bigWaveSpeed) * 
                     cos( modelPosition.z * bigWaveFrequancy + uTime * bigWaveSpeed) *
                     bigWaveAmplitude;

    for(float i = 0.0; i < 3.0; i++){
        elevation -= abs(perlinClass3D(vec3(modelPosition.xz * smallWaveFrequancy  * i, uTime * smallWaveSpeed * i))) * smallWaveAmplitude;
    }

  modelPosition.y += elevation;

   vec4 viewPosition = viewMatrix * modelPosition;
   vec4 projectedPosition = projectionMatrix * viewPosition;

   gl_Position = projectedPosition;
    vElevation = modelPosition.y;


   

}


