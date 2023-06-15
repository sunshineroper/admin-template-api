import Koa from 'koa'
import { Loader, Logger, json, logging, onError, success } from 'koa-cms-lib'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'

const applyExtension = (app) => {
  json(app)
  success(app)
  logging(app)
  // multipart(app)
}

const applyKoaMiddleware = (app) => {
  app.use(Logger)
  app.use(bodyParser())
  app.use(cors())
  app.on('error', onError)
  // app.use(koaStatic(path.join(process.cwd(), config.getItem('setting.staticDir'))))
}

const loaderRouter = (app) => {
  // eslint-disable-next-line no-new
  new Loader(app)
}

export const createServer = () => {
  const app = new Koa()
  applyExtension(app)
  applyKoaMiddleware(app)
  loaderRouter(app)
  require('./utils/db')
  return app
}
