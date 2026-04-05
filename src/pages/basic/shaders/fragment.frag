varying vec3 vRandom;

void main(){
    vec3 color = vec3(0.5, vRandom.r , 0.7 );
    gl_FragColor = vec4(vRandom, 1.0);
    #include <colorspace_fragment>
}