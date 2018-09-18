/*eslint-disable*/ 
import axios from 'axios'
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
export default {
    name: "compare",
    data() {
        return {

        };
    },
    methods() {

    },
    components: {
        "line-chart": lineChart
    },
    props: ['userNHAddressData', 'currentBITPriceNum', 'userNHAddress']
};