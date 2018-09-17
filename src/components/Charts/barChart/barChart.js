/*eslint-disable*/
import axios from "axios";
import {
    Bar
} from "vue-chartjs";
export default {
    name: "barChart",
    extends: Line,
    data() {
        return {
            generalAddressData: null,
            datacollection: {
                labels: ["January", "February"],
                datasets: [{
                    label: "Data One",
                    backgroundColor: "#f87979",
                    data: [40, 20, 30]
                }]
            }
        };
    },
    props: ["data", "options"],

    mounted() {
        // ! The below code renders the graph
        this.renderChart(this.datacollection, {
            responsive: true,
            maintainAspectRatio: false
        });
    },
    methods: {},
    created() {
    },
    props: ['currentBITPriceNum', 'userNHAddress']
}