import { DataTypes, Model } from 'sequelize'
import { get, set } from 'lodash'
import sequelize from '../utils/db'

class Dictionary extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name_cn: this.name_cn,
      name_en: this.name_en,
      status: this.status,
      description: this.description,
    }
    set(origin, 'dict_value', get(this, 'dict_value', []))
    return origin
  }
}

Dictionary.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name_cn: {
    type: DataTypes.STRING,
    comment: '字典名称(中文)',
  },
  name_en: {
    type: DataTypes.STRING,
    comment: '字典名称(英文)',
  },
  description: {
    type: DataTypes.STRING,
    comment: '描述',
  },
  status: {
    type: DataTypes.SMALLINT,
    comment: '状态',
    defaultValue: 1,
  },
}, {
  tableName: 'dictionary',
  sequelize,
})

class DictionaryDetail extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      dictionary_id: this.dictionary_id,
      status: this.status,
      label: this.label,
      value: this.value,
      sort: this.sort,
    }
    return origin
  }
}

DictionaryDetail.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dictionary_id: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.SMALLINT,
    comment: '状态',
    defaultValue: 1,
  },
  label: {
    type: DataTypes.STRING,
    comment: '展示值',
  },
  value: {
    type: DataTypes.STRING,
    comment: '字典值',
  },
  sort: {
    type: DataTypes.INTEGER,
    comment: '排列',
  },
}, {
  tableName: 'dictionary_detail',
  sequelize,
})

Dictionary.hasMany(DictionaryDetail, { as: 'dict_value', foreignKey: 'dictionary_id' })
DictionaryDetail.belongsTo(Dictionary, { foreignKey: 'id' })

export { Dictionary as DictionaryModel, DictionaryDetail as DictionaryDetailModel }
