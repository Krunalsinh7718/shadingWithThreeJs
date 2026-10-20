
#define patternsPI 3.1415926535897932384626433832795

/**
 * Animates a tiled UV pattern by alternating horizontal and vertical movement.
 *
 * @param uv     Original 2D texture coordinates.
 * @param zoom   Scale factor applied to the UV coordinates.
 * @param adjuct Animation phase controlling movement direction and progress.
 * @return       Wrapped UV coordinates in the range [0.0, 1.0).
 */
vec2 brickTile(vec2 uv, float zoom, float adjuct) {
    uv *= zoom;

    float timeGap = 2.0;
    float halfGap = timeGap * 0.5;

    float cycle = mod(adjuct, timeGap);
    bool moveX = cycle >= halfGap;

    float progress = mod(adjuct, halfGap) / halfGap;

    float colORrow = moveX ? uv.y : uv.x;
    float dir = mod(floor(colORrow), 2.0);

    float move = (dir < 1.0) ? -1.0 : 1.0;

    if (moveX) {
        uv.x -= progress * move;
    } else {
        uv.y -= progress * move;
    }

    return fract(uv);
}

/**
 * Generates a repeating triangular tile pattern with alternating orientations.
 *
 * @param uv   2D texture coordinates.
 * @param zoom Number of tiles per coordinate unit.
 * @return     Pattern mask indicating which side of the tile diagonal
 *             the UV coordinate occupies.
 */
float tilePattern1(vec2 uv, float zoom) {
    uv *= zoom;
    uv = fract(uv);

    uv *= 2.0;

    float index = 0.0;
    index += step(1.0, mod(uv.x, 2.0));
    index += step(1.0, mod(uv.y, 2.0));

    uv = fract(uv);

    if (index == 1.0) {
        uv = rotate2D(uv, PI * 0.5);
    } else if (index == 2.0) {
        uv = rotate2D(uv, PI * -0.5);
    } else if (index == 3.0) {
        uv = rotate2D(uv, PI);
    }

    float strength = step(uv.x, uv.y);

    return strength;
}

/**
 * Transforms tile coordinates to create variations of a Truchet pattern.
 *
 * @param _st    Local UV coordinates within a tile.
 * @param _index Random or scalar value used to select the tile orientation.
 * @return       Transformed tile coordinates.
 */
vec2 truchetPattern(in vec2 _st, in float _index) {
    _index = fract((_index - 0.660) * 1.000);

    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0 - _st.x, _st.y);
    } else if (_index > 0.25) {
        _st = 1.0 - vec2(1.0 - _st.x, _st.y);
    }

    return _st;
}

/**
 * Generates a configurable Truchet tile pattern.
 *
 * @param uv     2D texture coordinates.
 * @param zoom   Number of tiles per coordinate unit.
 * @param type   Pattern style: 0 = maze-like lines,
 *               1 = circular arcs, 2 = triangular regions.
 * @param adjuct Horizontal coordinate offset used to animate the pattern.
 * @return       Pattern intensity for the selected tile style.
 */
float truchetPatternMain(vec2 uv, float zoom, float type, float adjuct) {
    uv *= zoom;
    uv.x += adjuct * 3.0;

    vec2 ipos = floor(uv);
    vec2 fpos = fract(uv);

    float randIpos = random(ipos);
    vec2 tile = truchetPattern(fpos, randIpos);

    float strength = 0.0;

    if (type == 0.0) {
        strength = smoothstep(tile.x - 0.3, tile.x, tile.y)
                 - smoothstep(tile.x, tile.x + 0.3, tile.y);
    }

    if (type == 1.0) {
        strength = (step(length(tile), 0.6)
                  - step(length(tile), 0.4))
                 + (step(length(tile - vec2(1.0)), 0.6)
                  - step(length(tile - vec2(1.0)), 0.4));
    }

    if (type == 2.0) {
        strength = step(tile.x, tile.y);
    }

    return strength;
}

/**
 * Creates a repeating grid pattern by combining two rotated polygon fields.
 *
 * @param uv   2D texture coordinates.
 * @param zoom Number of grid cells per coordinate unit.
 * @return     Combined grid mask, with polygon interiors removed
 *             where the two shapes overlap.
 */
