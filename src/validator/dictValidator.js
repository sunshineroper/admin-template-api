import { Rule, Validator } from 'koa-cms-lib'

export class AddDictValidator extends Validator {
  constructor() {
    super()
    this.name_en = new Rule('isNotEmpty', '字典名称(英文)不能为空')
    this.name_cn = new Rule('isNotEmpty', '字典名称(中文)不能为空')
    this.status = new Rule('isNotEmpty', '状态不能为空')
  }
}

export class AddDictDetailValidator extends Validator {
  constructor() {
    super()
    this.id = [
      new Rule('isOptional'),
      this.dictionary_id = new Rule('isNotEmpty', 'id不能为空'),
    ]
    this.dictionary_id = new Rule('isNotEmpty', '字典id不能为空')
    this.label = new Rule('isNotEmpty', '显示名称不能为空')
    this.value = new Rule('isNotEmpty', '字典值不能为空')
    this.status = new Rule('isNotEmpty', '状态不能为空')
  }
}
