<template>
    <div>
        <sub-title :subTitle="isAdd ? '添加发货点' : '编辑发货点'"/>
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
                <el-form-item label="发货点名称:" prop="returnPname">
                    <el-input v-model="ruleForm.returnPname"></el-input>
                </el-form-item>
                <el-form-item label="发货人姓名:" prop="returnName">
                    <el-input v-model="ruleForm.returnName"></el-input>
                </el-form-item>
                <el-form-item label="详细地址:" prop="returnAddress">
                    <el-input v-model="ruleForm.returnAddress"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="returnPhone">
                    <el-input v-model="ruleForm.returnPhone"></el-input>
                </el-form-item>
                <el-form-item>
                   <el-button type="primary" @click="submitForm">提交</el-button>
                   <el-button @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import mixin from "@/utils/mixin"
    export default {
        name: "addAddress",
        mixins: [mixin],
        components: {
            subTitle,
        },
        data(){
            return {
                ruleForm: {
                    id: '',
                    returnPname: '',
                    returnName: '',
                    returnAddress: '',
                    returnPhone: ''
                },
                rules: {
                    returnPname: [
                        {required: true, message: '请输入发货点名称', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ],
                    returnName: [
                        {required: true, message: '请输入发货人姓名', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ],
                    returnAddress: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ],
                    returnPhone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ]
                },

            }
        },
        mounted() {
            if (this.$route.query.id){
                this.isAdd = false;
                this.$ajax.post("return_send/query_By_Id", {
                    id: this.$route.query.id
                }).then((res) => {
                    this.$set(this.ruleForm, 'returnPname', res.returnPname);
                    this.$set(this.ruleForm, 'returnName', res.returnName);
                    this.$set(this.ruleForm, 'returnAddress', res.returnAddress);
                    this.$set(this.ruleForm, 'returnPhone', res.returnPhone);
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            }
        },
        methods: {
            submitForm() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid){
                        if (this.isAdd){
                            this.addEdit("merchant_goods_brand/add")
                        } else {
                            this.ruleForm.id = this.$route.id;
                            this.addEdit("merchant_goods_brand/update")
                        }
                    } else {
                        return false
                    }
                })
            },

            addEdit(path){
                this.$ajax.post(path, this.ruleForm).then(() => {
                    this.$msgSuc("提交成功");
                    setTimeout(() => {
                        this.$router.push("/order/address");
                    }, 500)
                },(err) => {
                    this.$msgErr(err.msg);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .form{
        width: 600px;
    }
</style>