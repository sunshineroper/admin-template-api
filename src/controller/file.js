import path from 'node:path'
import fs from 'node:fs'
import { NotFound, config } from 'koa-cms-lib'
import { FileModel } from '../modules/file'

export default class FileController {
  static async deleteFile(v, ctx) {
    const id = v.get('path.id')
    const file = await FileModel.findByPk(id)
    if (!file)
      throw new NotFound(10112)

    const baseDir = config.getItem('multipart.baseDir', process.cwd())
    const storeDir = config.getItem('multipart.storeDir', 'static/upload')
    const filePath = path.isAbsolute(storeDir) ? path.join(storeDir, file.path) : path.join(baseDir, storeDir, file.path)
    try {
      fs.unlinkSync(filePath)
      file.destroy()
      ctx.success(50)
    }
    catch (error) {
      ctx.logger.error(error)
    }
  }
}
