import { Rule, Validator } from 'koa-cms-lib'

export class AddTenderNoticeValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isOptional'),
      new Rule('isNotEmpty', 'id不能为空'),
    ]
    this.title = [
      new Rule('isNotEmpty', '标题不能为空'),
    ]
    this.content = [
      new Rule('isNotEmpty', '公告内容不能为空'),
    ]
  }
}

export class SearchTenderNoticeValidator extends Validator {
  constructor() {
    super()
  }
}
