import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/db'

class User extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name: this.name,
      nickname: this.nickname,
      mobile: this.mobile,
      status: this.status,
    }
    this.set(origin, 'avatar', 'https://avatars.githubusercontent.com/u/18000311?v=4')
    return origin
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    comment: '姓名',
  },
  nickname: {
    type: DataTypes.STRING,
    comment: '昵称',
  },
  mobile: {
    type: DataTypes.INTEGER,
    comment: '手机号码',
  },
  status: {
    type: DataTypes.SMALLINT,
    comment: '状态 1是启用 0是禁用',
    defaultValue: 1,
  },
}, {
  tableName: 'user',
  sequelize,
})

class UserEntity extends Model {}

UserEntity.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    comment: '用户id',
  },
  identity_type: {
    type: DataTypes.STRING,
    comment: '标识',
  },
  identifier: {
    type: DataTypes.STRING,
    comment: '标识是password的时候会存储加密后的密码',
  },

}, {
  tableName: 'user-entity',
  sequelize,
})

export { User, UserEntity }
