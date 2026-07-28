attribute vec4 tangent;
attribute float aPosInfluence;

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
    )) * uStrenth;
}
void main(){

    vec3 copy_csm_Normal = csm_Normal;
    vec3 copy_csm_Position = csm_Position;

    vec3 biTangent = cross(normal, tangent.xyz);

    //neighbour positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    //wobble
    float wobble = getWobble(csm_Position);
    
    csm_Position += wobble * normal * aPosInfluence;
    if(aPosInfluence < 0.9){
        csm_Position = copy_csm_Position;
    }

    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    //compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal = cross(toA, toB) * aPosInfluence;
    
    if(aPosInfluence < 0.9){
        csm_Normal = copy_csm_Normal;
    }

    //varyings
    vWobble = wobble / uStrenth;

}