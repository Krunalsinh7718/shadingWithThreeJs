vec3 ambientLight(vec3 color, float lightIntensity){
    return color * lightIntensity;
}

vec3 directionLight(vec3 color, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower){
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    //shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    //specular
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);
    return color * lightIntensity * (shading + specular);
}