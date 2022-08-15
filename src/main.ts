import {createApp} from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
const app = createApp(App)
import axios from "axios";
axios.defaults.baseURL = 'https://apis.imooc.com/api/'

// 请求拦截器
axios.interceptors.request.use(config => {
    ///////////////////////////////////////////////////
    // API相关
    config.params = {...config.params, icode: '591B1603875E6F76'}
    // 其他请求，添加到body中
    // 如果是上传文件，添加到FormData中
    if (config.data instanceof FormData) {
        config.data.append('icode', '591B1603875E6F76')
    }else  {
        // 普通的body对象，添加到data中
        config.data = {...config.data, icode: '591B1603875E6F76'}
    }


    // 在发送的时候重置错误，并且设置Loading为true
    store.commit('setError', {status: false, message: ''}) // 重置错误
    store.commit('setLoading', true)
    return config
})

// 响应拦截器
axios.interceptors.response.use(config => {
    store.commit('setLoading', false) // 开始加载
    return config
}, e => {
    // e.response.data --> code 422 error 错误信息
    const {error} = e.response.data
    store.commit('setError', {status: true, message: error})
    store.commit('setLoading', false)
    return Promise.reject(error)
})

app.use(router)
app.use(store)
app.mount('#app')
