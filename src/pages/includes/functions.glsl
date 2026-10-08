#define PI 3.1415926535897932384626433832795

float getOrignatedAngle(vec2 uv, vec2 centerPoint){
    //-------------------------------
      //getOrignatedAngle function returns angle value for angled circle.
      //valus at 0 angle is near to 0 and values at to 6.28 angle is near to 1 
      //@param {vec2} uv : texture uv
      //@param {vec2} centerPoint: X Y position of circle origin
    //--------------------------------
    return atan( uv.y - centerPoint.y, uv.x - centerPoint.x) / (PI * 2.0) + 0.5;
}

float verticalStripes(vec2 uv, float stripCount, float stripeSize){
    //-------------------------------
      //verticalStripes function returns float values for vertical stripe shape. 
      //@param {vec2} uv : texture uv
      //@param {float} stripCount : stripe Count  
      //@returns {float} stripeSize : stripe Width
    //--------------------------------
    float strength = step(stripeSize, mod(uv.y * stripCount, 1.0));
    return strength;
}

float circularStripes(vec2 uv, vec2 centerPoint, float stripeCount, float stripeSize, float adjuct){
    //-------------------------------
      //circularStripes function returns float values for circular Stripes stripe shape. 
      //@param {vec2} uv : texture uv
      //@param {vec2} centerPoint : stripe origin X Y
      //@param {float} stripCount : stripe Count  
      //@returns {float} stripeSize : stripe Width
      //@returns {float} adjuct : adjuct stripe position
    //--------------------------------
   
    return step(stripeSize, fract(length(uv - centerPoint) * stripeCount + adjuct));
}

