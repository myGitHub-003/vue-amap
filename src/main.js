import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

import VueAMap from 'vue-amap'
Vue.use(VueAMap)
// vue-amap 初始化
VueAMap.initAMapApiLoader({
  key: 'cc192fb9089068c51a074fc0d42c4b50', // 这里是你申请的key, 我这里边用的是 web端(JS API) key
  plugin: ['AMap.Geolocation'], // 这里是所有你用到的插件
  v: '1.4.4', // 这是版本号，我也不知道有什么用 不写就报错
  uiVersion: '1.0' // ui库版本， 不配置不加载
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
