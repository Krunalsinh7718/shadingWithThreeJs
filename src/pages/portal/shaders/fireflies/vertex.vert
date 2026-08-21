uniform float uSize;
uniform float uTime;

attribute float aSize;


void main()
{
    vec3 newPos = position;

    newPos.y += sin(uTime + newPos.x * 100.0) * aSize * 0.2;


    vec4 modelPosition =  modelMatrix * vec4(newPos,1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aSize;
    gl_PointSize *= (1.0 / - viewPosition.z);

}