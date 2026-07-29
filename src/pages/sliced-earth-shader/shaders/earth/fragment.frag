varying vec2 vUv;

uniform sampler2D uDayTexture;
uniform sampler2D uSpecularCloudTexture;


void main(){
    vec3 color = vec3(0.0);

    //day color
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    color = dayColor;

    //specular cloud color
    vec2 specularCloudTexture = texture(uSpecularCloudTexture, vUv).rg;

    //clouds
    float cloudsMix = smoothstep(0.5, 1.0, specularCloudTexture.g);
    color = mix(color, vec3(1.0), cloudsMix);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}