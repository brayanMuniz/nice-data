/* eslint-disable */
import axios from 'axios';
export default {
	name: 'addAddress',
	data() {
		return {
			userNHAddress: null,
			userNHAddressName: null,
			incorrectNHAddr: false
		};
	},
	methods: {
		getNHAddressData() {
			let newAddress = {
				name: this.userNHAddressName,
				addr: this.userNHAddress
			};

			this.getIfValidAddr(this.userNHAddress)
				.then((res) => {
					if (res.data.result.error) {
						this.incorrectNHAddr = true;
						this.userNHAddress = null;
					}
					else {
						this.$store.commit('addNHAddress', newAddress);
						this.userNHAddress = null;
						this.userNHAddressName = null;
					}
				})
				.catch((err) => {
					console.log(err);
					console.log('Cant connect to NH');
				});
		},
		getIfValidAddr(testingAddr) {
			return axios.get('/api', {
				params: {
					method: 'stats.provider',
					addr: testingAddr
				}
			});
		}
	}
};
