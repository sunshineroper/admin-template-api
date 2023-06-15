import { SRouter, generateToken } from 'koa-cms-lib'

const publicRouter = new SRouter({
  prefix: '/v1/public',
})

publicRouter.post('/login', (ctx) => {
  const { accessToken, refreshToken } = generateToken('sunshine')
  ctx.json({
    accessToken,
    refreshToken,
  })
})

publicRouter.get('/userInfo', (ctx) => {
  ctx.json({
    id: 1,
    name: 'sunshine',
  })
})

export default publicRouter
