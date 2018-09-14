/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    NHAddress: null
  },
  mutations: {
    setNHAddress(newAddress) {
      state.NHAddress = newAddress
    }
  },
  getters: {
    getNHAddress: state => {
      return state.NHAddress
    }
  }
})