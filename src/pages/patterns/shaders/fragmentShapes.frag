
#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uCtrl1;
uniform float uCtrl2;
uniform float uCtrl3;
uniform float uCtrl4;
uniform float uCtrl5;
uniform vec2 uResolution;

varying vec2 vUv;
#include ../../includes/functions.glsl
#include ../../includes/shapesFunctions.glsl
#include ../../includes/transformFunction.glsl
#include ../../includes/patternsFunction.glsl

void main(){

     vec2 uv = vUv;
     if(uResolution.x > uResolution.y){
     float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
     }else{
        float aspect = uResolution.y / uResolution.x;
        uv.y *= aspect;
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
     uv = translateUV(uv, vec2(-0.5));
   //   uv = uv * rotate2d(uTime * 0.5);

     

     float waveHeight = 0.05;
     float waveCount = 10.0;
     float angle = getOrignatedAngle(uv, vec2(0.0));
     float radius =  sin(angle * PI * 2.0 * waveCount) * waveHeight;

   //   float boxData = rectangleField(uv);
   //   float circleData = circleField(uv);
   //   float triangleData = triangleField(uv);
   //   float poligoneData = poligoneField(uv, int(4), PI / 4.0);
   //   float circularWaved = wavedCircleField(uv, 10.0, uCtrl2, 0.0);
   //   float circularCog = cogCircleField(uv, 10.0, uCtrl2, uCtrl3, 0.0);

      uv = brickTile(uv, 15.0, uTime);
      uv = fract(uv);

   //    float box1 = poligoneField(uv - 0.5, int(4), PI / 4.0);
   //    float box2 = poligoneField(uv - 0.5, int(4), 0.0);
  
   //   float strength =  variantShape(box1, 0, 0.48 + 0.09, 0.02, 5.0, 0.001, 0.0);
   //   float strength1 =  variantShape(box2, 0, 0.48, 0.02, 5.0, 0.001, 0.0);
   //   float finalStrength = 1.0 - (strength * strength1);

   float circle = circleField(uv - 0.5);
   float strength = variantShape(circle, 0, 0.2 , 0.02, 5.0, 0.001, 0.0);


     gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);
    
    #include <colorspace_fragment>
}