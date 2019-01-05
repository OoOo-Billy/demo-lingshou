<template>
    <div class="container">
        <div class="login">
            <h2>零售后台管理系统</h2>
            <div class="login-form">
                <div class="form-item">
                    <img src="@/assets/icon-user.png" alt="">
                    <input type="text" v-model="form.loginName">
                </div>
                <div class="form-item">
                    <img src="@/assets/icon-lock.png" alt="">
                    <input type="password" v-model="form.loginPassword">
                </div>
            </div>
            <button @click="login">登录</button>
        </div>
    </div>
</template>

<script>
    import CONFIG from '../utils/config'

    export default {
        name: "login",
        data() {
            return {
                form: {
                    loginName: '13272777674',
                    loginPassword: '666666',
                },
                config: CONFIG,
            }
        },
        methods: {
            login() {
                //1.检查用户输入信息是否符合规格
                if (!this.form.loginName) {
                    this.$msgWar('请输入手机号');
                    return
                }
                if (!CONFIG.reg.phone.test(this.form.loginName)) {
                    this.$msgWar('请输入正确的手机号');
                    return
                }
                if (!this.form.loginPassword) {
                    this.$msgWar('请输入密码');
                    return
                }
                this.$ajax.post('merchant/login', this.form, {
                    //向服务器发送post请求,用axios
                    //路径：merchant/login
                    //数据：this.form
                    //格式：type: 'form'
                    type: 'form'
                }).then((res) => {
                    //处理服务器响应success
                    this.$store.commit("SET_USERINFO", JSON.stringify(res));
                    this.$msgSuc('登录成功');
                    setTimeout(() => {
                        this.$router.push('/index');
                    }, 500)
                }, (err) => {
                    //error
                    this.$msgErr(err.msg);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: url("../assets/background.png") repeat-y center / 100%;
    }

    .login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 500px;
        padding: 40px 40px 60px;
        background: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        border-radius: 4px;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        h2 {
            color: #1ABC9C;
            text-align: center;
        }
        .login-form{
            padding-top: 40px ;
            .form-item{
                height: 50px;
                line-height: 50px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                margin-bottom: 20px;
                img{
                    float: left;
                    height: 30px;
                    width: 30px;
                    margin: 10px 20px 0 10px;
                }
                input{
                    width: 80%;
                    border: none;
                    height: 50px;
                    font-size: 18px;
                    border-radius: 4px;
                    padding-left: 20px;
                }
            }
        }
        button{
            width: 100%;
            height: 50px;
            background-color: #1ABC9C;
            border-radius: 4px;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            &:focus{
                opacity: 0.8;
            }
        }
    }
</style>