import { SRouter } from 'koa-cms-lib'
import { AddTenderNoticeValidator, SearchTenderNoticeValidator } from '../../validator/tenderNoticeValidator'
import { PageValidator, PositiveIdValidator } from '../../validator/commonValidator'
import TenderNoticeController from '../../controller/tender-notice'
import { loginRequired } from '../../middleware/jwt'
import log from '../../middleware/log'

const tenderNotice = new SRouter({
  prefix: '/v1/tender-notice',
})

tenderNotice.sPost('新增公告信息', '/add', tenderNotice.permission('新增公告信息'), loginRequired, async (ctx, next) => {
  const v = await new AddTenderNoticeValidator().validate(ctx)
  await TenderNoticeController.addOrEdit(v, ctx)
  await next()
}, log('新增公告信息'))

tenderNotice.sPut('修改公告信息', '/:id', tenderNotice.permission('修改公告信息'), loginRequired, async (ctx, next) => {
  const v = await new AddTenderNoticeValidator().validate(ctx)
  await TenderNoticeController.addOrEdit(v, ctx)
  await next()
}, log('修改公告信息'))

tenderNotice.sGet('获取所有分页公告信息的列表', '/getPageList', tenderNotice.permission('获取所有分页公告信息的列表'), loginRequired, async (ctx, next) => {
  const v = await new PageValidator().validate(ctx)
  const q = await new SearchTenderNoticeValidator().validate(ctx)
  const list = await TenderNoticeController.getPageList(v, q)
  ctx.json(list)
})

tenderNotice.sDelete('删除公告信息', '/:id', tenderNotice.permission('删除公告信息'), loginRequired, async (ctx, next) => {
  const v = await new PositiveIdValidator().validate(ctx)
  await TenderNoticeController.deleteTenderNotice(v, ctx)
  await next()
}, log('删除公告信息'))

tenderNotice.sGet('获取公告信息的内容和附件', '/getContentAndFile/:id', tenderNotice.permission('获取公告信息的内容和附件'), loginRequired, async (ctx, next) => {
  const v = await new PositiveIdValidator().validate(ctx)
  const list = await TenderNoticeController.getTenderContentAndFile(v)
  ctx.json(list)
})

export default tenderNotice
