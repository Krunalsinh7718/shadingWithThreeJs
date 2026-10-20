#define PI 3.1415926535897932384626433832795

float getOrignatedAngle(vec2 uv, vec2 centerPoint){
    //-------------------------------
      //getOrignatedAngle function returns angle value for angled circle.
      //valus at 0 angle is near to 0 and values at to 6.28 angle is near to 1 
      //@param {vec2} uv : texture uv
      //@param {vec2} centerPoint: X Y position of circle origin
    //--------------------------------
    return atan( uv.y - centerPoint.y, uv.x - centerPoint.x) / (PI * 2.0) + 0.5;
}

/**
 * Calculates the quintic fade curve used for smooth interpolation.
 *
 * @param t 2D interpolation values, typically in the range [0.0, 1.0].
 * @return  Smoothed interpolation values with zero first and second
 *          derivatives at the endpoints.
 */
vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

/**
 * Applies a permutation polynomial to a 4D vector.
 *
 * Commonly used in procedural noise algorithms to generate
 * pseudo-random, repeating hash values.
 *
 * @param x Input vector of values.
 * @return  Permuted values wrapped to the range [0.0, 289.0).
 */
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

/**
 * Rotates UV coordinates around their center (0.5, 0.5).
 *
 * @param uv    2D texture coordinates.
 * @param angle Rotation angle in radians.
 * @return      Rotated UV coordinates.
 */
vec2 rotate2D(vec2 uv, float angle) {
    uv -= 0.5;

    float s = sin(angle);
    float c = cos(angle);

    uv = mat2(c, -s, s, c) * uv;
    uv += 0.5;

    return uv;
}

/**
 * Generates a pseudo-random scalar value from 2D coordinates.
 *
 * @param value 2D input coordinates used as the random seed.
 * @return      Pseudo-random value in the range [0.0, 1.0).
 */
float randomFloat2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

/**
 * Generates a pseudo-random scalar value from 2D coordinates.
 *
 * Uses the same hash calculation as randomFloat2D().
 *
 * @param _st 2D input coordinates used as the random seed.
 * @return    Pseudo-random value in the range [0.0, 1.0).
 */
float random(in vec2 _st) {
    return fract(
        sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123
    );
}

/**
 * Generates a pseudo-random 2D vector from 2D coordinates.
 *
 * Each output component is calculated using a different dot-product
 * hash, making this useful for procedural patterns and particle effects.
 *
 * @param p 2D input coordinates used as the random seed.
 * @return  2D pseudo-random vector with components in [0.0, 1.0).
 */
vec2 randomVec2(vec2 p) {
    return fract(
        sin(vec2(
            dot(p, vec2(127.1, 311.7)),
            dot(p, vec2(269.5, 183.3))
        )) * 43758.5453
    );
}

/**
 * Generates a pseudo-random scalar value from a single input.
 *
 * @param value Scalar input used as the random seed.
 * @return      Pseudo-random value in the range [0.0, 1.0).
 */
float rand(float value) {
    return fract(sin(value) * 100000.0);
}

/**
 * Remaps a value from one numeric range to another.
 *
 * @param value          Input value to remap.
 * @param originMin      Minimum of the source range.
 * @param originMax      Maximum of the source range.
 * @param destinationMin Minimum of the target range.
 * @param destinationMax Maximum of the target range.
 * @return               Remapped value in the target range.
 */
float remap(
    float value,
    float originMin,
    float originMax,
    float destinationMin,
    float destinationMax
) {
    return destinationMin
        + (value - originMin) * (destinationMax - destinationMin)
        / (originMax - originMin);
}


vec2 wavedUv(vec2 uv, float wavelength, float amplitude){
    //-------------------------------
      //wavedUv function returns vec2 value for waved uv. 
      //@param {vec2} uv : texture uv
      //@param {float} wavelength: wavelength of wave
      //@param {vec2} amplitude: amplitude of wave
    //--------------------------------
    return vec2(
        uv.x + sin(uv.y * wavelength) * amplitude,
        uv.y + sin(uv.x * wavelength) * amplitude
    );
}



