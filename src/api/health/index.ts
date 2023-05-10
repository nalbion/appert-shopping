import Router from '@koa/router';
import healthCheck from './health-check';

const router = new Router({
  prefix: '/health',
});

/**
 * @swagger
 *   tags:
 *     name: Health
 *     description: Health Check
 */
router.get('/', healthCheck);

export default router;
