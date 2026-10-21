varying vec3 vRandom;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

uniform vec3 uColor;
uniform sampler2D uTexture;

void main(){
    vec3 normal = normalize(vNormal);
    float elevation = vElevation;

if (!gl_FrontFacing) {
    normal = -normal;
}
if (!gl_FrontFacing) {
    elevation = -elevation;
}
    vec3 color = vec3(0.5, vRandom.r , 0.7 );

    vec4 textureColor = texture2D(uTexture, vUv );
    textureColor.rgb *= elevation * 2.0 + 0.5;
    gl_FragColor = textureColor;
    #include <colorspace_fragment>
}