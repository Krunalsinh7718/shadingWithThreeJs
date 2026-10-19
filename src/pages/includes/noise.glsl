
/**
 * Generates 2D classic Perlin noise using gradient hashing and interpolation.
 *
 * @param P 2D input coordinates that determine the noise pattern.
 * @return  Smooth, continuous noise value produced from neighboring
 *          lattice gradients.
 */
float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);

    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;

    vec4 i = permute(permute(ix) + iy);

    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;

    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);

    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(
            dot(g00, g00),
            dot(g01, g01),
            dot(g10, g10),
            dot(g11, g11)
        );

    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;

    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));

    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);

    return 2.3 * n_xy;
}

/**
 * Generates smooth value noise using bilinear interpolation.
 *
 * @param st 2D input coordinates that determine the noise pattern.
 * @return   Interpolated pseudo-random value noise.
 */
float noiseMorganMcGuire(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = randomFloat2D(i);
    float b = randomFloat2D(i + vec2(1.0, 0.0));
    float c = randomFloat2D(i + vec2(0.0, 1.0));
    float d = randomFloat2D(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

/**
 * Generates a pseudo-random 2D gradient vector for a lattice point.
 *
 * @param z Integer coordinates of the lattice point.
 * @return  Deterministic gradient vector selected using an integer hash.
 */
vec2 grad(ivec2 z) {
    int n = z.x + z.y * 11111;

    n = (n << 13) ^ n;
    n = (n * (n * n * 15731 + 789221) + 1376312589) >> 16;

#if 0
    return vec2(cos(float(n)), sin(float(n)));
#else
    n &= 7;

    vec2 gr = vec2(n & 1, n >> 1) * 2.0 - 1.0;

    return (n >= 6) ? vec2(0.0, gr.x) :
           (n >= 4) ? vec2(gr.x, 0.0) :
                      gr;
#endif
}

/**
 * Generates 2D gradient noise using hashed lattice gradients.
 *
 * @param p 2D input coordinates that determine the noise pattern.
 * @return  Interpolated gradient noise value.
 */
float gradientNoise(in vec2 p) {
    ivec2 i = ivec2(floor(p));
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(
            dot(grad(i + ivec2(0, 0)), f - vec2(0.0, 0.0)),
            dot(grad(i + ivec2(1, 0)), f - vec2(1.0, 0.0)),
            u.x
        ),
        mix(
            dot(grad(i + ivec2(0, 1)), f - vec2(0.0, 1.0)),
            dot(grad(i + ivec2(1, 1)), f - vec2(1.0, 1.0)),
            u.x
        ),
        u.y
    );
}

/**
 * Creates repeating sinusoidal lines with adjustable thresholding.
 *
 * @param pos 2D input coordinates controlling the line pattern.
 * @param b   Threshold adjustment controlling the line appearance.
 * @return    A smooth mask value between 0.0 and 1.0.
 */
float lines(in vec2 pos, float b) {
    float scale = 10.0;
    pos *= scale;

    return smoothstep(
        0.0,
        0.5 + b * 0.5,
        abs((sin(pos.x * 3.1415) + b * 2.0)) * 0.5
    );
}

/**
 * Generates approximate 2D cellular (Worley) noise.
 *
 * Searches a 2x2 neighborhood for feature points and returns
 * the distances to the nearest two candidates. This faster
 * search can produce artifacts and inaccurate second-nearest distances.
 *
 * @param P 2D input coordinates that determine the cellular pattern.
 * @return  vec2(F1, F2), containing the approximate nearest and
 *          second-nearest feature-point distances.
 */
vec2 cellular2x2(vec2 P) {
    #define cell2x2K 0.142857142857
    #define cell2x2K2 0.0714285714285
    #define jitter 0.8

    vec2 Pi = mod(floor(P), 289.0);
    vec2 Pf = fract(P);

    vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
    vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);

    vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
    p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));

    vec4 ox = mod(p, 7.0) * cell2x2K + cell2x2K2;
    vec4 oy = mod(floor(p * cell2x2K), 7.0) * cell2x2K + cell2x2K2;

    vec4 dx = Pfx + jitter * ox;
    vec4 dy = Pfy + jitter * oy;
    vec4 d = dx * dx + dy * dy;

    float min1 = min(min(d.x, d.y), min(d.z, d.w));

    float min2 = max(min(d.x, d.y), min(d.z, d.w));
    min2 = min(min2, max(d.x, d.y));
    min2 = min(min2, max(d.z, d.w));

    return sqrt(vec2(min1, min2));
}

/**
 * Generates approximate 3D cellular (Worley) noise.
 *
 * Searches a reduced 2x2x2 neighborhood for feature points.
 * The reduced search is faster but may produce artifacts and
 * inaccurate second-nearest distances.
 *
 * @param P 3D input coordinates that determine the cellular pattern.
 * @return  vec2(F1, F2), containing the nearest and second-nearest
 *          approximate feature-point distances.
 */
