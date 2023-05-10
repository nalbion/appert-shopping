import path from 'path';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
const { version } = require('../../package.json');

export const schemaFileName = 'appert-shopping-api.yml';

const info = {
  title: 'Appert Shopping API',
  description: 'Shopping Cart for Appert',
  version: process.env.BUILD_VERSION || version,
  termsOfService: '',
};

const definition: SwaggerDefinition = {
  openapi: '3.0.0',
  info,
  servers: [
    {
      description: 'Development',
      url: 'http://localhost:9020',
    },
  ],
};

// prettier-ignore
const apis: ReadonlyArray<string> = [
  path.join(__dirname, '../models/**/*.{js,ts}'),
  path.join(__dirname, '../api/**/*.{js,ts}'),
];

const spec = swaggerJSDoc({
  definition,
  apis,
});

export default spec;
