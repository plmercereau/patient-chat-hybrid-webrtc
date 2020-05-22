import { Module } from 'vuex'

import state, { State } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'

const module: Module<State, {}> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default module
