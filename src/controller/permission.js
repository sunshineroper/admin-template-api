import { PermissionRouterModel } from '../modules/role'

export default class PermissionController {
  static async getApiPageList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const { count, rows } = await PermissionRouterModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,

    })
    return { page, limit, count, list: rows }
  }
}
