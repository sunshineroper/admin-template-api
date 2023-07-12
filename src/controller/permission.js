import { PermissionRouterModel } from '../modules/role'

export default class PermissionController {
  static async getApiPageList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const where = {}
    const module_name = v.get('query.module_name', '')
    const status = v.get('query.status')
    if (module_name)
      where.module_name = module_name
    if (status !== undefined)
      where.status = +status
    const { count, rows } = await PermissionRouterModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,
      where,

    })
    return { page, limit, count, list: rows }
  }

  static async getPerissionRouterName() {
    return await PermissionRouterModel.findAll({ group: 'module_name', attributes: ['module_name'] })
  }

  static async getList() {
    return await PermissionRouterModel.findAll()
  }
}
