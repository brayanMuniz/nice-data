/*eslint-disable*/
// todo get rid of moment and share compo
import moment from 'moment'
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
    props: ["data", "options"],
    data() {
        return {};
    },
    mounted() {
        // this.chartData is created in the mixin.
        // If you want to pass options please create a local options object
        this.renderChart(this.chartData, this.options)
    },
    methods: {},
    created() {},
}