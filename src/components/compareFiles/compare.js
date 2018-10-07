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
            totalBalanceAddrs: [],
            addrsBalanceData: [],
            userData: {},
            dataLoaded: false,
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
                
            }
        };
    },
    beforeCreate() {
        this.$parent.getCurrentBITPrice()
    },
    created() {
        if (this.$store.state.NHAddresses.length != 0) {
            this.cycleSelectedAddrs()
        } else {
            console.log("Alet the user")
        }
    },
    mounted() {
        // Todo: I need to put a watch on just when an addr is removed or added
        this.$store.watch(
            function (state) {
                return state.selectedAddr
            },
            // Need an arrow functionn so I can access all the methods that I have here in the file
            () => {
                // this.dataLoaded = false
                this.cycleSelectedAddrs()
                this.dataLoaded = true
            }
        );
    },
    methods: {
        cycleSelectedAddrs() {
            this.userData = {
                datasets: [],
                labels: [],
            }
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
            let counter = 0
            if (this.$store.state.NHAddresses.length === 0) {
                // Todo
                console.log('Make an alert')
            }

            if (this.$store.state.selectedAddrTotalBalance != null) {
                // Todo Make an if statement to see if selected is not null then append that to addrsBalanceData
                for (let i = 0; i < this.$store.state.NHAddresses.length; i++) {
                    if (this.$store.state.NHAddresses[i].name == this.$store.state.selectedAddrTotalBalance.name) {
                        let selectedAddr = this.$store.state.selectedAddrTotalBalance
                        this.userData.datasets.push({
                            label: selectedAddr.name,
                            data: selectedAddr.balanceNumbers,
                            backgroundColor: colors[i],
                            borderColor: borderColors[i],
                            fill: false,
                        })

                    } else {
                        this.getAddrData(this.$store.state.NHAddresses[i].addr).then(res => {
                            let addrdata = this.getTotalBalance(res.data.result, this.$store.state.NHAddresses[i].name)
                            this.userData.datasets.push({
                                label: addrdata.name,
                                data: addrdata.balanceNumbers,
                                backgroundColor: colors[i],
                                borderColor: borderColors[i],
                                fill: false,
                            })
                            counter += i
                            if (counter == this.$store.state.NHAddresses.length) {
                                this.dataLoaded = true
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
                this.userData.labels = this.timeStamps(7)

            } else {
                for (let i = 0; i < this.$store.state.NHAddresses.length; i++) {
                    this.getAddrData(this.$store.state.NHAddresses[i].addr).then(res => {
                        let addrdata = this.getTotalBalance(res.data.result, this.$store.state.NHAddresses[i].name)
                        this.userData.datasets.push({
                            label: addrdata.name,
                            data: addrdata.balanceNumbers,
                            backgroundColor: colors[i],
                            borderColor: borderColors[i],
                            fill: false,
                        })
                        counter += i
                        if (counter == this.$store.state.NHAddresses.length) {
                            this.dataLoaded = true
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
                this.userData.labels = this.timeStamps(7)
            }
        },
        getAddrData(selectedAddr) {
            return axios.get('/api', {
                params: {
                    method: 'stats.provider.ex',
                    addr: selectedAddr
                }
            })
        },
        getProfitData(selectedAddr, selectedAddrName) {
            axios.get('/api', {
                    params: {
                        method: 'stats.provider.ex',
                        addr: selectedAddr
                    }
                })
                .then(res => {
                    console.log(res.data.result)
                    this.getTotalBalance(res.data.result, selectedAddrName)
                })
                .catch(err => {
                    console.log(err)
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
            console.log(totalBalance)
            this.totalBalanceAddrs.push(totalBalance)
            return totalBalance
        },
    },
};