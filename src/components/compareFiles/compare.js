/*eslint-disable*/
// Todo fix that transition break
// Todo Make a mixin to not repeat code or store components in store.js
// Todo import methods from somewhere
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
export default {
    name: "compare",
    props: ['currentBITPriceNum'],
    components: {
        "line-chart": lineChart
    },
    data() {
        return {
            addrsBalanceData: [],
            userData: {},
            dataLoaded: false,
            dataLoadedCounter: 0,
            // Todo: Make selectedTime a store property because if you call it from dashboard with a different time it will break it 
            selectedTime: 288,
            chartOptions: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },

            },
            addrProperties: []
        };
    },
    beforeCreate() {
        this.$parent.getCurrentBITPrice()
    },
    created() {
        this.dataLoaded = false;
    },
    mounted() {
        this.dataLoaded = false;
        this.cycleSelectedAddrs();
        console.log(this.dataLoaded)
    },
    methods: {
        cycleSelectedAddrs() {
            this.userData = {
                datasets: [],
                labels: this.timeStamps(7),
            }
            for (let addr in this.$store.state.NHAddresses) {
                this.getAddrData(this.$store.state.NHAddresses[addr].addr).then(res => {
                    let addrData = this.getTotalBalance(res.data.result, this.$store.state.NHAddresses[addr].name)
                    console.log(addrData)
                    this.addUserData(addrData, addr)
                    this.dataLoadedCounter++
                    console.log(this.dataLoadedCounter)
                    if (this.dataLoadedCounter === this.$store.state.NHAddresses.length) {
                        this.dataLoaded = true;
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
            // ? Two very valuable lessons here
            // Vue has its own type of scoping and it is better to use a global data parameter if you are using axios and promises
            // Todo learn how to properly determine what is read first and how to work around that
        },
        addUserData(dataCount, counter) {
            this.userData.datasets.push({
                label: dataCount.name,
                data: dataCount.balanceNumbers,
                backgroundColor: this.$store.state.colors[counter],
                borderColor: this.$store.state.borderColors[counter],
                fill: false,
            })
        },
        getAddrData(selectedAddr) {
            return axios.get('/api', {
                params: {
                    method: 'stats.provider.ex',
                    addr: selectedAddr
                }
            })
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
        getTotalBalance(addrData, addrName) {

            let totalCalculatedProfits = []
            let totalBalance = {
                name: addrName,
                balanceNumbers: []
            }

            addrData.past.forEach(element => {
                let calculatedProfits = {
                    name: element.algo,
                    balanceNumbers: []
                }

                let counter = 0
                while (counter < element.data.length) {
                    calculatedProfits.balanceNumbers.push(Number(element.data[counter][2]))
                    counter += this.selectedTime
                }

                totalCalculatedProfits.push(calculatedProfits)
                calculatedProfits = []
            })

            totalCalculatedProfits.forEach(element => {
                for (let i = 0; i < element.balanceNumbers.length; i++) {
                    if (totalBalance.balanceNumbers[i] == undefined) {
                        totalBalance.balanceNumbers[i] = 0
                        totalBalance.balanceNumbers[i] += Number(element.balanceNumbers[i])
                    }
                    totalBalance.balanceNumbers[i] += Number(element.balanceNumbers[i])
                }
            })

            return totalBalance
        }
    },
};