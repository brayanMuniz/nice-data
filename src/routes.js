import landing from './components/landingFiles/landing.vue'
import payments from "./components/paymentsFiles/payments.vue"
import dashboard from "./components/dashboardFiles/dashboard.vue"

export const routes = [{
  path: '/',
  component: landing,
  children: [{
    path: 'dashboard',
    components: {
      main: dashboard
    }
  }, {
    path: 'payments',
    components: {
      main: payments
    }
  }]
}]