float gridPattern(vec2 uv, float zoom) {
    uv *= zoom;
    uv = fract(uv);

    float box1 = polygonField(uv - 0.5, int(4), patternsPI / 4.0);
    float box2 = polygonField(uv - 0.5, int(4), 0.0);

    float strength = variantShape(
        box1, 0, 0.48 + 0.09, 0.02, 5.0, 0.001, 0.0
    );

    float strength1 = variantShape(
        box2, 0, 0.48, 0.02, 5.0, 0.001, 0.0
    );

    float finalStrength = 1.0 - (strength * strength1);

    return finalStrength;
}

/**
 * Creates a repeating waved grid pattern.
 *
 * @param uv            2D texture coordinates.
 * @param borderSize    border width.
 * @param borderSmooth  amount of border blur.
 * @param amplitude     wave height.
 * @param frequency     amount of wave.
 * @param adjust        forward or backward wave movement.
 * @return              Combined waved grid mask.
 */
float wavedGridPattern(vec2 uv, float borderSize, float borderSmooth, float amplitude, float frequency, float adjust ){

    float waveX =  0.5 + sin(uv.y * frequency + adjust) * amplitude;
      float stripeX = smoothstep(waveX, waveX + borderSmooth, fract(uv.x)) - smoothstep(borderSize + waveX, borderSize + waveX + borderSmooth, fract(uv.x));
      float waveY = 0.5 + cos(uv.x * frequency + adjust) * amplitude;
      float stripeY = smoothstep(waveY, waveY + borderSmooth, fract(uv.y)) - smoothstep(borderSize + waveY, borderSize + waveY + borderSmooth, fract(uv.y));

      float strength = stripeX + stripeY;

      return strength;
}

/**
 * Calculates the distance to the nearest point in a fixed-point pattern.
 *
 * @param uv     2D coordinate at which to evaluate the pattern.
 * @param mouse  Interactive feature-point position.
 * @param adjust Reserved parameter; currently unused.
 * @return       Minimum Euclidean distance to the nearest feature point.
 */
float cellularNoiseFixedPointsInigosQuilez(
    vec2 uv,
    vec2 mouse,
    float adjust
) {
    vec2 point[6];

    point[0] = vec2(0.83, 0.75);
    point[1] = vec2(0.60, 0.07);
    point[2] = vec2(0.28, 0.64);
    point[3] = vec2(0.31, 0.26);
    point[4] = mouse;

    float m_dist = 1.0;

    for (int i = 0; i < 5; i++) {
        float dist = distance(uv, point[i]);
        m_dist = min(m_dist, dist);
    }

    float strength = m_dist;

    return strength;
}

/**
 * Generates a fixed-point cellular pattern using the nearest point's position.
 *
 * @param uv     2D coordinate at which to evaluate the pattern.
 * @param mouse  Interactive feature-point position.
 * @param adjust Reserved parameter; currently unused.
 * @return       Scalar intensity derived from the nearest feature point's
 *               position using a weighted dot product.
 */
float cellularNoiseFixedPointsVoronoi(
    vec2 uv,
    vec2 mouse,
    float adjust
) {
    float min_dist = 1.0;
    vec2 m_point;

    vec2 point[6];

    point[0] = vec2(0.83, 0.75);
    point[1] = vec2(0.60, 0.07);
    point[2] = vec2(0.28, 0.64);
    point[3] = vec2(0.31, 0.26);
    point[4] = mouse;

    for (int i = 0; i < 5; i++) {
        float dist = distance(uv, point[i]);

        if (dist < min_dist) {
            min_dist = dist;
            m_point = point[i];
        }
    }

    float strength = dot(m_point, vec2(0.3, 0.6));

    return strength;
}

/**
 * Generates a procedural cellular pattern with optional stripes,
 * mouse interaction, and center-point highlighting.
 *
 * @param uv              2D texture coordinates.
 * @param zoom            Integer grid scale and search-window size.
 * @param mouse           Mouse position in the original UV coordinate space.
 * @param mouseRadius     Radius of the mouse influence; disables the mask
 *                        when zero or negative.
 * @param stripe          Stripe frequency; positive values enable stripes.
 * @param centerPointSize Threshold for highlighting nearby feature points.
 * @param adjust          Phase offset controlling feature-point placement
 *                        and stripe animation.
 * @return                Combined cellular pattern intensity.
 */
