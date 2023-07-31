import fs from 'node:fs'
import path from 'node:path'
import { NotFound, config } from 'koa-cms-lib'
import { FileModel } from '../modules/file'

export default class FileController {
  static async deleteFile(v, ctx) {
    const id = v.get('path.id')
    const file = await FileModel.findByPk(id)
    if (!file)
      throw new NotFound(10112)

    try {
      await FileController.unlinkSyncFile(file.path)
      file.destroy()
      ctx.success(50)
    }
    catch (error) {
      ctx.logger.error(error)
    }
  }

  static async unlinkSyncFiles(filesPath) {
    for (const path of filesPath)
      await FileController.unlinkSyncFile(path)
  }

  static async unlinkSyncFile(filepath) {
    const baseDir = config.getItem('multipart.baseDir', process.cwd())
    const storeDir = config.getItem('multipart.storeDir', 'static/upload')
    const filePath = path.isAbsolute(storeDir) ? path.join(storeDir, filepath) : path.join(baseDir, storeDir, filepath)
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err)
          reject(err)
        resolve(true)
      })
    })
  }
}
