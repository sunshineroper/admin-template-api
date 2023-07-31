import { NotFound } from 'koa-cms-lib'
import { Op } from 'sequelize'
import { TenderNoticeModel } from '../modules/tender-notice'
import sequelize from '../utils/db'
import { FileModel } from '../modules/file'
import FileController from './file'

export default class TenderNotice {
  static async getPageList(v, q) {
    const page = v.get('query.page', true, 1)
    const limit = v.get('query.limit', true, 10)
    const where = {}
    const project_code = q.get('query.project_code', '')
    const title = q.get('query.title', '')
    const beginDate = q.get('query.beginDate', '')
    const endDate = q.get('query.endDate', '')
    if (project_code) {
      where.project_code = {
        [Op.substring]: project_code,
      }
    }
    if (title) {
      where.title = {
        [Op.substring]: title,
      }
    }
    if (beginDate && endDate) {
      where.createdAt = {
        [Op.and]: {
          [Op.lt]: endDate,
          [Op.gt]: beginDate,
        },
      }
    }

    const { count, rows } = await TenderNoticeModel.findAndCountAll({
      offset: (+page - 1) * +limit,
      limit: +limit,
      attributes: { exclude: ['content'] },
      order: [['createdAt', 'DESC']],
      where: { ...where },
    })
    return { page, limit, count, list: rows }
  }

  static async getTenderContentAndFile(v) {
    const id = v.get('path.id')
    const tenderNotice = await TenderNoticeModel.findOne({
      where: {
        id,
      },
      attributes: ['content'],
      include: {
        model: FileModel,
        as: 'notice_attachment',
        attributes: ['name', 'path', 'id'],
      },
    })
    if (!tenderNotice)
      throw new NotFound(10302)
    return tenderNotice
  }

  static async addOrEdit(v, ctx) {
    const currentUser = ctx.currentUser
    const id = v.get('path.id')
    const attachment_id = v.get('body.attachment_id', [])
    let tenderNotice = new TenderNoticeModel()
    let code = 60
    if (id) {
      code = 61
      tenderNotice = await TenderNoticeModel.findByPk(id)

      if (!tenderNotice)
        throw new NotFound(10302)
      tenderNotice.updated_name = currentUser.name
      tenderNotice.updated_id = currentUser.id
    }
    const transaction = await sequelize.transaction()
    try {
      tenderNotice.title = v.get('body.title')
      tenderNotice.content = v.get('body.content')
      tenderNotice.class_id = v.get('body.class_id')
      tenderNotice.status = v.get('body.status')
      tenderNotice.project_code = v.get('body.project_code')
      tenderNotice.created_name = currentUser.name
      tenderNotice.created_id = currentUser.id
      tenderNotice = await tenderNotice.save({
        transaction,
      })
      if (attachment_id.length > 0) {
        await FileModel.update({
          source_id: tenderNotice.id,
        }, {
          where: {
            id: {
              [Op.in]: attachment_id,
            },
          },
          transaction,
        })
      }
      await transaction.commit()
      ctx.success(code)
    }
    catch (error) {
      transaction && transaction.rollback()
      ctx.success(10300)
      ctx.logger.error(error)
    }
  }

  static async deleteTenderNotice(v, ctx) {
    const id = v.get('path.id')
    const tenderNotice = await TenderNoticeModel.findByPk(id)
    if (!tenderNotice)
      throw new NotFound(10302)
    let transaction
    try {
      transaction = await sequelize.transaction()
      await tenderNotice.destroy({ transaction })
      const allFile = await FileModel.findAll({
        where: {
          source_id: id,
        },
        transaction,
      })
      await FileController.unlinkSyncFiles(allFile.map(item => item.path))
      await FileModel.destroy({
        where: {
          source_id: id,
        },
        transaction,
      })
      await transaction.commit()
      ctx.success(62)
    }
    catch (error) {
      transaction && transaction.rollback()
      ctx.logger.error(error)
      ctx.success(10303)
    }
  }
}
