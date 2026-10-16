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
    Pi = mod(Pi, 289.0); 
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
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
   return smoothstep(0.001, 0.99,  max(abs(uv.x), abs(uv.y)) ) ;
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


vec2 rotate2D(vec2 uv, float angle)
{
    uv -= 0.5;
    float s = sin(angle);
    float c = cos(angle);
    uv = mat2(c, -s, s, c) * uv;
    uv += 0.5;
    return uv;
}

float random2D(vec2 value){
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float rand(float value){
  return fract(sin(value)*100000.0);
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

float stripedStrenth(float strength, float stripeSize, float stripeCount, float adjuct){
    //-------------------------------
      //stripedStrenth function returns float value for stripe shape of provided strength.
      //@param {float} strength : strength of any shape
      //@param {float} stripeSize: stripe size
      //@param {float} stripeCount: amount of stripes
      //@param {float} adjuct: stripe adjuct value (may use for forward or backward animation)
    //--------------------------------
    return step(stripeSize,fract(strength * stripeCount + adjuct));
}

float noiseMorganMcGuire(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random2D(i);
    float b = random2D(i + vec2(1.0, 0.0));
    float c = random2D(i + vec2(0.0, 1.0));
    float d = random2D(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


vec2 grad( ivec2 z )  // replace this anything that returns a random vector
{
    // 2D to 1D  (feel free to replace by some other)
    int n = z.x+z.y*11111;

    // Hugo Elias hash (feel free to replace by another one)
    n = (n<<13)^n;
    n = (n*(n*n*15731+789221)+1376312589)>>16;

#if 0

    // simple random vectors
    return vec2(cos(float(n)),sin(float(n)));
    
#else

    // Perlin style vectors
    n &= 7;
    vec2 gr = vec2(n&1,n>>1)*2.0-1.0;
    return ( n>=6 ) ? vec2(0.0,gr.x) : 
           ( n>=4 ) ? vec2(gr.x,0.0) :
                              gr;
#endif                              
}

float gradientNoise( in vec2 p )
{
    ivec2 i = ivec2(floor( p ));
     vec2 f =       fract( p );
	
	vec2 u = f*f*(3.0-2.0*f); // feel free to replace by a quintic smoothstep instead

    return mix( mix( dot( grad( i+ivec2(0,0) ), f-vec2(0.0,0.0) ), 
                     dot( grad( i+ivec2(1,0) ), f-vec2(1.0,0.0) ), u.x),
                mix( dot( grad( i+ivec2(0,1) ), f-vec2(0.0,1.0) ), 
                     dot( grad( i+ivec2(1,1) ), f-vec2(1.0,1.0) ), u.x), u.y);
}


float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

// Cellular noise ("Worley noise") in 2D in GLSL.
// Cellular noise, returning F1 and F2 in a vec2.
// Speeded up by using 2x2 search window instead of 3x3,
// at the expense of some strong pattern artifacts.
// F2 is often wrong and has sharp discontinuities.
// If you need a smooth F2, use the slower 3x3 version.
// F1 is sometimes wrong, too, but OK for most purposes.
vec2 cellular2x2(vec2 P) {
#define cell2x2K 0.142857142857 // 1/7
#define cell2x2K2 0.0714285714285 // K/2
#define jitter 0.8 // Reduced from 1.0 to prevent boundary artifacts

    vec2 Pi = mod(floor(P), 289.0);
    vec2 Pf = fract(P);
    vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
    vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
    vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
    p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
    vec4 ox = mod(p, 7.0) * cell2x2K + cell2x2K2;
    vec4 oy = mod(floor(p * cell2x2K), 7.0) * cell2x2K + cell2x2K2;
    vec4 dx = Pfx + jitter * ox;
    vec4 dy = Pfy + jitter * oy;
    vec4 d = dx * dx + dy * dy;

    // Portable sorting: avoids non-contiguous swizzle assignments
    float min1 = min(min(d.x, d.y), min(d.z, d.w));
    
    // Find second smallest
    float min2 = max(min(d.x, d.y), min(d.z, d.w));
    min2 = min(min2, max(d.x, d.y));
    min2 = min(min2, max(d.z, d.w));

    return sqrt(vec2(min1, min2));
}