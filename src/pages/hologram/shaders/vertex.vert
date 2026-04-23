varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;


#include "../../includes/functions.glsl"
void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //glitch
    float glitchStrength = sin(uTime - modelPosition.y);
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;

    //final position

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    gl_Position = projectedPosition;

    vModelPosition = modelPosition.xyz;
    vNormal = normal;
}


