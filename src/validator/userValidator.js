import { Rule, Validator } from 'koa-cms-lib'

export class AddUserValidator extends Validator {
  constructor() {
    super()
    this.name = new Rule('isNotEmpty', '名称不能为空')
    this.mobile = new Rule('isNotEmpty', '手机不能为空')
  }
}
