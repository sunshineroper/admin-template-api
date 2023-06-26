import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'
import RoleController from '../controller/role'
import { AddMenuValidator } from '../validator/menuValidator'
import { PositiveIdValidator } from '../validator/commonValidator'
import { AddRoleValidator } from '../validator/roleValidator'

const adminRouter = new SRouter({
  prefix: '/admin',
  module: '管理员模块',
})

adminRouter.sGet('获取所有菜单', '/menu/getMenuList', adminRouter.permission('获取所有菜单'), async (ctx) => {
  const menuList = await MenuController.getMenuList()
  ctx.json(menuList)
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

  return await RoleController.deleteMenu(v, ctx)
})
adminRouter.sPost('新增或修改角色', '/role/addRole', adminRouter.permission('新增或修改角色'), async (ctx) => {
  const v = await new AddRoleValidator().validate(ctx)
  return await RoleController.addOrEditRole(v, ctx)
})

export default adminRouter
