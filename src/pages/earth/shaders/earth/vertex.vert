varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
    //positions
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    // vec3 modelNormal = normal;

    //point size
    gl_PointSize = 100.0 ;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;

}


