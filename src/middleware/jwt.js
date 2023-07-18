import { AuthFailed, RefreshException, jwt, routeMetaInfo } from 'koa-cms-lib'
import { Op } from 'sequelize'
import UserController from '../controller/user'
import { PermissionRouterModel, RoleModel } from '../modules/role'

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
        const name = ctx.routerName
        const layer = ctx.matched.find(l => l.name === name)
        if (!layer)
          throw new AuthFailed(10001)
        const prefix = layer.opts.prefix
        const endpoint = `${ctx.method} ${layer.path.replace(prefix, '')}`
        const permission = routeMetaInfo.get(endpoint)
        if (!permission || !permission.mount)
          throw new AuthFailed(10001)
        const role_id = user.role_list.map(item => item.id)
        const routerPermission = await PermissionRouterModel.findOne({
          where: { endpoint, permission_name: permission.permission, module_name: permission.module },
          include: {
            model: RoleModel,
            as: 'role_list',
            where: {
              id: {
                [Op.in]: role_id,
              },
            },
          },
        })
        if (!routerPermission)
          throw new AuthFailed(10001)
      }
    }
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
    if (!await UserController.getUserIsRoot(identity))
      throw new AuthFailed(10001)

    ctx.currentUser = user
  }
  await next()
}
