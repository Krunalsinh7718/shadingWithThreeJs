
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
     vec3 color1 = vec3(1.0, 0.0, 0.0);
     vec3 color2 = vec3(0.0, 0.0, 1.0);
     vec3 uvColor = vec3(uv, 1.0);

    //pattern 9
   //  uv = uv * 5.0;
   //  float strength = stripe(uv, 10.0, 0.5);
   //  gl_FragColor = vec4(vec3(strength), 1.0);
   
    //pattern 14
   //  uv = uv * 5.0;
   //  float strength = cornerShape(uv, 0.0); // cornerShape(uv, inverse = 1.0 : true)
   //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);


    //pattern 15
   //  uv = uv - 0.5;
   //  uv = uv * 5.0;
   //  uv.x +=  uTime * 0.6;
   //  uv.y +=  uTime * 0.6;
   //  float strength = plusShape(uv);
   //   gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //pattern 16
   //  uv = uv - 0.5;
   //  uv = uv * 5.0;
   //  float strength = min(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
   //  float strength = max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
   //  float strength = starShape1(uv);
   //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //pattern 17
   //  uv = uv - 0.5;
   //  uv = uv * 5.0;
   //  uv = fract(uv);
   //  float strength = borderBox(uCtrl3, uv, uCtrl1, uCtrl2); //borderBox(size, uv, posX, posY)
   //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);


    //pattern 18
      //  uv = uv - 0.5;
   //  uv = uv * 5.0;
   //  uv = fract(uv);
   //  float strength = shades(uCtrl4, uv); //shades(size, uv)
   //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

     //pattern 23
   //       uv = uv - 0.5;
   //  uv = uv * 5.0;
   //  uv = fract(uv);
   //  float strength = random(uv);
   //   gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

     //pattern 24
   //  uv = uv - 0.5;
   //  uv = uv * 5.0;
   //  uv = fract(uv);
   //  float strength = randomShades(uCtrl4, uv , uCtrl1); // randomShades(size, uv, rotation)
   //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //pattern 26
   //  uv = uv * 5.0;
   //  uv = fract(uv);
   //  float strength = length(uv);
   //  float strength = length(uv) * length(1.0 - uv) ;
   //  float strength = distance(uv, vec2(0.5));
   //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);


     //pattern 29
    // uv = uv * 5.0;
    // uv = fract(uv);
    // float strength =  starDot(0.15, uv, vec2(0.5),uCtrl1 , uCtrl2); // starDot(intensity, centerPoint, squeeze X, squeeze Y)
    // gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //pattern 31
    //  uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    // vec2 rotatedUv = rotate(uv, PI * uTime * 0.06, vec2(0.5));
    // float strength =  starShape(0.15, rotatedUv, vec2(0.5), uCtrl4, 1.0);
    // vec3 mixedColor = mix(blackColor, color1, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);   


 

    //pattern 35
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    // // float strength =  step(0.02, 
    // //                     abs(
    // //                       distance(uv, vec2(0.5)) - 0.25 
    // //                     )
    // //                   );
    // float strength =  1.0 - borderCircle(0.01, 0.3, vec2(0.5), uv) ;
    // gl_FragColor = vec4(mix(uvColor, blackColor, strength), 1.0);

    //pattern 37
    //     uv = uv - 0.5;
    // uv = uv * 5.0 + uTime * 0.06;
    // uv = fract(uv);
    // vec2 wavedUv = vec2(
    //     uv.x + sin(uv.y * uCtrl5) * 0.1,
    //     uv.y + sin(uv.x * uCtrl5) * 0.1
    // );
    // float strength = 1.0 - borderCircle(0.01, 0.3, vec2(0.5), wavedUv);
    // gl_FragColor = vec4(mix(uvColor, blackColor, strength), 1.0);

    //pattern 40
    //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=A_{rctan2}\left(p,q\right)

    // uv = uv * 5.0 ;
    // uv = fract(uv);
    // float angle = atan( uv.y - 0.5, uv.x - 0.5) ;
    // float strength = angle / (PI * 2.0) + 0.5 ;
    //  gl_FragColor = vec4(mix(uvColor,color2,strength), 1.0);

    //pattern 41
    //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=\frac{A_{rctan2}\left(p,q\right)}{3.14\ \cdot2}+0.5\ 
    float angle = angleCircle(vec2(0.5), uCtrl5, uv);
    float strength = angle ;
    gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 45
    // float angle = angleCircle(vec2(0.5), 1.0, uv);
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;

    // float circle = wavedCircle(0.01, uCtrl1, vec2(0.5), uv,  100.0, 0.02 );
    // float strength = 1.0 -  circle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 47
    // float strength = step(0.0, cnoise(vUv * 10.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 48
    // float strength = 1.0 - abs(cnoise(uv * 10.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * uCtrl5);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 50
    // float strength = step(0.9, sin(cnoise(uv * 10.0) * uCtrl5));
    // strength = clamp(strength, 0.0, 1.0);
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>
}