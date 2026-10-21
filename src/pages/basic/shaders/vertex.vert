attribute float aRandom1;
attribute float arandomVec2;
attribute float aRandom3;

varying vec3 vRandom;
varying vec2 vUv;
varying float vPosY;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float wavelengthX;
uniform float wavelengthY;
uniform float vCtrl1;
uniform float vCtrl2;
uniform float vCtrl3;
uniform float uTime;

#include ../../includes/functions.glsl
#include ../../includes/shapesFunctions.glsl

void main(){
     vec2 mouse = uMouse;
      vec2 shapeUV = uv;
     if(uResolution.x > uResolution.y){
        float aspect = uResolution.x / uResolution.y;
        shapeUV.x *= aspect;
        mouse.x *= aspect;
     }else{
        float aspect = uResolution.y / uResolution.x;
        shapeUV.y *= aspect;
        mouse.y *= aspect;
     }
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    //a) wave xy (uv controled)
    // float waveXY = sin(modelPosition.x * wavelengthX - uTime) * min(shapeUV.x * 0.1, 0.1) + 
    //                cos(modelPosition.z * wavelengthY + uTime) * min(shapeUV.x * 0.1, 0.1);

    //b) accelerated wave 1 (circle shape)
    // float dist1 = length(shapeUV - 0.5);
    // float amplitude1 = max(0.0, pow(0.5 - dist1, 2.0)) * 0.3;
    // float waveCircular1 = fract(abs( sin(dist1 * 30.0 - uTime)  * amplitude1 )) ;

    //c) accelerated wave 2 (circle shape)
    // float dist2 = length(shapeUV - mouse);
    // float acceleratedDist2 = pow(dist2, 0.5) * 40.0;
    // float wave2 = sin(acceleratedDist2 - uTime * 5.0);
    // float amplitude2 = exp(-dist2 * 4.0) * 0.03;
    // float waveCircular2 = wave2 * amplitude2;

    //d) accelerated wave 3 (poligone shape)
    float dist3 = polygonField(shapeUV - mouse, int(5), PI / 4.0);
    float acceleratedDist3 = pow(dist3, 0.5) * 50.0;
    float wave3 = sin(acceleratedDist3 - uTime * 5.0);
    float amplitude3 = exp(-dist3 * 4.0) * 0.03;
    float waveCircular3 = wave3 *  amplitude3;

     //d) accelerated wave 3 (vortex shape)
    float dist4 = vortexField(shapeUV - mouse, 1.0, uTime * 2.0);
    float waveVortex4 = dist4;
    
    modelPosition.y += waveVortex4;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = vec3(aRandom1, arandomVec2, aRandom3);
    vUv = shapeUV;
    vPosY = modelPosition.y;
   

}


