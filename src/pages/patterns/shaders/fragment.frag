
uniform float uTime;
uniform float uCtrl1;
uniform float uCtrl2;
uniform float uCtrl3;
uniform float uCtrl4;


varying vec2 vUv;

//return value like random
float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
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


    #include <colorspace_fragment>
}