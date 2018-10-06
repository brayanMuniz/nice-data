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
        };
    },
    beforeCreate() {
        this.$parent.getCurrentBITPrice()
    },
    created() {
        this.cycleSelectedAddrs()
    },
    methods: {
        cycleSelectedAddrs() {
            if (this.$store.state.selectedAddrTotalBalance != null) {
                // Todo Make an if statement to see if selected is not null then append that to addrsBalanceData
                for (let i = 0; i < this.$store.state.NHAddresses.length; i++) {
                    if (this.$store.state.NHAddresses[i].name == this.$store.state.selectedAddrTotalBalance.name) {
                        this.totalBalanceAddrs.push(this.$store.state.selectedAddrTotalBalance)
                    } else {
                        this.getProfitData(this.$store.state.NHAddresses[i].addr, this.$store.state.NHAddresses[i].name)

                    }
                }
            } else {
                console.log("add Addr")
            }
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
                // Todo: get this and put it in totalBalance
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

            this.totalBalanceAddrs.push(totalBalance)
            console.log(this.totalBalanceAddrs)

            this.fillChartData()

        },
        // Todo: For the love of all that is code break this down into different methods
        fillChartData(profitData) {
            // ? You could put them in the store
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
            this.userData.labels = this.timeStamps(7)
            this.userData.datasets = []
            this.totalBalanceAddrs.forEach((element, index) => {
                this.userData.datasets.push({
                    label: element.name,
                    backgroundColor: colors[index],
                    borderColor: borderColors[index],
                    data: element.balanceNumbers,
                    fill: false

                })
            })
            this.dataLoaded = true
        }
    },
};