/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
export const store = new Vuex.Store({
	state: {
		currentBITPriceNum: null,
		currentBITPriceSee: null,
		NHAddresses: [
			{
				addr: '3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4',
				name: 'Addr 1'
			},
			{
				addr: '3JuqAiWuAma26iYvKjzGCTEHq6A8R4ZusZ',
				name: 'Addr 2'
			}
		],
		selectedAddrTotalBalance: null,
		selectedAddr: null,
		mappingAlgorithims: {
			0: 'Scrypt',
			1: 'SHA256',
			2: 'ScryptNf',
			3: 'X11',
			4: 'X13',
			5: 'Keccak',
			6: 'X15',
			7: 'Nist5',
			8: 'NeoScrypt',
			9: 'Lyra2RE',
			10: 'WhirlpoolX',
			11: 'Qubit',
			12: 'Quark',
			13: 'Axiom',
			14: 'Lyra2REv2',
			15: 'ScryptJaneNf16',
			16: 'Blake256r8',
			17: 'Blake256r14',
			18: 'Blake256r8vnl',
			19: 'Hodl',
			20: 'DaggerHashimoto',
			21: 'Decred',
			22: 'CryptoNight',
			23: 'Lbry',
			24: 'Equihash',
			25: 'Pascal',
			26: 'X11Gost',
			27: 'Sia',
			28: 'Blake2s',
			29: 'Skunk',
			30: 'CryptoNightV7',
			31: 'CryptoNightHeavy',
			32: 'Lyra2Z',
			33: 'X16R',
			34: 'CryptoNightV8',
			35: 'SHA256AsicBoost',
			36: 'Zhash',
			37: 'Beam',
			38: 'GrinCuckaroo29',
			39: 'GrinCuckatoo31',
			40: 'Lyra2REv3',
			41: 'MTP',
			43: 'CuckooCycle',
			44: 'Total balance'
		},
		colors: [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)',
			'rgba(0,	255,	0, 0.2)',
			'rgba(255,	69,	0, 0.2)'
		],
		borderColors: [
			'rgba(255,99,132,1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)',
			'rgba(0,	255,	0, 1)',
			'rgba(255,	69,	0, 1)'
		]
	},
	mutations: {
		setSelectedAddrTotalBalance(state, newData) {
			state.selectedAddrTotalBalance = newData;
		},
		setCurrentBITPrice(state, newPrice) {
			// ! Make sure this is a float not a string
			state.currentBITPriceNum = newPrice.number;
			state.currentBITPriceSee = newPrice.string;
		},
		addNHAddress(state, newAddress) {
			// Todo Check for duplicates
			if (state.NHAddresses.length == 0) {
				state.NHAddresses.push(newAddress);
				// Todo Change this to changeSelectedAddr
				state.selectedAddr = newAddress;
			}
			else {
				state.NHAddresses.push(newAddress);
			}
			// Todo If array is empty make added array selected array
		},
		removeNHAddress(state, address) {
			var index = state.NHAddresses.indexOf(address);

			if (index > -1) {
				state.NHAddresses.splice(index, 1);
			}

			if (state.NHAddresses.length != 0 && state.selectedAddr == null) {
				state.selectedAddr = state.NHAddresses[0];
			}
		},
		changeSelectedAddr(state, address) {
			// Todo At click make it propogate upwards so it will reload
			state.selectedAddr = address;
		},
		checkForSelectedAddr(state) {
			if (state.selectedAddr == null && state.NHAddresses.length != 0) {
				state.selectedAddr = state.NHAddresses[0];
			}
		}
	},
	getters: {
		getCurrentBITPrice: (state) => {
			return state.currentBITPrice;
		},
		getCurrentSelectedAddr: (state) => {
			return state.selectedAddr;
		}
	},
	actions: {}
});
