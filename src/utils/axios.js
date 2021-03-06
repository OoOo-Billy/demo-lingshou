import axios from 'axios'
import qs from 'qs'
import CONFIG from './config'
import store from '../store/store'
import router from '../router/router'
import {Message} from 'element-ui'

axios.defaults.baseURL = CONFIG.api; // 定义baseUrl
axios.defaults.timeout = 5000;

//请求拦截器
axios.interceptors.request.use((config) => {
    //设置请求的格式，根据具体需求来修改，这个项目因为有些地方请求的header头部格式不一致，所以需要特殊处理
    config.withCredentials = true;//跨域请求
    if (config.type === 'form' && config.file !== 'image') {
        config.data = qs.stringify(config.data);
    } else {
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }
    return config;
}, (err) => {
    Message.error('请求超时');
    return Promise.reject(err);
});

//响应拦截器
axios.interceptors.response.use((res) => {
    //设置请求应答的回调，可根据服务器返回的错误码，来执行不同的事件。
    //例如code为200时，一般是应答成功，可执行相应操作，其他code可以自己定义
    //如果没有需要特殊处理的code，一般我们直接用Promise.reject直接抛出错误信息
    if (res.data.errno === '200') {
        return res.data.data
    } else if (res.data.errno === '416') {
        Message.error('登陆失败');
        setTimeout(() => {
            store.commit('CLEAR_USERINFO');
            router.push('/');//等同于点击 <router-link :to="/">，实现跳转到首页
        }, 500)
    } else if (res.data.errno === '0000') {
        return Promise.reject(res.data);
    } else {
        return Promise.reject(res.data);
    }
    /*注解：
    * res是axios自定义的res对象，其中res.data才是服务器返回的data数据
    * 所以return中的数据应该写成res.data.data
    * */

}, (err) => {
    return Promise.reject(err)
});
export default axios;