
uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uHorizonColor;
uniform vec3 uSunColor;
uniform vec3 uMountainFarColor;
uniform vec3 uMountainNearColor;
uniform vec3 uCloudColor;

varying vec3 vDirection;

#define PI 3.14159265359

// --------------------------------------------------
// 1. Hash and procedural noise
// --------------------------------------------------

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
        value += amplitude * noise2D(p);
        p = p * 2.0 + vec2(17.1, 9.2);
        amplitude *= 0.5;
    }

    return value;
}

// --------------------------------------------------
// 2. Mountain ridge generator
// --------------------------------------------------

float mountainRidge(float x, float seed) {
    float ridge = 0.0;

    ridge += 0.100 * sin(x * 1.8 + seed);
    ridge += 0.065 * sin(x * 3.7 - seed * 1.7);
    ridge += 0.035 * sin(x * 7.2 + seed * 2.3);
    ridge += 0.018 * sin(x * 13.0 - seed);

    return ridge;
}

// --------------------------------------------------
// 3. Main environment
// --------------------------------------------------

void main() {
    vec3 dir = normalize(vDirection);

    // Perspective-like coordinates for the sky artwork.
    // The sphere faces the camera from the inside.
    vec2 p = dir.xy / max(-dir.z, 0.15);

    float horizon = smoothstep(-0.65, 0.65, dir.y);

    // Sky gradient.
    vec3 sky = mix(
        uHorizonColor,
        uTopColor,
        pow(horizon, 0.65)
    );

    // Warm atmospheric glow near the horizon.
    float horizonGlow = exp(-abs(p.y + 0.12) * 3.0);
    sky = mix(sky, uSunColor, horizonGlow * 0.12);

    // Sun disc and halo.
    vec2 sunPosition = vec2(0.0, 0.12);
    float sunDistance = length(p - sunPosition);

    float sunDisc = 1.0 - smoothstep(
        0.105 - fwidth(sunDistance),
        0.105 + fwidth(sunDistance),
        sunDistance
    );

    float sunGlow = exp(-sunDistance * 5.0);

    // sky += uSunColor * sunGlow * 0.22;
    // sky = mix(sky, uSunColor, sunDisc);

    // Clouds: animate noise horizontally.
    vec2 cloudUV = p * vec2(2.4, 4.0);
    cloudUV += vec2(uTime * 0.025, 0.0);
    cloudUV.y += sin(p.x * 1.4) * 0.06;

    float cloudNoise = fbm(cloudUV);

    float cloudMask = smoothstep(
        0.53,
        0.72,
        cloudNoise
    );

    // Restrict clouds to the sky above the mountains.
    float cloudRegion =
        smoothstep(-0.05, 0.20, p.y) *
        (1.0 - smoothstep(0.50, 0.80, p.y));

    float cloudAlpha = cloudMask * cloudRegion * 0.72;

    // Far mountain range.
    float farRidge =
        -0.30 + mountainRidge(p.x * 1.15, 1.7);

    float farAA = max(fwidth(p.y), 0.0001);
    float farMask = 1.0 - smoothstep(
        farRidge - farAA,
        farRidge + farAA,
        p.y
    );

    sky = mix(sky, uMountainFarColor, farMask);

    // Near mountain range.
    float nearRidge =
        -0.43 + mountainRidge(p.x * 0.85, 4.1);

    float nearAA = max(fwidth(p.y), 0.0001);
    float nearMask = 1.0 - smoothstep(
        nearRidge - nearAA,
        nearRidge + nearAA,
        p.y
    );

    sky = mix(sky, uMountainNearColor, nearMask);

    // Clouds are composited above the mountains.
    sky = mix(sky, uCloudColor, cloudAlpha);

    gl_FragColor = vec4(sky, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
