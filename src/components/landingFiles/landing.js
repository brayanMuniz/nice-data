/* eslint-disable */
import moment from 'moment'
import axios from 'axios'
import asideNav from '../asideNavFiles/asideNav.vue'
// Testing addressed 
let testAddress1 = "3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4" // B
let testAddress2 = "3JuqAiWuAma26iYvKjzGCTEHq6A8R4ZusZ" // E
let testAddress3 = "3Ls4oRPWP3rxhPKsWgi4CYaK6E6c8HSekv" // J
export default {
  name: 'landing',
  data() {
    return {
      userNHAddress: null,
      example: null,
      userNHAddressData: null,
      totalFee: null,
      // make next line added to vuex
      currentBITPriceSee: null,
      currentBITPriceNum: null
    };
  },
  created() {
    this.getCurrentBITPrice()
  },
  methods: {
    // Todo Configure this one with parameters
    getNHAddressData() {
      axios.get('/api/nh/address', {
          params: {
            userNHAddress: this.userNHAddress
          }
        })
        .then(res => {
          // Todo IF incorrect address give back error
          // if (res.data.data.result.error) {
          //   this.userNHAddressData = res
          // } else {

          // }
          this.userNHAddressData = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCurrentBITPrice() {
      let currentPriceURL = "https://api.coindesk.com/v1/bpi/currentprice.json"
      axios.get(currentPriceURL)
        .then(response => {
          this.currentBITPriceSee = response.data.bpi.USD.rate
          this.currentBITPriceNum = response.data.bpi.USD.rate_float
          this.$store.commit('setCurrentBITPrice', response.data.bpi.USD.rate_float)
        })
        .catch(err => {
          console.log(err)
        })
    },
    toRelativeTime(time) {
      return moment(time).fromNow()
    },
    toggleCurrency(currency) {
      return currency * this.currentBITPrice
    },
    sumOfFee() {

    },
    sumOfPayAmount() {
      let totalPay = 0
      for (let payment in this.userNHAddressData.result.payments) {
        totalPay += Number(this.userNHAddressData.result.payments[payment].amount)
      }
      console.log(`${totalPay} is totalPay`)
      console.log(this.currentBITPriceNum * totalPay)
      // Todo round to nearest penny and convert to string
      // let totalPaySee = Number.parseFloat(totalPay).toFixed(2);
      // console.log(totalPaySee)
    }
  },
  components: {
    "aside-nav": asideNav,
  }
}