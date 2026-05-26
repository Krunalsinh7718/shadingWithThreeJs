uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include "../../includes/lights.glsl"

void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0), //light color
        0.03       //light intensity
    );

    color *= light;
 
    gl_FragColor = vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}