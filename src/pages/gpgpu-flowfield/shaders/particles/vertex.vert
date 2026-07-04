uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticleTexture;

varying vec3 vColor;

attribute vec2 aParticlesUv;

void main()
{
    //new position
    vec4 texture = texture(uParticleTexture, aParticlesUv);
    vec3 newPos = texture.xyz;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings
    vColor = vec3(1.0);
}