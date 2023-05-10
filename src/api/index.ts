import Router from '@koa/router';
import cartRouter from './cart';
import healthRouter from './health';

const router = new Router({ prefix: '/api' });
router.use(cartRouter.routes());
router.use(healthRouter.routes());

export default router;
