import { Rule, Validator } from 'koa-cms-lib'

export class AddBtnValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isOptional'),
    ]
    this.menu_id = [
      new Rule('isNotEmpty', 'menu_id不能为空'),
    ]
    this.identity = [
      new Rule('isNotEmpty', '按钮标识不能为空'),
    ]
    this.name = [
      new Rule('isNotEmpty', '按钮名称不能为空'),
    ]
  }
}

export class UniqueIdentityValidator extends Validator {
  constructor() {
    super()
    this.menu_id = [
      new Rule('isOptional'),
      new Rule('isInt', 'menu_id必须是数值', { min: 1 }),
    ]
    this.identity = [
      new Rule('isNotEmpty', '按钮标识不能为空'),
    ]
  }
}
