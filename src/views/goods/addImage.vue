<template>
    <div>
        <subTitle :subTitle="isAdd ? '添加相册' : '编辑相册'"/>
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
                <el-form-item label="相册名称：" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="相册封面：" prop="cover">
                    <img :src="ruleForm.cover" alt="" class="form-img" v-if="ruleForm.cover">
                    <div class="upload-btn-wrap">
                        <label for="upload">
                            <el-button type="primary" size="small">上传图片</el-button>
                        </label>
                        <input id="upload" type="file" class="upload-input" accept="image/jpeg, image/png" @change="uploadCover">
                        <p class="form-tips">只能上传jpg/png格式文件，文件不能超过50kb</p>
                    </div>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="ruleForm.sorting" type="number"></el-input>
                </el-form-item>
                <el-form-item label="相册描述：">
                    <el-input v-model="ruleForm.description" type="textarea" resize="none"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="back">返回</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import mixin from '@/utils/mixin'
    export default {
        name: "addImage",
        mixins: [mixin],
        components: {
            subTitle,
        },
        data(){
            let validCover = (item, value, callback) => {
                if (!this.ruleForm.cover){
                    callback(new Error('请上传相册封面'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    id: '',
                    name: '',
                    cover: '',
                    sorting: '',
                    description: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入相册名称', trigger: 'blur' },
                        { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
                    ],
                    cover: [
                        { validator: validCover, required: true, trigger: 'change' }
                    ],
                },
            }
        },
        created(){
            if (this.$route.query.id){
                this.isAdd = false;
                this.$ajax.post("merchant_goods_galleries/query_by_id",{
                    id: this.$route.query.id
                },{
                    type: 'form'
                }).then((res) => {
                    this.$set(this.ruleForm, 'name', res.name);
                    this.$set(this.ruleForm, 'cover', res.cover);
                    this.$set(this.ruleForm, 'sorting', res.sorting);
                    this.$set(this.ruleForm, 'description', res.description);
                },(err) => {
                    this.$msgErr(err.msg);
                })
            }
        },
        methods: {
            /**
             * 上传封面图片
             * @param $event
             */
            uploadCover($event){
                let files = $event.target.files;
                this.uploadFiles(files).then((res) => {
                    this.$set(this.ruleForm, 'cover', res.imgUrl);
                },(err) => {
                    this.$msgErr(err.msg);
                })
            },

            /**
             * 提交表单
             * @param {String}formName
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAdd){
                            this.addEdit("merchant_goods_galleries/add");
                        } else {
                            this.$set(this.ruleForm, 'id', this.$route.query.id);
                            this.addEdit("merchant_goods_galleries/update");
                        }
                    } else {
                        return false;
                    }
                })
            },

            addEdit(path){
                this.$ajax.post(path, this.ruleForm).then(() => {
                    this.$msgSuc("提交成功");
                    setTimeout(() => {
                        this.$router.push("/goods/image");
                    }, 500)
                },(err) => {
                    this.$msgErr(err.msg);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .form{
        width: 600px;
        .form-tips{
            font-size: 12px;
            color: $gray;
            line-height: 16px;
            margin-top: 5px;
        }
    }
</style>