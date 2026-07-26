varying float vWobble;

uniform vec3 uColorA;
uniform vec3 uColorB;

void main(){
      vec2 uv = gl_PointCoord;
    float circle = length(uv - 0.5);
    if(circle > 0.5) discard;

    vec3 color = mix(uColorB, uColorA , vWobble);
    gl_FragColor = vec4(color, 1.0);
}