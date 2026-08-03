// #include ../../includes/perlinnoise3d.glsl

#include "../../includes/simplexNoise2d.glsl"

float getElevation(vec2 position){

    float uElevationFrequency = 0.2;

    float elevation = 0.0;

    elevation = simplexNoise2d(position * uElevationFrequency);
    elevation = simplexNoise2d(position * uElevationFrequency * 2.0);
    elevation = simplexNoise2d(position * uElevationFrequency * 4.0);

    return elevation;
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

}


