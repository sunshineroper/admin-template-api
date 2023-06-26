import { NotFound } from 'koa-cms-lib'
import RoleModel from '../modules/role'
import { sequelize } from '../utils/db'

export default class MenuController {
  static async getRoleList() {
    return await RoleModel.findAll()
  }

  static async addOrEditRole(v, ctx) {
    const id = v.get('body.id')
    let role = new RoleModel()
    if (id) {
      role = await RoleModel.findByPk(id)
      if (!role)
        return NotFound(20)
    }
    role.name = v.get('body.name')
    role.status = v.get('body.status')
    role.description = v.get('body.description')
    await role.save()
    ctx.success(22)
  }

  static async deleteRole(v, ctx) {
    const id = v.get('path.id')
    let role
    if (id) {
      role = await RoleModel.findByPk(id)
      if (!role)
        return NotFound(20)
    }
    const t = await sequelize.transition()

    try {
      await role.save({
        transaction: t,
      })
    }
    catch (error) {
      await t.rollback()
    }
    ctx.success(21)
  }
}
