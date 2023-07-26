import { SRouter, generateToken } from 'koa-cms-lib'
import { LoginValidator } from '../validator/userValidator'
import UserController from '../controller/user'

const publicRouter = new SRouter({
  prefix: '/v1/public',
})

publicRouter.post('/login', async (ctx) => {
  const v = await new LoginValidator().validate(ctx)
  const user = await UserController.login(v, ctx)
  const { accessToken, refreshToken } = generateToken(user.id)
  ctx.json({
    accessToken,
    refreshToken,
  })
})

export default publicRouter
