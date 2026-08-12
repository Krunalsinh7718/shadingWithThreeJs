#include "../../../includes/simplexNoise2d.glsl"

varying vec3 vPosition;
varying float vUpDot;



void main(){
    vec3 color = vec3(0.0);

    vec3 deepColor = vec3(0.02, 0.18, 0.00);
    vec3 surfaceColor = vec3(0.51, 0.31, 0.00);

    //water 
    vec3 rockColor = mix(deepColor, surfaceColor, vPosition.y);
    color = rockColor;

    


    csm_DiffuseColor = vec4(color, 1.0);
    // csm_FragColor = vec4( vec3(vUpDot), 1.0);
}