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
    // ! For testing I will have one addr in NHAddresses
    NHAddresses: [{
      addr: '3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4',
      name: "Brayan"
    }],
    selectedAddr: null,
    // Todo Remove mappigAlgorithims and just make the axios call if there is one
    mappingAlgorithims: {
      0: "Scrypt",
      1: "SHA256",
      2: "ScryptNf",
      3: "X11",
      4: "X13",
      5: "Keccak",
      6: "X15",
      7: "Nist5",
      8: "NeoScrypt",
      9: "Lyra2RE",
      10: " WhirlpoolX",
      11: "Qubit",
      12: "Quark",
      13: "Axiom",
      14: "Lyra2REv2",
      15: "ScryptJaneNf16",
      16: "Blake256r8",
      17: "Blake256r14",
      18: "Blake256r8vnl",
      19: "Hodl",
      20: "DaggerHashimoto",
      21: "Decred",
      22: "CryptoNight",
      23: "Lbry",
      24: "Equihash",
      25: "Pascal",
      26: "X11Gost",
      27: "Sia",
      28: "Blake2s",
      29: "Skunk",
      30: "CryptoNightV7",
      31: "CryptoNightHeavy",
      32: "Lyra2Z",
      33: "X16R",
      // ! 34 Does not exist in the official API, but for configuration I made it so total balance can exist
      34: 'Total Balance'
    }
  },
  mutations: {
    setCurrentBITPrice(state, newPrice) {
      // ! Make sure this is a float not a string 
      state.currentBITPriceNum = newPrice.number
      state.currentBITPriceSee = newPrice.string
    },
    addNHAddress(state, newAddress) {
      // Todo Check for duplicates
      if (state.NHAddresses.length == 0) {
        state.NHAddresses.push(newAddress)
        // Todo Change this to changeSelectedAddr
        state.selectedAddr = newAddress
      } else {
        state.NHAddresses.push(newAddress)
      }
      // Todo If array is empty make added array selected array 
    },
    removeNHAddress(state, address) {
      // ? What if the user decides to remove all of the addrs
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