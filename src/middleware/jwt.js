import { RefreshException, jwt } from 'koa-cms-lib'
import UserController from '../controller/user'

const mountUser = async (id) => {
  const user = await UserController.getUserInfo(id)
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

export const refreshTokenRequired = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    const { identity } = jwt.parseHeader(ctx, 'refresh')
    try {
      const user = await mountUser(identity)
      if (!user)
        throw new RefreshException()
      ctx.currentUser = user
    }
    catch (error) {
      ctx.logger.error(error)
      throw new RefreshException()
    }
  }
  await next()
}

export const adminRequired = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    const { identity } = jwt.parseHeader(ctx)
    const user = await mountUser(identity)
    ctx.currentUser = user
  }
  await next()
}
