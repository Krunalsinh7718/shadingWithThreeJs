varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;
uniform float uLightIntensity;
uniform float uTime;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform sampler2D uCloudsTexture;

uniform vec3 uTestDirection;

void main(){
     vec3 normalColor = normalize(vNormal) * 0.5 + 0.5;
     vec3 normal = normalize(vNormal);
     vec3 color = vec3(0.0);

     //texture colors
     vec3 earthDayTexture = texture(uDayTexture, vUv).rgb;
     vec3 earthNightTexture = texture(uNightTexture, vUv).rgb;
     vec2 cloudsUv = vec2(vUv.x + uTime * 0.1, vUv.y + 0.05);
     float cloudsMask = texture(uCloudsTexture, cloudsUv).r;
     float waterMask = texture(uSpecularCloudsTexture, vUv).r;

     // Direction from the surface to the light and camera (world space).
     vec3 lightDirection = normalize(uLightPosition - vPosition);
     vec3 viewDirection = normalize(cameraPosition - vPosition);

     // Diffuse shading
     float diffuse = dot(normal, lightDirection);

     //day night color
     float dayMix = smoothstep(-0.25, 0.5, diffuse);
     vec3 dayColor = earthDayTexture * uLightColor * uLightIntensity ;
     vec3 nightColor = earthNightTexture;
     color = mix(nightColor, dayColor, dayMix);

     //clouds
     float cloudsMix = smoothstep(0.5, 1.0, cloudsMask);
     cloudsMix *= dayMix;
     color = mix(color, vec3(1.0), cloudsMix);

     //atmosphere color
     float atmosphereDayMix = smoothstep(-0.5, 1.0, diffuse);
     vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);

     //fresnel
     float fresnel = 1.0 - max(dot(viewDirection, normal), 0.0);
     fresnel = pow(fresnel, 8.0);
     color = mix(color, atmosphereColor, fresnel * atmosphereDayMix * 3.0);

     //specular
     vec3 reflect = reflect(-lightDirection, normal);
     float specular = dot(reflect, viewDirection );
     specular = max(specular, 0.0);
     specular = pow(specular, 32.0);
     specular *= waterMask * (1.0 - cloudsMix);
     color += specular;



     //light
     color *= uLightColor * uLightIntensity;

     //test
     float alignment = dot(
          normalize(normal),
          normalize(testDirection)
     );

     color = vec3(
          1.0 - smoothstep(-0.1, 0.1, alignment),
          smoothstep(-0.1, 0.1, alignment),
          0.0
     );


     

     // color = uTestDirection;
     

     gl_FragColor = vec4(color, 1.0);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
}
