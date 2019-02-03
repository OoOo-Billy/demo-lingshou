<template>
    <div>
        <subTitle :subTitle="'订单设置'"/>
        <div class="body">
            <div class="box-middle">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
                    <el-form-item label="正常订单超过" prop="normalEndpayTime">
                        <el-input v-model="ruleForm.normalEndpayTime" placeholder="请输入时间"></el-input>
                        <span>分</span><em>未付款，订单自动关闭</em>
                    </el-form-item>
                    <el-form-item label="发货超过" prop="sendEndTime">
                        <el-input v-model="ruleForm.sendEndTime" placeholder="请输入时间"></el-input>
                        <span>天</span><em>未收货，订单自动完成</em>
                    </el-form-item>
                    <el-form-item label="最终评论时间" prop="commentEndTime">
                        <el-input v-model="ruleForm.commentEndTime" placeholder="请输入时间"></el-input>
                        <span>天</span><em>好评并完成</em>
                    </el-form-item>
                    <el-form-item label="完成收货后" prop="finalEndTime">
                        <el-input v-model="ruleForm.finalEndTime" placeholder="请输入时间"></el-input>
                        <span>天</span><em>不能申请售后</em>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"

    export default {
        name: "orderSetting",
        components: {
            subTitle,
        },
        data() {
            return {
                ruleForm: {
                    id: "",
                    normalEndpayTime: "",
                    sendEndTime: "",
                    commentEndTime: "",
                    finalEndTime: "",
                },
                rules: {
                    normalEndpayTime: [
                        {required: true, message: '请输入时间', trigger: 'blur'},
                    ],
                    sendEndTime: [
                        {required: true, message: '请输入时间', trigger: 'blur'},
                    ],
                    commentEndTime: [
                        {required: true, message: '请输入时间', trigger: 'blur'},
                    ],
                    finalEndTime: [
                        {required: true, message: '请输入时间', trigger: 'blur'},
                    ],
                },
            }
        },
        /* created() {
             this.$ajax.post("/merchant_order_set/queryOrderSet",{
                 merchantId:  JSON.parse(localStorage.userInfo).merchantId
             }).then((res) => {
                 this.$set(this.ruleForm, 'normalEndpayTime', res.normalEndpayTime);
                 this.$set(this.ruleForm, 'sendEndTime', res.sendEndTime);
                 this.$set(this.ruleForm, 'commentEndTime', res.commentEndTime);
                 this.$set(this.ruleForm, 'finalEndTime', res.finalEndTime);
                 this.ruleForm.id = res.id
             },(err) => {
                 this.$msgErr(err.msg);
             })
         },*/
        methods: {
            submitForm() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let formData = {...this.ruleForm, ...{merchantId: JSON.parse(localStorage.userInfo).merchantId}};
                        this.$ajax.post("/merchant_order_set/add_or_update", formData).then(() => {
                            this.$msgSuc("提交成功");
                        }, (err) => {
                            this.$msgErr(err.msg);
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .box-middle {
        .form {
            width: 600px;
            margin: 0 auto;
            .el-input {
                width: 200px;
            }
            span {
                text-align: center;
                display: inline-block;
                width: 40px;
                height: 40px;
                background: #efefef;
                border: 1px solid #dcdfe6;
                border-radius: 5px;
                margin-left: 5px;
            }
            em {
                font-style: normal;
                display: inline-block;
                width: 190px;
                color: #606266;
                text-align: left;
                margin-left: 10px;
            }
        }
    }
</style>