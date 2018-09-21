/* eslint-disable */
// Todo obtain the toRelativeTime Component from landing to keep code DRY
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
      selectedAddr: null
    }
  },
  beforeCreate() {
    this.$parent.getCurrentBITPrice()
  },
  created() {},
  mounted() {
    this.getAddrPayments()
  },
  methods: {
    // ! For testing purposes I will use the one in the store so 
    // Todo Make the drop down to get the data when account is clicked
    getAddrPayments() {
      // Todo 
      // if($store.state.NHAddresses.length == 0) => put some stuff in
      if (this.selectedAddr == null) {
        console.log('Kek')
      } else {
        console.log("Set default data")
      }
      // let testingAddr = this.selectedAddrselectedAddr
      let testingAddr = this.$store.state.NHAddresses[0].addr
      axios.get('/api/nh', {
          params: {
            method: 'stats.provider',
            addr: testingAddr
          }
        })
        .then(res => {
          this.paymentData = res.data.result.payments
          console.log(this.paymentData)
          this.fillChartData()
          // Make function here to pass along data to other parts
        })
        .catch(err => {
          console.log(err)
        })
    },
    // ? There could be a global variable for if the user wants it in bitcoin or money boolean to be specific 
    // ? This will be its own component and it will emit its value to vuex and the rest of the components   
    fillChartData() {
      let dateData = []
      let amountData = []

      this.paymentData.forEach(element => {
        dateData.push(moment(element.time).format("MM Do YY"))
        amountData.push(element.amount)
      })

      this.userData.labels = dateData.reverse()
      this.userData.datasets = [{
        // Todo Think of a way to keep this
        label: this.$store.state.NHAddresses[0].name,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        data: amountData.reverse()
      }]
      this.userData.options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: true
      }
    }
  },
  components: {
    'bar-chart': barChart
  },
}