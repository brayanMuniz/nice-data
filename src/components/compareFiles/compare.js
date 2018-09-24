/*eslint-disable*/
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
export default {
    name: "compare",
    props: ['currentBITPriceNum'],
    data() {
        return {
            testData: null,
            userData: null,
            dataLoaded: false
        };
    },
    beforeCreate() {
        this.$parent.getCurrentBITPrice()
    },
    methods: {
        getaddrData() {
            let testingAddr = this.$store.state.NHAddresses[0].addr
            axios.get('/api', {
                    params: {
                        method: 'stats.provider.ex',
                        addr: testingAddr
                    }
                })
                .then(res => {
                    console.log(res.data.result)
                    let addrData = null
                    addrData = res.data.result
                    this.fillChartData(addrData)
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
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                data: workersAmount
            }]
            this.dataLoaded = true
        },
        testAddress() {
            axios.get('/api', {
                params: {
                    method: 'stats.provider.ex',
                    addr: "3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4"
                }
            }).
            then(res => {
                    console.log(res.data)
                    let totalCurrentProfit = 0
                    this.get24HourData(res.data.result.past)
                    for (let profit in res.data.result.current) {
                        totalCurrentProfit += Number(res.data.result.current[profit].profitability)
                    }

                    this.testData = totalCurrentProfit
                    console.log(totalCurrentProfit)

                })
                .catch(err => {
                    console.log(err)
                })
        },

        get24HourData(dataObject) {
            // Todo if it does not work send back err
            let dayHourData = []
            console.log(dataObject)
            let total = 0
            let testCount = 0
            // if you change let to var i will be defined outside of the scope

            dataObject.forEach(element => {
                console.log(element)
                element.data.forEach(algorithim => {
                    //  (Number(moment().subtract(1, 'h').format('X')))
                    if ((algorithim[0]) == 5122811) {
                        // if (Number(algorithim[1].a) == NaN) {
                        //     testCount += 1
                        // } else {
                        if (algorithim[1].a) {
                            total += Number(algorithim[1].a)
                        }

                    }
                    // }
                })

                dayHourData.push(total)
                total = 0
            })

            console.log((Number(moment().subtract(1, 'h').format('X'))))
            console.log(dayHourData)
            let hours = []

            for (let i = 0; i < 24; i++) {
                hours.push(String(i))
            }
            this.userData = {
                labels: hours,
                datasets: [{
                    label: 'Addr 2',
                    backgroundColor: '#4286f4',
                    data: dayHourData
                }]
            }

        }
    },
    created() {
        this.testAddress()
    },
    components: {
        "line-chart": lineChart
    },
};