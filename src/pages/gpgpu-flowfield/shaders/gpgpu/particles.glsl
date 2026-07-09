
uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;

#include "../../../includes/simplexNoise4d.glsl"

void main(){

    float time = uTime * 0.2;
    
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particles = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    // Dead
    if(particles.a >= 1.0){
        particles.a = mod(particles.a, 1.0);
        particles.xyz = base.xyz;
    }
    // Alive
    else {
        //strength
        float strength = simplexNoise4d(vec4(base.xyz, time + 1.0));
        strength = smoothstep(uFlowFieldInfluence, 1.0, strength);
        //flow field
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particles.xyz + 0.0, time)),
            simplexNoise4d(vec4(particles.xyz + 1.0, time)),
            simplexNoise4d(vec4(particles.xyz + 2.0, time))
        );

        flowField = normalize(flowField);
        particles.xyz += flowField * uDeltaTime * strength * 0.5;

        //decay
        particles.a += uDeltaTime * 0.3;

    }



    gl_FragColor = particles;
}