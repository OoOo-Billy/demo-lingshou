<template>
    <div>
        <subTitle :subTitle="'账户设置'"/>
        <div class="body">
            <div class="div-middle">
                <el-upload
                        class="upload-demo"
                        action=""
                        :http-request="uploadFile"
                        accept="image/jpeg, image/png"
                        :show-file-list="false">
                    <img class="uploading-img" :src="avatar" alt="">
                    <div slot="tip" class="el-upload__tip">上传头像</div>
                </el-upload>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" required>
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input type="password" v-model="ruleForm.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="password" v-model="ruleForm.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确定密码" prop="twicePassword">
                        <el-input type="password" v-model="ruleForm.twicePassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="update('ruleForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'

    export default {
        name: "accountSetting",
        components: {
            subTitle,
        },
        /*created(){
            this.userInfo = JSON.parse(this.$store.getters.userInfo);
            this.ruleForm.name = this.userInfo.merchantName;
            this.ruleForm.merchantLogo = this.userInfo.merchantLogo;
            this.avatar = this.userInfo.imgUrl + this.userInfo.merchantLogo;
        },*/
        data() {
            let validatePass2 = (rule, value, callBack) => {
                if (value === ''){
                    callBack(new Error('请再次输入密码'));
                } else if (this.ruleForm.twicePassword !== this.ruleForm.newPassword){
                    callBack(new Error('两次输入密码不一致'));
                } else {
                    callBack();
                }
            };
            return {
                avatar: '',//用户头像图片连接
                userInfo: {},//用户信息
                ruleForm: {
                    name: '',
                    oldPassword: '',
                    newPassword: '',
                    twicePassword: '',
                    merchantLogo: ''
                },//用户表格数据
                rules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    oldPassword: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    twicePassword: [
                        {required: true, trigger: 'blur', validator: validatePass2}
                    ]
                },//用户表格验证规则
            }
        },
        methods: {
            /**
             * 头像图片上传事件
             * @param {file}file
             */
            uploadFile(file) {
                console.log(file);
                let formData = new FormData();
                formData.append('file', file.file);
                this.$ajax.post("merchant/upload_file",formData,{
                    type: 'form',
                    file: 'image'
                }).then((res) => {
                    this.ruleForm.merchantLogo = res.image;
                    this.avatar = this.userInfo.imgUrl + res.image;
                })
            },

            /**
             * 提交用户设置表单
             * @param {string}formName
             */
            update(formName){
                alert("提交名为" + formName + "的用户设置表单");
                this.$refs[formName].validate((valid) => {
                    if (valid){//验证成功
                        this.$ajax.post("/merchant/change_password",this.ruleForm,{
                            type: 'form'
                        }).then((res) => {
                            this.userInfo.merchantName = this.ruleForm.name;
                            this.userInfo.merchantLogo = this.ruleForm.merchantLogo;
                            this.$msgSuc('修改成功');
                            //清空密码数据
                            this.ruleForm.oldPassword = '';
                            this.ruleForm.newPassword = '';
                            this.ruleForm.twicePassword = '';
                            this.$store.commit('SET_USERINFO',JSON.stringify(this.userInfo));
                        },(err) => {
                            this.$msgErr(err.msg);
                        })
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-form-item__error{
        left: 26px;
    }
    .body {
        .div-middle {
            text-align: center;
            .el-form-item__label {
                float: none;
                clear: both;
            }
            .el-form-item {
                width: 400px;
                margin: 26px auto;
            }
            button {
                background: #5BC0BF;
                color: #fff;
            }
            .el-form-item__content {
                display: inline-block;
                .el-input {
                    display: inline-block;
                    input {
                        width: 100%;
                    }
                }
            }
        }
    }

    .uploading-img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .demo-ruleForm {
        margin-left: -120px;
    }
</style>