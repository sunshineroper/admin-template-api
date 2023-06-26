import { jwt } from 'koa-cms-lib'

export const loginRequired = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    const obj = jwt.parseHeader(ctx)
  }
  await next()
}
