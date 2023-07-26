import fs from 'node:fs'
import path from 'node:path'
import { Uploader, config } from 'koa-cms-lib'
import { FileModel } from '../modules/file'

export default class LocalUploader extends Uploader {
  async upload(files) {
    const arr = []
    for (const file of files) {
      const { filename, absolutePath, relativePath } = this.storePath(file.filename)
      const md5 = this.generateMd5(file.data)
      const writer = fs.createWriteStream(absolutePath)

      await writer.write(file.data)
      const f = await FileModel.create({
        path: relativePath,
        type: 'LOCAL',
        md5,
        filename: file.filename,
        fieldname: file.fieldname,
        extension: path.extname(file.filename),
        size: file.size,
      })
      arr.push({
        id: f.id,
        name: f.filename,
        size: f.size,
        extension: f.extension,
        path: f.path,
        key: f.fieldname,
        md5: f.md5,
        url: config.getItem('basePicURL', `${config.getItem('siteDomain')}/upload/${f.path}`),
      })
    }

    return arr
  }
}
