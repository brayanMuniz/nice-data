/* eslint-disable */
import barChart from '../Charts/barChart/barChart.vue'
import moment from 'moment'
import axios from 'axios'
export default {
  name: "payments",
  props: ['userNHAddressData', 'currentBITPriceNum', 'userNHAddress'],
  data() {
    return {
      dataCollection: null,
      userData: {},
      paymentData: null,
      chartOptions: null,
      selectedAddr: null,
      dataLoaded: false
    }
  },
  beforeCreate() {
    this.$parent.getCurrentBITPrice()
  },
  mounted() {
    if (this.$store.state.selectedAddr != null) {
      this.getAddrPayments()
    } else {
      console.log("Select or add")
    }
  },
  methods: {
    // Todo Make the drop down to get the data when account is clicked
    getAddrPayments() {
      let testingAddr = this.$store.state.selectedAddr.addr
      axios.get('/api', {
          params: {
            method: 'stats.provider',
            addr: testingAddr
          }
        })
        .then(res => {
          this.dataLoaded = false
          this.paymentData = res.data.result.payments
          if (this.paymentData != null) {
            this.fillChartData(res.data.result.payments)
          }
          // Make function here to pass along data to other parts
        })
        .catch(err => {
          console.log(err)
        })
    },
    fillChartData(payData) {
      let dateData = []
      let amountData = []
      payData.forEach(element => {
        dateData.push(moment(element.time).format("MM Do YY"))
        amountData.push(element.amount)
      })

      this.userData.labels = dateData.reverse()
      this.userData.datasets = [{
        // Todo Think of a way to keep this
        label: this.$store.state.NHAddresses[0].name,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        data: amountData.reverse()
      }]

      this.dataLoaded = true
    }
  },
  components: {
    'bar-chart': barChart
  },
}