/* eslint-disable */
export default {
    name: "addAddress",
    data() {
        return {
            userNHAddress: null,
            userNHAddressName: null,
        };
    },
    methods: {
        getNHAddressData() {
            let newAddress = {
                name: this.userNHAddressName,
                address: this.userNHAddress,
            }

            this.$store.commit('addNHAddress', newAddress)
            newAddress = null
            this.userNHAddress = null
            this.userNHAddressName = null
        }
    },
};