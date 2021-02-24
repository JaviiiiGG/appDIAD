import Vue from 'vue'
import Vuex from 'vuex'
import showcase from'./showcase'
// import example from './module-example'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      showcase
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })
  if ( process.env.DEV && module.hot ) {
    module.hot.accept(['./showcase'], () => {
      const newShowcase = require('./showcase').default
      Store.hotUpdate({ modules: { showcase: newShowcase } })
    })
  }

  return Store
}
