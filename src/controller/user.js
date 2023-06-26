import { SRouter } from 'koa-cms-lib'
import { loginRequired } from '../middleware/jwt'

const publicRouter = new SRouter({
  prefix: '/v1/public',
})

publicRouter.post('/login', loginRequired, (ctx) => {
  ctx.json({
    a: 1,
  })
})

export default publicRouter
