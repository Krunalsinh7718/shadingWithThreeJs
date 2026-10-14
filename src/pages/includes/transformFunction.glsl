vec2 translateUV(vec2 uv, vec2 translate){
    return uv += translate;
}

vec2 rotate2d(vec2 uv, float angle)
{
    uv -= 0.5;
    float s = sin(angle);
    float c = cos(angle);
    uv = mat2(c, -s, s, c) * uv;
    uv += 0.5;
    return uv;
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}