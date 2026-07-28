attribute vec4 tangent;

uniform float uSize;

uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrenth;

uniform float uWarpPositionFrequency;
uniform float uWrapTimeFrequency;
uniform float uWrapStrenth;

varying float vWobble;

#include "../../../includes/simplexNoise4d.glsl"

float getWobble(vec3 position){

    vec3 wrapedPosition = position;
    wrapedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWrapTimeFrequency
    )) * uWrapStrenth;

    return simplexNoise4d(vec4(
        wrapedPosition * uPositionFrequency, //XYZ
        uTime * uTimeFrequency               //W
    )) * uStrenth * 5.0;
}

void main(){
        vec3 newPosition = position;
       vec3 biTangent = cross(normal, tangent.xyz);

    //neighbour positions
    float shift = 0.01;
    vec3 positionA = newPosition + tangent.xyz * shift;
    vec3 positionB = newPosition + biTangent * shift;

    //wobble
    float wobble = getWobble(newPosition);

        newPosition -= wobble * normal ;


        vec4 modelPosition =  modelMatrix * vec4(newPosition,1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;

        gl_Position = projectionPosition;

        gl_PointSize = uSize ;
        gl_PointSize *= (1.0 / - viewPosition.z);

         //varyings
    vWobble = wobble / uStrenth;

}