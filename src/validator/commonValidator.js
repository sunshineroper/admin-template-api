import { Rule, Validator } from 'koa-cms-lib'

export class PositiveIdValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isNotEmpty', 'id不能为空'),
      // new Rule('isInt', 'id必须是数值', { min: 1 }),
    ]
  }
}

export class PageValidator extends Validator {
  constructor() {
    super()
  }
}
