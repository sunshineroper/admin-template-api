module.exports = {
  secret: 'AaBb!@#$%^&*()_+!',
  db: {
    host: '127.0.0.1',
    dialect: 'mysql',
    username: 'root',
    password: 'sunshine',
    database: 'sun_admin',
  },
  accessExpire: 2 * 60 * 60,
  refreshExpire: 60 * 60 * 24 * 30,
}
