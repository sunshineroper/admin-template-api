const { readFile } = require('koa-cms-lib/utils')
const { config } = require('koa-cms-lib/config')

const env = process.env.NODE_ENV

const loadConfig = () => {
  const dir = `${process.cwd()}/src/config/${env}`
  const files = readFile(dir)

  for (const file of files) {
    const mod = require(file)
    const keys = Object.keys(mod)
    for (const key of keys)
      config.setItem(key, mod[key])
  }
}

const start = () => {
  loadConfig()
  const { createServer } = require('./app.js')
  const app = createServer()
  const port = config.getItem('port')
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`this app listen port ${port}`)
  })
}

start()
