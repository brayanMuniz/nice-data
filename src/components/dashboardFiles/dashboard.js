/* eslint-disable */
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
// Todo initially set it as week and the user can change it from there
export default {
  name: "dashboard",
  data() {
    return {
      userData: {},
      dataLoaded: false,
      selectedLength: null,
      chartOptions: {
        fill: false
      },
      profitAlgorithims: null,
      // Todo: Make selectedTime a store property 
      selectedTime: 288,
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
  mounted() {},
  created() {
    if (this.$store.state.selectedAddr != null) {
      this.getProfitData()
    } else {
      console.log("Select or add")
    }
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
          console.log(res.data)
          this.profitAlgorithims = res.data.result.current
          this.fillChartData(res.data.result)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCurrent(currentData) {
      let total = 0
      currentData.forEach(element => {
        console.log(Number(element.profitability))
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
      console.log(timeStamps.length)
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
      this.userData.datasets = []

      totalCalculatedProfits.forEach((element, index) => {
        let colors = [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ]
        let borderColors = [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ]

        this.userData.datasets.push({
          label: ((Object.values(this.$store.state.mappingAlgorithims)))[Number(element.name)],
          backgroundColor: colors[index],
          borderColor: borderColors[index],
          data: element.balanceNumbers,
          fill: false
          // Todo set all other options here
        })

      })
      this.dataLoaded = true
    }
  },
  components: {
    "line-chart": lineChart
  },
};