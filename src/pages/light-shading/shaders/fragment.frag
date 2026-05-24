uniform vec3 uColor;
uniform vec3 uDirLightPosition;
uniform vec3 uPointLightPosition;
uniform vec3 uPointLightPosition1;

varying vec3 vNormal;
varying vec3 vPosition;

#include "../../includes/lights.glsl"


void main(){
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0), //light color
        0.03       //light intensity
    );

    light += directionLight(
        vec3(0.1, 0.1, 1.0),        //light color
        0.5,                        //light intensity
        uDirLightPosition, //vec3(0.0, 0.0, 3.0),        //light Position
        normal,                     //normal
        viewDirection,              //viewDirection
        20.0                         //specular power
    );

    light += pointLight(
        vec3(1.0, 0.1, 0.1),        //light color
        1.0,                        //light intensity
        uPointLightPosition, //vec3(0.0, 2.5, 0.0),        //light Position
        normal,                     //normal
        viewDirection,              //viewDirection
        20.0,                      //specular power
        vPosition,                  //position 
        0.25                        //light decay
    );

    light += pointLight(
        vec3(0.1, 1.0, 0.1),        //light color
        1.0,                        //light intensity
        vec3(1.0, 0.0, 3.0),        //light Position
        normal,                     //normal
        viewDirection,              //viewDirection
        20.0,                      //specular power
        vPosition,                  //position 
        0.25                        //light decay
    );

    color *= light;
 
    gl_FragColor = vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}