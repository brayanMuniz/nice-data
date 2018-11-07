/*eslint-disable*/
// Todo Make a mixin to not repeat code or store components in store.js
// Todo import methods from somewhere
// Todo: The preffered algorithim should be changed to most profitable algorithim
// Todo: 
import axios from 'axios'
import moment from "moment";
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
import error from '../errorFiles/error.vue'
import vueSlider from 'vue-slider-component'


export default {
    name: "compare",
    props: ['currentBITPriceNum'],
    components: {
        "line-chart": lineChart,
        "error": error,
        'vue-slider': vueSlider
    },
    data() {
        return {
            addrsBalanceData: [],
            userData: {},
            dataLoaded: false,
            dataLoadedWorkers: false,
            error: false,
            dataLoadedCounter: 0,
            // Todo: Make selectedTime a store property because if you call it from dashboard with a different time it will break it 
            selectedTime: 100,
            chartOptions: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },

            },
            addrProperties: [],
            addrsData: [],
            userChosenBITValue: 1,
            sliderOptions: {
                max: 25000,
                interval: 100
            },
            options: {
                balance: 'stats.provider.ex',
                workers: 'stats.provider.workers',
                payments: 'stats.provider'
            },
            selectedType: 'stats.provider.ex'
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
    },
    methods: {
        cycleSelectedAddrs() {
            this.userData = {
                datasets: [],
                labels: null,
            }
            for (let addr in this.$store.state.NHAddresses) {
                this.getAddrData(this.$store.state.NHAddresses[addr].addr).then(res => {
                    this.addrsData.push(res.data)
                    let addrData = this.getTotalBalance(res.data.result, this.$store.state.NHAddresses[addr].name)
                    this.addUserData(addrData, addr)
                    this.dataLoadedCounter++
                    if (this.dataLoadedCounter === this.$store.state.NHAddresses.length) {
                        this.userChosenBITValue = this.$store.state.currentBITPriceNum
                        console.log(this.userData.datasets)
                        this.userData.labels = this.timeStamps(this.userData.datasets[0].data.length)
                        this.dataLoaded = true;
                    }
                }).catch(err => {
                    this.error = true
                    console.log(err)
                })
            }
            // this.$store.state.NHAddresses.forEach(function (address) {
            //     this.getAddrData(address.addr).then(res => {
            //         this.addrsData.push(res.data)
            //         let addrData = this.getTotalBalance(res.data.result, address.name)
            //         this.addUserData(addrData, addr)
            //         this.dataLoadedCounter++
            //         if (this.dataLoadedCounter === this.$store.state.NHAddresses.length) {
            //             this.userChosenBITValue = this.$store.state.currentBITPriceNum
            //             this.dataLoaded = true;
            //         }
            //     }).catch(err => {
            //         this.error = true
            //         console.log(err)
            //     })
            // })
            // ? Two very valuable lessons here
            // Vue has its own type of scoping and it is better to use a global data parameter if you are using axios and promises
            // Todo learn how to properly determine what is read first and how to work around that
        },
        addUserData(dataCount, counter) {
            this.userData.datasets.push({
                label: dataCount.name,
                data: dataCount.balanceNumbers.reverse(),
                backgroundColor: this.$store.state.colors[counter],
                borderColor: this.$store.state.borderColors[counter],
                fill: false,
            })
        },
        getAddrData(selectedAddr) {
            return axios.get('/api', {
                params: {
                    method: this.selectedType,
                    addr: selectedAddr
                }
            })
        },
        timeStamps(timeLength) {
            let timeStamps = []
            for (let i = 0; i < timeLength; i++) {
                timeStamps.push(moment().subtract((this.selectedTime * 5 * i), 'minutes').format('MM Do h A'))
            }
            // let i = 0
            // while (i < timeLength) {
            //     // multiply by 5 because every block is 5 minutes so skip by 5 minutes
            //     timeStamps.push(moment().subtract((this.selectedTime * 5 * i), 'minutes').format('MM DD YYYY'))
            //     i += 1
            // }
            let inOrder = timeStamps.reverse()
            // inOrder.push("Now")
            return inOrder
        },
        getTotalBalance(addrData, addrName) {

            let totalCalculatedProfits = []
            let totalBalance = {
                name: addrName,
                balanceNumbers: []
            }

            addrData.past.forEach(element => {
                element.data.reverse()
                let calculatedProfits = {
                    name: element.algo,
                    balanceNumbers: []
                }

                let counter = 0
                while (counter < element.data.length) {
                    if (element.data[counter] === undefined) {
                        calculatedProfits.balanceNumbers.push(Number(0))
                        counter += this.selectedTime
                    } else {
                        calculatedProfits.balanceNumbers.push(Number(element.data[counter][2]))
                        counter += this.selectedTime
                    }
                }

                if (element.data.length === 0) {
                    calculatedProfits.balanceNumbers.push(0)
                } else {
                    calculatedProfits.balanceNumbers.push((Number((element.data[element.data.length - 1])[2])).toFixed(8))
                }
                totalCalculatedProfits.push(calculatedProfits)
            })
            for (let i = 0; i < totalCalculatedProfits[0].balanceNumbers.length - 1; i++) {
                totalBalance.balanceNumbers[i] = 0
            }
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
            // console.log(totalBalance.balanceNumbers.reverse())
            return totalBalance
        },
        matchAddrToName(addr) {
            for (let address in this.$store.state.NHAddresses) {
                if (this.$store.state.NHAddresses[address].addr === addr) {
                    return this.$store.state.NHAddresses[address].name
                }
            }
        },
        // Todo: Put this in landing to keep DRY
        summedProfit(data, currency) {
            let total = 0
            data.forEach(algo => {
                if (algo.data[0].a == undefined) {
                    total += 0;
                } else {
                    total += (Number(algo.profitability) * Number(algo.data[0].a))
                }
            })
            if (currency === "BIT") {
                if (total == 0) {
                    return String(0)
                }
                return total.toFixed(8)
            }
            return (total * this.userChosenBITValue).toFixed(2)
        },
        prefereredAlgorithim(data) {
            let top = 0
            let mostProfit = "Not Mining"

            function getSum(speed, profitability) {
                if (speed == undefined) {
                    return 0
                }
                return ((Number(speed) * Number(profitability)))

            }

            data.forEach(algo => {
                if (getSum(algo.data[0].a, algo.profitability) > top)
                    mostProfit = algo.name
            })

            return mostProfit
        },
        totalBalance(data) {
            let total = 0
            data.result.current.forEach(element => {
                total += Number(element.data[1])
            })
            return total.toFixed(5)
        }
    },
};