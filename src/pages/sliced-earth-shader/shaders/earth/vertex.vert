// attribute vec2 uv;
varying vec2 vUv;
varying vec3 vNormalModel;
varying vec3 vPosition;

void main(){
   
    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // Varyings
    vUv = uv;
    vNormalModel = modelNormal;
    vPosition = csm_Position.xyz;

}


