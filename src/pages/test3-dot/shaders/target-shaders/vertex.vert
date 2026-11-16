//uniforms
uniform vec3 uLightPosition;
uniform float uTime;

//varying
varying vec3 vNormal;
varying vec3 vModelPosition;

#include "../../../includes/functions.glsl"

void main(){
    vec3 newPosition = position;
       float glitchStrength = sin(uTime - newPosition.y) * 0.25;
    // newPosition.x += (randomFloat2D(newPosition.xz + uTime) - 0.5) * glitchStrength;
    // newPosition.x += (randomFloat2D(newPosition.xz + uTime) - 0.5) * glitchStrength;
    
    //model Normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    //varings
    vNormal = modelNormal.xyz;
    vModelPosition = newPosition.xyz;


}