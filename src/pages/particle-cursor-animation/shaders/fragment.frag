
varying vec2 vUv;
varying vec3 vColor;
uniform vec3 uColor1;
uniform vec3 uColor2;

uniform float uTime;


void main(){

    vec2 uv = gl_PointCoord;
    float circle = length(uv - 0.5);
    if(circle > 0.5) discard;

    //new color
    vec3 newColor = vec3(1.0);


    //circle stripe
    float circleStripe = length(vUv - 0.5);
    
    //stripes
    float stripes = mod( (circleStripe - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);
    stripes = smoothstep(0.0, 0.1, stripes);

    newColor = mix(uColor1, uColor2, stripes);
    

    // Final color
    vec3 color = newColor;
    gl_FragColor = vec4(newColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}