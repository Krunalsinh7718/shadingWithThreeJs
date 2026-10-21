attribute float aRandom1;
attribute float arandomVec2;
attribute float aRandom3;

varying vec3 vRandom;
varying vec2 vUv;
varying float vPosY;

uniform float wavelengthX;
uniform float wavelengthY;
uniform float vCtrl1;
uniform float vCtrl2;
uniform float vCtrl3;
uniform float uTime;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    //a) wave xy
    float waveXY = sin(modelPosition.x * wavelengthX + uTime) * vCtrl1 + cos(modelPosition.z * wavelengthY + uTime) * vCtrl1;

    //b) accelerated wave
    // float dist = length(uv - 0.5);
    // float amplitude = max(0.0, pow(0.5 - dist, 2.0)) * 0.3;
    // float waveCircular1 = fract(abs( sin(dist * 30.0 - uTime)  * amplitude )) ;

    //c) accelerated wave 2
    float dist = length(uv - 0.5);
    float acceleratedDist = pow(dist, 0.5) * 40.0;
    float wave = sin(acceleratedDist - uTime * 5.0);
    float amplitude = exp(-dist * 4.0) * 0.03;
    float waveCircular2 = wave * amplitude ;



    
    modelPosition.y += waveCircular2 ;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = vec3(aRandom1, arandomVec2, aRandom3);
    vUv = uv;
    vPosY = modelPosition.y;
   

}


