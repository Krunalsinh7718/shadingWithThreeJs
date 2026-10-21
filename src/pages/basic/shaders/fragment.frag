varying vec3 vRandom;
varying vec2 vUv;
varying float vPosY;

#include ../../includes/functions.glsl
#include ../../includes/colorsFunctions.glsl

void main(){
    vec2 uv = vUv;
    vec2 colorCenter = vec2(0.5)-uv;
    float colorAngle = atan(colorCenter.y,colorCenter.x);
    float colorRadius = length(colorCenter)*2.0;

     vec3 blackColor = vec3(0.0);
     vec3 whiteColor = vec3(1.0);
     vec3 redColor = vec3(1.0, 0.0, 0.0);
     vec3 greenColor = vec3(0.0, 1.0, 0.0);
     vec3 blueColor = vec3(0.0, 0.0, 1.0);
     vec3 yellowColor = vec3(1.0, 1.0, 0.0);

     vec3 color1 = vec3(1.0, 0.2, 0.4);
     vec3 color2 = vec3(0.4, 0.1, 1.0);
     vec3 uvColor = vec3(uv, 1.0);
     vec3 allColorX = hsb2rgb(vec3(uv.x,1.0,uv.y));
     vec3 allColorY = hsb2rgb(vec3(uv.y,1.0,uv.x));
     vec3 circularAllColor = hsb2rgb(vec3((colorAngle/PI*2.0)+0.5,colorRadius,1.0));



    vec3 color = mix(  blackColor, uvColor, vPosY + 0.4 );
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}