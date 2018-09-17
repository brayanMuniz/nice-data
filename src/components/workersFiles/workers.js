/*eslint-disable*/
import axios from 'axios'
import lineChart from "../Charts/lineChartFiles/lineChart.vue"

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
    "line-chart": lineChart
  },
  props: ['userNHAddressData', 'currentBITPriceNum', 'userNHAddress']

};