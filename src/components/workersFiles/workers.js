/*eslint-disable*/
import doNut from "../Charts/doNutFiles/doNut.vue"
import axios from 'axios'
export default {
  name: "workers",
  props: ['currentBITPriceNum', ],
  data() {
    return {
      userData: {},
      workersData: null,
      dataLoaded: false
    }
  },
  created() {
    this.getWorkerData()
  },
  beforeCreate() {
    this.$parent.getCurrentBITPrice()
  },
  mounted() {},
  methods: {
    getWorkerData() {
      let testingAddr = "3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4"
      axios.get('/api/nh', {
          params: {
            method: 'stats.provider.workers',
            addr: testingAddr
          }
        })
        .then(res => {
          console.log(res.data.result)
          this.workersData = res.data.result
          this.fillChartData()
          // Make function here to pass along data to other parts
        })
        .catch(err => {
          console.log(err)
        })
    },
    fillChartData() {
      let workersName = []
      let workersAmount = []

      this.workersData.workers.forEach(element => {
        // Todo Make an if statement if it is undefined
        workersName.push(element[0])
        // !sometimes it will undefined

        workersAmount.push(Number(element[1].a))
      })

      this.userData.labels = workersName
      this.userData.datasets = [{
        // ! For TESTING
        label: 'thing',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        data: workersAmount
      }]
      this.dataLoaded = true
    }
  },
  components: {
    "do-nut": doNut
  },
};