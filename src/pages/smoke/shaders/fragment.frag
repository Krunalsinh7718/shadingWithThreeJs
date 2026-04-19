varying vec2 vUv;

uniform sampler2D uPerlinTexture;
uniform float uTime;
uniform float uSmokeIntensity;
uniform vec3 uSmokeColor;



void main(){
    vec2 smokeUv = vUv;

    //stretch UV
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;

    //animate UV up direction
    smokeUv.y -= uTime * 0.03;

    //get perlin noice texture
    float smoke = texture( uPerlinTexture, smokeUv).r;

    //remap
    smoke = smoothstep(uSmokeIntensity, 1.0, smoke);

    //fade edges
    // smoke = 1.0;
    smoke *= smoothstep(1.0, 0.9, vUv.x);//right
    smoke *= smoothstep(0.0, 0.1, vUv.x);//left
    smoke *= smoothstep(1.0, 0.4, vUv.y);//top
    smoke *= smoothstep(0.0, 0.3, vUv.y);//bottom

    gl_FragColor = vec4(uSmokeColor, smoke);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}