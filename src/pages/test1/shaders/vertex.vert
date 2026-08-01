// #include ../../includes/perlinnoise3d.glsl

#include "../../includes/simplexNoise2d.glsl"

float getElevation(vec2 position){
    float evevation = simplexNoise2d(position * 2.0);

    return evevation;
}

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  

    float distToPoint = 0.1;

    vec3 positionA = position + vec3(distToPoint, 0.0, 0.0);
    vec3 positionB = position + vec3(0.0, 0.0, -distToPoint);

    positionA.y +=  getElevation(positionA.xz);
    positionB.y +=  getElevation(positionB.xz);

    vec3 toA = normalize(positionA - position);
    vec3 toB = normalize(positionB - position);


    normal +=  cross(toA, toB);

    modelPosition.y += getElevation(modelPosition.xz);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;


}


