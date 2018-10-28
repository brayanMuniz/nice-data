/* eslint-disable */
// Todo: breaks if it was 2 hours ago etc
import barChart from '../Charts/barChart/barChart.vue'
import error from '../errorFiles/error.vue'
import moment from 'moment'
export default {
  name: "payments",
  props: ['userNHAddressData', 'currentBITPriceNum', 'userNHAddress'],
  data() {
    return {
      dataCollection: null,
      userData: {},
      paymentData: null,
      error: false,
      chartOptions: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero: false
            },
          }]
        },

      },
      selectedAddr: null,
      dataLoaded: false,
      latestTime: null
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
      // Todo: Watch the store for changes
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
    totalBIT() {
      let totalBIT = 0;
      this.paymentData.forEach(element => {
        totalBIT += Number(element.amount - element.fee)
      })
      return totalBIT.toFixed(6)
    },
    totalProfit() {
      let totalProfit = 0
      this.paymentData.forEach(element => {
        totalProfit += (Number(element.amount) - Number(element.fee))
      })
      return (totalProfit * this.$store.state.currentBITPriceNum).toFixed(2)
    },
    profitInterval() {
      return `${this.latestTime} days`
    }
  },
  methods: {
    // Todo Make the drop down to get the data when account is clicked
    // !This only returns past 7 payments
    getAddrPayments() {
      let pendingReq = this.$parent.getNHAddressData('stats.provider')
      pendingReq.then(res => {
        this.userData = {
          datasets: [],
          labels: [],
        }
        this.dataLoaded = false
        this.paymentData = res.data.result.payments
        if (this.paymentData != null) {
          this.fillChartData(res.data.result.payments)
        }
      }).catch(err => {
        this.error = true
        console.log(err)
      })
    },
    fillChartData(payData) {
      let dateData = []
      let amountData = []
      let feeData = []
      payData.forEach(element => {
        if(moment().diff(element.time, 'days') > this.latestTime) {
          this.latestTime = moment().diff(element.time, 'days')
        }
        dateData.push(moment(element.time).format("MM Do YY"))
        amountData.push(element.amount)
        feeData.push("-" + element.fee)
      })
      this.userData.labels = dateData.reverse()
      this.userData.datasets.push({
        label: "Amount",
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        data: amountData.reverse()
      })
      this.dataLoaded = true
    }
  },
  components: {
    'bar-chart': barChart,
    "error": error

  },
}