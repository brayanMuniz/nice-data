/* eslint-disable */
import axios from 'axios'
export default {
    name: "addAddress",
    data() {
        return {
            userNHAddress: null,
            userNHAddressData: null,
            userNHAddressName: null,
        };
    },
    methods: {
        getNHAddressData() {
            axios.get('/api/nh', {
                    params: {
                        method: 'stats.provider',
                        addr: this.userNHAddress
                    }
                })
                .then(res => {
                    // Todo IF incorrect address give back error
                    // if (res.data.data.result.error) {
                    //   this.userNHAddressData = res
                    // } else {

                    // }
                    this.userNHAddressData = res.data
                    console.log(res.data)

                    let newAddress = {
                        name: this.userNHAddressName,
                        address: this.userNHAddress,
                        data: this.userNHAddressData
                    }

                    this.$store.commit('addNHAddress', newAddress)
                    newAddress = null
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
};