// 1.实现插件
let Vue
class Store {
  constructor(options = {}) {
    // 需要对options.state做响应式处理
    // Vue.util.defineReactive()
    this._vm = new Vue({
      data () { 
        return {
          // $$state是不会代理到_vm上的
          $$state:options.state
        }
      } 
    })
    // 保存⽤户配置的mutations选项
    this._mutations = options.mutations || {}
    // 保存⽤户编写的actions选项
    this._actions = options.actions || {}
    // 绑定commit上下⽂否则action中调⽤commit时可能出问题!! // 同时也把action绑了，因为action可以互调
    // 写法1
    // this.commit = this.commit.bind(this)
    // this.dispatch = this.dispatch.bind(this)
    // 写法2
    const store = this
    const {commit, action} = store
    this.commit = function boundCommit(type, payload) {
      commit.call(store, type, payload)
    }
    this.action = function boundAction(type, payload) {
      return action.call(store, type, payload)
    }

    // this._getters = options.getters || {}
    // for (let key in this._getters) { 
    //   this._vm[key] = key(this.state)
    // }

  }
  get state () { 
    console.log('this._vm.$data',this._vm.$data)
    // return this._vm._data.$$state
    return this._vm.$data.$$state
  }

  set state (v) {
    console.error('please use replaceState to reset state');
  }

  

  commit (type, payload) { 
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`unknown mutation type: ${type}`);
      return
    }
    // 指定上下⽂为Store实例
    // 传递state给mutation
    entry(this.state,payload)
  }
  dispatch (type, payload) { 
    const entry = this._actions[type]
    if (!entry) {
      console.error('unknown action: ' + type);
      return
    }
    return  entry(this, payload)
  }
}
function install (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () { 
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
export default { Store, install };
