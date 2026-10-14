vec2 brickTile(vec2 _st, float _zoom, float adjuct) {
    _st *= _zoom;

    float timeGap = 2.0;
    float halfGap = timeGap * 0.5;

    // Determine which axis moves during this phase
    float cycle = mod(adjuct, timeGap);
    bool moveX = cycle >= halfGap;

    // Progress resets to 0 and reaches 1 during each phase
    float progress = mod(adjuct, halfGap) / halfGap;

    // Use the stationary axis to alternate movement direction
    float colORrow = moveX ? _st.y : _st.x;
    float dir = mod(floor(colORrow), 2.0);

    // IMPORTANT: move a full tile (1.0), not half a tile (0.5)
    float move = (dir < 1.0) ? -1.0 : 1.0;

    // Move one axis at a time
    if (moveX) {
        _st.x -= progress * move;
    } else {
        _st.y -= progress * move;
    }

    return fract(_st);
}