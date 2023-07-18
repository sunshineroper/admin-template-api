import { AuthFailed, routeMetaInfo } from 'koa-cms-lib'
import { LogModel } from '../modules/log'

const parseTemplate = (template, user, response, request) => {
  return template
}
const writeLog = async (template, ctx) => {
  const tmp = parseTemplate(template, ctx.currentUser, ctx.response, ctx.request)
  if (ctx.matched) {
    const name = ctx.routerName
    const layer = ctx.matched.find(l => l.name === name)
    if (!layer)
      throw new AuthFailed(10001)
    const prefix = layer.opts.prefix
    const endpoint = `${ctx.method} ${layer.path.replace(prefix, '')}`
    const permission = routeMetaInfo.get(endpoint)
    const user = ctx.currentUser
    await LogModel.create({
      message: tmp,
      permission_name: permission ? permission.permission_name : '',
      ip: ctx.ip,
      methid: ctx.method,
      path: ctx.path,
      method: ctx.method,
      user_name: user ? user.name : null,
      user_id: user ? user.id : '',
      status: ctx.status || 0,
    })
  }
}

const log = (template) => {
  return async (ctx, next) => {
    await writeLog(template, ctx)
    await next()
  }
}
export default log
