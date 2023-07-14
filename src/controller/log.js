import { LogModel } from '../modules/log'

export default class LogController {
  static async getLogList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const { count, rows } = await LogModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,
      order: [['createdAt', 'DESC']],

    })
    return { page, limit, count, list: rows }
  }
}
