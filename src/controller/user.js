import { NotFound } from 'koa-cms-lib'
import { User as UserModel } from '../modules/user'

export default class UserController {
  static async getUserList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const { count, rows } = await UserModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,

    })
    return { page, limit, count, list: rows }
  }

  static async addOrEditUser(v, ctx) {
    const id = v.get('path.id')
    let code = 30
    let user = new UserModel()
    if (id) {
      code = 31
      user = await UserModel.findByPk(id)
      if (!user)
        throw new NotFound(10260)
    }
    user.name = v.get('body.name')
    user.nickname = v.get('body.nickname')
    user.mobile = v.get('body.mobile')
    user.stauts = v.get(user.stauts)

    await user.save()
    ctx.success(code)
  }

  static async deleteUser(v, ctx) {
    const id = v.get('path.id')
    let user
    if (id) {
      user = await UserModel.findByPk(id)
      if (!user)
        throw new NotFound(10260)
    }
    await user.destroy()
    ctx.success(32)
  }
}
