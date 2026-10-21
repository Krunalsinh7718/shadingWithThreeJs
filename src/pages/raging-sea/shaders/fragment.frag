
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec2 vUv;

void main(){

    float dist = length(vUv - 0.5);
    if(dist > 0.5){
        discard;
    }
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor,uSurfaceColor,mixStrength);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}