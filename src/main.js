import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import './pluguns/element.js'
// 导入全局样式
import './assets/css/global.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8081/'
// 发送请求携带token
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
