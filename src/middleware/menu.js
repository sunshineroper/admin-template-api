import { NotFound, RepeatException } from 'koa-cms-lib'
import { Op } from 'sequelize'
import MenuModel from '../modules/menu'

export default class MenuController {
  static async getMenuList() {
    return await MenuModel.findAll()
  }

  static async deleteMenu(v) {
    const id = v.get('path.id')
    const menu = await MenuModel.findByPk(id)
    if (!menu)
      throw new NotFound(16)
  }

  static async addOrEditMenu(v) {
    const id = v.get('body.id')
    const pid = v.get('body.pid')
    if (pid !== 0) {
      const parentMenu = await MenuModel.findByPk(pid)
      if (!parentMenu)
        throw new NotFound(17)
    }
    if (await MenuController.getOneMenuByField({ router_name: v.get('body.router_name') }, id ? { id } : {}))
      throw new RepeatException(18)

    let menu
    if (!id) {
      menu = new MenuModel()
    }
    else {
      menu = await MenuModel.findByPk(id)
      if (!menu)
        throw new NotFound(16)
      menu = menu.dataValues
    }
    menu.pid = v.get('body.pid')
    menu.name = v.get('body.name')
    menu.icon = v.get('body.icon')
    menu.type = v.get('body.type')
    menu.status = v.get('body.status')
    menu.hidden = v.get('body.hidden')
    menu.title = v.get('body.title')
    menu.component_path = v.get('body.component_path')
    menu.router_url = v.get('body.router_url')
    menu.router_name = v.get('body.router_name', '')

    if (!id) {
      await menu.save()
    }
    else {
      delete menu.id
      await MenuModel.update(menu, {
        where: {
          id,
        },
      })
    }
    return true
  }

  static async getOneMenuByField(andField = {}, ne = {}) {
    const where = {}
    const neKeys = Object.keys(ne)
    if (neKeys.length > 0) {
      for (const key of neKeys) {
        const val = ne[key]
        if (val !== null) {
          where[key] = {
            [Op.ne]: val,
          }
        }
      }
    }
    where[Op.and] = andField
    const menu = await MenuModel.findOne({
      where,
    },
    )
    if (menu && menu.dataValues)
      return menu.dataValues
    return false
  }
}
