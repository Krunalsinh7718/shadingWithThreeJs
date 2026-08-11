varying vec3 vPosition;

uniform vec3 uGrassColorTop;
uniform vec3 uGrassColorBottom;

void main(){
    // vec3 colorTop = vec3(0.18, 0.7, 0.00);
    // vec3 colorBottom = vec3(0.0, 0.1, 0.0);

    
    vec3 color = mix(uGrassColorBottom, uGrassColorTop, vPosition.y);

    csm_DiffuseColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}