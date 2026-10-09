// 1. Core Border Logic (Refactored to use smoothstep for anti-aliasing)
float borderShape(float dist, float borderSize, float shapeSize, float edgeSmooth) {
    float halfBorder = borderSize * 0.5;
    
    // Outer edge smoothing
    float outer = 1.0 - smoothstep(shapeSize + halfBorder - edgeSmooth, shapeSize + halfBorder, dist);
    // Inner edge smoothing
    float inner = smoothstep(shapeSize - halfBorder - edgeSmooth, shapeSize - halfBorder, dist);
    
    return outer * inner;
}

// 2. Core Filled Logic (Using smoothstep)
float filledShape(float dist, float shapeSize, float edgeSmooth) {
    return 1.0 - smoothstep(shapeSize - edgeSmooth, shapeSize, dist);
}

// 3. Core Striped Logic (Using fract)
float stripedShape(float dist, float shapeSize, float stripeFrequency, float edgeSmooth) {
    // Mask out everything outside the main shape bounds
    float baseShape = filledShape(dist, shapeSize, edgeSmooth);
    
    // Create alternating stripes using fract
    float stripes = step(0.5, fract(dist * stripeFrequency));
    
    return  stripes;
}

// 4. The Master Variant Selector Function
// Styles: 0 = Filled, 1 = Bordered, 2 = Striped
float variantShape(float dist, int style, float shapeSize, float borderSize, float stripeFreq, float edgeSmooth) {
    if (style == 0) {
        return filledShape(dist, shapeSize, edgeSmooth);
    } else if (style == 1) {
        return borderShape(dist, borderSize, shapeSize, edgeSmooth);
    } else if (style == 2) {
        return stripedShape(dist, shapeSize, stripeFreq, edgeSmooth);
    }
    return 0.0;
}

// 5. Overloads to emulate "Default Parameters"
// Overload for FILLED (No border or stripe needed)
float variantShape(float dist, float shapeSize, float edgeSmooth) {
    return filledShape(dist, shapeSize, edgeSmooth);
}

// Overload for BORDERED
float variantShape(float dist, float shapeSize, float borderSize, float edgeSmooth) {
    return borderShape(dist, borderSize, shapeSize, edgeSmooth);
}