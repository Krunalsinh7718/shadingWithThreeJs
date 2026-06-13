varying vec3 vColor;

uniform float uOpacity;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 5.0 / distanceToCenter - 0.1;
    alpha *= uOpacity;
    alpha = clamp(alpha, 0.0, 1.0);

    //color
    vec3 color = vColor;

    gl_FragColor = vec4(vColor , 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}