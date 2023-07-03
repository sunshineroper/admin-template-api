import { NotFound } from 'koa-cms-lib'
import { Op } from 'sequelize'
import { RoleMenuPermissionsModel, RoleModel } from '../modules/role'
import sequelize from '../utils/db'
import { MenuModel } from '../modules/menu'

export default class MenuController {
  static async getRoleList() {
    return await RoleModel.findAll({
      include: {
        model: MenuModel,
        as: 'role_menu',
        through: {
          attributes: [],
        },
      },
    })
  }

  static async dispatchPermissions(v, ctx) {
    const id = v.get('path.id')
    const menu_id = v.get('body.menu_id', [])
    let role
    if (id) {
      role = await RoleModel.findByPk(id)
      if (!role)
        return NotFound(20)
    }
    let t
    try {
      t = await sequelize.transaction()
      // 处理权限菜单部分
      if (menu_id.length > 0) {
        await RoleMenuPermissionsModel.destroy({
          where: {
            role_id: role.id,
          },
          transaction: t,
        })
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
      await t.commit()
      ctx.success(24)
    }
    catch (error) {
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
