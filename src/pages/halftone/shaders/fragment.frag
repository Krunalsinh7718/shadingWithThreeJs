
#define PI 3.1415926535897932384626433832795

uniform vec3 uColor;
uniform vec2 uResolution;
uniform vec3 uShadowColor;
uniform float uRepetation;
uniform vec3 uLightColor;
uniform float uLightRepetation;

uniform float uLightLow;
uniform float uLightHigh;
uniform int uShadowPattern;

uniform float uShadowLow;
uniform float uShadowHigh;
uniform int uLightPattern;


varying vec3 vNormal;
varying vec3 vPosition;

#include "../../includes/lights.glsl"
#include ../../includes/functions.glsl
#include ../../includes/halftones.glsl






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
    
    vec3 pointColor = vec3(1.0, 0.0, 0.0);


    switch (uShadowPattern) {
    case 1:
        color = halftone(
        color,                  //base color
        uRepetation,                   //repetitions
        vec3(0.0, -1.0, 0.0),   //direction
        uLightLow,                   //low,
        uLightHigh,                    //high,
        uShadowColor,    //pointColor
        normal                  //normal
    );
        break;
    case 2:
        color = halftone1(
        color,                  //base color
        uRepetation,                   //repetitions
        vec3(0.0, -1.0, 0.0),   //direction
        uLightLow,                   //low,
        uLightHigh,                    //high,
        uShadowColor,    //pointColor
        normal                  //normal
    );
        break;

    case 3:
        color = halftone2(
        color,                  //base color
        uRepetation,                   //repetitions
        vec3(0.0, -1.0, 0.0),   //direction
        uLightLow,                   //low,
        uLightHigh,                    //high,
        uShadowColor,    //pointColor
        normal                  //normal
    );
        break;
    case 4:
        color = halftone3(
        color,                  //base color
        uRepetation,                   //repetitions
        vec3(0.0, -1.0, 0.0),   //direction
        uLightLow,                   //low,
        uLightHigh,                    //high,
        uShadowColor,    //pointColor
        normal                  //normal
    );
        break;
   
    default:
        // Default behavior
        break;
}

 

   

    switch (uLightPattern) {
    case 1:
        color = halftone(
        color,                  //base color
        uLightRepetation,                   //repetitions
        vec3(1.0, 1.0, 0.0),   //direction
        uShadowLow,                   //low,
        uShadowHigh,                    //high,
        uLightColor,    //pointColor
        normal                  //normal
    );
        break;
    case 2:
       color = halftone1(
        color,                  //base color
        uLightRepetation,                   //repetitions
        vec3(1.0, 1.0, 0.0),   //direction
        uShadowLow,                   //low,
        uShadowHigh,                    //high,
        uLightColor,    //pointColor
        normal                  //normal
    );
        break;
    case 3:
        color = halftone2(
        color,                  //base color
        uLightRepetation,                   //repetitions
        vec3(1.0, 1.0, 0.0),   //direction
        uShadowLow,                   //low,
        uShadowHigh,                    //high,
        uLightColor,    //pointColor
        normal                  //normal
    );
        break;
    case 4:
        color = halftone3(
        color,                  //base color
        uLightRepetation,                   //repetitions
        vec3(1.0, 1.0, 0.0),   //direction
        uShadowLow,                   //low,
        uShadowHigh,                    //high,
        uLightColor,    //pointColor
        normal                  //normal
    );
        break;
    default:
        // Default behavior
        break;
}
 
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}