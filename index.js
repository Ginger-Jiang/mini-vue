/**
 * Vue 基类 
 * 通过 new Vue({})进行实例化 实例化时需要传入一个对象(options)
 * options 需要包含指定 DOM 元素以及需要绑定的数据(data)
 */
class Vue {
  constructor(options) {
    this.$el = document.querySelector(options.el)
    this.$data = options.data
  }
}

