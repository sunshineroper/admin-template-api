import { SRouter, generateToken } from 'koa-cms-lib'
import { AddUserValidator } from '../validator/userValidator'
import { PageValidator, PositiveIdValidator } from '../validator/commonValidator'
import UserController from '../controller/user'
import { adminRequired, refreshTokenRequired } from '../middleware/jwt'
import log from '../middleware/log'

const userRouter = new SRouter({
  prefix: '/user',
  module: '用户模块',
  mountpermission: true,
})

userRouter.sGet('获取用户列表带分页', '/getUserList', userRouter.permission('获取用户列表带分页'), adminRequired, async (ctx) => {
  const v = await new PageValidator().validate(ctx)
  const userList = await UserController.getUserList(v)
  ctx.json(userList)
})

userRouter.sPost('新增用户', '/addUser', userRouter.permission('新增用户'), adminRequired, async (ctx, next) => {
  await next()
  const v = await new AddUserValidator().validate(ctx)
  return await UserController.addOrEditUser(v, ctx)
}, log('新增用户'))

userRouter.sGet('获取用户信息', '/getUserInfo', userRouter.permission('获取用户信息'), adminRequired, async (ctx, next) => {
  const user = ctx.currentUser
  ctx.json(user)
  await next()
}, log('获取用户信息'))

userRouter.sPut('修改用户', '/editUser/:id', userRouter.permission('修改用户'), adminRequired, async (ctx, next) => {
  const v = await new PositiveIdValidator().validate(ctx)
  await next()
  return await UserController.addOrEditUser(v, ctx)
}, log('修改用户'))

userRouter.sDelete('删除用户', '/deleteUser/:id', userRouter.permission('删除用户'), adminRequired, async (ctx, next) => {
  const v = await new PositiveIdValidator().validate(ctx)

  await UserController.deleteUser(v, ctx)
  await next()
}, log('删除用户'))

userRouter.sGet('刷新token', '/refreshToken', userRouter.permission('刷新token', false), refreshTokenRequired, async (ctx, next) => {
  const currentUser = ctx.currentUser
  const { accessToken, refreshToken } = generateToken(currentUser.id)
  ctx.json({
    accessToken,
    refreshToken,
  })
  await next()
}, log('刷新token'))
export default userRouter
