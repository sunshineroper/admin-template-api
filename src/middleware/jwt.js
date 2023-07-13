import { AuthFailed, RefreshException, jwt, routeMetaInfo } from 'koa-cms-lib'
import { Op } from 'sequelize'
import UserController from '../controller/user'
import { PermissionRouterModel, RoleRouterPermissionsModel } from '../modules/role'

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

export const groupRequired = async (ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    const { identity } = jwt.parseHeader(ctx)
    const user = await mountUser(identity)
    if (!await UserController.getUserIsRoot(identity)) {
      if (ctx.matched) {
        const layer = ctx.matched[0]
        const prefix = layer.opts.prefix
        const endpoint = `${ctx.method} ${layer.path.replace(prefix, '')}`
        const { permission: permission_name, module: module_name } = routeMetaInfo.get(endpoint)
        const routerPermission = await PermissionRouterModel.findOne({ where: { endpoint, permission_name, module_name } })
        if (!routerPermission)
          throw new AuthFailed(10001)
        const role_id = user.role_list.map(item => item.id)
        const permission = await RoleRouterPermissionsModel.findOne({
          where: {
            role_id: {
              [Op.in]: role_id,
            },
            permission_router_id: routerPermission.id,
          },
        })
        if (!permission)
          throw new AuthFailed(10001)
      }
    }
    ctx.currentUser = user
  }
  await next()
}

export const notAllowed = (ctx, next) => {
  ctx.status = 404
  ctx.body = 'Not Allowed'
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
    if (!await UserController.getUserIsRoot(identity))
      throw new AuthFailed(10001)

    const user = await mountUser(identity)
    ctx.currentUser = user
  }
  await next()
}
