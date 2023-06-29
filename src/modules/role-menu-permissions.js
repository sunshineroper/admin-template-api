import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/db'

class RoleMenuPermissions extends Model {

}

RoleMenuPermissions.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  menu_id: {
    type: DataTypes.INTEGER,
  },
  role_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'role-menu-permissions',
  sequelize,
})

export default RoleMenuPermissions