float cellularNoiseGrid(
    vec2 uv,
    int zoom,
    vec2 mouse,
    float mouseRadius,
    float stripe,
    float centerPointSize,
    float adjust
) {
    uv *= float(zoom);

    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);

    float m_dist = 1.0;

    int subGridMin = zoom / 2 * -1;
    int subGridMax = zoom / 2;

    for (int y = subGridMin; y <= subGridMax; y++) {
        for (int x = subGridMin; x <= subGridMax; x++) {
            vec2 neighbor = vec2(float(x), float(y));

            vec2 point = randomVec2(i_st + neighbor);
            point = sin(point * 6.2831 + adjust) * 0.5 + 0.5;

            vec2 diff = neighbor + point - f_st;
            float dist = length(diff / 2.0);

            m_dist = min(m_dist, dist * dist);
        }
    }

    float strength = 0.0;

    strength += m_dist;

    if (stripe > 0.0) {
        strength += sin(m_dist * stripe - adjust);
    } else {
        strength += m_dist;
    }

    if (mouseRadius > 0.0) {
        float mouseDist = distance(uv / float(zoom), mouse) * 2.0;
        float mouseGlow = smoothstep(mouseRadius, 0.0, mouseDist);

        strength *= mouseGlow;
    }

    if (centerPointSize > 0.0) {
        strength += 1.0 - step(centerPointSize, m_dist);
    }

    return strength;
}

/**
 * Generates a binary cellular pattern using a distance-based threshold.
 *
 * Uses animated pseudo-random feature points and a reduced distance
 * calculation to create a cellular mask.
 *
 * @param uv     2D texture coordinates.
 * @param zoom   Integer grid scale and search-window size.
 * @param adjust Phase offset controlling feature-point placement.
 * @return       Binary-like mask produced by thresholding the
 *               calculated cellular distance.
 */
float cellularNoiseGridInigosQuilez(vec2 uv, int zoom, float adjust) {
    uv *= float(zoom);

    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);

    float m_dist = 1.0;

    int subGridMin = zoom / 2 * -1;
    int subGridMax = zoom / 2;

    for (int y = subGridMin; y <= subGridMax; y++) {
        for (int x = subGridMin; x <= subGridMax; x++) {
            vec2 neighbor = vec2(float(x), float(y));

            vec2 point = randomVec2(i_st + neighbor);
            point = sin(point * 6.2831 + adjust) * 0.5 + 0.5;

            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            m_dist = min(m_dist, m_dist * dist);
        }
    }

    float strength = 0.0;
    strength += step(0.06, m_dist);

    return strength;
}

/**
 * Generates a cellular Voronoi pattern with optional stripes,
 * mouse interaction, and feature-point highlighting.
 *
 * @param uv              2D texture coordinates.
 * @param zoom            Integer grid scale and search-window size.
 * @param mouse           Mouse position in the original UV coordinate space.
 * @param mouseRadius     Radius of the mouse influence; disables the mask
 *                        when zero or negative.
 * @param stripe          Stripe frequency; positive values enable stripes.
 * @param centerPointSize Threshold for highlighting nearby feature points.
 * @param adjust          Phase offset controlling feature-point placement
 *                        and stripe animation.
 * @return                Combined intensity based on the nearest feature
 *                        point, distance, stripes, and mouse influence.
 */
float cellularNoiseGridVoronoi(
    vec2 uv,
    int zoom,
    vec2 mouse,
    float mouseRadius,
    float stripe,
    float centerPointSize,
    float adjust
) {
    float m_dist = 10.0;
    vec2 m_point;

    uv *= float(zoom);

    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);

    int subGridMin = zoom / 2 * -1;
    int subGridMax = zoom / 2;

    for (int y = subGridMin; y <= subGridMax; y++) {
        for (int x = subGridMin; x <= subGridMax; x++) {
            vec2 neighbor = vec2(float(x), float(y));

            vec2 point = randomVec2(i_st + neighbor);
            point = sin(point * 6.2831 + adjust) * 0.5 + 0.5;

            vec2 diff = neighbor + point - f_st;
            float dist = length(diff / 2.0);

            if (dist < m_dist) {
                m_dist = dist;
                m_point = point;
            }
        }
    }

    float strength = 0.0;

    strength += dot(m_point, vec2(0.3, 0.6));

    if (stripe > 0.0) {
        strength += sin(m_dist * stripe - adjust);
    } else {
        strength += m_dist;
    }

    if (mouseRadius > 0.0) {
        float mouseDist = distance(uv / float(zoom), mouse) * 2.0;
        float mouseGlow = smoothstep(mouseRadius, 0.0, mouseDist);

        strength *= mouseGlow;
    }

    if (centerPointSize > 0.0) {
        strength += 1.0 - step(centerPointSize, m_dist);
    }

    return strength;
}
