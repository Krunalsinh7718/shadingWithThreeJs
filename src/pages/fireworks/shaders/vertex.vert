uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

 void main(){

    vec3 newPosition = position;
    
    //exploding
    float explodingProgress = remap(uProgress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    //falling
    float fallingProgress = remap(uProgress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    //scaling
    float openingScaling = remap(uProgress, 0.0, 0.125, 0.0, 1.0);
    float closingScaling = remap(uProgress, 0.125, 1.0, 1.0, 0.0);
    float scalingProgress = min(openingScaling, closingScaling);
    scalingProgress = clamp(scalingProgress, 0.0, 1.0);

    //twinkling
    float twinklingProgress = remap(uProgress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float twinklingSize = sin(twinklingProgress * 30.0) * 0.5 + 0.5;
    twinklingSize = 1.0 - twinklingSize * twinklingProgress;


    vec4 modelPosition =  modelMatrix * vec4(newPosition,1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    //final size
    gl_PointSize = uSize * uResolution.y * aSize * scalingProgress * twinklingSize;
    gl_PointSize *= 1.0 / -viewPosition.z;
}