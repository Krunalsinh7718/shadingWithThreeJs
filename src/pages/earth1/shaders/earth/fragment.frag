varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uEarthDayTexture;
uniform sampler2D uEarthNightTexture;
uniform sampler2D uSpecularCloudTexture;

uniform vec3 uSunDirection;
uniform float uCloudDensity;


void main(){
   vec3 color = vec3(vUv, 1.0);
   vec3 normal = normalize(vNormal);

   //day night color
   float sunDirection = dot(uSunDirection , normal);
   float dayColorRemap = smoothstep(-0.25, 0.5, sunDirection);

   vec3 dayColor = texture(uEarthDayTexture, vUv).rgb;
   vec3 nightColor = texture(uEarthNightTexture, vUv).rgb;
   color = mix(nightColor, dayColor, dayColorRemap);

   //clouds
   vec2 cloudsTexture = texture(uSpecularCloudTexture, vUv).rg;
   float clouds = cloudsTexture.g;
   clouds = smoothstep(0.0, 1.0 - uCloudDensity, clouds);
   color = mix(color, vec3(1.0), clouds * dayColorRemap);

    
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}