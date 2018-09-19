/*eslint-disable*/
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
                    label: '',
                    backgroundColor: '#f87979',
                    data: [(Math.floor(Math.random() * (50 - 5 + 1)) + 5), 3]
                }]
            }
            console.log(this.userData)
        }
    },
    components: {
        "line-chart": lineChart
    },
};