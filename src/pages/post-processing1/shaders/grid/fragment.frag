varying vec2 vUv;
uniform float uTime;

uniform vec3 uColorStart;
uniform vec3 uColorEnd;

#include "../../../includes/perlinnoise3d.glsl"

float grid(vec2 st){
         vec2 pattern = st * 8.0;
     pattern = fract(pattern) ;
     float frame = 0.1;
 	float calcX = step(frame,pattern.x);
     float calcY = step(frame,pattern.y);
	
     float calcX1 = step(frame, 1.0 - pattern.x);
 	float calcY2 = step(frame, 1.0 - pattern.y);
	
 	return calcX * calcX1 * calcY * calcY2;
    
}

void main()
{   
    vec2 uv = vUv;    
    vec2 uv1 = vUv;    
    vec3 color = vec3(0.0);
    uv.y -= uTime * 0.01;
    vec2 pattern = uv * 30.0 ;
    pattern = fract(pattern) ;
    float frame = 0.02;
	float calcX = step(frame,pattern.x);
    float calcY = step(frame,pattern.y);
	
    float calcX1 = step(frame, 1.0 - pattern.x);
	float calcY2 = step(frame, 1.0 - pattern.y);

     float strength = 1.0 - (calcX * calcX1 * calcY * calcY2);

     //outer glow
   float dist =  smoothstep(0.01, 0.8, distance(uv1, vec2(0.5))  * 2.1);
   strength -= dist;

   color = mix(uColorStart, uColorEnd, strength);


	
	

    gl_FragColor = vec4(color, strength);
     #include <colorspace_fragment>
}