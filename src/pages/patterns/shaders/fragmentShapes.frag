
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

     //*******pattern 1 (different shapes according to their field data)
     //uv = uv * rotate2d(uTime * 0.5);

     float waveHeight = 0.05;
     float waveCount = 10.0;
     float angle = getOrignatedAngle(uv, vec2(0.0));
     float radius =  sin(angle * PI * 2.0 * waveCount) * waveHeight;


   //1) different types of field functions *********************************
    //  uv = translateUV(uv, vec2(-0.5));
    //  float boxData = rectangleField(uv);
    //  float circleData = circleField(uv);
    //  float triangleData = triangleField(uv);
    //  float polygonData = polygonField(uv, int(5), PI / 4.0);
    //  float circularWaved = wavedCircleField(uv, 10.0, 0.05, 0.0);
    //  float circularCog = cogCircleField(uv, 10.0, 0.05, 0.57, 0.0);
  
    //  float strength = variantShape(circularCog,  uCtrl1 , 0.005);
    //  gl_FragColor = vec4(mix(blackColor, uvColor, strength), 1.0);

   //2) grid pattern *********************************
      //a) simple grid
      uv = uv * 10.0;
      float borderSize = 0.1;
      float stripeX = sin(step(borderSize + sin(uv.y * 3.0) * 0.1, fract(uv.x)) );
      float stripeY = step(borderSize + cos(uv.x * 3.0) * 0.1, fract(uv.y));
      float strength = stripeX * stripeY;
      //b)cornered grid
    //  float strength = gridPattern(uv, 5.0);
     gl_FragColor = vec4(mix(uvColor, color2, strength), 1.0);


      
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
   //  float strength = 0.0;
   
   //a) Cellular Noise
   // strength = cellularNoiseFixedPointsInigosQuilez(uv, mouse, uTime);
   // strength = cellularNoiseFixedPointsVoronoi(uv, mouse, uTime);
    
   //b) control Cellular Noise
   // Inigo's Quilez version
   // strength = cellularNoiseGridInigosQuilez(uv, 3, mouse, 0.0, 0.0,0.0, uTime);
   //Voronoi version 
   // strength = cellularNoiseGridVoronoi(uv, 10, mouse, 0.0, 0.0, 0.0, uTime);

   //c) control Cellular Noise
   // strength = cellularNoiseGrid(uv, 3, uTime);

   //d) Cellular grid 2x2
   // uv = vec2(uv.x - 1.0, uv.y - 0.5);
   // vec2 cellular2x2 = cellular2x2(uv * 20.0 );
   // float field = fract(length(uv) * 0.5 - uTime * 0.07);
   // float circularWaveField = abs(sin( field * 3.14 * 5.0));
   // strength = step(circularWaveField , cellular2x2.x * 2.0);

   //e) Cellular grid 2x2x2
   // uv = vec2(uv.x - 1.0, uv.y - 0.5);
   // vec2 cellular2x2x2 = cellular2x2x2( vec3(uv * 5.0 , uTime * 0.2) );
   // float field = fract(length(uv) * 0.5 - uTime * 0.07);
   // strength = smoothstep(0.4, 0.5, sin( fract(cellular2x2x2.x * 5.0)));

   //e) Cellular bordered grid 2x2
   // uv = vec2(uv.x - 1.0, uv.y - 0.5);
   // vec3 cellular2x2Border = cellular2x2Border(uv * 4.0, uTime  );
   // float field = fract(length(uv) * 0.5 - uTime * 0.07);
   // strength =  smoothstep( 0.01, 0.02, cellular2x2Border.x); 
   //striped border
   // strength =  smoothstep( 0.01, 0.02, cellular2x2Border.x*(0.5 + 0.5*sin(30.0*cellular2x2Border.x)) );

   // color = mix(uvColor, blackColor, strength);
   //  gl_FragColor = vec4(color, 1.0);

    //8) cractal Noise pattern ***********************************
    
    //a) single
   // strength = fractalNoise(uv * 3.0 + uTime * 0.05);
   // color = mix(uvColor, blackColor, strength);

   //b)multiple
   //  vec2 q = vec2(0.);
   //  q.x = fractalNoise( uv - 0.00 * uTime);
   //  q.y = fractalNoise( uv + vec2(1.0));

   //  vec2 r = vec2(0.);
   //  r.x = fractalNoise( uv + 1.0 * q + vec2(1.7,9.2)- 0.15 * uTime );
   //  r.y = fractalNoise( uv + 1.0 * q + vec2(8.3,2.8)- 0.126 * uTime);

   //  strength = fractalNoise(uv - vec2(1.0, 0.12) + r);

   // color = mix(
   //    vec3(0.001961,0.619608,0.166667) * blackColor, 
   //    vec3(0.666667,0.66667,0.198039) * uvColor, 
   //    clamp((strength * strength) * 4.0, 0.0, 1.0) 
   // );
   //  gl_FragColor = vec4(color, 1.0);

   //  // Draw grid
    #include <colorspace_fragment>
}