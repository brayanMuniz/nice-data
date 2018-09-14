/* eslint-disable */
import axios from 'axios'
export default {
  name: 'landing',
  data() {
    return {
      nicehashAddress: null,
      example: null,
      addressData: null
    };
  },
  created() {
    axios.get('/api')
      .then(res => {
        this.example = res.data
      })
      .catch(err => {
        console.log(err)
      })
    this.getAddressData()
  },
  methods: {
    // Todo Configure this one with parameters
    getAddressData() {
      axios.get('/api/address')
        .then(res => {
          this.addressData = res.data.result
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}