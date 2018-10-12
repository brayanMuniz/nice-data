/*eslint-disable*/
import doNut from "../Charts/doNutFiles/doNut.vue"
import axios from 'axios'
export default {
  name: "workers",
  props: ['currentBITPriceNum'],
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
  mounted() {
    this.$store.watch(
      function (state) {
        return state.selectedAddr
      },
      // Need an arrow functionn so I can access all the methods that I have here in the file
      () => {
        // this.dataLoaded = false
        this.getWorkerData()
      }
    )
  },
  methods: {
    getWorkerData() {
      axios.get('/api', {
          params: {
            method: 'stats.provider.workers',
            addr: this.$store.state.selectedAddr.addr
          }
        })
        .then(res => {
          this.userData = {
            datasets: [],
            labels: [],
          }
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
        workersAmount.push(Number(element[1].a))
      })

      this.userData.labels = workersName
      this.userData.datasets = [{
        // ! For TESTING
        label: 'thing',
        backgroundColor: this.$store.state.colors,
        data: workersAmount
      }]
      this.dataLoaded = true
    }
  },
  components: {
    "do-nut": doNut
  },
};