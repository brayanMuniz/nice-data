/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import lineChart from '../Charts/lineChartFiles/lineChart.vue';
import error from '../errorFiles/error.vue';
import vueSlider from 'vue-slider-component';
// Todo initially set it as week and the user can change it from there
export default {
	name: 'dashboard',
	data() {
		// Todo: userChosenBITvalue should be in the store or at least shared between components because used in compare
		return {
			// Todo configure your data better
			userData: {},
			dataRanges: {
				Today: 24,
				'5 days': 120,
				Week: 288
			},
			addrSavedData: null,
			dataLoaded: false,
			totalBalance: 0,
			error: false,
			chartOptions: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true
							}
						}
					]
				}
			},
			profitAlgorithims: null,
			// Todo: Make selectedTime a store property default is 288 for week
			selectedTime: 100,
			userChosenBITValue: 1,
			sliderOptions: {
				max: 30000,
				interval: 100
			},
			summedBIT: 0,
			summedMoney: 0,
			userRigCost: null,
			inYears: false
		};
	},
	beforeCreate() {
		this.$parent.getCurrentBITPrice();
	},
	// Todo it is not a good idea to watch it directly in the store Change it later
	mounted() {
		this.$store.watch(
			function(state) {
				return state.selectedAddr;
			},
			// Need an arrow functionn so I can access all the methods that I have here in the file
			() => {
				this.getProfitData();
			}
		);
	},
	async created() {
		if (this.$store.state.selectedAddr != null) {
			await this.getProfitData();
		}
		else {
			console.log('Select or add');
		}
	},
	methods: {
		changeDataPoints() {
			this.dataLoaded = false;
			this.userData = {
				datasets: [],
				labels: []
			};
			this.fillChartData(this.addrSavedData.data.result);
		},
		async getProfitData() {
			await axios
				.get('/api', {
					params: {
						method: 'stats.provider.ex',
						addr: this.$store.state.selectedAddr.addr
					}
				})
				.then((res) => {
					this.addrSavedData = res;
					this.totalBalance = this.summedBalance(res.data.result.current);
					this.profitAlgorithims = res.data.result.current;
					this.userData = {
						datasets: [],
						labels: []
					};
					this.fillChartData(res.data.result);
				})
				.catch((err) => {
					this.error = true;
					console.log(err);
				});
		},
		summedBalance(data) {
			let total = 0;
			data.forEach((element) => {
				if (element.data[0].a === undefined) {
					total += 0;
				}
				else {
					total += Number(element.data[0].a) * Number(element.profitability);
				}
			});
			this.summedBIT = total.toFixed(8);
			return total;
		},
		makeTimeStamps(timeLength) {
			let timeStamps = [];
			for (let i = 0; i < timeLength; i++) {
				timeStamps.push(moment().subtract(this.selectedTime * 5 * i, 'minutes').format('MM Do h A'));
			}
			let inOrder = timeStamps.reverse();
			return inOrder;
		},
		getTotalCalculatedProfits(profitData) {
			let totalCalculatedProfits = [];
			let longestUnits = 0;
			profitData.past.forEach((element) => {
				if (element.data.length > longestUnits) {
					longestUnits = element.data.length;
				}
			});
			// Cycle through each past and get the points you want
			profitData.past.forEach((element) => {
				element.data.reverse();
				let calculatedProfits = {
					name: element.algo,
					balanceNumbers: []
				};

				if (element.data.length == 0) {
					for (let i = 0; i < longestUnits; i += this.selectedTime) {
						calculatedProfits.balanceNumbers.push(0);
					}
				}
				else {
					let currentUnpaid = 0;
					for (let i = 0; i < longestUnits; i += this.selectedTime) {
						if (element.data[i] === undefined) {
							calculatedProfits.balanceNumbers.push(currentUnpaid);
						}
						else {
							if (Number(element.data[i][2]) > currentUnpaid) {
								currentUnpaid = Number(element.data[i][2]);
							}
							calculatedProfits.balanceNumbers.push(Number(element.data[i][2]));
						}
					}
				}
				totalCalculatedProfits.push(calculatedProfits);
			});
			totalCalculatedProfits.push(this.getTotalBalance(totalCalculatedProfits));
			totalCalculatedProfits.forEach((element) => {
				element.balanceNumbers.reverse();
			});
			return totalCalculatedProfits;
		},
		getTotalBalance(totalCalculatedProfits) {
			let totalBalance = {
				name: Number(Object.keys(this.$store.state.mappingAlgorithims).length - 1),
				balanceNumbers: []
			};
			for (let i = 0; i < totalCalculatedProfits[0].balanceNumbers.length; i++) {
				totalBalance.balanceNumbers[i] = 0;
			}
			totalCalculatedProfits.forEach((element) => {
				element.balanceNumbers.forEach((number, index) => {
					totalBalance.balanceNumbers[index] += number;
				});
			});
			return totalBalance;
		},
		fillChartData(profitData) {
			let totalCalculatedProfits = this.getTotalCalculatedProfits(profitData);
			this.userData.labels = this.makeTimeStamps(
				totalCalculatedProfits[totalCalculatedProfits.length - 1].balanceNumbers.length
			);
			totalCalculatedProfits.forEach((element, index) => {
				if (element.name === Number(Object.keys(this.$store.state.mappingAlgorithims).length - 1)) {
					this.userData.datasets.push({
						label: Object.values(this.$store.state.mappingAlgorithims)[Number(element.name)],
						backgroundColor: 'rgb(0,0,0)',
						borderColor: 'rgba(0, 0, 0, 1)',
						data: element.balanceNumbers,
						fill: false
						// Todo set all other options here
					});
				}
				else {
					this.userData.datasets.push({
						label: Object.values(this.$store.state.mappingAlgorithims)[Number(element.name)],
						backgroundColor: this.$store.state.colors[index],
						borderColor: this.$store.state.borderColors[index],
						data: element.balanceNumbers,
						fill: false
					});
				}
			});
			this.userChosenBITValue = this.$store.state.currentBITPriceNum;
			this.dataLoaded = true;
			this.err = false;
		},
		// *** Computed properties with parameters
		acceptedSpeed(speed, suffix) {
			return `${speed}/${suffix}`;
		},
		profitBTCDay(speed, profitability, type) {
			if (speed == undefined) {
				return String(0);
			}
			else {
				if (type == 'BTC') return String((Number(speed) * Number(profitability)).toFixed(8));
				else {
					return String((Number(speed) * Number(profitability) * this.userChosenBITValue).toFixed(2));
				}
			}
		}
	},
	computed: {
		totalProfitDollars() {
			return (this.totalBalance * this.$store.state.currentBITPriceNum).toFixed(2);
		},
		totalProfitBIT() {
			return this.totalBalance.toFixed(8);
		},
		summedBITToUSD() {
			this.summedMoney = (this.summedBIT * this.userChosenBITValue).toFixed(2);
			return String((this.summedBIT * this.userChosenBITValue).toFixed(2));
		},
		daysToPayOff() {
			if (this.summedMoney == 0) {
				return 'Not Mining';
			}
			if (this.inYears) {
				return `${String((this.userRigCost / this.summedMoney / 365).toFixed(2))} Years`;
			}
			else {
				return `${String((this.userRigCost / this.summedMoney).toFixed(0))} Days`;
			}
		},
		totalUnpaidBalance() {
			let totalUnpaid = 0;
			for (let i in this.profitAlgorithims) {
				totalUnpaid += Number(this.profitAlgorithims[i].data[1]);
			}
			return totalUnpaid.toFixed(8);
		}
	},
	components: {
		'line-chart': lineChart,
		error: error,
		'vue-slider': vueSlider
	}
};
