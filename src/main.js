// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import firebase from 'firebase'
import { VueMaskDirective } from 'v-mask'

import 'vuetify/dist/vuetify.min.css'

Vue.use(VueFire)
Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})

Vue.directive('mask', VueMaskDirective)

Vue.config.productionTip = false

const provider = new firebase.auth.GoogleAuthProvider()
let app
firebase.auth().onAuthStateChanged((user) => {
  if (!app && user) {
    Vue.prototype.$user = user
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  } else {
    firebase.auth().signInWithRedirect(provider).then((result) => {
      this.user = result.user
    }).catch(error => console.log(error))
  }
})

Vue.filter('speed', function ({ distance, time }) {
  let km = parseFloat(distance)
  let [minutes, seconds] = time.split(':')
  let hours = (minutes / 60 + seconds / 3600)
  return (km / hours).toFixed(2)
})
Vue.filter('date', date => date.split('T')[0])
Vue.filter('pace', ({ distance, time }) => {
  let km = parseFloat(distance)
  let [minutes, seconds] = time.split(':')
  minutes = parseInt(minutes) + parseInt(seconds) / 60
  return (minutes / km).toFixed(2)
})
