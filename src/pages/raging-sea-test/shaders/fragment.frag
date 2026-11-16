
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec2 vUv;

#include ../../includes/glsl-color-library.glsl

void main(){

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    // color = mix(uDepthColor,uSurfaceColor,mixStrength);

    vec3 colorFinal = mix(nature_PineGreen, nature_SpringGreen, vElevation);
    

    gl_FragColor = vec4(colorFinal, 1.0);
    #include <colorspace_fragment>
}