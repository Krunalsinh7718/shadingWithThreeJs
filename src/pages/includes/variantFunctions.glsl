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
float stripedShape(float dist, float shapeSize, float stripeFrequency, float edgeSmooth, float adjuct) {
    // Mask out everything outside the main shape bounds
    float baseShape = filledShape(dist, shapeSize, edgeSmooth);
    
    // Create alternating stripes using fract
    float stripes = step(0.5, fract(dist * stripeFrequency + adjuct) );
    
    return  baseShape * stripes;
}

// 4. The Master Variant Selector Function
// Styles: 0 = Filled, 1 = Bordered, 2 = Striped
float variantShape(float dist, int style, float shapeSize, float borderSize, float stripeFreq, float edgeSmooth, float adjuct) {
    if (style == 0) {
        return filledShape(dist, shapeSize, edgeSmooth);
    } else if (style == 1) {
        return borderShape(dist, borderSize, shapeSize, edgeSmooth);
    } else if (style == 2) {
        return stripedShape(dist, shapeSize, stripeFreq, edgeSmooth, adjuct);
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




float getAngle(vec2 uv){
    //-------------------------------
      //getOrignatedAngle function returns angle value for angled circle.
      //valus at 0 angle is near to 0 and values at to 6.28 angle is near to 1 
      //@param {vec2} uv : texture uv
    //--------------------------------
    return atan( uv.y, uv.x) / (PI * 2.0) + 0.5;
}

float triangleField(vec2 uv) {
    // Mirror the X axis for perfect left/right symmetry
    uv.x = abs(uv.x);
    
    // Normals for a 60-degree equilateral triangle edge
    // cos(30°) = 0.866025, sin(30°) = 0.5
    vec2 edgeNormal = vec2(0.866025, 0.5);
    
    // Project uv onto the angled side edge, and compare it against the flat bottom edge
    float sides = dot(uv, edgeNormal);
    float bottom = -uv.y; 
    
    // Return the maximum distance (intersection of the planes)
    return max(sides, bottom);
}

float circleField(vec2 uv) {
    return length(uv);
}

float rectangleField(vec2 uv) {
    return max(abs(uv.x),abs(uv.y));
}

float wavedCircleField(vec2 uv, float waveCount, float waveHeight, float adjuct){
    float angle = getAngle(uv) + adjuct;
    float radius =  sin(angle * PI * 2.0 * waveCount) * waveHeight;
    return  circleField(uv) + radius;
}

