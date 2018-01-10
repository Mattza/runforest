import Vue from 'vue'
import Router from 'vue-router'
import RunView from '@/components/RunView'
import StatView from '@/components/StatView'
import WeightView from '@/components/WeightView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RunView',
      component: RunView
    },
    {
      path: '/track',
      name: 'RunView',
      component: RunView
    },
    {
      path: '/stats',
      name: 'StatView',
      component: StatView
    },
    {
      path: '/weight',
      name: 'WeightView',
      component: WeightView
    }
  ]
})
