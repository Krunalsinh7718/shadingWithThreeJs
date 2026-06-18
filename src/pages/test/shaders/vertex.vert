attribute float aSize;
attribute float aIndex;

uniform float uTime;
uniform float uPointSize;

void main(){
    float radius = 1.0;
    vec3 newPosition = position;
    vec3 targetPosition = vec3(0.0);

    vec3 direction = normalize(targetPosition - newPosition);
    // newPosition += direction * (uTime ) ;
    newPosition = newPosition * (
        sin((uTime ) + aIndex  ) 
    );


    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = aSize * uPointSize;
    gl_PointSize *= 1.0 / -viewPosition.z;
}