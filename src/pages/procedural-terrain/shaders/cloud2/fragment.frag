#include "../../../includes/simplexNoise2d.glsl"

varying vec3 vPosition;
varying float vUpDot;

uniform vec3 uCloudColor;

void main(){

   

    if(vPosition.y > 0.0){
        discard;
    }
    // color = vec3(1.0, 0.0, 0.0);
    // csm_DiffuseColor = vec4(color, 1.0);
    csm_DiffuseColor = vec4( uCloudColor, 1.0);
}