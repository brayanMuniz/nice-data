/* eslint-disable */
import barChart from '../Charts/barChart/barChart.vue'
import moment from 'moment'
import axios from 'axios'
// ! Problems with this route
// ! I have to call the api at load
//  ! It might take a while for the api load 
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
    this.getAddrPayments()
  },
  methods: {
    // ! For testing purposes I will use the one in the store so 
    // Todo Make the drop down to get the data when account is clicked
    getAddrPayments() {
      // Todo 
      // if($store.state.NHAddresses.length == 0) => put some stuff in
      // if (this.selectedAddr == null) {
      //   console.log('Kek')
      // } else {
      //   console.log("Set default data")
      // }
      // let testingAddr = this.selectedAddrselectedAddr
      let testingAddr = this.$store.state.selectedAddr.addr
      axios.get('/api', {
          params: {
            method: 'stats.provider',
            addr: testingAddr
          }
        })
        .then(res => {
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