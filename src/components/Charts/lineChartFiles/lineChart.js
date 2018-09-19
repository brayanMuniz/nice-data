/*eslint-disable*/
import {
    Line,
    mixins
} from 'vue-chartjs'
const {
    reactiveProp
} = mixins

export default {
    name: "lineChart",
    extends: Line,
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
    created() {
        console.log(this.chartData)
    },
}