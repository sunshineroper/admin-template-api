import { Rule, Validator } from 'koa-cms-lib'

export class AddRoleValidator extends Validator {
  constructor() {
    super()
    this.name = new Rule('isNotEmpty', '菜单名称不能为空')
  }
}
