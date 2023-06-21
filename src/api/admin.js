import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'
import { AddMenuValidator } from '../validator/menuValidator'
import { PositiveIdValidator } from '../validator/commonValidator'

const adminRouter = new SRouter({
  prefix: '/admin',
  module: '管理员模块',
})

adminRouter.sGet('获取所有菜单', '/menu/getMenuList', adminRouter.permission('获取所有菜单'), async (ctx) => {
  const menuList = await MenuController.getMenuList()
  ctx.json(menuList)
})

adminRouter.sDelete('获取所有菜单', '/menu/deleteMenu/:id', adminRouter.permission('获取所有菜单'), async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  await MenuController.deleteMenu(v)
  ctx.success(14)
})

adminRouter.sPost('新增菜单', '/menu/addMenu', adminRouter.permission('新增菜单'), async (ctx) => {
  const v = await new AddMenuValidator().validate(ctx)
  const flag = await MenuController.addOrEditMenu(v)
  let code = 12
  if (flag) {
    if (v.get('body.id'))
      code = 13
    ctx.success(code)
  }
})

export default adminRouter
