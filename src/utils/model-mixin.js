const modelMixin = {
  options: {
    getterMethods: {
      createTime() {
        return +new Date(this.createdAt)
      },
      updateTime() {
        return +new Date(this.createdAt)
      },
    },
  },
}
export default modelMixin
