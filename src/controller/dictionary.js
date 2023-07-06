import { NotFound } from 'koa-cms-lib'
import { DictionaryDetailModel, DictionaryModel } from '../modules/dictionary'
import sequelize from '../utils/db'

export default class DictionaryController {
  static async getDictionaryList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const { count, rows } = await DictionaryModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,

    })
    return { page, limit, count, list: rows }
  }

  static async getDictionaryDetailList(v) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const dictionary_id = v.get('query.dictionary_id')
    const dictionary = DictionaryModel.findByPk(dictionary_id)
    if (!dictionary)
      throw new NotFound(10270)
    const { count, rows } = await DictionaryDetailModel.findAndCountAll({
      where: {
        dictionary_id,
      },
      offset: (+page - 1) * +limit,
      limit: +limit,

    })
    return { page, limit, count, list: rows }
  }

  static async addOrEditDictionary(v, ctx) {
    const id = v.get('path.id')
    let dictionary = new DictionaryModel()
    let code = 40
    if (id) {
      dictionary = await DictionaryModel.findByPk(id)
      code = 41
      if (!dictionary)
        throw new NotFound(10270)
    }

    dictionary.name_cn = v.get('body.name_cn')
    dictionary.name_en = v.get('body.name_en')
    dictionary.description = v.get('body.description')
    dictionary.status = v.get('body.status')

    try {
      await dictionary.save()
      ctx.success(code)
    }
    catch (error) {
      ctx.success(10271)
      ctx.logger.error(error)
    }
  }

  static async addOrEditDictionaryDetail(v, ctx) {
    const id = v.get('path.id')
    const dictionary_id = v.get('body.dictionary_id')
    let dictionary_detail = new DictionaryDetailModel()
    let code = 41
    if (id) {
      const dictionary = await DictionaryModel.findByPk(dictionary_id)
      dictionary_detail = await DictionaryDetailModel.findByPk(id)
      code = 42
      if (!dictionary || !dictionary_detail)
        throw new NotFound(10270)
    }

    dictionary_detail.label = v.get('body.label')
    dictionary_detail.value = v.get('body.value')
    dictionary_detail.sort = v.get('body.sort')
    dictionary_detail.status = v.get('body.status')
    dictionary_detail.dictionary_id = dictionary_id
    try {
      await dictionary_detail.save()
      ctx.success(code)
    }
    catch (error) {
      ctx.logger.error(error)
      ctx.success(10271)
    }
  }

  static async deleteDictionary(v, ctx) {
    const id = v.get('path.id')
    const dictionary = await DictionaryModel.findByPk(id)
    if (!dictionary)
      throw new NotFound(10270)
    let t
    try {
      t = await sequelize.transaction()
      await dictionary.destroy({ transaction: t })
      await DictionaryDetailModel.destroy({
        where: {
          dictionary_id: id,
        },
        transaction: t,
      })
      await t.commit()
      ctx.success(44)
    }
    catch (error) {
      ctx.logger.error(error)
      ctx.success(10272)
      t && t.rollback()
    }
  }

  static async deleteDictionaryDetail(v, ctx) {
    const id = v.get('path.id')
    const dictionaryDetail = await DictionaryDetailModel.findByPk(id)
    if (!dictionaryDetail)
      throw new NotFound(10270)
    await dictionaryDetail.destroy()
    ctx.success(45)
  }
}
