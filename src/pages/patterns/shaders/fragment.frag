
#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uCtrl1;
uniform float uCtrl2;
uniform float uCtrl3;
uniform float uCtrl4;
uniform float uCtrl5;

varying vec2 vUv;
#include ../../includes/functions.glsl

void main(){

     vec2 uv = vUv;

     vec3 blackColor = vec3(0.0);
     vec3 uvColor = vec3(uv, 1.0);

    //pattern 9
    // float strength = stripe(uv, 10.0, 0.5);
    // gl_FragColor = vec4(vec3(strength), 1.0);
   
    //pattern 14
    // float strength = step(uCtrl1, mod(uv.x * 10.0, 1.0) * step(uCtrl2, mod(uv.y * 10.0, 1.0)));
    // strength += step(uCtrl2, mod(uv.x * 10.0, 1.0) * step(uCtrl1, mod(uv.y * 10.0, 1.0)));

    // float strength = cornerPattern(uCtrl4, uv);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    //pattern 15
    // uv.x +=  uTime * 0.06;
    // uv.y +=  uTime * 0.06;
    // float strength = plusPattern(uCtrl4, uv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 16
    // float strength = min(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    // float strength = max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    // float strength =  min(abs(uv.y - 0.5),abs(uv.x - 0.5) );

    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 17
    // float strength = borderBox(uCtrl3, uv, uCtrl1, uCtrl2);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    //pattern 18
    // float strength = shades(uCtrl4, uv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

     //pattern 23
    // float strength = random(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

     //pattern 24
    // float strength = randomShades(uCtrl4, uv, uCtrl1);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 26
    // uv -= 0.5;
    // float strength = length(uv );
    // float strength = distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);   

     //pattern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);   

     //pattern 29
    // float strength =  starDot(0.15, uv, vec2(0.5), 5.0, 1.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);   

    //pattern 31
    // vec2 rotatedUv = rotate(vUv, PI * uCtrl1, vec2(0.5));
    // float strength =  starShape(0.15, rotatedUv, vec2(0.5), uCtrl4, 1.0);
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(mixedColor, 1.0);   


    //pattern 33
    // float strength =  abs(distance(vUv, vec2(0.5)) - 0.25 );
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 35
    // float strength =  step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25 ));
    // float strength =  1.0 - borderCircle(0.01, 0.3, vec2(0.5), uv) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 37
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * uCtrl5) * 0.1,
    //     vUv.y + sin(vUv.x * uCtrl5) * 0.1
    // );
    // float strength = 1.0 - borderCircle(0.01, 0.3, vec2(0.5), wavedUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 40
    //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=A_{rctan2}\left(p,q\right)
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 41
    //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=\frac{A_{rctan2}\left(p,q\right)}{3.14\ \cdot2}+0.5\ 
    // float angle = angleCircle(vec2(0.5), uCtrl5, uv);
    // float strength = angle ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

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
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * uCtrl5));
    strength = clamp(strength, 0.0, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>
}