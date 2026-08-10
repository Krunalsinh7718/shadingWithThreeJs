varying vec3 vPosition;

void main(){
    vec3 colorTop = vec3(0.18, 0.91, 0.00);
    vec3 colorBottom = vec3(0.07, 0.33, 0.01);

    
    vec3 color = mix(colorBottom, colorTop, vPosition.y);

    csm_DiffuseColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}