import landing from './components/landingFiles/landing.vue'
import payments from "./components/paymentsFiles/payments.vue"
export const routes = [{
  path: '/',
  component: landing,
  children: [{
    path: 'payments',
    components: {
      main: payments
    }
  }]
}]