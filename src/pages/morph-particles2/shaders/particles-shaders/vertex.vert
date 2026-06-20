uniform float uTime;
uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uMinY;
uniform float uMaxY;
uniform vec3 uFrogWorldPos;
uniform vec3 uWandWorldPos;
uniform vec3 uPrinceWorldPos;

attribute vec3 aPositionTarget;
attribute vec3 aPositionTarget1;
attribute float aSize;

varying vec3 vColor;

#include "../../../includes/simplexNoise3d.glsl"

void main()
{

     vec3 newPos = position;
    float distance = distance(vec3(0.0), newPos );
    newPos = newPos * (
        sin((uTime * 0.5 ) + aSize * 10.0) *
        sin((uTime * 0.5 ) + aSize * 10.0)
    ) * 0.3;
     vec3 targetPosition = aPositionTarget + (uFrogWorldPos - uWandWorldPos);
     vec3 targetPosition1 = aPositionTarget1 + (uPrinceWorldPos - uWandWorldPos);

    float noiseOrigin =  simplexNoise3d(newPos * 0.2);
    float noiseTarget =  simplexNoise3d(targetPosition * 0.2);
    float noiseTarget1 =  simplexNoise3d(targetPosition1 * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);
    // vec3 mixedPosition = mix(newPos, targetPosition1, progress);

    //tornado effect
    vec3 centerPosition = mix(targetPosition, targetPosition1, progress);
    float tornadoStrength = sin(progress * 3.14159265);
    float heightFactor = smoothstep(uMinY, uMaxY, centerPosition.y);
    float rotationMultiplier = mix(2.0, 1.0, aPositionTarget.y);
    float angle = progress * 25.0 * rotationMultiplier + noise * 20.0;
    float funnelShape = pow(heightFactor, 3.0);
    float radius = 1.0 * tornadoStrength * (0.5 + noise);
    radius *= mix(0.03, 1.0, funnelShape);

    vec3 tornadoOffset;
    tornadoOffset.x = cos(angle) * radius;
    tornadoOffset.z = sin(angle) * radius;
    tornadoOffset.y = (noise - 0.5) * tornadoStrength;
    vec3 mixedPosition = centerPosition + tornadoOffset;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    float newPontSize = max(uSize * 4.0 * uProgress, 0.01);
    gl_PointSize = newPontSize * aSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    //varyings
    vColor = mix(uColorA, uColorB, 0.5);
}