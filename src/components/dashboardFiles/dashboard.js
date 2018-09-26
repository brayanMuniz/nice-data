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
      selectedTime: 144,
      timeOptions: {
        hour: ['1 Hour', 1],
        threeHours: ['3 Hours', 12],
        today: ['Today', 12],
        sevenDays: ['7 Days', 144]
      }
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
    timeStamps(timeLength) {
      let timeStamps = []
      // If its a week get it to 14 data points, 12 hours each
      if (timeLength == "week") {
        for (let i = 12; i < 84; i += 12) {
          timeStamps.push(moment().subtract(i, 'h').format('DD HH'))
        }
        return timeStamps
      } else(timeLength == '')
      // ! This is how it should be 
      // for(let i = 0; i < something; i+= timeLength)
      // Todo Then make it like that
    },
    fillChartData(profitData) {
      let totalCalculatedProfits = []

      profitData.past.forEach(element => {
        let calculatedProfits = {
          name: element.algo,
          balanceNumbers: []
        }

        let counter = this.selectedTime
        // ! SKIP BY 144 GET HALF A DAY
        // ! SKIP BY 12 = GET THE HOUR
        while (counter < 2016) {
          calculatedProfits.balanceNumbers.push(Number(element.data[counter][2]))
          counter += this.selectedTime
        }

        totalCalculatedProfits.push(calculatedProfits)
        calculatedProfits = []
      })

      // seperate into WEEK, Days, Day, Half Day
      // Todo This will be have to be the time depending on length

      this.userData.labels = this.timeStamps('week')

      // ! At least 5 object with each algorithim 
      // Todo loop through this.userData.dataSets and push objects in there
      // Todo also change the coolors \ randomize it
      this.userData.datasets = []
      // Todo Change the number configuration to their actual names

      console.log((Object.values(this.$store.state.mappingAlgorithims)))

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
        })

      })

      this.dataLoaded = true
    }
  },

  components: {
    "line-chart": lineChart
  },
};