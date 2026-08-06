#include "../../../includes/simplexNoise2d.glsl"

varying vec3 vPosition;
varying float vUpDot;

uniform vec3 uCloudColor;

void main(){
    vec3 color = vec3(0.0);

   

    

  

    if(vPosition.y < 0.0){
        discard;
    }


    // csm_DiffuseColor = vec4(color, 1.0);
    csm_DiffuseColor = vec4( uCloudColor, 1.0);
}