import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'
import RoleController from '../controller/role'
import UserController from '../controller/user'
import { AddMenuValidator, MenuByRouterNameValidator } from '../validator/menuValidator'
import { PageValidator, PositiveIdValidator } from '../validator/commonValidator'
import { AddRoleValidator } from '../validator/roleValidator'
import { AddUserValidator } from '../validator/userValidator'

const adminRouter = new SRouter({
  prefix: '/admin',
  module: '管理员模块',
})

adminRouter.sGet('获取所有菜单', '/menu/getMenuList', adminRouter.permission('获取所有菜单'), async (ctx) => {
  const menuList = await MenuController.getMenuList()
  ctx.json(menuList)
})

adminRouter.sGet('根据路由名称获取菜单', '/menu/getMenuByRouterName', adminRouter.permission('根据路由名称获取菜单'), async (ctx) => {
  const v = await new MenuByRouterNameValidator().validate(ctx)
  const menu = await MenuController.getMenuByRouterName(v)
  ctx.json(menu)
})

adminRouter.sDelete('删除菜单', '/menu/deleteMenu/:id', adminRouter.permission('删除菜单'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  await MenuController.deleteMenu(v)
  ctx.success(14)
})

adminRouter.sPost('新增或修改菜单', '/menu/addMenu', adminRouter.permission('新增或修改菜单'), async (ctx) => {
  const v = await new AddMenuValidator().validate(ctx)
  const flag = await MenuController.addOrEditMenu(v)
  let code = 12
  if (flag) {
    if (v.get('body.id'))
      code = 13
    ctx.success(code)
  }
})

adminRouter.sGet('获取所有角色', '/role/getRoleList', adminRouter.permission('获取所有橘色'), async (ctx) => {
  const roleList = await RoleController.getRoleList()
  ctx.json(roleList)
})

adminRouter.sDelete('删除角色', '/role/deleteRole/:id', adminRouter.permission('删除角色'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await RoleController.deleteRole(v, ctx)
})

adminRouter.sPost('新增或修改角色', '/role/addRole', adminRouter.permission('新增或修改角色'), async (ctx) => {
  const v = await new AddRoleValidator().validate(ctx)
  return await RoleController.addOrEditRole(v, ctx)
})

adminRouter.sPut('修改角色权限', '/role/dispatchPermissions/:id', adminRouter.permission('修改角色权限'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await RoleController.dispatchPermissions(v, ctx)
})

adminRouter.sGet('获取用户列表带分页', '/user/getUserList', adminRouter.permission('获取用户列表带分页'), async (ctx) => {
  const v = await new PageValidator().validate(ctx)
  const userList = await UserController.getUserList(v)
  ctx.json(userList)
})

adminRouter.sPost('新增用户', '/user/addUser', adminRouter.permission('新增用户'), async (ctx) => {
  const v = await new AddUserValidator().validate(ctx)
  return await UserController.addOrEditUser(v, ctx)
})

adminRouter.sPost('修改用户', '/user/editUser/:id', adminRouter.permission('修改用户'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  return await UserController.addOrEditUser(v, ctx)
})

adminRouter.sDelete('删除用户', '/user/deleteUser/:id', adminRouter.permission('删除用户'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await UserController.deleteUser(v, ctx)
})

export default adminRouter
