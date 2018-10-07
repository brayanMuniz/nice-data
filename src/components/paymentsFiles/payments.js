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
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },

      },
      selectedAddr: null,
      dataLoaded: false
    }
  },
  beforeCreate() {
    this.$parent.getCurrentBITPrice()
  },
  mounted() {
    this.$store.watch(
      function (state) {
        return state.selectedAddr
      },
      // Need an arrow functionn so I can access all the methods that I have here in the file
      () => {
        // this.dataLoaded = false
        this.getAddrPayments()
      }
    );
    if (this.$store.state.selectedAddr != null) {
      this.getAddrPayments()
    } else {
      console.log("Select or add")
    }
  },
  computed: {
    totalAmount() {
      let totalAmount = 0
      this.paymentData.forEach(element => {
        totalAmount += Number(element.amount)
      })
      return totalAmount.toFixed(6)
    },
    totalFees() {
      let totalFees = 0

      this.paymentData.forEach(element => {
        totalFees += Number(element.fee)
      })

      return totalFees.toFixed(6)
    },
    totalProfit() {
      let totalProfit = 0
      this.paymentData.forEach(element => {
        totalProfit += (Number(element.amount) - Number(element.fee))
      })
      return (totalProfit * this.$store.state.currentBITPriceNum).toFixed(2)
    }
  },
  methods: {
    // Todo Make the drop down to get the data when account is clicked
    // !This only returns past 7 payments
    getAddrPayments() {
      axios.get('/api', {
          params: {
            method: 'stats.provider',
            addr: this.$store.state.selectedAddr.addr
          }
        })
        .then(res => {
          this.userData = {
            datasets: [],
            labels: [],
          }
          this.dataLoaded = false
          this.paymentData = res.data.result.payments
          console.log(res.data)
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
        label: this.$store.state.selectedAddr.name,
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