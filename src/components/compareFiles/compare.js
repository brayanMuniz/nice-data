/*eslint-disable*/
import axios from 'axios'
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
export default {
    name: "compare",
    props: ['userNHAddressData', 'currentBITPriceNum', 'userNHAddress'],
    data() {
        return {
            userData: null,
        };
    },
    methods: {
        toggleData() {
            this.userData = {
                labels: ["kek", 'topKek'],
                datasets: [{
                    label: 'Addr 1',
                    backgroundColor: '#f87979',
                    data: [(Math.floor(Math.random() * (50 - 5 + 1)) + 5), (Math.floor(Math.random() * (50 - 5 + 1)) + 5)]
                }]
            }
        },
        testAddress() {
            axios.get('api/nh', {
                params: {
                    method: 'stats.provider.ex',
                    addr: "3Ls4oRPWP3rxhPKsWgi4CYaK6E6c8HSekv"
                }
            }).
            then(res => {
                console.log(res.data)
                let totalCurrentProfit = 0
                for (let profit in res.data.result.current) {
                    totalCurrentProfit += Number(res.data.result.current[profit].profitability)
                }

                console.log(totalCurrentProfit)
            })
            .catch(err => {
                console.log(err)
            })
        },
    },
    created() {
        this.testAddress()
    },
    components: {
        "line-chart": lineChart
    },
};