varying float vWobble;

uniform vec3 uColorA;
uniform vec3 uColorB;

void main(){
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    // csm_FragColor.rgb =  mix(uColorA, uColorB, colorMix);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    //effect 1
    // csm_Metalness = step(0.2, vWobble);
    // csm_Roughness = 1.0 - csm_Metalness;

    //effect2
    // csm_Roughness = 1.0 - colorMix;
}