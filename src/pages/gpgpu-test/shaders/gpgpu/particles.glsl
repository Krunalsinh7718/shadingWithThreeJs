
#include "../../../includes/simplexNoise4d.glsl"

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 texture = texture(uParticles, uv);
    gl_FragColor = texture;
}