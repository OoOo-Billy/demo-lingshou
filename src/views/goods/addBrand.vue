<template>
    <div>
        <subTitle :subTitle="isAdd ? '添加品牌' : '编辑品牌'"/>
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
                <el-form-item label="品牌名称：" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="品牌首字母：">
                    <el-input v-model="ruleForm.firstChar"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO：" prop="logo">
                    <img :src="ruleForm.logo" alt="" class="form-img" v-if="ruleForm.logo">
                    <div class="upload-btn-wrap">
                        <label for="upload">
                            <el-button type="primary" size="small">上传图片</el-button>
                        </label>
                        <input type="file" id="upload" class="upload-input" accept="image/png, image/jpeg" @change="uploadLogo">
                        <p class="form-tips">只能上传jpg/png格式文件</p>
                    </div>
                </el-form-item>
                <el-form-item label="品牌专区大图: ">
                    <img :src="ruleForm.areaLogo" alt="" class="form-img" v-if="ruleForm.areaLogo">
                    <div class="upload-btn-wrap">
                        <label for="upload1">
                            <el-button type="primary" size="small">上传图片</el-button>
                        </label>
                        <input type="file" id="upload1" class="upload-input" accept="image/png, image/jpeg" @change="uploadAreaLogo">
                        <p class="form-tips">只能上传jpg/png格式文件</p>
                    </div>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="ruleForm.sorting" type="number"></el-input>
                </el-form-item>
                <el-form-item label="品牌故事:">
                    <el-input v-model="ruleForm.story" type="textarea" resize="none"></el-input>
                </el-form-item>
                <el-form-item label="是否显示：" prop="isShow">
                    <el-radio-group v-model="ruleForm.isShow">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <p class="form-tips">当品牌下还没有商品的时候，分类页的品牌区将不会显示该品牌。</p>
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
    import mixin from "@/utils/mixin"

    export default {
        name: "addBrand",
        mixins: [mixin],
        components: {
            subTitle,
        },
        data() {
            let validLogo = (item, value, callBack) => {
                if (!this.ruleForm.logo.length){
                    callBack(new Error("请上传品牌logo"));
                } else {
                    callBack();
                }
            };
            return {
                ruleForm: {},
                rules: {
                    name: [
                        {required: true, message: '请输入品牌名字', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'},
                    ],
                    logo: [
                        {validator: validLogo, required: true, trigger: 'change'}
                    ],
                    isShow:[
                        {required: true, trigger: 'change'},
                    ]
                }
            }
        },
        created(){
            if (this.$route.query.id){
                this.$ajax.post("merchant_goods_brand/query_by_id",{
                    id: this.$route.query.id
                },{
                    type: 'form'
                }).then((res) => {
                    this.isAdd = false;
                    this.$set(this.ruleForm, 'name', res.name);
                    this.$set(this.ruleForm, 'logo', res.logo);
                    this.$set(this.ruleForm, 'areaLogo', res.areaLogo);
                    this.$set(this.ruleForm, 'story', res.story);
                    this.$set(this.ruleForm, 'isShow', String(res.isShow));
                    this.$set(this.ruleForm, 'sorting', res.sorting);
                    this.$set(this.ruleForm, 'firstChar', res.firstChar);
                },(err) => {
                    this.$msgErr(err.msg);
                })
            }
        },
        methods:{
            /**
             * 上传品牌logo
             * @param file
             */
            uploadLogo(file){
                this.uploadFiles(file).then((res) => {
                    this.$set(this.ruleForm, 'logo', res.imgUrl);
                })
            },

            /**
             * 上传品牌专区大图
             * @param file
             */
            uploadAreaLogo(file){
                this.uploadFiles(file).then((res) => {
                    this.$set(this.ruleForm, 'areaLogo', res.imgUrl);
                })
            },


            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addEdit("merchant_goods_brand/add");
                        } else {
                            this.$set(this.ruleForm, 'id', this.$route.query.id);
                            this.addEdit("merchant_goods_brand/update");
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
                        this.$router.push("/goods/brand");
                    }, 500)
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .form {
        width: 500px;
        .form-tips {
            font-size: 12px;
            color: $gray;
            line-height: 16px;
            margin-top: 5px;
        }
    }
</style>