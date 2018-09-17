/* eslint-disable */
// Todo obtain the toRelativeTime Component from landing to keep code DRY
import moment from 'moment'
import axios from 'axios'
export default {
  name: "payments",
  data() {
    return {

    }
  },
  created() {
  },
  methods: {
    // Todo Methiods below should be adopted from ladning
    toRelativeTime(time) {
      return moment(time).fromNow()
    },
    // Todo change back when clicked
    // ? There could be a global variable for if the user wants it in bitcoin or money boolean to be specific
    toggleCurrency(currency) {
      console.log(Number(currency) * this.currentBITPriceNum)
      return Number(currency) * this.currentBITPriceNum
    }
  },
  // ! Remember to set the properties
  props: ['userNHAddressData', 'currentBITPriceNum']
}