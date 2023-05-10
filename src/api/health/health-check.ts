import { Context } from 'koa';
// import pkg from '../../../package.json';
const { version } = require('../../../package.json');

const healthCheck = (ctx: Context) => {
  if (ctx.query?.version && ctx.query?.version !== version) {
    // Indicate to load balancer that this node should be removed from service
    ctx.status = 409;
  }

  ctx.body = {
    version,
    // TODO: disk space, DB connectivity, other dependencies...
  };
};

export default healthCheck;

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *     - Health
 *     summary: Health Check API
 *     operationId: healthCheck
 *     responses:
 *       '200':
 *         x-summary: Success
 *         description: Health check is OK
 *       '500':
 *         x-summary: Failure
 *         description: Health check is down
 */
