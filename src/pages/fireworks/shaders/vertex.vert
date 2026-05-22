uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

 void main(){

    vec3 newPosition = position;
    float progress = uProgress * aTimeMultiplier;
    
    //exploding
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    //falling
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    //scaling
    float openingScaling = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float closingScaling = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float scalingProgress = min(openingScaling, closingScaling);
    scalingProgress = clamp(scalingProgress, 0.0, 1.0);

    //twinkling
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
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

    if(gl_PointSize < 1.0){
        gl_Position = vec4(9999.9);
    }
}