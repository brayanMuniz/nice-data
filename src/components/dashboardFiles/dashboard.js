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
      dataRanges: {
        day: 0,
        week: 288
      },
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
    // ? if you call this.averageRateOfChange() the data will not load because it is async 
  },
  computed: {
    totalProfitDollars() {
      return (this.totalBalance * this.$store.state.currentBITPriceNum).toFixed(2)
    },
    totalProfitBIT() {
      return this.totalBalance.toFixed(8)
    }
  },
  // ? use this for crypto api calls https://min-api.cryptocompare.com/
  methods: {
    // Todo: Absract this and put it in the landing
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
    changeDateRange(newTime) {
      // Todo: set new time
      // save somewhere
      // temporary manipulated data
      // x-axis
      // y axis
      // dataloaded

      console.log(this.dataRanges[newTime])
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
    // Todo: timestamps should be pushed to vuex to avoid repeated code, Also, have it as a data property
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
      // let selectedAddrTotalBalance = {
      //   name: this.$store.state.selectedAddr.name,
      //   balanceNumbers: null
      // }
      let totalCalculatedProfits = []
      let totalBalance = {
        // ! I modified the mapping in store.js to create 100
        name: 35,
        balanceNumbers: []
      }
      profitData.past.forEach(element => {
        let calculatedProfits = {
          name: element.algo,
          balanceNumbers: []
        }
        // Todo: Some of the time configuaration does not add up
        let counter = 0
        while (counter < element.data.length) {
          calculatedProfits.balanceNumbers.push(Number(element.data[counter][2]))
          counter += this.selectedTime
        }

        totalCalculatedProfits.push(calculatedProfits)
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

      // selectedAddrTotalBalance.balanceNumbers = totalBalance.balanceNumbers
      // this.$store.commit('setSelectedAddrTotalBalance', selectedAddrTotalBalance)
      totalCalculatedProfits.push(totalBalance)
      this.userData.labels = this.timeStamps(totalCalculatedProfits[0].balanceNumbers.length)

      totalCalculatedProfits.forEach((element, index) => {
        if (element.name === 35) {
          this.userData.datasets.push({
            label: ((Object.values(this.$store.state.mappingAlgorithims)))[Number(element.name)],
            backgroundColor: 'rgb(0,0,0)',
            borderColor: "rgba(0, 0, 0, 1)",
            data: element.balanceNumbers,
            fill: false
            // Todo set all other options here
          })
        } else {
          this.userData.datasets.push({
            label: ((Object.values(this.$store.state.mappingAlgorithims)))[Number(element.name)],
            backgroundColor: this.$store.state.colors[index],
            borderColor: this.$store.state.borderColors[index],
            data: element.balanceNumbers,
            fill: false
            // Todo set all other options here
          })
        }
      })
      this.dataLoaded = true
    },
    averageRateOfChange() {
      // This was completely useless since they already gave me the profit per day but hey at least I did it
      this.userData.datasets.forEach(algorithim => {
        let highestNumber = 0;
        algorithim.data.forEach(data => {
          if (data > highestNumber) {
            highestNumber = data
          }
        })
        // bitcoin per n over the interval
        console.log((highestNumber - algorithim.data[0]).toFixed(8) / algorithim.data.indexOf(highestNumber))
      })
    }
  },
  components: {
    "line-chart": lineChart,
    "error": error

  },
};