vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);
    return mix(color, pointColor, point);
}

vec3 halftone1(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    float strenth = randomShades(0.0, uv * intensity , 0.0);

    return mix(color, pointColor, strenth);

}


vec3 halftone2(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    vec2 rotatedUv = rotate(uv, PI * 0.4, vec2(0.5));

    rotatedUv *= repetitions;
    rotatedUv = mod(rotatedUv, 1.0);

    float strength =  starShape(0.3 * intensity, rotatedUv, vec2(0.5), 5.0, 1.0);
    return mix(color, pointColor, strength);
}

vec3 halftone3(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
){
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    //  uv *= repetitions;
    uv = mod(uv, 1.0);
    float strength =   step(0.0, cnoise(uv * 800.0 )) * intensity;
    return mix(color, pointColor, strength);
}