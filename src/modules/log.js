import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/db'

class Log extends Model {}

Log.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    comment: '操作信息',
  },
  user_id: {
    type: DataTypes.INTEGER,
    comment: '操作的用户Id',
  },
  ip: {
    type: DataTypes.STRING,
    comment: '操作的IP地址',
  },
  status: {
    type: DataTypes.STRING,
    comment: '响应的状态',
  },
  path: {
    type: DataTypes.STRING,
    comment: '操作的路径',
  },
  method: {
    type: DataTypes.STRING,
    comment: '操作的http method',
  },
  permission_name: {
    type: DataTypes.STRING,
    comment: '权限名称',
  },
  user_name: {
    type: DataTypes.STRING,
    comment: '操作的用户名称',
  },
}, {
  tableName: 'log',
  sequelize,
})

export { Log as LogModel }
