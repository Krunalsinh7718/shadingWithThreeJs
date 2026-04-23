varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3 uColor;

void main(){
     // Normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) normal *= -1.0;

    //stripes
    float stripes = mod( (vModelPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    //fresnel
    vec3 viewDirection = normalize(vModelPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0; 
    fresnel = pow(fresnel, 2.0);

     // Falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);

    //holographic
    float holographic = fresnel * stripes;
    holographic += holographic * 1.25;
    holographic *= falloff;

    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}