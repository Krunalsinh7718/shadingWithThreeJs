#include "../../../includes/simplexNoise2d.glsl"

varying vec3 vPosition;
varying float vUpDot;

uniform vec3 uWaterSurfaceColor;
uniform vec3 uWaterDeepColor;
uniform vec3 uSandColor;
uniform vec3 uGrassColor;
uniform vec3 uRockColor;
uniform vec3 uSnowColor;

void main(){
    vec3 color = vec3(0.0);

   

    //water 
    float mapWater = smoothstep(-1.0, -0.1, vPosition.y);
    vec3 mixWater = mix(uWaterDeepColor, uWaterSurfaceColor, mapWater);
    color = mixWater;

    //sand
    float sandMix = step(-0.1, vPosition.y);
    vec3 mixSand = mix(color, uSandColor, sandMix);
    color = mixSand;

    //grass
    float grassMix = step(-0.06,  vPosition.y);
    vec3 mixGrass = mix(color, uGrassColor, grassMix);
    color = mixGrass;

    //rock
    float rocuMix = vUpDot;
    rocuMix = 1.0 - step(0.8, rocuMix);
    rocuMix *= step(-0.06,  vPosition.y);
    color = mix(color, uRockColor, rocuMix);

    //snow
    float snowThreshold = 0.45;
    snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
    float snowMix = step(snowThreshold,  vPosition.y);
    vec3 mixSnow = mix(color, uSnowColor, snowMix);
    color = mixSnow;

    if(vPosition.y < 0.0){
        discard;
    }


    // csm_DiffuseColor = vec4(color, 1.0);
    csm_DiffuseColor = vec4( vec3(1.0), 1.0);
}