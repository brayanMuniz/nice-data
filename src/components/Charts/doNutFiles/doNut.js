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
    props: ['options'],
    mounted() {
        this.renderChart(this.chartData, this.options)
    },
}