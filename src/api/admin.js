import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'
import { AddMenuValidator } from '../validator/menuValidator'

const adminRouter = new SRouter({
  prefix: '/admin',
  module: '管理员模块',
})

adminRouter.sGet('获取所有菜单', '/menu/getMenuList', adminRouter.permission('获取所有菜单'), async (ctx) => {
  const menuList = await MenuController.getMenuList()
  ctx.json(menuList)
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
