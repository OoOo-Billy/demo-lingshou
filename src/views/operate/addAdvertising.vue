<template>
    <div>
        <subTitle :subTitle="'添加广告'"/>
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form"
                     v-loading="loading">
                <el-form-item label="广告名称:" prop="adName">
                    <el-input v-model="ruleForm.adName"></el-input>
                </el-form-item>
                <el-form-item label="广告位置:" prop="adPosition">
                    <el-select v-model="ruleForm.adPosition" placeholder="请选择广告位置">
                        <el-option :label="item" :value="index" v-for="(item, index) in adPositionList"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上线/下线:" prop="online">
                    <el-radio-group v-model="ruleForm.online">
                        <el-radio :label="'1'">上线</el-radio>
                        <el-radio :label="'0'">下线</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告图片:" prop="adPicture">
                    <img :src="ruleForm.adPicture" alt="" v-if="ruleForm.adPicture">
                    <div class="upload-btn-wrap">
                        <label for="upload">
                            <el-button type="primary" size="small">上传图片</el-button>
                        </label>
                        <input id="upload" type="file" class="upload-input" accept="image/jpeg, image/png"
                               @change="uploadadPicture">
                        <p class="form-tips">只能上传jpg/png格式文件，文件不能超过50kb</p>
                    </div>
                </el-form-item>

                <el-form-item label="广告指定商品:" prop="adLink">
                    <el-select
                            v-model="ruleForm.adLink"
                            filterable
                            remote
                            clearable
                            @change="handleGoods"
                            placeholder="请输入商品名"
                            :remote-method="searchGoods"
                    >
                        <el-option :label="item.goodsName" :value="item.id" v-for="item in goodsList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告备注:">
                    <el-input v-model="ruleForm.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="back">返回</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import subTitle from "@/components/subTitle"
    import mixin from "@/utils/mixin"

    export default {
        name: "addAdvertising",
        mixins: [mixin],
        components: {
            subTitle,
        },
        data() {
            let validPic = (item, value, callback) => {
                if (!this.ruleForm.adPicture) {
                    callback(new Error('请上传广告图片'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    adName: '',
                    adPosition: '',
                    online: '1',
                    adPicture: '',
                    adLink: '',
                },
                rules: {
                    adName: [
                        {required: true, message: '请输入广告名称', trigger: 'blur'},
                        {max: 30, message: '长度必须小于30个字符', trigger: 'blur'}
                    ],
                    adPosition: [
                        {required: true, message: '请选择广告位置', trigger: 'change'}
                    ],
                    online: [
                        {required: true, message: '请选择广告是否上线', trigger: 'change'}
                    ],
                    adPicture: [
                        {required: true, validator: validPic, trigger: 'change'}
                    ],
                    adLink: [
                        {required: true, message: '请选择广告商品', trigger: 'change'}
                    ],
                },
                adPositionList: ['APP首页轮播', '分类轮播'],
                goodsList: [
                    {
                        id: '12887',
                        goodsName: '耐克球鞋',
                    },
                ],
            }
        },
        methods: {
            uploadadPicture() {
            },
            handleGoods() {
            }
            ,
            searchGoods() {
            }
            ,
            submitForm() {
            }
            ,
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