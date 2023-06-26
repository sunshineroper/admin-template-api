import { Rule, Validator } from 'koa-cms-lib'

export class AddRoleValidator extends Validator {
  constructor() {
    super()
    this.pid = [
      new Rule('isNotEmpty', '父级id不能为空'),
      // new Rule('isInt', '父级id要大于或等于0', { ge: 0 }),
    ]
    this.name = new Rule('isNotEmpty', '菜单名称不能为空')
    this.type = new Rule('isNotEmpty', '菜单类型不能为空')
  }
}
