/* eslint-disable */
import axios from 'axios'
export default {
  name: 'landing',
  data() {
    return {
      nicehashAddress: null,
      example: null
    };
  },
  created() {
    axios.get('/api')
    .then(res => {
      this.example = res
    })
    .catch(err => {
      console.log(err)
    })
  },
  methods: {

  }
}