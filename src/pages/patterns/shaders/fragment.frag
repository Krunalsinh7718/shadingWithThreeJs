
#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uCtrl1;
uniform float uCtrl2;
uniform float uCtrl3;
uniform float uCtrl4;
uniform float uCtrl5;


varying vec2 vUv;

//return value like random
float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}


void main(){

     vec2 uv = vUv;
   
    //pattern 14
    // float strength = step(uCtrl1, mod(uv.x * 10.0, 1.0) * step(uCtrl2, mod(uv.y * 10.0, 1.0)));
    // strength += step(uCtrl2, mod(uv.x * 10.0, 1.0) * step(uCtrl1, mod(uv.y * 10.0, 1.0)));

    // float boxX = step(uCtrl1, mod(uv.x * 10.0, 1.0)) *  step(uCtrl2, mod(uv.y * 10.0, 1.0));
    // float boxY = step(uCtrl2, mod(uv.x * 10.0, 1.0)) *  step(uCtrl1, mod(uv.y * 10.0, 1.0));
    // float strength = boxX + boxY;

    // gl_FragColor = vec4(vec3(strength), 1.0);


    //pattern 15
    // uv.x +=  uTime * 0.06;
    // uv.y +=  uTime * 0.06;
    // float boxX = step(uCtrl1, mod(uv.x * 10.0 - uCtrl3, 1.0)) *  step(uCtrl2, mod(uv.y * 10.0, 1.0));
    // float boxY = step(uCtrl2, mod(uv.x * 10.0, 1.0)) *  step(uCtrl1, mod(uv.y * 10.0 - uCtrl3, 1.0));
    // float strength = boxX + boxY;

    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 16
    // float strength = min(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    // float strength = max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 17
    // float strength = step(0.2, max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1))) ;
    // strength *= 1.0 - step(0.25, max(abs(uv.x - uCtrl1), abs(uv.y - uCtrl1)));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    //pattern 18
    // float strength = floor(vUv.x * uCtrl4) * 0.1 * floor(vUv.y * uCtrl4) * 0.1;
    // gl_FragColor = vec4(vec3(strength), 1.0);

     //pattern 23
    // float strength = random(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

     //pattern 24
    // vec2 gridUv = vec2(floor(vUv.x * uCtrl4) * 0.1 , floor(vUv.y * uCtrl4) * 0.1);
    // float strength = random(gridUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    //pattern 25
    // vec2 gridUv = vec2(floor(vUv.x * uCtrl4) / uCtrl4 , floor( (vUv.y + vUv.x * 0.5) * uCtrl4) / uCtrl4);
    // float strength = random(gridUv);
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
    // float strength =  0.015 / distance(uv, vec2(0.5)) ;
    // gl_FragColor = vec4(vec3(strength), 1.0);   

     //pattern 30
    // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);   

    //pattern 31
    // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 32
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 33
    // float strength =  abs(distance(vUv, vec2(0.5)) - 0.25 );
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 35
    // float strength =  step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25 ));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 36
    // float strength =  1.0 - step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25 ));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 37
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * uCtrl5) * 0.1,
    //     vUv.y + sin(vUv.x * uCtrl5) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - uCtrl1));
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
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //pattern 43
     //learn atan using graph => https://www.desmos.com/calculator/fjaz7sv20l
    // desmos formula => A=\operatorname{mod}\left(\left(\frac{A_{rctan2}\left(p,q\right)}{3.14\ \cdot2}+0.5\ \right)\cdot\ 10,\ 1\right)
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0)  ;
    // float strength = mod(angle * uCtrl5, 1.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);




    #include <colorspace_fragment>
}