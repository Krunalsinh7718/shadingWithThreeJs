varying vec2 vUv;
varying vec3 vNormalModel;
varying vec3 vPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudTexture;

uniform vec3 uSunDirection;

uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

uniform float uSliceStart;
uniform float uSliceArc;


void main(){
    

    //slice
    float csm_Slice;
    float angle = atan(vPosition.y, vPosition.x);
     angle -= uSliceStart;
     angle = mod(angle, PI * 2.0);
    if(angle > 0.0  && angle <  uSliceArc)
        discard;

    // Final color
}