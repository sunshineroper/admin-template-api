import { DataTypes, Model } from 'sequelize'
import { get, set } from 'lodash'
import sequelize from '../utils/db'

class RoleMenuPermissions extends Model {

}

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

class RoleUserPermissions extends Model {

}

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
    }
    set(origin, 'role_menu', get(this, 'role_menu', []))
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
}, {
  tableName: 'role',
  sequelize,
})

export { Role as RoleModel, RoleMenuPermissions as RoleMenuPermissionsModel, RoleUserPermissions as RoleUserPermissionsModel }
