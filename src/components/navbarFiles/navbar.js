export default {
  name: "navbar",
  data: function () {
    return {

    };
  },
  computed: {
    currentBITPrice() {
      return this.$store.state.currentBITPriceSee
    }
  }
};