/*eslint-disable*/
import {
    Doughnut,
    mixins
} from 'vue-chartjs'
const {
    reactiveProp
} = mixins

export default {
    name: "doNutChart",
    extends: Doughnut,
    mixins: [reactiveProp],
    props: ['currentBITPriceNum', 'userNHAddress', 'options'],
    data() {
        return {

        }
    },
    mounted() {
        this.makeChart()
    },
    methods: {
        makeChart() {
            this.renderChart(this.chartData, this.options)
        }
    },
    created() {},
}