// 1.实现vue插件VueRouter
let Vue;
class VueRouter {
  constructor(options) {
    this.$options = options
    // 定义响应式的属性current
    const initial = window.location.hash.slice(1) || "/"
    // 缓存path和route映射关系
    this.routeMap = {}
    this.$options.routes.forEach(route => { 
      this.routeMap[route.path] = route
    })
    Vue.util.defineReactive(this, 'current', initial)
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }
  onHashChange () { 
    this.current = window.location.hash.slice(1)
  }
}

// 静态install方法
// 形参1是Vue构造函数
VueRouter.install = function(_Vue) {
  Vue = _Vue;

  // 1.1.注册全局组件
  Vue.component("router-link", {
    props: {
      to: String
    }, 
    render (h) { 
      // return <a href={'#'+this.to}>{this.$slots.default}</a>;
      return h('a', {
        attrs: {
          href:"#"+this.to
        }
      }, [
        this.$slots.default
      ])
    }
  });
  Vue.component("router-view", {
    render (h) {
      const { routeMap, current } = this.$router
      const component = routeMap[current] ? routeMap[current].component : null
      return h(component)
    }
  });

  // 1.2.注册$router
  Vue.mixin({
    beforeCreate () { 
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  
};

export default VueRouter;