vec2 cellular2x2x2(vec3 P) {
    #define cellular2x2x2K 0.142857142857
    #define cellular2x2x2Ko 0.428571428571
    #define cellular2x2x2K2 0.020408163265306
    #define cellular2x2x2Kz 0.166666666667
    #define cellular2x2x2Kzo 0.416666666667
    #define cellular2x2x2jitter 0.8

    vec3 Pi = mod(floor(P), 289.0);
    vec3 Pf = fract(P);

    vec4 Pfx = Pf.x + vec4(0.0, -1.0, 0.0, -1.0);
    vec4 Pfy = Pf.y + vec4(0.0, 0.0, -1.0, -1.0);

    vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
    p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));

    vec4 p1 = permute(p + Pi.z);
    vec4 p2 = permute(p + Pi.z + vec4(1.0));

    vec4 ox1 = fract(p1 * cellular2x2x2K) - cellular2x2x2Ko;
    vec4 oy1 = mod(floor(p1 * cellular2x2x2K), 7.0) * cellular2x2x2K - cellular2x2x2Ko;
    vec4 oz1 = floor(p1 * cellular2x2x2K2) * cellular2x2x2Kz - cellular2x2x2Kzo;

    vec4 ox2 = fract(p2 * cellular2x2x2K) - cellular2x2x2Ko;
    vec4 oy2 = mod(floor(p2 * cellular2x2x2K), 7.0) * cellular2x2x2K - cellular2x2x2Ko;
    vec4 oz2 = floor(p2 * cellular2x2x2K2) * cellular2x2x2Kz - cellular2x2x2Kzo;

    vec4 dx1 = Pfx + cellular2x2x2jitter * ox1;
    vec4 dy1 = Pfy + cellular2x2x2jitter * oy1;
    vec4 dz1 = Pf.z + cellular2x2x2jitter * oz1;

    vec4 dx2 = Pfx + cellular2x2x2jitter * ox2;
    vec4 dy2 = Pfy + cellular2x2x2jitter * oy2;
    vec4 dz2 = Pf.z - 1.0 + cellular2x2x2jitter * oz2;

    vec4 d1 = dx1 * dx1 + dy1 * dy1 + dz1 * dz1;
    vec4 d2 = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;

#if 0
    d1 = min(d1, d2);
    d1.xy = min(d1.xy, d1.wz);
    d1.x = min(d1.x, d1.y);
    return sqrt(d1.xx);
#else
    vec4 d = min(d1, d2);
    d2 = max(d1, d2);

    d.xy = (d.x < d.y) ? d.xy : d.yx;
    d.xz = (d.x < d.z) ? d.xz : d.zx;
    d.xw = (d.x < d.w) ? d.xw : d.wx;

    d.yzw = min(d.yzw, d2.yzw);
    d.y = min(d.y, d.z);
    d.y = min(d.y, d.w);
    d.y = min(d.y, d2.x);

    return sqrt(d.xy);
#endif
}

/**
 * Generates 2D cellular noise with information about the nearest cell border.
 *
 * Feature points are randomized within neighboring cells. The function
 * estimates the distance to the closest border and returns the offset
 * to the nearest feature point.
 *
 * @param x      2D input coordinates that determine the cellular pattern.
 * @param adjust Phase offset in radians applied to the feature-point
 *               animation or variation.
 * @return       vec3 containing the approximate border distance in x
 *               and the nearest feature-point offset in y and z.
 */
vec3 cellular2x2Border(in vec2 x, float adjust) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    vec2 mg, mr;
    float md = 8.0;

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = randomVec2(n + g);

            o = 0.5 + 0.5 * sin(adjust + 6.2831 * o);

            vec2 r = g + o - f;
            float d = dot(r, r);

            if (d < md) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    md = 8.0;

    for (int j = -2; j <= 2; j++) {
        for (int i = -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = randomVec2(n + g);

            o = 0.5 + 0.5 * sin(adjust + 6.2831 * o);

            vec2 r = g + o - f;

            if (dot(mr - r, mr - r) > 0.00001) {
                md = min(
                    md,
                    dot(0.5 * (mr + r), normalize(r - mr))
                );
            }
        }
    }

    return vec3(md, mr);
}

#define FRACTAL_NOICE_OCTAVES 6

/**
 * Generates fractal noise by combining multiple octaves of value noise.
 *
 * Each octave increases the input frequency while reducing its amplitude,
 * creating detail at multiple scales.
 *
 * @param st 2D input coordinates that determine the noise pattern.
 * @return   Accumulated fractal noise value.
 */
float fractalNoise(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < FRACTAL_NOICE_OCTAVES; i++) {
        value += amplitude * noiseMorganMcGuire(st);

        st *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}
