import addAddress from "../addAddressFiles/addAddress.vue"
export default {
  name: "asideNav",
  data: function () {
    return {
      NHAddresses: null
    };
  },
//  Todo use watch for when data changes then call this.getNHAddress() or change data somehow
  methods: {
    getNHAddress() {
      this.NHAddresses = this.$state.getters.getNHAddresses
    },
  },
  components: {
    'add-address': addAddress
  }

};