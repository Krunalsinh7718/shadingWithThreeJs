/**
 * Translates UV coordinates by a given offset.
 *
 * @param uv - The input UV coordinates.
 * @param translate - The translation offset along the X and Y axes.
 * @return The translated UV coordinates.
 */
vec2 translateUV(vec2 uv, vec2 translate) {
    return uv += translate;
}

/**
 * Rotates UV coordinates around their center (0.5, 0.5).
 *
 * @param uv - The input UV coordinates.
 * @param angle - The rotation angle in radians.
 * @return The rotated UV coordinates.
 */
vec2 rotate2d(vec2 uv, float angle) {
    uv -= 0.5;
    float s = sin(angle);
    float c = cos(angle);
    uv = mat2(c, -s, s, c) * uv;
    uv += 0.5;
    return uv;
}

/**
 * Creates a 2D scaling matrix.
 *
 * @param _scale - The scaling factors for the X and Y axes.
 * @return A 2D matrix that scales coordinates along each axis.
 */
mat2 scale(vec2 _scale) {
    return mat2(
        _scale.x, 0.0,
        0.0, _scale.y
    );
}
