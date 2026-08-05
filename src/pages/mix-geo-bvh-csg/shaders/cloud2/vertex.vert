
#include "../../../includes/simplexNoise2d.glsl"


uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;
uniform float uTime;
uniform float uTimeFrequency;

varying vec3 vPosition;
varying float vUpDot;

float getElevation(vec2 position){

    vec2 warpedPosition = position;
    warpedPosition += uTime * uTimeFrequency;
    warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency )  * uWarpStrength ;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;
    
    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign; 
    elevation *= uStrength;

    return 1.0 - elevation;
}

void main(){

    float distToPoint = 0.01;

    vec3 positionA = csm_Position + vec3(distToPoint, 0.0, 0.0);
    vec3 positionB = csm_Position + vec3(0.0, 0.0, -distToPoint);

    csm_Position.y += getElevation(csm_Position.xz);
    positionA.y = getElevation(positionA.xz);
    positionB.y = getElevation(positionB.xz);

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal =  cross(toA, toB);

    //varyings
    vPosition = csm_Position;
    vPosition.xz += uTime * uTimeFrequency;
    vUpDot = dot(vec3(0.0, 1.0, 0.0), csm_Normal);

}


