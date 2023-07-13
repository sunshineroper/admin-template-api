import { SRouter, generateToken } from 'koa-cms-lib'
import { AddUserValidator } from '../validator/userValidator'
import { PageValidator, PositiveIdValidator } from '../validator/commonValidator'
import UserController from '../controller/user'
import { loginRequired, refreshTokenRequired } from '../middleware/jwt'

const userRouter = new SRouter({
  prefix: '/user',
  module: '用户模块',
  mountpermission: true,
})

userRouter.sGet('获取用户列表带分页', '/getUserList', userRouter.permission('获取用户列表带分页'), loginRequired, async (ctx) => {
  const v = await new PageValidator().validate(ctx)
  const userList = await UserController.getUserList(v)
  ctx.json(userList)
})

userRouter.sPost('新增用户', '/addUser', userRouter.permission('新增用户'), loginRequired, async (ctx) => {
  const v = await new AddUserValidator().validate(ctx)
  return await UserController.addOrEditUser(v, ctx)
})

userRouter.sGet('获取用户信息', '/getUserInfo', userRouter.permission('获取用户信息'), loginRequired, async (ctx) => {
  const user = ctx.currentUser
  ctx.json(user)
})

userRouter.sPut('修改用户', '/editUser/:id', userRouter.permission('修改用户'), loginRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  return await UserController.addOrEditUser(v, ctx)
})

userRouter.sDelete('删除用户', '/deleteUser/:id', userRouter.permission('删除用户'), loginRequired, async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)

  return await UserController.deleteUser(v, ctx)
})

userRouter.sGet('刷新token', '/refreshToken', userRouter.permission('刷新token', false), refreshTokenRequired, async (ctx) => {
  const currentUser = ctx.currentUser
  const { accessToken, refreshToken } = generateToken(currentUser.id)
  ctx.json({
    accessToken,
    refreshToken,
  })
})
export default userRouter
