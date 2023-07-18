import { MenuModel } from './menu'
import { UserModel } from './user'
import { PermissionRouterModel, RoleBtnPermissionsModel, RoleMenuPermissionsModel, RoleModel, RoleRouterPermissionsModel, RoleUserPermissionsModel } from './role'

RoleModel.belongsToMany(MenuModel, { as: 'role_menu', through: RoleMenuPermissionsModel, foreignKey: 'role_id', otherKey: 'menu_id' })

RoleModel.belongsToMany(UserModel, { as: 'user_list', through: RoleUserPermissionsModel, foreignKey: 'role_id', otherKey: 'user_id' })

RoleModel.belongsToMany(PermissionRouterModel, { as: 'permission_router_list', through: RoleRouterPermissionsModel, foreignKey: 'role_id', otherKey: 'permission_router_id' })

UserModel.belongsToMany(RoleModel, { as: 'role_list', through: RoleUserPermissionsModel, foreignKey: 'user_id', otherKey: 'role_id' })

PermissionRouterModel.belongsToMany(RoleModel, { as: 'role_list', through: RoleRouterPermissionsModel, foreignKey: 'permission_router_id', otherKey: 'role_id' })

MenuModel.hasMany(RoleBtnPermissionsModel, { as: 'role_btn_list', foreignKey: 'menu_id' })

RoleBtnPermissionsModel.belongsTo(MenuModel, { foreignKey: 'id' })
