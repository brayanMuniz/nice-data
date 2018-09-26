/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// ? There could be a global variable for if the user wants it in bitcoin or money boolean to be specific 
// ? This will be its own component and it will emit its value to vuex and the rest of the components  
export const store = new Vuex.Store({
  state: {
    currentBITPriceNum: null,
    currentBITPriceSee: null,
    NHAddresses: [],
    selectedAddr: null
  },
  mutations: {
    setCurrentBITPrice(state, newPrice) {
      // ! Make sure this is a float not a string 
      state.currentBITPriceNum = newPrice.number
      state.currentBITPriceSee = newPrice.string
    },
    addNHAddress(state, newAddress) {
      // Todo If array is empty make added array selected array
      state.NHAddresses.push(newAddress)
    },
    removeNHAddress(state, address) {
      // !If removed addr is selectedAddr theres some PROBLEMS
      // Todo If selected addr is removed then change it 
      var index = state.NHAddresses.indexOf(address);
      if (index > -1) {
        state.NHAddresses.splice(index, 1);
      }
    },
    changeSelectedAddr(state, address) {
      // Todo At click make it propogate upwards so it will reload
      state.selectedAddr = address
      console.log(state.selectedAddr)
    }
  },
  getters: {
    getCurrentBITPrice: state => {
      return state.currentBITPrice
    }
  }
})