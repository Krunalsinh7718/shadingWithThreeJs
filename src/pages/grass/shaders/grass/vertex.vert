attribute float aRandom;

uniform float uTime;

uniform float uHeight;
uniform float uWidth;
uniform float uBend;

uniform float uWindStrength;
uniform float uWindSpeed;
uniform float uWindScale;

uniform float uGrassRotation;

varying vec3 vPosition;

#include "../../../includes/simplexNoise2d.glsl"

void main(){

    vec3 newPos = position;

    //rotation
    float c = cos(uGrassRotation);
    float s = sin(uGrassRotation);
    mat2 rotation = mat2(
        c, -s,
        s,  c
    ) ;

    newPos.xz = rotation * newPos.xz ;

    //control height and width (0 at bottom → 1 at tip)
    newPos.y *= uHeight;
    newPos.x *= uWidth;

    //bend
    float height = newPos.y ;
    float bend = pow(height, 2.0) + (sin(float(gl_InstanceID)) * newPos.y * 1.5) ;

    //apply wind
    float wind = simplexNoise2d(
        (newPos.xz * 2.0) * uWindScale +
        uTime * uWindSpeed
    );
    newPos.z += bend * uBend * wind;
    
    csm_Position = newPos;

    vPosition = newPos;

}


