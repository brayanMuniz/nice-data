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
    props: ['options'],
    created() {
        console.log(this.options)
    },
    mounted() {
        this.renderChart(this.chartData, this.options)
    },

}