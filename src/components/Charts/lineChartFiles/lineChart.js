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
    mounted() {
        this.renderChart(this.chartData, {
            fill: false
        })
    },

}