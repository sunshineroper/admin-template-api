import { Rule, Validator } from 'koa-cms-lib'

export class AddUserValidator extends Validator {
  constructor() {
    super()
    this.name = new Rule('isNotEmpty', '名称不能为空')
    this.mobile = new Rule('isNotEmpty', '手机不能为空')
    this.user_code = new Rule('isNotEmpty', '登录账号不能为空')
  }
}

export class LoginValidator extends Validator {
  constructor() {
    super()
    this.user_code = new Rule('isNotEmpty', '用户名不能为空')
    this.password = new Rule('isNotEmpty', '密码不能为空')
  }
}
