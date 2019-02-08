<template>
    <div>
        <subTitle :subTitle="'添加类目'"/>
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
                <el-form-item label="类目名称:" prop="navName">
                    <el-input v-model.trim="ruleForm.navName"></el-input>
                </el-form-item>
                <el-form-item label="上级类目:" prop="parentId">
                    <el-select v-model="ruleForm.parentId" :disabled="!isAdd" placeholder="请选择分类">
                        <el-option v-for="item in headerList" :label="item.navName" :value="item.id"></el-option>
                    </el-select>
                    <p class="form-tips" v-if="isAdd">不选择分类默认为顶级分类</p>
                </el-form-item>
                <el-form-item label="排序:" prop="navSort">
                    <el-input v-model="ruleForm.navSort" type="number"></el-input>
                </el-form-item>
                <el-form-item label="是否显示:" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio label="0">显示</el-radio>
                        <el-radio label="1">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="类目图标:" prop="navIcon" v-if="isAdd">
                    <img :src="ruleForm.navIcon" alt="" class="form-img" v-if="ruleForm.navIcon">
                    <div class="upload-btn-wrap">
                        <label for="upload">
                            <el-button size="small" type="primary">上传图片</el-button>
                        </label>
                        <input type="file" id="upload" @change="uploadNavIcon" class="upload-input" accept="image/jpeg, image/png">
                        <p class="form-tips">建议图标尺寸为18*18比例，图片只能为jpg、png格式</p>
                    </div>
                </el-form-item>
                <el-form-item label="类目描述:" prop="navDesc">
                    <el-input type="textarea" v-model="ruleForm.navDesc" resize="none" rows="3"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="back">返回</el-button>
                    <el-button type="primary" @click="submitForm" :loading="submitLoading">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import mixin from "@/utils/mixin"
    export default {
        name: "addHeader",
        mixins: [mixin],
        components: {
            subTitle,
        },
        data(){
            return {
                ruleForm: {
                    navName: '',
                    parentId: 0,
                    navSort: '',
                    status: '0',
                    navIcon: '',
                    navDesc: '',
                },
                rules: {

                },
                headerList: [
                    {id: 0, navName: '顶级类目'},
                    {navName: '服装', id: 11,},
                    {navName: '食品', id: 333,},
                ],
                submitLoading: false,
            }
        },
       /* created() {
            this.$ajax.post("merchantNavigation/query_navigation_type_tree").then((res) => {
                this.headerList = [...this.headerList, ...res];
                if (this.$route.query.parentId){
                    this.isAdd = false;
                    this.ruleForm.parentId = Number(this.$route.query.parentId);
                }
            }, (err) => {
                this.$msgErr(err.msg)
            })
        },*/
        methods: {
            uploadNavIcon($event) {
                let files = $event.target.files;
                this.uploadFiles(files).then((res) => {
                    this.$set(this.ruleForm, 'navIcon', res.imgUrl);
                })
            },

            submitForm() {
                this.$refs[ 'ruleForm'].validate((valid) => {
                    if (valid){
                        this.submitLoading = true;
                        this.$ajax.post("merchantNavigation/merchant_navigation_add", this.ruleForm).then(() => {
                            this.$msgSuc("操作成功");
                            setTimeout(() => {
                                this.$router.push("/promotion/header");
                            },500)
                        }, (err) => {
                            this.$msgErr(err.msg);
                        }).finally(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false
                    }
                })
            },
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