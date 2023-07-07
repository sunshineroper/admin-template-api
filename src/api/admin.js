import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'
import RoleController from '../controller/role'
import UserController from '../controller/user'
import { AddMenuValidator, MenuByRouterNameValidator } from '../validator/menuValidator'
import { PageValidator, PositiveIdValidator } from '../validator/commonValidator'
import { AddRoleValidator } from '../validator/roleValidator'
import { AddUserValidator } from '../validator/userValidator'
import { loginRequired } from '../middleware/jwt'
import { AddDictDetailValidator, AddDictValidator } from '../validator/dictValidator'
import DictionaryController from '../controller/dictionary'

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

adminRouter.sGet('获取用户信息', '/user/getUserInfo', adminRouter.permission('获取用户信息'), loginRequired, async (ctx) => {
  const user = ctx.currentUser
  ctx.json(user)
})

adminRouter.sPut('修改用户', '/user/editUser/:id', adminRouter.permission('修改用户'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  return await UserController.addOrEditUser(v, ctx)
})

adminRouter.sDelete('删除用户', '/user/deleteUser/:id', adminRouter.permission('删除用户'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await UserController.deleteUser(v, ctx)
})

adminRouter.sGet('获取字典列表带分页', '/dict/getDictList', adminRouter.permission('获取字典列表带分页'), async (ctx) => {
  const v = await new PageValidator().validate(ctx)
  const dictionaryList = await DictionaryController.getDictionaryList(v)
  ctx.json(dictionaryList)
})

adminRouter.sPost('新增数据字典', '/dict/addDict', adminRouter.permission('新增数据字段'), async (ctx) => {
  const v = await new AddDictValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionary(v, ctx)
})

adminRouter.sPut('修改数据字典', '/dict/editDict/:id', adminRouter.permission('数据字典'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionary(v, ctx)
})

adminRouter.sGet('获取字典详情列表带分页', '/dict/getDictDetailList', adminRouter.permission('获取字典详情列表带分页'), async (ctx) => {
  await new PositiveIdValidator().validate(ctx, { id: 'dictionary_id' })
  const v = await new PageValidator().validate(ctx)
  const dictionaryDetailList = await DictionaryController.getDictionaryDetailList(v)
  ctx.json(dictionaryDetailList)
})

adminRouter.sPost('新增数据字典值', '/dict/addDictDetail', adminRouter.permission('新增数据字典值'), async (ctx) => {
  const v = await new AddDictDetailValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionaryDetail(v, ctx)
})

adminRouter.sPut('修改数据字典值', '/dict/editDictDetail/:id', adminRouter.permission('修改数据字典值'), async (ctx) => {
  const v = await new AddDictDetailValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionaryDetail(v, ctx)
})

adminRouter.sDelete('删除字典', '/dict/:id', adminRouter.permission('删除字典'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await DictionaryController.deleteDictionary(v, ctx)
})

adminRouter.sDelete('删除字典值', '/dict-detail/:id', adminRouter.permission('删除字典值'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await DictionaryController.deleteDictionaryDetail(v, ctx)
})
adminRouter.sGet('获取字典列表', '/dict/getDictMapList', adminRouter.permission('获取字典列表'), async (ctx) => {
  const dictionaryMap = await DictionaryController.getDictList()
  ctx.json(dictionaryMap)
})

export default adminRouter
