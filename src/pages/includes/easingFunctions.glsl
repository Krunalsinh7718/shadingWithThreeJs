

// Easing functions

#define EasePI 3.14159265359

/**
 * Applies sine-based easing that starts slowly and accelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInSine(float t) {
    return 1.0 - cos((t * EasePI) / 2.0);
}

/**
 * Applies sine-based easing that starts quickly and decelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeOutSine(float t) {
    return sin((t * EasePI) / 2.0);
}

/**
 * Applies sine-based easing with slow acceleration and deceleration.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInOutSine(float t) {
    return -(cos(EasePI * t) - 1.0) / 2.0;
}

/**
 * Applies quadratic easing that starts slowly and accelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInQuad(float t) {
    return t * t;
}

/**
 * Applies quadratic easing that starts quickly and decelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeOutQuad(float t) {
    return t * (2.0 - t);
}

/**
 * Applies quadratic easing with acceleration followed by deceleration.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInOutQuad(float t) {
    return t < 0.5
        ? 2.0 * t * t
        : -1.0 + (4.0 - 2.0 * t) * t;
}

/**
 * Applies cubic easing that starts slowly and accelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInCubic(float t) {
    return t * t * t;
}

/**
 * Applies cubic easing that starts quickly and decelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeOutCubic(float t) {
    float f = t - 1.0;
    return f * f * f + 1.0;
}

/**
 * Applies cubic easing with acceleration followed by deceleration.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInOutCubic(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0;
}

/**
 * Applies quartic easing that starts slowly and accelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInQuart(float t) {
    return t * t * t * t;
}

/**
 * Applies quartic easing that starts quickly and decelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeOutQuart(float t) {
    float f = t - 1.0;
    return 1.0 - f * f * f * f;
}

/**
 * Applies exponential easing that starts slowly and accelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeInExpo(float t) {
    return t == 0.0 ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}

/**
 * Applies exponential easing that starts quickly and decelerates.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress.
 */
float easeOutExpo(float t) {
    return t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}

/**
 * Applies back easing with an overshoot before reaching the target.
 *
 * @param t - The normalized animation progress, typically in [0.0, 1.0].
 * @return The eased progress, which may temporarily exceed the [0.0, 1.0] range.
 */
float easeOutBack(float t) {
    float s = 1.70158;
    float f = t - 1.0;
    return f * f * ((s + 1.0) * f + s) + 1.0;
}