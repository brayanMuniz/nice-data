/* eslint-disable */
// Todo When the user adds a addr emit it to the rest of the components
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
                addr: this.userNHAddress,
            }

            this.$store.commit('addNHAddress', newAddress)
            newAddress = null
            this.userNHAddress = null
            this.userNHAddressName = null
        }
    },
};