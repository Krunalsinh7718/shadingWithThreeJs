
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
   //    uv = uv * 5.0;
   //    uv = fract(uv);
   //    float box1 = polygonField(uv - 0.5, int(4), PI / 4.0);
   //    float box2 = polygonField(uv - 0.5, int(4), 0.0);
  
   //   float strength =  variantShape(box1, 0, 0.48 + 0.09, 0.02, 5.0, 0.001, 0.0);
   //   float strength1 =  variantShape(box2, 0, 0.48, 0.02, 5.0, 0.001, 0.0);
   //   float finalStrength = 1.0 - (strength * strength1);
   //   gl_FragColor = vec4(mix(uvColor, color2, finalStrength), 1.0);
      
   //3) animated dots *********************************
   //    uv = brickTile(uv, 10.0, uTime);
   //    uv = fract(uv);
   //    float circle = cogCircleField(uv - 0.5, 6.0, 0.1, 0.5, uTime * 0.1);
   //    float strength = variantShape(circle, 0, 0.2 , 0.02, 5.0, 0.001, 0.0);

   //   gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);


   //4) tile pattern ***********************************
   // float strength = tilePattern1(uv, uCtrl4);


   //5) truchetPattern pattern ***********************************
   // float strength = truchetPatternMain(uv, uCtrl4, 0.0, uTime * 0.5);

   //6) Noise pattern ***********************************
   float strength = 0.0;

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

   //f) Cellular Noise
   
    float min_dist = 1.0;
    vec2 point[6];
    point[0] = vec2(0.5 + sin(uTime) * 0.1,0.5 + cos(uTime) * 0.1);
    point[1] = vec2(0.60 + sin(uTime) * 0.2,0.07 + sin(uTime) * -0.1);
    point[2] = vec2(0.28 + sin(uTime) * -0.3,0.64 + sin(uTime) * 0.01);
    point[3] =  vec2(0.31 + sin(uTime) * -0.01,0.26 + sin(uTime) * -0.2);
    point[4] =  vec2(0.41 + sin(uTime) * 0.2,0.53 + sin(uTime) * -0.3);
    point[5] =  mouse;

   float m_dist = 0.5;  // minimum distance

   for (int i = 0; i < 6; i++) {
      float dist = distance(uv,point[i]);
      m_dist = min(m_dist, dist);
   }
   strength += variantShape(m_dist, 0, 0.2 , 0.02, 10.0, 0.4, 0.0);

   color = vec3(strength);

   //g) control Cellular Noise
   // uv = uv * 3.0;
   // float mouseDist = distance(uv / 3.0, mouse ) * 2.0;
    
   //  // Create an interactive mask (1.0 at mouse point, fading out to 0.0)
   //  float mouseGlow = smoothstep(1.5, 0.0, mouseDist);

   // vec2 i_st = floor(uv);
   // vec2 f_st = fract(uv);

   // float m_dist = 1.;  // minimum distance

   // for (int y= -1; y <= 1; y++) {
   //      for (int x= -1; x <= 1; x++) {
   //          vec2 neighbor = vec2(float(x),float(y));

   //          vec2 point = random2(i_st + neighbor);

   //          point = sin(point * uTime + 6.2831) * 0.5 + 0.5;

   //          vec2 diff = neighbor + point - f_st;

   //          float dist = length(diff);

   //           m_dist = min(m_dist, dist);
   //      }
   // }

   // strength += m_dist;
   // // draw stripes
   // strength += sin(m_dist * 30.0 - uTime); 

   // strength *= mouseGlow;

   // strength += 1.0 - step(0.005, m_dist);

   

   // color = mix(blackColor, whiteColor, strength);

   //  // Draw grid
   //  color.r += step(.98, f_st.x) + step(.98, f_st.y); 


    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}