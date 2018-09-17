/*eslint-disable*/
import axios from "axios";
// todo get rid of moment and share compo
import moment from 'moment'
import {
    Bar
} from "vue-chartjs";
export default {
    name: "barChart",
    extends: Bar,
    data() {
        return {
            datacollection: {
                // Fill Lables with dates part with dates
                // ! Reverse array from data
                labels: this.setChronologicalDates(),
                datasets: [{
                    // Todo userNHAddress should be addres
                    label: "Addr Payments",
                    backgroundColor: "#f87979",
                    data: this.setChronologicalPay()
                }]
            }
        };
    },
    props: ["data", "options", 'currentBITPriceNum', 'userNHAddress', 'userNHAddressData'],
    mounted() {
        //  The below code renders the graph
        this.renderChart(this.datacollection, {
            responsive: true,
            maintainAspectRatio: false
        });
    },
    methods: {
        // Todo data set correctly
        setChronologicalDates() {
            let copiedPayData = this.userNHAddressData.result.payments
            let chronologicalPayDataTimes = copiedPayData.reverse()
            console.log(chronologicalPayDataTimes)
            let dates = []
            for (let date in chronologicalPayDataTimes) {
                // dates.push(chronologicalPayData[date].time)
                dates.push(moment((chronologicalPayDataTimes[date].time)).format("MMM Do YY"))
            }
            console.log(dates)
            return dates
        },
        setChronologicalPay() {
            let copiedPayData = this.userNHAddressData.result.payments
            let chronologicalPayDataAmount = copiedPayData
            console.log(chronologicalPayDataAmount)
            let paymentData = []
            for (let date in chronologicalPayDataAmount) {
                // dates.push(chronologicalPayData[date].time)
                paymentData.push((chronologicalPayDataAmount[date].amount))
            }
            return paymentData
        },
        // resetBarData() {
        //     this.datacollection.labels = this.setChronologicalDates()
        //     this.datacollection.datasets[0].data = this.setChronologicalPay
        // }
    },
    watch: {
        userNHAddressData: function (val) {
            this.setChronologicalDates()
            this.setChronologicalPay()
            // this.resetBarData()
            this.renderChart(this.datacollection, {
                responsive: true,
                maintainAspectRatio: true
            });
        }
    },
    created() {
        console.log(this.userNHAddressData)
    },
}