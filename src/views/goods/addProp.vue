<template>
    <div>
        <subTitle :subTitle="isAdd ? '添加属性' : '编辑属性'"/>
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="form">
                <el-form-item label="属性名称：" prop="propertyName">
                    <el-input v-model="ruleForm.propertyName"></el-input>
                </el-form-item>
                <el-form-item label="商品类型：" prop="styleId">
                    <el-select v-model="ruleForm.styleId" placeholder="请选择类型">
                        <el-option v-for="item in typeList" :label="item.styleName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性是否可选">
                    <el-radio v-model="ruleForm.propertySelect" :label="0" disabled>唯一属性</el-radio>
                    <el-radio v-model="ruleForm.propertySelect" :label="1" disabled>单选属性</el-radio>
                    <el-radio v-model="ruleForm.propertySelect" :label="2" disabled>复选属性</el-radio>
                    <p class="form-tips">选择"单选/复选属性"时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择"唯一属性"时，商品的该属性值只能设置一个值，用户只能查看该值。</p>
                </el-form-item>
                <el-form-item label="属性值：" prop="propertyList">
                    <el-tag
                    :key="tag"
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="closeInput"></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加属性值</el-button>
                    <p class="form-tips">输入属性名，按“回车”键确认</p>
                </el-form-item>
                <el-form-item label="属性排序：">
                    <el-input v-model="ruleForm.propertyOrder" type="number"></el-input>
                    <p class="form-tips">排序级别最高的属性可单独上传属性图片</p>
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
        name: "addProp",
        mixins: [mixin],
        components: {
            subTitle
        },
        data() {
            let validProp = (item, value, callBack) => {
                if (this.dynamicTags.length === 0){
                    callBack(new Error('请添加属性值'));
                } else if (this.ruleForm.propertySelect === 0 && this.dynamicTags.length > 1){
                    callBack(new Error('唯一属性只能添加一个属性值'));
                } else {
                    callBack();
                }
            };
            return {
                ruleForm: {},
                rules: {
                    propertyName: [
                        {required: true, message: '请输入属性名称', trigger:'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger:'blur'},
                    ],
                    styleId: [
                        {required: true, message: '请选择商品类型', trigger: 'change'}
                    ],
                    propertyList: [
                        {validator: validProp, required: true, trigger: 'change'}
                    ]
                },
                typeList: [],//商品类型列表
                dynamicTags: [],
                inputVisible: false,//默认false
                inputValue: '',
            }
        },
        mounted() {
            this.$ajax.post("merchantGoodsStyle/merchant_goods_type_list").then((res) => {
                this.typeList = res;
                if (this.$route.query.id){
                    this.isAdd = false;
                    this.$ajax.post("merchantGoodsProperty/merchant_goods_type_by_id",{
                        id: this.$route.query.id
                    }).then((res) => {
                        this.$set(this.ruleForm, 'propertyName', res.propertyName);
                        this.$set(this.ruleForm, 'styleId', res.styleId);
                        this.$set(this.ruleForm, 'propertySelect', res.propertySelect);
                        this.$set(this.ruleForm, 'propertyOrder', res.propertyOrder);
                        if (res.propertyList.length > 0){
                            this.dynamicTags = res.propertyList.split(',');
                        }
                    },(err) => {
                        this.$msgErr(err.msg);
                    })
                }
            },(err) => {
                this.$msgErr(err.msg);
            })
        },
        methods:{
            /**
             * tag标签的关闭事件
             * @param {String}tag
             */
            handleClose(tag){
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag),1);
            },

            /**
             * tags的input输入框确认事件(@keyup.enter)
             */
            handleInputConfirm(){
                let inputValue = this.inputValue;
                if (inputValue) {
                    if (this.dynamicTags.indexOf(inputValue) < 0){
                        this.dynamicTags.push(inputValue);
                    }
                }
                this.inputVisible = false;
                this.inputValue = ''
            },

            /**
             * 关闭tags的input
             */
            closeInput(){
                this.inputVisible = false;
                this.inputValue = ''
            },

            /**
             * 打开添加tags的input
             */
            showInput(){
                this.inputVisible = true;
                this.$nextTick(() => {
                    //设置默认光标
                    this.$refs.saveTagInput.$refs.input.focus();
                })
            },

            /**
             * 提交表单
             * @param {String}formName
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        this.$set(this.ruleForm, 'propertyList', this.dynamicTags.join(','));
                        if (this.isAdd){
                            this.addEdit("merchantGoodsProperty/merchant_goods_type_add", this.ruleForm);
                        }else {
                            this.ruleForm.id = this.$route.query.id;
                            this.addEdit("merchantGoodsProperty/merchant_goods_type_update", this.ruleForm);
                        }
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .form{
        width: 700px;
        .form-tips {
            font-size: 12px;
            color: $gray;
            line-height: 16px;
            margin-top: 5px;
        }
    }
    .el-tag{
        color: #fff;
        background-color: #7CCDCC;
        border-color: #7CCDCC;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
</style>