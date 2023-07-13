import { NotFound } from 'koa-cms-lib'
import { Op } from 'sequelize'
import { PermissionRouterModel, RoleMenuPermissionsModel, RoleModel, RoleRouterPermissionsModel } from '../modules/role'
import sequelize from '../utils/db'
import { MenuModel } from '../modules/menu'
import { ROOT } from '../utils/types'

export default class MenuController {
  static async getRoleList(ctx) {
    const currentUser = ctx.currentUser
    let where = {}
    if (!currentUser.isAdmin) {
      where = {
        level: {
          [Op.ne]: ROOT,
        },
      }
    }

    return await RoleModel.findAll({
      include: [
        {
          model: MenuModel,
          as: 'role_menu',
          through: {
            attributes: [],
          },
        },
        {
          model: PermissionRouterModel,
          as: 'permission_router_list',
        },
      ],
      where,
    })
  }

  static async dispatchPermissions(v, ctx) {
    const id = v.get('path.id')
    const menu_id = v.get('body.menu_id', [])
    const permission_router_id = v.get('body.permission_router_id', [])
    let role
    if (id) {
      role = await RoleModel.findByPk(id)
      if (!role)
        return NotFound(20)
    }
    let t
    try {
      t = await sequelize.transaction()
      await RoleMenuPermissionsModel.destroy({
        where: {
          role_id: role.id,
        },
        transaction: t,
      })
      if (menu_id.length > 0) {
        // 处理权限菜单部分
        const menuAll = await MenuModel.findAll({
          where: {
            id: {
              [Op.in]: menu_id,
            },
          },
        })
        if (menuAll && menuAll.length > 0) {
          const roleMenu = []
          menuAll.forEach((menu) => {
            roleMenu.push({ menu_id: menu.dataValues.id, role_id: role.id })
          })
          await RoleMenuPermissionsModel.bulkCreate(roleMenu, { transaction: t })
        }
      }
      if (permission_router_id.length > 0) {
        // 处理API路由部分
        const routerAll = await PermissionRouterModel.findAll({
          where: {
            id: {
              [Op.in]: permission_router_id,
            },
          },
        })
        if (routerAll && routerAll.length > 0) {
          const permissionRouter = []
          routerAll.forEach((router) => {
            permissionRouter.push({ permission_router_id: router.id, role_id: role.id })
          })
          await RoleRouterPermissionsModel.bulkCreate(permissionRouter, { transaction: t })
        }
      }

      await t.commit()
      ctx.success(24)
    }
    catch (error) {
      ctx.logger.error(error)
      t && t.rollback()
      ctx.success(10010)
    }
  }

  static async addOrEditRole(v, ctx) {
    const id = v.get('body.id')
    let role = new RoleModel()
    let code = 22
    if (id) {
      role = await RoleModel.findByPk(id)
      code = 23
      if (!role)
        return NotFound(20)
    }
    role.name = v.get('body.name')
    role.status = v.get('body.status')
    role.description = v.get('body.description')
    await role.save()
    ctx.success(code)
  }

  static async deleteRole(v, ctx) {
    const id = v.get('path.id')
    let role
    if (id) {
      role = await RoleModel.findByPk(id)
      if (!role)
        return NotFound(20)
    }
    let t
    try {
      t = await sequelize.transaction()
      await role.destroy({
        transaction: t,
      })
      await t.commit()
      ctx.success(21)
    }
    catch (error) {
      t && await t.rollback()
      ctx.success(10021)
    }
  }
}
