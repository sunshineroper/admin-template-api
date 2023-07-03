import { AuthFailed, NotFound } from 'koa-cms-lib'
import { Op } from 'sequelize'
import { UserEntityModel, UserModel } from '../modules/user'
import { MenuModel } from '../modules/menu'
import sequelize from '../utils/db'
import { generate, verify } from '../utils/password-hash'
import { RoleModel, RoleUserPermissionsModel } from '../modules/role'

export default class UserController {
  static async login(v, ctx) {
    const name = v.get('body.name')
    const password = v.get('body.password')
    try {
      const user = await UserModel.findOne({
        where: {
          name,
        },
      })
      if (!user)
        throw new NotFound(10031)
      const entity = await UserEntityModel.findOne({
        where: {
          identity_type: 'PASSWORD',
          user_id: user.id,
        },
      })
      if (!entity)
        throw new NotFound(10031)
      if (!verify(password, entity.identifier))
        throw new AuthFailed(10032)
      return user
    }
    catch (error) {
      ctx.logger.error(error)
      throw new NotFound(10031)
    }
  }

  static async getUserById(id) {
    const user = await UserModel.findOne({
      where: {
        id,
      },
      include: {
        model: RoleModel,
        as: 'role_list',
        include: {
          model: MenuModel,
          as: 'role_menu',
          through: {
            attributes: [],
          },
        },
      },
    })
    if (!user)
      throw new NotFound(10260)
    return user
  }

  static async getUserList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const { count, rows } = await UserModel.findAndCountAll({
      include: {
        model: RoleModel,
        as: 'role_list',
      },
      offset: (+page - 1) * +limit,
      limit: +limit,

    })
    return { page, limit, count, list: rows }
  }

  static async addOrEditUser(v, ctx) {
    const id = v.get('path.id')
    const role_id = v.get('body.role_id', [])
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
    let t
    try {
      t = await sequelize.transaction()
      user = await user.save({
        transaction: t,
      })
      let userEntity = new UserEntityModel()
      if (id)
        userEntity = await UserEntityModel.findOne({ user_id: user.id, identity_type: 'PASSWORD' })
      userEntity.identity_type = 'PASSWORD'
      // 默认密码
      userEntity.identifier = generate('Sunshine123!')
      userEntity.user_id = user.id
      await userEntity.save({
        transaction: t,
      })
      await RoleUserPermissionsModel.destroy({ where: { user_id: user.id } })
      let roleList = []
      if (role_id && role_id.length > 0) {
        roleList = await RoleModel.findAll({
          where: {
            id: {
              [Op.in]: role_id,
            },
          },
        })
        if (roleList && roleList.length > 0) {
          roleList.map((item) => {
            const obj = {}
            item.role_id = item.id
            item.user_id = user.id
            return obj
          })
        }
      }

      await RoleUserPermissionsModel.bulkCreate(roleList, {
        transaction: t,
      })
      await t.commit()
      ctx.success(code)
    }
    catch (error) {
      ctx.logger.error(error)
      ctx.success(10261)
      t && t.rollback()
    }
  }

  static async deleteUser(v, ctx) {
    const id = v.get('path.id')
    let user
    if (id) {
      user = await UserModel.findByPk(id)
      if (!user)
        throw new NotFound(10260)
    }
    let t
    try {
      t = await sequelize.transaction()
      await user.destroy({ transaction: t })
      await UserEntityModel.destroy({ where: { user_id: id }, transaction: t })
      await RoleUserPermissionsModel({ where: { user_id: id }, transaction: t })
      await t.commit()
      ctx.success(32)
    }
    catch (error) {
      t && t.rollback()
      ctx.success(10262)
    }
  }
}
