uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;

uniform float uTime;
uniform vec3 uFrogWorldPos;
uniform vec3 uWandWorldPos;

attribute vec3 aPositionTarget;
attribute float aSize;

varying vec3 vColor;

#include "../../../includes/simplexNoise3d.glsl"

void main()
{
    vec3 targetPosition = aPositionTarget + (uFrogWorldPos - uWandWorldPos);
    float noiseOrigin =  simplexNoise3d(position * 0.2);
    float noiseTarget =  simplexNoise3d(aPositionTarget * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, targetPosition, progress);

    //elevation
    vec3 dir = normalize(position);
    float noiseMix = simplexNoise3d( position * 4.0 + uTime );
    mixedPosition += dir * aSize * sin(uTime * aSize * 3.0) * 0.03;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    float newPontSize = max(uSize * 0.01 * uProgress, 0.001);
    gl_PointSize = newPontSize  * aSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    //varyings
    vColor = mix(uColorA, uColorB, 0.5);
}