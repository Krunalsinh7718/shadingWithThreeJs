
#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uCtrl1;
uniform float uCtrl2;
uniform float uCtrl3;
uniform float uCtrl4;
uniform float uCtrl5;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;
#include ../../includes/functions.glsl
#include ../../includes/shapesFunctions.glsl
#include ../../includes/transformFunction.glsl
#include ../../includes/patternsFunction.glsl
#include ../../includes/colorsFunctions.glsl
#include ../../includes/simplexNoise2d.glsl

void main(){
      vec3 color = vec3(0.0);
     vec2 uv = vUv;
     vec2 mouse = uMouse;
     if(uResolution.x > uResolution.y){
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
        mouse.x *= aspect;
     }else{
        float aspect = uResolution.y / uResolution.x;
        uv.y *= aspect;
        mouse.y *= aspect;
     }

     vec3 blackColor = vec3(0.0);
     vec3 whiteColor = vec3(1.0);
     vec3 redColor = vec3(1.0, 0.0, 0.0);
     vec3 greenColor = vec3(0.0, 1.0, 0.0);
     vec3 blueColor = vec3(0.0, 0.0, 1.0);
     vec3 yellowColor = vec3(1.0, 1.0, 0.0);

     vec3 color1 = vec3(1.0, 0.2, 0.4);
     vec3 color2 = vec3(0.4, 0.1, 1.0);
     vec3 uvColor = vec3(uv, 1.0);

     //*******pattern 1 (circle)
     vec2 translate = vec2(cos(uTime),sin(uTime));
     //uv = uv * rotate2d(uTime * 0.5);

     float waveHeight = 0.05;
     float waveCount = 10.0;
     float angle = getOrignatedAngle(uv, vec2(0.0));
     float radius =  sin(angle * PI * 2.0 * waveCount) * waveHeight;


   //1) different types of field functions *********************************
   //   uv = translateUV(uv, vec2(-0.5));
   //   float boxData = rectangleField(uv);
   //   float circleData = circleField(uv);
   //   float triangleData = triangleField(uv);
   //   float polygonData = polygonField(uv, int(4), PI / 4.0);
   //   float circularWaved = wavedCircleField(uv, 10.0, uCtrl2, 0.0);
   //   float circularCog = cogCircleField(uv, 10.0, uCtrl2, uCtrl3, 0.0);
  
   //   float strength = variantShape(circularCog,  uCtrl1 , 0.005);
   //   gl_FragColor = vec4(mix(blackColor, whiteColor, strength), 1.0);

   //2) grid pattern *********************************
   
   //   float strength = gridPattern(uv, 5.0);
   //   gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);


      
   //3) animated dots *********************************
   //    uv = brickTile(uv, 10.0, uTime);
   //    uv = fract(uv);
   //    float circle = cogCircleField(uv - 0.5, 6.0, 0.1, 0.5, uTime * 0.1);
   //    float strength = variantShape(circle, 0, 0.2 , 0.02, 5.0, 0.001, 0.0);

   //   gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);


   //4) tile pattern ***********************************
   // float strength = tilePattern1(uv, uCtrl4);
   //   gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);

   //5) truchetPattern pattern ***********************************
   // float strength = truchetPatternMain(uv, uCtrl4, 0.0, uTime * 0.5);
   //   gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);

   //6) Noise pattern ***********************************
   // float strength = 0.0;
   
   //a) noise test
   // strength = gradientNoise(uv * 10.0);

   //b) noise transition
   // strength = step(0.5, gradientNoise(uv * 10.0) + sin(uTime * 2.0 + sin(uv.x ) ) ); // revel transition

   //c) lines
   // vec2 pos = uv * 3.0;
   // strength = lines(rotate2D( pos + sin(uTime * 0.2), gradientNoise(pos) + uTime * 0.2 ) ,0.5); // lines

   //d) blobs
   // float offset = sin(uTime + sin(uv.x));
   // strength += smoothstep(offset + 0.1,offset + 0.2,gradientNoise(uv*10.));
   // strength -= smoothstep(offset + 0.35, offset + 0.4,gradientNoise(uv*10.));

   //e) random waved circle
   // float circularWaved = wavedCircleField(uv - 0.5, 80.0, sin(gradientNoise( (uv + uTime * 0.1) / 0.1) * 0.1 ), 0.0);
   // strength = variantShape(circularWaved,  0.5 , 0.005);
   // strength = variantShape(circularWaved, 1, 0.4 , 0.02, 5.0, 0.001, 0.0);

//   gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);

    //7) cellular noise ***********************************
    float strength = 0.0;
   
   //a) Cellular Noise
   // strength = cellularNoiseFixedPoints(uv, mouse, uTime);
   strength = cellularNoiseFixedPoints1(uv, mouse, uTime);
    
   //b) control Cellular Noise
   // strength = cellularNoiseGrid(uv, 3, mouse, 0.0, 0.0,0.0, uTime);

   //c) control Cellular Noise
   // strength = cellularNoiseGrid(uv, 3, uTime);

   //d) Cellular grid 2x2
   // uv = vec2(uv.x - 1.0, uv.y - 0.5);
   // vec2 cellular2x2 = cellular2x2(uv * 20.0);
   // float field = fract(length(uv) * 0.5 - uTime * 0.07);
   // float circularWaveField = abs(sin( field * 3.14 * 5.0));
   // strength = step(circularWaveField, cellular2x2.x * 2.0);

   color = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(color, 1.0);

    //8) Noise pattern ***********************************
   
   

   //  // Draw grid
    #include <colorspace_fragment>
}