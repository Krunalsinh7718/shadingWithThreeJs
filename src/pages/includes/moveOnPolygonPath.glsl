uniform vec2 u_resolution;
uniform float u_time;

// Define how many vertices your polygon has
#define NUM_VERTICES 4
const vec2 vertices[NUM_VERTICES] = vec2[](
    vec2(0.2, 0.2), // Bottom-left
    vec2(0.8, 0.2), // Bottom-right
    vec2(0.8, 0.8), // Top-right
    vec2(0.2, 0.8)  // Top-left
);

// Function to calculate the position of the moving point along the perimeter
vec2 getPointOnPolygon(float time, float speed) {
    // 1. Calculate the total perimeter and individual segment lengths
    float lengths[NUM_VERTICES];
    float totalPerimeter = 0.0;
    
    for (int i = 0; i < NUM_VERTICES; i++) {
        vec2 p1 = vertices[i];
        vec2 p2 = vertices[(i + 1) % NUM_VERTICES];
        lengths[i] = length(p2 - p1);
        totalPerimeter += lengths[i];
    }
    
    // 2. Determine total distance traveled based on time, wrapped by the perimeter
    float currentDist = mod(time * speed, totalPerimeter);
    
    // 3. Find which segment the point is currently on and interpolate
    float accumulatedDist = 0.0;
    vec2 pointPos = vertices[0];
    
    for (int i = 0; i < NUM_VERTICES; i++) {
        float nextDist = accumulatedDist + lengths[i];
        if (currentDist >= accumulatedDist && currentDist <= nextDist) {
            float localDist = currentDist - accumulatedDist;
            float t = localDist / lengths[i]; // Normalized 0.0 to 1.0 progress on this edge
            
            vec2 startVertex = vertices[i];
            vec2 endVertex = vertices[(i + 1) % NUM_VERTICES];
            
            pointPos = mix(startVertex, endVertex, t); // GLSL native linear interpolation (lerp)
            break;
        }
        accumulatedDist = nextDist;
    }
    
    return pointPos;
}

void main() {
    // Normalize coordinates (0.0 to 1.0) adjusted for aspect ratio
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Get the current position of the moving dot (speed = 0.5 units/sec)
    vec2 dotPos = getPointOnPolygon(u_time, 0.5);
    
    // Calculate distance from current pixel to the dot
    float distToDot = length(st - dotPos);
    
    // Draw the dot using a smooth step function for anti-aliased edges
    float dotRadius = 0.015;
    float dotMask = smoothstep(dotRadius, dotRadius - 0.002, distToDot);
    
    // Output color: White dot on a dark blue background
    vec3 backgroundColor = vec3(0.1, 0.14, 0.2);
    vec3 dotColor = vec3(1.0, 0.85, 0.3);
    
    vec3 finalColor = mix(backgroundColor, dotColor, dotMask);
    
    gl_FragColor = vec4(finalColor, 1.0);
}