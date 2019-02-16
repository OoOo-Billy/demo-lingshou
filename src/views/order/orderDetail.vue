<template>
    <div>
        <subTitle :subTitle="'订单详情'" :isBack="true"/>
        <div class="body">
            <!--steps-->
            <el-steps :active="datalist.status" align-center finish-status="success">
                <el-step title="提交订单" :description="datalist.creatTime"></el-step>
                <el-step title="支付订单" :description="datalist.finishTime"></el-step>
                <el-step title="平台发货" :description="datalist.sendEndTime"></el-step>
                <el-step title="确认收货" :description="datalist.creatTime"></el-step>
                <el-step title="完成评价" :description="datalist.finishEndTime"></el-step>
            </el-steps>

            <!---->
            <div class="order-info clearFix">
                <p>
                    <i class="el-icon-warning font-15 red">当前订单状态: {{ datalist.status | getOrderStatus }}</i>
                </p>
                <div>
                    <button class="mall-btn" @click="dialogVisible = true; dialogStatus = 1; title = '修改收货人信息';">
                        修改收货人信息
                    </button>
                    <button class="mall-btn" v-if="datalist.status === 1" @click="close">关闭订单</button>
                    <button class="mall-btn" @click="dialogVisible = true; dialogStatus = 2; title = '备注订单'">备注订单
                    </button>
                </div>
            </div>

            <!---->
            <div class="table flex">
                <p class="title">基本信息</p>
                <div>
                    <div>订单id</div>
                    <div>{{ datalist.id }}</div>
                </div>
                <div>
                    <div>订单编号</div>
                    <div>{{ datalist.code }}</div>
                </div>
                <div>
                    <div>用户账号</div>
                    <div>{{ mobilePhone }}</div>
                </div>
                <div>
                    <div>支付方式</div>
                    <div>微信小程序支付</div>
                </div>
                <div>
                    <div>订单来源</div>
                    <div>小程序</div>
                </div>
                <div>
                    <div>订单类型</div>
                    <div>{{ datalist.type === 1 ? '普通类型' : '限时秒杀' }}</div>
                </div>
                <div>
                    <div>配送方式</div>
                    <div>{{ datalist.sendCompany }}</div>
                </div>
                <div>
                    <div>物流单号</div>
                    <div>{{ datalist.sendCode }}</div>
                </div>
                <div>
                    <div>自动确认收货时间</div>
                    <div>{{ datalist.finishEndTime }}</div>
                </div>
            </div>

            <!---->
            <div class="table flex">
                <p class="title">收货人信息</p>
                <div>
                    <div>收货人</div>
                    <div>{{ datalist.receiver }}</div>
                </div>
                <div>
                    <div>手机号码</div>
                    <div>{{ datalist.phone }}</div>
                </div>
                <div>
                    <div>邮政编码</div>
                    <div></div>
                </div>
                <div>
                    <div>收货地址</div>
                    <div>{{ datalist.address }}</div>
                </div>
            </div>

            <!---->
            <p class="box-title font-20">商品信息</p>
            <el-table class="mall-table" :data="datalist.details" :header-cell-style="headerStyle" :cell-style="tdStyle"
                      max-height="800">
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.goodsPic)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column label="价格/货号">
                    <template slot-scope="scope">
                        {{ scope.row.goodsPrice }}/{{ scope.row.goodsNo }}
                    </template>
                </el-table-column>
                <el-table-column label="属性" prop="goodsDesc"></el-table-column>
                <el-table-column label="数量" prop="buyNum"></el-table-column>
                <el-table-column label="品牌" prop="goodsBrand"></el-table-column>
                <el-table-column label="小计" prop="totalMoney"></el-table-column>
            </el-table>

            <!---->
            <div class="table flex">
                <p class="title">费用信息</p>
                <div>
                    <div>商品合计</div>
                    <div>{{ datalist.totalMoeny }}</div>
                </div>
                <div>
                    <div>运费</div>
                    <div>包邮</div>
                </div>
                <div>
                    <div>订单总金额</div>
                    <div>{{ datalist.totalMoeny }}</div>
                </div>
                <div>
                    <div>应付款金额</div>
                    <div>{{ datalist.totalMoeny }}</div>
                </div>
            </div>

            <!---->
            <el-dialog
                    :title="title"
                    :visible.sync="dialogVisible"
                    :append-to-body="true"
                    width="30%">
                <el-form :model="ruleForm" :rules="rules1" ref="ruleForm" label-width="100px" class="form">
                    <div v-if="dialogStatus === 1">
                        <el-form-item label="收货人姓名: " prop="receiver">
                            <el-input v-model="ruleForm.receiver"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码: " prop="phone">
                            <el-input v-model="ruleForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址: " prop="address">
                            <el-input v-model="ruleForm.address"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="dialogStatus === 2">
                        <el-form-item label="操作备注: ">
                            <el-input type="textarea" v-model="mechantRemark" :rows="5" resize="none"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from '@/components/subTitle'
    import filters from '@/utils/filters'
    import mixin from '@/utils/mixin'

    export default {
        name: "orderDetail",
        filters: filters,
        mixins: [mixin],
        components: {
            subTitle,
        },
        data() {
            return {
                datalist: {
                    id: '',
                    code: '',
                    type: 1,
                    sendCompany: '',
                    sendCode: '',
                    receiver: '',
                    phone: '',
                    address: '',
                    status: 1,
                    creatTime: '',
                    finishTime: '',
                    sendEndTime: '',
                    finishEndTime: '',
                    details: [
                        {
                            goodsPic: '',
                            goodsName: '',
                            goodsPrice: '',
                            goodsNo: '',
                            goodsDesc: '',
                            buyNum: '',
                            goodsBrand: '',
                            totalMoney: '',
                        },
                    ],
                    totalMoeny: '',
                },
                mobilePhone: '',

                //修改收货人信息dialog
                dialogVisible: false,
                dialogStatus: 1,
                title: '',
                mechantRemark: '',

                ruleForm: {
                    id: '',
                    receiver: '',
                    phone: '',
                    address: '',
                },
                rules1: {
                    receiver: [
                        {required: true, message: '请输入收货人姓名', trigger: 'blur'},
                        {max: 20, message: '长度必须小于20个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {max: 11, message: '请输入正确的手机号', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
           if (this.$route.query.id) {
               this.mobilePhone = this.$route.query.mobilePhone;
               this.getList;
           }
        },
        methods: {
            getList() {
                this.$ajax.post("merchant_order/query_By_Id", {
                    id: this.$route.query.id,
                    merchantId: JSON.parse(localStorage.userInfo).merchantId
                }).then((res) => {
                    this.datalist = res;
                    this.$set(this.ruleForm, 'receiver', res.receiver);
                    this.$set(this.ruleForm, 'phone', res.phone);
                    this.$set(this.ruleForm, 'address', res.address);
                    this.$set(this.ruleForm, 'id', res.id);
                }, (err) => {
                    this.$msgErr(err.msg);
                })
            },
            close() {
                this.$confirm("确定关闭订单嘛?").then(() => {
                    this.$ajax.post("merchant_order/update", {
                        id: this.$route.query.id,
                        status: 0
                    }).then(() => {
                        this.$msgSuc("关闭成功");
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                }, () => {
                    // console.log("取消关闭订单");
                })
            },

            /**
             *
             * @param {String}formName
             */
            submitForm(formName) {
                if (this.dialogStatus === 1) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$ajax.post("merchant_order/updateOrder", this.ruleForm).then(() => {
                                this.$msgSuc("操作成功");
                                this.dialogVisible = false;
                                this.getList();
                            }, (err) => {
                                this.$msgErr(err.msg);
                            })
                        } else {
                            return false
                        }
                    })
                } else {
                    this.$ajax.post("merchant_order/updateOrder", {
                        id: this.ruleForm.id,
                        mechantRemark: this.mechantRemark
                    }).then(() => {
                        this.$msgSuc("操作成功");
                        this.dialogVisible = false;
                        this.getList();
                    }, (err) => {
                        this.$msgErr(err.msg);
                    })
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";

    .el-steps {
        margin-bottom: 30px;
    }

    .order-info {
        background-color: #efefef;
        padding: 20px;
        border: $border;

        p {
            line-height: 38px;
        }
    }

    .table {
        margin: 30px 0;
        border: $border;

        .title {
            width: 100%;
            border-bottom: $border;
            line-height: 40px;
            font-weight: bold;
            padding-left: 20px;
            box-sizing: border-box;
            background-color: #EFEFEF;
        }

        > div {
            flex: 1;
            border-right: $border;

            &:last-child {
                border-right: none;
            }

            > div {
                line-height: 49px;
                font-size: 15px;
                text-align: center;

                &:first-child {
                    color: $gray;
                    font-weight: 700;
                    background-color: #F6F6F6;
                    border-bottom: $border;
                }
            }
        }
    }

    .form {
        width: 90%;
    }

    .dialog-footer {
        button:last-child {
            margin-right: 0;
        }
    }
</style>