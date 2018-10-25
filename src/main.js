/*eslint-disable*/
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import bootstrap from 'bootstrap';
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faCoffee, faMinusCircle
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
  routes
} from "./routes.js"
import {
  store
} from './store.js'

library.add(faCoffee)
library.add(faMinusCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  router,
  store,
  bootstrap,
  render: (h) => h(App)
})