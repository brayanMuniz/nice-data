/* eslint-disable */
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
import error from '../errorFiles/error.vue'
import vueSlider from 'vue-slider-component'

// Todo initially set it as week and the user can change it from there
export default {
  name: "dashboard",
  data() {
    // Todo: userChosenBITvalue should be in the store or at least shared between components because used in compare
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
      userChosenBITValue: 1,
      sliderOptions: {
        max: 25000,
        interval: 100
      },
      summedBIT: 0,
      summedMoney: 0,
      userRigCost: null,
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
    },
    summedBITToUSD() {
      this.summedMoney = (this.summedBIT * this.userChosenBITValue).toFixed(2);
      return String((this.summedBIT * this.userChosenBITValue).toFixed(2));
    },
    daysToPayOff() {
      console.log(this.summedMoney)
      if (this.summedMoney == 0) {
        return "Not Mining"
      }
      return `${String((this.userRigCost / this.summedMoney).toFixed(0))} Days`
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
      let total = 0;
      data.forEach(element => {
        if (element.data[0].a === undefined) {
          total += 0
        } else {
          total += (Number(element.data[0].a) * Number(element.profitability))
        }
      })
      this.summedBIT = total.toFixed(8)
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
    fillChartData(profitData) {
      let totalCalculatedProfits = []
      let totalBalance = {
        // ! I modified the mapping in store.js to create 35
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
        let acceptedSpeeds = []
        while (counter < element.data.length) {
          // acceptedSpeeds.push()
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
      this.userChosenBITValue = this.$store.state.currentBITPriceNum
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
    },
    // ? Computed properties with parameters
    acceptedSpeed(speed, suffix) {
      return `${speed}/${suffix}`
    },
    profitBTCDay(speed, profitability, type) {
      if (speed == undefined) {
        return String(0)
      } else {
        if (type == "BTC")
          return String((Number(speed) * Number(profitability)).toFixed(8))
        else {
          return String(((Number(speed) * Number(profitability) * this.userChosenBITValue)).toFixed(2))
        }
      }
    },
  },
  components: {
    "line-chart": lineChart,
    "error": error,
    'vue-slider': vueSlider
  },
};