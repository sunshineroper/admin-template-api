import { NotFound } from 'koa-cms-lib'
import { Op } from 'sequelize'
import { MenuModel } from '../modules/menu'
import { RoleBtnPermissionsModel } from '../modules/role'

export default class BtnController {
  static async getPageList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const menu_id = v.get('query.menu_id')
    const { count, rows } = await RoleBtnPermissionsModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,
      where: {
        menu_id,
      },

    })
    return { page, limit, count, list: rows }
  }

  static async addOrEdit(ctx, v) {
    const menu_id = v.get('body.menu_id')
    const id = v.get('body.id')
    let btn = new RoleBtnPermissionsModel()
    const menu = await MenuModel.findByPk(menu_id)
    let code = 25
    if (!menu)
      throw new NotFound(10281)
    if (id) {
      code = 26
      btn = await RoleBtnPermissionsModel.findByPk(id)
      if (!btn)
        throw new NotFound(10290)
    }
    btn.name = v.get('body.name')
    btn.identity = v.get('body.identity')
    btn.status = v.get('body.status')
    btn.menu_id = menu_id
    await btn.save()
    ctx.success(code)
  }

  static async validatorUniqueIdentity(ctx, v) {
    const identity = v.get('query.identity')
    const menu_id = v.get('query.menu_id')
    const id = v.get('query.id')
    const where = {
      menu_id,
      identity,
    }
    if (id) {
      where.id = {
        [Op.ne]: id,
      }
    }
    const btn = await RoleBtnPermissionsModel.findOne({
      where: {
        ...where,
      },
    })
    if (!btn)
      ctx.success(10290)
    else
      ctx.json(btn)
  }

  static async deleteBtn(ctx, v) {
    const id = v.get('path.id')
    const btn = await RoleBtnPermissionsModel.findByPk(id)
    if (!btn)
      throw new NotFound(10290)
    await btn.destroy()
    ctx.success(27)
  }
}
