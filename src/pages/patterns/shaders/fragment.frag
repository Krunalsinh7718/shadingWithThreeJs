
uniform float uTime;
uniform float uCtrl1;
uniform float uCtrl2;
uniform float uCtrl3;


varying vec2 vUv;


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
    float strength = floor(vUv.x * 10.0) * 0.1 * floor(vUv.y * 10.0) * 0.1;
    gl_FragColor = vec4(vec3(strength), 1.0);



    #include <colorspace_fragment>
}