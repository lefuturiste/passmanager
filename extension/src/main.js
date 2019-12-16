import Vue from 'vue'
import App from './App.vue'
import 'skeleton.css/skeleton.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/style.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
