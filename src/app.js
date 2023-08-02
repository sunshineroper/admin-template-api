import path from 'node:path'
import Koa from 'koa'
import { Loader, Logger, config, json, logging, multipart, onError, success } from 'koa-cms-lib'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import koaStatic from 'koa-static'
import { PermissionRouterModel } from './modules/role'
import WebSocket from './utils/socket'

const applyExtension = (app) => {
  json(app)
  success(app)
  logging(app)
  multipart(app)
}

const applyKoaMiddleware = (app) => {
  app.use(koaStatic(path.join(process.cwd(), config.getItem('staticDir'))))
  app.use(Logger)
  app.use(bodyParser())
  app.use(cors())
  app.on('error', onError)
  // eslint-disable-next-line no-new
  new WebSocket(app)
}

const loaderRouter = (app) => {
  // eslint-disable-next-line no-new
  new Loader(app)
}

export const createServer = async () => {
  const app = new Koa()
  applyExtension(app)
  applyKoaMiddleware(app)
  loaderRouter(app)
  require('./utils/db')
  await PermissionRouterModel.initPermission()
  return app
}
