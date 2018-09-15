/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentBITPrice: null,
    NHAddresses: []
  },
  mutations: {
    setCurrentBITPrice(state , newPrice) {
      // ! Make sure this is a float not a string 
      state.currentBITPrice = newPrice
    },
    addNHAddress(newAddress) {
      state.NHAddresses.push(newAddress)
    },
    removeNHAddress(address) {
      // remnove the address
    }
  },
  getters: {
    getCurrentBITPrice: state => {
      return state.currentBITPrice
    },
    getNHAddress: state => {
      return state.NHAddresses
    }
  }
})