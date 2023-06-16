import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/db'

class Menu extends Model {
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
    type: DataTypes.SMALLINT,
    comment: '状态 1是启用 0是禁用',
    defaultValue: 1,
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
  role_id: {
    type: DataTypes.INTEGER,
    comment: '角色ID',
  },
}, {
  tableName: 'menu',
  sequelize,
})

export default Menu
