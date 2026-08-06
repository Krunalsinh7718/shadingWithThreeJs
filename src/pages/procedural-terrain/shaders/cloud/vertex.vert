
#include "../../../includes/simplexNoise2d.glsl"
#include "../cloud-functions.glsl"

uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;
uniform float uTime;
uniform float uTimeFrequency;

varying vec3 vPosition;
varying float vUpDot;



void main(){

    float distToPoint = 0.01;

    vec3 positionA = csm_Position + vec3(distToPoint, 0.0, 0.0);
    vec3 positionB = csm_Position + vec3(0.0, 0.0, -distToPoint);

    csm_Position.y += getElevation(csm_Position.xz, uPositionFrequency, uWarpFrequency, uWarpStrength, uStrength, uTime, uTimeFrequency);
    positionA.y = getElevation(positionA.xz, uPositionFrequency, uWarpFrequency, uWarpStrength, uStrength, uTime, uTimeFrequency);
    positionB.y = getElevation(positionB.xz, uPositionFrequency, uWarpFrequency, uWarpStrength, uStrength, uTime, uTimeFrequency);

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal =  cross(toA, toB);

    //varyings
    vPosition = csm_Position;
    vPosition.xz += uTime * uTimeFrequency;
    vUpDot = dot(vec3(0.0, 1.0, 0.0), csm_Normal);

}


