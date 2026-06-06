uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uImage;
uniform sampler2D uDisplacementTexture;

varying vec2 vUv;
varying vec3 vColor;

attribute float aIntensity;
attribute float aAngle;

void main(){
    // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
    vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        aAngle * 0.2
    );
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    newPosition += displacement;

    newPosition.x +=  sin(uTime * 10.0 + aAngle) * 0.01; 
    // newPosition.z +=  cos(uTime * 0.8) ; 
    newPosition.y +=  cos(uTime * 10.0 + aAngle) * 0.01; 

    //positions
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //image
    float pictureIntensity = texture(uImage, uv).r;

    // Point size
    gl_PointSize = 0.08 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);




    //varying
    vUv = uv;
    vColor = vec3(pow(pictureIntensity, 2.0));;

}


