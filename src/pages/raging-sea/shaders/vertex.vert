uniform float uBigWaveElevation;
uniform vec2 uBigWaveFrequency;
uniform float uBigWaveSpeed;
uniform float uTime;

uniform float uSmallWaveElevation;
uniform float uSmallWaveFrequency;
uniform float uSmallWaveSpeed;
uniform float uSmallWaveIteration;

varying float vElevation;

#include ../../includes/perlinnoise3d.glsl

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uBigWaveFrequency.x + uTime * uBigWaveSpeed) * 
                      cos(modelPosition.z * uBigWaveFrequency.y + uTime * uBigWaveSpeed) * 
                      uBigWaveElevation;

    for(float i = 0.0; i < uSmallWaveIteration;i++){
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWaveFrequency * i, uTime * uSmallWaveSpeed)) * uSmallWaveElevation);
    }
    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vElevation = elevation;

   

}


