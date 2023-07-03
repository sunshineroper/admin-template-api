import { MenuModel } from './menu'
import { UserModel } from './user'
import { RoleMenuPermissionsModel, RoleModel, RoleUserPermissionsModel } from './role'

RoleModel.belongsToMany(MenuModel, { as: 'role_menu', through: RoleMenuPermissionsModel, foreignKey: 'role_id', otherKey: 'menu_id' })

RoleModel.belongsToMany(UserModel, { as: 'user_list', through: RoleUserPermissionsModel, foreignKey: 'role_id', otherKey: 'user_id' })

UserModel.belongsToMany(RoleModel, { as: 'role_list', through: RoleUserPermissionsModel, foreignKey: 'user_id', otherKey: 'role_id' })
