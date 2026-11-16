//uniforms
uniform vec3 uLightPosition;
uniform float uTime;


//varyings
varying vec3 vNormal;
varying vec3 vModelPosition;


void main(){
     vec3 normal = normalize(vNormal);
     if(!gl_FrontFacing) normal *= -1.0;

     //stripes
    float stripes = mod( (vModelPosition.y - uTime * 0.05) * 10.0, 1.0);
    stripes = pow(stripes, 3.0);

     vec3 lightDirection = normalize(uLightPosition);
     vec3 cameraDirection = normalize(cameraPosition - vModelPosition);

     vec3 color = vec3(1.0, 0.1, 0.8);

     float light =   dot(lightDirection, normal) + 1.0  ;

     float eyeView = dot(cameraDirection, normal) ;
     eyeView = pow(eyeView, 2.0);

     float falloff = smoothstep(0.8, 0.0, eyeView);

     float holograph = eyeView * stripes;
     holograph += holograph * 1.25;
     holograph *= falloff;

     gl_FragColor = vec4(color, holograph);
     // gl_FragColor = vec4(vec3(1.0), 1.0);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
}
