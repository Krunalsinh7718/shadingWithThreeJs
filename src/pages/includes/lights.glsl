vec3 ambientLight(
    vec3 color, 
    float lightIntensity
){
    return color * lightIntensity;
}

vec3 directionLight(
    vec3 lightColor, 
    float lightIntensity, 
    vec3 lightPosition, 
    vec3 normal, 
    vec3 viewDirection, 
    float specularPower)
{
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    //shading
    float shading = dot(lightDirection, normal);
    shading = max(shading, 0.0 );

    //specular
    float specular = -dot(lightReflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    return lightColor * lightIntensity * (shading + specular);
}

vec3 pointLight(
    vec3 lightColor, 
    float lightIntensity, 
    vec3 lightPosition, 
    vec3 normal, 
    vec3 viewDirection, 
    float specularPower,
    vec3 position,
    float lightDecay
){
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    vec3 lightReflection = reflect(-lightDirection, normal);

    //shading
    float shading = dot(lightDirection, normal);
    shading = max(shading, 0.0 );

    //specular
    float specular = -dot(lightReflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    //decay
    float decay = 1.0 - lightDistance * lightDecay;

    return lightColor * lightIntensity * decay * (shading + specular);
}
