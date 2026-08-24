

void main()
{
    float strength = distance(gl_PointCoord, vec2(0.5));
     strength = 1.0 - strength;
     strength = pow(strength, 10.0);

    vec3 color = vec3(strength) * vec3(1.0, 0.1, 0.5);
     gl_FragColor = vec4(color, 1.0);
     #include <colorspace_fragment>
    
    
}