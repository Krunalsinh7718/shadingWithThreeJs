#include "../../../includes/simplexNoise2d.glsl"

varying vec3 vPosition;
varying float vUpDot;

uniform vec3 uSurfaceColorTop;
uniform vec3 uSurfaceColorBottom;

void main(){
    vec3 color = vec3(0.0);

    //surface 
    vec3 rockColor = mix(uSurfaceColorBottom, uSurfaceColorTop, vPosition.y);
    color = rockColor;

    csm_DiffuseColor = vec4(color, 1.0);
    // csm_FragColor = vec4( vec3(vUpDot), 1.0);
}