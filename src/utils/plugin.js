import { Message, MessageBox} from 'element-ui'

export default {
    install(Vue){//必须使用install方法才能让main.js里面use这个plugin
        //Vue.prototype.$function = 在Vue原型上注册$function方法
        Vue.prototype.$msgSuc = (content) =>{
            Message({
                message: content,
                type: 'success'
            })
        };
        Vue.prototype.$msgWar = (content) =>{
            Message({
                message: content,
                type: 'warning'
            })
        };
        Vue.prototype.$msgErr = (content) =>{
            Message({
                message: content,
                type: 'error'
            })
        };
        Vue.prototype.$msgInfo = (content) =>{
            Message({
                message: content,
                type: 'info'
            })
        };
        Vue.prototype.$confirm = (content) =>{
            return new Promise((resolve,reject)=>{
                MessageBox.confirm(content,'提示',{
                    confirmButtonText: '确定',
                    cancelButtonText:'取消',
                    type: 'warning'
                }).then(()=>{
                    resolve();
                },()=>{
                    reject();
                })
            })
        };
    }
}