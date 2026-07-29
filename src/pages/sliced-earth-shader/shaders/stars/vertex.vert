
varying vec3 vColor;

uniform float uSize;

attribute float scales;



void main(){
    //positions
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    gl_PointSize = uSize * scales;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = color;
}


