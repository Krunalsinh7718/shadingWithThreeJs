attribute float aSize;
attribute float aIndex;

uniform float uTime;
uniform float uPointSize;

varying vec3 vColor;

void main(){
    float radius = 1.0;
    vec3 newPosition = position;
    
    //model Normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

}