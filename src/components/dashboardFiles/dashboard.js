/* eslint-disable */
// Todo https://apexcharts.com/javascript-chart-demos/mixed-charts/line-column-area/ 
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
export default {
  name: "dashboard",
  data() {
    return {
      userData: {},
      dataLoaded: false,
      chartOptions: {},
      profitAlgorithims: null

    };
  },
  beforeCreate() {
    this.$parent.getCurrentBITPrice()
  },
  created() {
    this.getProfitData()
  },
  methods: {
    getProfitData() {
      let testingAddr = this.$store.state.selectedAddr.addr
      axios.get('/api', {
          params: {
            method: 'stats.provider.ex',
            addr: testingAddr
          }
        })
        .then(res => {
          console.log(res.data.result)
          this.profitAlgorithims = res.data.result.current
          this.fillChartData(res.data.result)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCurrent(currentData) {
      // This will be called at the end renderChart
      let total = 0
      currentData.forEach(element => {
        console.log(Number(element.profitability))
        total += Number(element.profitability)
      })
      return total
      // return total and append to end of []
    },
    fillChartData(profitData) {
      let totalCalculatedProfits = []
      let amountData = []

      profitData.past.forEach(element => {
        console.log(element)
        let total = 0
        let calculatedProfits = []
        // Start looping through the hours and get the sum of all of them for the current profit for that hour
        element.data.forEach(timedProfit => {
          // for (let i = 1; i < 168; i++) {
          // Number(moment().subtract(i, "h").format("X"))
          // Best way to do this is to not use moment and just jump 500 or so 
          // 2016 / 168 = 12
          for (let counter = 1; counter < 169; counter++) {
            if (Number(timedProfit[0] * 300) == Number(moment().subtract(counter, "h").format("X"))) {
              calculatedProfits.push(Number(timedProfit[2]))
            }
          }
        })

        console.log("kek")
        console.log(Number(moment().subtract(24, "h").format("X")))
        console.log(calculatedProfits)
        console.log(totalCalculatedProfits)
        totalCalculatedProfits.push(calculatedProfits)
        console.log(totalCalculatedProfits)
        calculatedProfits = []
      })

      let totalData = amountData.push(this.getCurrent(profitData.current))
      console.log(totalData)
      this.userData.labels = ['test', 'test2']

      // At the end append getCurrent to the amounts array
      this.userData.datasets = [{
        // Todo Think of a way to keep this
        label: this.$store.state.NHAddresses[0].name,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        data: totalData
      }]
      // ! Turn this back on to render the data
      this.dataLoaded = true
    }
  },
  components: {
    "line-chart": lineChart
  },
  props: ['currentBITPriceNum']
};