//return value like random
float randomUV(vec2 st){
    //-------------------------------
      //randomUV function returns float values for dark light noise. 
      //@param {vec2} uv : texture uv
    //--------------------------------
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotateUV(vec2 uv, float rotation, vec2 mid){
    //-------------------------------
      //rotateUV function returns vec2 value for rotated UV. 
      //@param {vec2} uv : texture uv
      //@param {float} rotation: aotation angle
      //@param {vec2} mid: rotate oriantion of X and Y
    //--------------------------------
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}


vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

float plusShape( vec2 uv){
    //-------------------------------
      //plusShape function returns float values for plus shape. 
      //@param {vec2} uv : texture uv
    //--------------------------------
    float boxX = step(0.4, mod(uv.x  - 0.2, 1.0)) *  step(0.8, mod(uv.y , 1.0));
    float boxY = step(0.8, mod(uv.x , 1.0)) *  step(0.4, mod(uv.y  - 0.2, 1.0));
    float strength = boxX + boxY;
    return strength;
}


float cornerShape(vec2 uv, float inverse){
    //-------------------------------
      //cornerShape function returns float values for rop right and bottom right corner shape pattern. 
      //@param {vec2} uv : texture uv
      //@param {float} inverse : 0.0 = top right corner, 1.0 = bottom left corner  
    //--------------------------------
    if(inverse == 1.0){
       uv = 1.0 - uv; 
    }
    float boxX = step(0.4, mod( uv.x , 1.0)) *  step(0.8, mod( uv.y , 1.0));
    float boxY = step(0.8, mod( uv.x , 1.0)) *  step(0.4, mod( uv.y , 1.0));
    float strength = boxX + boxY ;
    return strength;
}

float borderBoxShape(vec2 uv, float boxSize, vec2 pos, float borderWidth){
    //-------------------------------
      //borderBoxShape function returns float values for border box shape. 
      //@param {vec2} uv : texture uv
      //@param {float} boxSize: box size
      //@param {vec2}  pos : box position X,Y
      //@param {float} borderWidth: border width
    //--------------------------------
    float strength = step(boxSize, max(abs(uv.x - pos.x), abs(uv.y - pos.y))) ;
    strength *= 1.0 - step(boxSize + borderWidth, max(abs(uv.x - pos.x), abs(uv.y - pos.y)));
    return strength;
}

float shades(vec2 uv, float shadeSize){
     //-------------------------------
      //shades function returns float values for X and Y dark light shades. 
      //@param {vec2} uv - texture uv
      //@param {float} shadeSize: shade size
    //--------------------------------
    return floor(uv.x * shadeSize) * 0.1 * floor(uv.y * shadeSize) * 0.1;
}

float randomShades(vec2 uv, float shadeSize,  float rotationY){
     //-------------------------------
      //randomShades function returns random dark light shades value with Y axis rotation. 
      //@param {vec2} uv : texture uv
      //@param {float} shadeSize: shade size
      //@param {float} rotationY: rotation Y
    //--------------------------------
    vec2 gridUv = vec2(floor(uv.x * shadeSize) / shadeSize , floor( (uv.y + uv.x * rotationY) * shadeSize) / shadeSize);
    float strength = randomUV(gridUv);
    return strength;
}

float starDot(vec2 uv, float intensity , vec2 centerPoint, float sqX, float sqY){
    //-------------------------------
      //starDot function returns float value for glowing dot shape. 
      //@param {vec2} uv : texture uv
      //@param {float} intensity: glow amount
      //@param {vec2} centerPoint: dot position X Y
      //@param {float} sqX: strech on X axis
      //@param {float} sqY: strech on Y axis
    //--------------------------------
    return  intensity / distance(vec2( (uv.x - 0.5) * sqY + 0.5, (uv.y - 0.5) * sqX + 0.5 ), centerPoint) ;
}

float starShape(vec2 uv, float intensity, vec2 centerPoint, float sqX, float sqY){
    //-------------------------------
      //starShape function returns float value for star shape. 
      //@param {vec2} uv : texture uv
      //@param {float} intensity: glow amout of star
      //@param {vec2} centerPoint: position of star X and Y
      //@param {float} sqX: strech on X axis
      //@param {float} sqY: strech on Y axis
    //--------------------------------
   return starDot(uv, intensity, centerPoint, sqX, sqY) * starDot(uv, intensity, centerPoint, sqY, sqX );
}

float starShape1(vec2 uv){
    //-------------------------------
      //starShape1 function returns float values for star shape. 
      //@param {vec2} uv : texture uv
    //--------------------------------
   return smoothstep(0.001, 0.99,  max(abs(uv.x), abs(uv.y)) * 0.5) ;
}
float circleShape(vec2 uv, vec2 circlePos){
    //-------------------------------
      //circleShape function returns circle shape. 
      //@param {vec2} uv : texture uv
      //@param {vec2} circlePos: circle position X Y
    //--------------------------------
    return distance(uv, circlePos);
}
float borderShape(float shapeStrength, float borderSize, float shapeSize){
    //-------------------------------
      //borderShape function returns border version of shape. 
      //@param {float} shapeStrength : shape values
      //@param {float} borderSize: border size
      //@param {float} shapeSize: shape size
    //--------------------------------
    return step(shapeSize - borderSize, shapeStrength) * step(shapeStrength, shapeSize );
    
}



float wavedCircle( 
    vec2 uv, 
    float circleSize, 
    vec2 circlePos, 
    float waveCount, 
    float waveHeight,
    float angle
){
     //-------------------------------
      //wavedCircle function returns float value for waved circle shape. 
      //@param {vec2} uv : texture uv
      //@param {float} circleSize: circle size
      //@param {vec2} circlePos: circle position X Y
      //@param {float} waveCount: how much waves
      //@param {float} waveHeight: height of waves
      //@param {float} angle: circle angle
    //--------------------------------
    float dist = length(uv - circlePos) - circleSize;
    float radius =  sin(angle * PI * 2.0 * waveCount) * max(waveHeight, 0.01);
    float circle = dist / max(waveHeight, 0.01) + radius;
    return circle;
}

float wavedRings(
    float borderSize,
    vec2 circlePos,
    vec2 uv,
    float ringCount,
    float waveCount,
    float waveHeight,
    float uTime
) {
    vec2 p = uv - circlePos;

    float dist = length(p) + uTime * -0.04;

    float angle = atan(p.x, p.y) ;

    float angle01 =
        angle / (PI * 2.0) + 0.5;

    // Wave offset
    float wave =
        sin(angle01 * PI * 2.0 * waveCount)
        * waveHeight ;

    // Move the repeating rings according to the wave
    float ring = fract(
        dist * ringCount + wave
    ) ;

    return step(ring, borderSize) ;
}

vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

float random2D(vec2 value){
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

vec2 wavedUv(vec2 uv, float wavelength, float amplitude){
    //-------------------------------
      //wavedUv function returns vec2 value for waved uv. 
      //@param {vec2} uv : texture uv
      //@param {float} wavelength: wavelength of wave
      //@param {vec2} amplitude: amplitude of wave
    //--------------------------------
    return vec2(
        uv.x + sin(uv.y * wavelength) * amplitude,
        uv.y + sin(uv.x * wavelength) * amplitude
    );
}

float angle360dStripe(vec2 uv, float angle, float stripeCount){
    //-------------------------------
      //angle360dStripe function returns float value for angled circle.
      //valus at 0 angle is near to 0 and values at to 6.28 angle is near to 1 
      //@param {vec2} uv : texture uv
      //@param {vec2} angle: angle value
      //@param {float} stripeCount: devide ciecle according to stripeCount
    //--------------------------------

    return fract(angle * max(stripeCount,1.0) )  ;

}

