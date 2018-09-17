/*eslint-disable*/
import axios from "axios";
import {
    Line
} from "vue-chartjs";
export default {
    name: "lineChart",
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
    methods: {
        // Todo for testing when address is changed reload workers.vue
        // Todo send these to vuex after done
        getAddressWorkerData() {
            axios.get('/api/nh', {
                    params: {
                        method: 'stats.provider.workers',
                        addr: this.userNHAddress,
                        // algo: 1 // Todo Adjust this for when user clicks on one algorithim
                    }
                })
                .then(res => {
                    this.userNHAddressWorkerData = res.data
                    console.log(this.userNHAddressWorkerData)
                    console.log(this.userNHAddressWorkerData.result.workers[0][0])
                    this.datacollection.labels[0] = this.userNHAddressWorkerData.result.workers[0][0]
                    // console.log(this.datacollection.labels[0])
                    this.renderChart(this.datacollection, {
                        responsive: true,
                        maintainAspectRatio: false
                    });
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getGeneralAddressData() {
            axios.get('/api/nh', {
                    params: {
                        method: 'stats.provider.ex',
                        addr: this.userNHAddress
                    }
                })
                .then(res => {
                    // Todo IF incorrect address give back error
                    // if (res.data.data.result.error) {
                    //   this.userNHAddressData = res
                    // } else {

                    // }
                    this.generalAddressData = res.data
                    console.log(this.generalAddressData)

                    // this.$store.commit('addNHAddress')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    created() {
        this.getAddressWorkerData()
        console.log("From linechart")
    },
    props: ['currentBITPriceNum', 'userNHAddress']
}