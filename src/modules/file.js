import { DataTypes, Model } from 'sequelize'
import { set } from 'lodash'
import { config } from 'koa-cms-lib'
import sequelize from '../utils/db'

class File extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      path: this.path,
      url: this.url,
      md5: this.md5,
      fieldname: this.fieldname,
      filename: this.filename,
      extension: this.extension,
      size: this.size,
      source_id: this.source_id,
    }
    if (this.type === 'LOCAL')
      set(origin, 'url', config.getItem('basePicURL', `${config.getItem('siteDomain')}/upload/${this.path}`))

    return origin
  }
}

File.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING,
    comment: '文件路径',
  },
  source_id: {
    type: DataTypes.STRING,
    comment: '业务来源id',
  },
  type: {
    type: DataTypes.STRING,
    comment: '图片类型 默认为本地',
    defaultValue: 'LOCAL',
  },
  md5: {
    type: DataTypes.STRING,
    comment: '文件md5',
  },
  fieldname: {
    type: DataTypes.STRING,
  },
  filename: {
    type: DataTypes.STRING,
    comment: '文件名称',
  },
  extension: {
    type: DataTypes.STRING,
    comment: '文件后缀',
  },
  size: {
    type: DataTypes.DOUBLE,
    comment: '文件大小',
  },
}, {
  tableName: 'file',
  sequelize,
})

export { File as FileModel }
