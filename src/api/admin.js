import { SRouter } from 'koa-cms-lib'
import MenuController from '../controller/menu'

const adminRouter = new SRouter({
  prefix: '/admin',
  module: '管理员模块',
})

adminRouter.sGet('获取所有菜单', '/getMenuList', adminRouter.permission('获取所有菜单'), async (ctx) => {
  await MenuController.getMenuList()
})

export default adminRouter
