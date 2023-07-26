import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/db'

class TenderNotice extends Model {}

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
}, {
  tableName: 'tender-notice',
  sequelize,
})

export { TenderNotice as TenderNoticeModel }
