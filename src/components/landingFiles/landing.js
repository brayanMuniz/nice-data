/* eslint-disable */
import moment from 'moment'
import axios from 'axios'
export default {
  name: 'landing',
  data() {
    return {
      userNHAddress: null,
      example: null,
      userNHAddressData: null,
      totalFee: null,
      // make next line added to vuex
      currentBITPrice: null
    };
  },
  created() {
    this.getCurrentBITPrice()
    this.getNHAddressData()
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
          this.userNHAddressData = res.data
          if (res.data.result.error) {
            console.log('Make a error notification or something')
          }
          this.sumOfPayAmount()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCurrentBITPrice() {
      let currentPriceURL = "https://api.coindesk.com/v1/bpi/currentprice.json"
      axios.get(currentPriceURL)
        .then(response => {
          this.currentBITPrice = response.data.bpi.USD.rate
          console.log(this.currentBITPrice)
          return this.currentBITPrice
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
      // ! this.currentBITPrice returns NaN if try to make a number
      console.log(this.currentBITPrice)
      let currentPrice = Number(this.currentBITPrice)
      console.log(currentPrice)
      console.log(totalPay)

    }
  }
}