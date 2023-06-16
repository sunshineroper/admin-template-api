import { Sequelize } from 'sequelize'
import { config, readFile } from 'koa-cms-lib'

const { dialect, username, password, host, database } = config.getItem('db', {})
const sequelizeSync = config.getItem('sequelizeSync', false)
const sequelize = new Sequelize(database, username, password, {
  dialect,
  host,
})
sequelize.authenticate().then(() => {
  // eslint-disable-next-line no-console
  console.log('Connection has been established successfully.')
  const files = readFile(`${process.cwd()}/src/modules`)
  files.forEach((file) => {
    require(file)
  })
  if (sequelizeSync) {
    sequelize.sync({ force: true }).then(() => {
    // eslint-disable-next-line no-console
      console.log('所有模型均已成功同步.')
    })
  }
}).catch((error) => {
  console.error('Unable to connect to the database:', error)
})

export default sequelize
