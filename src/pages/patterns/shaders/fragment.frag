
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
     vec3 yellowColor = vec3(1.0, 1.0, 0.0);

     vec3 color1 = vec3(1.0, 0.2, 0.4);
     vec3 color2 = vec3(0.4, 0.1, 1.0);
     vec3 uvColor = vec3(uv, 1.0);

     //*******pattern 1 (circle)
    float circle = circleShape(uv, vec2(0.5));
     float box = starShape1(
      uv - 0.5//{vec2} uv : texture uv
    );
    box = borderShape(box, 0.05, 0.5) + borderShape(circle, 0.05, 0.5);
    gl_FragColor = vec4(mix(color2, yellowColor , box), 1.0);

    //*******pattern 9

    // uv = uv * 1.0;
    
    // float strength = verticalStripes(
    //   uv,     //{vec2} uv : texture uv
    //   uCtrl4, //{float} stripCount : stripe Count  
    //   uCtrl1  //{float} stripeSize : stripe Width
    // );
    // gl_FragColor = vec4(vec3(strength), 1.0);
   
    //********pattern 14
    // uv = uv * 4.0;
    // float strength = cornerShape(
    //   uv, //{vec2} uv : texture uv
    //   0.0 //{float} inverse : 0.0 = top right corner, 1.0 = bottom left corner  
    // ); 
    // gl_FragColor = vec4(mix(color2, yellowColor , strength), 1.0);


    //********pattern 15
    // uv = uv - 0.5;
    // uv = uv * 1.0;
    // uv.x +=  uTime * 0.6;
    // uv.y +=  uTime * 0.6;
    // float strength = plusShape(
    //   uv //{vec2} uv : texture uv
    // );
    //  gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //********pattern 16
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // float strength = min(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    // float strength = max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    
    // float strength = starShape1(
    //   uv //{vec2} uv : texture uv
    // );
    // gl_FragColor = vec4(mix(whiteColor, color2, strength), 1.0);

    //********pattern 17
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    
    // float strength = borderBoxShape( 
    //   uv,                   // {vec2} uv : texture uv
    //   uCtrl3,               //{float} boxSize: box size
    //   vec2(uCtrl1, uCtrl2), //{vec2}  pos : box position X,Y
    //   0.01                  // {float} borderWidth:  border width
    // ); 
    // gl_FragColor = vec4(mix(color1, color2, strength), 1.0);


    //********pattern 18
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    
    // float strength = shades(
    //   uv,     //{vec2} uv : texture uv
    //   uCtrl4  //{float} shadeSize : shade size
    // ); 
    // gl_FragColor = vec4(mix(blackColor, uvColor, strength), 1.0);

     //********pattern 23
    //-------------------------------
      //randomUV function returns float values for dark light noise. 
      //@param {vec2} uv : texture uv
    //--------------------------------
    // float strength = randomUV(
    //     uv //{vec2} uv : texture uv
    // );
    // gl_FragColor = vec4(mix(blackColor, color2, strength), 1.0);

     //********pattern 24
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    
    // float strength = randomShades(
    //   uv,     //{vec2} uv : texture uv
    //   uCtrl4, //{float} shadeSize: shade size
    //   uCtrl1  //{float} rotationY: rotation Y
    // ); 
    // gl_FragColor = vec4(mix(whiteColor, color2, strength), 1.0);

    //********pattern 26
    // uv = fract(uv);
    // float strength = length(uv);
    // float strength = length(uv) * length(1.0 - uv) ;
    // float strength = distance(uv, vec2(0.5));
    
    // float circleStrength = circleShape(
    //   uv,       //{vec2} uv : texture uv       
    //   vec2(0.5) //{vec2} circlePos: circle position X Y
    // );
    // float strength = borderShape( 
    //   circleStrength, //{float} shapeStrength : shape values
    //   uCtrl3,         //{float} borderSize: border size 
    //   uCtrl1          //{float} shapeSize: shape size
    // );
    // gl_FragColor = vec4(mix(blackColor, color2, strength), 1.0);


     //********pattern 29
    // uv = uv * 5.0;
    // uv = fract(uv);
    // float strength =  starDot(
    //   uv,       //{vec2} uv : texture uv
    //   uCtrl3,   //{float} intensity: glow amount
    //   vec2(0.5),//{vec2} centerPoint: dot position X Y 
    //   uCtrl1,   //{float} sqX: strech on X axis
    //   uCtrl2    //{float} sqY: strech on Y axis
    // ); 
    // gl_FragColor = vec4(mix(color1, color2, strength), 1.0);

    //********pattern 31
    // uv = uv - 0.5;
    // uv = uv * 5.0;
    // uv = fract(uv);
    
    // vec2 rotatedUv = rotateUV(
    //   uv,         //{vec2} uv : texture uv
    //   PI * uCtrl2,//{float} rotation: aotation angle
    //   vec2(0.5)   //{vec2} mid: rotate oriantion of X and Y
    // );

    // float strength =  starShape(
    //   rotatedUv, //{vec2} uv : texture uv 
    //   uCtrl1,    //{float} intensity: glow amout of star 
    //   vec2(0.5), //{vec2} centerPoint: position of star X and Y
    //   uCtrl4,    //{float} sqX: help to increase length of their coner
    //   uCtrl5     //{float} sqY: help to increase radius of center
    // );
    // vec3 mixedColor = mix(blackColor, color1, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);   



    //********pattern 37
    // uv = uv * 1.0 ;
    // uv = fract(uv);
    // vec2 wavedUv = wavedUv(
    //   uv,     //{vec2} uv : texture uv
    //   uCtrl5, //{float} wavelength: wavelength of wave
    //   uCtrl1  //{vec2} amplitude: amplitude of wave
    // );
    
    // float circleStrength = circleShape(
    //   wavedUv,  //{vec2} uv : texture uv
    //   vec2(0.5) //{vec2} circlePos: circle position X Y
    // );
    
    // float strength = 1.0 - borderShape(
    //   circleStrength, //{float} shapeStrength : shape values
    //   0.01,           //{float} borderSize: border size
    //   0.3             //{float} shapeSize: shape size
    // );
    // gl_FragColor = vec4(mix(uvColor, blackColor, strength), 1.0);

    //********pattern 40
    //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=A_{rctan2}\left(p,q\right)

    // uv = vec2(uv.x - 0.5, uv.y);
    
    // float angle = getOrignatedAngle(
    //   uv,                 //{vec2} uv : texture uv
    //   vec2(uCtrl1,uCtrl2) //{vec2} centerPoint: X Y position of circle origin
    // ) + uTime * -0.01;

    // float strength = angle360dStripe(
    //   uv,    //{vec2} uv : texture uv
    //   angle, //{vec2} angle: angle value
    //   uCtrl5 //{float} stripeCount: devide ciecle according to stripeCount
    // );
    

    // float strength1 = circularStripes(
    //   uv ,                  //{vec2} uv : texture uv
    //   vec2(uCtrl1,uCtrl2),  //{vec2} centerPoint : stripe origin X Y
    //   uCtrl4,               //{float} stripCount : stripe Count  
    //   uCtrl3,               //{float} stripeSize : stripe Width
    //   uTime * -0.1          //{float} adjuct : adjuct stripe position
    // );
    // float mixStrength = strength * strength1 ;
    //  gl_FragColor = vec4(mix(blackColor,color2, mixStrength), 1.0);

    

    //********pattern 45

    // float angle = getOrignatedAngle(uv, vec2(0.5)) + uTime * 0.01;
    // float dist = length(uv - 0.5) - uCtrl1;
    // float sinedAngle = sin(angle * PI * 2.0 * uCtrl4) * 0.15;
    // float ring = dist * 9.8 + sinedAngle;
    // float circle = step(ring, uCtrl2) * step(uCtrl2, ring + 0.04);
  
    // float circle = wavedCircle(
    //   uv,        //{vec2} uv : texture uv
    //   uCtrl2,    //{float} circleSize: circle size
    //   vec2(0.5), //{vec2} circlePos: circle position X Y
    //   11.0,      //{float} waveCount: how much waves
    //   uCtrl1,    //{float} waveHeight: height of waves
    //   angle      //{float} angle: circle angle
    // );
    // float strength1 = borderShape(circle, uCtrl3, uCtrl2);
    
    // float strength2 = stripedStrenth(
    //   circle,     //{float} strength : strength of any shape
    //   0.5,        //{float} stripeSize: stripe size
    //   1.0,        //{float} stripeCount: amount of stripes
    //   uTime * 0.1 //{float} adjuct: stripe adjuct value (may use for forward or backward animation)
    // );
   
    // gl_FragColor = vec4(vec3(strength2), 1.0);

    //********pattern 47
    // float noice = cnoise(
    //   uv * uCtrl5 // {vec2} uv : texture uv
    // );
    // float strength = step(0.0,noice);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 48
    // float noice = cnoise(
    //   uv * uCtrl5 // {vec2} uv : texture uv
    // );
    // float strength = 1.0 -   abs(noice) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 49
    //  float noice = cnoise(
    //   uv * uCtrl5 // {vec2} uv : texture uv
    // );
    // float strength = step(0.0, sin(noice * uCtrl5 + uTime * 2.0)) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //********pattern 50
    //  float noice = cnoise(
    //   uv * uCtrl5 // {vec2} uv : texture uv
    // );
    // float strength = step(uCtrl1, sin(noice * uCtrl5 + uTime * 2.0) );
    // strength = clamp(strength, 0.0, 1.0);
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>
}