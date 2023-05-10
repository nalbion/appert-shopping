docker run --rm -v "%CD%:/local" openapitools/openapi-generator-cli:v5.2.0 generate ^
    -i /local/generator-specs/<%= appname %>.yaml ^
    -g typescript-axios ^
    -o /local/src/client ^
    --additional-properties="withInterfaces=true supportsES6=true"
