import Vue from 'vue'
import App from './App.vue'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { ethers } from 'ethers'

Vue.config.productionTip = false
Vue.component('v-select', vSelect);

Object.defineProperty(Vue.prototype, '$ethers', { value: ethers });

new Vue({
  render: h => h(App),
}).$mount('#app')
