
#include "../../../includes/simplexNoise4d.glsl"

void main(){
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 texture = texture(uParticles, uv);
    // texture.y += 0.1;
    gl_FragColor = texture;
}