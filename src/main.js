// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(Vuex)
Vue.use(iView)

const store = new Vuex.Store({
  state: {
    nickName: '',//管理员昵称
    userInfo:{},//用户信息
    goodId:'',
    isLogin:false
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName
    },
    setGoodId(state,goodId){
      state.goodId=goodId
    },
    setUserInfo(state,userInfo){
      state.userInfo=userInfo
    },
    setIsLogin(state,isLogin){
      state.isLogin=isLogin
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
