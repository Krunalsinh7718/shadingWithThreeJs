attribute float aRandom;

uniform float uTime;

uniform float uHeight;
uniform float uWidth;
uniform float uBend;

uniform float uWindStrength;
uniform float uWindSpeed;
uniform float uWindScale;

varying vec3 vPosition;

#include "../../includes/simplexNoise2d.glsl"

void main(){

    vec3 newPos = position;

    //control height and width (0 at bottom → 1 at tip)
    newPos.y *= uHeight;
    newPos.x *= uWidth;

    //bend
    float height = position.y ;
    float bend = pow(height, 2.0);

    float wind = simplexNoise2d(
        (position.xz * 2.0) * uWindScale +
        uTime * uWindSpeed
    );

    newPos.z += bend * uBend * wind;
    
    csm_Position = newPos;

    vPosition = newPos;

}


