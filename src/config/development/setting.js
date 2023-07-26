module.exports = {
  port: 3000,
  apiDir: '/src/api',
  debug: true,
  sequelizeSync: false, // 是否根据模型同步到数据库 慎用!
  staticDir: '/src/static',
  siteDomain: 'http://127.0.0.1:3000',
  multipart: {
    storeDir: 'src/static/upload',
  },
}
