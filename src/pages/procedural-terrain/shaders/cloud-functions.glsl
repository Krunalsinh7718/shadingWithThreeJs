float getElevation(vec2 position, float uPositionFrequency, float uWarpFrequency, float uWarpStrength, float uStrength, float uTime, float uTimeFrequency){

    vec2 warpedPosition = position;
    warpedPosition += uTime * uTimeFrequency;
    warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency )  * uWarpStrength ;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;
    
    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign; 
    elevation *= uStrength;

    return elevation;
}