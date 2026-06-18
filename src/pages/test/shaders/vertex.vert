attribute float aSize;
attribute float aIndex;

uniform float uTime;
uniform float uPointSize;

varying vec3 vColor;

void main(){
    float radius = 1.0;
    vec3 newPosition = position;
    vec3 targetPosition = vec3(0.0);

    vec3 direction = normalize(targetPosition - newPosition);
    // newPosition += direction * (uTime ) ;
    newPosition = newPosition * (
        sin((uTime ) + aIndex  ) 
    );

    float distance = distance(vec3(0.0) , newPosition);


    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = aSize * distance * uPointSize;
    gl_PointSize *= 1.0 / -viewPosition.z;

    vColor = vec3(
        abs(newPosition.x),
        abs(newPosition.y),
        abs(newPosition.z)
    );
}