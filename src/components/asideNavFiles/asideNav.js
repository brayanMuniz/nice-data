/* eslint-disable */
import addAddress from "../addAddressFiles/addAddress.vue"
export default {
  name: "asideNav",
  data: function () {
    return {
      NHAddresses: null
    };
  },
  methods: {

  },
  mounted() {},
  components: {
    'add-address': addAddress,
  },
  computed: {
    addrsLeft() {
      return String(6 - this.$store.state.NHAddresses.length)
    }
  }
};