import Vue from 'vue'
import App from './App.vue'

import vSelect from 'vue-select'
import VueGridLayout from 'vue-grid-layout'
import 'vue-select/dist/vue-select.css'

import { ethers } from 'ethers'

Vue.config.productionTip = false
Vue.component('v-select', vSelect);
Vue.component('grid-layout', VueGridLayout.GridLayout);
Vue.component('grid-item', VueGridLayout.GridItem);

Object.defineProperty(Vue.prototype, '$ethers', { value: ethers });

new Vue({
  render: h => h(App),
}).$mount('#app')
