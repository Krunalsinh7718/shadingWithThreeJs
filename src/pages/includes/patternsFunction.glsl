vec2 brickTile(vec2 uv, float zoom, float adjuct) {
    uv *= zoom;

    float timeGap = 2.0;
    float halfGap = timeGap * 0.5;

    // Determine which axis moves during this phase
    float cycle = mod(adjuct, timeGap);
    bool moveX = cycle >= halfGap;

    // Progress resets to 0 and reaches 1 during each phase
    float progress = mod(adjuct, halfGap) / halfGap;

    // Use the stationary axis to alternate movement direction
    float colORrow = moveX ? uv.y : uv.x;
    float dir = mod(floor(colORrow), 2.0);

    // IMPORTANT: move a full tile (1.0), not half a tile (0.5)
    float move = (dir < 1.0) ? -1.0 : 1.0;

    // Move one axis at a time
    if (moveX) {
        uv.x -= progress * move;
    } else {
        uv.y -= progress * move;
    }

    return fract(uv);
}

float tilePattern1(vec2 uv, float zoom){
    uv = uv * zoom;
   uv = fract(uv);

   uv = uv * 2.0;
   float index = 0.0;
   index += step(1.0, mod(uv.x, 2.0));
   index += step(1.0, mod(uv.y,2.0))*2.0;

   uv = fract(uv);

   if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        uv = rotate2D(uv,PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        uv = rotate2D(uv,PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        uv = rotate2D(uv,PI);
    }

   float strength = step(uv.x, uv.y);

   return strength;
}

vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index-0.660)*1.000));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0-_st.x,_st.y);
    } else if (_index > 0.25) {
        _st = 1.0-vec2(1.0-_st.x,_st.y);
    }
    return _st;
}
float truchetPatternMain(vec2 uv, float zoom, float type, float adjuct){
    uv *= zoom;
    // uv = (uv-vec2(5.0))*(abs(sin(u_time*0.2))*5.);
    uv.x += adjuct * 3.0;

    vec2 ipos = floor(uv);  // integer
    vec2 fpos = fract(uv);  // fraction
    float randIpos = random( ipos );

    vec2 tile = truchetPattern(fpos, randIpos);

    float strength = 0.0;
    if(type == 0.0){
        // Maze
        strength = smoothstep(tile.x-0.3,tile.x,tile.y)-
                smoothstep(tile.x,tile.x+0.3,tile.y);
    }
    if(type == 1.0){
        // Circles
        strength = (step(length(tile),0.6) -
                 step(length(tile),0.4) ) +
                (step(length(tile-vec2(1.)),0.6) -
                 step(length(tile-vec2(1.)),0.4) );
        
    }
    if(type == 2.0){
        // Truchet (2 triangles)
         strength = step(tile.x,tile.y);
    }



    return strength;
}