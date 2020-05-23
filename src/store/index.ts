import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import chat from './chat'
import server from './server'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
export let store: Store<{}>

export default function(/* { ssrContext } */) {
  store = new Vuex.Store({
    modules: {
      chat,
      server
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return store
}
