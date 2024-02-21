import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
let defApp = {};
export function createApp() {
  const app = createSSRApp(App)
  defApp.app = app
  return {
    app
  }
}
export default defApp
// #endif