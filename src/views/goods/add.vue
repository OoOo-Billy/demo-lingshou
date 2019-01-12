<template>
    <div class="container">
        <subTitle :subTitle="isAdd ? '添加商品' : '编辑商品'"></subTitle>
        <!--body-->
        <div class="body">
            <!--头部步骤条steps-->
            <el-steps :active="stepActive" align-center>
                <el-step title="选择商品分类"></el-step>
                <el-step title="填写商品信息"></el-step>
                <el-step title="填写商品属性"></el-step>
                <el-step title="选择商品关联"></el-step>
            </el-steps>
            <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

            <!--内容展示-->
            <div class="form-wrap flex" v-loading="loading">
                <!--选择商品分类-->
                <div v-if="stepActive === 0">
                    <div class="flex">
                        <div class="form-label">基本信息</div>
                        <div class="flex-1">
                            <div class="select-category flex h-center">
                                <!--一级分类-->
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择一级分类</div>
                                    <ul class="category-list">
                                        <li>
                                            <span>化妆品</span>
                                            <i class="el-icon-arrow-right fr"></i>
                                        </li>
                                    </ul>
                                </div>
                                <img src="@/assets/icon-arrow.png" alt="">
                                <!--二级分类-->
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择二级分类</div>
                                    <ul class="category-list">
                                        <li>{{}}</li>
                                    </ul>
                                    <div class="category-list">
                                        <span class="empty">暂无分类</span>
                                    </div>
                                </div>
                            </div>
                            <p class="tips">您当前选择的商品类别是：
                                <span>化妆品 > 的深V</span>
                            </p>
                            <el-button type="primary" @click="submitType">下一步，填写商品信息</el-button>
                        </div>
                    </div>
                </div>

                <!--填写商品信息-->
                <div v-if="stepActive === 1">
                    <div class="flex">
                        <div>
                            <div class="form-label">基本信息</div>
                            <div class="form-label label-2">库存规格</div>
                        </div>
                        <el-form :model="ruleForm" :rules="rules" class="form-info" label-width="100px" ref="ruleForm">
                            <el-form-item label="商品分类：">
                                <span class="font-14 green bold" @click="stepActive = 0">化妆品</span>
                                <span class="font-14 green bold"> &gt 化妆品</span>
                            </el-form-item>
                            <el-form-item label="商品名称" prop="goodsName">
                                <el-input v-model="ruleForm.goodsName"></el-input>
                            </el-form-item>
                            <el-form-item label="副标题" prop="goodsSubtitle">
                                <el-input v-model="ruleForm.goodsSubtitle"></el-input>
                            </el-form-item>
                            <el-form-item label="商品品牌" prop="brandId">
                                <el-select v-model="ruleForm.brandId" placeholder="请选择品牌">
                                    <el-option :label="'贵人鸟'" :value="'旗下'"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商品介绍" prop="goodsDesc">
                                <el-input type="textarea" v-model="ruleForm.goodsDesc"></el-input>
                            </el-form-item>
                            <el-form-item label="商品货号">
                                <el-input v-model="ruleForm.goodsNo"></el-input>
                                <p class="form-tips">如果您不输入商品货号，系统将自动生成一个唯一的货号</p>
                            </el-form-item>
                            <el-form-item label="商品售价" prop="goodsPrice">
                                <el-input v-model="ruleForm.goodsPrice" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="市场价">
                                <el-input v-model="ruleForm.marketPrice" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品库存" prop="goodsStock">
                                <el-input v-model="ruleForm.goodsStock" type="number"></el-input>
                                <p class="form-tips">该设置只对单品有效，当商品存在多规格货品时为不可编辑状态，库存数值取决于货品数量</p>
                            </el-form-item>
                            <el-form-item label="库存预警" prop="goodsWarning">
                                <el-input v-model="ruleForm.goodsWarning" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="计量单位">
                                <el-input v-model="ruleForm.goodsUnit"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量">
                                <el-input v-model="ruleForm.goodsWeight" type="number"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <!--选择商品属性-->
                <div v-if="stepActive === 2">
                    <div class="form-item-3 flex">
                        <div class="form-label">商品属性</div>
                        <div class="flex-1">
                            <el-form class="form-prop" label-width="100px" v-loading="">
                                <el-form-item label="商品类型：">
                                    <el-select v-model="ruleForm.typeId" :disabled="!isAdd" placeholder="请选择商品类型" @click="getProp">
                                        <el-option :label="item.styleName" :value="item.id"
                                                   v-for="item in typeList"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="商品规格：" v-if="propList.length > 0">
                                    <div class="prop-wrap">
                                        <el-checkbox-group>
                                            <div></div>
                                            <el-checkbox></el-checkbox>
                                        </el-checkbox-group>
                                        <div>
                                            <el-button></el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <table class="goods-table" border="1" v-show="propSpecList.length > 0"></table>
                        </div>
                    </div>
                    <div class="form-item-3 flex">
                        <div class="form-label">商品参数</div>
                        <div class="flex-1"></div>
                    </div>
                    <div class="form-item-3 flex">
                        <div class="form-label">商品相册</div>
                        <div class="flex-1"></div>
                    </div>
                    <div class="form-item-3 flex">
                        <div class="form-label">商品详情</div>
                        <div class="flex-1"></div>
                    </div>
                </div>

                <!--选择关联类目-->
                <div></div>
            </div>

            <!--相册库弹窗-->
            <el-dialog></el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '../../components/subTitle'
    import mixin from '../../utils/mixin'

    export default {
        name: "add",
        mixins: [mixin],
        components: {
            subTitle,
        },
        data() {
            return {
                stepActive: 1,
                ruleForm: {
                    typeId: '', //一级分类ID
                    childId: '', //二级分类ID
                    goodsName: '', //商品名称
                    goodsSubtitle: '', //副标题
                    brandId: '', //商品品牌
                    goodsDesc: '', //商品介绍
                    goodsNo: '', //商品货号
                    goodsPrice: '', //商品售价
                    marketPrice: '', //市场价
                    goodsStock: '', //商品库存
                    goodsWarning: '', //库存预警值
                    goodsUnit: '', //计量单位
                    goodsWeight: '', //商品重量
                    styleId: '', //类型ID
                    merchantSpecifications: [], //商品属性列表
                    merchantGoodsTypePropertyList: [], //商品属性值列表
                    merchantParamDetailIds: {
                        merchantParamDetails: [],
                        mainMaterial: '',
                        paramObject: '',
                    }, //商品参数值列表
                    goodsImg: '', //商品图片
                    navId: '',
                    navChildId: '',
                },
                rules: {
                    goodsName: [],
                    goodsSubtitle: [],
                    brandId: [],
                    goodsDesc: [],
                    goodsPrice: [],
                    goodsStock: [],
                    goodsWarning: []
                },
                typeList: [],//类型列表
                propList: [],//商品属性列表
                propSpecList: [],//商品规格列表
            }
        },
        methods: {
            /**
             * 测试
             */
            next() {
                if (this.stepActive++ > 3) this.stepActive = 0;
            },
            /**
             * step0 提交商品分类
             */
            submitType() {
                this.next();
            },
            /**
             * step2 商品属性选择商品类型
             */
            getProp(id) {

            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .form-wrap {
        margin-top: 50px;
        > div {
            width: 100%;
        }
        .form-label {
            width: 175px;
            height: 50px;
            line-height: 50px;
            color: #fff;
            padding: 0 20px;
            box-sizing: border-box;
            background-color: $green;
            position: relative;
            margin-right: 100px;
            &::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                right: -50px;
                border: 25px solid transparent;
                border-left-color: $green;
            }
        }
    }

    .select-category {
        margin-top: 40px;
        .title {
            height: 48px;
            line-height: 48px;
            border: $border;
            border-bottom-color: transparent;
            padding: 0 24px;
            box-sizing: border-box;
        }
        img {
            margin: 0 36px;
        }
        .flex-1 {
            max-width: 380px;
        }
        .category-list {
            height: 380px;
            position: relative;
            border: $border;
            box-sizing: border-box;
            overflow: auto;

            li {
                height: 48px;
                line-height: 48px;
                color: $gray;
                border-bottom: $border;
                padding: 0 24px;
                cursor: pointer;

                i {
                    margin-top: 17px;
                }

            }
            .active {
                background-color: $green;
                color: #fff;
            }

            .empty {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: $gray;
            }
        }
    }

    .tips {
        font-size: 14px;
        margin: 20px 0;
        span {
            color: $green;
        }
    }

    .form-info, .form-prop {
        width: 500px;
    }

    .label-2 {
        margin-top: 274px;
    }

    .form-tips {
        font-size: 12px;
        color: $gray;
        line-height: 16px;
        margin-top: 5px;
    }

    .prop-wrap {
        padding: 20px;
        border: $border;
        border-radius: 4px;
    }
</style>