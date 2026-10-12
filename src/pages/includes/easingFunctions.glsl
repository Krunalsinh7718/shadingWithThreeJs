#define EasePI 3.14159265359


//Sine Easings

float easeInSine(float t) {
    return 1.0 - cos((t * EasePI) / 2.0);
}

float easeOutSine(float t) {
    return sin((t * EasePI) / 2.0);
}

float easeInOutSine(float t) {
    return -(cos(EasePI * t) - 1.0) / 2.0;
}


//Quadratic Easings
float easeInQuad(float t) {
    return t * t;
}

float easeOutQuad(float t) {
    return t * (2.0 - t);
}

float easeInOutQuad(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
}


//Cubic & Quartic Easings
// Cubic
float easeInCubic(float t) {
    return t * t * t;
}

float easeOutCubic(float t) {
    float f = t - 1.0;
    return f * f * f + 1.0;
}

float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0;
}

// Quartic
float easeInQuart(float t) {
    return t * t * t * t;
}

float easeOutQuart(float t) {
    float f = t - 1.0;
    return 1.0 - f * f * f * f;
}


//Exponential Easings
float easeInExpo(float t) {
    return t == 0.0 ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}

float easeOutExpo(float t) {
    return t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}


//Back Easings (Overshoot)
float easeOutBack(float t) {
    float s = 1.70158;
    float f = t - 1.0;
    return f * f * ((s + 1.0) * f + s) + 1.0;
}

