varying vec2 vUv;

uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform float uSmokeSpeedY;
uniform float uSmokeSpeedXZ;
uniform float uSmokeRadiusXZ;
uniform float uTwistRandomness;

#include ../../includes/functions.glsl

void main(){
    vec3 newPosition = position;

     // Twist (rotate "y" using "uv.y" of Perlin texture)
    float perlinTexture = texture(
        uPerlinTexture, 
        vec2(0.5, uv.y * uTwistRandomness - uTime * uSmokeSpeedY)
    ).r;

    float angle = perlinTexture  * 10.0;
    newPosition.xz = rotate2D( newPosition.xz, angle);

    //wind (move position "xz" using "uv.y"(using uTime) of Perlin texture)
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * uSmokeSpeedXZ)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * uSmokeSpeedXZ)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * uSmokeRadiusXZ;
    newPosition.xz += windOffset;


    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;


}


