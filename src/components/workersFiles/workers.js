/*eslint-disable*/
import doNut from "../Charts/doNutFiles/doNut.vue"

export default {
  name: "workers",
  data() {
    return {
      userNHAddressWorkerData: null,
    }
  },
  created() {
  },
  mounted() {},
  methods: {
  },
  components: {
    "do-nut": doNut
  },
  props: ['userNHAddressData', 'currentBITPriceNum', 'userNHAddress']
};