/* eslint-disable */
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
import error from '../errorFiles/error.vue'

// Todo initially set it as week and the user can change it from there
export default {
  name: "dashboard",
  data() {
    return {
      // Todo configure your data better
      userData: {},
      dataLoaded: false,
      totalBalance: 0,
      error: false,
      selectedLength: null,
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },

      },
      profitAlgorithims: null,
      // Todo: Make selectedTime a store property 
      selectedTime: 288,
      // Also make time options a store property
      timeOptions: [{
          time: 'Hour',
          number: 1
        }, {
          time: '3 Hours',
          number: 12
        }, {
          time: 'Today',
          number: 7
        },
        {
          time: "Week",
          number: 144
        }
      ]
    };
  },
  beforeCreate() {
    this.$parent.getCurrentBITPrice()
  },
  // Todo it is not a good idea to watch it directly in the store Change it later
  mounted() {
    this.$store.watch(
      function (state) {
        return state.selectedAddr
      },
      // Need an arrow functionn so I can access all the methods that I have here in the file
      () => {
        // this.dataLoaded = false
        this.getProfitData()
      }
    );
  },
  created() {
    if (this.$store.state.selectedAddr != null) {
      this.getProfitData()
    } else {
      console.log("Select or add")
    }
  },
  computed: {
    totalProfitDollars() {
      return (this.totalBalance * this.$store.state.currentBITPriceNum).toFixed(2)
    },
    totalProfitBIT() {
      return this.totalBalance.toFixed(8)
    }
  },
  methods: {
    getProfitData() {
      axios.get('/api', {
          params: {
            method: 'stats.provider.ex',
            addr: this.$store.state.selectedAddr.addr
          }
        })
        .then(res => {
          this.totalBalance = this.summedProfit(res.data.result.current)
          this.profitAlgorithims = res.data.result.current
          this.userData = {
            datasets: [],
            labels: [],
          }
          this.fillChartData(res.data.result)
        })
        .catch(err => {
          this.error = true
          console.log(err)
        })
    },
    summedProfit(data) {
      let total = 0
      data.forEach(element => {
        total += Number(element.profitability)
      })
      return total
    },
    getCurrent(currentData) {
      let total = 0
      currentData.forEach(element => {
        total += Number(element.profitability)
      })
      return total
    },
    timeStamps(timeLength) {
      let timeStamps = []
      let i = 0

      while (i < timeLength) {
        // multiply by 5 because every block is 5 minutes so skip by 5 minutes
        timeStamps.push(moment().subtract((this.selectedTime * 5 * i), 'minutes').format('MM DD YYYY'))
        i += 1
      }
      return timeStamps.reverse()
    },
    // Todo: For the love of all that is code break this down into different methods
    fillChartData(profitData) {
      let selectedAddrTotalBalance = {
        name: this.$store.state.selectedAddr.name,
        balanceNumbers: null
      }
      let totalCalculatedProfits = []
      let totalBalance = {
        // ! I modified the mapping in store.js to create 34
        name: 34,
        balanceNumbers: []
      }

      profitData.past.forEach(element => {
        let calculatedProfits = {
          name: element.algo,
          balanceNumbers: []
        }
        // 7 day counter = 84
        // 48 hours = 24
        // Day = 288 ticks
        // 48 hours = 288 ticks * 2
        // Todo: Some of the time configuaration does not add up
        let counter = 0
        while (counter < element.data.length) {

          calculatedProfits.balanceNumbers.push(Number(element.data[counter][2]))
          counter += this.selectedTime
        }

        totalCalculatedProfits.push(calculatedProfits)
        calculatedProfits = []
      })
      // Todo round the totalso there arent a lot of decimals
      totalCalculatedProfits.forEach(element => {
        for (let i = 0; i < element.balanceNumbers.length; i++) {
          if (totalBalance.balanceNumbers[i] == undefined) {
            totalBalance.balanceNumbers[i] = 0
            totalBalance.balanceNumbers[i] += Number(element.balanceNumbers[i])
          }
          totalBalance.balanceNumbers[i] += Number(element.balanceNumbers[i])
        }
      })

      selectedAddrTotalBalance.balanceNumbers = totalBalance.balanceNumbers
      this.$store.commit('setSelectedAddrTotalBalance', selectedAddrTotalBalance)
      totalCalculatedProfits.push(totalBalance)

      this.userData.labels = this.timeStamps(totalCalculatedProfits[0].balanceNumbers.length)

      totalCalculatedProfits.forEach((element, index) => {
        this.userData.datasets.push({
          label: ((Object.values(this.$store.state.mappingAlgorithims)))[Number(element.name)],
          backgroundColor: this.$store.state.colors[index],
          borderColor: this.$store.state.borderColors[index],
          data: element.balanceNumbers,
          fill: false
          // Todo set all other options here
        })

      })
      this.dataLoaded = true
    },
  },
  components: {
    "line-chart": lineChart,
    "error": error

  },
};