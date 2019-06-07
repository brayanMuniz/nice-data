/*eslint-disable*/
import doNut from '../Charts/doNutFiles/doNut.vue';
import error from '../errorFiles/error.vue';
import axios from 'axios';
export default {
	name: 'workers',
	data() {
		return {
			userData: {},
			error: false,
			workersData: null,
			dataLoaded: false
		};
	},
	async created() {
		await this.getWorkerData();
	},
	beforeCreate() {
		this.$parent.getCurrentBITPrice();
	},
	mounted() {
		this.$store.watch(
			function(state) {
				return state.selectedAddr;
			},
			() => {
				this.getWorkerData();
			}
		);
	},
	methods: {
		async getWorkerData() {
			await axios
				.get('/api', {
					params: {
						method: 'stats.provider.workers',
						addr: this.$store.getters.getCurrentSelectedAddr.addr
					}
				})
				.then((res) => {
					this.userData = {
						datasets: [],
						labels: []
					};
					this.workersData = res.data.result;
					console.log('TCL: getWorkerData -> res.data.result', res.data.result);
					this.fillChartData();
				})
				.catch((err) => {
					this.error = true;
					console.log(err);
				});
		},
		fillChartData() {
			let workersName = [];
			let workersAmount = [];

			this.workersData.workers.forEach((element) => {
				workersName.push(element[0]);
				workersAmount.push(Number(element[1].a));
			});
			this.userData.labels = workersName;
			this.userData.datasets = [
				{
					label: 'thing',
					backgroundColor: this.$store.state.colors,
					data: workersAmount
				}
			];
			this.dataLoaded = true;
		},
		mapAlgorithim(algo) {
			return Object.values(this.$store.state.mappingAlgorithims)[algo];
		}
	},
	components: {
		'do-nut': doNut,
		error: error
	}
};
