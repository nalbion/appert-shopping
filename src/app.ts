import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
// import helmet from 'koa-helmet';
import cors from '@koa/cors';
import apiRouter from './api';
import swaggerUi from './swagger/ui';

const app = new Koa();

app.use(bodyParser());
app.use(swaggerUi);
// app.use(helmet());
app.use(
  cors({
    // origin: 'http://localhost:9020'
  })
);

app.use(apiRouter.routes());

const PORT = process.env.PORT || 9020;

console.info(`Application is running on port ${PORT}, swagger documentation at /swagger`);

const server: Server = app.listen(PORT);

export default server;
