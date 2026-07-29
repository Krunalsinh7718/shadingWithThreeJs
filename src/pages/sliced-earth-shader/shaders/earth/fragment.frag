// varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uSpecularCloudTexture;

uniform float uSliceStart;
uniform float uSliceArc;


void main(){
    // vec3 color = vec3(0.0);

    // //day color
    // vec3 dayColor = texture(uDayTexture, vUv).rgb;
    // color = dayColor;

    // //specular cloud color
    // vec2 specularCloudTexture = texture(uSpecularCloudTexture, vUv).rg;

    // //clouds
    // float cloudsMix = smoothstep(0.5, 1.0, specularCloudTexture.g);
    // color = mix(color, vec3(1.0), cloudsMix);

    //slice
    float csm_Slice;
    float angle = atan(vPosition.y, vPosition.x);
     angle -= uSliceStart;
     angle = mod(angle, PI * 2.0);
    if(angle > 0.0  && angle <  uSliceArc)
        discard;

    // Final color
    // csm_FragColor = vec4(color, 1.0);
}