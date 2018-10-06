/* eslint-disable */
import axios from 'axios'
import {
    copyFileSync,
    constants
} from 'fs';
// Todo When the user adds a addr emit it to the rest of the components
// Todo: Verify that the addr is valid
export default {
    name: "addAddress",
    data() {
        return {
            userNHAddress: null,
            userNHAddressName: null,
            // Todo: If the user puts an incorrect btc addr make this pop up an alert for 2 seconds and then dismiss and return values to null
            incorrectNHAddr: false
        };
    },
    methods: {
        getNHAddressData() {
            let newAddress = {
                name: this.userNHAddressName,
                addr: this.userNHAddress,
            }

            this.getIfValidAddr(this.userNHAddress).then(res => {
                if (res.data.result.error) {
                    console.log(res.data.result.error)
                } else {
                    console.log(res)
                    this.$store.commit('addNHAddress', newAddress)
                    this.userNHAddress = null
                    this.userNHAddressName = null
                }

            }).catch(err => {
                console.log(err)
                console.log("Cant connect to NH")
            })

        },
        getIfValidAddr(testingAddr) {
            return axios.get('/api', {
                params: {
                    method: 'stats.provider',
                    addr: testingAddr
                }
            })
        },
    },
};