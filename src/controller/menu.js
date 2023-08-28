import { NotFound, RepeatException } from 'koa-cms-lib'
import { Op } from 'sequelize'
import { MenuModel } from '../modules/menu'
import { MENU_FOLDER } from '../utils/types'

export default class MenuController {
  static async getMenuList() {
    return await MenuModel.findAll()
  }

  static async deleteMenu(v) {
    const id = v.get('path.id')
    const menu = await MenuModel.findByPk(id)
    if (!menu)
      throw new NotFound(16)
    await MenuModel.destroy({
      where: {
        [Op.or]: {
          id,
          pid: id,
        },
      },
    })
  }

  static async addOrEditMenu(v) {
    const id = v.get('body.id')
    const pid = v.get('body.pid')
    const type = v.get('body.type', MENU_FOLDER)
    let menu
    if (pid !== 0) {
      const parentMenu = await MenuModel.findByPk(pid)
      if (!parentMenu)
        throw new NotFound(17)
    }
    if (type !== MENU_FOLDER) {
      menu = await MenuController.getOneMenuByField({ router_name: v.get('body.router_name', '') }, id ? { id } : {})
      if (Object.keys(menu).length > 0)
        throw new RepeatException(18)
    }

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
    menu.router_name = v.get('body.router_name')
    menu.sort = v.get('body.sort')

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

  static async getMenuByRouterName(v) {
    const id = v.get('query.id')
    const router_name = v.get('query.router_name')
    const ne = {}
    if (id)
      ne.id = id

    return await MenuController.getOneMenuByField({ router_name }, ne)
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
    return {}
  }
}
