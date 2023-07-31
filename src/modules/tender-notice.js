import { DataTypes, Model } from 'sequelize'
import { get, set } from 'lodash'
import { config } from 'koa-cms-lib'
import sequelize from '../utils/db'
import modelMixin from '../utils/model-mixin'

class TenderNotice extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      title: this.title,
      content: this.content,
      status: this.status,
      project_code: this.project_code,
      created_name: this.created_name,
      createTime: this.createTime,
      class_id: this.class_id,
    }
    set(origin, 'notice_attachment', get(this, 'notice_attachment', []))
    set(origin, 'notice_attachment', origin.notice_attachment.map((item) => {
      item.dataValues.url = config.getItem('basePicURL', `${config.getItem('siteDomain')}/upload/${item.path}`)
      return item
    }))
    return origin
  }
}

TenderNotice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    comment: '标题',
  },
  content: {
    type: DataTypes.TEXT,
    comment: '公告内容',
  },
  class_id: {
    type: DataTypes.STRING,
    comment: '公告分类id',
  },
  status: {
    type: DataTypes.TINYINT,
    comment: '公告状态',
    defaultValue: 1,
  },
  created_name: {
    type: DataTypes.STRING,
    comment: '创建人',
  },
  created_id: {
    type: DataTypes.INTEGER,
    comment: '创建人ID',
  },
  updated_name: {
    type: DataTypes.STRING,
    comment: '修改人',
  },
  updated_id: {
    type: DataTypes.INTEGER,
    comment: '修改人ID',
  },
  project_code: {
    type: DataTypes.STRING,
    comment: '项目编号',
  },

}, {
  tableName: 'tender-notice',
  sequelize,
  ...modelMixin.options,
})

export { TenderNotice as TenderNoticeModel }
