// Todo https://apexcharts.com/javascript-chart-demos/mixed-charts/line-column-area/ 
import lineChart from '../Charts/lineChartFiles/lineChart.vue'
export default {
  name: "dashboard",
  data(){
    return {

    };
  },
  components: {
    "line-chart": lineChart
  },
  props: ['userNHAddressData', 'currentBITPriceNum']
};