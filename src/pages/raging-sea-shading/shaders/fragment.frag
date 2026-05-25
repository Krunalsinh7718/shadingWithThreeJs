
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uDirLightPosition;
uniform vec3 uPointLightPosition;

uniform float uDirLightIntensity;
uniform float uPointLightIntensity;


varying float vElevation;
varying vec3 vPosition;
varying vec3 vNormal;



#include "../../includes/lights.glsl"

void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor,uSurfaceColor,mixStrength);

    //light
    vec3 light = vec3(0.0);

    // light += ambientLight(
    //     vec3(1.0), //light color
    //     0.03       //light intensity
    // );

    light += directionLight(
        vec3(1.0),        //light color
        uDirLightIntensity,                        //light intensity
        vec3(-1.0, 3.5, 0.0),        //light Position
        normal,                     //normal
        viewDirection,              //viewDirection
        30.0                         //specular power
    );

    // light += pointLight(
    //     vec3(1.0, 0.1, 0.1),        //light color
    //     1.0,                        //light intensity
    //     vec3(0.0, 2.5, 0.0),        //light Position
    //     normal,                     //normal
    //     viewDirection,              //viewDirection
    //     20.0,                      //specular power
    //     vPosition,                  //position 
    //     0.25                        //light decay
    // );

    light += pointLight(
        vec3(1.0),        //light color
        uPointLightIntensity,                        //light intensity
        uPointLightPosition,        //light Position
        normal,                     //normal
        viewDirection,              //viewDirection
        30.0,                      //specular power
        vPosition,                  //position 
        0.95                        //light decay
    );

    color *= light;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}