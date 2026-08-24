varying vec2 vUv;
uniform float uTime;

uniform vec3 uColorStart;
uniform vec3 uColorEnd;

#include "../../../includes/perlinnoise3d.glsl"
void main()
{   
    //displace uv
    vec2 displacedUV = vUv + perlinClass3D(vec3(vUv * 5.0 ,uTime * 0.1 ));

    //perlin noise
    float strength = perlinClass3D(vec3(displacedUV * 5.0 ,uTime * 0.2 ));

    //outer glow
   float dist = distance(vUv, vec2(0.5)) * 4.0 - 1.0;

    strength += dist;
    strength += step(-0.2, strength) * 0.8;

    //cleanup value
    strength = clamp(strength, 0.0, 1.0);

    //final color
    vec3 color = mix(uColorStart, uColorEnd, strength);

    gl_FragColor = vec4(color, 1.0);
     #include <colorspace_fragment>
}