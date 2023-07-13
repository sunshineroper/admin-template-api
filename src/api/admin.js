import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'
import RoleController from '../controller/role'
import { AddMenuValidator, MenuByRouterNameValidator } from '../validator/menuValidator'
import { PageValidator, PositiveIdValidator } from '../validator/commonValidator'
import { AddRoleValidator } from '../validator/roleValidator'
import { adminRequired, loginRequired } from '../middleware/jwt'
import { AddDictDetailValidator, AddDictValidator } from '../validator/dictValidator'
import DictionaryController from '../controller/dictionary'
import PermissionController from '../controller/permission'
import LogController from '../controller/log'

const adminRouter = new SRouter({
  prefix: '/admin',
  module: '管理员模块',
  mountpermission: false,
})

adminRouter.sGet('获取所有菜单', '/menu/getMenuList', adminRouter.permission('获取所有菜单'), adminRequired, async (ctx) => {
  const menuList = await MenuController.getMenuList()
  ctx.json(menuList)
})

adminRouter.sGet('根据路由名称获取菜单', '/menu/getMenuByRouterName', adminRouter.permission('根据路由名称获取菜单'), adminRequired, async (ctx) => {
  const v = await new MenuByRouterNameValidator().validate(ctx)
  const menu = await MenuController.getMenuByRouterName(v)
  ctx.json(menu)
})

adminRouter.sDelete('删除菜单', '/menu/deleteMenu/:id', adminRouter.permission('删除菜单'), adminRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  await MenuController.deleteMenu(v)
  ctx.success(14)
})

adminRouter.sPost('新增或修改菜单', '/menu/addMenu', adminRouter.permission('新增或修改菜单'), adminRequired, async (ctx) => {
  const v = await new AddMenuValidator().validate(ctx)
  const flag = await MenuController.addOrEditMenu(v)
  let code = 12
  if (flag) {
    if (v.get('body.id'))
      code = 13
    ctx.success(code)
  }
})

adminRouter.sGet('获取所有角色', '/role/getRoleList', adminRouter.permission('获取所有角色'), loginRequired, async (ctx) => {
  const roleList = await RoleController.getRoleList(ctx)
  ctx.json(roleList)
})

adminRouter.sDelete('删除角色', '/role/deleteRole/:id', adminRouter.permission('删除角色'), adminRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await RoleController.deleteRole(v, ctx)
})

adminRouter.sPost('新增或修改角色', '/role/addRole', adminRouter.permission('新增或修改角色'), adminRequired, async (ctx) => {
  const v = await new AddRoleValidator().validate(ctx)
  return await RoleController.addOrEditRole(v, ctx)
})

adminRouter.sPut('修改角色权限', '/role/dispatchPermissions/:id', adminRouter.permission('修改角色权限'), adminRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await RoleController.dispatchPermissions(v, ctx)
})

adminRouter.sGet('获取字典列表带分页', '/dict/getDictList', adminRouter.permission('获取字典列表带分页'), loginRequired, async (ctx) => {
  const v = await new PageValidator().validate(ctx)
  const dictionaryList = await DictionaryController.getDictionaryList(v)
  ctx.json(dictionaryList)
})

adminRouter.sPost('新增数据字典', '/dict/addDict', adminRouter.permission('新增数据字段'), adminRequired, async (ctx) => {
  const v = await new AddDictValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionary(v, ctx)
})

adminRouter.sPut('修改数据字典', '/dict/editDict/:id', adminRouter.permission('数据字典'), adminRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionary(v, ctx)
})

adminRouter.sGet('获取字典详情列表带分页', '/dict/getDictDetailList', adminRouter.permission('获取字典详情列表带分页'), adminRequired, async (ctx) => {
  await new PositiveIdValidator().validate(ctx, { id: 'dictionary_id' })
  const v = await new PageValidator().validate(ctx)
  const dictionaryDetailList = await DictionaryController.getDictionaryDetailList(v)
  ctx.json(dictionaryDetailList)
})

adminRouter.sPost('新增数据字典值', '/dict/addDictDetail', adminRouter.permission('新增数据字典值', false), adminRequired, async (ctx) => {
  const v = await new AddDictDetailValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionaryDetail(v, ctx)
})

adminRouter.sPut('修改数据字典值', '/dict/editDictDetail/:id', adminRouter.permission('修改数据字典值'), adminRequired, async (ctx) => {
  const v = await new AddDictDetailValidator().validate(ctx)
  return await DictionaryController.addOrEditDictionaryDetail(v, ctx)
})

adminRouter.sDelete('删除字典', '/dict/:id', adminRouter.permission('删除字典'), adminRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await DictionaryController.deleteDictionary(v, ctx)
})

adminRouter.sDelete('删除字典值', '/dict-detail/:id', adminRouter.permission('删除字典值'), adminRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await DictionaryController.deleteDictionaryDetail(v, ctx)
})

adminRouter.sGet('获取字典列表', '/dict/getDictMapList', adminRouter.permission('获取字典列表'), loginRequired, async (ctx) => {
  const dictionaryMap = await DictionaryController.getDictList()
  ctx.json(dictionaryMap)
})

adminRouter.sGet('获取api分页列表', '/api/getApiPageList', adminRouter.permission('获取api分页列表'), adminRequired, async (ctx, next) => {
  const v = await new PageValidator().validate(ctx)
  const list = await PermissionController.getApiPageList(v)
  ctx.json(list)
  await next()
})

adminRouter.sGet('获取所有api模块名称', '/api/getPerissionRouterName', adminRouter.permission('获取所有api模块名称'), adminRequired, async (ctx, next) => {
  const list = await PermissionController.getPerissionRouterName()
  ctx.json(list)
})

adminRouter.sGet('获取api列表', '/api/getList', adminRouter.permission('获取api列表'), adminRequired, async (ctx) => {
  const list = await PermissionController.getList()
  ctx.json(list)
})

adminRouter.sGet('获取日志列表', '/log/getList', adminRouter.permission('获取日志列表'), adminRequired, async (ctx) => {
  const v = await new PageValidator().validate(ctx)
  const list = await LogController.getLogList(v)
  ctx.json(list)
})

export default adminRouter
