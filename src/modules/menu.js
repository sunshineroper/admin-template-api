import { DataTypes, Model } from 'sequelize'
import { get, set } from 'lodash'
import sequelize from '../utils/db'
import modelMixin from '../utils/model-mixin'

class Menu extends Model {
  toJSON() {
    const origin = {
      createTime: this.createTime,
      id: this.id,
      pid: this.pid,
      name: this.name,
      type: this.type,
      icon: this.icon,
      title: this.title,
      status: this.status,
      hidden: this.hidden,
      component_path: this.component_path,
      router_url: this.router_url,
      router_name: this.router_name,
      sort: this.sort,
    }
    set(origin, 'role_btn_list', get(this, 'role_btn_list', []))
    return origin
  }
}
Menu.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pid: {
    type: DataTypes.INTEGER,
    comment: '父级id',
  },
  name: {
    type: DataTypes.STRING,
    comment: '菜单名称',
  },
  type: {
    type: DataTypes.SMALLINT,
    comment: '菜单类型 1目录 2菜单 3外链',
  },
  icon: {
    type: DataTypes.STRING,
    comment: '图标',
  },
  title: {
    type: DataTypes.STRING,
    comment: '标题',
  },
  status: {
    type: DataTypes.STRING(2),
    comment: '状态 1是启用 0是禁用',
    defaultValue: '1',
  },
  hidden: {
    type: DataTypes.SMALLINT,
    comment: '是否左侧菜单隐藏 1是隐藏 0是展示',
    defaultValue: 0,
  },
  component_path: {
    type: DataTypes.STRING,
    comment: '组件文件路径',
  },
  router_url: {
    type: DataTypes.STRING,
    comment: '组件访问地址',
  },
  router_name: {
    type: DataTypes.STRING,
    comment: '路由名称',
  },
  sort: {
    type: DataTypes.INTEGER,
    comment: '排序',
  },
}, {
  tableName: 'menu',
  sequelize,
  ...modelMixin.options,
})

export { Menu as MenuModel }
