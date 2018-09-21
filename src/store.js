/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentBITPriceNum: null,
    currentBITPriceSee: null,
    NHAddresses: []
  },
  mutations: {
    setCurrentBITPrice(state, newPrice) {
      // ! Make sure this is a float not a string 
      state.currentBITPriceNum = newPrice.number
      state.currentBITPriceSee = newPrice.string
    },
    addNHAddress(state, newAddress) {
      state.NHAddresses.push(newAddress)
    },
    removeNHAddress(state, address) {
      // remnove the address
    }
  },
  getters: {
    getCurrentBITPrice: state => {
      return state.currentBITPrice
    }
  }
})