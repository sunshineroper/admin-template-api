import { DataTypes, Model } from 'sequelize'
import { get, set } from 'lodash'
import sequelize from '../utils/db'
import modelMixin from '../utils/model-mixin'

class User extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name: this.name,
      nickname: this.nickname,
      mobile: this.mobile,
      status: this.status,
      createTime: this.createTime,
    }
    set(origin, 'avatar', 'https://avatars.githubusercontent.com/u/18000311?v=4')
    set(origin, 'role_list', get(this, 'role_list', []))
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
  ...modelMixin.options,
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
export { User as UserModel, UserEntity as UserEntityModel }
