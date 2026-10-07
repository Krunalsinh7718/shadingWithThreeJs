
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
     vec3 whiteColor = vec3(1.0);
     vec3 redColor = vec3(1.0, 0.0, 0.0);
     vec3 greenColor = vec3(0.0, 1.0, 0.0);
     vec3 blueColor = vec3(0.0, 0.0, 1.0);

     vec3 color1 = vec3(1.0, 0.2, 0.4);
     vec3 color2 = vec3(0.4, 0.1, 1.0);
     vec3 uvColor = vec3(uv, 1.0);

    //*******pattern 9

    // uv = uv * 1.0;
    //-------------------------------
      //verticalStripes function returns float values for vertical stripe shape. 
      //@param {vec2} uv : texture uv
      //@param {float} stripCount : stripe Count  
      //@returns {float} stripeSize : stripe Width
    //--------------------------------
    // float strength = verticalStripes(uv, uCtrl4, uCtrl1);
    // gl_FragColor = vec4(vec3(strength), 1.0);
   
    //********pattern 14
    // uv = uv * 1.0;
    //-------------------------------
      //cornerShape function returns float values for rop right and bottom right corner shape pattern. 
      //@param {vec2} uv : texture uv
      //@param {float} inverse : 0.0 = top right corner, 1.0 = bottom left corner  
    //--------------------------------
    // float strength = cornerShape(uv, 0.0); 
    // gl_FragColor = vec4(mix(color1, color2, strength), 1.0);


    //********pattern 15
    // uv = uv - 0.5;
    // uv = uv * 1.0;
    // uv.x +=  uTime * 0.6;
    // uv.y +=  uTime * 0.6;
    //-------------------------------
      //plusShape function returns float values for plus shape. 
      //@param {vec2} uv : texture uv
    //--------------------------------
    // float strength = plusShape(uv);
    //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //********pattern 16
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // float strength = min(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    // float strength = max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;

    //-------------------------------
      //starShape1 function returns float values for star shape. 
      //@param {vec2} uv : texture uv
    //--------------------------------
    // float strength = starShape1(uv) ;
    // gl_FragColor = vec4(mix(whiteColor, color2, strength), 1.0);

    //********pattern 17
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    //-------------------------------
      //borderBoxShape function returns float values for border box shape. 
      //@param {vec2} uv : texture uv
      //@param {float} boxSize: box size
      //@param {vec2}  pos : box position X,Y
      //@param {float} borderWidth:  border width
    //--------------------------------
    // float strength = borderBoxShape( uv, uCtrl3, vec2(uCtrl1, uCtrl2), 0.01); 
    // gl_FragColor = vec4(mix(color1, color2, strength), 1.0);


    //********pattern 18
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
     //-------------------------------
      //shades function returns float values for X and Y dark light shades. 
      //@param {vec2} uv : texture uv
      //@param {float} shadeSize : shade size
    //--------------------------------
    // float strength = shades(uv, uCtrl4); 
    // gl_FragColor = vec4(mix(blackColor, uvColor, strength), 1.0);

     //********pattern 23
    //-------------------------------
      //randomUV function returns float values for dark light noise. 
      //@param {vec2} uv : texture uv
    //--------------------------------
    // float strength = randomUV(uv);
    // gl_FragColor = vec4(mix(blackColor, color2, strength), 1.0);

     //********pattern 24
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
     //-------------------------------
      //randomShades function returns random dark light shades value with Y axis rotation. 
      //@param {vec2} uv : texture uv
      //@param {float} shadeSize: shade size
      //@param {float} rotationY: rotation Y
    //--------------------------------
    // float strength = randomShades(uv, uCtrl4, uCtrl1); 
    // gl_FragColor = vec4(mix(whiteColor, color2, strength), 1.0);

    //********pattern 26
    // uv = fract(uv);
    // float strength = length(uv);
    // float strength = length(uv) * length(1.0 - uv) ;
    // float strength = distance(uv, vec2(0.5));
    //-------------------------------
      //borderCircle function returns border circle shape. 
      //@param {vec2} uv : texture uv
      //@param {float} borderSize: border size
      //@param {float} circleSize: circle radius
      //@param {vec2} circlePos: circle position on X and Y axsis
    //--------------------------------
    // float strength = borderCircle(uv, 0.01, uCtrl1, vec2(0.5));
    // gl_FragColor = vec4(mix(blackColor, color2, strength), 1.0);


     //********pattern 29
    // uv = uv * 5.0;
    // uv = fract(uv);
    //-------------------------------
      //starDot function returns float value for glowing dot shape. 
      //@param {vec2} uv : texture uv
      //@param {float} intensity: glow amount
      //@param {vec2} centerPoint: dot position X Y
      //@param {float} sqX: strech on X axis
      //@param {float} sqY: strech on Y axis
    //--------------------------------
    // float strength =  starDot(uv, uCtrl3, vec2(0.5),uCtrl1 , uCtrl2); // starDot(intensity, centerPoint, squeeze X, squeeze Y)
    // gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //********pattern 31
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    //-------------------------------
      //rotateUV function returns vec2 value for rotated UV. 
      //@param {vec2} uv : texture uv
      //@param {float} rotation: aotation angle
      //@param {vec2} mid: rotate oriantion of X and Y
    //--------------------------------
    // vec2 rotatedUv = rotateUV(uv, PI * uCtrl2, vec2(0.5));

    //-------------------------------
      //starShape function returns float value for star shape. 
      //@param {vec2} uv : texture uv
      //@param {float} intensity: glow amout of star
      //@param {vec2} centerPoint: position of star X and Y
      //@param {float} sqX: help to increase length of their coner
      //@param {float} sqY: help to increase radius of center
    //--------------------------------
    // float strength =  starShape(rotatedUv, uCtrl1, vec2(0.5), uCtrl4, uCtrl5);
    // vec3 mixedColor = mix(blackColor, color1, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);   



    //********pattern 37
    // uv = uv * 1.0 ;
    // uv = fract(uv);
    //-------------------------------
      //wavedUv function returns vec2 value for waved uv. 
      //@param {vec2} uv : texture uv
      //@param {float} wavelength: wavelength of wave
      //@param {vec2} amplitude: amplitude of wave
    //--------------------------------
    // vec2 wavedUv = wavedUv(uv, uCtrl5, uCtrl1);
    // float strength = 1.0 - borderCircle(wavedUv, 0.01, 0.3, vec2(0.5));
    // gl_FragColor = vec4(mix(uvColor, blackColor, strength), 1.0);

    //********pattern 40
    //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=A_{rctan2}\left(p,q\right)

    // uv = vec2(uv.x - 0.5, uv.y);
    //-------------------------------
      //getOrignatedAngle function returns angle value for angled circle.
      //valus at 0 angle is near to 0 and values at to 6.28 angle is near to 1 
      //@param {vec2} uv : texture uv
      //@param {vec2} centerPoint: X Y position of circle origin
    //--------------------------------
    // float angle = getOrignatedAngle(uv, vec2(uCtrl1,uCtrl2)) + uTime * -0.01;



   //-------------------------------
      //angle360dStripe function returns float value for angled circle.
      //valus at 0 angle is near to 0 and values at to 6.28 angle is near to 1 
      //@param {vec2} uv : texture uv
      //@param {vec2} angle: angle value
      //@param {float} stripeCount: devide ciecle according to stripeCount
    //--------------------------------

    // float strength = angle360dStripe(uv, angle, uCtrl5);
    
    //-------------------------------
      //circularStripes function returns float values for circular Stripes stripe shape. 
      //@param {vec2} uv : texture uv
      //@param {vec2} centerPoint : stripe origin X Y
      //@param {float} stripCount : stripe Count  
      //@returns {float} stripeSize : stripe Width
      //@returns {float} adjuct : adjuct stripe position
    //--------------------------------
    // float strength1 = circularStripes(uv , vec2(uCtrl1,uCtrl2), uCtrl4, uCtrl3, uTime * -0.1) ;
    // float mixStrength = strength * strength1 ;
    //  gl_FragColor = vec4(mix(blackColor,color2, mixStrength), 1.0);

    

    //********pattern 45

    // float circle = wavedRings(
    //     0.21,       // border
    //     vec2(0.5),  // center
    //     vec2(uv.x - 0.5,uv.y),
    //    7.8,       // number of rings
    //     11.0,       // waves around each ring
    //     0.14,         // wave amount,
    //     uTime
    // );

    float angle = getOrignatedAngle(uv, vec2(0.5)) ;
    float dist = length(uv - 0.5) - uCtrl1;
    float sinedAngle = sin(angle * PI * 2.0 * uCtrl4) * 0.15;
    float ring = dist * 9.8 + sinedAngle;
    float circle = step(ring, uCtrl2) * step(uCtrl2, ring + 0.04);

    float strength = wavedCircle(uv, 0.04, 0.4, vec2(0.5), 11.0, uCtrl1, angle);
    // strength = step(strength, uCtrl2) * step(uCtrl2, strength + 0.04);
   
    gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 47
    // float strength = step(0.0,cnoise(uv * uCtrl5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 48
    // float strength = 1.0 -   abs(cnoise(uv * 10.0  )) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 49
    // float strength = step(0.0, sin(cnoise(uv * 10.0) * uCtrl5 + uTime * 2.0)) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 50
    // float strength = step(uCtrl1, sin(cnoise(uv * 10.0  ) * uCtrl5 + uTime * 2.0) );
    // strength = clamp(strength, 0.0, 1.0);
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>
}