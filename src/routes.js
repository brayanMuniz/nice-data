/* eslint-disable */
import landing from './components/landingFiles/landing.vue'
import payments from "./components/paymentsFiles/payments.vue"
import dashboard from "./components/dashboardFiles/dashboard.vue"
import workers from "./components/workersFiles/workers.vue"
import compare from './components/compareFiles/compare.vue'
import donate from './components/donateFiles/donate.vue'
export const routes = [{
  path: '/',
  component: landing,
  children: [{
      path: 'dashboard',
      components: {
        main: dashboard
      }
    },
    {
      path: 'payments',
      components: {
        main: payments
      }
    },
    {
      path: 'workers',
      components: {
        main: workers
      }
    },
    {
      path: 'compare',
      components: {
        main: compare
      }
    },
    {
      path: 'donate',
      components: {
        main: donate
      }
    }
  ]
}]