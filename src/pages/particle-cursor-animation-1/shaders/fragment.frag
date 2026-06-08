
varying vec2 vUv;
uniform float uTime;
varying vec3 vColor;



void main(){

    vec2 uv = gl_PointCoord;
    float circle = length(uv - 0.5);
    if(circle > 0.5) discard;

    //new color
    vec3 newColor = vec3(vColor.r * vUv.r, vColor.g * vUv.g, vColor.b * (vUv.r * vUv.g));
    float circle1 = distance(vUv, vec2(0.5));
    

    newColor *= vec3(circle1);
    

    // Final color
    vec3 color = newColor;
    gl_FragColor = vec4(newColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}