/**
 * Vue 基类 
 * 通过 new Vue({})进行实例化 实例化时需要传入一个对象(options)
 * options 需要包含指定 DOM 元素以及需要绑定的数据(data)
 */
class Vue {
  constructor(options) {
    this.$el = document.querySelector(options.el)
    this.$data = options.data
    // 在 Vue 实例化的时候, 需要完成数据绑定与模板编译
    observe(this.$data) // 数据绑定
  }
}

/**
 * observe 响应式系统(目前只针对对象)
 * 需要对 data 中所有数据进行绑定
 * 需要遍历, 先判断是否是对象, 然后将对象每一个属性进行监听(defineReactive)
 */

function observe(data) {
  if (Object.prototype.toString.call(data) === '[object object]') {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]) // 劫持侦听
      observe(data[key]) // 递归 
    })
  }
}

/**
 * 将指定对象属性进行劫持侦听
 * 劫持过程中需要判定, 如果新数据也是一个对象, 就需要继续观察侦听
 * 通过依赖关系类(Dep) 通知有依赖关系的代理做出反应
 */
function defineReactive(obj, key, val) {
  // dep 是依赖于此数据的 watcher 集合
  const dep = new Dep() // 每一个数据(被观察者)新建一个依赖集合(观察者对象)
  Object.defineProperty(obj, key, {
    get() {
      // dep.addSub(_watcher) // 数据初始化时候就需要建立依赖关系
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      observe(newVal) // 新的值如果是对象也要进行观察
      dep.notify() // 通知依赖(观察者)的代理做一些事情
    }
  })
}

/**
 * Dep 是一个依赖关系存储器-发布订阅
 * 使用 Set 可以保证没有重复值
 */
class Dep {
  constructor() {
    this.subs = new Set() 
  }
  // 添加订阅者
  addSub(watcher) {
    this.subs.add(watcher)
  }
  // 删除订阅者
  removeSub(watcher) {
    this.subs.delete(watcher)
  }
  // 通知订阅者
  notify() {
    for (let sub in this.subs) {
      sub.update() // watcher 需要提供的一个核心方法
    }
  }
}