import { koaSwagger } from 'koa2-swagger-ui';
import spec from './spec';

const schemaSpec = spec as Record<string, unknown>;

export default koaSwagger({
  routePrefix: '/swagger',
  exposeSpec: true,
  specPrefix: '/swagger/spec',
  swaggerOptions: {
    spec: schemaSpec,
    jsonEditor: true,
  },
});
