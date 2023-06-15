import MenuModel from '../modules/menu'

export default class MenuController {
  static async getMenuList() {
    return await MenuModel.findAll()
  }
}
