import { jwt } from 'koa-cms-lib'
import UserController from '../controller/user'

const mountUser = async (id) => {
  const user = await UserController.getUserById(id)
  return user
}

export const loginRequired = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    const { identity } = jwt.parseHeader(ctx)
    const user = await mountUser(identity)
    ctx.currentUser = user
  }
  await next()
}
