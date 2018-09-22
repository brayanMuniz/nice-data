/*eslint-disable*/
// todo get rid of moment and share compo
import {
    Bar,
    mixins
} from "vue-chartjs";

const {
    reactiveProp
} = mixins

export default {
    name: "barChart",
    extends: Bar,
    mixins: [reactiveProp],
    props: ["options"],
    beforeMount() {},
    mounted() {
        this.renderChart(this.chartData)
    },
    methods: {},
    created() {},
}