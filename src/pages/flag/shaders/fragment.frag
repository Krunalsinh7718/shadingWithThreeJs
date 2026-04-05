varying vec3 vRandom;
varying vec2 vUv;
varying float vElevation;


uniform vec3 uColor;
uniform sampler2D uTexture;

void main(){
    vec3 color = vec3(0.5, vRandom.r , 0.7 );

    vec4 textureColor = texture2D(uTexture, vUv );
    textureColor.rgb *= vElevation * 2.0 + 0.5;
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
    #include <colorspace_fragment>
}