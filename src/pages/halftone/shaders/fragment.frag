
#define PI 3.1415926535897932384626433832795

uniform vec3 uColor;
uniform vec2 uResolution;
uniform vec3 uShadowColor;
uniform float uRepetation;
uniform vec3 uLightColor;
uniform float uLightRepetation;


varying vec3 vNormal;
varying vec3 vPosition;

#include "../../includes/lights.glsl"
#include ../../includes/functions.glsl

vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);
    return mix(color, pointColor, point);
}

vec3 halftone1(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    float strenth = randomShades(0.0, uv * intensity, 0.0);

    return mix(color, pointColor, strenth);

}


vec3 halftone2(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    vec2 rotatedUv = rotate(uv, PI * 0.4, vec2(0.5));

    uv *= repetitions;
    uv = mod(uv, 1.0);
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);
    return mix(color, pointColor, point);
}


void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0), //light color
        1.00       //light intensity
    );

     light += directionLight(
        vec3(1.0),        //light color
        1.0,                        //light intensity
        vec3(1.0, 1.0, 0.0),        //light Position
        normal,                     //normal
        viewDirection,              //viewDirection
        1.0                         //specular power
    );

    color *= light;

    //halftone
    float repetitions = 50.0;
    vec3 direction = vec3(0.0, -1.0, 0.0);
    float low = -0.8;
    float high = 1.5;
    vec3 pointColor = vec3(1.0, 0.0, 0.0);

    color = halftone1(
        color,                  //base color
        uRepetation,                   //repetitions
        vec3(0.0, -1.0, 0.0),   //direction
        -0.8,                   //low,
        1.5,                    //high,
        uShadowColor,    //pointColor
        normal                  //normal
    );

 

    color = halftone1(
        color,                  //base color
        uLightRepetation,                   //repetitions
        vec3(1.0, 1.0, 0.0),   //direction
        0.5,                   //low,
        1.5,                    //high,
        uLightColor,    //pointColor
        normal                  //normal
    );
 
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}