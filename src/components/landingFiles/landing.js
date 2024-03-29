/* eslint-disable */
import moment from 'moment'
import axios from 'axios'
import asideNav from '../asideNavFiles/asideNav.vue'
export default {
  name: 'landing',
  data() {
    return {
      userNHAddress: null,
      userNHAddressName: null,
      userNHAddresses: [],
      userNHAddressData: null,
      totalFee: null,
      currentBITPriceSee: null,
      currentBITPriceNum: null,

    };
  },
  beforeCreate() {
    this.$store.commit('checkForSelectedAddr')
  },
  created() {
    this.getCurrentBITPrice()
    this.$router.push('dashboard')
  },
  // You can keep your code more DRY if you call this.$parent.function() on router-view
  // Todo Make general funcitons here to keep code DRY
  methods: {
    getNHAddressData(requestMethod) {
      return axios.get('/api', {
        params: {
          method: requestMethod,
          addr: this.$store.state.selectedAddr.addr
        }
      }).then(res => {
        return res
      }).catch(err => {
        return err
      })
    },
    getCurrentBITPrice() {
      let currentPriceURL = "https://api.coindesk.com/v1/bpi/currentprice.json"
      axios.get(currentPriceURL)
        .then(response => {
          // Todo Delete all props of currentBITPrice and move more into vuex
          this.currentBITPriceSee = response.data.bpi.USD.rate
          this.currentBITPriceNum = response.data.bpi.USD.rate_float
          let currentBITPrice = {
            number: response.data.bpi.USD.rate_float,
            string: response.data.bpi.USD.rate
          }
          this.$store.commit('setCurrentBITPrice', currentBITPrice)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // Todo share this method between all components 
    toRelativeTime(time) {
      return moment(time).fromNow()
    },
    toggleCurrency(currency) {
      return String((Number(currency) * this.currentBITPriceNum).toFixed(2))
    }
  },
  components: {
    "aside-nav": asideNav,
  }
}