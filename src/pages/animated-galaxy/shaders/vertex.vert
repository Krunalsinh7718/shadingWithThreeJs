uniform float uSize;
uniform float uTime;

attribute float scales;
attribute vec3 randomness;

varying vec3 vColor;
 
 void main(){
            vec4 modelPosition =  modelMatrix * vec4(position,1.0);


            // Rotate
            float angle = atan(modelPosition.x, modelPosition.z);
            float distFromCenter = length(modelPosition.xy);
            float angleOffset = (1.0 / distFromCenter) * uTime * 0.2;
            angle += angleOffset;

            modelPosition.x = sin(angle) * distFromCenter;
            modelPosition.z = cos(angle) * distFromCenter;

            //randomness
            modelPosition.xyz += randomness;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;


            gl_Position = projectionPosition;

            gl_PointSize = uSize * scales;
            gl_PointSize *= (1.0 / - viewPosition.z);

            vColor = color;
        }