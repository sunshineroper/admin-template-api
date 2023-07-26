import { SRouter } from 'koa-cms-lib'
import { PositiveIdValidator } from '../validator/commonValidator'
import LocalUploader from '../utils/uploader'
import FileController from '../controller/file'

const uploadRouter = new SRouter({
  prefix: '/upload',
})

uploadRouter.post('/', async (ctx) => {
  const files = await ctx.multipart()
  const localUploader = new LocalUploader()
  const arr = await localUploader.upload(files)
  ctx.json(arr)
})

uploadRouter.delete('/:id', async (ctx) => {
  const v = await new PositiveIdValidator().validate(ctx)
  await FileController.deleteFile(v, ctx)
})

export default uploadRouter
