import { DataTypes, Model, Op, Sequelize } from 'sequelize'
import { get, set } from 'lodash'
import { logger, routeMetaInfo } from 'koa-cms-lib'
import sequelize from '../utils/db'

class RoleMenuPermissions extends Model {}

RoleMenuPermissions.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  menu_id: {
    type: DataTypes.INTEGER,
  },
  role_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'role-menu-permissions',
  sequelize,
})

class RoleUserPermissions extends Model {}

class RoleRouterPermissions extends Model {}

RoleRouterPermissions.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  permission_router_id: {
    type: DataTypes.INTEGER,
  },
  role_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'role-router-permissions',
  sequelize,
})

RoleUserPermissions.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  role_id: {
    type: DataTypes.INTEGER,
  },

}, {
  tableName: 'role-user-permissions',
  sequelize,
})

class Role extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name: this.name,
      status: this.status,
      description: this.description,
      level: this.level,
    }
    set(origin, 'role_menu', get(this, 'role_menu', []))
    set(origin, 'permission_router_list', get(this, 'permission_router_list', []))
    return origin
  }
}
Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    comment: '角色名称',
  },
  description: {
    type: DataTypes.STRING,
    comment: '角色描述',
  },
  status: {
    type: DataTypes.SMALLINT,
    comment: '状态 1是启用 0是禁用',
    defaultValue: 1,
  },
  level: {
    type: DataTypes.SMALLINT,
    comment: 'root 超级管理员, 默认为user 普通用户组',
    defaultValue: 1,
  },
}, {
  tableName: 'role',
  sequelize,
})

class PermissionRouter extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      status: this.status,
      module_name: this.module_name,
      permission_name: this.permission_name,
      endpoint: this.endpoint,
    }
    set(origin, 'role_list', get(this, 'role_list', []))
    return origin
  }

  static async initPermission() {
    const allPermissionsRouter = await this.findAll()
    const permissionIds = []
    let t
    try {
      t = await sequelize.transaction()
      for (const [key, value] of routeMetaInfo.entries()) {
        const idx = allPermissionsRouter.findIndex(item => item.endpoint === key)
        if (idx === -1 && value.mount) {
          await this.create({
            permission_name: value.permission,
            module_name: value.module,
            endpoint: key,
          }, {
            transaction: t,
          })
        }
      }

      for (const permission of allPermissionsRouter) {
        const metaInfo = routeMetaInfo.get(permission.endpoint)
        if (!metaInfo || !metaInfo.mount)
          permissionIds.push(permission.id)
      }
      if (permissionIds.length > 0) {
        await this.destroy({
          where: {
            id: {
              [Op.in]: permissionIds,
            },
          },
        })
      }
      await t.commit()
    }
    catch (error) {
      t && t.rollback()
      logger.debug(error)
    }
  }
}

PermissionRouter.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '是否启用 默认是启用',
  },
  module_name: {
    type: DataTypes.STRING,
    comment: '模块名称',
  },
  permission_name: {
    type: DataTypes.STRING,
    comment: '权限名称',
  },
  endpoint: {
    type: DataTypes.STRING,
    comment: '端点',
  },
  description: {
    type: DataTypes.STRING,
    comment: '描述',
  },

}, {
  tableName: 'permissions-router',
  sequelize,
})

class RoleBtnPermissions extends Model {

}

RoleBtnPermissions.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.INTEGER,
    comment: '按钮名称',
  },
  identity: {
    type: Sequelize.STRING,
    unique: true,
    comment: '按钮的唯一Identity',
  },
  menu_id: {
    type: Sequelize.INTEGER,
    comment: '菜单id',
  },
  status: {
    type: Sequelize.SMALLINT,
    comment: '按钮状态',
    defaultValue: 1,
  },

}, {
  tableName: 'role-btn-permissions',
  sequelize,
})
export {
  Role as RoleModel, RoleMenuPermissions as RoleMenuPermissionsModel,
  RoleUserPermissions as RoleUserPermissionsModel,
  PermissionRouter as PermissionRouterModel,
  RoleRouterPermissions as RoleRouterPermissionsModel,
  RoleBtnPermissions as RoleBtnPermissionsModel,
}
